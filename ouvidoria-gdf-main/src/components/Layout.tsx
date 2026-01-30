import { ReactNode } from "react";
import Header from "./Header";
import SkipLink from "./SkipLink";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <SkipLink />
      <Header />
      <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="border-t bg-card py-6" role="contentinfo">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Governo do Distrito Federal - Todos os direitos reservados</p>
          <p className="mt-1">Sistema de Ouvidoria Digital - Participa DF</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
