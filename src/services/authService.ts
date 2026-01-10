/**
 * Serviço de autenticação
 * Gerencia login, registro e operações relacionadas ao usuário via API
 */

import axios from 'axios';
import type { DadosLogin, DadosRegistro, Usuario } from '../types';
import { logger } from '../utils/logger';
import { storageService } from './storageService';

// URLs da API based on Backend Routes
const API_URL = '/api/auth';

/**
 * Classe para gerenciar autenticação de usuários
 */
class AuthService {
  /**
   * Realiza login do usuário
   * @param dadosLogin - Email e senha do usuário
   * @returns Promise com o usuário logado ou null se falhou
   */
  async login(dadosLogin: DadosLogin): Promise<Usuario | null> {
    try {
      logger.debug('Iniciando processo de login', 'AuthService.login', { email: dadosLogin.email });

      // 1. Obter Token (Login)
      // O backend espera 'username' e 'password', mas o USERNAME_FIELD é email.
      // Enviamos o email no campo 'username' para garantir compatibilidade com DRF Token View.
      const loginResponse = await axios.post(`${API_URL}/login/`, {
        username: dadosLogin.email, // Importante: DRF espera key 'username' por padrão
        password: dadosLogin.senha
      });

      const { access, refresh } = loginResponse.data;

      // Salvar tokens (idealmente em HttpOnly cookies ou storage seguro, aqui simplificamos)
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      // Configurar header padrão para próximas requisições
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // 2. Obter Perfil do Usuário
      const profileResponse = await axios.get(`${API_URL}/profile/`);
      const usuarioBackend = profileResponse.data;

      // Mapear resposta do backend para interface Usuario do frontend
      // Backend retorna: { id, email, user_type }
      // Precisamos adaptar para interface Usuario
      const usuario: Usuario = {
        id: String(usuarioBackend.id),
        nome: usuarioBackend.first_name || usuarioBackend.email.split('@')[0], // Fallback para nome
        email: usuarioBackend.email,
        tipo: usuarioBackend.user_type === 'creator' ? 'criador' : 'aprendiz',
        pontos: 0, // Backend v2.0 basic auth might not return points yet in profile
        nivel: 1, // Fallback
        dataCriacao: new Date(), // Fallback
      };

      logger.info(
        `Login realizado com sucesso: ${usuario.nome}`,
        'AuthService.login',
        { userId: usuario.id, userType: usuario.tipo }
      );

      // Salva usuário logado no localStorage (para persistência da sessão no frontend)
      storageService.salvarUsuario(usuario);

      return usuario;
    } catch (error) {
      logger.error('Erro no processo de login', 'AuthService.login', { email: dadosLogin.email }, error as Error);
      return null;
    }
  }

  /**
   * Registra um novo usuário
   * @param dadosRegistro - Dados do novo usuário
   * @returns Promise com o usuário criado
   */
  async registrar(dadosRegistro: DadosRegistro): Promise<Usuario> {
    logger.debug('Iniciando processo de registro', 'AuthService.registrar', {
      email: dadosRegistro.email,
      tipo: dadosRegistro.tipo
    });

    try {
      // Mapeamento de tipo do frontend para backend
      const userTypeMap = {
        'criador': 'creator',
        'aprendiz': 'learner'
      };

      const payload = {
        email: dadosRegistro.email,
        password: dadosRegistro.senha,
        user_type: userTypeMap[dadosRegistro.tipo],
        first_name: dadosRegistro.nome,
        // username é setado automaticamente como email no serializer do backend
      };

      await axios.post(`${API_URL}/register/`, payload);

      // Após registro, faz login automático para pegar o token
      const usuarioLogado = await this.login({
        email: dadosRegistro.email,
        senha: dadosRegistro.senha
      });

      if (!usuarioLogado) {
        throw new Error('Falha ao realizar login automático após registro');
      }

      return usuarioLogado;
    } catch (error) {
       logger.error('Erro no processo de registro', 'AuthService.registrar', { email: dadosRegistro.email }, error as Error);
       throw error;
    }
  }

  /**
   * Realiza logout do usuário
   */
  logout(): void {
    logger.debug('Executando logout', 'AuthService.logout');
    storageService.removerUsuario();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
    logger.info('Logout executado com sucesso', 'AuthService.logout');
  }

  // Métodos de atualização de pontos mantidos locais por enquanto,
  // ou podem ser conectados a endpoints futuros de gamificação.
  // Por compatibilidade com o código existente, mantemos a lógica local/mock
  // mas idealmente isso deveria chamar API.

  atualizarPontos(usuario: Usuario, novosPontos: number): Usuario {
    // ... Implementação simplificada mantendo compatibilidade ...
    const usuarioAtualizado = { ...usuario, pontos: usuario.pontos + novosPontos };
    storageService.salvarUsuario(usuarioAtualizado);
    return usuarioAtualizado;
  }

  atualizarUsuario(usuarioAtualizado: Usuario): void {
     storageService.salvarUsuario(usuarioAtualizado);
  }

  carregarUsuarioLogado(): Usuario | null {
    const usuario = storageService.carregarUsuario();
    const token = localStorage.getItem('accessToken');
    
    if (usuario && token) {
       // Restaurar header
       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
       return usuario;
    }
    return null;
  }
}

// Exporta uma instância única do serviço (Singleton)
export const authService = new AuthService();