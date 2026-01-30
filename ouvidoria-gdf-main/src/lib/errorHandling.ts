/**
 * Error handling and logging utilities for the application.
 * Provides structured logging, error tracking, and retry mechanisms.
 */

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

/**
 * Error categories
 */
export enum ErrorCategory {
  NETWORK = "network",
  VALIDATION = "validation",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  DATABASE = "database",
  STORAGE = "storage",
  UNKNOWN = "unknown",
}

/**
 * Structured error log entry
 */
export interface ErrorLog {
  timestamp: string;
  message: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  stack?: string;
  context?: Record<string, unknown>;
  userAgent?: string;
  url?: string;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier?: number;
  shouldRetry?: (error: Error, attempt: number) => boolean;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
  shouldRetry: (error: Error) => {
    // Retry on network errors
    return (
      error.message.includes("network") ||
      error.message.includes("timeout") ||
      error.message.includes("fetch")
    );
  },
};

/**
 * Log an error with structured information
 */
export function logError(
  error: Error | string,
  category: ErrorCategory = ErrorCategory.UNKNOWN,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  context?: Record<string, unknown>
): void {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    message: typeof error === "string" ? error : error.message,
    category,
    severity,
    stack: error instanceof Error ? error.stack : undefined,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    const severityColor =
      severity === ErrorSeverity.CRITICAL
        ? "color: red; font-weight: bold"
        : severity === ErrorSeverity.HIGH
          ? "color: orange; font-weight: bold"
          : "color: yellow";

    console.group(`%c[${severity.toUpperCase()}] ${category}`, severityColor);
    console.error("Message:", errorLog.message);
    if (errorLog.stack) console.error("Stack:", errorLog.stack);
    if (errorLog.context) console.error("Context:", errorLog.context);
    console.groupEnd();
  }

  // In production, send to monitoring service
  if (import.meta.env.PROD) {
    // Example: Send to Sentry, LogRocket, or custom endpoint
    // sendToMonitoringService(errorLog);

    // For now, just log to console
    console.error("Error:", errorLog);
  }

  // Store in localStorage for debugging (last 10 errors)
  try {
    const storedErrors = JSON.parse(localStorage.getItem("error_logs") || "[]");
    storedErrors.unshift(errorLog);
    localStorage.setItem("error_logs", JSON.stringify(storedErrors.slice(0, 10)));
  } catch {
    // Ignore if localStorage is not available
  }
}

/**
 * Get stored error logs
 */
export function getErrorLogs(): ErrorLog[] {
  try {
    return JSON.parse(localStorage.getItem("error_logs") || "[]");
  } catch {
    return [];
  }
}

/**
 * Clear stored error logs
 */
export function clearErrorLogs(): void {
  try {
    localStorage.removeItem("error_logs");
  } catch {
    // Ignore
  }
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error = new Error("Unknown error");
  let delay = finalConfig.delayMs;

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      const shouldRetry = finalConfig.shouldRetry
        ? finalConfig.shouldRetry(lastError, attempt)
        : true;

      if (!shouldRetry || attempt === finalConfig.maxAttempts) {
        throw lastError;
      }

      // Log retry attempt
      logError(
        `Retry attempt ${attempt}/${finalConfig.maxAttempts}: ${lastError.message}`,
        ErrorCategory.NETWORK,
        ErrorSeverity.LOW,
        { attempt, delay }
      );

      // Wait before retrying
      await sleep(delay);

      // Increase delay for next attempt (exponential backoff)
      if (finalConfig.backoffMultiplier) {
        delay *= finalConfig.backoffMultiplier;
      }
    }
  }

  throw lastError;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wrap an async function with error handling
 */
export function withErrorHandling<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  category: ErrorCategory = ErrorCategory.UNKNOWN,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(
        error instanceof Error ? error : new Error(String(error)),
        category,
        severity,
        { args }
      );
      throw error;
    }
  };
}

/**
 * Get user-friendly error message based on error type
 */
export function getUserFriendlyMessage(error: Error | string): string {
  const message = typeof error === "string" ? error : error.message;

  // Network errors
  if (
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("NetworkError")
  ) {
    return "Erro de conexão. Verifique sua internet e tente novamente.";
  }

  // Timeout errors
  if (message.includes("timeout") || message.includes("timed out")) {
    return "A operação demorou muito. Tente novamente.";
  }

  // Authentication errors
  if (message.includes("auth") || message.includes("unauthorized") || message.includes("401")) {
    return "Sessão expirada. Faça login novamente.";
  }

  // Authorization errors
  if (message.includes("forbidden") || message.includes("403")) {
    return "Você não tem permissão para realizar esta ação.";
  }

  // Not found errors
  if (message.includes("not found") || message.includes("404")) {
    return "Recurso não encontrado.";
  }

  // Validation errors
  if (message.includes("validation") || message.includes("invalid")) {
    return "Dados inválidos. Verifique as informações e tente novamente.";
  }

  // Server errors
  if (message.includes("500") || message.includes("server error")) {
    return "Erro no servidor. Tente novamente mais tarde.";
  }

  // Database errors
  if (message.includes("database") || message.includes("duplicate")) {
    return "Erro ao processar dados. Tente novamente.";
  }

  // Generic error
  return "Ocorreu um erro inesperado. Tente novamente.";
}

/**
 * Check if error is recoverable (should retry)
 */
export function isRecoverableError(error: Error | string): boolean {
  const message = typeof error === "string" ? error : error.message;

  // Network errors are recoverable
  if (
    message.includes("fetch") ||
    message.includes("network") ||
    message.includes("timeout")
  ) {
    return true;
  }

  // Server errors might be recoverable
  if (message.includes("500") || message.includes("503")) {
    return true;
  }

  // Client errors are usually not recoverable
  if (message.includes("400") || message.includes("401") || message.includes("403")) {
    return false;
  }

  // Unknown errors - conservative approach
  return false;
}

/**
 * Create an error with additional context
 */
export function createError(
  message: string,
  category: ErrorCategory,
  context?: Record<string, unknown>
): Error {
  const error = new Error(message);
  error.name = category;
  if (context) {
    (error as Error & { context: Record<string, unknown> }).context = context;
  }
  return error;
}

/**
 * Safe async operation wrapper that catches errors and provides fallback
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  category: ErrorCategory = ErrorCategory.UNKNOWN
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(
      error instanceof Error ? error : new Error(String(error)),
      category,
      ErrorSeverity.LOW
    );
    return fallback;
  }
}
