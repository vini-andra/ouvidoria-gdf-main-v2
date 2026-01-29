import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useDraftPersistence } from "@/hooks/useDraftPersistence";
import type { Database } from "@/integrations/supabase/types";
import type { CategoriaManifestacao } from "@/components/manifestacao/TipoManifestacaoSelect";

type TipoManifestacao = Database["public"]["Enums"]["tipo_manifestacao"];

interface ManifestacaoFormState {
  tipo: TipoManifestacao;
  conteudo: string;
  audioBlob: Blob | null;
  imageFile: File | null;
  videoFile: File | null;
  selectedCategories: string[];
  isAnonymous: boolean;
  nome: string;
  email: string;
  // Campos estendidos (Etapa 2)
  categoriaTipo: CategoriaManifestacao | null;
  orgaoId: string | null;
  localOcorrencia: string;
  dataOcorrencia: Date | null;
  envolvidos: string;
  testemunhas: string;
  sigiloDados: boolean;
  // LGPD (Etapa 5)
  aceiteLGPD: boolean;
  // Anexos adicionais (Etapa 6)
  anexos: File[];
}

interface ValidationErrors {
  conteudo?: string;
  audio?: string;
  image?: string;
  video?: string;
  nome?: string;
  email?: string;
  categoriaTipo?: string;
  orgao?: string;
  aceiteLGPD?: string;
}

const MIN_TEXT_CHARS = 50;
const MAX_TEXT_CHARS = 5000;

interface SubmitResult {
  protocolo: string;
  senha: string;
}

