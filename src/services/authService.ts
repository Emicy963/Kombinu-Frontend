/**
 * Serviço de autenticação
 * Gerencia login, registro e operações relacionadas ao usuário
 */

import type { DadosLogin, DadosRegistro, Usuario } from '../types';
import { ValidationError } from '../utils/customErrors';
import { calcularNivel, gerarId, validarEmail } from '../utils/helpers';
import { logger } from '../utils/logger';
import { storageService } from './storageService';

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
      
      // Busca todos os usuários cadastrados
      const usuarios = storageService.carregarUsuarios();
      
      // Procura usuário com email e senha correspondentes
      const usuarioEncontrado = usuarios.find(
        (usuario: any) => 
          usuario.email === dadosLogin.email && 
          usuario.senha === dadosLogin.senha
      );
      
      if (usuarioEncontrado) {
        logger.info(
          `Usuário encontrado para login: ${usuarioEncontrado.nome}`,
          'AuthService.login',
          { userId: usuarioEncontrado.id, userType: usuarioEncontrado.tipo }
        );
        
        // Remove a senha do objeto antes de retornar
        const { senha, ...usuarioSemSenha } = usuarioEncontrado;
        
        // Salva usuário logado no localStorage
        storageService.salvarUsuario(usuarioSemSenha);
        
        return usuarioSemSenha;
      }
      
      logger.warning('Credenciais inválidas fornecidas', 'AuthService.login', { email: dadosLogin.email });
      return null;
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
    
    // Valida email
    if (!validarEmail(dadosRegistro.email)) {
      logger.warning('Email inválido fornecido para registro', 'AuthService.registrar', { email: dadosRegistro.email });
      throw new ValidationError('Email inválido');
    }

    // Carrega usuários existentes
    const usuarios = storageService.carregarUsuarios();
    
    // Verifica se email já existe
    const emailExiste = usuarios.some(
      (usuario: any) => usuario.email === dadosRegistro.email
    );
    
    if (emailExiste) {
      logger.warning('Tentativa de registro com email já existente', 'AuthService.registrar', { email: dadosRegistro.email });
      throw new ValidationError('Email já cadastrado');
    }
    
    // Cria novo usuário
    const novoUsuario = {
      id: gerarId(),
      nome: dadosRegistro.nome,
      email: dadosRegistro.email,
      senha: dadosRegistro.senha,
      tipo: dadosRegistro.tipo,
      pontos: 0,
      nivel: 1,
      dataCriacao: new Date().toISOString()
    };
    
    logger.info(
      `Novo usuário criado: ${novoUsuario.nome}`,
      'AuthService.registrar',
      { userId: novoUsuario.id, userType: novoUsuario.tipo }
    );
    
    // Adiciona à lista de usuários
    usuarios.push(novoUsuario);
    storageService.salvarUsuarios(usuarios);
    
    // Remove senha e salva usuário logado
    const { senha, ...usuarioSemSenha } = novoUsuario;
    storageService.salvarUsuario(usuarioSemSenha);
    
    return usuarioSemSenha;
  }

  /**
   * Realiza logout do usuário
   */
  logout(): void {
    logger.debug('Executando logout', 'AuthService.logout');
    storageService.removerUsuario();
    logger.info('Logout executado com sucesso', 'AuthService.logout');
  }

  /**
   * Atualiza pontos do usuário e recalcula nível
   * @param usuario - Usuário atual
   * @param novosPontos - Pontos a serem adicionados
   * @returns Usuário atualizado
   */
  atualizarPontos(usuario: Usuario, novosPontos: number): Usuario {
    logger.debug(
      `Atualizando pontos do usuário: ${usuario.nome}`,
      'AuthService.atualizarPontos',
      { userId: usuario.id, pontosAtuais: usuario.pontos, novosPontos }
    );
    
    const pontosAtualizados = usuario.pontos + novosPontos;
    const nivelAtualizado = calcularNivel(pontosAtualizados);
    
    const usuarioAtualizado = {
      ...usuario,
      pontos: pontosAtualizados,
      nivel: nivelAtualizado
    };
    
    // Log de mudança de nível
    if (nivelAtualizado > usuario.nivel) {
      logger.info(
        `🎉 Usuário subiu de nível! ${usuario.nivel} → ${nivelAtualizado}`,
        'AuthService.atualizarPontos',
        { 
          userId: usuario.id, 
          userName: usuario.nome,
          nivelAnterior: usuario.nivel,
          nivelNovo: nivelAtualizado,
          pontosNovos: pontosAtualizados
        }
      );
    }
    
    // Salva usuário atualizado
    storageService.salvarUsuario(usuarioAtualizado);
    
    // Atualiza na lista de usuários também
    const usuarios = storageService.carregarUsuarios();
    const index = usuarios.findIndex((u: any) => u.id === usuario.id);
    
    if (index !== -1) {
      usuarios[index] = { 
        ...usuarios[index], 
        pontos: pontosAtualizados, 
        nivel: nivelAtualizado 
      };
      storageService.salvarUsuarios(usuarios);
    }
    
    logger.debug(
      `Pontos atualizados com sucesso: ${usuario.pontos} → ${pontosAtualizados}`,
      'AuthService.atualizarPontos',
      { userId: usuario.id, nivelAtualizado }
    );
    
    return usuarioAtualizado;
  }

  /**
   * Atualiza dados gerais do usuário
   * @param usuarioAtualizado - Dados atualizados do usuário
   */
  atualizarUsuario(usuarioAtualizado: Usuario): void {
    logger.debug(
      `Atualizando dados do usuário: ${usuarioAtualizado.nome}`,
      'AuthService.atualizarUsuario',
      { userId: usuarioAtualizado.id }
    );
    
    // Salva usuário atualizado
    storageService.salvarUsuario(usuarioAtualizado);
    
    // Atualiza na lista de usuários também
    const usuarios = storageService.carregarUsuarios();
    const index = usuarios.findIndex((u: any) => u.id === usuarioAtualizado.id);
    
    if (index !== -1) {
      usuarios[index] = { ...usuarios[index], ...usuarioAtualizado };
      storageService.salvarUsuarios(usuarios);
      
      logger.info(
        'Dados do usuário atualizados com sucesso',
        'AuthService.atualizarUsuario',
        { userId: usuarioAtualizado.id }
      );
    } else {
      logger.warning(
        'Usuário não encontrado na lista para atualização',
        'AuthService.atualizarUsuario',
        { userId: usuarioAtualizado.id }
      );
    }
  }

  /**
   * Carrega usuário logado do localStorage
   * @returns Usuário logado ou null
   */
  carregarUsuarioLogado(): Usuario | null {
    try {
      const usuario = storageService.carregarUsuario();
      if (usuario) {
        logger.debug(
          `Usuário carregado do localStorage: ${usuario.nome}`,
          'AuthService.carregarUsuarioLogado',
          { userId: usuario.id }
        );
      }
      return usuario;
    } catch (error) {
      logger.error('Erro ao carregar usuário do localStorage', 'AuthService.carregarUsuarioLogado', {}, error as Error);
      return null;
    }
  }
}

// Exporta uma instância única do serviço (Singleton)
export const authService = new AuthService();