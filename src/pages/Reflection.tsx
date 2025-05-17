
import React from 'react';
import { ReflectionForm } from '@/components/ReflectionForm';
import { BackButton } from '@/components/BackButton';
import DailyMotivation from '@/components/DailyMotivation';
import { Logo } from '@/components/Logo';
import { useIsMobile } from '@/hooks/use-mobile';

const Reflection = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <BackButton className="text-white" />
          <Logo size={isMobile ? "sm" : "md"} />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Diário de Reflexão</h1>
          <p className="text-white/80 mt-2">Escreva suas reflexões diárias e acompanhe seu progresso</p>
        </div>

        <div className="space-y-6">
          <DailyMotivation />
          <ReflectionForm />
        </div>
      </div>
    </div>
  );
};

export default Reflection;
