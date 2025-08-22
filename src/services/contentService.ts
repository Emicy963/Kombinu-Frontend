/**
 * Serviço para gerenciar conteúdos
 * Centraliza operações CRUD de conteúdos
 */

import { storageService } from './storageService';
import { gerarId } from '../utils/helpers';
import type { Conteudo, FormularioConteudo } from '../types';

/**
 * Classe para gerenciar operações de conteúdo
 */
class ContentService {
  /**
   * Carrega todos os conteúdos
   * @returns Array de conteúdos
   */
  carregarConteudos(): Conteudo[] {
    return storageService.carregarConteudos();
  }

  /**
   * Busca um conteúdo específico por ID
   * @param id - ID do conteúdo
   * @returns Conteúdo encontrado ou undefined
   */
  obterConteudo(id: string): Conteudo | undefined {
    const conteudos = this.carregarConteudos();
    return conteudos.find(conteudo => conteudo.id === id);
  }

  /**
   * Busca conteúdos de um criador específico
   * @param criadorId - ID do criador
   * @returns Array de conteúdos do criador
   */
  obterConteudosPorCriador(criadorId: string): Conteudo[] {
    const conteudos = this.carregarConteudos();
    return conteudos.filter(conteudo => conteudo.criadorId === criadorId);
  }

  /**
   * Busca apenas conteúdos públicos
   * @returns Array de conteúdos públicos
   */
  obterConteudosPublicos(): Conteudo[] {
    const conteudos = this.carregarConteudos();
    return conteudos.filter(conteudo => conteudo.publico);
  }

  /**
   * Cria um novo conteúdo
   * @param dadosConteudo - Dados do formulário de criação
   * @param criadorId - ID do criador
   * @param criadorNome - Nome do criador
   * @returns Conteúdo criado
   */
  criarConteudo(
    dadosConteudo: FormularioConteudo, 
    criadorId: string, 
    criadorNome: string
  ): Conteudo {
    const novoConteudo: Conteudo = {
      ...dadosConteudo,
      id: gerarId(),
      criadorId,
      criadorNome,
      visualizacoes: 0,
      likes: 0,
      dataCriacao: new Date()
    };

    const conteudos = this.carregarConteudos();
    conteudos.push(novoConteudo);
    storageService.salvarConteudos(conteudos);

    return novoConteudo;
  }

  /**
   * Atualiza um conteúdo existente
   * @param id - ID do conteúdo
   * @param dadosAtualizacao - Dados a serem atualizados
   * @returns Conteúdo atualizado ou undefined se não encontrado
   */
  atualizarConteudo(id: string, dadosAtualizacao: Partial<Conteudo>): Conteudo | undefined {
    const conteudos = this.carregarConteudos();
    const index = conteudos.findIndex(conteudo => conteudo.id === id);

    if (index === -1) {
      return undefined;
    }

    conteudos[index] = { ...conteudos[index], ...dadosAtualizacao };
    storageService.salvarConteudos(conteudos);

    return conteudos[index];
  }

  /**
   * Remove um conteúdo
   * @param id - ID do conteúdo a ser removido
   * @returns Boolean indicando sucesso da operação
   */
  deletarConteudo(id: string): boolean {
    const conteudos = this.carregarConteudos();
    const conteudosFiltrados = conteudos.filter(conteudo => conteudo.id !== id);

    if (conteudosFiltrados.length === conteudos.length) {
      return false; // Conteúdo não encontrado
    }

    storageService.salvarConteudos(conteudosFiltrados);
    return true;
  }

  /**
   * Incrementa o contador de visualizações
   * @param id - ID do conteúdo
   */
  incrementarVisualizacao(id: string): void {
    const conteudos = this.carregarConteudos();
    const index = conteudos.findIndex(conteudo => conteudo.id === id);

    if (index !== -1) {
      conteudos[index].visualizacoes += 1;
      storageService.salvarConteudos(conteudos);
    }
  }

  /**
   * Incrementa o contador de likes
   * @param id - ID do conteúdo
   */
  toggleLike(id: string): void {
    const conteudos = this.carregarConteudos();
    const index = conteudos.findIndex(conteudo => conteudo.id === id);

    if (index !== -1) {
      conteudos[index].likes += 1;
      storageService.salvarConteudos(conteudos);
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