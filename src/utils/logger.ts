/**
 * Sistema Completo de Logging e Tratamento de Erros
 * 
 * Este módulo centraliza toda a lógica de captura, processamento e exibição de erros
 * da aplicação KOMBINU. Fornece logging dual (console + interface) com controle
 * de ambiente e diferentes níveis de severidade.
 * 
 * ARQUITETURA:
 * - LogLevel: Enum para níveis de severidade
 * - LogEntry: Interface para estrutura de logs
 * - Logger: Classe principal para gerenciamento
 * - ErrorBoundary: Componente React para captura de erros
 * 
 * DECISÕES ARQUITETURAIS:
 * 1. Singleton Pattern: Garante uma única instância do logger
 * 2. Observer Pattern: Permite múltiplos listeners para logs
 * 3. Strategy Pattern: Diferentes estratégias de output (console/UI)
 * 4. Factory Pattern: Criação padronizada de entradas de log
 */

// Níveis de severidade dos logs
export enum LogLevel {
  ERROR = 'error',
  WARNING = 'warning', 
  INFO = 'info',
  DEBUG = 'debug'
}

// Interface para estrutura padronizada de logs
export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  error?: Error;
  context?: string;
  timestamp: Date;
  stackTrace?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
  additionalData?: Record<string, any>;
}

// Interface para listeners de log
interface LogListener {
  (entry: LogEntry): void;
}

/**
 * Classe principal do sistema de logging
 * 
 * Implementa o padrão Singleton para garantir uma única instância
 * e centralizar todo o gerenciamento de logs da aplicação.
 */
class LoggerService {
  private static instance: LoggerService;
  private listeners: LogListener[] = [];
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000; // Limite para evitar vazamentos de memória
  private isDevelopment: boolean;
  private sessionId: string;

  private constructor() {
    // Detecta ambiente de desenvolvimento
    this.isDevelopment = import.meta.env.DEV || process.env.NODE_ENV === 'development';
    
    // Gera ID único da sessão
    this.sessionId = this.generateSessionId();
    
    // Configura captura de erros globais
    this.setupGlobalErrorHandlers();
    
    // Log inicial do sistema
    this.info('Sistema de logging inicializado', 'Logger', {
      environment: this.isDevelopment ? 'development' : 'production',
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Implementação do padrão Singleton
   * Garante que apenas uma instância do logger existe
   */
  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  /**
   * Configura handlers globais para captura de erros não tratados
   * 
   * ESTRATÉGIA:
   * - window.onerror: Erros JavaScript síncronos
   * - window.onunhandledrejection: Promises rejeitadas não tratadas
   * - console.error override: Intercepta logs de erro do console
   */
  private setupGlobalErrorHandlers(): void {
    // Captura erros JavaScript síncronos
    window.onerror = (message, source, lineno, colno, error) => {
      this.error(
        `Erro JavaScript não capturado: ${message}`,
        'GlobalErrorHandler',
        {
          source,
          line: lineno,
          column: colno,
          error: error?.stack || 'Stack trace não disponível'
        },
        error || new Error(String(message))
      );
      return false; // Permite que o erro continue sendo processado
    };

    // Captura promises rejeitadas não tratadas
    window.addEventListener('unhandledrejection', (event) => {
      this.error(
        `Promise rejeitada não tratada: ${event.reason}`,
        'UnhandledPromiseRejection',
        {
          reason: event.reason,
          promise: event.promise
        },
        event.reason instanceof Error ? event.reason : new Error(String(event.reason))
      );
    });

    // Intercepta console.error para capturar logs de bibliotecas externas
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      // Chama o console.error original
      originalConsoleError.apply(console, args);
      
      // Registra no nosso sistema de log
      this.error(
        `Console Error: ${args.map(arg => String(arg)).join(' ')}`,
        'ConsoleInterceptor',
        { originalArgs: args }
      );
    };
  }

  /**
   * Gera ID único para a sessão do usuário
   * Usado para rastrear logs de uma mesma sessão
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Gera ID único para cada entrada de log
   */
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cria uma entrada de log padronizada
   * 
   * Factory method que garante consistência na estrutura dos logs
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: string,
    additionalData?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      id: this.generateLogId(),
      level,
      message,
      error,
      context: context || 'Unknown',
      timestamp: new Date(),
      stackTrace: error?.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getCurrentUserId(),
      sessionId: this.sessionId,
      additionalData
    };
  }

