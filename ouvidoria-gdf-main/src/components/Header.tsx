import { Link } from "react-router-dom";
import AccessibilityBar from "./accessibility/AccessibilityBar";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { User, LogOut, LogIn, UserPlus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, profile, signOut, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm" role="banner">
      <div className="container flex h-14 sm:h-16 items-center justify-between gap-2 relative">
        {/* Logo - esquerda no mobile e desktop */}
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shrink-0 sm:relative absolute left-4 sm:left-auto"
          aria-label="Ir para página inicial do Participa DF"
        >
          <img
            src={`${import.meta.env.BASE_URL}logo-ouvidoria.png`}
            alt="Logo Ouvidoria GDF"
            className="h-10 sm:h-[86px] w-auto"
          />
          {/* Texto visível apenas no desktop */}
          <div className="hidden sm:flex flex-col">
            <span className="text-lg font-semibold text-foreground leading-tight">
              Participa DF
            </span>
            <span className="text-xs text-muted-foreground">
              Sistema de Ouvidoria
            </span>
          </div>
        </Link>

        {/* Texto "Participa DF" centralizado - apenas mobile */}
        <Link
          to="/"
          className="sm:hidden text-base font-semibold text-foreground absolute left-1/2 -translate-x-1/2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Ir para página inicial do Participa DF"
        >
          Participa DF
        </Link>

        {/* Navegação - direita */}
        <nav
          className="flex items-center gap-1 sm:gap-2 absolute right-4 sm:relative sm:right-auto"
          role="navigation"
          aria-label="Navegação principal e acesso à conta"
        >
          {/* Acessibilidade - escondido em telas muito pequenas */}
          <div className="hidden xs:flex">
            <AccessibilityBar />
          </div>

          {!loading && (
            <>
              {user ? (
                // Usuário autenticado - Menu dropdown
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="gap-1 sm:gap-2 min-h-[40px] sm:min-h-[44px] px-2 sm:px-4 bg-accent text-accent-foreground hover:bg-accent/90"
                      aria-label={`Menu do usuário${profile ? `: ${profile.nome_completo.split(" ")[0]}` : ""}`}
                      aria-haspopup="menu"
                    >
                      <User className="h-4 w-4" aria-hidden="true" />
                      {profile && (
                        <span className="hidden sm:inline max-w-[100px] truncate">
                          {profile.nome_completo.split(" ")[0]}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-popover z-50">
                    {/* Acessibilidade no menu dropdown para mobile */}
                    <div className="flex xs:hidden items-center justify-center gap-1 px-2 py-2 border-b">
                      <AccessibilityBar />
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        Meu Painel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/perfil" className="cursor-pointer">
                        Meu Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/escolha-identificacao" className="cursor-pointer">
                        Nova Manifestação
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/consulta" className="cursor-pointer gap-2">
                        <Search className="h-4 w-4" aria-hidden="true" />
                        Consultar Protocolo
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={signOut}
                      className="cursor-pointer text-destructive focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Usuário NÃO autenticado - Menu simplificado
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="default"
                      size="sm"
                      className="min-h-[40px] sm:min-h-[44px] px-3 sm:px-4 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-sm sm:hidden"
                      aria-label="Menu de acesso"
                      aria-haspopup="menu"
                    >
                      <User className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 bg-popover z-50">
                    {/* Acessibilidade no menu dropdown para mobile */}
                    <div className="flex items-center justify-center gap-1 px-2 py-2 border-b">
                      <AccessibilityBar />
                    </div>
                    <DropdownMenuItem asChild>
                      <Link to="/auth" className="cursor-pointer gap-2">
                        <LogIn className="h-4 w-4" aria-hidden="true" />
                        Entrar
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/cadastro" className="cursor-pointer gap-2">
                        <UserPlus className="h-4 w-4" aria-hidden="true" />
                        Criar Conta
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/consulta" className="cursor-pointer gap-2">
                        <Search className="h-4 w-4" aria-hidden="true" />
                        Consultar Protocolo
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {/* Botão de usuário para desktop */}
              {!user && (
                <div className="hidden sm:flex items-center" role="group" aria-label="Menu de acesso">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        className="h-11 w-11 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 data-[state=open]:bg-accent shadow-sm"
                        aria-label="Menu de acesso"
                        aria-haspopup="menu"
                      >
                        <User className="h-5 w-5" aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 bg-popover">
                      <DropdownMenuItem asChild className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <Link to="/auth" className="cursor-pointer gap-2">
                          <LogIn className="h-4 w-4" aria-hidden="true" />
                          Entrar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <Link to="/cadastro" className="cursor-pointer gap-2">
                          <UserPlus className="h-4 w-4" aria-hidden="true" />
                          Criar Conta
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <Link to="/consulta" className="cursor-pointer gap-2">
                          <Search className="h-4 w-4" aria-hidden="true" />
                          Consultar Protocolo
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
