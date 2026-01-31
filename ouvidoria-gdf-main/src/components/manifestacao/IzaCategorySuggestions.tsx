import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { analisarManifestacao, type IzaAnaliseResultado } from "@/lib/izaService";

interface IzaCategorySuggestionsProps {
  text: string;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  tipoSelecionado?: string;
  onTipoSugerido?: (tipo: string) => void;
}

export function IzaCategorySuggestions({
  text,
  selectedCategories,
  onCategoryToggle,
  tipoSelecionado,
  onTipoSugerido,
}: IzaCategorySuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState<IzaAnaliseResultado | null>(null);
  const [analisado, setAnalisado] = useState(false);

  // Debounce e análise são controlados pelo componente pai (TextChannel)
  // Este componente apenas exibe os resultados

  useEffect(() => {
    // Reset quando o texto muda significativamente
    if (text.length < 15) {
      setResultado(null);
      setAnalisado(false);
    }
  }, [text]);

  // Função exposta para o componente pai chamar
  const analisar = async () => {
    if (text.length < 15) return;

    setIsLoading(true);
    setAnalisado(false);

    try {
      const result = await analisarManifestacao(text, tipoSelecionado);
      setResultado(result);
      setAnalisado(true);

      // Notifica o pai sobre o tipo sugerido
      if (result && onTipoSugerido) {
        onTipoSugerido(result.tipo);
      }

      // Auto-seleciona a categoria se ainda não selecionada
      if (result && !selectedCategories.includes(result.categoria)) {
        onCategoryToggle(result.categoria);
      }
    } catch (error) {
      console.error("Erro na análise IZA:", error);
      setResultado(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Exponha a função de análise via useImperativeHandle ou como prop callback
  // Por simplicidade, usamos um useEffect com dependência no texto
  useEffect(() => {
    // Só analisa se text tiver tamanho mínimo e não estiver já analisando
    if (text.length >= 15 && !isLoading && !analisado) {
      // A análise será disparada pelo debounce no TextChannel
    }
  }, [text, isLoading, analisado]);

  // Estado de Carregamento
  if (isLoading) {
    return (
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
        {/* Skeleton para resultados */}
        <div className="space-y-2">
          <div className="h-6 bg-muted rounded-full w-32 animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 bg-muted rounded-md w-24 animate-pulse" />
            <div className="h-8 bg-muted rounded-md w-36 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Sem resultado (texto muito curto ou sem matches)
  if (!resultado) {
    return null;
  }

  // Formatação da confiança
  const confiancaPercent = Math.round(resultado.confianca * 100);
  const confiancaColor =
    confiancaPercent >= 80
      ? "text-green-600 dark:text-green-400"
      : confiancaPercent >= 60
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-orange-600 dark:text-orange-400";

  return (
    <div
      className="space-y-3 animate-fade-in p-4 rounded-lg bg-accent/5 border border-accent/20"
      role="region"
      aria-label="Sugestões da IZA"
    >
      {/* Header com ícone e status */}
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
        <div className={`text-xs font-medium ${confiancaColor}`} aria-label={`Confiança: ${confiancaPercent}%`}>
          {confiancaPercent}% confiança
        </div>
      </div>

      {/* Resultado da análise */}
      <div className="grid gap-2 sm:grid-cols-2">
        {/* Tipo */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Tipo sugerido:</p>
          <Badge
            variant="secondary"
            className="text-sm px-3 py-1 bg-secondary/80"
          >
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
            aria-label={`${resultado.assunto} - ${resultado.categoriaLabel}`}
          >
            {resultado.assunto}
          </Badge>
        </div>
      </div>

      {/* Categoria selecionável */}
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

      {/* Texto auxiliar */}
      <p className="text-xs text-muted-foreground pt-1">
        💡 A IZA sugere categorias com base no conteúdo. Você pode ajustar manualmente se necessário.
      </p>
    </div>
  );
}

// Export para uso externo
export { analisarManifestacao };
export type { IzaAnaliseResultado };
