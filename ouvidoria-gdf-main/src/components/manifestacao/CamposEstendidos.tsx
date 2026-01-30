import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPin, Users, Eye, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CamposEstendidosProps {
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

export function CamposEstendidos({
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
}: CamposEstendidosProps) {
  return (
    <div className="space-y-6">
      {/* Local da Ocorrência */}
      <div className="space-y-2">
        <Label htmlFor="local-ocorrencia" className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Onde ocorreu?
        </Label>
        <Input
          id="local-ocorrencia"
          placeholder="Ex: Hospital Regional de Taguatinga, Rua das Flores, 123..."
          value={localOcorrencia}
          onChange={(e) => onLocalChange(e.target.value)}
          className="min-h-[44px]"
          aria-describedby="local-help"
        />
        <p id="local-help" className="text-xs text-muted-foreground">
          Informe o endereço ou local onde o fato ocorreu (opcional)
        </p>
      </div>

      {/* Data da Ocorrência */}
      <div className="space-y-2">
        <Label htmlFor="data-ocorrencia" className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Quando ocorreu?
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="data-ocorrencia"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal min-h-[44px]",
                !dataOcorrencia && "text-muted-foreground"
              )}
              aria-describedby="data-help"
            >
              <CalendarIcon className="mr-2 h-4 w-4" aria-hidden="true" />
              {dataOcorrencia
                ? format(dataOcorrencia, "PPP", { locale: ptBR })
                : "Selecione a data..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 z-50" align="start">
            <Calendar
              mode="single"
              selected={dataOcorrencia || undefined}
              onSelect={(date) => onDataChange(date || null)}
              disabled={(date) => date > new Date()}
              initialFocus
              locale={ptBR}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
        <p id="data-help" className="text-xs text-muted-foreground">
          Informe a data aproximada do ocorrido (opcional)
        </p>
      </div>

      {/* Envolvidos */}
      <div className="space-y-2">
        <Label htmlFor="envolvidos" className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Quem estava envolvido?
        </Label>
        <Textarea
          id="envolvidos"
          placeholder="Descreva as pessoas ou setores envolvidos no ocorrido..."
          value={envolvidos}
          onChange={(e) => onEnvolvidosChange(e.target.value)}
          className="min-h-[80px] resize-y"
          aria-describedby="envolvidos-help"
        />
        <p id="envolvidos-help" className="text-xs text-muted-foreground">
          Identifique servidores, setores ou pessoas envolvidas (opcional)
        </p>
      </div>

      {/* Testemunhas */}
      <div className="space-y-2">
        <Label htmlFor="testemunhas" className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Havia testemunhas?
        </Label>
        <Textarea
          id="testemunhas"
          placeholder="Informe se havia outras pessoas presentes que podem confirmar o ocorrido..."
          value={testemunhas}
          onChange={(e) => onTestemunhasChange(e.target.value)}
          className="min-h-[80px] resize-y"
          aria-describedby="testemunhas-help"
        />
        <p id="testemunhas-help" className="text-xs text-muted-foreground">
          Testemunhas podem ajudar na apuração dos fatos (opcional)
        </p>
      </div>

      {/* Sigilo de Dados */}
      <div className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
        <div className="flex-1 space-y-1">
          <Label
            htmlFor="sigilo-dados"
            className="flex items-center gap-2 text-base font-medium cursor-pointer"
          >
            <ShieldCheck className="h-5 w-5 text-secondary" aria-hidden="true" />
            Solicitar sigilo dos meus dados
          </Label>
          <p id="sigilo-help" className="text-sm text-muted-foreground">
            Seus dados pessoais não serão divulgados ao órgão responsável, apenas à Ouvidoria para
            análise.
          </p>
        </div>
        <Switch
          id="sigilo-dados"
          checked={sigiloDados}
          onCheckedChange={onSigiloChange}
          aria-describedby="sigilo-help"
          className="mt-1"
        />
      </div>
    </div>
  );
}
