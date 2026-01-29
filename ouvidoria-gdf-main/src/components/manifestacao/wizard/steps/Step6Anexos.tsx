import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Image, 
  File, 
  X, 
  AlertCircle,
  CheckCircle2,
  Paperclip
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnexoFile {
  id: string;
  file: File;
  preview?: string;
  status: "pending" | "uploading" | "complete" | "error";
  progress: number;
  error?: string;
}

interface Step6AnexosProps {
  anexos: File[];
  onAnexosChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

const ACCEPTED_TYPES = {
  "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "text/plain": [".txt"],
};

const ACCEPTED_EXTENSIONS = Object.values(ACCEPTED_TYPES).flat();

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return <Image className="h-4 w-4" />;
  if (type.includes("pdf")) return <FileText className="h-4 w-4 text-red-500" />;
  return <File className="h-4 w-4" />;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function Step6Anexos({
  anexos,
  onAnexosChange,
  maxFiles = 5,
  maxSizeMB = 10,
}: Step6AnexosProps) {
  const [files, setFiles] = useState<AnexoFile[]>(() => 
    anexos.map((file, index) => ({
      id: `existing-${index}`,
      file,
      status: "complete" as const,
      progress: 100,
    }))
  );
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check size
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Arquivo muito grande. Máximo: ${maxSizeMB}MB`;
    }

    // Check type
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      return `Tipo de arquivo não permitido. Use: ${ACCEPTED_EXTENSIONS.join(", ")}`;
    }

    return null;
  };

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    setError(null);

    // Check max files
    if (files.length + fileArray.length > maxFiles) {
      setError(`Máximo de ${maxFiles} arquivos permitidos`);
      return;
    }

    const validFiles: AnexoFile[] = [];
    
    for (const file of fileArray) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

      // Check for duplicates
      if (files.some(f => f.file.name === file.name && f.file.size === file.size)) {
        continue;
      }

      const newFile: AnexoFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        status: "complete", // In real implementation, this would be "pending" and then uploaded
        progress: 100,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      };

      validFiles.push(newFile);
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onAnexosChange(updatedFiles.map(f => f.file));
    }
  }, [files, maxFiles, maxSizeMB, onAnexosChange]);

  const removeFile = useCallback((id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onAnexosChange(updatedFiles.map(f => f.file));
  }, [files, onAnexosChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = ""; // Reset input
    }
  }, [addFiles]);

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Adicione documentos ou imagens que complementem sua manifestação.
        Esta etapa é opcional.
      </p>

      {/* Drop Zone */}
      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer",
          dragActive && "border-primary bg-primary/5",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
        onClick={files.length < maxFiles ? openFileDialog : undefined}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Área para arrastar e soltar arquivos"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openFileDialog();
          }
        }}
      >
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Upload className={cn(
            "h-10 w-10 mb-4",
            dragActive ? "text-primary" : "text-muted-foreground"
          )} />
          <p className="text-sm font-medium mb-1">
            {dragActive ? "Solte os arquivos aqui" : "Arraste arquivos ou clique para selecionar"}
          </p>
          <p className="text-xs text-muted-foreground">
            Até {maxFiles} arquivos, máximo {maxSizeMB}MB cada
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Formatos: JPG, PNG, PDF, DOC, DOCX, TXT
          </p>
        </CardContent>
      </Card>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={Object.keys(ACCEPTED_TYPES).join(",")}
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* File list */}
      {files.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              Arquivos Anexados ({files.length}/{maxFiles})
            </CardTitle>
            <CardDescription>
              Clique no X para remover um arquivo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2" role="list" aria-label="Lista de arquivos anexados">
              {files.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center gap-3 p-2 rounded-md bg-muted/50 group"
                >
                  {/* Preview or icon */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview}
                        alt=""
                        className="h-10 w-10 rounded object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                        {getFileIcon(file.file.type)}
                      </div>
                    )}
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.file.size)}
                    </p>
                    {file.status === "uploading" && (
                      <Progress value={file.progress} className="h-1 mt-1" />
                    )}
                    {file.error && (
                      <p className="text-xs text-destructive">{file.error}</p>
                    )}
                  </div>

                  {/* Status/Actions */}
                  <div className="flex items-center gap-2">
                    {file.status === "complete" && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(file.id);
                      }}
                      aria-label={`Remover ${file.file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Empty state hint */}
      {files.length === 0 && (
        <p className="text-sm text-muted-foreground text-center italic">
          Nenhum arquivo anexado. Você pode prosseguir sem anexos.
        </p>
      )}
    </div>
  );
}
