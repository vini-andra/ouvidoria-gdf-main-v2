import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, type StatusManifestacao } from "./StatusBadge";
import { FileText, Mic, ImageIcon, Video, ChevronRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ManifestacaoCardProps {
  id: string;
  protocolo: string;
  tipo: "texto" | "audio" | "imagem" | "video";
  categoriaTipo?: string | null;
  status: StatusManifestacao;
  createdAt: string;
}

const TIPO_ICONS = {
  texto: FileText,
  audio: Mic,
  imagem: ImageIcon,
  video: Video,
};

const CATEGORIA_LABELS: Record<string, string> = {
  reclamacao: "Reclamação",
  denuncia: "Denúncia",
  sugestao: "Sugestão",
  elogio: "Elogio",
  solicitacao: "Solicitação",
  informacao: "Informação",
};

export function ManifestacaoCard({
  id,
  protocolo,
  tipo,
  categoriaTipo,
  status,
  createdAt,
}: ManifestacaoCardProps) {
  const TipoIcon = TIPO_ICONS[tipo] || FileText;
  const categoriaLabel = categoriaTipo ? CATEGORIA_LABELS[categoriaTipo] : null;
  const dataFormatada = format(new Date(createdAt), "dd/MM/yyyy", { locale: ptBR });

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {/* Mobile layout: vertical stack */}
        <div className="sm:hidden space-y-3">
          {/* Header row: Icon + Protocol */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0" aria-hidden="true">
              <TipoIcon className="h-5 w-5" />
            </div>
            <p className="font-semibold text-base break-all">{protocolo}</p>
          </div>

          {/* Info row: Category + Date + Status */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {categoriaLabel && (
                <span className="font-medium">{categoriaLabel}</span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                {dataFormatada}
              </span>
            </div>
            <StatusBadge status={status} size="sm" />
          </div>

          {/* Action button */}
          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full"
            aria-label={`Ver detalhes da manifestação ${protocolo}`}
          >
            <Link to={`/acompanhamento/${protocolo}`}>
              Ver detalhes
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>

        {/* Desktop layout: horizontal (unchanged) */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          {/* Left side: Icon + Protocol + Category */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0" aria-hidden="true">
              <TipoIcon className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-semibold text-base truncate">{protocolo}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {categoriaLabel && (
                  <>
                    <span>{categoriaLabel}</span>
                    <span aria-hidden="true">•</span>
                  </>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" aria-hidden="true" />
                  {dataFormatada}
                </span>
              </div>
            </div>
          </div>

          {/* Right side: Status + Action */}
          <div className="flex items-center gap-3 shrink-0">
            <StatusBadge status={status} size="sm" />

            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label={`Ver detalhes da manifestação ${protocolo}`}
            >
              <Link to={`/acompanhamento/${protocolo}`}>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
