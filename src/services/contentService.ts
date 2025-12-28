/**
 * Serviço para gerenciar conteúdos
 * Centraliza operações CRUD de conteúdos
 */

import axios from 'axios';
import type { Conteudo, FormularioConteudo } from '../types';
import { API_BASE_URL } from '../utils/constants';
import { storageService } from './storageService';

/**
 * Classe para gerenciar operações de conteúdo
 */
class ContentService {
  /**
   * Carrega todos os conteúdos
   * @returns Array de conteúdos
   */
  async carregarConteudos(): Promise<Conteudo[]> {
    try {
      // Temporariamente desabilitado - endpoint não existe na API
      // const response = await axios.get(`${API_BASE_URL}/contents`);
      // return response.data;

      // Fallback direto para localStorage
      return storageService.carregarConteudos();
    } catch (error) {
      console.error('Erro ao carregar conteúdos:', error);
      // Fallback para localStorage se a API falhar
      return storageService.carregarConteudos();
    }
  }

  /**
   * Busca um conteúdo específico por ID
   * @param id - ID do conteúdo
   * @returns Conteúdo encontrado ou undefined
   */
  async obterConteudo(id: string): Promise<Conteudo | undefined> {
    try {
      const response = await axios.get(`${API_BASE_URL}/contents/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter conteúdo:', error);
      return undefined;
    }
  }

  /**
   * Busca conteúdos de um criador específico
   * @param criadorId - ID do criador
   * @returns Array de conteúdos do criador
   */
  async obterConteudosPorCriador(criadorId: string): Promise<Conteudo[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/contents?creatorId=${criadorId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter conteúdos por criador:', error);
      return [];
    }
  }

  /**
   * Busca apenas conteúdos públicos
   * @returns Array de conteúdos públicos
   */
  async obterConteudosPublicos(): Promise<Conteudo[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/contents?public=true`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter conteúdos públicos:', error);
      return [];
    }
  }

  /**
   * Cria um novo conteúdo
   * @param dadosConteudo - Dados do formulário de criação
   * @param criadorId - ID do criador
   * @param criadorNome - Nome do criador
   * @returns Conteúdo criado
   */
  async criarConteudo(
    dadosConteudo: FormularioConteudo, 
    criadorId: string, 
    criadorNome: string
  ): Promise<Conteudo> {
    try {
      const response = await axios.post(`${API_BASE_URL}/contents`, {
        ...dadosConteudo,
        criadorId,
        criadorNome
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao criar conteúdo:', error);
      throw error;
    }
  }

  /**
   * Atualiza um conteúdo existente
   * @param id - ID do conteúdo
   * @param dadosAtualizacao - Dados a serem atualizados
   * @returns Conteúdo atualizado ou undefined se não encontrado
   */
  async atualizarConteudo(id: string, dadosAtualizacao: Partial<Conteudo>): Promise<Conteudo | undefined> {
    try {
      const response = await axios.put(`${API_BASE_URL}/contents/${id}`, dadosAtualizacao);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar conteúdo:', error);
      return undefined;
    }
  }

  /**
   * Remove um conteúdo
   * @param id - ID do conteúdo a ser removido
   * @returns Boolean indicando sucesso da operação
   */
  async deletarConteudo(id: string): Promise<boolean> {
    try {
      await axios.delete(`${API_BASE_URL}/contents/${id}`);
      return true;
    } catch (error) {
      console.error('Erro ao deletar conteúdo:', error);
      return false;
    }
  }

  /**
   * Incrementa o contador de visualizações
   * @param id - ID do conteúdo
   */
  async incrementarVisualizacao(id: string): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/contents/${id}/view`);
    } catch (error) {
      console.error('Erro ao incrementar visualização:', error);
    }
  }

  /**
   * Incrementa o contador de likes
   * @param id - ID do conteúdo
   */
  async toggleLike(id: string): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/contents/${id}/like`);
    } catch (error) {
      console.error('Erro ao dar like:', error);
    }
  }

  /**
   * Filtra conteúdos baseado em critérios de busca
   * @param conteudos - Array de conteúdos para filtrar
   * @param filtros - Objeto com critérios de filtro
   * @returns Array de conteúdos filtrados
   */
  filtrarConteudos(
    conteudos: Conteudo[],
    filtros: {
      busca?: string;
      categoria?: string;
      tipo?: string;
      dificuldade?: string;
    }
  ): Conteudo[] {
    return conteudos.filter(conteudo => {
      // Filtro de busca por título e descrição
      const matchBusca = !filtros.busca || 
        conteudo.titulo.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        conteudo.descricao.toLowerCase().includes(filtros.busca.toLowerCase());

      // Filtro por categoria
      const matchCategoria = !filtros.categoria || conteudo.categoria === filtros.categoria;

      // Filtro por tipo
      const matchTipo = !filtros.tipo || conteudo.tipo === filtros.tipo;

      // Filtro por dificuldade
      const matchDificuldade = !filtros.dificuldade || conteudo.dificuldade === filtros.dificuldade;

      return matchBusca && matchCategoria && matchTipo && matchDificuldade;
    });
  }
}

// Exporta uma instância única do serviço (Singleton)
export const contentService = new ContentService();