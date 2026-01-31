import { Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CompartilharButtonsProps {
  protocolo: string;
  senha: string;
}

const CompartilharButtons = ({ protocolo, senha }: CompartilharButtonsProps) => {
  const { toast } = useToast();

  // Constrói a URL base correta incluindo o base path da aplicação
  const baseUrl = `${window.location.origin}${import.meta.env.BASE_URL}`;
  const textoCompartilhar = `Minha manifestação na Ouvidoria DF foi registrada!\n\nProtocolo: ${protocolo}\nSenha: ${senha}\n\nAcompanhe em: ${baseUrl}consulta`;

  const handleCompartilharNativo = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Protocolo Ouvidoria DF",
          text: textoCompartilhar,
        });
      } catch (error) {
        // User cancelled or share failed
        if ((error as Error).name !== "AbortError") {
          toast({
            title: "Erro ao compartilhar",
            description: "Não foi possível compartilhar.",
            variant: "destructive",
          });
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(textoCompartilhar);
        toast({
          title: "Copiado!",
          description: "Texto copiado para a área de transferência.",
        });
      } catch (error) {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o texto.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCompartilharWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(textoCompartilhar)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        variant="outline"
        onClick={handleCompartilharNativo}
        className="flex-1"
        aria-label="Compartilhar protocolo"
      >
        <Share2 className="w-4 h-4 mr-2" aria-hidden="true" />
        Compartilhar
      </Button>
      <Button
        variant="outline"
        onClick={handleCompartilharWhatsApp}
        className="flex-1"
        aria-label="Compartilhar via WhatsApp"
      >
        <MessageCircle className="w-4 h-4 mr-2" aria-hidden="true" />
        WhatsApp
      </Button>
    </div>
  );
};

export default CompartilharButtons;
