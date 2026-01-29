import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, User, Mail, Phone, Calendar, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCPF } from "@/lib/cpf";
import { formatTelefone, unformatTelefone, validateTelefone } from "@/lib/telefone";

export default function Perfil() {
  const { profile, user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [telefone, setTelefone] = useState(
    profile?.telefone ? formatTelefone(profile.telefone) : ""
  );

  const handleSave = async () => {
    if (telefone && !validateTelefone(telefone)) {
      toast({
        variant: "destructive",
        title: "Telefone inválido",
        description: "Por favor, insira um telefone válido.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          telefone: telefone ? unformatTelefone(telefone) : null,
        })
        .eq("id", profile?.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível atualizar seu perfil. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR");
  };

  const getSexoLabel = (sexo: string) => {
    const labels: Record<string, string> = {
      masculino: "Masculino",
      feminino: "Feminino",
      outro: "Outro",
    };
    return labels[sexo] || sexo;
  };

  return (
    <Layout>
      <main
        id="main-content"
        className="flex-1 py-8 px-4"
        role="main"
        aria-label="Página de perfil"
      >
        <div className="container max-w-2xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                Voltar
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <CardTitle>{profile?.nome_completo}</CardTitle>
                    <CardDescription>Seus dados cadastrais</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary">{getSexoLabel(profile?.sexo || "")}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">CPF</Label>
                  <p className="font-medium">{formatCPF(profile?.cpf || "")}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm flex items-center gap-2">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    E-mail
                  </Label>
                  <p className="font-medium">{user?.email}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    Data de nascimento
                  </Label>
                  <p className="font-medium">
                    {formatDate(profile?.data_nascimento || "")}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="telefone"
                    className="text-muted-foreground text-sm flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Telefone
                  </Label>
                  {isEditing ? (
                    <Input
                      id="telefone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={telefone}
                      onChange={(e) => {
                        const formatted = formatTelefone(e.target.value);
                        if (formatted.length <= 15) {
                          setTelefone(formatted);
                        }
                      }}
                      inputMode="numeric"
                      autoComplete="tel"
                    />
                  ) : (
                    <p className="font-medium">
                      {profile?.telefone
                        ? formatTelefone(profile.telefone)
                        : "Não informado"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setTelefone(
                          profile?.telefone ? formatTelefone(profile.telefone) : ""
                        );
                      }}
                      disabled={isLoading}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar"
                      )}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Editar telefone
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
}
