import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Video, Trash2, AlertCircle, Upload } from "lucide-react";

interface VideoChannelProps {
  videoFile: File | null;
  onVideoChange: (file: File | null) => void;
  error?: string;
}

const MAX_SIZE_MB = 50;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ["video/mp4", "video/webm"];

export function VideoChannel({ videoFile, onVideoChange, error }: VideoChannelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Formato não suportado. Use MP4 ou WebM.";
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `Arquivo muito grande. Máximo: ${MAX_SIZE_MB}MB`;
    }
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);
    setIsProcessing(true);
    setUploadProgress(0);
    
    // Simulate processing progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    // Create preview after "processing"
    setTimeout(() => {
      clearInterval(progressInterval);
      setUploadProgress(100);
      onVideoChange(file);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsProcessing(false);
    }, 1000);
  }, [onVideoChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const removeVideo = () => {
    onVideoChange(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setValidationError(null);
    setUploadProgress(0);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="space-y-4">
      {(error || validationError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || validationError}</AlertDescription>
        </Alert>
      )}

      {isProcessing && (
        <div className="p-6 bg-muted/30 rounded-lg space-y-3">
          <p className="text-center font-medium">Processando vídeo...</p>
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-center text-sm text-muted-foreground">
            {uploadProgress}%
          </p>
        </div>
      )}

      {!videoFile && !isProcessing ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/25 hover:border-primary/50"
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Selecionar vídeo"
          />
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Video className="h-8 w-8 text-muted-foreground" />
            </div>
            
            <div>
              <p className="font-medium">
                Arraste um vídeo ou clique para selecionar
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                MP4 ou WebM • Máximo {MAX_SIZE_MB}MB
              </p>
            </div>
            
            <Button type="button" variant="outline" className="pointer-events-none">
              <Upload className="h-4 w-4 mr-2" />
              Selecionar vídeo
            </Button>
          </div>
        </div>
      ) : videoFile && !isProcessing && (
        <div className="space-y-4 animate-fade-in">
          <div className="relative rounded-lg overflow-hidden bg-black">
            {previewUrl && (
              <video
                ref={videoRef}
                src={previewUrl}
                controls
                className="w-full max-h-[400px]"
                aria-label="Prévia do vídeo"
              >
                Seu navegador não suporta a reprodução de vídeo.
              </video>
            )}
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 min-w-0">
              <Video className="h-5 w-5 text-secondary flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{videoFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(videoFile.size)}
                </p>
              </div>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={removeVideo}
              className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              aria-label="Remover vídeo"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
          
          <p className="text-sm text-secondary font-medium text-center" role="status">
            ✓ Vídeo selecionado com sucesso
          </p>
        </div>
      )}
    </div>
  );
}
