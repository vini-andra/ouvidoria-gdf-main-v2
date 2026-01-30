import { useState, useCallback } from "react";

export interface WizardStep {
  id: number;
  name: string;
  description: string;
  isOptional: boolean;
}

export const WIZARD_STEPS: WizardStep[] = [
  { id: 1, name: "Relato", description: "Descreva sua manifestação", isOptional: false },
  { id: 2, name: "Assunto", description: "Tipo e órgão responsável", isOptional: false },
  { id: 3, name: "Informações", description: "Dados complementares", isOptional: true },
  { id: 4, name: "Resumo", description: "Revise os dados", isOptional: false },
  { id: 5, name: "Identificação", description: "Seus dados pessoais", isOptional: false },
  { id: 6, name: "Anexos", description: "Arquivos adicionais", isOptional: true },
  { id: 7, name: "Protocolo", description: "Confirmação final", isOptional: false },
];

export type StepStatus = "pending" | "active" | "completed" | "error";

export interface UseManifestacaoWizardReturn {
  currentStep: number;
  steps: WizardStep[];
  stepStatuses: StepStatus[];
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  setStepStatus: (step: number, status: StepStatus) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  canNavigateToStep: (step: number) => boolean;
  progressPercentage: number;
}

export function useManifestacaoWizard(initialStep = 1): UseManifestacaoWizardReturn {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [stepStatuses, setStepStatuses] = useState<StepStatus[]>(
    WIZARD_STEPS.map((_, index) => (index === 0 ? "active" : "pending"))
  );

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === WIZARD_STEPS.length;

  const progressPercentage = Math.round(((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100);

  const canNavigateToStep = useCallback(
    (step: number): boolean => {
      // Can always go back to completed steps
      if (step < currentStep) {
        return stepStatuses[step - 1] === "completed" || step < currentStep;
      }
      // Can only go forward if current step is completed
      return step === currentStep + 1 && stepStatuses[currentStep - 1] === "completed";
    },
    [currentStep, stepStatuses]
  );

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 1 && step <= WIZARD_STEPS.length) {
        // Only allow going back, not forward (unless completed)
        if (step <= currentStep || canNavigateToStep(step)) {
          setStepStatuses((prev) => {
            const newStatuses = [...prev];
            newStatuses[currentStep - 1] =
              newStatuses[currentStep - 1] === "error" ? "error" : "completed";
            newStatuses[step - 1] = "active";
            return newStatuses;
          });
          setCurrentStep(step);
        }
      }
    },
    [currentStep, canNavigateToStep]
  );

  const nextStep = useCallback(() => {
    if (!isLastStep) {
      setStepStatuses((prev) => {
        const newStatuses = [...prev];
        newStatuses[currentStep - 1] = "completed";
        newStatuses[currentStep] = "active";
        return newStatuses;
      });
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, isLastStep]);

  const previousStep = useCallback(() => {
    if (!isFirstStep) {
      setStepStatuses((prev) => {
        const newStatuses = [...prev];
        newStatuses[currentStep - 1] = "pending";
        newStatuses[currentStep - 2] = "active";
        return newStatuses;
      });
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep, isFirstStep]);

  const setStepStatus = useCallback((step: number, status: StepStatus) => {
    if (step >= 1 && step <= WIZARD_STEPS.length) {
      setStepStatuses((prev) => {
        const newStatuses = [...prev];
        newStatuses[step - 1] = status;
        return newStatuses;
      });
    }
  }, []);

  return {
    currentStep,
    steps: WIZARD_STEPS,
    stepStatuses,
    goToStep,
    nextStep,
    previousStep,
    setStepStatus,
    isFirstStep,
    isLastStep,
    canNavigateToStep,
    progressPercentage,
  };
}
