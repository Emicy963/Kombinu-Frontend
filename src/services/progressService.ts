/**
 * Serviço para gerenciar progresso dos usuários
 * Centraliza operações relacionadas ao progresso de aprendizado
 */

import axios from 'axios';
import type { ProgressoUsuario } from '../types';
import { API_BASE_URL } from '../utils/constants';
import { storageService } from './storageService';

/**
 * Classe para gerenciar progresso dos usuários
 */
class ProgressService {
  /**
   * Carrega todos os progressos
   * @returns Array de progressos
   */
  async carregarProgressos(): Promise<ProgressoUsuario[]> {
    try {
      // Temporariamente desabilitado - endpoint não existe na API
      // const response = await axios.get(`${API_BASE_URL}/progress`);
      // return response.data;

      // Fallback direto para localStorage
      return storageService.carregarProgressos();
    } catch (error) {
      console.error('Erro ao carregar progressos:', error);
      return storageService.carregarProgressos();
    }
  }

  /**
   * Salva ou atualiza progresso de um usuário
   * @param novoProgresso - Dados do progresso
   */
  async salvarProgresso(novoProgresso: ProgressoUsuario): Promise<void> {
    try {
      await axios.post(`${API_BASE_URL}/progress`, novoProgresso);
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
      // Fallback para localStorage
      const progressos = storageService.carregarProgressos();
      
      const index = progressos.findIndex(progresso => 
        progresso.usuarioId === novoProgresso.usuarioId && 
        progresso.conteudoId === novoProgresso.conteudoId
      );

      if (index !== -1) {
        progressos[index] = novoProgresso;
      } else {
        progressos.push(novoProgresso);
      }

      storageService.salvarProgressos(progressos);
    }
  }

  /**
   * Busca progresso específico de um usuário em um conteúdo
   * @param usuarioId - ID do usuário
   * @param conteudoId - ID do conteúdo
   * @returns Progresso encontrado ou undefined
   */
  async obterProgresso(usuarioId: string, conteudoId: string): Promise<ProgressoUsuario | undefined> {
    try {
      const response = await axios.get(`${API_BASE_URL}/progress/${usuarioId}/${conteudoId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter progresso:', error);
      return undefined;
    }
  }

  /**
   * Busca todos os progressos de um usuário
   * @param usuarioId - ID do usuário
   * @returns Array de progressos do usuário
   */
  async obterProgressosUsuario(usuarioId: string): Promise<ProgressoUsuario[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/progress/user/${usuarioId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter progressos do usuário:', error);
      return [];
    }
  }

  /**
   * Busca progressos de um conteúdo específico
   * @param conteudoId - ID do conteúdo
   * @returns Array de progressos do conteúdo
   */
  obterProgressosConteudo(conteudoId: string): ProgressoUsuario[] {
    const progressos = this.carregarProgressos();
    return progressos.filter(progresso => progresso.conteudoId === conteudoId);
  }

  /**
   * Marca um conteúdo como iniciado
   * @param usuarioId - ID do usuário
   * @param conteudoId - ID do conteúdo
   * @returns Progresso criado
   */
  iniciarProgresso(usuarioId: string, conteudoId: string): ProgressoUsuario {
    const novoProgresso: ProgressoUsuario = {
      usuarioId,
      conteudoId,
      progresso: 0,
      concluido: false,
      pontos: 0,
      tempoGasto: 0,
      dataInicio: new Date()
    };

    this.salvarProgresso(novoProgresso);
    return novoProgresso;
  }

  /**
   * Marca um conteúdo como concluído
   * @param usuarioId - ID do usuário
   * @param conteudoId - ID do conteúdo
   * @param pontos - Pontos ganhos na conclusão
   * @param tempoGasto - Tempo gasto em segundos
   * @returns Progresso atualizado
   */
  concluirProgresso(
    usuarioId: string, 
    conteudoId: string, 
    pontos: number, 
    tempoGasto: number
  ): ProgressoUsuario {
    const progressoExistente = this.obterProgresso(usuarioId, conteudoId);
    
    const progressoAtualizado: ProgressoUsuario = {
      usuarioId,
      conteudoId,
      progresso: 100,
      concluido: true,
      pontos,
      tempoGasto,
      dataInicio: progressoExistente?.dataInicio || new Date(),
      dataConclusao: new Date()
    };

    this.salvarProgresso(progressoAtualizado);
    return progressoAtualizado;
  }

  /**
   * Atualiza progresso parcial de um conteúdo
   * @param usuarioId - ID do usuário
   * @param conteudoId - ID do conteúdo
   * @param progresso - Percentual de progresso (0-100)
   * @param tempoGasto - Tempo gasto em segundos
   */
  atualizarProgresso(
    usuarioId: string, 
    conteudoId: string, 
    progresso: number, 
    tempoGasto: number
  ): void {
    const progressoExistente = this.obterProgresso(usuarioId, conteudoId);
    
    if (progressoExistente) {
      const progressoAtualizado: ProgressoUsuario = {
        ...progressoExistente,
        progresso: Math.max(progressoExistente.progresso, progresso),
        tempoGasto: Math.max(progressoExistente.tempoGasto, tempoGasto)
      };

      this.salvarProgresso(progressoAtualizado);
    }
  }

  /**
   * Calcula estatísticas de progresso de um usuário
   * @param usuarioId - ID do usuário
   * @returns Objeto com estatísticas
   */
  calcularEstatisticasUsuario(usuarioId: string) {
    const progressos = this.obterProgressosUsuario(usuarioId);
    
    const concluidos = progressos.filter(p => p.concluido).length;
    const emAndamento = progressos.filter(p => !p.concluido && p.progresso > 0).length;
    const totalPontos = progressos.reduce((total, p) => total + p.pontos, 0);
    const tempoTotal = progressos.reduce((total, p) => total + p.tempoGasto, 0);

    return {
      totalConteudos: progressos.length,
      concluidos,
      emAndamento,
      totalPontos,
      tempoTotal,
      mediaProgresso: progressos.length > 0 
        ? progressos.reduce((total, p) => total + p.progresso, 0) / progressos.length 
        : 0
    };
  }
}

// Exporta uma instância única do serviço (Singleton)
export const progressService = new ProgressService();