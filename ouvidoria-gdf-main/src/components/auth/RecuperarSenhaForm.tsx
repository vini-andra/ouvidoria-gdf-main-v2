import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
import { Loader2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

const recuperarSenhaSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório")
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),
});

type RecuperarSenhaFormData = z.infer<typeof recuperarSenhaSchema>;

export default function RecuperarSenhaForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RecuperarSenhaFormData>({
    resolver: zodResolver(recuperarSenhaSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: RecuperarSenhaFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/redefinir-senha`;

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        // Mensagem genérica para evitar enumeration de emails
        if (error.message.includes("rate limit")) {
          setError("Muitas tentativas. Aguarde alguns minutos e tente novamente.");
        } else {
          // Sempre mostra sucesso para evitar enumeration
          setSuccess(true);
        }
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Erro ao processar solicitação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center" role="status" aria-live="polite">
        <div className="flex justify-center">
          <div className="rounded-full bg-success/10 p-3">
            <CheckCircle className="h-8 w-8 text-success" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">E-mail enviado!</h2>
          <p className="text-muted-foreground">
            Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua
            senha.
          </p>
          <p className="text-sm text-muted-foreground">Verifique também sua pasta de spam.</p>
        </div>

        <div className="pt-4 space-y-3">
          <Button
            asChild
            variant="outline"
            className="w-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <Link to="/auth" aria-label="Voltar para página de login">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Voltar para login
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={() => {
              setSuccess(false);
              form.reset();
            }}
            aria-label="Tentar novamente com outro e-mail"
          >
            Tentar com outro e-mail
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
        aria-label="Formulário de recuperação de senha"
      >
        <div className="space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            Digite o e-mail cadastrado na sua conta e enviaremos um link para redefinir sua senha.
          </p>
        </div>

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
              <FormLabel htmlFor="recuperar-email">E-mail</FormLabel>
              <FormControl>
                <Input
                  id="recuperar-email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  disabled={isLoading}
                  aria-describedby="recuperar-email-error recuperar-email-hint"
                  aria-required="true"
                  aria-invalid={!!form.formState.errors.email}
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  {...field}
                />
              </FormControl>
              <p id="recuperar-email-hint" className="sr-only">
                Digite o e-mail que você usou para criar sua conta
              </p>
              <FormMessage id="recuperar-email-error" role="alert" />
            </FormItem>
          )}
        />

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
              <span aria-live="polite">Enviando...</span>
            </>
          ) : (
            "Enviar link de recuperação"
          )}
        </Button>

        <div className="text-center">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
            aria-label="Voltar para página de login"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar para login
          </Link>
        </div>
      </form>
    </Form>
  );
}
