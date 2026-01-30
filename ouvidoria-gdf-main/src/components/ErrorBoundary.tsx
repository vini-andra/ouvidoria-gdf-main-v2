import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree.
 * Displays a fallback UI instead of crashing the entire application.
 *
 * @example
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught an error:", error);
      console.error("Error Info:", errorInfo);
    }

    // Update state with error details
    this.setState({
      errorInfo,
    });

    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you could send error to monitoring service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Algo deu errado</CardTitle>
                  <CardDescription>
                    Ocorreu um erro inesperado. Nossos desenvolvedores foram notificados.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Error Message */}
              {this.state.error && (
                <div className="rounded-lg bg-red-50 p-4 dark:bg-red-900/10">
                  <p className="text-sm font-medium text-red-800 dark:text-red-200">
                    Mensagem de erro:
                  </p>
                  <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              {/* Error Stack (only in development) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                    Detalhes técnicos (desenvolvimento)
                  </summary>
                  <pre className="mt-2 overflow-auto text-xs text-gray-600 dark:text-gray-400">
                    {this.state.error.stack}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="mt-2 overflow-auto text-xs text-gray-600 dark:text-gray-400">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button onClick={this.handleReset} className="flex-1">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Tentar Novamente
                </Button>
                <Button onClick={this.handleReload} variant="outline" className="flex-1">
                  Recarregar Página
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="ghost"
                  className="flex-1"
                >
                  Voltar ao Início
                </Button>
              </div>

              {/* Help Text */}
              <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/10">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>O que fazer:</strong>
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>• Tente novamente clicando no botão acima</li>
                  <li>• Se o problema persistir, recarregue a página</li>
                  <li>• Verifique sua conexão com a internet</li>
                  <li>
                    • Se ainda assim não funcionar, entre em contato com o suporte em{" "}
                    <a
                      href="mailto:ouvidoria@df.gov.br"
                      className="underline hover:no-underline"
                    >
                      ouvidoria@df.gov.br
                    </a>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook-based error boundary wrapper for functional components.
 * Note: This is a wrapper around the class-based ErrorBoundary since
 * React doesn't support error boundaries with hooks yet.
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
): React.ComponentType<P> {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
