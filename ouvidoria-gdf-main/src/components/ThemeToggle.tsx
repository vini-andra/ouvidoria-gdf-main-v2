import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./ThemeProvider";

const ThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Tema claro ativado";
      case "dark":
        return "Tema escuro ativado";
      case "system":
        return `Tema do sistema (${resolvedTheme === "dark" ? "escuro" : "claro"})`;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-md"
          aria-label={`Alterar tema. ${getThemeLabel()}`}
        >
          <Sun 
            className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" 
            aria-hidden="true"
          />
          <Moon 
            className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" 
            aria-hidden="true"
          />
          <span className="sr-only">Alterar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-popover border-border z-50"
        role="menu"
        aria-label="Opções de tema"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="cursor-pointer gap-2"
          role="menuitemradio"
          aria-checked={theme === "light"}
        >
          <Sun className="h-4 w-4" aria-hidden="true" />
          <span>Claro</span>
          {theme === "light" && (
            <span className="sr-only">(selecionado)</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="cursor-pointer gap-2"
          role="menuitemradio"
          aria-checked={theme === "dark"}
        >
          <Moon className="h-4 w-4" aria-hidden="true" />
          <span>Escuro</span>
          {theme === "dark" && (
            <span className="sr-only">(selecionado)</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="cursor-pointer gap-2"
          role="menuitemradio"
          aria-checked={theme === "system"}
        >
          <Monitor className="h-4 w-4" aria-hidden="true" />
          <span>Sistema</span>
          {theme === "system" && (
            <span className="sr-only">(selecionado)</span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
