/**
 * Serviço de Rankings Dinâmicos
 * 
 * RESPONSABILIDADES:
 * - Gerenciar dados de ranking em tempo real
 * - Calcular posições baseadas em critérios múltiplos
 * - Persistir dados entre sessões
 * - Fornecer APIs para atualização e consulta
 * 
 * ARQUITETURA:
 * - Singleton Pattern para instância única
 * - Observer Pattern para notificações em tempo real
 * - Strategy Pattern para diferentes tipos de ranking
 */

import type { Usuario } from '../types';
import { logger } from '../utils/logger';
import { api } from './api';

// Interface para entrada de ranking individual
export interface RankingEntry {
  usuarioId: string;
  nome: string;
  avatar?: string;
  pontos: number;
  nivel: number;
  quizzesCompletados: number;
  sequenciaAtual: number;
  melhorSequencia: number;
  mediaAcertos: number;
  tempoTotalEstudo: number; // em minutos
  ultimaAtividade: Date;
  posicao: number;
  posicaoAnterior?: number;
  tendencia: 'subiu' | 'desceu' | 'manteve' | 'novo';
}

// Interface para diferentes tipos de ranking
export interface RankingData {
  global: RankingEntry[];
  semanal: RankingEntry[];
  mensal: RankingEntry[];
  categoria: { [categoria: string]: RankingEntry[] };
}

// Interface para estatísticas de quiz
interface QuizStats {
  usuarioId: string;
  quizId: string;
  categoria: string;
  pontos: number;
  acertos: number;
  total: number;
  tempoGasto: number; // em segundos
  dataCompletado: Date;
}

// Interface para listeners de atualização
interface RankingUpdateListener {
  (rankings: RankingData): void;
}

/**
 * Classe principal do serviço de rankings
 * Implementa padrão Singleton para garantir consistência
 */
class RankingService {
  private static instance: RankingService;
  private rankings: RankingData;
  private listeners: RankingUpdateListener[] = [];
  private readonly STORAGE_KEY = 'kombinu_rankings';
  private readonly QUIZ_STATS_KEY = 'kombinu_quiz_stats';

  private constructor() {
    // Inicializa rankings vazios e carrega dados em background
    this.rankings = {
      global: [],
      semanal: [],
      mensal: [],
      categoria: {}
    };
    
    // Carrega dados em background
    this.carregarRankings().then(rankings => {
      this.rankings = rankings;
      logger.info('RankingService dados carregados', 'RankingService', {
        totalUsuarios: rankings.global.length,
        categorias: Object.keys(rankings.categoria).length
      });
    }).catch(error => {
      logger.error('Erro ao carregar rankings no construtor', 'RankingService', {}, error);
    });
  }

  /**
   * Implementação do padrão Singleton
   */
  public static getInstance(): RankingService {
    if (!RankingService.instance) {
      RankingService.instance = new RankingService();
    }
    return RankingService.instance;
  }

  /**
   * CARREGAMENTO E PERSISTÊNCIA DE DADOS
   */

  /**
   * Carrega rankings da API ou localStorage
   */
  private async carregarRankings(): Promise<RankingData> {
    try {
      const response = await api.get('/rankings/global/');
      const globalRankings = response.data;
      
      // Ensure dates are parsed
      globalRankings.forEach((entry: any) => {
        if (entry.ultimaAtividade) {
            entry.ultimaAtividade = new Date(entry.ultimaAtividade);
        }
      });

       // Initialize full structure
       const rankings: RankingData = {
          global: globalRankings,
          semanal: [],
          mensal: [],
          categoria: {}
       };
       
       // Derive other lists
       const agora = new Date();
       const umaSemanaAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
       const umMesAtras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);

       rankings.semanal = globalRankings.filter((e: any) => new Date(e.ultimaAtividade) >= umaSemanaAtras).slice(0, 50);
       rankings.mensal = globalRankings.filter((e: any) => new Date(e.ultimaAtividade) >= umMesAtras).slice(0, 100);

      logger.debug('Rankings carregados da API', 'RankingService', {
          totalEntries: rankings.global.length
      });
      return rankings;

    } catch (error) {
      logger.warning('Erro ao carregar rankings da API, tentando localStorage', 'RankingService', error);
      
      // Fallback to localStorage
      const dadosSalvos = localStorage.getItem(this.STORAGE_KEY);
      if (dadosSalvos) {
        const rankings = JSON.parse(dadosSalvos);

        rankings.global.forEach((entry: any) => {
          entry.ultimaAtividade = new Date(entry.ultimaAtividade);
        });
        return rankings;
      }
    }

