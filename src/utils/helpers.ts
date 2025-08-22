/**
 * Funções utilitárias para uso em toda a aplicação
 * Centraliza lógicas comuns para evitar duplicação de código
 */

import { CORES_DIFICULDADE, TEXTOS_DIFICULDADE, NIVEIS } from './constants';
import type { Usuario } from '../types';

/**
 * Obtém a cor CSS para uma dificuldade específica
 * @param dificuldade - Nível de dificuldade
 * @returns String com classes CSS do Tailwind
 */
const obterCorDificuldade = (dificuldade: string): string => {
  return CORES_DIFICULDADE[dificuldade as keyof typeof CORES_DIFICULDADE] || 'bg-gray-100 text-gray-800';
};

/**
 * Obtém o texto formatado para uma dificuldade
 * @param dificuldade - Nível de dificuldade
 * @returns Texto formatado da dificuldade
 */
const obterTextoDificuldade = (dificuldade: string): string => {
  return TEXTOS_DIFICULDADE[dificuldade as keyof typeof TEXTOS_DIFICULDADE] || dificuldade;
};

/**
 * Calcula o nível baseado nos pontos do usuário
 * @param pontos - Pontos totais do usuário
 * @returns Nível calculado
 */
export const calcularNivel = (pontos: number): number => {
  return Math.floor(pontos / NIVEIS.PONTOS_POR_NIVEL) + NIVEIS.NIVEL_INICIAL;
};

/**
 * Calcula quantos pontos faltam para o próximo nível
 * @param pontos - Pontos atuais do usuário
 * @returns Pontos necessários para o próximo nível
 */
const pontosParaProximoNivel = (pontos: number): number => {
  return NIVEIS.PONTOS_POR_NIVEL - (pontos % NIVEIS.PONTOS_POR_NIVEL);
};

/**
 * Calcula o progresso percentual para o próximo nível
 * @param pontos - Pontos atuais do usuário
 * @returns Percentual de progresso (0-100)
 */
const progressoParaProximoNivel = (pontos: number): number => {
  return ((pontos % NIVEIS.PONTOS_POR_NIVEL) / NIVEIS.PONTOS_POR_NIVEL) * 100;
};

/**
 * Formata uma data para exibição
 * @param data - Data a ser formatada
 * @returns String da data formatada
 */
const formatarData = (data: Date | string): string => {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return dataObj.toLocaleDateString('pt-BR');
};

/**
 * Formata um número para exibição com separadores de milhares
 * @param numero - Número a ser formatado
 * @returns String do número formatado
 */
const formatarNumero = (numero: number): string => {
  return numero.toLocaleString('pt-BR');
};

/**
 * Gera um ID único baseado no timestamp
 * @returns String com ID único
 */
export const gerarId = (): string => {
  return Date.now().toString();
};

/**
 * Valida se um email tem formato válido
 * @param email - Email a ser validado
 * @returns Boolean indicando se é válido
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Trunca um texto para um tamanho máximo
 * @param texto - Texto a ser truncado
 * @param tamanhoMaximo - Tamanho máximo permitido
 * @returns Texto truncado com "..." se necessário
 */
const truncarTexto = (texto: string, tamanhoMaximo: number): string => {
  if (texto.length <= tamanhoMaximo) return texto;
  return texto.substring(0, tamanhoMaximo) + '...';
};

/**
 * Converte tempo em segundos para formato MM:SS
 * @param segundos - Tempo em segundos
 * @returns String formatada MM:SS
 */
const formatarTempo = (segundos: number): string => {
  const minutos = Math.floor(segundos / 60);
  const segundosRestantes = segundos % 60;
  return `${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
};