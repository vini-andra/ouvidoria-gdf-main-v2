import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import ctaBackground from "@/assets/WhatsApp Image 2026-01-29 at 17.17.28.jpeg";

const CTASection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden" aria-labelledby="cta-title">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={ctaBackground}
          alt=""
          className="w-full h-full object-cover object-center"
          loading="lazy"
          aria-hidden="true"
        />
      </div>

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      <div className="container relative z-10 text-center">
        <h2 id="cta-title" className="text-2xl md:text-4xl font-bold text-white mb-4">
          Pronto para participar?
        </h2>
        <p className="text-white/90 mb-8 max-w-lg mx-auto text-lg">
          Sua participação é fundamental para construir um Distrito Federal melhor para todos.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 h-auto font-semibold shadow-xl group"
        >
          <Link to="/manifestacao">
            Começar Agora
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>

        <p className="text-white/70 text-sm mt-6">
          Você pode se manifestar de forma anônima ou identificada
        </p>
      </div>
    </section>
  );
};

export default CTASection;
