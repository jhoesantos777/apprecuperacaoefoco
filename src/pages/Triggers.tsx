
import React from 'react';
import { BackButton } from '@/components/BackButton';
import TriggerForm from '@/components/TriggerForm';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { useIsMobile } from '@/hooks/use-mobile';

const Triggers = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d0036] to-black px-4 sm:px-6 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        <Logo className="mx-auto mb-4 sm:mb-6" size={isMobile ? "sm" : "md"} />
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-400 mb-6 sm:mb-8 tracking-[-0.06em] uppercase drop-shadow">
          Meus Gatilhos
        </h1>
        <div className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-4 sm:p-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="text-gray-400 text-base sm:text-lg mb-4 sm:mb-6">
              Identifique e gerencie seus gatilhos para manter sua sobriedade.
            </div>
            
            <TriggerForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Triggers;
