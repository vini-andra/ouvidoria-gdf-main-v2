import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ImagePlus, Trash2, AlertCircle, Upload } from "lucide-react";

interface ImageChannelProps {
  imageFile: File | null;
  onImageChange: (file: File | null) => void;
  error?: string;
}

const MAX_SIZE_MB = 15;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function ImageChannel({ imageFile, onImageChange, error }: ImageChannelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "Formato não suportado. Use JPG, PNG ou WebP.";
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `Arquivo muito grande. Máximo: ${MAX_SIZE_MB}MB`;
    }
    return null;
  };

  const handleFile = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        return;
      }

      setValidationError(null);
      onImageChange(file);

      // Create preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    },
    [onImageChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

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

  const removeImage = () => {
    onImageChange(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setValidationError(null);
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

      {!imageFile ? (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${
              isDragging
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
            aria-label="Selecionar imagem"
          />

          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <ImagePlus className="h-8 w-8 text-muted-foreground" />
            </div>

            <div>
              <p className="font-medium">Arraste uma imagem ou clique para selecionar</p>
              <p className="text-sm text-muted-foreground mt-1">
                JPG, PNG ou WebP • Máximo {MAX_SIZE_MB}MB
              </p>
            </div>

            <Button type="button" variant="outline" className="pointer-events-none">
              <Upload className="h-4 w-4 mr-2" />
              Selecionar imagem
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          <div className="relative rounded-lg overflow-hidden bg-muted">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Prévia da imagem"
                className="w-full max-h-[400px] object-contain"
              />
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3 min-w-0">
              <ImagePlus className="h-5 w-5 text-secondary flex-shrink-0" />
              <div className="min-w-0">
                <p className="font-medium truncate">{imageFile.name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(imageFile.size)}</p>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={removeImage}
              className="flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              aria-label="Remover imagem"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>

          <p className="text-sm text-secondary font-medium text-center" role="status">
            ✓ Imagem selecionada com sucesso
          </p>
        </div>
      )}
    </div>
  );
}
