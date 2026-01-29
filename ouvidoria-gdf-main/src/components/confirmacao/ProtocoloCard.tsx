import { Copy, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ProtocoloCardProps {
  protocolo: string;
  senha: string;
}

const ProtocoloCard = ({ protocolo, senha }: ProtocoloCardProps) => {
  const { toast } = useToast();

  const handleCopiarProtocolo = async () => {
    try {
      await navigator.clipboard.writeText(protocolo);
      toast({
        title: "Copiado!",
        description: "Protocolo copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o protocolo.",
        variant: "destructive",
      });
    }
  };

  const handleCopiarSenha = async () => {
    try {
      await navigator.clipboard.writeText(senha);
      toast({
        title: "Copiado!",
        description: "Senha copiada para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar a senha.",
        variant: "destructive",
      });
    }
  };

  const handleCopiarTudo = async () => {
    try {
      const texto = `Protocolo: ${protocolo}\nSenha: ${senha}`;
      await navigator.clipboard.writeText(texto);
      toast({
        title: "Copiado!",
        description: "Protocolo e senha copiados para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar os dados.",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className="bg-muted p-6 rounded-lg space-y-4"
      role="status"
      aria-live="polite"
    >
      {/* Protocolo */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Seu Protocolo:</p>
        <div className="flex items-center justify-center gap-2">
          <p className="text-xl md:text-2xl font-mono font-bold text-primary">
            {protocolo}
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopiarProtocolo}
            aria-label={`Copiar protocolo ${protocolo}`}
            className="h-8 w-8"
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Senha */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
          <Key className="h-3 w-3" aria-hidden="true" />
          Senha de Acompanhamento:
        </p>
        <div className="flex items-center justify-center gap-2">
          <p className="text-xl md:text-2xl font-mono font-bold tracking-widest text-primary">
            {senha}
          </p>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopiarSenha}
            aria-label={`Copiar senha ${senha}`}
            className="h-8 w-8"
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Copiar tudo */}
      <Button 
        onClick={handleCopiarTudo}
        variant="outline"
        className="w-full mt-4"
      >
        <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
        Copiar Protocolo e Senha
      </Button>
    </div>
  );
};

export default ProtocoloCard;