  /**
   * Obtém ID do usuário atual (se disponível)
   * Integra com o sistema de autenticação existente
   */
  private getCurrentUserId(): string | undefined {
    try {
      // Tenta obter do localStorage (onde o AuthContext salva)
      const userData = localStorage.getItem('kombinu_usuario');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id;
      }
    } catch (error) {
      // Falha silenciosa - não queremos que o logger quebre por isso
    }
    return undefined;
  }

  /**
   * Adiciona listener para receber notificações de novos logs
   * Permite que componentes da UI se inscrevam para exibir logs
   */
  public addListener(listener: LogListener): void {
    this.listeners.push(listener);
  }

  /**
   * Remove listener específico
   */
  public removeListener(listener: LogListener): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notifica todos os listeners sobre novo log
   */
  private notifyListeners(entry: LogEntry): void {
    this.listeners.forEach(listener => {
      try {
        listener(entry);
      } catch (error) {
        // Evita loops infinitos se um listener falhar
        console.warn('Erro ao notificar listener de log:', error);
      }
    });
  }

  /**
   * Adiciona log à lista interna com controle de memória
   */
  private addToLogHistory(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Remove logs antigos se exceder o limite
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  /**
   * Formata saída para o console com cores e estrutura
   */
  private formatConsoleOutput(entry: LogEntry): void {
    const styles = {
      [LogLevel.ERROR]: 'color: #dc2626; font-weight: bold;',
      [LogLevel.WARNING]: 'color: #d97706; font-weight: bold;',
      [LogLevel.INFO]: 'color: #2563eb; font-weight: bold;',
      [LogLevel.DEBUG]: 'color: #6b7280; font-weight: normal;'
    };

    const timestamp = entry.timestamp.toISOString();
    const context = entry.context || 'Unknown';
    
    console.group(`%c[${entry.level.toUpperCase()}] ${timestamp}`, styles[entry.level]);
    console.log(`%cContexto: ${context}`, 'font-weight: bold;');
    console.log(`%cMensagem: ${entry.message}`, 'font-weight: normal;');
    
    if (entry.error) {
      console.error('Erro:', entry.error);
    }
    
    if (entry.stackTrace) {
      console.log('Stack Trace:', entry.stackTrace);
    }
    
    if (entry.additionalData) {
      console.log('Dados Adicionais:', entry.additionalData);
    }
    
    console.log(`%cURL: ${entry.url}`, 'color: #6b7280;');
    console.log(`%cUser Agent: ${entry.userAgent}`, 'color: #6b7280;');
    console.log(`%cSession ID: ${entry.sessionId}`, 'color: #6b7280;');
    
    if (entry.userId) {
      console.log(`%cUser ID: ${entry.userId}`, 'color: #6b7280;');
    }
    
    console.groupEnd();
  }

  /**
   * Método principal de logging
   * Processa e distribui logs para console e listeners
   */
  private log(
    level: LogLevel,
    message: string,
    context?: string,
    additionalData?: Record<string, any>,
    error?: Error
  ): void {
    const entry = this.createLogEntry(level, message, context, additionalData, error);
    
    // Adiciona ao histórico
    this.addToLogHistory(entry);
    
    // Saída no console (sempre ativa)
    this.formatConsoleOutput(entry);
    
    // Notifica listeners (componentes UI)
    this.notifyListeners(entry);
  }

  /**
   * MÉTODOS PÚBLICOS PARA DIFERENTES NÍVEIS DE LOG
   */

  /**
   * Log de erro - maior severidade
   * Usado para erros que impedem funcionamento normal
   */
  public error(
    message: string,
    context?: string,
    additionalData?: Record<string, any>,
    error?: Error
  ): void {
    this.log(LogLevel.ERROR, message, context, additionalData, error);
  }

  /**
   * Log de aviso - problemas que não impedem funcionamento
   * Usado para situações que merecem atenção
   */
  public warning(
    message: string,
    context?: string,
    additionalData?: Record<string, any>
  ): void {
    this.log(LogLevel.WARNING, message, context, additionalData);
  }

  /**
   * Log informativo - eventos importantes do sistema
   * Usado para rastrear fluxo da aplicação
   */
  public info(
    message: string,
    context?: string,
    additionalData?: Record<string, any>
  ): void {
    this.log(LogLevel.INFO, message, context, additionalData);
  }

  /**
   * Log de debug - informações detalhadas para desenvolvimento
   * Usado apenas em ambiente de desenvolvimento
   */
  public debug(
    message: string,
    context?: string,
    additionalData?: Record<string, any>
  ): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, context, additionalData);
    }
  }

  /**
   * MÉTODOS UTILITÁRIOS
   */

  /**
   * Retorna todos os logs da sessão atual
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Filtra logs por nível de severidade
   */
  public getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Limpa histórico de logs
   */
  public clearLogs(): void {
    this.logs = [];
    this.info('Histórico de logs limpo', 'Logger');
  }

  /**
   * Verifica se está em ambiente de desenvolvimento
   */
  public isDev(): boolean {
    return this.isDevelopment;
  }

  /**
   * Exporta logs em formato JSON para análise externa
   */
  public exportLogs(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      exportedAt: new Date().toISOString(),
      environment: this.isDevelopment ? 'development' : 'production',
      logs: this.logs
    }, null, 2);
  }
}

