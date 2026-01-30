import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";

interface QRCodeDisplayProps {
  protocolo: string;
  senha: string;
  className?: string;
}

const QRCodeDisplay = ({ protocolo, senha, className }: QRCodeDisplayProps) => {
  // Create URL for tracking - only includes protocol for security
  const baseUrl = window.location.origin;
  const trackingUrl = `${baseUrl}/consulta?protocolo=${encodeURIComponent(protocolo)}`;

  return (
    <div
      className={cn("text-center space-y-3", className)}
      role="region"
      aria-labelledby="qrcode-title"
    >
      <h3 id="qrcode-title" className="text-base font-semibold">
        Acesso Rápido via QR Code
      </h3>

      {/* QR Code with proper accessibility */}
      <div className="flex justify-center p-4 bg-white rounded-lg shadow-sm inline-block mx-auto">
        <QRCodeSVG
          value={trackingUrl}
          size={160}
          level="M"
          includeMargin={false}
          aria-label={`QR Code para consulta do protocolo ${protocolo}`}
          role="img"
        />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          Escaneie para preencher o protocolo automaticamente
        </p>
        <p className="text-sm text-muted-foreground">
          Você ainda precisará digitar sua senha para acessar
        </p>
      </div>

      {/* Step-by-step instructions for accessibility */}
      <details className="text-left max-w-md mx-auto">
        <summary className="text-sm font-medium cursor-pointer hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-2 py-1">
          Como usar o QR Code?
        </summary>
        <ol className="mt-2 space-y-1 text-sm text-muted-foreground list-decimal list-inside">
          <li>Abra a câmera do seu celular</li>
          <li>Aponte para o QR Code acima</li>
          <li>Toque no link que aparecer</li>
          <li>Digite sua senha de 6 caracteres</li>
          <li>Consulte sua manifestação</li>
        </ol>
      </details>
    </div>
  );
};

export default QRCodeDisplay;
