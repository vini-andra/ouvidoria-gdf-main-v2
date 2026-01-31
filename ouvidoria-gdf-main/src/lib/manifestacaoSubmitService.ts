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

export interface UploadedFile {
  tipo: 'audio' | 'imagem' | 'video';
  arquivo_url: string;
  nome_arquivo: string;
  tamanho_bytes: number;
}

/**
 * Process file uploads - uploads all media files (audio, image, video, anexos)
 * @param formState - The form state containing files
 * @returns Object with content, main file URL, and array of all uploaded files
 */
export async function processFileUploads(formState: ManifestacaoFormState): Promise<{
  conteudo: string | null;
  arquivoUrl: string | null;
  uploadedFiles: UploadedFile[];
}> {
  let arquivoUrl: string | null = null;
  const conteudo: string | null = formState.conteudo || null;
  const uploadedFiles: UploadedFile[] = [];

  // Upload audio if present
  if (formState.audioBlob) {
    try {
      const url = await uploadFile(formState.audioBlob, "audio.webm", "audios");
      uploadedFiles.push({
        tipo: 'audio',
        arquivo_url: url,
        nome_arquivo: 'audio.webm',
        tamanho_bytes: formState.audioBlob.size,
      });
      if (!arquivoUrl) arquivoUrl = url;
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  }

  // Upload image if present
  if (formState.imageFile) {
    try {
      const url = await uploadFile(formState.imageFile, formState.imageFile.name, "imagens");
      uploadedFiles.push({
        tipo: 'imagem',
        arquivo_url: url,
        nome_arquivo: formState.imageFile.name,
        tamanho_bytes: formState.imageFile.size,
      });
      if (!arquivoUrl) arquivoUrl = url;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }

  // Upload video if present
  if (formState.videoFile) {
    try {
      const url = await uploadFile(formState.videoFile, formState.videoFile.name, "videos");
      uploadedFiles.push({
        tipo: 'video',
        arquivo_url: url,
        nome_arquivo: formState.videoFile.name,
        tamanho_bytes: formState.videoFile.size,
      });
      if (!arquivoUrl) arquivoUrl = url;
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  }

  // Upload additional anexos
  for (const anexo of formState.anexos) {
    try {
      const tipo = anexo.type.startsWith('image/') ? 'imagem'
        : anexo.type.startsWith('video/') ? 'video'
          : anexo.type.startsWith('audio/') ? 'audio'
            : 'imagem'; // default to imagem
      const folder = tipo === 'audio' ? 'audios' : tipo === 'video' ? 'videos' : 'imagens';
      const url = await uploadFile(anexo, anexo.name, folder);
      uploadedFiles.push({
        tipo,
        arquivo_url: url,
        nome_arquivo: anexo.name,
        tamanho_bytes: anexo.size,
      });
    } catch (error) {
      console.error("Error uploading anexo:", error);
    }
  }

  return { conteudo, arquivoUrl, uploadedFiles };
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
): Omit<Database["public"]["Tables"]["manifestacoes"]["Insert"], "protocolo"> {
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
 * @returns Submit result with protocol, password, and manifestacao ID
 * @throws Error if insertion fails or if protocolo/senha are not generated
 */
export async function insertManifestacao(
  insertData: Database["public"]["Tables"]["manifestacoes"]["Insert"]
): Promise<SubmitResult & { id: string }> {
  console.log("[insertManifestacao] Inserindo manifestação...");

  const { data, error } = await supabase
    .from("manifestacoes")
    .insert(insertData)
    .select("id, protocolo, senha_acompanhamento")
    .single();

  console.log("[insertManifestacao] Resposta:", { data, error: error ? JSON.stringify(error) : null });

  if (error) {
    console.error("[insertManifestacao] Erro ao inserir:", error);
    logError(
      error.message,
      ErrorCategory.DATABASE,
      ErrorSeverity.HIGH,
      { insertData, errorCode: error.code, errorDetails: error.details }
    );
    throw new Error("Erro ao registrar manifestação");
  }

  // Verificar se protocolo foi gerado pelo trigger
  if (!data.protocolo) {
    console.error("[insertManifestacao] Trigger falhou - protocolo não gerado:", data);
    logError(
      "Protocolo não foi gerado pelo trigger",
      ErrorCategory.DATABASE,
      ErrorSeverity.CRITICAL,
      { id: data.id }
    );
    throw new Error("Erro ao gerar protocolo. Tente novamente.");
  }

  // Verificar se senha foi gerada pelo trigger
  if (!data.senha_acompanhamento) {
    console.error("[insertManifestacao] Trigger falhou - senha não gerada:", data);
    logError(
      "Senha de acompanhamento não foi gerada pelo trigger",
      ErrorCategory.DATABASE,
      ErrorSeverity.CRITICAL,
      { id: data.id, protocolo: data.protocolo }
    );
    throw new Error("Erro ao gerar senha de acompanhamento. Tente novamente.");
  }

  console.log("[insertManifestacao] Sucesso! Protocolo:", data.protocolo);

  return {
    id: data.id,
    protocolo: data.protocolo,
    senha: data.senha_acompanhamento,
  };
}

/**
 * Insert anexos for a manifestação
 * @param manifestacaoId - The manifestação ID
 * @param uploadedFiles - Array of uploaded files to insert
 */
export async function insertAnexos(
  manifestacaoId: string,
  uploadedFiles: UploadedFile[]
): Promise<void> {
  if (uploadedFiles.length === 0) return;

  const anexosData = uploadedFiles.map((file) => ({
    manifestacao_id: manifestacaoId,
    tipo: file.tipo,
    arquivo_url: file.arquivo_url,
    nome_arquivo: file.nome_arquivo,
    tamanho_bytes: file.tamanho_bytes,
  }));

  const { error } = await supabase
    .from("manifestacao_anexos" as any)
    .insert(anexosData as any);

  if (error) {
    console.error("Error inserting anexos:", error);
    logError(
      error.message,
      ErrorCategory.DATABASE,
      ErrorSeverity.MEDIUM,
      { manifestacaoId, filesCount: uploadedFiles.length }
    );
    // Don't throw - manifestação was created, just log the error
  }
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
