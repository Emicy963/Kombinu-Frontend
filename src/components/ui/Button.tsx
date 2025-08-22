/**
 * Componente Button reutilizável
 * Botão customizável com diferentes variantes, tamanhos e estados
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

// Tipos de variantes disponíveis para o botão
type ButtonVariant = 
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger';

// Tipos de tamanhos disponíveis para o botão
type ButtonSize = 'sm' | 'md' | 'lg';

// Interface das propriedades do componente Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual do botão */
  variant?: ButtonVariant;
  /** Tamanho do botão */
  size?: ButtonSize;
  /** Se o botão está desabilitado */
  disabled?: boolean;
  /** Se o botão está em estado de carregamento */
  isLoading?: boolean;
  /** Classe CSS adicional */
  className?: string;
  /** Função executada ao clicar no botão */
  onClick?: () => void;
  /** Conteúdo do botão */
  children: React.ReactNode;
}

/**
 * Componente Button
 * Botão reutilizável com suporte a diferentes estilos e estados
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  isLoading = false,
  className = '',
  onClick,
  children,
  ...props
}) => {
  // Estilos para cada variante do botão
  const variantStyles = {
    // Botão primário (destaque principal)
    primary: {
      base: 'bg-kombinu-neon-blue text-gray-900 hover:bg-kombinu-dark-blue hover:text-white focus:ring-kombinu-neon-blue shadow-sm hover:shadow-md dark:bg-dark-interactive-primary dark:text-white dark:hover:bg-blue-600',
      disabled: 'bg-kombinu-neon-blue/30 text-gray-500 cursor-not-allowed shadow-none dark:bg-dark-interactive-secondary dark:text-dark-text-disabled'
    },
    // Botão secundário (menos destaque)
    secondary: {
      base: 'bg-kombinu-golden-yellow text-gray-900 hover:bg-kombinu-dark-gold hover:text-white focus:ring-kombinu-golden-yellow shadow-sm hover:shadow-md dark:bg-dark-accent-yellow dark:text-dark-bg-primary dark:hover:bg-yellow-600',
      disabled: 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none dark:bg-dark-bg-hover dark:text-dark-text-disabled'
    },
    // Botão fantasma (apenas borda)
    ghost: {
      base: 'border-2 border-kombinu-neon-blue/30 text-kombinu-dark-blue bg-transparent hover:bg-kombinu-neon-blue/5 hover:border-kombinu-neon-blue hover:shadow-sm dark:border-dark-border-accent dark:text-dark-interactive-primary dark:hover:bg-dark-bg-hover',
      disabled: 'border-gray-200 text-gray-400 bg-transparent cursor-not-allowed dark:border-dark-border-primary dark:text-dark-text-disabled'
    },
    // Botão de perigo
    danger: {
      base: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md dark:bg-dark-interactive-error dark:hover:bg-red-700',
      disabled: 'bg-red-300 text-red-100 cursor-not-allowed shadow-none dark:bg-red-900/30 dark:text-dark-text-disabled'
    }
  };

  // Estilos para cada tamanho do botão
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm font-medium font-poppins',
    md: 'px-4 py-2 text-base font-medium font-poppins',
    lg: 'px-6 py-3 text-lg font-medium font-poppins'
  };

  // Seleciona os estilos baseados nas props
  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];
  
  // Determina se o botão deve estar desabilitado (disabled ou isLoading)
  const isDisabled = disabled || isLoading;
  
  return (
    <button
      className={`
        inline-flex items-center justify-center
        rounded-md border-0 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${currentSize}
        ${isDisabled ? currentVariant.disabled : currentVariant.base}
        ${className}
      `}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
      {children}
    </button>
  );
};