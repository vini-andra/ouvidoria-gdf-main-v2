import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  Smartphone, 
  Share, 
  MoreVertical, 
  PlusSquare,
  CheckCircle,
  ArrowRight,
  Apple,
  Chrome
} from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop" | "unknown">("unknown");
  const { toast } = useToast();

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    if (isIOS) {
      setPlatform("ios");
    } else if (isAndroid) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      toast({
        title: "App instalado!",
        description: "O Participa DF foi adicionado à sua tela inicial.",
      });
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Instalação não disponível",
        description: "Siga as instruções manuais abaixo para instalar o app.",
        variant: "destructive",
      });
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const IOSInstructions = () => (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Apple className="w-6 h-6 text-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg">iPhone / iPad</CardTitle>
            <CardDescription>Instruções para iOS</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
            1
          </div>
          <div>
            <p className="font-medium">Abra no Safari</p>
            <p className="text-sm text-muted-foreground">
              O app precisa ser instalado pelo navegador Safari
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
            2
          </div>
          <div className="flex-1">
            <p className="font-medium flex items-center gap-2">
              Toque em Compartilhar
              <Share className="w-5 h-5 text-primary" />
            </p>
            <p className="text-sm text-muted-foreground">
              Na barra inferior do Safari
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
            3
          </div>
          <div className="flex-1">
            <p className="font-medium flex items-center gap-2">
              Adicionar à Tela de Início
              <PlusSquare className="w-5 h-5 text-primary" />
            </p>
            <p className="text-sm text-muted-foreground">
              Role para baixo e selecione esta opção
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4 p-4 bg-secondary/10 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold shrink-0">
            4
          </div>
          <div>
            <p className="font-medium">Confirme a instalação</p>
            <p className="text-sm text-muted-foreground">
              Toque em "Adicionar" no canto superior direito
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AndroidInstructions = () => (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
            <Smartphone className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <CardTitle className="text-lg">Android</CardTitle>
            <CardDescription>Instruções para Android</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {deferredPrompt ? (
          <div className="text-center py-4">
            <Button 
              size="lg" 
              onClick={handleInstallClick}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <Download className="w-5 h-5 mr-2" />
              Instalar Agora
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Clique para instalar diretamente
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                1
              </div>
              <div className="flex-1">
                <p className="font-medium flex items-center gap-2">
                  Abra o menu do navegador
                  <MoreVertical className="w-5 h-5 text-secondary" />
                </p>
                <p className="text-sm text-muted-foreground">
                  Toque nos três pontos no canto superior direito
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                2
              </div>
              <div className="flex-1">
                <p className="font-medium flex items-center gap-2">
                  Instalar aplicativo
                  <Download className="w-5 h-5 text-secondary" />
                </p>
                <p className="text-sm text-muted-foreground">
                  Ou "Adicionar à tela inicial"
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-secondary/10 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">Confirme a instalação</p>
                <p className="text-sm text-muted-foreground">
                  Toque em "Instalar" na janela que aparecer
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const DesktopInstructions = () => (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Chrome className="w-6 h-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Computador</CardTitle>
            <CardDescription>Chrome, Edge ou outros navegadores</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {deferredPrompt ? (
          <div className="text-center py-4">
            <Button 
              size="lg" 
              onClick={handleInstallClick}
              className="w-full"
            >
              <Download className="w-5 h-5 mr-2" />
              Instalar Aplicativo
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              Clique para instalar diretamente
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">Procure o ícone de instalação</p>
                <p className="text-sm text-muted-foreground">
                  Na barra de endereços do navegador (lado direito)
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-primary/5 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">Clique em "Instalar"</p>
                <p className="text-sm text-muted-foreground">
                  O app será adicionado ao seu sistema
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  if (isInstalled) {
    return (
      <Layout>
        <div className="container py-12 md:py-20">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              App Já Instalado!
            </h1>
            <p className="text-muted-foreground mb-8">
              O Participa DF já está instalado no seu dispositivo. Você pode acessá-lo diretamente pela tela inicial.
            </p>
            <Button asChild size="lg">
              <a href="/">
                Voltar para o Início
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-primary/90 py-12 md:py-16">
        <div className="container text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Download className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-3">
            Instale o Participa DF
          </h1>
          <p className="text-primary-foreground/90 max-w-lg mx-auto">
            Tenha acesso rápido ao sistema de ouvidoria direto da sua tela inicial, sem precisar abrir o navegador.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-8 bg-muted/50 border-b">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Smartphone, text: "Acesso rápido pela tela inicial" },
              { icon: Download, text: "Funciona mesmo offline" },
              { icon: CheckCircle, text: "Experiência de app nativo" },
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-3 justify-center">
                <benefit.icon className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="py-10 md:py-16">
        <div className="container">
          <div className="max-w-xl mx-auto space-y-6">
            {/* Show relevant instructions based on platform */}
            {platform === "ios" && <IOSInstructions />}
            {platform === "android" && <AndroidInstructions />}
            {platform === "desktop" && <DesktopInstructions />}
            
            {/* Show all instructions on desktop or if platform unknown */}
            {(platform === "desktop" || platform === "unknown") && (
              <>
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    Instruções para dispositivos móveis
                  </p>
                </div>
                <IOSInstructions />
                <AndroidInstructions />
              </>
            )}
            
            {/* Show desktop instructions on mobile */}
            {(platform === "ios" || platform === "android") && (
              <>
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    Usando um computador?
                  </p>
                </div>
                <DesktopInstructions />
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Install;
