import { Accessibility } from "lucide-react";
import FontSizeControl from "./FontSizeControl";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * Barra de Acessibilidade - Controles nativos de acessibilidade
 *
 * Implementa controles nativos seguindo WCAG 2.1 AA:
 * - Controle de tamanho de fonte (1.4.4 Redimensionamento de Texto)
 * - Seletor de tema claro/escuro (1.4.3 Contraste Mínimo)
 *
 * O VLibras é carregado separadamente como widget flutuante.
 */
const AccessibilityBar = () => {
  return (
    <div
      className="flex items-center gap-1"
      role="toolbar"
      aria-label="Ferramentas de acessibilidade"
    >
      <span className="sr-only">Ferramentas de acessibilidade</span>
      <FontSizeControl />
      <ThemeToggle />
    </div>
  );
};

export default AccessibilityBar;
