/**
 * Serviço para gerenciar dados no localStorage
 * Centraliza todas as operações de armazenamento local
 */

import { STORAGE_KEYS } from '../utils/constants';
import type { Usuario, Conteudo, ProgressoUsuario } from '../types';

/**
 * Classe para gerenciar operações do localStorage
 */
class StorageService {
  /**
   * Salva dados no localStorage
   * @param chave - Chave para armazenamento
   * @param dados - Dados a serem salvos
   */
  private salvar<T>(chave: string, dados: T): void {
    try {
      localStorage.setItem(chave, JSON.stringify(dados));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }

  /**
   * Carrega dados do localStorage
   * @param chave - Chave para buscar os dados
   * @param valorPadrao - Valor padrão se não encontrar dados
   * @returns Dados encontrados ou valor padrão
   */
  private carregar<T>(chave: string, valorPadrao: T): T {
    try {
      const dados = localStorage.getItem(chave);
      return dados ? JSON.parse(dados) : valorPadrao;
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
      return valorPadrao;
    }
  }

  /**
   * Remove dados do localStorage
   * @param chave - Chave a ser removida
   */
  private remover(chave: string): void {
    try {
      localStorage.removeItem(chave);
    } catch (error) {
      console.error('Erro ao remover do localStorage:', error);
    }
  }

  // Métodos para usuários
  salvarUsuario(usuario: Usuario): void {
    this.salvar(STORAGE_KEYS.USUARIO, usuario);
  }

  carregarUsuario(): Usuario | null {
    return this.carregar<Usuario | null>(STORAGE_KEYS.USUARIO, null);
  }

  removerUsuario(): void {
    this.remover(STORAGE_KEYS.USUARIO);
  }

  salvarUsuarios(usuarios: Usuario[]): void {
    // Garante que dataCriacao é armazenada como string ISO
    const usersToSave = usuarios.map(user => ({
      ...user,
      dataCriacao: user.dataCriacao instanceof Date ? user.dataCriacao.toISOString() : user.dataCriacao
    }));
    this.salvar(STORAGE_KEYS.USUARIOS, usersToSave);
  }

  carregarUsuarios(): Usuario[] {
    const users = this.carregar<Usuario[]>(STORAGE_KEYS.USUARIOS, []);
    // Converte dataCriacao de volta para objeto Date
    return users.map(user => {
      if (user && typeof user.dataCriacao === 'string') {
        return { ...user, dataCriacao: new Date(user.dataCriacao) };
      }
      return user;
    });
  }

  // Métodos para conteúdos
  salvarConteudos(conteudos: Conteudo[]): void {
    this.salvar(STORAGE_KEYS.CONTEUDOS, conteudos);
  }

  carregarConteudos(): Conteudo[] {
    return this.carregar<Conteudo[]>(STORAGE_KEYS.CONTEUDOS, []);
  }

  // Métodos para progressos
  salvarProgressos(progressos: ProgressoUsuario[]): void {
    this.salvar(STORAGE_KEYS.PROGRESSOS, progressos);
  }

  carregarProgressos(): ProgressoUsuario[] {
    return this.carregar<ProgressoUsuario[]>(STORAGE_KEYS.PROGRESSOS, []);
  }
}

// Exporta uma instância única do serviço (Singleton)
export const storageService = new StorageService();