// Instância singleton exportada
export const logger = LoggerService.getInstance();

/**
 * FUNÇÕES UTILITÁRIAS PARA INTEGRAÇÃO FÁCIL
 */

/**
 * Decorator para capturar erros em métodos de classe
 * 
 * EXEMPLO DE USO:
 * class MinhaClasse {
 *   @logErrors('MinhaClasse.meuMetodo')
 *   meuMetodo() {
 *     // código que pode gerar erro
 *   }
 * }
 */
function logErrors(context: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    
    descriptor.value = function (...args: any[]) {
      try {
        const result = method.apply(this, args);
        
        // Se retorna Promise, captura erros assíncronos
        if (result && typeof result.then === 'function') {
          return result.catch((error: Error) => {
            logger.error(
              `Erro no método ${propertyName}`,
              context,
              { arguments: args },
              error
            );
            throw error; // Re-throw para não quebrar o fluxo
          });
        }
        
        return result;
      } catch (error) {
        logger.error(
          `Erro no método ${propertyName}`,
          context,
          { arguments: args },
          error as Error
        );
        throw error; // Re-throw para não quebrar o fluxo
      }
    };
  };
}

/**
 * Wrapper para funções que podem gerar erro
 * 
 * EXEMPLO DE USO:
 * const resultado = await withErrorLogging(
 *   () => minhaFuncaoPerigosa(),
 *   'MeuComponente.operacaoImportante'
 * );
 */
async function withErrorLogging<T>(
  fn: () => T | Promise<T>,
  context: string,
  additionalData?: Record<string, any>
): Promise<T> {
  try {
    const result = await fn();
    return result;
  } catch (error) {
    logger.error(
      `Erro na execução de ${context}`,
      context,
      additionalData,
      error as Error
    );
    throw error; // Re-throw para não quebrar o fluxo
  }
}

/**
 * INTERCEPTADOR PARA REQUISIÇÕES HTTP
 * 
 * Monitora todas as requisições fetch e registra erros automaticamente
 */
const originalFetch = window.fetch;
window.fetch = async function(...args: Parameters<typeof fetch>): Promise<Response> {
  const [url, options] = args;
  const startTime = Date.now();
  
  try {
    logger.debug(
      `Iniciando requisição HTTP`,
      'HTTPInterceptor',
      {
        url: url.toString(),
        method: options?.method || 'GET',
        headers: options?.headers
      }
    );
    
    const response = await originalFetch.apply(this, args);
    const duration = Date.now() - startTime;
    
    if (!response.ok) {
      logger.warning(
        `Requisição HTTP retornou erro ${response.status}`,
        'HTTPInterceptor',
        {
          url: url.toString(),
          status: response.status,
          statusText: response.statusText,
          duration,
          method: options?.method || 'GET'
        }
      );
    } else {
      logger.debug(
        `Requisição HTTP concluída com sucesso`,
        'HTTPInterceptor',
        {
          url: url.toString(),
          status: response.status,
          duration,
          method: options?.method || 'GET'
        }
      );
    }
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    logger.error(
      `Falha na requisição HTTP`,
      'HTTPInterceptor',
      {
        url: url.toString(),
        method: options?.method || 'GET',
        duration,
        error: (error as Error).message
      },
      error as Error
    );
    
    throw error; // Re-throw para não quebrar o fluxo
  }
};

// Log de inicialização do interceptador
logger.info('Interceptador HTTP configurado', 'HTTPInterceptor');