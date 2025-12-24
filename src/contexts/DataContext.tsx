/**
 * Context de Dados
 * Fornece estado global de conteúdos e progresso para toda a aplicação
 * Refatorado para usar hooks personalizados e serviços
 */

import React, { createContext, useContext } from 'react';
import { useContent } from '../hooks/useContent';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useProgress } from '../hooks/useProgress';
import { useRanking } from '../hooks/useRanking'; /* NOVO */
import type { Conteudo, FormularioConteudo, ProgressoUsuario } from '../types';
import { logger } from '../utils/logger';

interface DataContextType {
  conteudos: Conteudo[];
  progressos: ProgressoUsuario[];
  carregandoConteudos: boolean;
  carregandoProgressos: boolean;
  
  // Funções de conteúdo
  criarConteudo: (dadosConteudo: FormularioConteudo, criadorId: string, criadorNome: string) => Promise<Conteudo>;
  atualizarConteudo: (id: string, conteudo: Partial<Conteudo>) => Promise<Conteudo | undefined>;
  deletarConteudo: (id: string) => Promise<boolean>;
  obterConteudo: (id: string) => Conteudo | undefined;
  obterConteudosPorCriador: (criadorId: string) => Conteudo[];
  obterConteudosPublicos: () => Conteudo[];
  filtrarConteudos: (filtros: any) => Conteudo[];
  incrementarVisualizacao: (id: string) => Promise<void>;
  toggleLike: (id: string) => Promise<void>;
  
  // Funções de progresso
  salvarProgresso: (progresso: ProgressoUsuario) => void;
  iniciarProgresso: (usuarioId: string, conteudoId: string) => ProgressoUsuario;
  concluirProgresso: (usuarioId: string, conteudoId: string, pontos: number, tempoGasto: number) => ProgressoUsuario;
  atualizarProgresso: (usuarioId: string, conteudoId: string, progresso: number, tempoGasto: number) => void;
  obterProgresso: (usuarioId: string, conteudoId: string) => ProgressoUsuario | undefined;
  obterProgressosUsuario: (usuarioId: string) => ProgressoUsuario[];
  obterProgressosConteudo: (conteudoId: string) => ProgressoUsuario[];
  calcularEstatisticasUsuario: (usuarioId: string) => any;
  
  /* NOVO - Funções de ranking integradas */
  atualizarRankingAposQuiz: (
    usuarioId: string,
    quizId: string,
    categoria: string,
    pontos: number,
    acertos: number,
    total: number,
    tempoGasto: number
  ) => void;
}

// Cria o contexto de dados
const DataContext = createContext<DataContextType | undefined>(undefined);

/**
 * Provider de dados
 * Envolve a aplicação e fornece estado de conteúdos e progresso
 */
