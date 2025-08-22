/**
 * Componente Logo do KOMBINU
 * Centraliza a exibição do logo em toda a aplicação
 * Facilita a manutenção e consistência da marca
 */

import React from 'react';
import { BookOpen } from 'lucide-react';

interface LogoProps {
  /** Tamanho do logo - afeta tanto ícone quanto texto */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Se deve mostrar apenas o ícone (sem texto) */
  iconOnly?: boolean;
  /** Classe CSS adicional para customização */
  className?: string;
  /** Se o logo deve ser clicável (link para home) */
  clickable?: boolean;
}

/**
 * Componente Logo reutilizável
 * Mantém consistência visual em toda aplicação
 */
export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  iconOnly = false, 
  className = '',
  clickable = false 
}) => {
  // Configurações de tamanho baseadas na prop size
  const sizeConfig = {
    sm: {
      icon: 'w-6 h-6',
      iconContainer: 'w-8 h-8',
      text: 'text-lg',
      spacing: 'space-x-2'
    },
    md: {
      icon: 'w-7 h-7',
      iconContainer: 'w-10 h-10',
      text: 'text-2xl',
      spacing: 'space-x-2'
    },
    lg: {
      icon: 'w-8 h-8',
      iconContainer: 'w-12 h-12',
      text: 'text-3xl',
      spacing: 'space-x-3'
    },
    xl: {
      icon: 'w-10 h-10',
      iconContainer: 'w-16 h-16',
      text: 'text-4xl',
      spacing: 'space-x-4'
    }
  };

  const config = sizeConfig[size];

  // Conteúdo do logo
  const logoContent = (
    <div className={`flex items-center ${config.spacing} ${className}`}>
      {/* Container do ícone com gradiente */}
      <div className={`${config.iconContainer} bg-gradient-to-br from-kombinu-neon-blue via-kombinu-dark-blue to-kombinu-golden-yellow rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105`}>
        <BookOpen className={`${config.icon} text-white`} />
      </div>
      
      {/* Texto do logo (se não for iconOnly) */}
      {!iconOnly && (
        <span className={`${config.text} font-montserrat font-bold bg-gradient-to-r from-kombinu-neon-blue via-kombinu-dark-blue to-kombinu-golden-yellow bg-clip-text text-transparent`}>
          KOMBINU
        </span>
      )}
    </div>
  );

  // Se for clicável, envolve em um link
  if (clickable) {
    return (
      <a 
        href="/" 
        className="transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
        aria-label="Ir para página inicial do KOMBINU"
      >
        {logoContent}
      </a>
    );
  }

  return logoContent;
};