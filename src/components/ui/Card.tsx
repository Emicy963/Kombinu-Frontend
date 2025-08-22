/**
 * Componente Card reutilizável
 * Container flexível para organizar conteúdo com diferentes variantes
 */

import React from 'react';

// Tipos de variantes disponíveis para o card
type CardVariant = 'default' | 'elevated' | 'outlined' | 'flat' | 'gradient';

interface CardProps {
  /** Conteúdo do card */
  children: React.ReactNode;
  /** Variante visual do card */
  variant?: CardVariant;
  /** Classe CSS adicional */
  className?: string;
  /** Se o card deve ter hover effect */
  hoverable?: boolean;
  /** Props adicionais do elemento div */
  [key: string]: any;
}

/**
 * Card - Componente container flexível
 */
export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverable = false,
  className = '',
  ...props
}) => {
  // Estilos para cada variante
  const variantStyles = {
    // Card padrão com sombra sutil
    default: 'dark-bg-primary dark-border-primary shadow-sm dark:shadow-gray-900/20',
    // Card com sombra elevada
    elevated: 'dark-bg-primary border border-gray-100 shadow-lg shadow-gray-200/50 dark:border-dark-border-primary dark:shadow-gray-900/30',
    // Card apenas com borda
    outlined: 'dark-bg-primary border-2 dark-border-secondary shadow-none',
    // Card sem sombra nem borda
    flat: 'dark-bg-primary border-0 shadow-none',
    // Card com gradiente
    gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-sm dark:from-dark-bg-secondary dark:to-dark-bg-tertiary dark:border-dark-border-accent'
  };

  // Efeito hover se habilitado
  const hoverEffect = hoverable 
    ? 'transition-all duration-200 hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-1 dark:hover:shadow-gray-900/40' 
    : '';

  return (
    <div
      className={`
        rounded-xl p-6 
        ${variantStyles[variant]}
        ${hoverEffect} ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};