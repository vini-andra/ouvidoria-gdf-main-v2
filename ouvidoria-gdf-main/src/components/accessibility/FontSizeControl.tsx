import { Minus, Plus, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccessibility } from "@/hooks/useAccessibility";

const FontSizeControl = () => {
  const { fontSize, increaseFontSize, decreaseFontSize, resetFontSize, fontSizeLabel } = useAccessibility();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-md"
          aria-label={`Ajustar tamanho da fonte. Tamanho atual: ${fontSizeLabel}`}
        >
          <Type className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Ajustar tamanho da fonte</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-popover border-border z-50 min-w-[180px]"
        role="menu"
        aria-label="Opções de tamanho de fonte"
      >
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          Tamanho da Fonte
        </div>
        <DropdownMenuItem 
          onClick={decreaseFontSize}
          className="cursor-pointer gap-2"
          disabled={fontSize <= 0.875}
          aria-label="Diminuir tamanho da fonte"
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
          <span>Diminuir (A-)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={resetFontSize}
          className="cursor-pointer gap-2"
          aria-label="Restaurar tamanho padrão da fonte"
        >
          <Type className="h-4 w-4" aria-hidden="true" />
          <span>Padrão (A)</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={increaseFontSize}
          className="cursor-pointer gap-2"
          disabled={fontSize >= 1.5}
          aria-label="Aumentar tamanho da fonte"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Aumentar (A+)</span>
        </DropdownMenuItem>
        <div className="px-2 py-1.5 text-xs text-muted-foreground border-t border-border mt-1">
          Atual: {fontSizeLabel}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FontSizeControl;
