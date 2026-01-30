import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { ManifestacaoFormState } from "@/hooks/useManifestacaoValidation";
import { uploadFile } from "@/lib/fileUploadService";
import {
  logError,
  ErrorCategory,
  ErrorSeverity,
} from "@/lib/errorHandling";

/**
 * Service for handling manifestação submission logic.
 * Breaks down the complex submission process into smaller, testable functions.
 */

export interface SubmitResult {
  protocolo: string;
  senha: string;
}

/**
 * Process file uploads based on manifestation type
 * @param formState - The form state containing files
 * @returns Object with content and file URL
 */
export async function processFileUploads(formState: ManifestacaoFormState): Promise<{
  conteudo: string | null;
  arquivoUrl: string | null;
}> {
  let arquivoUrl: string | null = null;
  let conteudo: string | null = null;

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

  return { conteudo, arquivoUrl };
}

/**
 * Prepare insert data from form state
 * @param formState - The form state
 * @param conteudo - The content text
 * @param arquivoUrl - The file URL
 * @param userId - The authenticated user ID (optional)
 * @returns Insert data object for database
 */
export function prepareInsertData(
  formState: ManifestacaoFormState,
  conteudo: string | null,
  arquivoUrl: string | null,
  userId: string | null
): Database["public"]["Tables"]["manifestacoes"]["Insert"] {
  // Determine category - use first selected or "geral"
  const categoria =
    formState.selectedCategories.length > 0 ? formState.selectedCategories[0] : "geral";

  // Format data_ocorrencia for database
  const dataOcorrenciaStr = formState.dataOcorrencia
    ? formState.dataOcorrencia.toISOString().split("T")[0]
    : null;

  return {
    tipo: formState.tipo,
    conteudo,
    arquivo_url: arquivoUrl,
    categoria,
    anonimo: formState.isAnonymous,
    nome: formState.isAnonymous ? null : formState.nome || null,
    email: formState.isAnonymous ? null : formState.email || null,
    categoria_tipo: formState.categoriaTipo,
    orgao_id: formState.orgaoId,
    local_ocorrencia: formState.localOcorrencia || null,
    data_ocorrencia: dataOcorrenciaStr,
    envolvidos: formState.envolvidos || null,
    testemunhas: formState.testemunhas || null,
    sigilo_dados: formState.sigiloDados,
    user_id: userId,
  };
}

/**
 * Insert manifestação into database
 * @param insertData - The data to insert
 * @returns Submit result with protocol and password
 * @throws Error if insertion fails
 */
export async function insertManifestacao(
  insertData: Database["public"]["Tables"]["manifestacoes"]["Insert"]
): Promise<SubmitResult> {
  const { data, error } = await supabase
    .from("manifestacoes")
    .insert(insertData)
    .select("protocolo, senha_acompanhamento")
    .single();

  if (error) {
    console.error("Insert error:", error);
    logError(
      error.message,
      ErrorCategory.DATABASE,
      ErrorSeverity.HIGH,
      { insertData }
    );
    throw new Error("Erro ao registrar manifestação");
  }

  return {
    protocolo: data.protocolo,
    senha: data.senha_acompanhamento || "",
  };
}

/**
 * Prepare offline queue data from form state
 * @param formState - The form state
 * @param userId - The authenticated user ID (optional)
 * @returns Data object for offline queue
 */
export function prepareOfflineData(
  formState: ManifestacaoFormState,
  userId: string | null
): Record<string, unknown> {
  return {
    tipo: formState.tipo === "texto" ? "texto" : "texto", // Fallback to texto for offline
    conteudo: formState.conteudo || "Manifestação enviada offline (anexos serão perdidos)",
    arquivo_url: null,
    categoria:
      formState.selectedCategories.length > 0 ? formState.selectedCategories[0] : "geral",
    anonimo: formState.isAnonymous,
    nome: formState.isAnonymous ? null : formState.nome || null,
    email: formState.isAnonymous ? null : formState.email || null,
    categoria_tipo: formState.categoriaTipo,
    orgao_id: formState.orgaoId,
    local_ocorrencia: formState.localOcorrencia || null,
    data_ocorrencia: formState.dataOcorrencia
      ? formState.dataOcorrencia.toISOString().split("T")[0]
      : null,
    envolvidos: formState.envolvidos || null,
    testemunhas: formState.testemunhas || null,
    sigilo_dados: formState.sigiloDados,
    user_id: userId,
  };
}

/**
 * Check if error is network-related
 * @param error - The error to check
 * @returns True if error is network-related
 */
export function isNetworkError(error: unknown): boolean {
  return (
    !navigator.onLine ||
    (error instanceof Error &&
      (error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")))
  );
}
