import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./hooks/useAuth";
import { AccessibilityProvider } from "./hooks/useAccessibility";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Manifestacao from "./pages/Manifestacao";
import Confirmacao from "./pages/Confirmacao";
import Install from "./pages/Install";
import Consulta from "./pages/Consulta";
import Auth from "./pages/Auth";
import Cadastro from "./pages/Cadastro";
import RecuperarSenha from "./pages/RecuperarSenha";
import Dashboard from "./pages/Dashboard";
import Perfil from "./pages/Perfil";
import Acompanhamento from "./pages/Acompanhamento";
import NotFound from "./pages/NotFound";
import OfflineIndicator from "./components/OfflineIndicator";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import VLibrasWidget from "./components/accessibility/VLibrasWidget";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <AccessibilityProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter basename={import.meta.env.BASE_URL}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/manifestacao" element={<Manifestacao />} />
                  <Route path="/confirmacao" element={<Confirmacao />} />
                  <Route path="/install" element={<Install />} />
                  <Route path="/consulta" element={<Consulta />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/cadastro" element={<Cadastro />} />
                  <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/perfil"
                    element={
                      <ProtectedRoute>
                        <Perfil />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/acompanhamento/:protocolo" element={<Acompanhamento />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              <OfflineIndicator />
              <VLibrasWidget />
            </TooltipProvider>
          </AuthProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
