import { StatusStep } from "./StatusStep";
import type { StatusManifestacao } from "../dashboard/StatusBadge";

interface HistoricoItem {
  id: string;
  status: StatusManifestacao;
  descricao: string | null;
  orgao_responsavel: string | null;
  created_at: string;
}

interface TimelineProps {
  historico: HistoricoItem[];
}

export function Timeline({ historico }: TimelineProps) {
  if (historico.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">Nenhum histórico disponível.</div>
    );
  }

  // Ordenar do mais recente para o mais antigo
  const sortedHistorico = [...historico].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="flow-root" role="region" aria-label="Histórico de acompanhamento">
      <ul role="list" className="relative" aria-label="Timeline de status da manifestação">
        {sortedHistorico.map((item, index) => (
          <StatusStep
            key={item.id}
            status={item.status}
            descricao={item.descricao}
            orgaoResponsavel={item.orgao_responsavel}
            createdAt={item.created_at}
            isLast={index === sortedHistorico.length - 1}
            isCurrent={index === 0}
          />
        ))}
      </ul>
    </div>
  );
}
