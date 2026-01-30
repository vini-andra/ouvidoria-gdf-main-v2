import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useManifestacaoWizard, WIZARD_STEPS } from "./useManifestacaoWizard";

describe("useManifestacaoWizard", () => {
  describe("Initialization", () => {
    it("should initialize with step 1 by default", () => {
      const { result } = renderHook(() => useManifestacaoWizard());

      expect(result.current.currentStep).toBe(1);
      expect(result.current.isFirstStep).toBe(true);
      expect(result.current.isLastStep).toBe(false);
    });

    it("should initialize with custom initial step", () => {
      const { result } = renderHook(() => useManifestacaoWizard(3));

      expect(result.current.currentStep).toBe(3);
      expect(result.current.isFirstStep).toBe(false);
      expect(result.current.isLastStep).toBe(false);
    });

    it("should have correct number of steps", () => {
      const { result } = renderHook(() => useManifestacaoWizard());

      expect(result.current.steps).toHaveLength(7);
      expect(result.current.steps).toEqual(WIZARD_STEPS);
    });

    it("should initialize with first step active and rest pending", () => {
      const { result } = renderHook(() => useManifestacaoWizard());

      expect(result.current.stepStatuses[0]).toBe("active");
      expect(result.current.stepStatuses.slice(1).every((s) => s === "pending")).toBe(true);
    });
  });

  describe("Progress Calculation", () => {
    it("should calculate 0% progress for first step", () => {
      const { result } = renderHook(() => useManifestacaoWizard(1));

      expect(result.current.progressPercentage).toBe(0);
    });

    it("should calculate 50% progress for middle step", () => {
      const { result } = renderHook(() => useManifestacaoWizard(4));

      expect(result.current.progressPercentage).toBe(50);
    });

    it("should calculate 100% progress for last step", () => {
      const { result } = renderHook(() => useManifestacaoWizard(7));

      expect(result.current.progressPercentage).toBe(100);
    });
  });

  describe("Next Step Navigation", () => {
    it("should move to next step", () => {
      const { result } = renderHook(() => useManifestacaoWizard());

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(2);
      expect(result.current.stepStatuses[0]).toBe("completed");
      expect(result.current.stepStatuses[1]).toBe("active");
    });

    it("should not move past last step", () => {
      const { result } = renderHook(() => useManifestacaoWizard(7));

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(7);
      expect(result.current.isLastStep).toBe(true);
    });

    it("should mark steps as completed when moving forward", () => {
      const { result } = renderHook(() => useManifestacaoWizard());

      act(() => {
        result.current.nextStep();
      });
      expect(result.current.stepStatuses[0]).toBe("completed");
      expect(result.current.stepStatuses[1]).toBe("active");

      act(() => {
        result.current.nextStep();
      });
      expect(result.current.stepStatuses[0]).toBe("completed");
      expect(result.current.stepStatuses[1]).toBe("completed");
      expect(result.current.stepStatuses[2]).toBe("active");
    });
  });

  describe("Previous Step Navigation", () => {
    it("should move to previous step", () => {
      const { result } = renderHook(() => useManifestacaoWizard(3));

      act(() => {
        result.current.previousStep();
      });

      expect(result.current.currentStep).toBe(2);
      expect(result.current.stepStatuses[1]).toBe("active");
      expect(result.current.stepStatuses[2]).toBe("pending");
    });

    it("should not move before first step", () => {
      const { result } = renderHook(() => useManifestacaoWizard(1));

      act(() => {
        result.current.previousStep();
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.isFirstStep).toBe(true);
    });
  });

  describe("GoToStep Navigation", () => {
    it("should allow going back to completed steps", () => {
      const { result } = renderHook(() => useManifestacaoWizard(1));

      // Move forward to step 3
      act(() => {
        result.current.nextStep();
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(3);

      // Go back to step 1
      act(() => {
        result.current.goToStep(1);
      });

      expect(result.current.currentStep).toBe(1);
      expect(result.current.stepStatuses[0]).toBe("active");
    });

    it("should not allow skipping forward to uncompleted steps", () => {
      const { result } = renderHook(() => useManifestacaoWizard(1));

      act(() => {
        result.current.goToStep(3);
      });

      // Should stay on step 1
      expect(result.current.currentStep).toBe(1);
    });

    it("should allow going forward if current step is completed", () => {
      const { result } = renderHook(() => useManifestacaoWizard(1));

      // Mark step 1 as completed
      act(() => {
        result.current.setStepStatus(1, "completed");
      });

      // Now should be able to go to step 2
      act(() => {
        result.current.goToStep(2);
      });

      expect(result.current.currentStep).toBe(2);
    });

    it("should handle invalid step numbers gracefully", () => {
      const { result } = renderHook(() => useManifestacaoWizard(1));

      const currentStep = result.current.currentStep;

      act(() => {
        result.current.goToStep(0); // Invalid
      });
      expect(result.current.currentStep).toBe(currentStep);

      act(() => {
        result.current.goToStep(10); // Invalid
      });
      expect(result.current.currentStep).toBe(currentStep);
    });
  });

  describe("Step Status Management", () => {
    it("should allow setting step status", () => {
      const { result } = renderHook(() => useManifestacaoWizard());

      act(() => {
        result.current.setStepStatus(1, "completed");
      });

      expect(result.current.stepStatuses[0]).toBe("completed");
    });

    it("should set step status to error", () => {
      const { result } = renderHook(() => useManifestacaoWizard());

      act(() => {
        result.current.setStepStatus(1, "error");
      });

      expect(result.current.stepStatuses[0]).toBe("error");
    });

    it("should preserve error status when navigating", () => {
      const { result } = renderHook(() => useManifestacaoWizard(1));

      act(() => {
        result.current.setStepStatus(1, "error");
        result.current.goToStep(2);
      });

      expect(result.current.stepStatuses[0]).toBe("error");
    });
  });

  describe("Navigation Validation", () => {
    it("should allow navigation back to any previous step", () => {
      const { result } = renderHook(() => useManifestacaoWizard(5));

      expect(result.current.canNavigateToStep(1)).toBe(true);
      expect(result.current.canNavigateToStep(3)).toBe(true);
      expect(result.current.canNavigateToStep(4)).toBe(true);
    });

    it("should not allow skipping forward", () => {
      const { result } = renderHook(() => useManifestacaoWizard(2));

      expect(result.current.canNavigateToStep(4)).toBe(false);
      expect(result.current.canNavigateToStep(5)).toBe(false);
    });

    it("should allow forward navigation only to next step if current is completed", () => {
      const { result } = renderHook(() => useManifestacaoWizard(2));

      act(() => {
        result.current.setStepStatus(2, "completed");
      });

      expect(result.current.canNavigateToStep(3)).toBe(true);
      expect(result.current.canNavigateToStep(4)).toBe(false);
    });
  });

  describe("Edge Cases", () => {
    it("should handle rapid consecutive next calls", () => {
      const { result } = renderHook(() => useManifestacaoWizard(1));

      act(() => {
        result.current.nextStep();
      });
      expect(result.current.currentStep).toBe(2);

      act(() => {
        result.current.nextStep();
      });
      expect(result.current.currentStep).toBe(3);

      act(() => {
        result.current.nextStep();
      });
      expect(result.current.currentStep).toBe(4);

      // First 3 steps should be completed, 4th should be active
      expect(result.current.stepStatuses[0]).toBe("completed");
      expect(result.current.stepStatuses[1]).toBe("completed");
      expect(result.current.stepStatuses[2]).toBe("completed");
      expect(result.current.stepStatuses[3]).toBe("active");
    });

    it("should handle rapid consecutive previous calls", () => {
      const { result } = renderHook(() => useManifestacaoWizard(5));

      act(() => {
        result.current.previousStep();
        result.current.previousStep();
        result.current.previousStep();
      });

      expect(result.current.currentStep).toBe(2);
    });

    it("should maintain consistency between isFirstStep and currentStep", () => {
      const { result } = renderHook(() => useManifestacaoWizard(1));

      expect(result.current.isFirstStep).toBe(true);

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.isFirstStep).toBe(false);

      act(() => {
        result.current.previousStep();
      });

      expect(result.current.isFirstStep).toBe(true);
    });

    it("should maintain consistency between isLastStep and currentStep", () => {
      const { result } = renderHook(() => useManifestacaoWizard(7));

      expect(result.current.isLastStep).toBe(true);

      act(() => {
        result.current.previousStep();
      });

      expect(result.current.isLastStep).toBe(false);
    });
  });

  describe("Full Wizard Flow", () => {
    it("should complete full wizard flow from start to finish", () => {
      const { result } = renderHook(() => useManifestacaoWizard());

      // Navigate through all steps
      for (let i = 1; i < 7; i++) {
        expect(result.current.currentStep).toBe(i);
        expect(result.current.stepStatuses[i - 1]).toBe("active");

        act(() => {
          result.current.nextStep();
        });
      }

      // Should be at last step
      expect(result.current.currentStep).toBe(7);
      expect(result.current.isLastStep).toBe(true);

      // All previous steps should be completed
      expect(result.current.stepStatuses.slice(0, 6).every((s) => s === "completed")).toBe(true);
    });

    it("should allow navigating back through completed steps", () => {
      const { result } = renderHook(() => useManifestacaoWizard(1));

      // Go to step 4
      act(() => {
        result.current.nextStep();
        result.current.nextStep();
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(4);

      // Go back to step 2
      act(() => {
        result.current.goToStep(2);
      });

      expect(result.current.currentStep).toBe(2);

      // Go back to step 1
      act(() => {
        result.current.goToStep(1);
      });

      expect(result.current.currentStep).toBe(1);
    });
  });
});
