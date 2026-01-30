import { useCallback } from "react";
import type { CategoriaManifestacao } from "@/components/manifestacao/TipoManifestacaoSelect";
import type { Database } from "@/integrations/supabase/types";

type TipoManifestacao = Database["public"]["Enums"]["tipo_manifestacao"];

export interface ManifestacaoFormState {
  tipo: TipoManifestacao;
  conteudo: string;
  audioBlob: Blob | null;
  imageFile: File | null;
  videoFile: File | null;
  selectedCategories: string[];
  isAnonymous: boolean;
  nome: string;
  email: string;
  categoriaTipo: CategoriaManifestacao | null;
  orgaoId: string | null;
  localOcorrencia: string;
  dataOcorrencia: Date | null;
  envolvidos: string;
  testemunhas: string;
  sigiloDados: boolean;
  aceiteLGPD: boolean;
  anexos: File[];
}

export interface ValidationErrors {
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

/**
 * Custom hook for validating manifestação form data.
 * Extracts all validation logic into a reusable, testable module.
 */
export function useManifestacaoValidation(formState: ManifestacaoFormState) {
  /**
   * Validate Step 1 - Relato (Report)
   * Validates the main content based on selected type (text, audio, image, video)
   */
  const validateStep1 = useCallback((): ValidationErrors => {
    const errors: ValidationErrors = {};

    switch (formState.tipo) {
      case "texto":
        if (formState.conteudo.length < MIN_TEXT_CHARS) {
          errors.conteudo = `O texto deve ter pelo menos ${MIN_TEXT_CHARS} caracteres`;
        } else if (formState.conteudo.length > MAX_TEXT_CHARS) {
          errors.conteudo = `O texto não pode exceder ${MAX_TEXT_CHARS} caracteres`;
        }
        break;
      case "audio":
        if (!formState.audioBlob) {
          errors.audio = "Grave um áudio para enviar";
        }
        break;
      case "imagem":
        if (!formState.imageFile) {
          errors.image = "Selecione uma imagem para enviar";
        }
        break;
      case "video":
        if (!formState.videoFile) {
          errors.video = "Selecione um vídeo para enviar";
        }
        break;
    }

    return errors;
  }, [
    formState.tipo,
    formState.conteudo,
    formState.audioBlob,
    formState.imageFile,
    formState.videoFile,
  ]);

  /**
   * Validate Step 2 - Assunto (Subject)
   * Validates category type and responsible government body
   */
  const validateStep2 = useCallback((): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!formState.categoriaTipo) {
      errors.categoriaTipo = "Selecione o tipo de manifestação";
    }

    if (!formState.orgaoId) {
      errors.orgao = "Selecione o órgão responsável";
    }

    return errors;
  }, [formState.categoriaTipo, formState.orgaoId]);

  /**
   * Validate Step 3 - Informações Complementares
   * All fields are optional, so always valid
   */
  const validateStep3 = useCallback((): ValidationErrors => {
    return {}; // All fields are optional
  }, []);

  /**
   * Validate Step 4 - Resumo (Summary)
   * Review step, no validation needed
   */
  const validateStep4 = useCallback((): ValidationErrors => {
    return {};
  }, []);

  /**
   * Validate Step 5 - Identificação (Identification)
   * Validates email format and LGPD acceptance
   */
  const validateStep5 = useCallback((): ValidationErrors => {
    const errors: ValidationErrors = {};

    if (!formState.isAnonymous) {
      // Validate email format if provided
      if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
        errors.email = "E-mail inválido";
      }
    }

    // LGPD acceptance is required for everyone
    if (!formState.aceiteLGPD) {
      errors.aceiteLGPD = "Você deve aceitar a Política de Privacidade para continuar";
    }

    return errors;
  }, [formState.isAnonymous, formState.email, formState.aceiteLGPD]);

  /**
   * Validate Step 6 - Anexos (Attachments)
   * Attachments are optional, so always valid
   */
  const validateStep6 = useCallback((): ValidationErrors => {
    return {}; // Attachments are optional
  }, []);

  /**
   * Validate a specific step by number
   * @param step - Step number (1-6)
   * @returns Validation errors object
   */
  const validateStep = useCallback(
    (step: number): ValidationErrors => {
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
          return {};
      }
    },
    [validateStep1, validateStep2, validateStep3, validateStep4, validateStep5, validateStep6]
  );

  /**
   * Full validation for final submission
   * Only validates required steps (1, 2, 5)
   * @returns Validation errors object
   */
  const validateAll = useCallback((): ValidationErrors => {
    const errors1 = validateStep1();
    const errors2 = validateStep2();
    const errors5 = validateStep5();

    return { ...errors1, ...errors2, ...errors5 };
  }, [validateStep1, validateStep2, validateStep5]);

  return {
    validateStep1,
    validateStep2,
    validateStep3,
    validateStep4,
    validateStep5,
    validateStep6,
    validateStep,
    validateAll,
  };
}
