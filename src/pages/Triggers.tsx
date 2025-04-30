
import React from 'react';
import { BackButton } from '@/components/BackButton';
import TriggerForm from '@/components/TriggerForm';
import { Card } from '@/components/ui/card';
import DailyMotivation from '@/components/DailyMotivation';

const Triggers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-rose-100 p-6">
      <BackButton />
      
      <div className="max-w-md mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Identifique seus Gatilhos de Hoje
        </h1>
        
        <DailyMotivation />

        <Card className="p-6">
          <TriggerForm />
        </Card>
      </div>
    </div>
  );
};

export default Triggers;
