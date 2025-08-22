/**
 * Serviço para gerenciar progresso dos usuários
 * Centraliza operações relacionadas ao progresso de aprendizado
 */

import { storageService } from './storageService';
import type { ProgressoUsuario } from '../types';

/**
 * Classe para gerenciar progresso dos usuários
 */
class ProgressService {
  /**
   * Carrega todos os progressos
   * @returns Array de progressos
   */
  carregarProgressos(): ProgressoUsuario[] {
    return storageService.carregarProgressos();
  }

  /**
   * Salva ou atualiza progresso de um usuário
   * @param novoProgresso - Dados do progresso
   */
  salvarProgresso(novoProgresso: ProgressoUsuario): void {
    const progressos = this.carregarProgressos();
    
    // Procura se já existe progresso para este usuário e conteúdo
    const index = progressos.findIndex(progresso => 
      progresso.usuarioId === novoProgresso.usuarioId && 
      progresso.conteudoId === novoProgresso.conteudoId
    );

    if (index !== -1) {
      // Atualiza progresso existente
      progressos[index] = novoProgresso;
    } else {
      // Adiciona novo progresso
      progressos.push(novoProgresso);
    }

    storageService.salvarProgressos(progressos);
  }

  /**
   * Busca progresso específico de um usuário em um conteúdo
   * @param usuarioId - ID do usuário
   * @param conteudoId - ID do conteúdo
   * @returns Progresso encontrado ou undefined
   */
  obterProgresso(usuarioId: string, conteudoId: string): ProgressoUsuario | undefined {
    const progressos = this.carregarProgressos();
    return progressos.find(progresso => 
      progresso.usuarioId === usuarioId && 
      progresso.conteudoId === conteudoId
    );
  }

  /**
   * Busca todos os progressos de um usuário
   * @param usuarioId - ID do usuário
   * @returns Array de progressos do usuário
   */
  obterProgressosUsuario(usuarioId: string): ProgressoUsuario[] {
    const progressos = this.carregarProgressos();
    return progressos.filter(progresso => progresso.usuarioId === usuarioId);
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