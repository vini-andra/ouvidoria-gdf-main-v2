import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileText, Mic, ImageIcon, Video, AlertCircle, HelpCircle } from "lucide-react";
import { TextChannel } from "@/components/manifestacao/TextChannel";
import { AudioChannel } from "@/components/manifestacao/AudioChannel";
import { ImageChannel } from "@/components/manifestacao/ImageChannel";
import { VideoChannel } from "@/components/manifestacao/VideoChannel";
import type { Database } from "@/integrations/supabase/types";

type TipoManifestacao = Database["public"]["Enums"]["tipo_manifestacao"];

const CHANNEL_CONFIG = [
  {
    id: "texto" as TipoManifestacao,
    label: "Texto",
    icon: FileText,
    tooltip: "Escreva sua manifestação. Mínimo 20 caracteres, máximo 13000. Ideal para descrições detalhadas.",
  },
  {
    id: "audio" as TipoManifestacao,
    label: "Áudio",
    icon: Mic,
    tooltip: "Grave sua manifestação em áudio. Ideal para quem tem dificuldade com escrita. Duração máxima: 5 minutos.",
  },
  {
    id: "imagem" as TipoManifestacao,
    label: "Imagem",
    icon: ImageIcon,
    tooltip: "Envie uma foto do problema. Uma imagem vale mais que mil palavras. Formatos: JPG, PNG, WebP.",
  },
  {
    id: "video" as TipoManifestacao,
    label: "Vídeo",
    icon: Video,
    tooltip: "Envie um vídeo mostrando o problema. Ideal para situações que precisam de contexto. Máximo: 50MB.",
  },
] as const;

interface Step1RelatoProps {
  tipo: TipoManifestacao;
  onTipoChange: (tipo: TipoManifestacao) => void;
  conteudo: string;
  onConteudoChange: (value: string) => void;
  audioBlob: Blob | null;
  onAudioChange: (blob: Blob | null) => void;
  imageFile: File | null;
  onImageChange: (file: File | null) => void;
  videoFile: File | null;
  onVideoChange: (file: File | null) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  errors: {
    conteudo?: string;
    audio?: string;
    image?: string;
    video?: string;
  };
}

export function Step1Relato({
  tipo,
  onTipoChange,
  conteudo,
  onConteudoChange,
  audioBlob,
  onAudioChange,
  imageFile,
  onImageChange,
  videoFile,
  onVideoChange,
  selectedCategories,
  onCategoryToggle,
  errors,
}: Step1RelatoProps) {
  const hasErrors = errors.conteudo || errors.audio || errors.image || errors.video;
  const currentChannel = CHANNEL_CONFIG.find(c => c.id === tipo);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {hasErrors && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {errors.conteudo || errors.audio || errors.image || errors.video}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">
            Escolha como deseja registrar sua manifestação e descreva o ocorrido.
          </p>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Ajuda sobre canais de manifestação"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Você pode enviar sua manifestação por texto, áudio, imagem ou vídeo.
                Escolha o formato mais conveniente para você.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Tabs
          value={tipo}
          onValueChange={(value) => onTipoChange(value as TipoManifestacao)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full h-auto p-1">
            {CHANNEL_CONFIG.map(({ id, label, icon: Icon, tooltip }) => {
              const isActive = tipo === id;
              return (
                <Tooltip key={id}>
                  <TooltipTrigger asChild>
                    <TabsTrigger
                      value={id}
                      className={`flex flex-col items-center gap-1 py-3 min-h-[60px] 
                        transition-all duration-200 rounded-md
                        ${isActive
                          ? 'bg-primary text-primary-foreground font-bold shadow-sm dark:bg-primary/80 dark:text-white'
                          : 'hover:bg-muted/50 text-muted-foreground'
                        }`}
                      aria-label={`Canal ${label}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span className="text-xs">{label}</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p>{tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TabsList>

          {/* Texto de ajuda contextual para o canal selecionado */}
          {currentChannel && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground flex items-start gap-2 fade-in-up">
              <currentChannel.icon className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
              <p>{currentChannel.tooltip}</p>
            </div>
          )}

          <div className="mt-6">
            <TabsContent value="texto" className="mt-0">
              <TextChannel
                content={conteudo}
                onContentChange={onConteudoChange}
                selectedCategories={selectedCategories}
                onCategoryToggle={onCategoryToggle}
                error={errors.conteudo}
              />
            </TabsContent>

            <TabsContent value="audio" className="mt-0">
              <AudioChannel
                audioBlob={audioBlob}
                onAudioChange={onAudioChange}
                error={errors.audio}
              />
            </TabsContent>

            <TabsContent value="imagem" className="mt-0">
              <ImageChannel
                imageFile={imageFile}
                onImageChange={onImageChange}
                error={errors.image}
              />
            </TabsContent>

            <TabsContent value="video" className="mt-0">
              <VideoChannel
                videoFile={videoFile}
                onVideoChange={onVideoChange}
                error={errors.video}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}

