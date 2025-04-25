
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  text?: string;
  className?: string;
  position?: 'bottom' | 'top';
  fullWidth?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  text = 'Voltar', 
  className = '',
  position = 'bottom',
  fullWidth = true
}) => {
  const navigate = useNavigate();

  const positionStyles = {
    bottom: 'fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm z-50',
    top: ''
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <Button 
      variant="ghost" 
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 ${positionStyles[position]} ${widthStyles} ${className}`}
    >
      <ArrowLeft size={20} />
      {text}
    </Button>
  );
};
