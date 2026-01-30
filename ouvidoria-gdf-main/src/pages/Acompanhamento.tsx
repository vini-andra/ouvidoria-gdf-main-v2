import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Timeline } from "@/components/acompanhamento/Timeline";
import { RespostaCard } from "@/components/acompanhamento/RespostaCard";
import { StatusBadge, type StatusManifestacao } from "@/components/dashboard/StatusBadge";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  FileText,
  Mic,
  ImageIcon,
  Video,
  AlertCircle,
  Calendar,
  Building2,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Manifestacao {
  id: string;
  protocolo: string;
  tipo: "texto" | "audio" | "imagem" | "video";
  conteudo: string | null;
  arquivo_url: string | null;
  categoria_tipo: string | null;
  status: StatusManifestacao;
  created_at: string;
  orgaos?: { nome: string; sigla: string } | null;
}

interface Historico {
  id: string;
  status: StatusManifestacao;
  descricao: string | null;
  orgao_responsavel: string | null;
  created_at: string;
}

interface Resposta {
  id: string;
  conteudo: string;
  autor: string | null;
  created_at: string;
}

interface Anexo {
  id: string;
  tipo: 'audio' | 'imagem' | 'video';
  arquivo_url: string;
  nome_arquivo: string | null;
  tamanho_bytes: number | null;
  created_at: string;
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

const Acompanhamento = () => {
  const { protocolo } = useParams<{ protocolo: string }>();
  const [manifestacao, setManifestacao] = useState<Manifestacao | null>(null);
  const [historico, setHistorico] = useState<Historico[]>([]);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [anexos, setAnexos] = useState<Anexo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!protocolo) return;

      setLoading(true);
      setError(null);

      // Buscar manifestação
      const { data: manifestacaoData, error: manifestacaoError } = await supabase
        .from("manifestacoes")
        .select(
          `
          id, protocolo, tipo, conteudo, arquivo_url, categoria_tipo, status, created_at,
          orgaos (nome, sigla)
        `
        )
        .eq("protocolo", protocolo)
        .maybeSingle();

      if (manifestacaoError) {
        console.error("Error fetching manifestacao:", manifestacaoError);
        setError("Erro ao carregar manifestação");
        setLoading(false);
        return;
      }

      if (!manifestacaoData) {
        setError("Manifestação não encontrada");
        setLoading(false);
        return;
      }

      setManifestacao(manifestacaoData as Manifestacao);

      // Buscar histórico e respostas em paralelo
      const [historicoResult, respostasResult] = await Promise.all([
        supabase
          .from("manifestacao_historico")
          .select("id, status, descricao, orgao_responsavel, created_at")
          .eq("manifestacao_id", manifestacaoData.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("manifestacao_respostas")
          .select("id, conteudo, autor, created_at")
          .eq("manifestacao_id", manifestacaoData.id)
          .eq("tipo", "oficial")
          .order("created_at", { ascending: false }),
      ]);

      if (!historicoResult.error) {
        setHistorico((historicoResult.data as Historico[]) || []);
      }

      if (!respostasResult.error) {
        setRespostas((respostasResult.data as Resposta[]) || []);
      }

      // Buscar anexos
      const { data: anexosData } = await supabase
        .from("manifestacao_anexos" as any)
        .select("id, tipo, arquivo_url, nome_arquivo, tamanho_bytes, created_at")
        .eq("manifestacao_id", manifestacaoData.id)
        .order("created_at", { ascending: true });

      if (anexosData) {
        setAnexos(anexosData as unknown as Anexo[]);
      }

      setLoading(false);
    }

    fetchData();
  }, [protocolo]);

  const TipoIcon = manifestacao ? TIPO_ICONS[manifestacao.tipo] : FileText;

  return (
    <Layout>
      <main id="main-content" className="container py-6 md:py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Back button */}
          <Button asChild variant="ghost" className="gap-2 -ml-2">
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Voltar ao painel
            </Link>
          </Button>

          {loading ? (
            <div className="space-y-4" aria-busy="true">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : manifestacao ? (
            <>
              {/* Header Card */}
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <TipoIcon className="h-5 w-5 text-primary" aria-hidden="true" />
                        <CardTitle className="text-xl sm:text-2xl">
                          {manifestacao.protocolo}
                        </CardTitle>
                      </div>
                      <CardDescription className="flex flex-wrap items-center gap-2">
                        {manifestacao.categoria_tipo && (
                          <>
                            <span>{CATEGORIA_LABELS[manifestacao.categoria_tipo]}</span>
                            <span aria-hidden="true">•</span>
                          </>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" aria-hidden="true" />
                          {format(new Date(manifestacao.created_at), "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </span>
                        {manifestacao.orgaos && (
                          <>
                            <span aria-hidden="true">•</span>
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" aria-hidden="true" />
                              {manifestacao.orgaos.sigla}
                            </span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <StatusBadge status={manifestacao.status} />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Conteúdo de texto */}
                  {manifestacao.conteudo && (
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-sm whitespace-pre-wrap">
                        {manifestacao.conteudo}
                      </p>
                    </div>
                  )}

                  {/* Anexos da manifestação */}
                  {anexos.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Arquivos anexados ({anexos.length})
                      </h3>

                      {/* Áudios */}
                      {anexos.filter(a => a.tipo === 'audio').map((anexo) => (
                        <div key={anexo.id} className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mic className="h-4 w-4" />
                            <span>Áudio</span>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/30 border">
                            <audio
                              controls
                              className="w-full"
                              src={anexo.arquivo_url}
                              aria-label="Áudio da manifestação"
                            >
                              Seu navegador não suporta o elemento de áudio.
                            </audio>
                          </div>
                        </div>
                      ))}

                      {/* Imagens */}
                      {anexos.filter(a => a.tipo === 'imagem').map((anexo) => (
                        <div key={anexo.id} className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ImageIcon className="h-4 w-4" />
                            <span>{anexo.nome_arquivo || 'Imagem'}</span>
                          </div>
                          <div className="p-4 rounded-lg bg-muted/30 border">
                            <img
                              src={anexo.arquivo_url}
                              alt={anexo.nome_arquivo || "Imagem anexada à manifestação"}
                              className="max-w-full h-auto rounded-md max-h-96 mx-auto"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      ))}

                      {/* Vídeos - apenas link de download */}
                      {anexos.filter(a => a.tipo === 'video').map((anexo) => (
                        <div key={anexo.id} className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Video className="h-4 w-4" />
                            <span>{anexo.nome_arquivo || 'Vídeo'}</span>
                          </div>
                          <a
                            href={anexo.arquivo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-4 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors"
                          >
                            <Download className="h-5 w-5 text-primary" />
                            <span className="text-sm text-primary hover:underline">
                              Baixar vídeo
                              {anexo.tamanho_bytes && (
                                <span className="text-muted-foreground ml-2">
                                  ({(anexo.tamanho_bytes / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              )}
                            </span>
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Respostas */}
              {respostas.length > 0 && (
                <section aria-labelledby="respostas-title">
                  <h2 id="respostas-title" className="text-lg font-semibold mb-4">
                    Respostas
                  </h2>
                  <div className="space-y-4">
                    {respostas.map((resposta) => (
                      <RespostaCard
                        key={resposta.id}
                        conteudo={resposta.conteudo}
                        autor={resposta.autor}
                        createdAt={resposta.created_at}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Histórico</CardTitle>
                  <CardDescription>Acompanhe as atualizações da sua manifestação</CardDescription>
                </CardHeader>
                <CardContent>
                  <Timeline historico={historico} />
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </main>
    </Layout>
  );
};

export default Acompanhamento;
