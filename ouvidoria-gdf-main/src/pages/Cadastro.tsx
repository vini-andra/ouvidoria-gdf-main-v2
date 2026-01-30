import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import CadastroForm from "@/components/auth/CadastroForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Cadastro() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-background"
        role="status"
        aria-label="Carregando"
      >
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Carregando...</span>
      </div>
    );
  }

  return (
    <Layout>
      <main
        id="main-content"
        className="flex-1 flex items-center justify-center py-12 px-4"
        role="main"
        aria-label="Página de cadastro"
      >
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
            <CardDescription>
              Cadastre-se para acompanhar suas manifestações e receber respostas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CadastroForm />
          </CardContent>
        </Card>
      </main>
    </Layout>
  );
}
