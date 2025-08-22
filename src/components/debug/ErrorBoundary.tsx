/**
 * Error Boundary Component
 * 
 * Componente React que captura erros JavaScript que ocorrem em qualquer lugar
 * da árvore de componentes filhos, registra esses erros e exibe uma UI de fallback.
 * 
 * FUNCIONALIDADES:
 * - Captura erros de renderização de componentes React
 * - Integra com o sistema de logging centralizado
 * - Exibe interface amigável quando erros ocorrem
 * - Permite recuperação sem recarregar a página
 * - Coleta informações detalhadas sobre o erro
 * 
 * USO:
 * Envolva componentes ou seções da aplicação que podem falhar:
 * 
 * <ErrorBoundary fallback={<MeuComponenteDeErro />}>
 *   <ComponenteQuePodefFalhar />
 * </ErrorBoundary>
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '../../utils/logger';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

// Props do Error Boundary
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  context?: string;
}

// State do Error Boundary
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * Componente Error Boundary
 * 
 * Implementa o padrão Error Boundary do React para capturar erros
 * de renderização e integrar com nosso sistema de logging.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  /**
   * Método estático chamado quando um erro é capturado
   * Atualiza o state para exibir a UI de fallback
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  /**
   * Método chamado após um erro ser capturado
   * Registra o erro no sistema de logging
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Atualiza state com informações detalhadas
    this.setState({
      errorInfo
    });

    // Registra no sistema de logging
    logger.error(
      `Erro capturado pelo Error Boundary: ${error.message}`,
      this.props.context || 'ErrorBoundary',
      {
        errorId: this.state.errorId,
        componentStack: errorInfo.componentStack,
        errorBoundaryProps: {
          context: this.props.context,
          hasCustomFallback: !!this.props.fallback
        },
        errorDetails: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      },
      error
    );

    // Chama callback personalizado se fornecido
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (callbackError) {
        logger.error(
          'Erro no callback do Error Boundary',
          'ErrorBoundary',
          { originalError: error.message },
          callbackError as Error
        );
      }
    }
  }

  /**
   * Método para tentar recuperar do erro
   * Reseta o state e tenta renderizar novamente
   */
  private handleRetry = (): void => {
    logger.info(
      'Tentativa de recuperação do Error Boundary',
      'ErrorBoundary',
      { errorId: this.state.errorId }
    );

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  /**
   * Navega para a página inicial
   */
  private handleGoHome = (): void => {
    logger.info(
      'Navegação para home via Error Boundary',
      'ErrorBoundary',
      { errorId: this.state.errorId }
    );

    window.location.href = '/';
  };

  /**
   * Copia detalhes do erro para a área de transferência
   */
  private handleCopyError = async (): Promise<void> => {
    if (!this.state.error || !this.state.errorInfo) return;

    const errorDetails = {
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      error: {
        name: this.state.error.name,
        message: this.state.error.message,
        stack: this.state.error.stack
      },
      componentStack: this.state.errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      context: this.props.context
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
      logger.info(
        'Detalhes do erro copiados para área de transferência',
        'ErrorBoundary',
        { errorId: this.state.errorId }
      );
      
      // Feedback visual simples
      const button = document.getElementById('copy-error-btn');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Copiado!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    } catch (error) {
      logger.error(
        'Falha ao copiar detalhes do erro',
        'ErrorBoundary',
        { errorId: this.state.errorId },
        error as Error
      );
    }
  };

  /**
   * Renderiza a UI de fallback quando há erro
   */
  private renderErrorFallback(): ReactNode {
    const { error, errorInfo, errorId } = this.state;
    const isDevelopment = logger.isDev();

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Card principal do erro */}
          <div className="bg-white rounded-xl shadow-lg border border-red-200 overflow-hidden">
            {/* Header com ícone de erro */}
            <div className="bg-red-50 px-6 py-4 border-b border-red-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-red-900">
                    Oops! Algo deu errado
                  </h1>
                  <p className="text-red-700 text-sm">
                    Encontramos um erro inesperado na aplicação
                  </p>
                </div>
              </div>
            </div>

            {/* Conteúdo principal */}
            <div className="p-6">
              <div className="space-y-4">
                {/* Mensagem amigável */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800">
                    Não se preocupe! Nossa equipe foi notificada automaticamente sobre este problema. 
                    Você pode tentar as opções abaixo para continuar usando a aplicação.
                  </p>
                </div>

                {/* Ações disponíveis */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={this.handleRetry}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Tentar Novamente</span>
                  </button>

                  <button
                    onClick={this.handleGoHome}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    <span>Ir para Início</span>
                  </button>

                  {isDevelopment && (
                    <button
                      id="copy-error-btn"
                      onClick={this.handleCopyError}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <Bug className="w-4 h-4" />
                      <span>Copiar Detalhes</span>
                    </button>
                  )}
                </div>

                {/* Detalhes técnicos (apenas em desenvolvimento) */}
                {isDevelopment && error && (
                  <div className="mt-6 space-y-4">
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Detalhes Técnicos (Desenvolvimento)
                      </h3>
                      
                      {/* ID do erro */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ID do Erro:
                        </label>
                        <code className="block p-2 bg-gray-100 rounded text-sm font-mono text-gray-800">
                          {errorId}
                        </code>
                      </div>

                      {/* Mensagem do erro */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mensagem:
                        </label>
                        <code className="block p-2 bg-red-50 border border-red-200 rounded text-sm font-mono text-red-800">
                          {error.name}: {error.message}
                        </code>
                      </div>

                      {/* Stack trace */}
                      {error.stack && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stack Trace:
                          </label>
                          <pre className="p-3 bg-gray-900 text-green-400 rounded text-xs overflow-x-auto max-h-40">
                            {error.stack}
                          </pre>
                        </div>
                      )}

                      {/* Component stack */}
                      {errorInfo?.componentStack && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Component Stack:
                          </label>
                          <pre className="p-3 bg-blue-900 text-blue-200 rounded text-xs overflow-x-auto max-h-40">
                            {errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer com informações adicionais */}
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>
              Se o problema persistir, entre em contato com nosso suporte em{' '}
              <a href="mailto:suporte@kombinu.com" className="text-blue-600 hover:text-blue-800">
                suporte@kombinu.com
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Método de renderização principal
   */
  render(): ReactNode {
    // Se há erro, renderiza fallback personalizado ou padrão
    if (this.state.hasError) {
      return this.props.fallback || this.renderErrorFallback();
    }

    // Se não há erro, renderiza filhos normalmente
    return this.props.children;
  }
}

/**
 * HOC (Higher-Order Component) para facilitar uso do Error Boundary
 * 
 * EXEMPLO DE USO:
 * const MeuComponenteSeguro = withErrorBoundary(MeuComponente, {
 *   context: 'MeuComponente',
 *   fallback: <div>Erro personalizado</div>
 * });
 */
function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}