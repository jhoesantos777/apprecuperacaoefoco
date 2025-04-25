
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface BackButtonProps {
  text?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ 
  text = 'Voltar', 
  className = '' 
}) => {
  const navigate = useNavigate();

  return (
    <Button 
      variant="ghost" 
      onClick={() => navigate(-1)}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft size={20} />
      {text}
    </Button>
  );
};
