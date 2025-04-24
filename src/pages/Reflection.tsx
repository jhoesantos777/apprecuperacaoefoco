
import React from 'react';
import { ReflectionForm } from '@/components/ReflectionForm';
import { DailyMotivation } from '@/components/DailyMotivation';
import { Card } from '@/components/ui/card';

const Reflection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white mb-6">Reflexão do Dia</h1>
        <DailyMotivation />
        <ReflectionForm />
      </div>
    </div>
  );
};

export default Reflection;