    // Default empty
    return {
      global: [],
      semanal: [],
      mensal: [],
      categoria: {}
    };
  }

  /**
   * Salva rankings no localStorage
   */
  private salvarRankings(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.rankings));
      logger.debug('Rankings salvos no localStorage', 'RankingService');
    } catch (error) {
      logger.error('Erro ao salvar rankings', 'RankingService', {}, error as Error);
    }
  }

  /**
   * Carrega estatísticas de quiz do localStorage
   */
  private carregarQuizStats(): QuizStats[] {
    try {
      const dados = localStorage.getItem(this.QUIZ_STATS_KEY);
      if (dados) {
        const stats = JSON.parse(dados);
        // Converte strings de data de volta para objetos Date
        stats.forEach((stat: any) => {
          stat.dataCompletado = new Date(stat.dataCompletado);
        });
        return stats;
      }
    } catch (error) {
      logger.error('Erro ao carregar estatísticas de quiz', 'RankingService', {}, error as Error);
    }
    return [];
  }

  /**
   * Salva estatísticas de quiz no localStorage
   */
  private salvarQuizStats(stats: QuizStats[]): void {
    try {
      localStorage.setItem(this.QUIZ_STATS_KEY, JSON.stringify(stats));
    } catch (error) {
      logger.error('Erro ao salvar estatísticas de quiz', 'RankingService', {}, error as Error);
    }
  }

  /**
   * SISTEMA DE LISTENERS (Observer Pattern)
   */

  /**
   * Adiciona listener para atualizações de ranking
   */
  public adicionarListener(listener: RankingUpdateListener): void {
    this.listeners.push(listener);
    logger.debug('Listener adicionado ao RankingService', 'RankingService', {
      totalListeners: this.listeners.length
    });
  }

  /**
   * Remove listener específico
   */
  public removerListener(listener: RankingUpdateListener): void {
    this.listeners = this.listeners.filter(l => l !== listener);
    logger.debug('Listener removido do RankingService', 'RankingService', {
      totalListeners: this.listeners.length
    });
  }

  /**
   * Notifica todos os listeners sobre atualizações
   */
  private notificarListeners(): void {
    this.listeners.forEach(listener => {
      try {
        listener(this.rankings);
      } catch (error) {
        logger.error('Erro ao notificar listener', 'RankingService', {}, error as Error);
      }
    });
  }

  /**
   * PROCESSAMENTO DE QUIZ COMPLETADO
   */

  /**
   * Processa conclusão de quiz e atualiza rankings
   * FUNÇÃO PRINCIPAL - chamada quando um quiz é completado
   */
  public processarQuizCompletado(
    usuario: Usuario,
    quizId: string,
    categoria: string,
    pontos: number,
    acertos: number,
    total: number,
    tempoGasto: number
  ): void {
    logger.info(
      `Processando quiz completado por ${usuario.nome}`,
      'RankingService.processarQuizCompletado',
      {
        usuarioId: usuario.id,
        quizId,
        categoria,
        pontos,
        acertos,
        total,
        tempoGasto
      }
    );

    // 1. Salva estatísticas do quiz
    this.salvarEstatisticasQuiz({
      usuarioId: usuario.id,
      quizId,
      categoria,
      pontos,
      acertos,
      total,
      tempoGasto,
      dataCompletado: new Date()
    });

    // 2. Atualiza ou cria entrada de ranking para o usuário
    this.atualizarEntradaUsuario(usuario, categoria, pontos, acertos, total, tempoGasto);

    // 3. Recalcula todas as posições
    this.recalcularPosicoes();

    // 4. Atualiza rankings por período
    this.atualizarRankingsPorPeriodo();

    // 5. Salva dados atualizados
    this.salvarRankings();

    // 6. Notifica listeners sobre mudanças
    this.notificarListeners();

    logger.info(
      `Quiz processado com sucesso - ${usuario.nome} agora está na posição ${this.obterPosicaoUsuario(usuario.id)}`,
      'RankingService.processarQuizCompletado',
      {
        usuarioId: usuario.id,
        novaPosicao: this.obterPosicaoUsuario(usuario.id)
      }
    );
  }

  /**
   * Salva estatísticas individuais do quiz
   */
  private salvarEstatisticasQuiz(stats: QuizStats): void {
    const estatisticasExistentes = this.carregarQuizStats();
    estatisticasExistentes.push(stats);
    this.salvarQuizStats(estatisticasExistentes);
  }

  /**
   * Atualiza ou cria entrada de ranking para um usuário
   */
  private atualizarEntradaUsuario(
    usuario: Usuario,
    categoria: string,
    pontos: number,
    acertos: number,
    total: number,
    tempoGasto: number
  ): void {
    // Busca entrada existente do usuário
    let entradaExistente = this.rankings.global.find(entry => entry.usuarioId === usuario.id);
    
    if (entradaExistente) {
      // Atualiza entrada existente
      const posicaoAnterior = entradaExistente.posicao;
      
      entradaExistente.pontos = usuario.pontos; // Pontos totais do usuário
      entradaExistente.nivel = usuario.nivel;
      entradaExistente.quizzesCompletados += 1;
      entradaExistente.ultimaAtividade = new Date();
      entradaExistente.posicaoAnterior = posicaoAnterior;
      entradaExistente.tempoTotalEstudo += Math.round(tempoGasto / 60); // Converte para minutos
      
      // Atualiza média de acertos
      const estatisticas = this.obterEstatisticasUsuario(usuario.id);
      entradaExistente.mediaAcertos = this.calcularMediaAcertos(estatisticas);
      
      // Atualiza sequência atual (simplificado - pode ser expandido)
      if (acertos / total >= 0.7) { // 70% ou mais de acerto
        entradaExistente.sequenciaAtual += 1;
        if (entradaExistente.sequenciaAtual > entradaExistente.melhorSequencia) {
          entradaExistente.melhorSequencia = entradaExistente.sequenciaAtual;
        }
      } else {
        entradaExistente.sequenciaAtual = 0;
      }
      
      logger.debug('Entrada de ranking atualizada', 'RankingService', {
        usuarioId: usuario.id,
        novosPontos: entradaExistente.pontos,
        quizzesCompletados: entradaExistente.quizzesCompletados
      });
    } else {
      // Cria nova entrada
      const novaEntrada: RankingEntry = {
        usuarioId: usuario.id,
        nome: usuario.nome,
        avatar: usuario.avatar,
        pontos: usuario.pontos,
        nivel: usuario.nivel,
        quizzesCompletados: 1,
        sequenciaAtual: acertos / total >= 0.7 ? 1 : 0,
        melhorSequencia: acertos / total >= 0.7 ? 1 : 0,
        mediaAcertos: (acertos / total) * 100,
        tempoTotalEstudo: Math.round(tempoGasto / 60),
        ultimaAtividade: new Date(),
        posicao: 0, // Será calculado depois
        tendencia: 'novo'
      };
      
      this.rankings.global.push(novaEntrada);
      
      logger.info('Nova entrada de ranking criada', 'RankingService', {
        usuarioId: usuario.id,
        nome: usuario.nome,
        pontosIniciais: novaEntrada.pontos
      });
    }
  }

  /**
   * CÁLCULOS E ORDENAÇÃO
   */

  /**
   * Recalcula todas as posições no ranking global
   */
  private recalcularPosicoes(): void {
    // Ordena por critérios múltiplos
    this.rankings.global.sort((a, b) => {
      // 1. Pontos (peso maior)
      if (a.pontos !== b.pontos) {
        return b.pontos - a.pontos;
      }
      
      // 2. Média de acertos
      if (a.mediaAcertos !== b.mediaAcertos) {
        return b.mediaAcertos - a.mediaAcertos;
      }
      
      // 3. Melhor sequência
      if (a.melhorSequencia !== b.melhorSequencia) {
        return b.melhorSequencia - a.melhorSequencia;
      }
      
      // 4. Quizzes completados
      if (a.quizzesCompletados !== b.quizzesCompletados) {
        return b.quizzesCompletados - a.quizzesCompletados;
      }
      
      // 5. Última atividade (mais recente primeiro)
      return new Date(b.ultimaAtividade).getTime() - new Date(a.ultimaAtividade).getTime();
    });

    // Atualiza posições e tendências
    this.rankings.global.forEach((entry, index) => {
      const posicaoAnterior = entry.posicao;
      entry.posicao = index + 1;
      
      // Calcula tendência
      if (entry.tendencia !== 'novo') {
        if (posicaoAnterior === 0) {
          entry.tendencia = 'novo';
        } else if (entry.posicao < posicaoAnterior) {
          entry.tendencia = 'subiu';
        } else if (entry.posicao > posicaoAnterior) {
          entry.tendencia = 'desceu';
        } else {
          entry.tendencia = 'manteve';
        }
      }
    });

    logger.debug('Posições recalculadas', 'RankingService', {
      totalEntradas: this.rankings.global.length
    });
  }

  /**
   * Atualiza rankings por período (semanal, mensal)
   */
  private atualizarRankingsPorPeriodo(): void {
    const agora = new Date();
    const umaSemanaAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
    const umMesAtras = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Ranking semanal - usuários ativos na última semana
    this.rankings.semanal = this.rankings.global
      .filter(entry => new Date(entry.ultimaAtividade) >= umaSemanaAtras)
      .slice(0, 50); // Top 50

    // Ranking mensal - usuários ativos no último mês
    this.rankings.mensal = this.rankings.global
      .filter(entry => new Date(entry.ultimaAtividade) >= umMesAtras)
      .slice(0, 100); // Top 100

    logger.debug('Rankings por período atualizados', 'RankingService', {
      semanal: this.rankings.semanal.length,
      mensal: this.rankings.mensal.length
    });
  }

  /**
   * FUNÇÕES UTILITÁRIAS
   */

  /**
   * Calcula média de acertos de um usuário
   */
  private calcularMediaAcertos(estatisticas: QuizStats[]): number {
    if (estatisticas.length === 0) return 0;
    
    const totalAcertos = estatisticas.reduce((sum, stat) => sum + stat.acertos, 0);
    const totalPerguntas = estatisticas.reduce((sum, stat) => sum + stat.total, 0);
    
    return totalPerguntas > 0 ? (totalAcertos / totalPerguntas) * 100 : 0;
  }

  /**
   * Obtém estatísticas de quiz de um usuário
   */
  private obterEstatisticasUsuario(usuarioId: string): QuizStats[] {
    const todasEstatisticas = this.carregarQuizStats();
    return todasEstatisticas.filter(stat => stat.usuarioId === usuarioId);
  }

  /**
   * APIS PÚBLICAS PARA CONSULTA
   */

  /**
   * Obtém ranking global atual
   */
  public obterRankingGlobal(): RankingEntry[] {
    return [...this.rankings.global];
  }

  /**
   * Obtém ranking semanal
   */
  public obterRankingSemanal(): RankingEntry[] {
    return [...this.rankings.semanal];
  }

  /**
   * Obtém ranking mensal
   */
  public obterRankingMensal(): RankingEntry[] {
    return [...this.rankings.mensal];
  }

  /**
   * Obtém ranking por categoria
   */
  public obterRankingPorCategoria(categoria: string): RankingEntry[] {
    return this.rankings.categoria[categoria] || [];
  }

  /**
   * Obtém posição atual de um usuário
   */
  public obterPosicaoUsuario(usuarioId: string): number {
    const entrada = this.rankings.global.find(entry => entry.usuarioId === usuarioId);
    return entrada ? entrada.posicao : 0;
  }

  /**
   * Obtém entrada completa de um usuário
   */
  public obterEntradaUsuario(usuarioId: string): RankingEntry | undefined {
    return this.rankings.global.find(entry => entry.usuarioId === usuarioId);
  }

  /**
   * Obtém estatísticas gerais dos rankings
   */
  public obterEstatisticasGerais() {
    return {
      totalUsuarios: this.rankings.global.length,
      usuariosAtivosUltimaSemana: this.rankings.semanal.length,
      usuariosAtivosUltimoMes: this.rankings.mensal.length,
      categorias: Object.keys(this.rankings.categoria).length,
      ultimaAtualizacao: new Date()
    };
  }

  /**
   * FUNÇÕES DE MANUTENÇÃO
   */

  /**
   * Limpa dados antigos (manutenção)
   */
  public limparDadosAntigos(diasParaManter: number = 90): void {
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - diasParaManter);

    // Remove estatísticas antigas
    const estatisticas = this.carregarQuizStats();
    const estatisticasFiltradas = estatisticas.filter(
      stat => new Date(stat.dataCompletado) >= dataLimite
    );
    this.salvarQuizStats(estatisticasFiltradas);

    logger.info('Limpeza de dados antigos concluída', 'RankingService', {
      diasParaManter,
      estatisticasRemovidas: estatisticas.length - estatisticasFiltradas.length
    });
  }

  /**
   * Reseta todos os rankings (usar com cuidado)
   */
  public resetarRankings(): void {
    this.rankings = {
      global: [],
      semanal: [],
      mensal: [],
      categoria: {}
    };
    
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.QUIZ_STATS_KEY);
    
    this.notificarListeners();
    
    logger.warning('Todos os rankings foram resetados', 'RankingService');
  }
}

