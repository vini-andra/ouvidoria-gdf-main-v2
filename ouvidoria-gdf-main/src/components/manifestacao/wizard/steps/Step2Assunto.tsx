import {
  TipoManifestacaoSelect,
  CategoriaManifestacao,
} from "@/components/manifestacao/TipoManifestacaoSelect";
import { OrgaoSelect } from "@/components/manifestacao/OrgaoSelect";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, HelpCircle } from "lucide-react";

interface Step2AssuntoProps {
  categoriaTipo: CategoriaManifestacao | null;
  onCategoriaTipoChange: (value: CategoriaManifestacao) => void;
  orgaoId: string | null;
  onOrgaoChange: (value: string | null, nome?: string) => void;
  errors: {
    categoriaTipo?: string;
    orgao?: string;
  };
}

export function Step2Assunto({
  categoriaTipo,
  onCategoriaTipoChange,
  orgaoId,
  onOrgaoChange,
  errors,
}: Step2AssuntoProps) {
  const hasErrors = errors.categoriaTipo || errors.orgao;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {hasErrors && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Por favor, preencha todos os campos obrigatórios para continuar.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2">
          <p className="text-muted-foreground">
            Selecione o tipo de manifestação e o órgão responsável pelo assunto.
          </p>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Por que a categoria é importante?"
              >
                <HelpCircle className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                A categoria ajuda a direcionar sua manifestação para o órgão correto,
                acelerando a resposta. Nossa assistente <strong>IZA</strong> pode sugerir
                automaticamente com base no seu relato!
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <TipoManifestacaoSelect
          value={categoriaTipo}
          onChange={onCategoriaTipoChange}
          error={errors.categoriaTipo}
        />

        <Separator />

        <OrgaoSelect value={orgaoId} onChange={onOrgaoChange} error={errors.orgao} />
      </div>
    </TooltipProvider>
  );
}

