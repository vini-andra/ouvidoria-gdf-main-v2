import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  CheckCircle,
  FileText,
  Shield,
  Clock,
  Users,
  Mic,
  Image,
  Video,
  Type
} from "lucide-react";
import Layout from "@/components/Layout";
import HeroBanner from "@/components/home/HeroBanner";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section with Banner */}
      <HeroBanner />

      {/* Canais de Manifestação */}
      <section className="py-12 md:py-16 bg-card">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              Escolha seu canal preferido
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Manifeste-se da forma que for mais conveniente para você
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-3xl mx-auto">
            {[
              { icon: Type, label: "Texto", desc: "50 a 5.000 caracteres" },
              { icon: Mic, label: "Áudio", desc: "Até 5 minutos" },
              { icon: Image, label: "Imagem", desc: "JPG, PNG, WebP" },
              { icon: Video, label: "Vídeo", desc: "MP4, WebM" },
            ].map((channel, index) => (
              <Card
                key={channel.label}
                className="text-center border-2 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
              >
                <CardContent className="pt-6 pb-4">
                  <div
                    className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all"
                    aria-hidden="true"
                  >
                    <channel.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-semibold text-base mb-1">{channel.label}</h3>
                  <p className="text-muted-foreground text-xs">{channel.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section
        id="como-funciona"
        className="py-12 md:py-20 scroll-mt-16"
        aria-labelledby="como-funciona-title"
      >
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium bg-secondary/10 text-secondary rounded-full">
              Passo a passo
            </span>
            <h2
              id="como-funciona-title"
              className="text-2xl md:text-3xl font-bold mb-3"
            >
              Como funciona
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Em apenas 3 passos simples, sua manifestação chega aos órgãos responsáveis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div
                    className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg"
                    aria-hidden="true"
                  >
                    <MessageSquare className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm shadow">
                    1
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">Escolha o Canal</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Selecione como deseja enviar sua manifestação: texto, áudio, imagem ou vídeo.
                </p>
              </div>
              {/* Connector line */}
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-secondary/50" aria-hidden="true" />
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div
                    className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center shadow-lg"
                    aria-hidden="true"
                  >
                    <FileText className="w-10 h-10 text-secondary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm shadow">
                    2
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2">Descreva o Problema</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Relate sua manifestação com detalhes. Nossa IA <strong>IZA</strong> ajuda a categorizar automaticamente.
                </p>
              </div>
              {/* Connector line */}
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-secondary/50 to-accent/50" aria-hidden="true" />
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div
                  className="w-20 h-20 rounded-full bg-accent flex items-center justify-center shadow-lg"
                  aria-hidden="true"
                >
                  <CheckCircle className="w-10 h-10 text-accent-foreground" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow">
                  3
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">Receba o Protocolo</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Guarde seu número de protocolo para acompanhar o andamento da manifestação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section
        className="py-12 md:py-20 bg-muted/50"
        aria-labelledby="beneficios-title"
      >
        <div className="container">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium bg-primary/10 text-primary rounded-full">
              Por que usar
            </span>
            <h2
              id="beneficios-title"
              className="text-2xl md:text-3xl font-bold mb-3"
            >
              Benefícios do Participa DF
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: "100% Seguro",
                description: "Suas informações são protegidas. Você pode se manifestar de forma anônima.",
                color: "primary"
              },
              {
                icon: Clock,
                title: "Rápido e Fácil",
                description: "Processo simplificado que leva menos de 5 minutos para ser concluído.",
                color: "secondary"
              },
              {
                icon: Users,
                title: "Acessível a Todos",
                description: "Interface inclusiva com suporte a leitores de tela e navegação por teclado.",
                color: "accent"
              },
              {
                icon: MessageSquare,
                title: "Múltiplos Canais",
                description: "Envie texto, áudio, imagem ou vídeo conforme sua preferência.",
                color: "primary"
              },
              {
                icon: FileText,
                title: "IA Integrada",
                description: "A IZA categoriza automaticamente sua manifestação para agilizar o processo.",
                color: "secondary"
              },
              {
                icon: CheckCircle,
                title: "Acompanhamento",
                description: "Receba um protocolo único para consultar o status da sua manifestação.",
                color: "accent"
              },
            ].map((benefit) => (
              <Card
                key={benefit.title}
                className="border-0 shadow-sm hover:shadow-md transition-shadow bg-card"
              >
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 mb-4 rounded-xl flex items-center justify-center ${benefit.color === 'primary' ? 'bg-primary/10' :
                        benefit.color === 'secondary' ? 'bg-secondary/10' :
                          'bg-accent/20 dark:bg-accent/10'
                      }`}
                    aria-hidden="true"
                  >
                    <benefit.icon className={`w-6 h-6 ${benefit.color === 'primary' ? 'text-primary' :
                        benefit.color === 'secondary' ? 'text-secondary' :
                          'text-accent dark:text-accent'
                      }`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final com imagem de fundo */}
      <CTASection />

      {/* Footer info */}
      <footer className="py-8 bg-card border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <img
                src={`${import.meta.env.BASE_URL}logo-ouvidoria.png`}
                alt="Logo Ouvidoria GDF"
                className="h-8 w-auto"
              />
              <span>Ouvidoria-Geral do Distrito Federal</span>
            </div>
            <p>© {new Date().getFullYear()} Governo do Distrito Federal. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
