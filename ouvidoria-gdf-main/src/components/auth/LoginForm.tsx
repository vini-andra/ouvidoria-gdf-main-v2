import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(8, "Senha deve ter no mínimo 8 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await signIn(data.email, data.password);

      if (error) {
        setError(error.message);
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
        aria-label="Formulário de login"
      >
        {error && (
          <Alert variant="destructive" role="alert" aria-live="assertive">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="login-email">E-mail</FormLabel>
              <FormControl>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="username email"
                  disabled={isLoading}
                  aria-describedby="login-email-error login-email-hint"
                  aria-required="true"
                  aria-invalid={!!form.formState.errors.email}
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  {...field}
                />
              </FormControl>
              <p id="login-email-hint" className="sr-only">
                Digite o e-mail cadastrado na sua conta
              </p>
              <FormMessage id="login-email-error" role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="login-password">Senha</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={isLoading}
                    aria-describedby="login-password-error login-password-hint"
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.password}
                    className="pr-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <p id="login-password-hint" className="sr-only">
                Digite sua senha de acesso
              </p>
              <FormMessage id="login-password-error" role="alert" />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end">
          <Link
            to="/recuperar-senha"
            className="text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
            aria-label="Recuperar senha esquecida"
          >
            Esqueci minha senha
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          disabled={isLoading}
          size="lg"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              <span aria-live="polite">Entrando...</span>
            </>
          ) : (
            "Entrar"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link
            to="/cadastro"
            className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm font-medium"
            aria-label="Criar uma nova conta"
          >
            Criar conta
          </Link>
        </p>
      </form>
    </Form>
  );
}
