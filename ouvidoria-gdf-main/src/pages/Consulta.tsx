import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  FileText,
  Calendar,
  User,
  Tag,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Mic,
  Image,
  Video,
  Type,
} from "lucide-react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Manifestacao {
  id: string;
  protocolo: string;
  tipo: "texto" | "audio" | "imagem" | "video";
  categoria: string | null;
  anonimo: boolean;
  nome: string | null;
  created_at: string;
  conteudo: string | null;
}

const tipoIcons = {
  texto: Type,
  audio: Mic,
  imagem: Image,
  video: Video,
};

const tipoLabels = {
  texto: "Texto",
  audio: "Áudio",
  imagem: "Imagem",
  video: "Vídeo",
};

const Consulta = () => {
  const [searchParams] = useSearchParams();
  const [protocolo, setProtocolo] = useState(searchParams.get("protocolo") || "");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [manifestacao, setManifestacao] = useState<Manifestacao | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const formatProtocolo = (value: string) => {
    // Remove non-alphanumeric characters
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    // Format as OUV-YYYYMMDD-XXXXXX
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 11) {
      // OUV-YYYYMMDD
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      // OUV-YYYYMMDD-XXXXXX
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 11)}-${cleaned.slice(11, 17)}`;
    }
  };

  const handleProtocoloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatProtocolo(e.target.value);
    setProtocolo(formatted);
    setNotFound(false);
    setError(null);
  };

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(e.target.value.toUpperCase());
    setError(null);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate both protocol and password
    if (!protocolo || protocolo.length < 18) {
      setError("Digite o número completo do protocolo (ex: OUV-20260101-000000)");
      return;
    }

    if (!senha || senha.length !== 6) {
      setError("Digite a senha de 6 caracteres fornecida após o envio");
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    setManifestacao(null);
    setHasSearched(true);

    try {
      const { data, error: queryError } = await supabase
        .from("manifestacoes")
        .select("id, protocolo, tipo, categoria, anonimo, nome, created_at, conteudo")
        .eq("protocolo", protocolo)
        .eq("senha_acompanhamento", senha.toUpperCase())
        .maybeSingle();

      if (queryError) {
        console.error("Error fetching manifestacao:", queryError);
        setError("Não foi possível consultar o protocolo. Tente novamente.");
        return;
      }

      if (!data) {
        setError("Protocolo ou senha incorretos. Verifique e tente novamente.");
        setNotFound(true);
      } else {
        setManifestacao(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Ocorreu um erro ao consultar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const TipoIcon = manifestacao ? tipoIcons[manifestacao.tipo] : Type;

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/95 to-primary/70 py-12 md:py-16">
        <div className="container text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-accent/40 shadow-lg flex items-center justify-center">
            <Search className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-3">
            Consultar Manifestação
          </h1>
          <p className="text-primary-foreground/90 max-w-lg mx-auto">
            Digite o número do protocolo e a senha de acompanhamento para consultar sua manifestação.
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="py-10 md:py-16">
        <div className="container">
          <div className="max-w-xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Buscar por Protocolo
                </CardTitle>
                <CardDescription>
                  O protocolo e a senha foram gerados quando você registrou sua manifestação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-6">
                  {/* Campo de Protocolo */}
                  <div className="space-y-2">
                    <Label htmlFor="protocolo" className="text-base font-medium">
                      Número do Protocolo
                      <span className="text-destructive ml-1" aria-label="obrigatório">*</span>
                    </Label>
                    <Input
                      id="protocolo"
                      name="protocolo"
                      type="text"
                      placeholder="OUV-20260101-000000"
                      value={protocolo}
                      onChange={handleProtocoloChange}
                      className="text-base font-mono text-center tracking-wider"
                      maxLength={19}
                      required
                      aria-required="true"
                      aria-invalid={!!error}
                      aria-describedby={error ? "form-error" : "protocolo-hint"}
                      autoComplete="off"
                    />
                    <p id="protocolo-hint" className="text-sm text-muted-foreground">
                      Formato: OUV-AAAAMMDD-XXXXXX (ex: OUV-20260101-000000)
                    </p>
                  </div>

                  {/* Campo de Senha */}
                  <div className="space-y-2">
                    <Label htmlFor="senha" className="text-base font-medium">
                      Senha de Acompanhamento
                      <span className="text-destructive ml-1" aria-label="obrigatório">*</span>
                    </Label>
                    <Input
                      id="senha"
                      name="senha"
                      type="password"
                      placeholder="ABC123"
                      value={senha}
                      onChange={handleSenhaChange}
                      className="text-base font-mono tracking-wider text-center"
                      maxLength={6}
                      required
                      aria-required="true"
                      aria-invalid={!!error}
                      aria-describedby={error ? "form-error" : "senha-hint"}
                      autoComplete="off"
                    />
                    <p id="senha-hint" className="text-sm text-muted-foreground">
                      6 caracteres fornecidos após o envio
                    </p>
                  </div>

                  {/* Mensagem de Erro com ARIA Live Region */}
                  {error && (
                    <Alert variant="destructive" role="alert" aria-live="polite">
                      <AlertCircle className="h-4 w-4" aria-hidden="true" />
                      <AlertDescription id="form-error">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Botão de Submit */}
                  <Button
                    type="submit"
                    className="w-full min-h-[44px]"
                    size="lg"
                    disabled={!protocolo || !senha || isLoading}
                    aria-busy={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                        <span>Consultando...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" aria-hidden="true" />
                        <span>Consultar Manifestação</span>
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Not Found State */}
            {notFound && hasSearched && (
              <Card className="mt-6 border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-destructive" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Protocolo não encontrado</h3>
                    <p className="text-muted-foreground text-sm">
                      Não encontramos nenhuma manifestação com o protocolo{" "}
                      <strong className="font-mono">{protocolo}</strong>. Verifique se o número está
                      correto e tente novamente.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Result Card */}
            {manifestacao && (
              <Card className="mt-6 border-2 border-secondary/30 bg-secondary/5">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="bg-secondary/10 text-secondary border-secondary/30"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Manifestação Encontrada
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <TipoIcon className="w-3 h-3" />
                      {tipoLabels[manifestacao.tipo]}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mt-4 font-mono">{manifestacao.protocolo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status */}
                  <div className="p-4 bg-accent/20 dark:bg-accent/30 rounded-lg border border-accent/40 dark:border-accent/50">
                    <div className="flex items-center gap-2 text-accent-foreground dark:text-accent">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Status: Em Análise</span>
                    </div>
                    <p className="text-sm text-muted-foreground dark:text-foreground/80 mt-1">
                      Sua manifestação está sendo analisada pela ouvidoria competente.
                    </p>
                  </div>

                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Data de Registro</p>
                        <p className="font-medium">{formatDate(manifestacao.created_at)}</p>
                      </div>
                    </div>

                    {manifestacao.categoria && (
                      <div className="flex items-start gap-3">
                        <Tag className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Categoria</p>
                          <p className="font-medium capitalize">{manifestacao.categoria}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Identificação</p>
                        <p className="font-medium">
                          {manifestacao.anonimo ? "Anônimo" : manifestacao.nome || "Não informado"}
                        </p>
                      </div>
                    </div>

                    {manifestacao.tipo === "texto" && manifestacao.conteudo && (
                      <div className="pt-3 border-t">
                        <p className="text-sm text-muted-foreground mb-2">
                          Conteúdo da Manifestação
                        </p>
                        <p className="text-sm bg-muted/50 p-3 rounded-lg line-clamp-4">
                          {manifestacao.conteudo}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Consulta;
