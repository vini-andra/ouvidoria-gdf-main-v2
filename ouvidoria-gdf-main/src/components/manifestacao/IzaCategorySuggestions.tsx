import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface IzaCategorySuggestionsProps {
  text: string;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
}

interface CategoryMatch {
  category: string;
  label: string;
  keywords: string[];
}

const CATEGORIES: CategoryMatch[] = [
  { category: "saude", label: "Saúde", keywords: ["saúde", "saude", "hospital", "upa", "médico", "medico", "posto", "enfermeiro", "remédio", "remedio", "vacina", "atendimento médico"] },
  { category: "mobilidade", label: "Mobilidade", keywords: ["transporte", "ônibus", "onibus", "metrô", "metro", "trânsito", "transito", "brt", "passagem", "rodoviária", "rodoviaria", "bike"] },
  { category: "educacao", label: "Educação", keywords: ["educação", "educacao", "escola", "professor", "professora", "creche", "universidade", "aluno", "matrícula", "matricula", "ensino"] },
  { category: "seguranca", label: "Segurança", keywords: ["polícia", "policia", "segurança", "seguranca", "assalto", "roubo", "furto", "violência", "violencia", "crime", "delegacia", "bombeiro"] },
  { category: "infraestrutura", label: "Infraestrutura", keywords: ["buraco", "asfalto", "iluminação", "iluminacao", "poste", "calçada", "calcada", "esgoto", "água", "agua", "obra", "construção", "construcao", "rua"] },
];

export function analyzeCategoriesFromText(text: string): string[] {
  if (!text || text.length < 10) return [];
  
  const normalizedText = text.toLowerCase();
  const matched: string[] = [];
  
  for (const cat of CATEGORIES) {
    for (const keyword of cat.keywords) {
      if (normalizedText.includes(keyword)) {
        if (!matched.includes(cat.category)) {
          matched.push(cat.category);
        }
        break;
      }
    }
  }
  
  return matched;
}

export function IzaCategorySuggestions({ text, selectedCategories, onCategoryToggle }: IzaCategorySuggestionsProps) {
  const suggestedCategories = analyzeCategoriesFromText(text);
  
  if (suggestedCategories.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-2 animate-fade-in" role="region" aria-label="Sugestões de categoria da IZA">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" />
        <span className="font-medium">IZA sugere:</span>
        <span className="sr-only">Categorias sugeridas com base no seu texto</span>
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Categorias sugeridas">
        {suggestedCategories.map((catId) => {
          const category = CATEGORIES.find(c => c.category === catId);
          if (!category) return null;
          
          const isSelected = selectedCategories.includes(catId);
          
          return (
            <Badge
              key={catId}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all min-h-[44px] px-4 text-sm ${
                isSelected 
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" 
                  : "hover:bg-muted"
              }`}
              onClick={() => onCategoryToggle(catId)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onCategoryToggle(catId);
                }
              }}
              tabIndex={0}
              role="checkbox"
              aria-checked={isSelected}
              aria-label={`Categoria ${category.label}${isSelected ? ", selecionada" : ""}`}
            >
              {category.label}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}

export { CATEGORIES };
