import { Badge } from "@/components/ui/badge";
import { Clock, Search, Send, MessageCircle, CheckCircle2, Archive } from "lucide-react";

export type StatusManifestacao =
  | "registrado"
  | "em_analise"
  | "encaminhado"
  | "respondido"
  | "concluido"
  | "arquivado";

interface StatusBadgeProps {
  status: StatusManifestacao;
  size?: "sm" | "default";
}

const STATUS_CONFIG: Record<
  StatusManifestacao,
  {
    label: string;
    icon: typeof Clock;
    variant: "default" | "secondary" | "outline" | "destructive";
    className: string;
  }
> = {
  registrado: {
    label: "Registrado",
    icon: Clock,
    variant: "outline",
    className: "border-muted-foreground/50 text-muted-foreground",
  },
  em_analise: {
    label: "Em Análise",
    icon: Search,
    variant: "default",
    className: "bg-accent text-accent-foreground",
  },
  encaminhado: {
    label: "Encaminhado",
    icon: Send,
    variant: "default",
    className: "bg-primary text-primary-foreground",
  },
  respondido: {
    label: "Respondido",
    icon: MessageCircle,
    variant: "default",
    className: "bg-secondary text-secondary-foreground",
  },
  concluido: {
    label: "Concluído",
    icon: CheckCircle2,
    variant: "default",
    className: "bg-secondary text-secondary-foreground",
  },
  arquivado: {
    label: "Arquivado",
    icon: Archive,
    variant: "outline",
    className: "border-muted-foreground/30 text-muted-foreground",
  },
};

export function StatusBadge({ status, size = "default" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.registrado;
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${size === "sm" ? "text-xs px-2 py-0.5" : "px-3 py-1"} gap-1.5`}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} aria-hidden="true" />
      <span>{config.label}</span>
    </Badge>
  );
}

export function getStatusLabel(status: StatusManifestacao): string {
  return STATUS_CONFIG[status]?.label || status;
}
