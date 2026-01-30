import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

// IndexedDB database for offline queue
const DB_NAME = "participa_df_offline";
const DB_VERSION = 1;
const STORE_NAME = "manifestacoes_pendentes";

interface PendingManifestacao {
  id: string;
  data: Record<string, unknown>;
  createdAt: number;
  retryCount: number;
}

let db: IDBDatabase | null = null;

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

export function useOfflineQueue() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Load pending count on mount
  useEffect(() => {
    const loadPendingCount = async () => {
      try {
        const database = await openDatabase();
        const transaction = database.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const countRequest = store.count();

        countRequest.onsuccess = () => {
          setPendingCount(countRequest.result);
        };
      } catch (error) {
        console.error("Error loading pending count:", error);
      }
    };

    loadPendingCount();
  }, []);

  // Online/Offline detection
  // Note: syncPendingManifestacoes is not in dependencies to avoid circular dependency.
  // The function is stable and doesn't change between renders.
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger sync when coming back online
      syncPendingManifestacoes();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add manifestação to offline queue
  const addToQueue = useCallback(async (data: Record<string, unknown>): Promise<string> => {
    try {
      const database = await openDatabase();
      const id = `offline_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const pendingItem: PendingManifestacao = {
        id,
        data,
        createdAt: Date.now(),
        retryCount: 0,
      };

      return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(pendingItem);

        request.onsuccess = () => {
          setPendingCount((prev) => prev + 1);
          toast({
            title: "Manifestação salva offline",
            description: "Será enviada automaticamente quando a conexão for restabelecida.",
            variant: "default",
          });
          resolve(id);
        };

        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error adding to queue:", error);
      throw error;
    }
  }, []);

  // Remove from queue after successful sync
  const removeFromQueue = useCallback(async (id: string): Promise<void> => {
    try {
      const database = await openDatabase();

      return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => {
          setPendingCount((prev) => Math.max(0, prev - 1));
          resolve();
        };

        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error removing from queue:", error);
      throw error;
    }
  }, []);

  // Get all pending items
  const getPendingItems = useCallback(async (): Promise<PendingManifestacao[]> => {
    try {
      const database = await openDatabase();

      return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error getting pending items:", error);
      return [];
    }
  }, []);

  // Sync pending manifestações when online
  const syncPendingManifestacoes = useCallback(async (): Promise<void> => {
    if (!navigator.onLine || isSyncing) return;

    setIsSyncing(true);

    try {
      const pendingItems = await getPendingItems();

      if (pendingItems.length === 0) {
        setIsSyncing(false);
        return;
      }

      toast({
        title: "Sincronizando...",
        description: `Enviando ${pendingItems.length} manifestação(ões) pendente(s).`,
      });

      let successCount = 0;
      let failCount = 0;

      for (const item of pendingItems) {
        try {
          // Import supabase dynamically to avoid circular dependencies
          const { supabase } = await import("@/integrations/supabase/client");

          const { error } = await supabase
            .from("manifestacoes")
            .insert(item.data as Record<string, unknown>);

          if (error) throw error;

          await removeFromQueue(item.id);
          successCount++;
        } catch (error) {
          console.error(`Error syncing item ${item.id}:`, error);
          failCount++;

          // Update retry count
          try {
            const database = await openDatabase();
            const transaction = database.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            store.put({ ...item, retryCount: item.retryCount + 1 });
          } catch (updateError) {
            console.error("Error updating retry count:", updateError);
          }
        }
      }

      if (successCount > 0) {
        toast({
          title: "Sincronização concluída!",
          description: `${successCount} manifestação(ões) enviada(s) com sucesso.`,
          variant: "default",
        });
      }

      if (failCount > 0) {
        toast({
          title: "Algumas manifestações falharam",
          description: `${failCount} manifestação(ões) serão reenviadas posteriormente.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during sync:", error);
    } finally {
      setIsSyncing(false);
    }
  }, [getPendingItems, removeFromQueue, isSyncing]);

  // Clear all pending items
  const clearQueue = useCallback(async (): Promise<void> => {
    try {
      const database = await openDatabase();

      return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.clear();

        request.onsuccess = () => {
          setPendingCount(0);
          resolve();
        };

        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error("Error clearing queue:", error);
      throw error;
    }
  }, []);

  return {
    pendingCount,
    isSyncing,
    isOnline,
    addToQueue,
    removeFromQueue,
    getPendingItems,
    syncPendingManifestacoes,
    clearQueue,
  };
}
