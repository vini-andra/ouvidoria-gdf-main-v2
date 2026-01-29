import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ManifestacaoCard } from "./ManifestacaoCard";
import { Skeleton } from "@/components/ui/skeleton";
import { FileX } from "lucide-react";
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
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
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
        className="text-center py-12 space-y-3"
        role="status"
        aria-label="Nenhuma manifestação encontrada"
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <FileX className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="text-muted-foreground text-lg">
          Você ainda não possui manifestações registradas.
        </p>
        <p className="text-sm text-muted-foreground">
          Clique em "Nova Manifestação" para começar.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="space-y-3"
      role="list"
      aria-label="Lista de manifestações"
    >
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
