import { useEffect } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => void;
    };
  }
}

/**
 * VLibras Widget - Integração com a Suíte VLibras
 * 
 * O VLibras é uma ferramenta gratuita desenvolvida pelo Governo Federal
 * que traduz automaticamente conteúdos digitais para Libras (Língua Brasileira de Sinais).
 * 
 * @see https://www.gov.br/governodigital/pt-br/vlibras
 */
const VLibrasWidget = () => {
  useEffect(() => {
    // Only load if not already loaded
    if (document.querySelector('script[src*="vlibras"]')) {
      return;
    }

    // Create VLibras container
    const widgetDiv = document.createElement("div");
    widgetDiv.setAttribute("vw", "");
    widgetDiv.classList.add("enabled");
    widgetDiv.innerHTML = `
      <div vw-access-button class="active" aria-label="Ativar VLibras para tradução em Libras" role="button" tabindex="0"></div>
      <div vw-plugin-wrapper>
        <div class="vw-plugin-top-wrapper"></div>
      </div>
    `;
    document.body.appendChild(widgetDiv);

    // Load VLibras script
    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget("https://vlibras.gov.br/app");
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount
      const existingWidget = document.querySelector("[vw]");
      const existingScript = document.querySelector('script[src*="vlibras"]');
      if (existingWidget) existingWidget.remove();
      if (existingScript) existingScript.remove();
    };
  }, []);

  return null; // Widget is injected via DOM
};

export default VLibrasWidget;
