import { CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { StatusManifestacao } from "../dashboard/StatusBadge";
import { getStatusLabel } from "../dashboard/StatusBadge";

interface StatusStepProps {
  status: StatusManifestacao;
  descricao?: string | null;
  orgaoResponsavel?: string | null;
  createdAt: string;
  isLast: boolean;
  isCurrent: boolean;
}

export function StatusStep({
  status,
  descricao,
  orgaoResponsavel,
  createdAt,
  isLast,
  isCurrent,
}: StatusStepProps) {
  const dataFormatada = format(new Date(createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  const statusLabel = getStatusLabel(status);

  return (
    <li className="relative pb-8 last:pb-0">
      {/* Vertical line connecting steps */}
      {!isLast && (
        <div 
          className="absolute left-4 top-8 -ml-px h-full w-0.5 bg-border"
          aria-hidden="true"
        />
      )}
      
      <div className="relative flex items-start gap-4">
        {/* Status indicator */}
        <div 
          className={`
            flex h-8 w-8 shrink-0 items-center justify-center rounded-full 
            ${isCurrent 
              ? "bg-primary text-primary-foreground ring-4 ring-primary/20" 
              : "bg-muted text-muted-foreground"
            }
          `}
          aria-hidden="true"
        >
          <CheckCircle2 className="h-4 w-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <span 
              className={`font-semibold ${isCurrent ? "text-primary" : "text-foreground"}`}
            >
              {statusLabel}
            </span>
            <span className="text-xs text-muted-foreground">
              {dataFormatada}
            </span>
          </div>
          
          {descricao && (
            <p className="mt-1 text-sm text-muted-foreground">
              {descricao}
            </p>
          )}
          
          {orgaoResponsavel && (
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="font-medium">Órgão:</span> {orgaoResponsavel}
            </p>
          )}
        </div>
      </div>
    </li>
  );
}
