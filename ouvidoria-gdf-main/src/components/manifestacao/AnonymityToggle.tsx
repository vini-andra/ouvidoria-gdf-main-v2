import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EyeOff, User } from "lucide-react";

interface AnonymityToggleProps {
  isAnonymous: boolean;
  onAnonymousChange: (value: boolean) => void;
  nome: string;
  onNomeChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  errors?: {
    nome?: string;
    email?: string;
  };
}

export function AnonymityToggle({
  isAnonymous,
  onAnonymousChange,
  nome,
  onNomeChange,
  email,
  onEmailChange,
  errors,
}: AnonymityToggleProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          {isAnonymous ? (
            <EyeOff className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          ) : (
            <User className="h-5 w-5 text-primary" aria-hidden="true" />
          )}
          <div>
            <Label 
              htmlFor="anonymous-toggle" 
              className="text-base font-medium cursor-pointer"
            >
              Desejo permanecer anônimo
            </Label>
            <p className="text-sm text-muted-foreground">
              {isAnonymous 
                ? "Sua identidade será preservada" 
                : "Você pode se identificar opcionalmente"}
            </p>
          </div>
        </div>
        <Switch
          id="anonymous-toggle"
          checked={isAnonymous}
          onCheckedChange={onAnonymousChange}
          aria-describedby="anonymous-description"
        />
      </div>

      {isAnonymous && (
        <Alert className="border-accent/50 bg-accent/10 animate-fade-in">
          <EyeOff className="h-4 w-4" />
          <AlertDescription id="anonymous-description">
            Manifestações anônimas não recebem resposta direta por e-mail. 
            Você poderá acompanhar pelo número de protocolo.
          </AlertDescription>
        </Alert>
      )}

      {!isAnonymous && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome (opcional)</Label>
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => onNomeChange(e.target.value)}
              maxLength={255}
              aria-invalid={!!errors?.nome}
              aria-describedby={errors?.nome ? "nome-error" : undefined}
            />
            {errors?.nome && (
              <p id="nome-error" className="text-sm text-destructive">
                {errors.nome}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail (opcional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              maxLength={255}
              aria-invalid={!!errors?.email}
              aria-describedby={errors?.email ? "email-error" : undefined}
            />
            {errors?.email && (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Informe seu e-mail para receber atualizações sobre sua manifestação.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
