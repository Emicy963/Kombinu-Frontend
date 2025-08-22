/**
 * Contexto de Autenticação
 * 
 * Gerencia o estado global de autenticação da aplicação,
 * fornecendo funcionalidades de login, logout e verificação de usuário logado.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario } from '../types';
import { authService } from '../services/authService';
import { logger } from '../utils/logger';
import { useErrorHandler } from '../hooks/useErrorHandler';

// Interface que define o formato do contexto de autenticação
interface AuthContextType {
  usuario: Usuario | null;           // Usuário atualmente logado (null se não logado)
  loading: boolean;                  // Indica se está carregando dados de autenticação
  error: Error | null;              // Último erro ocorrido
  login: (email: string, senha: string) => Promise<boolean>;  // Função para fazer login
  register: (dadosUsuario: Omit<Usuario, 'id' | 'pontos' | 'nivel' | 'dataCriacao'>) => Promise<boolean>; // Função para registrar
  logout: () => void;                // Função para fazer logout
  atualizarUsuario: (dadosAtualizados: Partial<Usuario>) => void; // Função para atualizar dados do usuário
  atualizarPontos: (novosPontos: number) => void; // Função para atualizar pontos do usuário
  clearError: () => void;           // Função para limpar erro
}

// Criação do contexto com valor padrão undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props do provider de autenticação
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider do contexto de autenticação
 * 
 * Envolve a aplicação e fornece o estado de autenticação para todos os componentes filhos.
 * Gerencia automaticamente a persistência da sessão usando localStorage.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Estado do usuário logado
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  
  // Estado de carregamento
  const [loading, setLoading] = useState(true);

  // Hook para tratamento de erros
  const { executeWithErrorHandling, error, clearError } = useErrorHandler('AuthContext');

  /**
   * Efeito para verificar se existe usuário logado ao inicializar a aplicação
   */
  useEffect(() => {
    const verificarUsuarioLogado = async () => {
      try {
        logger.debug('Verificando usuário logado no localStorage', 'AuthContext');
        
        // Tenta recuperar usuário do localStorage
        const usuarioSalvo = authService.carregarUsuarioLogado();
        if (usuarioSalvo) {
          logger.info(
            `Usuário recuperado do localStorage: ${usuarioSalvo.nome}`,
            'AuthContext',
            { userId: usuarioSalvo.id, userType: usuarioSalvo.tipo }
          );
          setUsuario(usuarioSalvo);
        } else {
          logger.debug('Nenhum usuário encontrado no localStorage', 'AuthContext');
        }
      } catch (error) {
        logger.error(
          'Erro ao verificar usuário logado',
          'AuthContext.verificarUsuarioLogado',
          {},
          error as Error
        );
      } finally {
        setLoading(false);
      }
    };

    verificarUsuarioLogado();
  }, []);

  /**
   * Função para realizar login
   * 
   * @param email - Email do usuário
   * @param senha - Senha do usuário
   * @returns Promise<boolean> - true se login foi bem-sucedido, false caso contrário
   */
  const login = async (email: string, senha: string): Promise<boolean> => {
    return executeWithErrorHandling(async () => {
      setLoading(true);
      
      logger.info('Tentativa de login iniciada', 'AuthContext.login', { email });
      
      try {
        // Chama o serviço de autenticação
        const usuarioLogado = await authService.login({ email, senha });
        
        if (usuarioLogado) {
          setUsuario(usuarioLogado);
          logger.info(
            `Login bem-sucedido para usuário: ${usuarioLogado.nome}`,
            'AuthContext.login',
            { userId: usuarioLogado.id, userType: usuarioLogado.tipo }
          );
          return true;
        } else {
          logger.warning(
            'Falha no login: credenciais inválidas',
            'AuthContext.login',
            { email }
          );
          return false;
        }
      } finally {
        setLoading(false);
      }
    }, 'login') ?? false;
  };

  /**
   * Função para realizar registro de novo usuário
   * 
   * @param dadosUsuario - Dados do usuário para registro
   * @returns Promise<boolean> - true se registro foi bem-sucedido, false caso contrário
   */
  const register = async (dadosUsuario: Omit<Usuario, 'id' | 'pontos' | 'nivel' | 'dataCriacao'>): Promise<boolean> => {
    return executeWithErrorHandling(async () => {
      logger.info(
        'Tentativa de registro iniciada',
        'AuthContext.register',
        { email: dadosUsuario.email, tipo: dadosUsuario.tipo }
      );
      
      // Chama o serviço de registro
      const novoUsuario = await authService.registrar(dadosUsuario);
      
      setUsuario(novoUsuario);
      logger.info(
        `Registro bem-sucedido para usuário: ${novoUsuario.nome}`,
        'AuthContext.register',
        { userId: novoUsuario.id, userType: novoUsuario.tipo }
      );
      return true;
    }, 'register') ?? false;
  };

  /**
   * Função para realizar logout
   * 
   * Remove o usuário do estado e limpa os dados do localStorage
   */
  const logout = (): void => {
    executeWithErrorHandling(() => {
      const usuarioAtual = usuario;
      
      logger.info(
        'Logout iniciado',
        'AuthContext.logout',
        { userId: usuarioAtual?.id, userName: usuarioAtual?.nome }
      );
      
      // Chama o serviço de logout
      authService.logout();
      
      // Limpa o estado local
      setUsuario(null);
      
      logger.info('Logout concluído com sucesso', 'AuthContext.logout');
    }, 'logout');
  };

  /**
   * Função para atualizar dados do usuário logado
   * 
   * @param dadosAtualizados - Dados parciais para atualização
   */
  const atualizarUsuario = (dadosAtualizados: Partial<Usuario>): void => {
    if (!usuario) {
      logger.warning('Tentativa de atualizar usuário sem usuário logado', 'AuthContext.atualizarUsuario');
      return;
    }

    executeWithErrorHandling(() => {
      logger.debug(
        'Atualizando dados do usuário',
        'AuthContext.atualizarUsuario',
        { userId: usuario.id, updates: Object.keys(dadosAtualizados) }
      );
      
      // Cria usuário atualizado
      const usuarioAtualizado = { ...usuario, ...dadosAtualizados };
      
      // Atualiza no serviço
      authService.atualizarUsuario(usuarioAtualizado);
      
      // Atualiza o estado local
      setUsuario(usuarioAtualizado);
      
      logger.info(
        'Dados do usuário atualizados com sucesso',
        'AuthContext.atualizarUsuario',
        { userId: usuario.id }
      );
    }, 'atualizarUsuario');
  };

  /**
   * Função para atualizar pontos do usuário
   */
  const atualizarPontos = (novosPontos: number): void => {
    if (!usuario) {
      logger.warning('Tentativa de atualizar pontos sem usuário logado', 'AuthContext.atualizarPontos');
      return;
    }

    executeWithErrorHandling(() => {
      logger.info(
        `Atualizando pontos do usuário: +${novosPontos}`,
        'AuthContext.atualizarPontos',
        { userId: usuario.id, pontosAtuais: usuario.pontos, novosPontos }
      );
      
      const usuarioAtualizado = authService.atualizarPontos(usuario, novosPontos);
      setUsuario(usuarioAtualizado);
      
      logger.info(
        `Pontos atualizados: ${usuario.pontos} → ${usuarioAtualizado.pontos}`,
        'AuthContext.atualizarPontos',
        { 
          userId: usuario.id, 
          pontosAnteriores: usuario.pontos,
          pontosNovos: usuarioAtualizado.pontos,
          nivelAnterior: usuario.nivel,
          nivelNovo: usuarioAtualizado.nivel
        }
      );
    }, 'atualizarPontos');
  };

  // Valor do contexto que será fornecido aos componentes filhos
  const contextValue: AuthContextType = {
    usuario,
    loading,
    error,
    login,
    register,
    logout,
    atualizarUsuario,
    atualizarPontos,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para usar o contexto de autenticação
 * 
 * @returns AuthContextType - Objeto com estado e funções de autenticação
 * @throws Error - Se usado fora do AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
};

// Export padrão do contexto para casos especiais