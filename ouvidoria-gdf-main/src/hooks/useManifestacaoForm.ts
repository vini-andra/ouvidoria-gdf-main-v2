import { useState, useCallback, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";
import { useOfflineQueue } from "@/hooks/useOfflineQueue";
import {
  useManifestacaoValidation,
  type ManifestacaoFormState,
  type ValidationErrors,
} from "@/hooks/useManifestacaoValidation";
import {
  processFileUploads,
  prepareInsertData,
  insertManifestacao,
  insertAnexos,
  prepareOfflineData,
  isNetworkError,
  type SubmitResult,
} from "@/lib/manifestacaoSubmitService";
import {
  logError,
  getUserFriendlyMessage,
  ErrorCategory,
  ErrorSeverity,
} from "@/lib/errorHandling";

/**
 * Main hook for managing manifestação form state and submission.
 * Handles form state, validation, file uploads, and offline support.
 *
 * This hook has been refactored to separate concerns:
 * - Validation logic → useManifestacaoValidation hook
 * - File upload logic → fileUploadService
 * - Submission logic → manifestacaoSubmitService
 */

export function useManifestacaoForm() {
  const { user } = useAuth();
  const { saveDraft, loadDraft, clearDraft, hasDraft } = useDraftPersistence();
  const { addToQueue, isOnline, pendingCount, syncPendingManifestacoes } = useOfflineQueue();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formState, setFormState] = useState<ManifestacaoFormState>({
    tipo: "texto",
    conteudo: "",
    audioBlob: null,
    imageFile: null,
    videoFile: null,
    selectedCategories: [],
    isAnonymous: true,
    nome: "",
    email: "",
    // Campos estendidos
    categoriaTipo: null,
    orgaoId: null,
    orgaoNome: "",
    localOcorrencia: "",
    dataOcorrencia: null,
    envolvidos: "",
    testemunhas: "",
    sigiloDados: false,
    // LGPD
    aceiteLGPD: false,
    // Anexos
    anexos: [],
  });

  // Initialize validation hook
  const validation = useManifestacaoValidation(formState);

  /**
   * Load draft on mount if available
   */
  useEffect(() => {
    if (hasDraft()) {
      const draft = loadDraft();
      if (draft) {
        setFormState((prev) => ({ ...prev, ...draft }));
        toast({
          title: "Rascunho recuperado",
          description: "Continuando de onde você parou.",
        });
      }
    }
  }, [hasDraft, loadDraft]);

  /**
   * Update a single form field
   */
  const updateField = useCallback(
    <K extends keyof ManifestacaoFormState>(field: K, value: ManifestacaoFormState[K]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      // Clear related errors when field changes
      if (field === "conteudo") setErrors((prev) => ({ ...prev, conteudo: undefined }));
      if (field === "audioBlob") setErrors((prev) => ({ ...prev, audio: undefined }));
      if (field === "imageFile") setErrors((prev) => ({ ...prev, image: undefined }));
      if (field === "videoFile") setErrors((prev) => ({ ...prev, video: undefined }));
    },
    []
  );

  /**
   * Toggle category selection
   */
  const toggleCategory = useCallback((category: string) => {
    setFormState((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category],
    }));
  }, []);

  /**
   * Validate a specific step and update errors state
   * @param step - Step number (1-6)
   * @returns True if step is valid
   */
  const validateStep = useCallback(
    (step: number): boolean => {
      const stepErrors = validation.validateStep(step);
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      return Object.keys(stepErrors).length === 0;
    },
    [validation]
  );

  /**
   * Clear error for a specific field
   */
  const clearError = useCallback((field: keyof ValidationErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  /**
   * Validate entire form for submission
   */
  const validate = useCallback((): boolean => {
    const allErrors = validation.validateAll();
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  }, [validation]);

  /**
   * Handle online submission
   */
  const handleOnlineSubmit = useCallback(async (): Promise<void> => {
    // Process file uploads - now handles all media types
    const { conteudo, arquivoUrl, uploadedFiles } = await processFileUploads(formState);

    // Prepare insert data
    const insertData = prepareInsertData(
      formState,
      conteudo,
      arquivoUrl,
      user?.id || null
    );

    // Insert into database (type assertion needed because protocolo is auto-generated)
    const result = await insertManifestacao(insertData as any);

    // Insert anexos if any files were uploaded
    if (uploadedFiles.length > 0) {
      await insertAnexos(result.id, uploadedFiles);
    }

    // Clear draft after successful submission
    clearDraft();

    // Store result for display
    setSubmitResult(result);
    setIsSubmitted(true);

    toast({
      title: "Manifestação registrada!",
      description: "Sua manifestação foi enviada com sucesso.",
    });
  }, [formState, user, clearDraft]);

  /**
   * Handle offline submission (queue for later)
   */
  const handleOfflineSubmit = useCallback(async (): Promise<void> => {
    const offlineData = prepareOfflineData(formState, user?.id || null);

    try {
      await addToQueue(offlineData);
      clearDraft();

      setSubmitResult({
        protocolo: "PENDENTE-OFFLINE",
        senha: "",
      });
      setIsSubmitted(true);

      toast({
        title: "Manifestação salva para envio posterior",
        description: "Será enviada automaticamente quando a conexão for restabelecida.",
      });
    } catch (queueError) {
      logError(
        queueError instanceof Error ? queueError : new Error(String(queueError)),
        ErrorCategory.STORAGE,
        ErrorSeverity.CRITICAL,
        { context: "offline_queue" }
      );
      toast({
        title: "Erro ao salvar offline",
        description: "Não foi possível salvar a manifestação. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [formState, user, addToQueue, clearDraft]);

  /**
   * Submit the manifestação form
   */
  const submit = async (): Promise<void> => {
    if (!validate()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os erros no formulário",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await handleOnlineSubmit();
    } catch (error) {
      // Log error with structured logging
      logError(
        error instanceof Error ? error : new Error(String(error)),
        ErrorCategory.DATABASE,
        ErrorSeverity.HIGH,
        {
          tipo: formState.tipo,
          categoria: formState.selectedCategories,
          isAnonymous: formState.isAnonymous,
          hasUser: !!user,
        }
      );

      // Check if it's a network error - save to offline queue
      if (isNetworkError(error)) {
        await handleOfflineSubmit();
      } else {
        // Show user-friendly error message
        const userMessage = getUserFriendlyMessage(
          error instanceof Error ? error : String(error)
        );
        toast({
          title: "Erro ao enviar",
          description: userMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Save current form state as draft
   */
  const saveCurrentDraft = useCallback(() => {
    saveDraft(formState);
  }, [formState, saveDraft]);

  return {
    formState,
    updateField,
    toggleCategory,
    errors,
    validateStep,
    clearError,
    isSubmitting,
    isSubmitted,
    submitResult,
    submit,
    saveCurrentDraft,
    clearDraft,
    hasDraft,
    // Offline support
    isOnline,
    pendingCount,
    syncPendingManifestacoes,
  };
}
