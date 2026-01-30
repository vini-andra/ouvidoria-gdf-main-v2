import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { validateCPF, formatCPF, unformatCPF } from "@/lib/cpf";
import { formatTelefone, unformatTelefone, validateTelefone } from "@/lib/telefone";

const cadastroSchema = z
  .object({
    nome_completo: z
      .string()
      .min(1, "Nome completo é obrigatório")
      .min(3, "Nome deve ter no mínimo 3 caracteres")
      .max(255, "Nome muito longo"),
    cpf: z
      .string()
      .min(1, "CPF é obrigatório")
      .refine((val) => validateCPF(val), "CPF inválido"),
    email: z
      .string()
      .min(1, "E-mail é obrigatório")
      .email("E-mail inválido")
      .max(255, "E-mail muito longo"),
    data_nascimento: z
      .string()
      .min(1, "Data de nascimento é obrigatória")
      .refine((val) => {
        const date = new Date(val);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return age >= 16 && age <= 120;
      }, "Você deve ter entre 16 e 120 anos"),
    sexo: z.enum(["masculino", "feminino", "outro"], {
      required_error: "Selecione o sexo",
    }),
    telefone: z
      .string()
      .optional()
      .refine((val) => !val || validateTelefone(val), "Telefone inválido"),
    password: z
      .string()
      .min(1, "Senha é obrigatória")
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
      .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
      .regex(/[0-9]/, "Senha deve conter pelo menos um número"),
    confirmPassword: z.string().min(1, "Confirme sua senha"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos de uso",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type CadastroFormData = z.infer<typeof cadastroSchema>;

export default function CadastroForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const form = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      nome_completo: "",
      cpf: "",
      email: "",
      data_nascimento: "",
      sexo: undefined,
      telefone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: CadastroFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const { error } = await signUp(data.email, data.password, {
        nome_completo: data.nome_completo,
        cpf: unformatCPF(data.cpf),
        data_nascimento: data.data_nascimento,
        sexo: data.sexo,
        telefone: data.telefone ? unformatTelefone(data.telefone) : null,
      });

      if (error) {
        setError(error.message);
      } else {
        navigate("/dashboard");
      }
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCPFChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const formatted = formatCPF(e.target.value);
    if (formatted.length <= 14) {
      onChange(formatted);
    }
  };

  const handleTelefoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: string) => void
  ) => {
    const formatted = formatTelefone(e.target.value);
    if (formatted.length <= 15) {
      onChange(formatted);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
        aria-label="Formulário de cadastro de nova conta"
      >
        {error && (
          <Alert variant="destructive" role="alert" aria-live="assertive">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="nome_completo"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="cadastro-nome">Nome completo *</FormLabel>
              <FormControl>
                <Input
                  id="cadastro-nome"
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  disabled={isLoading}
                  aria-describedby="cadastro-nome-error"
                  aria-required="true"
                  aria-invalid={!!form.formState.errors.nome_completo}
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  {...field}
                />
              </FormControl>
              <FormMessage id="cadastro-nome-error" role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="cadastro-cpf">CPF *</FormLabel>
              <FormControl>
                <Input
                  id="cadastro-cpf"
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                  autoComplete="off"
                  disabled={isLoading}
                  aria-describedby="cadastro-cpf-error cadastro-cpf-hint"
                  aria-required="true"
                  aria-invalid={!!form.formState.errors.cpf}
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  value={field.value}
                  onChange={(e) => handleCPFChange(e, field.onChange)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <p id="cadastro-cpf-hint" className="text-xs text-muted-foreground">
                Digite apenas os números do seu CPF
              </p>
              <FormMessage id="cadastro-cpf-error" role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="cadastro-email">E-mail *</FormLabel>
              <FormControl>
                <Input
                  id="cadastro-email"
                  type="email"
                  placeholder="seu@email.com"
                  autoComplete="email"
                  disabled={isLoading}
                  aria-describedby="cadastro-email-error"
                  aria-required="true"
                  aria-invalid={!!form.formState.errors.email}
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  {...field}
                />
              </FormControl>
              <FormMessage id="cadastro-email-error" role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data_nascimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="cadastro-data-nascimento">Data de nascimento *</FormLabel>
              <FormControl>
                <Input
                  id="cadastro-data-nascimento"
                  type="date"
                  autoComplete="bday"
                  disabled={isLoading}
                  aria-describedby="cadastro-data-error"
                  aria-required="true"
                  aria-invalid={!!form.formState.errors.data_nascimento}
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  max={new Date().toISOString().split("T")[0]}
                  {...field}
                />
              </FormControl>
              <FormMessage id="cadastro-data-error" role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sexo"
          render={({ field }) => (
            <FormItem>
              <FormLabel id="sexo-group-label">Sexo *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex flex-wrap gap-4"
                  disabled={isLoading}
                  aria-labelledby="sexo-group-label"
                  aria-describedby="cadastro-sexo-error"
                  aria-required="true"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="masculino"
                      id="sexo-masculino"
                      className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    />
                    <label
                      htmlFor="sexo-masculino"
                      className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Masculino
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="feminino"
                      id="sexo-feminino"
                      className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    />
                    <label
                      htmlFor="sexo-feminino"
                      className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Feminino
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="outro"
                      id="sexo-outro"
                      className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    />
                    <label
                      htmlFor="sexo-outro"
                      className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Outro
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage id="cadastro-sexo-error" role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="telefone"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="cadastro-telefone">Telefone (opcional)</FormLabel>
              <FormControl>
                <Input
                  id="cadastro-telefone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  autoComplete="tel"
                  inputMode="numeric"
                  disabled={isLoading}
                  aria-describedby="cadastro-telefone-error"
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  value={field.value}
                  onChange={(e) => handleTelefoneChange(e, field.onChange)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage id="cadastro-telefone-error" role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="cadastro-password">Senha *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="cadastro-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isLoading}
                    aria-describedby="cadastro-password-error cadastro-password-hint"
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
              <FormDescription id="cadastro-password-hint">
                Mínimo 8 caracteres, com letra maiúscula, minúscula e número.
              </FormDescription>
              <FormMessage id="cadastro-password-error" role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="cadastro-confirm-password">Confirmar senha *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="cadastro-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={isLoading}
                    aria-describedby="cadastro-confirm-password-error"
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.confirmPassword}
                    className="pr-10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage id="cadastro-confirm-password-error" role="alert" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  id="cadastro-accept-terms"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                  aria-describedby="cadastro-terms-error"
                  aria-required="true"
                  className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <label
                  htmlFor="cadastro-accept-terms"
                  className="text-sm font-normal cursor-pointer"
                >
                  Li e aceito os{" "}
                  <Link
                    to="/termos"
                    className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                    target="_blank"
                    aria-label="Abrir termos de uso em nova aba"
                  >
                    termos de uso
                  </Link>{" "}
                  e a{" "}
                  <Link
                    to="/privacidade"
                    className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                    target="_blank"
                    aria-label="Abrir política de privacidade em nova aba"
                  >
                    política de privacidade
                  </Link>
                  . *
                </label>
                <FormMessage id="cadastro-terms-error" role="alert" />
              </div>
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
              <span aria-live="polite">Criando conta...</span>
            </>
          ) : (
            "Criar conta"
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link
            to="/auth"
            className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm font-medium"
            aria-label="Ir para página de login"
          >
            Fazer login
          </Link>
        </p>
      </form>
    </Form>
  );
}
