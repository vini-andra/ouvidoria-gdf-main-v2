import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Mic,
  Image,
  Video,
  MapPin,
  Calendar,
  Users,
  Building2,
  Shield,
  Edit2,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Database } from "@/integrations/supabase/types";
import type { CategoriaManifestacao } from "@/components/manifestacao/TipoManifestacaoSelect";

type TipoManifestacao = Database["public"]["Enums"]["tipo_manifestacao"];

interface Step4ResumoProps {
  tipo: TipoManifestacao;
  conteudo: string;
  audioBlob: Blob | null;
  imageFile: File | null;
  videoFile: File | null;
  selectedCategories: string[];
  categoriaTipo: CategoriaManifestacao | null;
  orgaoId: string | null;
  orgaoNome?: string;
  localOcorrencia: string;
  dataOcorrencia: Date | null;
  envolvidos: string;
  testemunhas: string;
  sigiloDados: boolean;
  onEditStep: (step: number) => void;
}

const tipoLabels: Record<TipoManifestacao, { label: string; icon: React.ReactNode }> = {
  texto: { label: "Texto", icon: <FileText className="h-4 w-4" /> },
  audio: { label: "Áudio", icon: <Mic className="h-4 w-4" /> },
  imagem: { label: "Imagem", icon: <Image className="h-4 w-4" /> },
  video: { label: "Vídeo", icon: <Video className="h-4 w-4" /> },
};

const categoriaLabels: Record<CategoriaManifestacao, string> = {
  reclamacao: "Reclamação",
  denuncia: "Denúncia",
  sugestao: "Sugestão",
  elogio: "Elogio",
  solicitacao: "Solicitação",
  informacao: "Pedido de Informação",
};

export function Step4Resumo({
  tipo,
  conteudo,
  audioBlob,
  imageFile,
  videoFile,
  selectedCategories,
  categoriaTipo,
  orgaoId,
  orgaoNome,
  localOcorrencia,
  dataOcorrencia,
  envolvidos,
  testemunhas,
  sigiloDados,
  onEditStep,
}: Step4ResumoProps) {
  const tipoInfo = tipoLabels[tipo];

  const hasComplementaryInfo = localOcorrencia || dataOcorrencia || envolvidos || testemunhas;

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Revise todas as informações antes de prosseguir. Clique em "Editar" para corrigir qualquer
        informação.
      </p>

      {/* Etapa 1: Relato */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {tipoInfo.icon}
              Relato ({tipoInfo.label})
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(1)}
              aria-label="Editar relato"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {tipo === "texto" && conteudo && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm whitespace-pre-wrap line-clamp-4">{conteudo}</p>
              {conteudo.length > 300 && (
                <p className="text-xs text-muted-foreground mt-2">
                  ... ({conteudo.length} caracteres)
                </p>
              )}
            </div>
          )}

          {tipo === "audio" && audioBlob && (
            <div className="flex items-center gap-2 text-sm">
              <Mic className="h-4 w-4 text-primary" />
              <span>Áudio gravado ({(audioBlob.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}

          {tipo === "imagem" && imageFile && (
            <div className="flex items-center gap-2 text-sm">
              <Image className="h-4 w-4 text-primary" />
              <span>
                {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          )}

          {tipo === "video" && videoFile && (
            <div className="flex items-center gap-2 text-sm">
              <Video className="h-4 w-4 text-primary" />
              <span>
                {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          )}

          {selectedCategories.length > 0 && (
            <div className="mt-3 p-3 bg-secondary/30 rounded-lg border border-secondary/50">
              <div className="flex items-center gap-2 text-sm font-medium text-secondary-foreground mb-2">
                <Sparkles className="h-4 w-4 text-amber-500" aria-hidden="true" />
                <span>IZA identificou:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-xs capitalize">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Etapa 2: Assunto */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Assunto
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(2)}
              aria-label="Editar assunto"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tipo de Manifestação:</span>
              <Badge variant="outline">
                {categoriaTipo ? categoriaLabels[categoriaTipo] : "Não selecionado"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Órgão Responsável:</span>
              <span className="text-sm font-medium">
                {orgaoNome || orgaoId || "Não selecionado"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Etapa 3: Informações Complementares */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Informações Complementares
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditStep(3)}
              aria-label="Editar informações complementares"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Editar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {hasComplementaryInfo ? (
            <div className="grid gap-3">
              {localOcorrencia && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-sm text-muted-foreground">Local:</span>
                    <p className="text-sm">{localOcorrencia}</p>
                  </div>
                </div>
              )}

              {dataOcorrencia && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Data:</span>
                    <span className="text-sm ml-1">
                      {format(dataOcorrencia, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </div>
              )}

              {envolvidos && (
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-sm text-muted-foreground">Envolvidos:</span>
                    <p className="text-sm">{envolvidos}</p>
                  </div>
                </div>
              )}

              {testemunhas && (
                <div className="flex items-start gap-2">
                  <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-sm text-muted-foreground">Testemunhas:</span>
                    <p className="text-sm">{testemunhas}</p>
                  </div>
                </div>
              )}

              {sigiloDados && (
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="h-4 w-4 text-amber-500" />
                  <span className="text-sm text-amber-600 dark:text-amber-400">
                    Sigilo de dados solicitado
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Nenhuma informação complementar foi fornecida.
            </p>
          )}
        </CardContent>
      </Card>

      <Separator />

      <p className="text-sm text-muted-foreground text-center">
        Ao prosseguir, você passará para a etapa de identificação.
      </p>
    </div>
  );
}
