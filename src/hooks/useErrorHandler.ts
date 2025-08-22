/**
 * Hook personalizado para tratamento de erros
 * 
 * Fornece uma interface consistente para capturar e tratar erros
 * em componentes React, integrando com o sistema de logging centralizado.
 * 
 * FUNCIONALIDADES:
 * - Captura automática de erros com contexto
 * - Integração com sistema de logging
 * - Notificações de erro para usuário
 * - Retry automático para operações que falharam
 * - Estado de loading e erro para UI
 * 
 * EXEMPLO DE USO:
 * const { executeWithErrorHandling, error, isLoading, clearError } = useErrorHandler('MeuComponente');
 * 
 * const handleSubmit = async () => {
 *   await executeWithErrorHandling(async () => {
 *     await minhaOperacaoPerigosa();
 *   });
 * };
 */

import { useState, useCallback, useRef } from 'react';
import { logger } from '../utils/logger';
import { ValidationError } from '../utils/customErrors';

/**
 * Configurações do hook de tratamento de erros
 */
interface ErrorHandlerConfig {
  /** Contexto para identificar origem dos erros */
  context: string;
  /** Se deve mostrar notificações de erro para o usuário */
  showNotifications?: boolean;
  /** Número máximo de tentativas automáticas */
  maxRetries?: number;
  /** Delay entre tentativas (em ms) */
  retryDelay?: number;
  /** Callback personalizado para tratamento de erros */
  onError?: (error: Error, context: string) => void;
  /** Callback para sucesso após retry */
  onRetrySuccess?: (attempt: number) => void;
}

/**
 * Estado do tratamento de erros
 */
interface ErrorState {
  /** Último erro capturado */
  error: Error | null;
  /** Se está executando uma operação */
  isLoading: boolean;
  /** Número de tentativas realizadas */
  retryCount: number;
  /** Se a operação foi bem-sucedida */
  isSuccess: boolean;
}

/**
 * Retorno do hook useErrorHandler
 */
interface UseErrorHandlerReturn {
  /** Estado atual do erro */
  error: Error | null;
  /** Se está carregando */
  isLoading: boolean;
  /** Número de tentativas realizadas */
  retryCount: number;
  /** Se a última operação foi bem-sucedida */
  isSuccess: boolean;
  /** Executa função com tratamento de erro automático */
  executeWithErrorHandling: <T>(
    operation: () => Promise<T> | T,
    operationContext?: string
  ) => Promise<T | null>;
  /** Executa função com retry automático */
  executeWithRetry: <T>(
    operation: () => Promise<T> | T,
    operationContext?: string
  ) => Promise<T | null>;
  /** Limpa estado de erro */
  clearError: () => void;
  /** Força retry da última operação */
  retry: () => Promise<void>;
  /** Reseta completamente o estado */
  reset: () => void;
}

/**
 * Hook para tratamento consistente de erros
 */
