import React from 'react';
import { BackButton } from '@/components/BackButton';
import TriggerForm from '@/components/TriggerForm';
import { Card } from '@/components/ui/card';
import DailyMotivation from '@/components/DailyMotivation';
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Triggers = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d0036] to-black px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-8 tracking-[-0.06em] uppercase drop-shadow">
          Meus Gatilhos
        </h1>
        <div className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <div className="text-white text-lg mb-6">
              Identifique e gerencie seus gatilhos para manter sua sobriedade.
            </div>
            <button
              onClick={() => navigate('/triggers/novo')}
              className="w-full px-6 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg hover:bg-red-700 transition-all transform hover:scale-105"
            >
              Adicionar Novo Gatilho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Triggers;
