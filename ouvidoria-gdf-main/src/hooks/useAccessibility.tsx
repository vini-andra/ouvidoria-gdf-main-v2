import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AccessibilityContextType {
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  fontSizeLabel: string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const FONT_SIZE_KEY = "participa-df-font-size";
const DEFAULT_FONT_SIZE = 1;
const MIN_FONT_SIZE = 0.875;
const MAX_FONT_SIZE = 1.5;
const STEP = 0.125;

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(FONT_SIZE_KEY);
      return stored ? parseFloat(stored) : DEFAULT_FONT_SIZE;
    }
    return DEFAULT_FONT_SIZE;
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize * 100}%`;
    localStorage.setItem(FONT_SIZE_KEY, fontSize.toString());
  }, [fontSize]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + STEP, MAX_FONT_SIZE));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - STEP, MIN_FONT_SIZE));
  };

  const resetFontSize = () => {
    setFontSize(DEFAULT_FONT_SIZE);
  };

  const getFontSizeLabel = () => {
    const percentage = Math.round(fontSize * 100);
    if (percentage < 100) return `${percentage}% (Menor)`;
    if (percentage === 100) return "100% (Padrão)";
    return `${percentage}% (Maior)`;
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        fontSizeLabel: getFontSizeLabel(),
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
