import { useState, useEffect } from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

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
    window.location.reload();
  };

  if (!isOffline) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground p-4 shadow-lg"
      role="alert"
      aria-live="assertive"
    >
      <div className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-destructive-foreground/20 flex items-center justify-center shrink-0">
              <WifiOff className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Você está offline</p>
              <p className="text-sm text-destructive-foreground/90">
                Conecte-se à internet para enviar manifestações
              </p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleRetry}
            className="shrink-0"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
