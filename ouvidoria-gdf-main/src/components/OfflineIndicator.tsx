import { useState, useEffect } from "react";
import { WifiOff, RefreshCw, CloudUpload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOfflineQueue } from "@/hooks/useOfflineQueue";

const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { pendingCount, isSyncing, syncPendingManifestacoes } = useOfflineQueue();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (pendingCount > 0) {
      syncPendingManifestacoes();
    } else {
      window.location.reload();
    }
  };

  // Show indicator if offline OR if there are pending manifestações
  if (!isOffline && pendingCount === 0) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 shadow-lg ${
        isOffline ? "bg-destructive text-destructive-foreground" : "bg-yellow-500 text-yellow-950"
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isOffline ? "bg-destructive-foreground/20" : "bg-yellow-950/20"
              }`}
            >
              {isOffline ? <WifiOff className="w-5 h-5" /> : <CloudUpload className="w-5 h-5" />}
            </div>
            <div>
              {isOffline ? (
                <>
                  <p className="font-semibold">Você está offline</p>
                  <p className="text-sm opacity-90">
                    {pendingCount > 0
                      ? `${pendingCount} manifestação(ões) pendente(s) serão enviadas quando conectar.`
                      : "Conecte-se à internet para enviar manifestações."}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold">Sincronizando manifestações</p>
                  <p className="text-sm opacity-90">
                    {pendingCount} manifestação(ões) pendente(s) aguardando envio.
                  </p>
                </>
              )}
            </div>
          </div>
          <Button
            variant={isOffline ? "secondary" : "outline"}
            size="sm"
            onClick={handleRetry}
            disabled={isSyncing}
            className="shrink-0"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sincronizando...
              </>
            ) : pendingCount > 0 ? (
              <>
                <CloudUpload className="w-4 h-4 mr-2" />
                Sincronizar agora
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar novamente
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
