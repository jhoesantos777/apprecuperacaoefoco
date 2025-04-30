
import React from 'react';
import { BackButton } from '@/components/BackButton';
import TriggerForm from '@/components/TriggerForm';
import { Card } from '@/components/ui/card';
import DailyMotivation from '@/components/DailyMotivation';
import { AlertTriangle } from 'lucide-react';

const Triggers = () => {
  return (
    <div 
      className="min-h-screen p-6 flex flex-col"
      style={{
        backgroundImage: `url('/lovable-uploads/c1c41f57-900c-4aa4-87b3-f966e634743d.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="bg-white/80 rounded-lg p-4 backdrop-blur-sm self-start shadow-lg">
        <BackButton />
      </div>
      
      <div className="max-w-lg mx-auto space-y-6 mt-4 z-10">
        <div className="bg-black/40 p-6 rounded-xl backdrop-blur-sm flex items-center gap-3">
          <AlertTriangle size={32} className="text-yellow-300" />
          <h1 className="text-3xl font-bold text-white">
            Gatilhos Diários
          </h1>
        </div>
        
        <DailyMotivation />

        <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl">
          <h2 className="text-xl font-bold text-black mb-4 border-b pb-2">Registre seus Gatilhos</h2>
          <TriggerForm />
        </Card>
      </div>
    </div>
  );
};

export default Triggers;
