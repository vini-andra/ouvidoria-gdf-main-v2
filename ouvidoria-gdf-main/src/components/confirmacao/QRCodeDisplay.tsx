import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface QRCodeDisplayProps {
  protocolo: string;
  senha: string;
  className?: string;
}

const QRCodeDisplay = ({ protocolo, senha, className }: QRCodeDisplayProps) => {
  // Create URL for tracking the manifestation
  const baseUrl = window.location.origin;
  const trackingUrl = `${baseUrl}/consulta?protocolo=${encodeURIComponent(protocolo)}&senha=${encodeURIComponent(senha)}`;

  return (
    <div 
      className={cn("flex flex-col items-center gap-3", className)}
      aria-label="QR Code para acompanhamento"
    >
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <QRCodeSVG
          value={trackingUrl}
          size={160}
          level="M"
          includeMargin={false}
          aria-label={`QR Code com link de acompanhamento para o protocolo ${protocolo}`}
        />
      </div>
      <p className="text-xs text-muted-foreground text-center max-w-[200px]">
        Escaneie o QR Code para acessar o acompanhamento diretamente
      </p>
    </div>
  );
};

export default QRCodeDisplay;
