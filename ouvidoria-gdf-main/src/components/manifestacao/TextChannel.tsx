import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { IzaCategorySuggestions } from "./IzaCategorySuggestions";

interface TextChannelProps {
  content: string;
  onContentChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  error?: string;
}

const MIN_CHARS = 50;
const MAX_CHARS = 5000;

export function TextChannel({
  content,
  onContentChange,
  selectedCategories,
  onCategoryToggle,
  error,
}: TextChannelProps) {
  const charCount = content.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;
  const isNearLimit = charCount > MAX_CHARS * 0.9;
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="manifestacao-texto" className="text-base font-medium">
          Descreva sua manifestação <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="manifestacao-texto"
          placeholder="Descreva detalhadamente sua sugestão, reclamação, elogio ou solicitação. Seja específico para que possamos atendê-lo da melhor forma..."
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          className="min-h-[200px] resize-y"
          maxLength={MAX_CHARS}
          aria-invalid={!!error || (charCount > 0 && !isValid)}
          aria-describedby="texto-help texto-counter"
        />
        
        <div className="flex items-center justify-between text-sm">
          <p id="texto-help" className="text-muted-foreground">
            Mínimo de {MIN_CHARS} caracteres
          </p>
          <p 
            id="texto-counter"
            className={`font-medium ${
              charCount < MIN_CHARS 
                ? "text-muted-foreground" 
                : isNearLimit 
                  ? "text-destructive" 
                  : "text-secondary"
            }`}
            aria-live="polite"
          >
            {charCount}/{MAX_CHARS}
          </p>
        </div>
        
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        
        {charCount > 0 && charCount < MIN_CHARS && (
          <p className="text-sm text-accent" role="status">
            Faltam {MIN_CHARS - charCount} caracteres para o mínimo
          </p>
        )}
      </div>
      
      <IzaCategorySuggestions
        text={content}
        selectedCategories={selectedCategories}
        onCategoryToggle={onCategoryToggle}
      />
    </div>
  );
}

export { MIN_CHARS, MAX_CHARS };
