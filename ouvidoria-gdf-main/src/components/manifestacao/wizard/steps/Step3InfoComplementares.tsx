import { CamposEstendidos } from "@/components/manifestacao/CamposEstendidos";

interface Step3InfoComplementaresProps {
  localOcorrencia: string;
  onLocalChange: (value: string) => void;
  dataOcorrencia: Date | null;
  onDataChange: (value: Date | null) => void;
  envolvidos: string;
  onEnvolvidosChange: (value: string) => void;
  testemunhas: string;
  onTestemunhasChange: (value: string) => void;
  sigiloDados: boolean;
  onSigiloChange: (value: boolean) => void;
}

export function Step3InfoComplementares({
  localOcorrencia,
  onLocalChange,
  dataOcorrencia,
  onDataChange,
  envolvidos,
  onEnvolvidosChange,
  testemunhas,
  onTestemunhasChange,
  sigiloDados,
  onSigiloChange,
}: Step3InfoComplementaresProps) {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Forneça informações adicionais para ajudar na análise da sua manifestação.
        Todos os campos desta etapa são opcionais.
      </p>

      <CamposEstendidos
        localOcorrencia={localOcorrencia}
        onLocalChange={onLocalChange}
        dataOcorrencia={dataOcorrencia}
        onDataChange={onDataChange}
        envolvidos={envolvidos}
        onEnvolvidosChange={onEnvolvidosChange}
        testemunhas={testemunhas}
        onTestemunhasChange={onTestemunhasChange}
        sigiloDados={sigiloDados}
        onSigiloChange={onSigiloChange}
      />
    </div>
  );
}
