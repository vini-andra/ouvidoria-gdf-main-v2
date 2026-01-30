import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import { validateCPF, formatCPF, unformatCPF } from "@/lib/cpf";
import { formatTelefone, unformatTelefone, validateTelefone } from "@/lib/telefone";

const profileSchema = z.object({
    nome_completo: z
        .string()
        .min(1, "Nome completo é obrigatório")
        .min(3, "Nome deve ter no mínimo 3 caracteres")
        .max(255, "Nome muito longo"),
    cpf: z
        .string()
        .min(1, "CPF é obrigatório")
        .refine((val) => validateCPF(val), "CPF inválido"),
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
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileCompletionForm() {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { completeProfile } = useAuth();
    const navigate = useNavigate();

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            nome_completo: "",
            cpf: "",
            data_nascimento: "",
            sexo: undefined,
            telefone: "",
        },
    });

    const onSubmit = async (data: ProfileFormData) => {
        setError(null);
        setIsLoading(true);

        try {
            const { error } = await completeProfile({
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
            setError("Erro ao criar perfil. Tente novamente.");
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
                aria-label="Formulário de completar perfil"
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
                            <FormLabel htmlFor="profile-nome">Nome completo *</FormLabel>
                            <FormControl>
                                <Input
                                    id="profile-nome"
                                    placeholder="Seu nome completo"
                                    autoComplete="name"
                                    disabled={isLoading}
                                    aria-required="true"
                                    aria-invalid={!!form.formState.errors.nome_completo}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage role="alert" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="cpf"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="profile-cpf">CPF *</FormLabel>
                            <FormControl>
                                <Input
                                    id="profile-cpf"
                                    placeholder="000.000.000-00"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    disabled={isLoading}
                                    aria-required="true"
                                    aria-invalid={!!form.formState.errors.cpf}
                                    value={field.value}
                                    onChange={(e) => handleCPFChange(e, field.onChange)}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                    ref={field.ref}
                                />
                            </FormControl>
                            <FormMessage role="alert" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="data_nascimento"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="profile-data-nascimento">Data de nascimento *</FormLabel>
                            <FormControl>
                                <Input
                                    id="profile-data-nascimento"
                                    type="date"
                                    autoComplete="bday"
                                    disabled={isLoading}
                                    aria-required="true"
                                    aria-invalid={!!form.formState.errors.data_nascimento}
                                    max={new Date().toISOString().split("T")[0]}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage role="alert" />
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
                                    aria-required="true"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="masculino" id="profile-sexo-masculino" />
                                        <label htmlFor="profile-sexo-masculino" className="text-sm font-medium cursor-pointer">
                                            Masculino
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="feminino" id="profile-sexo-feminino" />
                                        <label htmlFor="profile-sexo-feminino" className="text-sm font-medium cursor-pointer">
                                            Feminino
                                        </label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="outro" id="profile-sexo-outro" />
                                        <label htmlFor="profile-sexo-outro" className="text-sm font-medium cursor-pointer">
                                            Outro
                                        </label>
                                    </div>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage role="alert" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="telefone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel htmlFor="profile-telefone">Telefone (opcional)</FormLabel>
                            <FormControl>
                                <Input
                                    id="profile-telefone"
                                    type="tel"
                                    placeholder="(00) 00000-0000"
                                    autoComplete="tel"
                                    inputMode="numeric"
                                    disabled={isLoading}
                                    value={field.value}
                                    onChange={(e) => handleTelefoneChange(e, field.onChange)}
                                    onBlur={field.onBlur}
                                    name={field.name}
                                    ref={field.ref}
                                />
                            </FormControl>
                            <FormMessage role="alert" />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    size="lg"
                    aria-busy={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                            <span aria-live="polite">Salvando...</span>
                        </>
                    ) : (
                        "Salvar perfil"
                    )}
                </Button>
            </form>
        </Form>
    );
}
