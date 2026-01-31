import { useState, useEffect, useRef, useCallback } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  analisarManifestacao,
  type IzaAnaliseResultado,
} from "@/lib/izaService";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface TextChannelProps {
  content: string;
  onContentChange: (value: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  tipoSelecionado?: string;
  onTipoSugerido?: (tipo: string) => void;
  error?: string;
}

const MIN_CHARS = 20;
const MAX_CHARS = 13000;
const DEBOUNCE_DELAY = 800; // ms

export function TextChannel({
  content,
  onContentChange,
  selectedCategories,
  onCategoryToggle,
  tipoSelecionado,
  onTipoSugerido,
  error,
}: TextChannelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultado, setResultado] = useState<IzaAnaliseResultado | null>(null);
  const [lastAnalyzedText, setLastAnalyzedText] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const charCount = content.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;
  const isNearLimit = charCount > MAX_CHARS * 0.9;

  // Função de análise com a IZA
  const analisarTexto = useCallback(async (texto: string) => {
    if (texto.length < MIN_CHARS) {
      setResultado(null);
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analisarManifestacao(texto, tipoSelecionado);
      setResultado(result);
      setLastAnalyzedText(texto);

      // Notifica sobre tipo sugerido
      if (result && onTipoSugerido) {
        onTipoSugerido(result.tipo);
      }

      // Auto-seleciona categoria se não estiver selecionada
      if (result && !selectedCategories.includes(result.categoria)) {
        onCategoryToggle(result.categoria);
      }
    } catch (err) {
      console.error("Erro na análise IZA:", err);
      setResultado(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [tipoSelecionado, onTipoSugerido, selectedCategories, onCategoryToggle]);

  // Debounce da análise
  useEffect(() => {
    // Limpa timeout anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Não analisa se texto é muito curto
    if (content.length < MIN_CHARS) {
      setResultado(null);
      return;
    }

    // Não re-analisa se o texto é o mesmo
    if (content === lastAnalyzedText) {
      return;
    }

    // Configura novo debounce
    debounceRef.current = setTimeout(() => {
      analisarTexto(content);
    }, DEBOUNCE_DELAY);

    // Cleanup
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [content, lastAnalyzedText, analisarTexto]);

  // Formatação da confiança
  const confiancaPercent = resultado ? Math.round(resultado.confianca * 100) : 0;
  const confiancaColor =
    confiancaPercent >= 80
      ? "text-green-600 dark:text-green-400"
      : confiancaPercent >= 60
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-orange-600 dark:text-orange-400";

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
            className={`font-medium ${charCount < MIN_CHARS
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

      {/* IZA - Estado de Carregamento */}
      {isAnalyzing && (
        <div
          className="space-y-3 animate-pulse p-4 rounded-lg bg-muted/30 border border-muted"
          role="status"
          aria-label="IZA está analisando sua manifestação"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <Loader2 className="h-5 w-5 text-accent animate-spin" aria-hidden="true" />
              <Sparkles className="h-3 w-3 text-accent absolute -top-1 -right-1" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">IZA está analisando...</p>
              <p className="text-xs text-muted-foreground">
                Identificando tipo, categoria e assunto da sua manifestação
              </p>
            </div>
          </div>
          {/* Skeleton */}
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded-full w-32 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-8 bg-muted rounded-md w-24 animate-pulse" />
              <div className="h-8 bg-muted rounded-md w-36 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* IZA - Resultado */}
      {!isAnalyzing && resultado && (
        <div
          className="space-y-3 animate-fade-in p-4 rounded-lg bg-accent/5 border border-accent/20"
          role="region"
          aria-label="Sugestões da IZA"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Sparkles className="h-5 w-5 text-accent" aria-hidden="true" />
                <CheckCircle2
                  className="h-3 w-3 text-green-500 absolute -bottom-0.5 -right-0.5"
                  aria-hidden="true"
                />
              </div>
              <span className="font-semibold text-sm text-foreground">IZA identificou:</span>
            </div>
            <div
              className={`text-xs font-medium ${confiancaColor}`}
              aria-label={`Confiança: ${confiancaPercent}%`}
            >
              {confiancaPercent}% confiança
            </div>
          </div>

          {/* Resultado */}
          <div className="grid gap-2 sm:grid-cols-2">
            {/* Tipo */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Tipo sugerido:</p>
              <Badge variant="secondary" className="text-sm px-3 py-1 bg-secondary/80">
                {resultado.tipoLabel}
              </Badge>
            </div>

            {/* Assunto */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Assunto identificado:</p>
              <Badge
                variant="outline"
                className={`text-sm px-3 py-1 cursor-pointer transition-all ${selectedCategories.includes(resultado.categoria)
                    ? "bg-accent text-accent-foreground border-accent"
                    : "hover:bg-muted"
                  }`}
                onClick={() => onCategoryToggle(resultado.categoria)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onCategoryToggle(resultado.categoria);
                  }
                }}
                tabIndex={0}
                role="checkbox"
                aria-checked={selectedCategories.includes(resultado.categoria)}
              >
                {resultado.assunto}
              </Badge>
            </div>
          </div>

          {/* Categoria */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground">Categoria:</span>
            <Badge
              variant={selectedCategories.includes(resultado.categoria) ? "default" : "outline"}
              className={`cursor-pointer transition-all min-h-[32px] px-3 text-xs ${selectedCategories.includes(resultado.categoria)
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  : "hover:bg-muted"
                }`}
              onClick={() => onCategoryToggle(resultado.categoria)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCategoryToggle(resultado.categoria);
                }
              }}
              tabIndex={0}
              role="checkbox"
              aria-checked={selectedCategories.includes(resultado.categoria)}
            >
              {resultado.categoriaLabel}
            </Badge>
          </div>

          {/* Alerta de Discrepância */}
          {resultado.alertaDiscrepancia && resultado.mensagemDiscrepancia && (
            <div
              className="flex items-start gap-3 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
              role="alert"
              aria-live="polite"
            >
              <AlertTriangle
                className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Atenção: Possível inconsistência
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  {resultado.mensagemDiscrepancia}
                </p>
              </div>
            </div>
          )}

          {/* Dica */}
          <p className="text-xs text-muted-foreground pt-1">
            💡 A IZA sugere categorias com base no conteúdo. Você pode ajustar manualmente se necessário.
          </p>
        </div>
      )}
    </div>
  );
}

export { MIN_CHARS, MAX_CHARS };
