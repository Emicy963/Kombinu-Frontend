/**
 * Hook personalizado para gerenciar conteúdos
 * Fornece interface simplificada para operações de conteúdo
 */

import { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import type { Conteudo, FormularioConteudo } from '../types';

/**
 * Hook para gerenciar estado de conteúdos
 * @returns Objeto com estado e funções de conteúdo
 */
export const useContent = () => {
  // Estado dos conteúdos
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  
  // Estado de carregamento
  const [carregando, setCarregando] = useState(true);

  /**
   * Carrega conteúdos ao inicializar o hook
   */
  useEffect(() => {
    carregarConteudos();
  }, []);

  /**
   * Carrega todos os conteúdos
   */
  const carregarConteudos = (): void => {
    try {
      setCarregando(true);
      const conteudosCarregados = contentService.carregarConteudos();
      setConteudos(conteudosCarregados);
    } catch (error) {
      console.error('Erro ao carregar conteúdos:', error);
    } finally {
      setCarregando(false);
    }
  };

  /**
   * Cria um novo conteúdo
   * @param dadosConteudo - Dados do formulário
   * @param criadorId - ID do criador
   * @param criadorNome - Nome do criador
   * @returns Conteúdo criado
   */
  const criarConteudo = (
    dadosConteudo: FormularioConteudo,
    criadorId: string,
    criadorNome: string
  ): Conteudo => {
    const novoConteudo = contentService.criarConteudo(dadosConteudo, criadorId, criadorNome);
    
    // Atualiza estado local
    setConteudos(prev => [...prev, novoConteudo]);
    
    return novoConteudo;
  };

  /**
   * Atualiza um conteúdo existente
   * @param id - ID do conteúdo
   * @param dadosAtualizacao - Dados a serem atualizados
   * @returns Conteúdo atualizado ou undefined
   */
  const atualizarConteudo = (id: string, dadosAtualizacao: Partial<Conteudo>): Conteudo | undefined => {
    const conteudoAtualizado = contentService.atualizarConteudo(id, dadosAtualizacao);
    
    if (conteudoAtualizado) {
      // Atualiza estado local
      setConteudos(prev => 
        prev.map(conteudo => 
          conteudo.id === id ? conteudoAtualizado : conteudo
        )
      );
    }
    
    return conteudoAtualizado;
  };

  /**
   * Remove um conteúdo
   * @param id - ID do conteúdo
   * @returns Boolean indicando sucesso
   */
  const deletarConteudo = (id: string): boolean => {
    const sucesso = contentService.deletarConteudo(id);
    
    if (sucesso) {
      // Atualiza estado local
      setConteudos(prev => prev.filter(conteudo => conteudo.id !== id));
    }
    
    return sucesso;
  };

  /**
   * Incrementa visualização de um conteúdo
   * @param id - ID do conteúdo
   */
  const incrementarVisualizacao = (id: string): void => {
    contentService.incrementarVisualizacao(id);
    
    // Atualiza estado local
    setConteudos(prev => 
      prev.map(conteudo => 
        conteudo.id === id 
          ? { ...conteudo, visualizacoes: conteudo.visualizacoes + 1 }
          : conteudo
      )
    );
  };

  /**
   * Toggle like em um conteúdo
   * @param id - ID do conteúdo
   */
  const toggleLike = (id: string): void => {
    contentService.toggleLike(id);
    
    // Atualiza estado local
    setConteudos(prev => 
      prev.map(conteudo => 
        conteudo.id === id 
          ? { ...conteudo, likes: conteudo.likes + 1 }
          : conteudo
      )
    );
  };

  /**
   * Busca um conteúdo específico
   * @param id - ID do conteúdo
   * @returns Conteúdo encontrado ou undefined
   */
  const obterConteudo = (id: string): Conteudo | undefined => {
    return conteudos.find(conteudo => conteudo.id === id);
  };

  /**
   * Busca conteúdos de um criador
   * @param criadorId - ID do criador
   * @returns Array de conteúdos
   */
  const obterConteudosPorCriador = (criadorId: string): Conteudo[] => {
    return conteudos.filter(conteudo => conteudo.criadorId === criadorId);
  };

  /**
   * Busca apenas conteúdos públicos
   * @returns Array de conteúdos públicos
   */
  const obterConteudosPublicos = (): Conteudo[] => {
    return conteudos.filter(conteudo => conteudo.publico);
  };

  /**
   * Filtra conteúdos baseado em critérios
   * @param filtros - Critérios de filtro
   * @returns Array de conteúdos filtrados
   */
  const filtrarConteudos = (filtros: {
    busca?: string;
    categoria?: string;
    tipo?: string;
    dificuldade?: string;
  }): Conteudo[] => {
    return contentService.filtrarConteudos(conteudos, filtros);
  };

  return {
    // Estado
    conteudos,
    carregando,
    
    // Funções CRUD
    criarConteudo,
    atualizarConteudo,
    deletarConteudo,
    
    // Funções de busca
    obterConteudo,
    obterConteudosPorCriador,
    obterConteudosPublicos,
    filtrarConteudos,
    
    // Funções de interação
    incrementarVisualizacao,
    toggleLike,
    
    // Utilitários
    carregarConteudos
  };
};