export const useErrorHandler = (
  context: string,
  config: Partial<ErrorHandlerConfig> = {}
): UseErrorHandlerReturn => {
  // Configuração com valores padrão
  const {
    showNotifications = true,
    maxRetries = 3,
    retryDelay = 1000,
    onError,
    onRetrySuccess
  } = config;

  // Estado do hook
  const [state, setState] = useState<ErrorState>({
    error: null,
    isLoading: false,
    retryCount: 0,
    isSuccess: false
  });

  // Referência para a última operação (para retry)
  const lastOperationRef = useRef<{
    operation: () => Promise<any> | any;
    context: string;
  } | null>(null);

  /**
   * Atualiza estado de forma segura
   */
  const updateState = useCallback((updates: Partial<ErrorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  /**
   * Limpa estado de erro
   */
  const clearError = useCallback(() => {
    updateState({
      error: null,
      isSuccess: false,
      retryCount: 0
    });
  }, [updateState]);

  /**
   * Reseta completamente o estado
   */
  const reset = useCallback(() => {
    setState({
      error: null,
      isLoading: false,
      retryCount: 0,
      isSuccess: false
    });
    lastOperationRef.current = null;
  }, []);

  /**
   * Mostra notificação de erro para o usuário
   */
  const showErrorNotification = useCallback((error: Error, operationContext: string) => {
    if (!showNotifications) return;

    // Em um projeto real, isso seria integrado com um sistema de notificações
    // Por enquanto, usamos um toast simples ou console
    logger.info(
      `Notificação de erro mostrada ao usuário: ${error.message}`,
      `${context}.${operationContext}`,
      { errorType: error.name }
    );

    // Implementação simples de notificação
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Erro na aplicação', {
        body: error.message,
        icon: '/favicon.ico'
      });
    }
  }, [showNotifications, context]);

  /**
   * Executa operação com tratamento de erro
   */
  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T> | T,
    operationContext: string = 'operation'
  ): Promise<T | null> => {
    // Salva operação para possível retry
    lastOperationRef.current = { operation, context: operationContext };

    updateState({
      isLoading: true,
      error: null,
      isSuccess: false
    });

    try {
      logger.debug(
        `Iniciando operação: ${operationContext}`,
        `${context}.${operationContext}`
      );

      const result = await operation();

      updateState({
        isLoading: false,
        isSuccess: true,
        error: null
      });

      logger.info(
        `Operação concluída com sucesso: ${operationContext}`,
        `${context}.${operationContext}`
      );

      return result;
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      updateState({
        isLoading: false,
        error: errorObj,
        isSuccess: false
      });

      // Log do erro - use warning para ValidationError, error para outros
      if (errorObj instanceof ValidationError) {
        logger.warning(
          `Erro de validação na operação ${operationContext}: ${errorObj.message}`,
          `${context}.${operationContext}`,
          {
            operationContext,
            errorType: errorObj.name,
            retryCount: state.retryCount
          }
        );
      } else {
        logger.error(
          `Erro na operação ${operationContext}: ${errorObj.message}`,
          `${context}.${operationContext}`,
          {
            operationContext,
            errorType: errorObj.name,
            retryCount: state.retryCount
          },
          errorObj
        );
      }

      // Callback personalizado
      if (onError) {
        try {
          onError(errorObj, `${context}.${operationContext}`);
        } catch (callbackError) {
          logger.error(
            'Erro no callback de tratamento de erro',
            `${context}.onError`,
            { originalError: errorObj.message },
            callbackError as Error
          );
        }
      }

      // Notificação para usuário
      showErrorNotification(errorObj, operationContext);

      return null;
    }
  }, [context, state.retryCount, updateState, onError, showErrorNotification]);

  /**
   * Executa operação com retry automático
   */
  const executeWithRetry = useCallback(async <T>(
    operation: () => Promise<T> | T,
    operationContext: string = 'operation'
  ): Promise<T | null> => {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      updateState({ retryCount: attempt });

      try {
        if (attempt > 0) {
          logger.info(
            `Tentativa ${attempt + 1} de ${maxRetries + 1} para operação: ${operationContext}`,
            `${context}.${operationContext}`,
            { attempt, maxRetries }
          );

          // Delay entre tentativas
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        }

        const result = await executeWithErrorHandling(operation, operationContext);
        
        if (result !== null) {
          if (attempt > 0 && onRetrySuccess) {
            onRetrySuccess(attempt);
            logger.info(
              `Operação bem-sucedida após ${attempt} tentativas: ${operationContext}`,
              `${context}.${operationContext}`,
              { successfulAttempt: attempt + 1, totalAttempts: attempt + 1 }
            );
          }
          return result;
        }
        
        // Se executeWithErrorHandling retornou null, houve erro
        lastError = state.error;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
      }
    }

    // Todas as tentativas falharam
    logger.error(
      `Todas as ${maxRetries + 1} tentativas falharam para operação: ${operationContext}`,
      `${context}.${operationContext}`,
      {
        maxRetries,
        finalError: lastError?.message,
        operationContext
      },
      lastError || new Error('Operação falhou após múltiplas tentativas')
    );

    return null;
  }, [
    maxRetries,
    retryDelay,
    context,
    executeWithErrorHandling,
    state.error,
    updateState,
    onRetrySuccess
  ]);

  /**
   * Força retry da última operação
   */
  const retry = useCallback(async (): Promise<void> => {
    if (!lastOperationRef.current) {
      logger.warning(
        'Tentativa de retry sem operação anterior',
        `${context}.retry`
      );
      return;
    }

    const { operation, context: operationContext } = lastOperationRef.current;
    
    logger.info(
      `Retry manual iniciado para operação: ${operationContext}`,
      `${context}.retry`
    );

    await executeWithErrorHandling(operation, operationContext);
  }, [context, executeWithErrorHandling]);

  return {
    error: state.error,
    isLoading: state.isLoading,
    retryCount: state.retryCount,
    isSuccess: state.isSuccess,
    executeWithErrorHandling,
    executeWithRetry,
    clearError,
    retry,
    reset
  };
};

/**
 * Hook especializado para operações assíncronas comuns
 */
const useAsyncOperation = <T>(
  operation: () => Promise<T>,
  context: string,
  config?: Partial<ErrorHandlerConfig>
) => {
  const errorHandler = useErrorHandler(context, config);
  
  const execute = useCallback(async (): Promise<T | null> => {
    return errorHandler.executeWithErrorHandling(operation, 'asyncOperation');
  }, [operation, errorHandler]);

  const executeWithRetry = useCallback(async (): Promise<T | null> => {
    return errorHandler.executeWithRetry(operation, 'asyncOperation');
  }, [operation, errorHandler]);

  return {
    ...errorHandler,
    execute,
    executeWithRetry
  };
};

/**
 * Hook para tratamento de erros em formulários
 */
const useFormErrorHandler = (formContext: string) => {
  const errorHandler = useErrorHandler(`Form.${formContext}`, {
    showNotifications: true,
    maxRetries: 1
  });

  const handleSubmit = useCallback(async <T>(
    submitOperation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ): Promise<void> => {
    const result = await errorHandler.executeWithErrorHandling(
      submitOperation,
      'submit'
    );

    if (result !== null && onSuccess) {
      onSuccess(result);
    } else if (errorHandler.error && onError) {
      onError(errorHandler.error);
    }
  }, [errorHandler]);

  return {
    ...errorHandler,
    handleSubmit
  };
};