
import React from 'react';
import { BackButton } from '@/components/BackButton';
import TriggerForm from '@/components/TriggerForm';
import { Card } from '@/components/ui/card';
import DailyMotivation from '@/components/DailyMotivation';

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
      <div className="bg-white/80 rounded-lg p-4 backdrop-blur-sm self-start">
        <BackButton />
      </div>
      
      <div className="max-w-md mx-auto space-y-6 mt-4 z-10">
        <h1 className="text-3xl font-bold text-white mb-6 bg-black/30 p-4 rounded-lg backdrop-blur-sm">
          Gatilhos Diários
        </h1>
        
        <DailyMotivation />

        <Card className="p-6 bg-white/90 backdrop-blur-sm">
          <TriggerForm />
        </Card>
      </div>
    </div>
  );
};

export default Triggers;