// Exporta função que retorna a instância singleton
let _rankingService: RankingService | null = null;

export const rankingService = {
  get obterRankingGlobal() {
    return RankingService.getInstance().obterRankingGlobal();
  },
  get obterRankingSemanal() {
    return RankingService.getInstance().obterRankingSemanal();
  },
  get obterRankingMensal() {
    return RankingService.getInstance().obterRankingMensal();
  },
  obterRankingPorCategoria: (categoria: string) => {
    return RankingService.getInstance().obterRankingPorCategoria(categoria);
  },
  obterPosicaoUsuario: (usuarioId: string) => {
    return RankingService.getInstance().obterPosicaoUsuario(usuarioId);
  },
  obterEntradaUsuario: (usuarioId: string) => {
    return RankingService.getInstance().obterEntradaUsuario(usuarioId);
  },
  obterEstatisticasGerais: () => {
    return RankingService.getInstance().obterEstatisticasGerais();
  },
  adicionarListener: (listener: any) => {
    return RankingService.getInstance().adicionarListener(listener);
  },
  removerListener: (listener: any) => {
    return RankingService.getInstance().removerListener(listener);
  },
  processarQuizCompletado: (usuarioId: string, quizId: string, categoria: string, pontos: number, acertos: number, total: number, tempoGasto: number) => {
    return RankingService.getInstance().processarQuizCompletado(usuarioId, quizId, categoria, pontos, acertos, total, tempoGasto);
  }
};