import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hoverGlow?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = false,
  hoverGlow = true,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-2xl 
        ${glow ? 'glass-panel-glow animate-glow' : 'glass-panel'} 
        ${hoverGlow ? 'glass-card-hover' : ''} 
        ${onClick ? 'cursor-pointer' : ''} 
        transition-all duration-300
        p-5
        ${className}
      `}
    >
      {children}
    </div>
  );
};
