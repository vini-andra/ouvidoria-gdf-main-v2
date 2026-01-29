import { TipoManifestacaoSelect, CategoriaManifestacao } from "@/components/manifestacao/TipoManifestacaoSelect";
import { OrgaoSelect } from "@/components/manifestacao/OrgaoSelect";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Step2AssuntoProps {
  categoriaTipo: CategoriaManifestacao | null;
  onCategoriaTipoChange: (value: CategoriaManifestacao) => void;
  orgaoId: string | null;
  onOrgaoChange: (value: string | null) => void;
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
    <div className="space-y-6">
      {hasErrors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Por favor, preencha todos os campos obrigatórios para continuar.
          </AlertDescription>
        </Alert>
      )}

      <p className="text-muted-foreground">
        Selecione o tipo de manifestação e o órgão responsável pelo assunto.
      </p>

      <TipoManifestacaoSelect
        value={categoriaTipo}
        onChange={onCategoriaTipoChange}
        error={errors.categoriaTipo}
      />

      <Separator />

      <OrgaoSelect
        value={orgaoId}
        onChange={onOrgaoChange}
        error={errors.orgao}
      />
    </div>
  );
}