export function useManifestacaoForm() {
  const { user } = useAuth();
  const { saveDraft, loadDraft, clearDraft, hasDraft } = useDraftPersistence();
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

  // Load draft on mount
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
  }, []);

  const updateField = useCallback(<K extends keyof ManifestacaoFormState>(
    field: K,
    value: ManifestacaoFormState[K]
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    // Clear related errors when field changes
    if (field === "conteudo") setErrors((prev) => ({ ...prev, conteudo: undefined }));
    if (field === "audioBlob") setErrors((prev) => ({ ...prev, audio: undefined }));
    if (field === "imageFile") setErrors((prev) => ({ ...prev, image: undefined }));
    if (field === "videoFile") setErrors((prev) => ({ ...prev, video: undefined }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFormState((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((c) => c !== category)
        : [...prev.selectedCategories, category],
    }));
  }, []);

  // Validate Step 1 - Relato
  const validateStep1 = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    switch (formState.tipo) {
      case "texto":
        if (formState.conteudo.length < MIN_TEXT_CHARS) {
          newErrors.conteudo = `O texto deve ter pelo menos ${MIN_TEXT_CHARS} caracteres`;
        } else if (formState.conteudo.length > MAX_TEXT_CHARS) {
          newErrors.conteudo = `O texto não pode exceder ${MAX_TEXT_CHARS} caracteres`;
        }
        break;
      case "audio":
        if (!formState.audioBlob) {
          newErrors.audio = "Grave um áudio para enviar";
        }
        break;
      case "imagem":
        if (!formState.imageFile) {
          newErrors.image = "Selecione uma imagem para enviar";
        }
        break;
      case "video":
        if (!formState.videoFile) {
          newErrors.video = "Selecione um vídeo para enviar";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [formState.tipo, formState.conteudo, formState.audioBlob, formState.imageFile, formState.videoFile]);

  // Validate Step 2 - Assunto
  const validateStep2 = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formState.categoriaTipo) {
      newErrors.categoriaTipo = "Selecione o tipo de manifestação";
    }

    if (!formState.orgaoId) {
      newErrors.orgao = "Selecione o órgão responsável";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [formState.categoriaTipo, formState.orgaoId]);

  // Validate Step 3 - Info Complementares (all optional)
  const validateStep3 = useCallback((): boolean => {
    return true; // All fields are optional
  }, []);

  // Validate Step 4 - Resumo (just review, no validation needed)
  const validateStep4 = useCallback((): boolean => {
    return true;
  }, []);

  // Validate Step 5 - Identificação
  const validateStep5 = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formState.isAnonymous) {
      // Validate email format if provided
      if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
        newErrors.email = "E-mail inválido";
      }
    }

    // LGPD acceptance is required for everyone
    if (!formState.aceiteLGPD) {
      newErrors.aceiteLGPD = "Você deve aceitar a Política de Privacidade para continuar";
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [formState.isAnonymous, formState.email, formState.aceiteLGPD]);

  // Validate Step 6 - Anexos (optional)
  const validateStep6 = useCallback((): boolean => {
    return true; // Attachments are optional
  }, []);

  // Validate a specific step
  const validateStep = useCallback((step: number): boolean => {
    switch (step) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      case 4:
        return validateStep4();
      case 5:
        return validateStep5();
      case 6:
        return validateStep6();
      default:
        return true;
    }
  }, [validateStep1, validateStep2, validateStep3, validateStep4, validateStep5, validateStep6]);

  // Full validation for submission
  const validate = (): boolean => {
    return validateStep1() && validateStep2() && validateStep5();
  };

  const uploadFile = async (
    file: File | Blob,
    fileName: string,
    folder: string
  ): Promise<string | null> => {
    const filePath = `${folder}/${Date.now()}-${fileName}`;

    const { error } = await supabase.storage
      .from("manifestacoes-arquivos")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      throw new Error("Erro ao fazer upload do arquivo");
    }

    return filePath;
  };

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
      let arquivoUrl: string | null = null;
      let conteudo: string | null = null;

      // Handle file uploads based on type
      switch (formState.tipo) {
        case "texto":
          conteudo = formState.conteudo;
          break;
        case "audio":
          if (formState.audioBlob) {
            arquivoUrl = await uploadFile(formState.audioBlob, "audio.webm", "audios");
          }
          break;
        case "imagem":
          if (formState.imageFile) {
            arquivoUrl = await uploadFile(formState.imageFile, formState.imageFile.name, "imagens");
          }
          break;
        case "video":
          if (formState.videoFile) {
            arquivoUrl = await uploadFile(formState.videoFile, formState.videoFile.name, "videos");
          }
          break;
      }

      // Determine category - use first selected or "geral"
      const categoria = formState.selectedCategories.length > 0
        ? formState.selectedCategories[0]
        : "geral";

      // Format data_ocorrencia for database
      const dataOcorrenciaStr = formState.dataOcorrencia
        ? formState.dataOcorrencia.toISOString().split('T')[0]
        : null;

      // Insert manifestation (protocolo is auto-generated by DB trigger)
      const insertData = {
        tipo: formState.tipo,
        conteudo,
        arquivo_url: arquivoUrl,
        categoria,
        anonimo: formState.isAnonymous,
        nome: formState.isAnonymous ? null : formState.nome || null,
        email: formState.isAnonymous ? null : formState.email || null,
        // Campos estendidos
        categoria_tipo: formState.categoriaTipo,
        orgao_id: formState.orgaoId,
        local_ocorrencia: formState.localOcorrencia || null,
        data_ocorrencia: dataOcorrenciaStr,
        envolvidos: formState.envolvidos || null,
        testemunhas: formState.testemunhas || null,
        sigilo_dados: formState.sigiloDados,
        user_id: user?.id || null,
      };

      const { data, error } = await supabase
        .from("manifestacoes")
        .insert(insertData as unknown as Database["public"]["Tables"]["manifestacoes"]["Insert"])
        .select("protocolo, senha_acompanhamento")
        .single();

      if (error) {
        console.error("Insert error:", error);
        throw new Error("Erro ao registrar manifestação");
      }

      // Clear draft after successful submission
      clearDraft();

      // Store result for display in wizard
      setSubmitResult({
        protocolo: data.protocolo,
        senha: data.senha_acompanhamento || "",
      });
      setIsSubmitted(true);

      toast({
        title: "Manifestação registrada!",
        description: "Sua manifestação foi enviada com sucesso.",
      });

    } catch (error) {
      console.error("Submit error:", error);
      toast({
        title: "Erro ao enviar",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save current form state as draft
  const saveCurrentDraft = useCallback(() => {
    saveDraft(formState);
  }, [formState, saveDraft]);

  // Clear errors for a field
  const clearError = useCallback((field: keyof ValidationErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

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
  };
}
