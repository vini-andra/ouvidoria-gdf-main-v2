import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Search, Loader2 } from "lucide-react";
import QRCodeDisplay from "@/components/confirmacao/QRCodeDisplay";
import ProtocoloCard from "@/components/confirmacao/ProtocoloCard";
import CompartilharButtons from "@/components/confirmacao/CompartilharButtons";

interface Step7ProtocoloProps {
  protocolo: string | null;
  senha: string | null;
  isSubmitting: boolean;
  onSubmit: () => void;
  isSubmitted: boolean;
}

export function Step7Protocolo({
  protocolo,
  senha,
  isSubmitting,
  onSubmit,
  isSubmitted,
}: Step7ProtocoloProps) {
  // Estado: Aguardando envio
  if (!isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div
          className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
          aria-hidden="true"
        >
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Pronto para enviar!</h3>
          <p className="text-muted-foreground">
            Revise suas informações nas etapas anteriores. Ao confirmar, sua manifestação será
            registrada e você receberá um protocolo para acompanhamento.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p>
            <strong>Importante:</strong> Após o envio, você receberá um número de protocolo e uma
            senha. Guarde essas informações para acompanhar o andamento da sua manifestação.
          </p>
        </div>

        <Button
          onClick={onSubmit}
          disabled={isSubmitting}
          size="lg"
          className="w-full"
          aria-label="Confirmar e enviar manifestação"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
              Enviando manifestação...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" aria-hidden="true" />
              Confirmar e Enviar
            </>
          )}
        </Button>
      </div>
    );
  }

  // Estado: Manifestação enviada com sucesso
  return (
    <div className="space-y-6 text-center">
      {/* Ícone de sucesso com animação scale-in */}
      <div
        className="w-20 h-20 mx-auto rounded-full bg-success/10 flex items-center justify-center scale-in"
        aria-hidden="true"
      >
        <CheckCircle className="w-12 h-12 text-success animate-bounce" />
      </div>

      {/* Título e descrição com fade-in */}
      <div className="space-y-2 fade-in-up">
        <h3 className="text-2xl font-semibold text-success">Manifestação Registrada!</h3>
        <p className="text-muted-foreground">
          Sua manifestação foi enviada com sucesso. Guarde as informações abaixo para
          acompanhamento.
        </p>
      </div>

      {/* Protocolo e Senha com animação escalonada */}
      {protocolo && senha && (
        <>
          <div className="fade-in-up-delay-1">
            <ProtocoloCard protocolo={protocolo} senha={senha} />
          </div>
          <div className="fade-in-up-delay-2">
            <QRCodeDisplay protocolo={protocolo} senha={senha} />
          </div>
          <div className="fade-in-up-delay-3">
            <CompartilharButtons protocolo={protocolo} senha={senha} />
          </div>
        </>
      )}

      {/* CTAs com animação de entrada */}
      <div className="flex flex-col gap-3 pt-4 border-t fade-in-up-delay-3">
        <Button asChild className="w-full pulse-success">
          <Link to={`/consulta?protocolo=${encodeURIComponent(protocolo || "")}`}>
            <Search className="w-4 h-4 mr-2" aria-hidden="true" />
            Acompanhar Manifestação
          </Link>
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Voltar ao Início
          </Link>
        </Button>
      </div>
    </div>
  );
}

