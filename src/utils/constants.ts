/**
 * Constantes da aplicação
 * Centraliza valores fixos para facilitar manutenção
 */

// Configurações de pontuação
const PONTUACAO = {
  CONCLUSAO_CONTEUDO: 50,
  QUIZ_BASE: 10,
  BONUS_SEQUENCIA: 100,
  CONQUISTA_ESPECIAL: 200,
} as const;

// Configurações de níveis
export const NIVEIS = {
  PONTOS_POR_NIVEL: 1000,
  NIVEL_INICIAL: 1,
} as const;

// Configurações de tempo
const TEMPO = {
  QUIZ_PERGUNTA_SEGUNDOS: 30,
  TEMPO_MINIMO_CONTEUDO: 1,
  TEMPO_MAXIMO_CONTEUDO: 180,
} as const;

// Cores para dificuldades
export const CORES_DIFICULDADE = {
  facil: 'bg-green-100 text-green-800',
  medio: 'bg-yellow-100 text-yellow-800',
  dificil: 'bg-red-100 text-red-800',
} as const;

// Textos para dificuldades
export const TEXTOS_DIFICULDADE = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
} as const;

// Cores para tipos de conteúdo
const CORES_TIPO_CONTEUDO = {
  quiz: 'bg-blue-100 text-blue-800',
  video: 'bg-purple-100 text-purple-800',
  texto: 'bg-gray-100 text-gray-800',
} as const;

// Chaves do localStorage
export const STORAGE_KEYS = {
  USUARIO: 'kombinu_usuario',
  USUARIOS: 'kombinu_usuarios',
  CONTEUDOS: 'kombinu_conteudos',
  PROGRESSOS: 'kombinu_progressos',
} as const;