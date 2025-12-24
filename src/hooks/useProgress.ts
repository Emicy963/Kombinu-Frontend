/**
 * Hook personalizado para gerenciar progresso dos usuários
 * Fornece interface simplificada para operações de progresso
 */

import { useEffect, useState } from 'react';
import { progressService } from '../services/progressService';
import type { ProgressoUsuario } from '../types';

/**
 * Hook para gerenciar estado de progresso
 * @returns Objeto com estado e funções de progresso
 */
export const useProgress = () => {
  // Estado dos progressos
  const [progressos, setProgressos] = useState<ProgressoUsuario[]>([]);
  
  // Estado de carregamento
  const [carregando, setCarregando] = useState(true);

  /**
   * Carrega progressos ao inicializar o hook
   */
  useEffect(() => {
    const carregarDados = async () => {
      await carregarProgressos();
    };
    carregarDados();
  }, []);

  /**
   * Carrega todos os progressos
   */
  const carregarProgressos = async (): Promise<void> => {
    try {
      setCarregando(true);
      const progressosCarregados = await progressService.carregarProgressos();
      setProgressos(progressosCarregados || []);
    } catch (error) {
      console.error('Erro ao carregar progressos:', error);
      // Em caso de erro, garante que seja um array vazio
      setProgressos([]);
    } finally {
      setCarregando(false);
    }
  };

  /**
   * Salva ou atualiza progresso
   * @param progresso - Dados do progresso
   */
  const salvarProgresso = (progresso: ProgressoUsuario): void => {
    progressService.salvarProgresso(progresso);
    
    // Atualiza estado local
    setProgressos(prev => {
      const index = prev.findIndex(p => 
        p.usuarioId === progresso.usuarioId && 
        p.conteudoId === progresso.conteudoId
      );
      
      if (index !== -1) {
        // Atualiza progresso existente
        const novosProgressos = [...prev];
        novosProgressos[index] = progresso;
        return novosProgressos;
      } else {
        // Adiciona novo progresso
        return [...prev, progresso];
      }
    });
  };

  /**
   * Inicia progresso para um conteúdo
   * @param usuarioId - ID do usuário
   * @param conteudoId - ID do conteúdo
   * @returns Progresso criado
   */
  const iniciarProgresso = (usuarioId: string, conteudoId: string): ProgressoUsuario => {
    const novoProgresso = progressService.iniciarProgresso(usuarioId, conteudoId);
    
    // Atualiza estado local
    setProgressos(prev => [...prev, novoProgresso]);
    
    return novoProgresso;
  };

  /**
   * Marca conteúdo como concluído
   * @param usuarioId - ID do usuário
   * @param conteudoId - ID do conteúdo
   * @param pontos - Pontos ganhos
   * @param tempoGasto - Tempo gasto em segundos
   * @returns Progresso atualizado
   */
  const concluirProgresso = (
    usuarioId: string,
    conteudoId: string,
    pontos: number,
    tempoGasto: number
  ): ProgressoUsuario => {
    const progressoAtualizado = progressService.concluirProgresso(
      usuarioId,
      conteudoId,
      pontos,
      tempoGasto
    );
    
    // Atualiza estado local
    setProgressos(prev => 
      prev.map(p => 
        p.usuarioId === usuarioId && p.conteudoId === conteudoId
          ? progressoAtualizado
          : p
      )
    );
    
    return progressoAtualizado;
  };

  /**
   * Atualiza progresso parcial
   * @param usuarioId - ID do usuário
   * @param conteudoId - ID do conteúdo
   * @param progresso - Percentual de progresso
   * @param tempoGasto - Tempo gasto em segundos
   */
  const atualizarProgresso = (
    usuarioId: string,
    conteudoId: string,
    progresso: number,
    tempoGasto: number
  ): void => {
    progressService.atualizarProgresso(usuarioId, conteudoId, progresso, tempoGasto);
    
    // Atualiza estado local
    setProgressos(prev => 
      prev.map(p => 
        p.usuarioId === usuarioId && p.conteudoId === conteudoId
          ? { 
              ...p, 
              progresso: Math.max(p.progresso, progresso),
              tempoGasto: Math.max(p.tempoGasto, tempoGasto)
            }
          : p
      )
    );
  };

  /**
   * Busca progresso específico
   * @param usuarioId - ID do usuário
   * @param conteudoId - ID do conteúdo
   * @returns Progresso encontrado ou undefined
   */
  const obterProgresso = (usuarioId: string, conteudoId: string): ProgressoUsuario | undefined => {
    return progressos.find(p => 
      p.usuarioId === usuarioId && p.conteudoId === conteudoId
    );
  };

  /**
   * Busca progressos de um usuário
   * @param usuarioId - ID do usuário
   * @returns Array de progressos
   */
  const obterProgressosUsuario = (usuarioId: string): ProgressoUsuario[] => {
    return progressos.filter(p => p.usuarioId === usuarioId);
  };

  /**
   * Busca progressos de um conteúdo
   * @param conteudoId - ID do conteúdo
   * @returns Array de progressos
   */
  const obterProgressosConteudo = (conteudoId: string): ProgressoUsuario[] => {
    return progressos.filter(p => p.conteudoId === conteudoId);
  };

  /**
   * Calcula estatísticas de um usuário
   * @param usuarioId - ID do usuário
   * @returns Objeto com estatísticas
   */
  const calcularEstatisticasUsuario = (usuarioId: string) => {
    return progressService.calcularEstatisticasUsuario(usuarioId);
  };

  return {
    // Estado
    progressos,
    carregando,
    
    // Funções principais
    salvarProgresso,
    iniciarProgresso,
    concluirProgresso,
    atualizarProgresso,
    
    // Funções de busca
    obterProgresso,
    obterProgressosUsuario,
    obterProgressosConteudo,
    
    // Utilitários
    calcularEstatisticasUsuario,
    carregarProgressos
  };
};