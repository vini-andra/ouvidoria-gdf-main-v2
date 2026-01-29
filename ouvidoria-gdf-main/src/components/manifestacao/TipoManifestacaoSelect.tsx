import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  MessageSquareWarning, 
  AlertTriangle, 
  Lightbulb, 
  ThumbsUp, 
  ClipboardList, 
  Info 
} from "lucide-react";

export type CategoriaManifestacao = 
  | "reclamacao" 
  | "denuncia" 
  | "sugestao" 
  | "elogio" 
  | "solicitacao" 
  | "informacao";

interface TipoManifestacaoSelectProps {
  value: CategoriaManifestacao | null;
  onChange: (value: CategoriaManifestacao) => void;
  error?: string;
}

const TIPOS_MANIFESTACAO = [
  { 
    id: "reclamacao" as CategoriaManifestacao, 
    label: "Reclamação", 
    description: "Expressar insatisfação com serviço ou atendimento",
    icon: MessageSquareWarning,
    color: "text-orange-600 dark:text-orange-400"
  },
  { 
    id: "denuncia" as CategoriaManifestacao, 
    label: "Denúncia", 
    description: "Relatar irregularidade ou conduta inadequada",
    icon: AlertTriangle,
    color: "text-destructive"
  },
  { 
    id: "sugestao" as CategoriaManifestacao, 
    label: "Sugestão", 
    description: "Propor melhorias em serviços públicos",
    icon: Lightbulb,
    color: "text-accent"
  },
  { 
    id: "elogio" as CategoriaManifestacao, 
    label: "Elogio", 
    description: "Reconhecer bom atendimento ou serviço",
    icon: ThumbsUp,
    color: "text-secondary"
  },
  { 
    id: "solicitacao" as CategoriaManifestacao, 
    label: "Solicitação", 
    description: "Pedir informação ou providência",
    icon: ClipboardList,
    color: "text-primary"
  },
  { 
    id: "informacao" as CategoriaManifestacao, 
    label: "Informação", 
    description: "Buscar esclarecimentos sobre serviços",
    icon: Info,
    color: "text-muted-foreground"
  },
] as const;

export function TipoManifestacaoSelect({ 
  value, 
  onChange, 
  error 
}: TipoManifestacaoSelectProps) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-medium">
        Tipo de manifestação <span className="text-destructive">*</span>
      </Label>
      
      <RadioGroup
        value={value || ""}
        onValueChange={(val) => onChange(val as CategoriaManifestacao)}
        className="grid gap-3 sm:grid-cols-2"
        aria-describedby={error ? "tipo-error" : undefined}
        aria-invalid={!!error}
      >
        {TIPOS_MANIFESTACAO.map(({ id, label, description, icon: Icon, color }) => (
          <label
            key={id}
            htmlFor={`tipo-${id}`}
            className={`
              flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer
              transition-all duration-200 min-h-[80px]
              hover:border-primary/50 hover:bg-muted/50
              focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
              ${value === id 
                ? "border-primary bg-primary/5" 
                : "border-muted"
              }
            `}
          >
            <RadioGroupItem 
              value={id} 
              id={`tipo-${id}`}
              className="mt-1 shrink-0"
              aria-describedby={`tipo-${id}-desc`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 shrink-0 ${color}`} aria-hidden="true" />
                <span className="font-medium text-sm">{label}</span>
              </div>
              <p 
                id={`tipo-${id}-desc`}
                className="text-xs text-muted-foreground mt-1 line-clamp-2"
              >
                {description}
              </p>
            </div>
          </label>
        ))}
      </RadioGroup>
      
      {error && (
        <p id="tipo-error" className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export { TIPOS_MANIFESTACAO };
