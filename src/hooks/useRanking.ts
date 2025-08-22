/**
 * Hook personalizado para gerenciar rankings dinâmicos
 * 
 * RESPONSABILIDADES:
 * - Fornecer interface React para o RankingService
 * - Gerenciar estado local dos rankings
 * - Atualizar automaticamente quando há mudanças
 * - Fornecer funções utilitárias para componentes
 * 
 * USO:
 * const { rankings, posicaoUsuario, atualizarRanking } = useRanking(usuario?.id);
 */

import { useState, useEffect, useCallback } from 'react';
import { rankingService, RankingEntry, RankingData } from '../services/rankingService';
import { logger } from '../utils/logger';

/**
 * Tipo para filtros de ranking
 */
type FiltroRanking = 'global' | 'semanal' | 'mensal';

/**
 * Interface de retorno do hook
 */
interface UseRankingReturn {
  // Estados dos rankings
  rankings: RankingData;
  rankingAtual: RankingEntry[];
  filtroAtivo: FiltroRanking;
  carregando: boolean;
  
  // Informações do usuário atual
  posicaoUsuario: number;
  entradaUsuario: RankingEntry | undefined;
  
  // Funções de controle
  alterarFiltro: (filtro: FiltroRanking) => void;
  atualizarRanking: (
    usuarioId: string,
    quizId: string,
    categoria: string,
    pontos: number,
    acertos: number,
    total: number,
    tempoGasto: number
  ) => void;
  
  // Funções utilitárias
  obterPosicaoAnterior: (usuarioId: string) => number;
  obterTendencia: (usuarioId: string) => 'subiu' | 'desceu' | 'manteve' | 'novo';
  obterEstatisticas: () => any;
}

/**
 * Hook principal para rankings
 */
export const useRanking = (usuarioId?: string): UseRankingReturn => {
  // Estados locais
  const [rankings, setRankings] = useState<RankingData>({
    global: [],
    semanal: [],
    mensal: [],
    categoria: {}
  });
  
  const [filtroAtivo, setFiltroAtivo] = useState<FiltroRanking>('global');
  const [carregando, setCarregando] = useState(true);

  /**
   * Função para atualizar rankings locais
   */
  const atualizarRankingsLocais = useCallback((novosRankings: RankingData) => {
    setRankings(novosRankings);
    setCarregando(false);
    
    logger.debug('Rankings atualizados no hook', 'useRanking', {
      totalGlobal: novosRankings.global.length,
      totalSemanal: novosRankings.semanal.length,
      totalMensal: novosRankings.mensal.length
    });
  }, []);

  /**
   * Inicialização do hook
   */
  useEffect(() => {
    logger.debug('Inicializando useRanking hook', 'useRanking', { usuarioId });
    
    // Carrega rankings iniciais
    const rankingsIniciais: RankingData = {
      global: rankingService.obterRankingGlobal(),
      semanal: rankingService.obterRankingSemanal(),
      mensal: rankingService.obterRankingMensal(),
      categoria: {}
    };
    
    setRankings(rankingsIniciais);
    setCarregando(false);
    
    // Adiciona listener para atualizações automáticas
    rankingService.adicionarListener(atualizarRankingsLocais);
    
    // Cleanup
    return () => {
      rankingService.removerListener(atualizarRankingsLocais);
      logger.debug('useRanking hook desmontado', 'useRanking');
    };
  }, [atualizarRankingsLocais]);

  /**
   * Obtém ranking atual baseado no filtro ativo
   */
  const rankingAtual = (() => {
    switch (filtroAtivo) {
      case 'semanal':
        return rankings.semanal;
      case 'mensal':
        return rankings.mensal;
      default:
        return rankings.global;
    }
  })();

  /**
   * Obtém posição do usuário atual
   */
  const posicaoUsuario = usuarioId ? rankingService.obterPosicaoUsuario(usuarioId) : 0;

  /**
   * Obtém entrada completa do usuário atual
   */
  const entradaUsuario = usuarioId ? rankingService.obterEntradaUsuario(usuarioId) : undefined;

  /**
   * Altera filtro ativo
   */
  const alterarFiltro = useCallback((novoFiltro: FiltroRanking) => {
    setFiltroAtivo(novoFiltro);
    logger.debug('Filtro de ranking alterado', 'useRanking', { 
      filtroAnterior: filtroAtivo, 
      novoFiltro 
    });
  }, [filtroAtivo]);

  /**
   * Função para processar conclusão de quiz
   * INTEGRAÇÃO PRINCIPAL - chamada quando um quiz é completado
   */
  const atualizarRanking = useCallback((
    usuarioIdParam: string,
    quizId: string,
    categoria: string,
    pontos: number,
    acertos: number,
    total: number,
    tempoGasto: number
  ) => {
    logger.info(
      'Processando atualização de ranking via hook',
      'useRanking.atualizarRanking',
      {
        usuarioId: usuarioIdParam,
        quizId,
        categoria,
        pontos,
        acertos,
        total,
        tempoGasto
      }
    );

    // Aqui precisamos obter o objeto usuário completo
    // Em uma implementação real, isso viria do contexto de autenticação
    const usuarioCompleto = {
      id: usuarioIdParam,
      nome: 'Usuário', // Seria obtido do contexto
      email: '',
      tipo: 'aprendiz' as const,
      pontos: pontos,
      nivel: Math.floor(pontos / 1000) + 1,
      dataCriacao: new Date()
    };

    // Chama o serviço para processar o quiz
    rankingService.processarQuizCompletado(
      usuarioCompleto,
      quizId,
      categoria,
      pontos,
      acertos,
      total,
      tempoGasto
    );
  }, []);

  /**
   * Obtém posição anterior de um usuário
   */
  const obterPosicaoAnterior = useCallback((usuarioIdParam: string): number => {
    const entrada = rankingService.obterEntradaUsuario(usuarioIdParam);
    return entrada?.posicaoAnterior || 0;
  }, []);

  /**
   * Obtém tendência de um usuário
   */
  const obterTendencia = useCallback((usuarioIdParam: string) => {
    const entrada = rankingService.obterEntradaUsuario(usuarioIdParam);
    return entrada?.tendencia || 'novo';
  }, []);

  /**
   * Obtém estatísticas gerais
   */
  const obterEstatisticas = useCallback(() => {
    return rankingService.obterEstatisticasGerais();
  }, []);

  return {
    // Estados
    rankings,
    rankingAtual,
    filtroAtivo,
    carregando,
    
    // Informações do usuário
    posicaoUsuario,
    entradaUsuario,
    
    // Funções de controle
    alterarFiltro,
    atualizarRanking,
    
    // Funções utilitárias
    obterPosicaoAnterior,
    obterTendencia,
    obterEstatisticas
  };
};

/**
 * Hook especializado para estatísticas de ranking
 */
export const useRankingStats = () => {
  const [estatisticas, setEstatisticas] = useState(rankingService.obterEstatisticasGerais());

  useEffect(() => {
    const atualizarEstatisticas = () => {
      setEstatisticas(rankingService.obterEstatisticasGerais());
    };

    // Atualiza estatísticas quando rankings mudam
    rankingService.adicionarListener(atualizarEstatisticas);

    return () => {
      rankingService.removerListener(atualizarEstatisticas);
    };
  }, []);

  return estatisticas;
};