import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import bannerImage from "@/assets/banner-ouvidoria-1.png";

const HeroBanner = () => {
  const { user, profile, loading } = useAuth();

  return (
    <section
      className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Banner Image */}
      <div className="absolute inset-0">
        <img
          src={bannerImage}
          alt="Mulher sorrindo em parque - Ouvidoria do GDF"
          className="w-full h-full object-cover object-center md:object-right-top"
          loading="eager"
        />
      </div>

      {/* Overlay for text legibility - adapts to light/dark mode */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent dark:from-background/95 dark:via-background/80 dark:to-background/30"
        aria-hidden="true"
      />

      {/* Additional dark mode overlay for better contrast */}
      <div
        className="absolute inset-0 hidden dark:block bg-gradient-to-t from-background/60 via-transparent to-background/40"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container relative z-10 h-full min-h-[500px] md:min-h-[600px] lg:min-h-[700px] flex items-center">
        <div className="max-w-xl py-16 md:py-24">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-accent/20 text-accent dark:text-accent rounded-full backdrop-blur-sm">
            Sistema Oficial de Ouvidoria do GDF
          </span>

          <h1
            id="hero-title"
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground dark:text-foreground mb-6 leading-tight drop-shadow-sm"
          >
            Sua voz constrói um <span className="text-accent">DF melhor</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/90 dark:text-foreground/90 mb-10 leading-relaxed drop-shadow-sm">
            Registre elogios, sugestões, reclamações ou denúncias de forma fácil e acessível.
            Escolha entre texto, áudio, imagem ou vídeo.
          </p>

          {/* CTAs baseados no estado de autenticação */}
          {loading ? (
            <div className="h-16" aria-hidden="true" />
          ) : user && profile ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 py-6 h-auto font-semibold shadow-lg group"
              >
                <Link to="/manifestacao">
                  Nova Manifestação
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 dark:bg-card/50 border-2 border-primary-foreground/30 dark:border-foreground/30 text-primary-foreground dark:text-foreground hover:bg-white/20 dark:hover:bg-card/70 text-lg px-8 py-6 h-auto font-medium backdrop-blur-sm"
              >
                <Link to="/dashboard">Meu Painel</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Botões de CTA - Principal e Secundário */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                {/* Botão principal - Registrar Manifestação */}
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto min-h-[56px] bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 text-base px-8 font-bold shadow-xl hover:shadow-2xl transition-all duration-200 group"
                >
                  <Link
                    to="/escolha-identificacao"
                    aria-label="Registrar nova manifestação - escolher forma de identificação"
                  >
                    <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
                    <span className="text-base">Registrar Manifestação</span>
                  </Link>
                </Button>

                {/* Botão secundário - Consultar Protocolo */}
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto min-h-[56px] bg-white/10 dark:bg-card/50 border-2 border-primary-foreground/30 dark:border-foreground/30 text-primary-foreground dark:text-foreground hover:bg-white/20 dark:hover:bg-card/70 text-base px-8 font-medium backdrop-blur-sm"
                >
                  <Link
                    to="/consulta"
                    aria-label="Consultar protocolo de manifestação existente"
                  >
                    <Search className="h-5 w-5 mr-2" aria-hidden="true" />
                    <span className="text-base">Consultar Protocolo</span>
                  </Link>
                </Button>
              </div>

              {/* Texto auxiliar para contexto */}
              <p className="text-primary-foreground/70 dark:text-foreground/70 text-sm">
                Já enviou uma manifestação? Use "Consultar Protocolo" para acompanhar
              </p>

              <p className="text-primary-foreground/80 dark:text-foreground/80 text-sm">
                Já tem conta?{" "}
                <Link
                  to="/auth"
                  className="underline hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm font-medium"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          )}

          <div className="mt-6">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-primary-foreground/70 dark:text-foreground/70 hover:text-primary-foreground dark:hover:text-foreground hover:bg-white/10 dark:hover:bg-card/30"
            >
              <a href="#como-funciona">Como Funciona</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
