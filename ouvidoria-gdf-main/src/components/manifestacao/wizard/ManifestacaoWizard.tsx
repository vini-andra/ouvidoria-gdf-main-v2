import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { StepProgress } from "./StepProgress";
import { useManifestacaoWizard, WIZARD_STEPS } from "@/hooks/useManifestacaoWizard";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface ManifestacaoWizardProps {
  children: (props: {
    currentStep: number;
    goToStep: (step: number) => void;
    nextStep: () => void;
    previousStep: () => void;
    setStepStatus: (step: number, status: "pending" | "active" | "completed" | "error") => void;
  }) => ReactNode;
  onComplete?: () => void;
  isSubmitting?: boolean;
  isSubmitted?: boolean;
  validateStep?: (step: number) => boolean;
}

export function ManifestacaoWizard({
  children,
  onComplete,
  isSubmitting = false,
  isSubmitted = false,
  validateStep,
}: ManifestacaoWizardProps) {
  const isMobile = useIsMobile();
  const {
    currentStep,
    steps,
    stepStatuses,
    goToStep,
    nextStep,
    previousStep,
    setStepStatus,
    isFirstStep,
    isLastStep,
    canNavigateToStep,
    progressPercentage,
  } = useManifestacaoWizard();

  const currentStepData = WIZARD_STEPS[currentStep - 1];

  const handleNext = () => {
    // Validate current step before advancing
    if (validateStep && !validateStep(currentStep)) {
      setStepStatus(currentStep, "error");
      return;
    }

    if (isLastStep && onComplete) {
      onComplete();
    } else {
      nextStep();
    }
  };

  return (
    <div className={cn("min-h-screen flex", isMobile ? "flex-col" : "flex-row")}>
      {/* Sidebar / Mobile Progress */}
      <StepProgress
        steps={steps}
        currentStep={currentStep}
        stepStatuses={stepStatuses}
        onStepClick={goToStep}
        canNavigateToStep={canNavigateToStep}
        progressPercentage={progressPercentage}
      />

      {/* Main content area */}
      <main className="flex-1 p-4 md:p-8" id="main-content" role="main">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>
                  Etapa {currentStep} de {steps.length}
                </span>
                {currentStepData?.isOptional && (
                  <span className="bg-muted px-2 py-0.5 rounded text-xs">Opcional</span>
                )}
              </div>
              <CardTitle className="text-2xl md:text-3xl font-bold">
                {currentStepData?.name}
              </CardTitle>
              <CardDescription className="text-base">
                {currentStepData?.description}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {/* Step content rendered by children */}
              <div
                className="min-h-[300px]"
                role="region"
                aria-label={`Conteúdo da etapa ${currentStep}: ${currentStepData?.name}`}
              >
                {children({
                  currentStep,
                  goToStep,
                  nextStep,
                  previousStep,
                  setStepStatus,
                })}
              </div>

              {/* Navigation buttons - hide when submitted on last step */}
              {!(isLastStep && isSubmitted) && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={previousStep}
                    disabled={isFirstStep || isSubmitting}
                    className="min-w-[120px]"
                    aria-label="Voltar para etapa anterior"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
                    Voltar
                  </Button>

                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="min-w-[120px]"
                    aria-label={isLastStep ? "Enviar manifestação" : "Avançar para próxima etapa"}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
                        Enviando...
                      </>
                    ) : isLastStep ? (
                      "Enviar"
                    ) : (
                      <>
                        Avançar
                        <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
