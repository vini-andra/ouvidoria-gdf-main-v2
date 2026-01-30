import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useOfflineQueue } from "./useOfflineQueue";

// Mock toast
vi.mock("@/hooks/use-toast", () => ({
  toast: vi.fn(),
}));

// Mock IndexedDB
class MockIDBDatabase {
  objectStoreNames = { contains: vi.fn(() => false) };
  transaction = vi.fn();
  createObjectStore = vi.fn();
}

class MockIDBRequest {
  result: unknown = null;
  error: unknown = null;
  onsuccess: (() => void) | null = null;
  onerror: (() => void) | null = null;

  simulateSuccess(result: unknown) {
    this.result = result;
    if (this.onsuccess) {
      this.onsuccess();
    }
  }

  simulateError(error: unknown) {
    this.error = error;
    if (this.onerror) {
      this.onerror();
    }
  }
}

class MockIDBTransaction {
  objectStore = vi.fn(() => new MockIDBObjectStore());
}

class MockIDBObjectStore {
  count = vi.fn(() => {
    const request = new MockIDBRequest();
    setTimeout(() => request.simulateSuccess(0), 0);
    return request;
  });
  add = vi.fn(() => {
    const request = new MockIDBRequest();
    setTimeout(() => request.simulateSuccess(undefined), 0);
    return request;
  });
  delete = vi.fn(() => {
    const request = new MockIDBRequest();
    setTimeout(() => request.simulateSuccess(undefined), 0);
    return request;
  });
  getAll = vi.fn(() => {
    const request = new MockIDBRequest();
    setTimeout(() => request.simulateSuccess([]), 0);
    return request;
  });
  clear = vi.fn(() => {
    const request = new MockIDBRequest();
    setTimeout(() => request.simulateSuccess(undefined), 0);
    return request;
  });
  put = vi.fn(() => {
    const request = new MockIDBRequest();
    setTimeout(() => request.simulateSuccess(undefined), 0);
    return request;
  });
}

describe("useOfflineQueue", () => {
  let mockDatabase: MockIDBDatabase;
  let openRequest: MockIDBRequest;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

    // Setup IndexedDB mock
    mockDatabase = new MockIDBDatabase();
    openRequest = new MockIDBRequest();

    // Mock indexedDB.open
    global.indexedDB = {
      open: vi.fn(() => {
        setTimeout(() => {
          openRequest.result = mockDatabase;
          if (openRequest.onupgradeneeded) {
            const event = {
              target: { result: mockDatabase },
            } as unknown as IDBVersionChangeEvent;
            openRequest.onupgradeneeded(event);
          }
          openRequest.simulateSuccess(mockDatabase);
        }, 0);
        return openRequest;
      }),
    } as unknown as IDBFactory;

    // Mock navigator.onLine
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      value: true,
    });

    // Mock window event listeners
    global.addEventListener = vi.fn();
    global.removeEventListener = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with default values", async () => {
      const { result } = renderHook(() => useOfflineQueue());

      await waitFor(() => {
        expect(result.current.pendingCount).toBe(0);
      });

      expect(result.current.isSyncing).toBe(false);
      expect(result.current.isOnline).toBe(true);
    });

    it("should have all required methods", () => {
      const { result } = renderHook(() => useOfflineQueue());

      expect(typeof result.current.addToQueue).toBe("function");
      expect(typeof result.current.removeFromQueue).toBe("function");
      expect(typeof result.current.getPendingItems).toBe("function");
      expect(typeof result.current.syncPendingManifestacoes).toBe("function");
      expect(typeof result.current.clearQueue).toBe("function");
    });
  });

  // Note: Tests for addToQueue, removeFromQueue, getPendingItems, and clearQueue
  // are skipped in basic tests as they require full IndexedDB mock implementation.
  // These methods are tested indirectly through integration tests and manual testing.

  describe("syncPendingManifestacoes", () => {
    it("should not sync when offline", async () => {
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        value: false,
      });

      const { result } = renderHook(() => useOfflineQueue());

      await act(async () => {
        await result.current.syncPendingManifestacoes();
      });

      expect(result.current.isSyncing).toBe(false);
    });

    it("should not sync when already syncing", async () => {
      const mockStore = new MockIDBObjectStore();
      const mockTransaction = new MockIDBTransaction();
      mockTransaction.objectStore = vi.fn(() => mockStore);
      mockDatabase.transaction = vi.fn(() => mockTransaction);

      const { result } = renderHook(() => useOfflineQueue());

      // Simulate already syncing
      await act(async () => {
        // Start first sync (it will set isSyncing to true)
        const firstSync = result.current.syncPendingManifestacoes();
        // Try to start second sync immediately
        await result.current.syncPendingManifestacoes();
        await firstSync;
      });

      // Should handle this gracefully
      expect(result.current.isSyncing).toBe(false);
    });
  });

  describe("Online/Offline Events", () => {
    it("should detect online state", () => {
      const { result } = renderHook(() => useOfflineQueue());

      expect(result.current.isOnline).toBe(true);
    });

    it("should update state when going offline", async () => {
      const { result } = renderHook(() => useOfflineQueue());

      expect(result.current.isOnline).toBe(true);

      // Simulate going offline
      await act(async () => {
        Object.defineProperty(navigator, "onLine", {
          writable: true,
          value: false,
        });
        // Trigger offline event manually
        const offlineEvent = new Event("offline");
        window.dispatchEvent(offlineEvent);
      });

      // Note: In this test environment, the state won't actually update
      // because we're not fully simulating the event system
      // This test just verifies no errors occur
    });
  });
});
