import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { WizardStep, StepStatus } from "@/hooks/useManifestacaoWizard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Progress } from "@/components/ui/progress";

interface StepProgressProps {
  steps: WizardStep[];
  currentStep: number;
  stepStatuses: StepStatus[];
  onStepClick: (step: number) => void;
  canNavigateToStep: (step: number) => boolean;
  progressPercentage: number;
}

export function StepProgress({
  steps,
  currentStep,
  stepStatuses,
  onStepClick,
  canNavigateToStep,
  progressPercentage,
}: StepProgressProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="w-full mb-6">
        {/* Mobile: Horizontal stepper */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Etapa {currentStep} de {steps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {steps[currentStep - 1]?.name}
          </span>
        </div>
        <Progress
          value={progressPercentage}
          className="h-2"
          aria-label={`Progresso: ${progressPercentage}%`}
        />
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              disabled={!canNavigateToStep(step.id) && step.id > currentStep}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                stepStatuses[index] === "completed" && "bg-primary text-primary-foreground",
                stepStatuses[index] === "active" && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
                stepStatuses[index] === "pending" && "bg-muted text-muted-foreground",
                stepStatuses[index] === "error" && "bg-destructive text-destructive-foreground",
                step.id <= currentStep && "cursor-pointer hover:opacity-80",
                step.id > currentStep && "cursor-not-allowed opacity-50"
              )}
              aria-label={`${step.name}: ${stepStatuses[index]}`}
              aria-current={stepStatuses[index] === "active" ? "step" : undefined}
            >
              {stepStatuses[index] === "completed" ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                step.id
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: Vertical sidebar
  return (
    <aside
      className="w-64 shrink-0 bg-card border-r border-border p-6"
      role="navigation"
      aria-label="Etapas da manifestação"
    >
      {/* Logo */}
      <div className="mb-8">
        <img
          src={`${import.meta.env.BASE_URL}logo-ouvidoria.png`}
          alt="Ouvidoria do Distrito Federal"
          className="h-12 w-auto"
        />
      </div>

      {/* Steps */}
      <nav>
        <ol className="space-y-1" role="list">
          {steps.map((step, index) => {
            const status = stepStatuses[index];
            const isClickable = step.id <= currentStep;

            return (
              <li key={step.id}>
                <button
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all text-left",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    status === "active" && "bg-primary/10 text-primary",
                    status === "completed" && "text-foreground hover:bg-muted",
                    status === "pending" && "text-muted-foreground",
                    status === "error" && "text-destructive",
                    isClickable && "cursor-pointer",
                    !isClickable && "cursor-not-allowed"
                  )}
                  aria-label={`Etapa ${step.id}: ${step.name} - ${status === "completed" ? "Concluída" :
                      status === "active" ? "Atual" :
                        status === "error" ? "Com erro" : "Pendente"
                    }`}
                  aria-current={status === "active" ? "step" : undefined}
                >
                  {/* Step indicator */}
                  <span
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0",
                      status === "completed" && "bg-primary text-primary-foreground",
                      status === "active" && "bg-primary text-primary-foreground",
                      status === "pending" && "bg-muted text-muted-foreground border border-border",
                      status === "error" && "bg-destructive text-destructive-foreground"
                    )}
                    aria-hidden="true"
                  >
                    {status === "completed" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </span>

                  {/* Step info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium text-sm truncate",
                      status === "active" && "text-primary"
                    )}>
                      {step.name}
                    </p>
                    {status === "active" && (
                      <p className="text-xs text-muted-foreground truncate">
                        {step.description}
                      </p>
                    )}
                  </div>

                  {/* Optional badge */}
                  {step.isOptional && status !== "completed" && (
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      Opcional
                    </span>
                  )}
                </button>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "ml-[22px] w-0.5 h-4",
                      stepStatuses[index] === "completed" ? "bg-primary" : "bg-border"
                    )}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Progress indicator */}
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium">{progressPercentage}%</span>
        </div>
        <Progress
          value={progressPercentage}
          className="h-2"
          aria-label={`Progresso: ${progressPercentage}%`}
        />
      </div>
    </aside>
  );
}
