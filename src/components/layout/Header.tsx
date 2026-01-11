/**
 * Componente Header da aplicação
 * Barra de navegação principal com logo, menu e informações do usuário
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../ui/Logo';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  LogOut, 
  User, 
  Home, 
  BookOpen, 
  Trophy, 
  Menu, 
  X,
  Plus,
  BarChart3,
  Moon,
  Sun
} from 'lucide-react';

/**
 * Header responsivo com navegação e informações do usuário
 */
export const Header: React.FC = () => {
  const { usuario, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Realiza logout e redireciona para home
   */
  const handleLogout = (): void => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  /**
   * Fecha menu mobile ao navegar
   */
  const handleNavigation = (): void => {
    setMobileMenuOpen(false);
  };

  // Se não há usuário logado, não exibe o header
  if (!usuario) return null;

  // Links de navegação baseados no tipo de usuário
  const navigationLinks = [
    {
      to: usuario.tipo === 'criador' ? '/dashboard/creator' : '/dashboard/learner',
      icon: Home,
      label: 'Dashboard',
      show: true
    },
    {
      to: '/courses',
      icon: BookOpen,
      label: 'Marketplace',
      show: true
    },
    {
      to: '/courses/create',
      icon: Plus,
      label: 'Criar',
      show: usuario.tipo === 'criador'
    },
    {
      to: '/ranking',
      icon: Trophy,
      label: 'Ranking',
      show: true
    },
    {
      to: '/admin',
      icon: BarChart3,
      label: 'Admin',
      show: usuario.tipo === 'admin'
    }
  ].filter(link => link.show);

  /**
   * Verifica se o link está ativo
   */
  const isActiveLink = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <header className="dark-bg-primary shadow-lg dark-border-primary border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="md" clickable />
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActiveLink(link.to);
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 font-lato ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm dark:bg-dark-bg-hover dark:text-dark-interactive-primary'
                      : 'dark-text-secondary hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-dark-bg-hover dark:hover:text-dark-interactive-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Informações do usuário e ações */}
          <div className="flex items-center space-x-4">
            {/* Informações do usuário - Desktop */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-semibold dark-text-primary truncate max-w-32 font-montserrat">
                  {usuario.nome}
                </p>
                <div className="flex items-center space-x-2 text-xs dark-text-muted font-lato">
                  <span className="flex items-center space-x-1">
                    <Trophy className="w-3 h-3" />
                    <span>{usuario.pontos.toLocaleString()}</span>
                  </span>
                  <span>•</span>
                  <span>Nível {usuario.nivel}</span>
                </div>
              </div>
              
              {/* Avatar do usuário */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 dark-text-muted hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200 dark:hover:bg-dark-bg-hover dark:hover:text-dark-interactive-primary"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button> 

            {/* Botão de logout - Desktop */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex p-2 dark-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 dark:hover:bg-dark-bg-hover dark:hover:text-dark-interactive-error"
              title="Sair da conta"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* Botão do menu mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 dark-text-secondary hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-dark-bg-hover dark:hover:text-dark-text-primary"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t dark-border-primary py-4 space-y-2">
            {/* Informações do usuário - Mobile */}
            <div className="flex items-center space-x-3 px-4 py-3 dark-bg-secondary rounded-lg mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <Link to="/courses" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Marcas</Link>
                <Link to="/courses" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Categorias</Link>
                {/* <Link to="/ranking" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Ranking</Link> */}
                <p className="font-semibold dark-text-primary font-montserrat">{usuario.nome}</p>
                <div className="flex items-center space-x-2 text-sm dark-text-muted font-lato">
                  <span className="flex items-center space-x-1">
                    <Trophy className="w-3 h-3" />
                    <span>{usuario.pontos.toLocaleString()}</span>
                  </span>
                  <span>•</span>
                  <span>Nível {usuario.nivel}</span>
                </div>
              </div>
            </div>

            {/* Links de navegação - Mobile */}
            {navigationLinks.map((link) => {
              const Icon = link.icon;
              const isActive = isActiveLink(link.to);
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={handleNavigation}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 font-lato ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm dark:bg-dark-bg-hover dark:text-dark-interactive-primary'
                      : 'dark-text-secondary hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-dark-bg-hover dark:hover:text-dark-interactive-primary'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Botão de logout - Mobile */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 w-full text-left dark:hover:bg-dark-bg-hover dark:text-dark-interactive-error font-lato"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sair da conta</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};