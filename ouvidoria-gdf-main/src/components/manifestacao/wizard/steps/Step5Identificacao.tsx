import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserX, User, Mail, AlertTriangle, LogIn, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

interface Step5IdentificacaoProps {
  isAnonymous: boolean;
  onAnonymousChange: (value: boolean) => void;
  nome: string;
  onNomeChange: (value: string) => void;
  email: string;
  onEmailChange: (value: string) => void;
  aceiteLGPD: boolean;
  onAceiteLGPDChange: (value: boolean) => void;
  errors?: {
    nome?: string;
    email?: string;
    aceiteLGPD?: string;
  };
}

export function Step5Identificacao({
  isAnonymous,
  onAnonymousChange,
  nome,
  onNomeChange,
  email,
  onEmailChange,
  aceiteLGPD,
  onAceiteLGPDChange,
  errors = {},
}: Step5IdentificacaoProps) {
  const { user, profile } = useAuth();
  const [useProfileData, setUseProfileData] = useState(true);

  // If user is logged in, use their profile data
  const effectiveNome = user && useProfileData && profile ? profile.nome_completo : nome;
  const effectiveEmail = user && useProfileData ? user.email || "" : email;

  const handleUseProfileData = (checked: boolean) => {
    setUseProfileData(checked);
    if (checked && profile) {
      onNomeChange(profile.nome_completo);
      onEmailChange(user?.email || "");
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Escolha se deseja se identificar ou permanecer anônimo. Manifestações identificadas permitem
        acompanhamento mais detalhado.
      </p>

      {/* Anonymous Toggle */}
      <Card className={isAnonymous ? "border-primary/50 bg-primary/5" : ""}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isAnonymous ? (
                <UserX className="h-5 w-5 text-primary" />
              ) : (
                <User className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <CardTitle className="text-base">Manifestação Anônima</CardTitle>
                <CardDescription>Sua identidade será preservada</CardDescription>
              </div>
            </div>
            <Switch
              id="anonymous-toggle"
              checked={isAnonymous}
              onCheckedChange={onAnonymousChange}
              aria-label="Alternar manifestação anônima"
            />
          </div>
        </CardHeader>
        {isAnonymous && (
          <CardContent className="pt-0">
            <Alert
              variant="default"
              className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
            >
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>Atenção:</strong> Manifestações anônimas não recebem respostas por e-mail.
                Você poderá acompanhar apenas pelo número do protocolo.
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>

      {/* Identification Fields (shown when not anonymous) */}
      {!isAnonymous && (
        <div className="space-y-4">
          {/* If user is logged in */}
          {user ? (
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-base text-green-800 dark:text-green-200">
                    Você está logado
                  </CardTitle>
                </div>
                <CardDescription className="text-green-700 dark:text-green-300">
                  Seus dados de cadastro serão utilizados automaticamente.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-profile-data"
                    checked={useProfileData}
                    onCheckedChange={handleUseProfileData}
                  />
                  <Label htmlFor="use-profile-data" className="text-sm">
                    Usar dados do meu perfil
                  </Label>
                </div>

                {useProfileData && profile && (
                  <div className="bg-background/50 rounded-md p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.nome_completo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            /* If user is not logged in */
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Dados de Identificação</CardTitle>
                </div>
                <CardDescription>
                  Preencha seus dados para receber atualizações sobre sua manifestação.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Login suggestion */}
                <Alert>
                  <LogIn className="h-4 w-4" />
                  <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span>Já possui cadastro?</span>
                    <Button variant="link" className="h-auto p-0" asChild>
                      <Link to="/auth?returnTo=/manifestacao">
                        Faça login para preencher automaticamente
                      </Link>
                    </Button>
                  </AlertDescription>
                </Alert>

                {/* Name field */}
                <div className="space-y-2">
                  <Label htmlFor="nome">
                    Nome Completo <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nome"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={nome}
                    onChange={(e) => onNomeChange(e.target.value)}
                    aria-invalid={!!errors.nome}
                    aria-describedby={errors.nome ? "nome-error" : undefined}
                  />
                  {errors.nome && (
                    <p id="nome-error" className="text-sm text-destructive" role="alert">
                      {errors.nome}
                    </p>
                  )}
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    E-mail <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-destructive" role="alert">
                      {errors.email}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Você receberá atualizações sobre sua manifestação neste e-mail.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manual input when logged in but not using profile */}
          {user && !useProfileData && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Dados Alternativos</CardTitle>
                <CardDescription>
                  Preencha caso deseje usar dados diferentes do seu perfil.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome-alt">Nome Completo</Label>
                  <Input
                    id="nome-alt"
                    type="text"
                    placeholder="Digite seu nome completo"
                    value={nome}
                    onChange={(e) => onNomeChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-alt">E-mail</Label>
                  <Input
                    id="email-alt"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* LGPD Consent Checkbox */}
      <Card className="border-2">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="lgpd-consent"
              checked={aceiteLGPD}
              onCheckedChange={(checked) => onAceiteLGPDChange(checked === true)}
              aria-describedby={errors.aceiteLGPD ? "lgpd-error" : undefined}
              aria-required="true"
              aria-invalid={!!errors.aceiteLGPD}
              className="mt-1"
            />
            <div className="space-y-1">
              <label
                htmlFor="lgpd-consent"
                className="text-sm font-medium cursor-pointer leading-relaxed"
              >
                Li e aceito a{" "}
                <Link
                  to="/privacidade"
                  className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                  target="_blank"
                  aria-label="Abrir política de privacidade em nova aba"
                >
                  Política de Privacidade
                </Link>{" "}
                e os{" "}
                <Link
                  to="/termos"
                  className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                  target="_blank"
                  aria-label="Abrir termos de uso em nova aba"
                >
                  Termos de Uso
                </Link>
                , conforme a Lei Geral de Proteção de Dados (LGPD). *
              </label>
              {errors.aceiteLGPD && (
                <p id="lgpd-error" className="text-sm text-destructive" role="alert">
                  {errors.aceiteLGPD}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy note */}
      <p className="text-xs text-muted-foreground text-center">
        Seus dados são protegidos de acordo com a Lei Geral de Proteção de Dados (LGPD).
        {!isAnonymous &&
          " O e-mail informado será usado apenas para comunicações sobre esta manifestação."}
      </p>
    </div>
  );
}
