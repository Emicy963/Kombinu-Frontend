/**
 * Log Viewer Component
 * 
 * Componente para visualização de logs em tempo real na interface da aplicação.
 * Exibe apenas em ambiente de desenvolvimento para não impactar produção.
 * 
 * FUNCIONALIDADES:
 * - Visualização em tempo real de todos os logs
 * - Filtros por nível de severidade
 * - Busca por texto nos logs
 * - Exportação de logs para análise
 * - Interface colapsável e não intrusiva
 * - Auto-scroll para logs mais recentes
 * 
 * INTEGRAÇÃO:
 * - Se conecta automaticamente ao sistema de logging
 * - Recebe notificações de novos logs via listeners
 * - Persiste preferências do usuário no localStorage
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { logger, LogEntry, LogLevel } from '../../utils/logger';
import { 
  Bug, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Filter, 
  Search, 
  Trash2, 
  AlertTriangle,
  Info,
  AlertCircle,
  Zap,
  X
} from 'lucide-react';

/**
 * Props do LogViewer
 */
interface LogViewerProps {
  /** Posição inicial do viewer (padrão: bottom-right) */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Se deve iniciar expandido */
  initialExpanded?: boolean;
  /** Altura máxima quando expandido */
  maxHeight?: number;
}

/**
 * Componente LogViewer
 * 
 * Interface de desenvolvimento para visualização de logs em tempo real
 */
