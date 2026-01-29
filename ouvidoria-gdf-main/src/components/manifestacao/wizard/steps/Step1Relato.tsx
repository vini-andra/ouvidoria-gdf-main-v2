import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Mic, ImageIcon, Video, AlertCircle } from "lucide-react";
import { TextChannel } from "@/components/manifestacao/TextChannel";
import { AudioChannel } from "@/components/manifestacao/AudioChannel";
import { ImageChannel } from "@/components/manifestacao/ImageChannel";
import { VideoChannel } from "@/components/manifestacao/VideoChannel";
import type { Database } from "@/integrations/supabase/types";

type TipoManifestacao = Database["public"]["Enums"]["tipo_manifestacao"];

const CHANNEL_CONFIG = [
  { id: "texto" as TipoManifestacao, label: "Texto", icon: FileText },
  { id: "audio" as TipoManifestacao, label: "Áudio", icon: Mic },
  { id: "imagem" as TipoManifestacao, label: "Imagem", icon: ImageIcon },
  { id: "video" as TipoManifestacao, label: "Vídeo", icon: Video },
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

  return (
    <div className="space-y-6">
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errors.conteudo || errors.audio || errors.image || errors.video}
          </AlertDescription>
        </Alert>
      )}

      <p className="text-muted-foreground">
        Escolha como deseja registrar sua manifestação e descreva o ocorrido.
      </p>

      <Tabs
        value={tipo}
        onValueChange={(value) => onTipoChange(value as TipoManifestacao)}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full h-auto p-1">
          {CHANNEL_CONFIG.map(({ id, label, icon: Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="flex flex-col items-center gap-1 py-3 min-h-[60px] data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              aria-label={`Canal ${label}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs font-medium">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

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
  );
}
