/**
 * Definições de tipos TypeScript para toda a aplicação
 * Centraliza todas as interfaces e tipos para facilitar manutenção
 */

// Tipos relacionados ao usuário
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'criador' | 'aprendiz' | 'admin';
  pontos: number;
  nivel: number;
  avatar?: string;
  dataCriacao: Date;
}

// Tipos relacionados ao conteúdo
export interface Conteudo {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  criadorId: string;
  criadorNome: string;
  tipo: 'texto' | 'video' | 'quiz';
  conteudo: string;
  quiz?: Pergunta[];
  visualizacoes: number;
  likes: number;
  dataCriacao: Date;
  tempoEstimado: number;
  dificuldade: 'facil' | 'medio' | 'dificil';
  tags: string[];
  publico: boolean;
}

// Tipos relacionados ao quiz
interface Pergunta {
  id: string;
  pergunta: string;
  opcoes: string[];
  respostaCerta: number;
  pontos: number;
  explicacao?: string;
}

// Tipos relacionados ao progresso do usuário
export interface ProgressoUsuario {
  usuarioId: string;
  conteudoId: string;
  progresso: number;
  concluido: boolean;
  pontos: number;
  tempoGasto: number;
  dataInicio: Date;
  dataConclusao?: Date;
}

// Tipos para formulários
export interface FormularioConteudo {
  titulo: string;
  descricao: string;
  categoria: string;
  tipo: 'texto' | 'video' | 'quiz';
  conteudo: string;
  tempoEstimado: number;
  dificuldade: 'facil' | 'medio' | 'dificil';
  tags: string[];
  publico: boolean;
}

// Tipos para autenticação
export interface DadosLogin {
  email: string;
  senha: string;
}

export interface DadosRegistro {
  nome: string;
  email: string;
  senha: string;
  tipo: 'criador' | 'aprendiz';
}