export const LogViewer: React.FC<LogViewerProps> = ({
  position = 'bottom-right',
  initialExpanded = false,
  maxHeight = 400
}) => {
  // States do componente
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<Set<LogLevel>>(
    new Set([LogLevel.ERROR, LogLevel.WARNING, LogLevel.INFO])
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);

  // Refs
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Só renderiza em desenvolvimento
  const isDevelopment = logger.isDev();

  /**
   * Configuração inicial e cleanup
   */
  useEffect(() => {
    if (!isDevelopment) return;

    // Carrega logs existentes
    setLogs(logger.getLogs());

    // Configura listener para novos logs
    const handleNewLog = (entry: LogEntry) => {
      setLogs(prevLogs => [...prevLogs, entry]);
    };

    logger.addListener(handleNewLog);

    // Cleanup
    return () => {
      logger.removeListener(handleNewLog);
    };
  }, [isDevelopment]);

  /**
   * Filtragem de logs baseada em nível e busca
   */
  useEffect(() => {
    let filtered = logs.filter(log => selectedLevels.has(log.level));

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(term) ||
        log.context?.toLowerCase().includes(term) ||
        log.error?.message.toLowerCase().includes(term)
      );
    }

    setFilteredLogs(filtered);
  }, [logs, selectedLevels, searchTerm]);

  /**
   * Auto-scroll para logs mais recentes
   */
  useEffect(() => {
    if (autoScroll && logsContainerRef.current && isExpanded) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll, isExpanded]);

  /**
   * Configurações de posicionamento
   */
  const positionClasses = useMemo(() => {
    const base = 'fixed z-50';
    switch (position) {
      case 'bottom-right':
        return `${base} bottom-4 right-4`;
      case 'bottom-left':
        return `${base} bottom-4 left-4`;
      case 'top-right':
        return `${base} top-4 right-4`;
      case 'top-left':
        return `${base} top-4 left-4`;
      default:
        return `${base} bottom-4 right-4`;
    }
  }, [position]);

  /**
   * Ícones para cada nível de log
   */
  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case LogLevel.WARNING:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case LogLevel.INFO:
        return <Info className="w-4 h-4 text-blue-500" />;
      case LogLevel.DEBUG:
        return <Zap className="w-4 h-4 text-gray-500" />;
    }
  };

  /**
   * Cores para cada nível de log
   */
  const getLevelColors = (level: LogLevel) => {
    switch (level) {
      case LogLevel.ERROR:
        return 'bg-red-50 border-red-200 text-red-800';
      case LogLevel.WARNING:
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case LogLevel.INFO:
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case LogLevel.DEBUG:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  /**
   * Toggle de nível de log
   */
  const toggleLevel = (level: LogLevel) => {
    const newLevels = new Set(selectedLevels);
    if (newLevels.has(level)) {
      newLevels.delete(level);
    } else {
      newLevels.add(level);
    }
    setSelectedLevels(newLevels);
  };

  /**
   * Limpa todos os logs
   */
  const handleClearLogs = () => {
    logger.clearLogs();
    setLogs([]);
  };

  /**
   * Exporta logs para arquivo JSON
   */
  const handleExportLogs = () => {
    const dataStr = logger.exportLogs();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `kombinu-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    logger.info('Logs exportados com sucesso', 'LogViewer');
  };

  /**
   * Formata timestamp para exibição
   */
  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('pt-BR', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  // Não renderiza em produção
  if (!isDevelopment) {
    return null;
  }

  return (
    <div className={positionClasses}>
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden max-w-2xl">
        {/* Header do LogViewer */}
        <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bug className="w-5 h-5" />
            <span className="font-medium">Debug Logs</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-xs">
              {filteredLogs.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Botões de ação */}
            <button
              onClick={handleClearLogs}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Limpar logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleExportLogs}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Exportar logs"
            >
              <Download className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title={isExpanded ? 'Minimizar' : 'Expandir'}
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Conteúdo expandido */}
        {isExpanded && (
          <div className="bg-white">
            {/* Controles de filtro */}
            <div className="border-b border-gray-200 p-3 space-y-3">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar nos logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filtros de nível */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Níveis:</span>
                
                {Object.values(LogLevel).map(level => (
                  <button
                    key={level}
                    onClick={() => toggleLevel(level)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      selectedLevels.has(level)
                        ? getLevelColors(level)
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {level.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Controles adicionais */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                    className="rounded"
                  />
                  <span>Auto-scroll</span>
                </label>
                
                <span className="text-xs text-gray-500">
                  {filteredLogs.length} de {logs.length} logs
                </span>
              </div>
            </div>

            {/* Lista de logs */}
            <div
              ref={logsContainerRef}
              className="overflow-y-auto"
              style={{ maxHeight: `${maxHeight}px` }}
            >
              {filteredLogs.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <Bug className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Nenhum log encontrado</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="p-3 hover:bg-gray-50">
                      {/* Header do log */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getLevelIcon(log.level)}
                          <span className="font-mono text-xs text-gray-500">
                            {formatTimestamp(log.timestamp)}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {log.context}
                          </span>
                        </div>
                        
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColors(log.level)}`}>
                          {log.level.toUpperCase()}
                        </span>
                      </div>

                      {/* Mensagem do log */}
                      <div className="mb-2">
                        <p className="text-sm text-gray-800 font-medium">
                          {log.message}
                        </p>
                      </div>

                      {/* Detalhes adicionais */}
                      {(log.error || log.additionalData) && (
                        <div className="space-y-2">
                          {log.error && (
                            <div className="bg-red-50 border border-red-200 rounded p-2">
                              <p className="text-xs font-medium text-red-800 mb-1">
                                Erro: {log.error.name}
                              </p>
                              <p className="text-xs text-red-700">
                                {log.error.message}
                              </p>
                            </div>
                          )}
                          
                          {log.additionalData && (
                            <details className="text-xs">
                              <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                                Dados adicionais
                              </summary>
                              <pre className="mt-1 p-2 bg-gray-100 rounded overflow-x-auto text-xs">
                                {JSON.stringify(log.additionalData, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Hook para facilitar uso do LogViewer em componentes
 * 
 * EXEMPLO DE USO:
 * const MyComponent = () => {
 *   useLogViewer(); // Adiciona LogViewer automaticamente
 *   
 *   return <div>Meu componente</div>;
 * };
 */
const useLogViewer = (props?: LogViewerProps) => {
  useEffect(() => {
    // Verifica se já existe um LogViewer na página
    if (document.getElementById('log-viewer-container')) {
      return;
    }

    // Cria container para o LogViewer
    const container = document.createElement('div');
    container.id = 'log-viewer-container';
    document.body.appendChild(container);

    // Renderiza o LogViewer
    import('react-dom/client').then(({ createRoot }) => {
      const root = createRoot(container);
      root.render(<LogViewer {...props} />);
    });

    // Cleanup
    return () => {
      const existingContainer = document.getElementById('log-viewer-container');
      if (existingContainer) {
        document.body.removeChild(existingContainer);
      }
    };
  }, []);
};