export function DataProvider({ children }: { children: React.ReactNode }) {
  // Usa os hooks personalizados
  const contentHook = useContent();
  const progressHook = useProgress();
  const rankingHook = useRanking();
  const { executeWithErrorHandling } = useErrorHandler('DataContext');

  // Wrapper para salvar progresso com logging
  const salvarProgressoComLog = (progresso: ProgressoUsuario): void => {
    executeWithErrorHandling(() => {
      logger.debug(
        'Salvando progresso do usuário',
        'DataContext.salvarProgresso',
        { 
          usuarioId: progresso.usuarioId,
          conteudoId: progresso.conteudoId,
          progresso: progresso.progresso,
          concluido: progresso.concluido,
          pontos: progresso.pontos
        }
      );
      
      progressHook.salvarProgresso(progresso);
      
      if (progresso.concluido) {
        logger.info(
          `🎯 Conteúdo concluído pelo usuário! +${progresso.pontos} pontos`,
          'DataContext.salvarProgresso',
          { 
            usuarioId: progresso.usuarioId,
            conteudoId: progresso.conteudoId,
            pontos: progresso.pontos
          }
        );
      }
    }, 'salvarProgresso');
  };

  // Log de inicialização do DataProvider
  React.useEffect(() => {
    logger.info('DataProvider inicializado', 'DataContext', {
      totalConteudos: contentHook.conteudos.length,
      totalProgressos: progressHook.progressos.length
    });
  }, []);

  // Wrapper para funções de conteúdo com logging
  const criarConteudoComLog = async (
    dadosConteudo: FormularioConteudo,
    criadorId: string,
    criadorNome: string
  ): Promise<Conteudo> => {
    return executeWithErrorHandling(async () => {
      logger.info(
        `Criando novo conteúdo: ${dadosConteudo.titulo}`,
        'DataContext.criarConteudo',
        { 
          criadorId, 
          criadorNome, 
          tipo: dadosConteudo.tipo,
          categoria: dadosConteudo.categoria 
        }
      );
      
      const novoConteudo = await contentHook.criarConteudo(dadosConteudo, criadorId, criadorNome);
      
      logger.info(
        `Conteúdo criado com sucesso: ${novoConteudo.titulo}`,
        'DataContext.criarConteudo',
        { conteudoId: novoConteudo.id, publico: novoConteudo.publico }
      );
      
      return novoConteudo;
    }, 'criarConteudo') as Promise<Conteudo>;
  };

  /* NOVO - Função integrada para atualizar ranking após quiz */
  const atualizarRankingAposQuiz = (
    usuarioId: string,
    quizId: string,
    categoria: string,
    pontos: number,
    acertos: number,
    total: number,
    tempoGasto: number
  ): void => {
    executeWithErrorHandling(() => {
      logger.info(
        'Atualizando ranking após conclusão de quiz',
        'DataContext.atualizarRankingAposQuiz',
        { usuarioId, quizId, categoria, pontos, acertos, total, tempoGasto }
      );
      
      rankingHook.atualizarRanking(
        usuarioId,
        quizId,
        categoria,
        pontos,
        acertos,
        total,
        tempoGasto
      );
    }, 'atualizarRankingAposQuiz');
  };

  // Extrair apenas as funções dos hooks, excluindo estado
  const {
    criarConteudo: criarConteudoOriginal,
    atualizarConteudo,
    deletarConteudo,
    obterConteudo,
    obterConteudosPorCriador,
    obterConteudosPublicos,
    filtrarConteudos,
    incrementarVisualizacao,
    toggleLike
  } = contentHook;

  const {
    salvarProgresso: salvarProgressoOriginal,
    iniciarProgresso,
    concluirProgresso,
    atualizarProgresso,
    obterProgresso,
    obterProgressosUsuario,
    obterProgressosConteudo,
    calcularEstatisticasUsuario
  } = progressHook;

  return (
    <DataContext.Provider value={{
      // Estado de conteúdos
      conteudos: contentHook.conteudos,
      carregandoConteudos: contentHook.carregando,
      
      // Estado de progresso
      progressos: progressHook.progressos,
      carregandoProgressos: progressHook.carregando,
      
      // Funções de conteúdo
      criarConteudo: criarConteudoComLog,
      atualizarConteudo,
      deletarConteudo,
      obterConteudo,
      obterConteudosPorCriador,
      obterConteudosPublicos,
      filtrarConteudos,
      incrementarVisualizacao,
      toggleLike,
      
      // Funções de progresso
      salvarProgresso: salvarProgressoComLog,
      iniciarProgresso,
      concluirProgresso,
      atualizarProgresso,
      obterProgresso,
      obterProgressosUsuario,
      obterProgressosConteudo,
      calcularEstatisticasUsuario,
      
      /* NOVO - Função de ranking integrada */
      atualizarRankingAposQuiz
    }}>
      {children}
    </DataContext.Provider>
  );
}
/**
 * Hook para usar o contexto de dados
 * @returns Contexto de dados
 * @throws Error se usado fora do DataProvider
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    logger.error('useData foi usado fora do DataProvider', 'DataContext.useData');
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};