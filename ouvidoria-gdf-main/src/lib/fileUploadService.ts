import { supabase } from "@/integrations/supabase/client";
import {
  logError,
  retryWithBackoff,
  getUserFriendlyMessage,
  ErrorCategory,
  ErrorSeverity,
} from "@/lib/errorHandling";

/**
 * Service for handling file uploads to Supabase Storage.
 * Provides retry logic with exponential backoff for improved reliability.
 */

/**
 * Upload a file to Supabase Storage with retry logic
 * @param file - The file or blob to upload
 * @param fileName - The name of the file
 * @param folder - The storage folder (e.g., "audios", "imagens", "videos")
 * @returns The file path in storage, or null if upload fails
 * @throws Error if upload fails after all retry attempts
 */
export async function uploadFile(
  file: File | Blob,
  fileName: string,
  folder: string
): Promise<string> {
  const filePath = `${folder}/${Date.now()}-${fileName}`;

  try {
    // Retry upload with exponential backoff
    const result = await retryWithBackoff(
      async () => {
        const { error } = await supabase.storage
          .from("manifestacoes-arquivos")
          .upload(filePath, file);

        if (error) {
          logError(
            error.message,
            ErrorCategory.STORAGE,
            ErrorSeverity.MEDIUM,
            { filePath, fileName, folder }
          );
          throw error;
        }

        return filePath;
      },
      {
        maxAttempts: 3,
        delayMs: 1000,
        backoffMultiplier: 2,
      }
    );

    return result;
  } catch (error) {
    logError(
      error instanceof Error ? error : new Error(String(error)),
      ErrorCategory.STORAGE,
      ErrorSeverity.HIGH,
      { filePath, fileName, folder, fileSize: file.size }
    );
    const userMessage = getUserFriendlyMessage(
      error instanceof Error ? error : String(error)
    );
    throw new Error(`Erro ao fazer upload do arquivo: ${userMessage}`);
  }
}

/**
 * Upload multiple files concurrently
 * @param files - Array of files to upload with their metadata
 * @returns Array of file paths in storage
 * @throws Error if any upload fails
 */
export async function uploadMultipleFiles(
  files: Array<{ file: File | Blob; fileName: string; folder: string }>
): Promise<string[]> {
  const uploadPromises = files.map(({ file, fileName, folder }) =>
    uploadFile(file, fileName, folder)
  );

  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    logError(
      error instanceof Error ? error : new Error(String(error)),
      ErrorCategory.STORAGE,
      ErrorSeverity.HIGH,
      { filesCount: files.length }
    );
    throw error;
  }
}

/**
 * Delete a file from Supabase Storage
 * @param filePath - The path of the file to delete
 * @returns True if deletion was successful
 */
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from("manifestacoes-arquivos")
      .remove([filePath]);

    if (error) {
      logError(error.message, ErrorCategory.STORAGE, ErrorSeverity.LOW, {
        filePath,
      });
      return false;
    }

    return true;
  } catch (error) {
    logError(
      error instanceof Error ? error : new Error(String(error)),
      ErrorCategory.STORAGE,
      ErrorSeverity.LOW,
      { filePath }
    );
    return false;
  }
}

/**
 * Get public URL for a file in storage
 * @param filePath - The path of the file
 * @returns The public URL
 */
export function getPublicUrl(filePath: string): string {
  const { data } = supabase.storage
    .from("manifestacoes-arquivos")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
