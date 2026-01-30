import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ManifestacaoCard } from "./ManifestacaoCard";
import { FileX, Plus } from "lucide-react";
import type { StatusManifestacao } from "./StatusBadge";

interface Manifestacao {
  id: string;
  protocolo: string;
  tipo: "texto" | "audio" | "imagem" | "video";
  categoria_tipo: string | null;
  status: StatusManifestacao;
  created_at: string;
}

interface ManifestacaoListProps {
  userId: string;
}

export function ManifestacaoList({ userId }: ManifestacaoListProps) {
  const [manifestacoes, setManifestacoes] = useState<Manifestacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchManifestacoes() {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("manifestacoes")
        .select("id, protocolo, tipo, categoria_tipo, status, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (fetchError) {
        console.error("Error fetching manifestacoes:", fetchError);
        setError("Erro ao carregar manifestações");
      } else {
        setManifestacoes((data as Manifestacao[]) || []);
      }
      setLoading(false);
    }

    if (userId) {
      fetchManifestacoes();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label="Carregando manifestações">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-lg border bg-card animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start gap-4">
              {/* Icon skeleton */}
              <div className="h-10 w-10 rounded-full shimmer shrink-0" />
              {/* Content skeleton */}
              <div className="flex-1 space-y-2">
                <div className="h-4 shimmer rounded w-3/4" />
                <div className="h-3 shimmer rounded w-1/2" />
                <div className="flex gap-2 mt-3">
                  <div className="h-5 shimmer rounded w-16" />
                  <div className="h-5 shimmer rounded w-20" />
                </div>
              </div>
              {/* Status badge skeleton */}
              <div className="h-6 shimmer rounded-full w-24 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (manifestacoes.length === 0) {
    return (
      <div
        className="text-center py-12 space-y-4 fade-in-up"
        role="status"
        aria-label="Nenhuma manifestação encontrada"
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <FileX className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground text-lg font-medium">
            Você ainda não possui manifestações registradas.
          </p>
          <p className="text-sm text-muted-foreground">
            Que tal fazer sua voz ser ouvida? Registre sua primeira manifestação agora.
          </p>
        </div>
        <a
          href="/manifestacao"
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors pulse-success"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nova Manifestação
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-3" role="list" aria-label="Lista de manifestações">
      {manifestacoes.map((m) => (
        <div key={m.id} role="listitem">
          <ManifestacaoCard
            id={m.id}
            protocolo={m.protocolo}
            tipo={m.tipo}
            categoriaTipo={m.categoria_tipo}
            status={m.status}
            createdAt={m.created_at}
          />
        </div>
      ))}
    </div>
  );
}
