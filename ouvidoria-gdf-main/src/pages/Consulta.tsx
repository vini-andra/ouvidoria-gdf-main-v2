import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Type
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
  const [protocolo, setProtocolo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [manifestacao, setManifestacao] = useState<Manifestacao | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const formatProtocolo = (value: string) => {
    // Remove non-alphanumeric characters
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    
    // Format as YYYY-DF-XXXXX
    if (cleaned.length <= 4) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    } else {
      return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 11)}`;
    }
  };

  const handleProtocoloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatProtocolo(e.target.value);
    setProtocolo(formatted);
    setNotFound(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!protocolo || protocolo.length < 13) {
      toast({
        title: "Protocolo inválido",
        description: "Digite o número completo do protocolo (ex: 2026-DF-00001)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    setManifestacao(null);
    setHasSearched(true);

    try {
      const { data, error } = await supabase
        .from("manifestacoes")
        .select("id, protocolo, tipo, categoria, anonimo, nome, created_at, conteudo")
        .eq("protocolo", protocolo)
        .maybeSingle();

      if (error) {
        console.error("Error fetching manifestacao:", error);
        toast({
          title: "Erro na consulta",
          description: "Não foi possível consultar o protocolo. Tente novamente.",
          variant: "destructive",
        });
        return;
      }

      if (!data) {
        setNotFound(true);
      } else {
        setManifestacao(data);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Erro inesperado",
        description: "Ocorreu um erro ao consultar. Tente novamente.",
        variant: "destructive",
      });
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
      <section className="bg-gradient-to-br from-primary to-primary/90 py-12 md:py-16">
        <div className="container text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/20 flex items-center justify-center">
            <Search className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-3">
            Consultar Manifestação
          </h1>
          <p className="text-primary-foreground/90 max-w-lg mx-auto">
            Digite o número do protocolo para consultar os detalhes da sua manifestação.
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
                  O número do protocolo foi gerado quando você registrou sua manifestação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="protocolo">Número do Protocolo</Label>
                    <Input
                      id="protocolo"
                      type="text"
                      placeholder="2026-DF-00001"
                      value={protocolo}
                      onChange={handleProtocoloChange}
                      className="text-lg font-mono text-center tracking-wider"
                      maxLength={14}
                      aria-describedby="protocolo-help"
                    />
                    <p id="protocolo-help" className="text-sm text-muted-foreground">
                      Formato: AAAA-DF-XXXXX (ex: 2026-DF-00001)
                    </p>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isLoading || protocolo.length < 13}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Consultando...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Consultar
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
                      Não encontramos nenhuma manifestação com o protocolo <strong className="font-mono">{protocolo}</strong>. 
                      Verifique se o número está correto e tente novamente.
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
                    <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Manifestação Encontrada
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <TipoIcon className="w-3 h-3" />
                      {tipoLabels[manifestacao.tipo]}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mt-4 font-mono">
                    {manifestacao.protocolo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status */}
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-2 text-accent-foreground">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Status: Em Análise</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
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
                        <p className="text-sm text-muted-foreground mb-2">Conteúdo da Manifestação</p>
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
