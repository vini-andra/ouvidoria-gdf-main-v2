import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Search, User, LogOut, FileText } from "lucide-react";
import { useState } from "react";
import { ManifestacaoList } from "@/components/dashboard/ManifestacaoList";

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [protocoloBusca, setProtocoloBusca] = useState("");

  // Formata o protocolo no padrão OUV-AAAAMMDD-XXXXXX
  const formatProtocolo = (value: string) => {
    // Remove tudo que não seja letra ou número
    const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

    // Aplica a máscara: OUV-AAAAMMDD-XXXXXX
    let formatted = "";
    for (let i = 0; i < cleaned.length && i < 17; i++) {
      if (i === 3 || i === 11) {
        formatted += "-";
      }
      formatted += cleaned[i];
    }
    return formatted;
  };

  const handleProtocoloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatProtocolo(e.target.value);
    setProtocoloBusca(formatted);
  };

  const handleBuscarProtocolo = (e: React.FormEvent) => {
    e.preventDefault();
    if (protocoloBusca.trim()) {
      navigate(`/acompanhamento/${encodeURIComponent(protocoloBusca.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const primeiroNome = profile?.nome_completo.split(" ")[0] || "Usuário";

  return (
    <Layout>
      <main
        id="main-content"
        className="flex-1 py-8 px-4"
        role="main"
        aria-label="Painel do usuário"
      >
        <div className="container max-w-4xl mx-auto space-y-8">
          {/* Header do Dashboard */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Olá, {primeiroNome}!
              </h1>
              <p className="text-muted-foreground">Bem-vindo ao seu painel de manifestações</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild className="gap-2">
                <Link to="/perfil">
                  <User className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Meu Perfil</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="gap-2 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>

          {/* CTA Principal */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h2 className="text-lg font-semibold text-foreground">
                    Registrar nova manifestação
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Envie reclamações, sugestões, elogios ou denúncias
                  </p>
                </div>
                <Button asChild size="lg" className="gap-2 w-full sm:w-auto">
                  <Link to="/escolha-identificacao">
                    <Plus className="h-5 w-5" aria-hidden="true" />
                    Nova Manifestação
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Minhas Manifestações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                Suas manifestações recentes
              </CardTitle>
              <CardDescription>
                Acompanhe o status das suas manifestações registradas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user?.id ? (
                <ManifestacaoList userId={user.id} />
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-12 text-center"
                  role="status"
                >
                  <FileText
                    className="h-12 w-12 text-muted-foreground/50 mb-4"
                    aria-hidden="true"
                  />
                  <p className="text-muted-foreground">Carregando suas manifestações...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Buscar por Protocolo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" aria-hidden="true" />
                Acompanhar por protocolo
              </CardTitle>
              <CardDescription>
                Consulte o status de qualquer manifestação pelo número do protocolo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBuscarProtocolo} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label htmlFor="protocolo-busca" className="sr-only">
                    Número do protocolo
                  </label>
                  <Input
                    id="protocolo-busca"
                    type="text"
                    placeholder="Ex: OUV-20260101-000001"
                    value={protocoloBusca}
                    onChange={handleProtocoloChange}
                    aria-describedby="protocolo-hint"
                    className="uppercase"
                  />
                  <p id="protocolo-hint" className="sr-only">
                    Digite o número do protocolo da manifestação que deseja consultar
                  </p>
                </div>
                <Button type="submit" className="gap-2">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Buscar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
}
