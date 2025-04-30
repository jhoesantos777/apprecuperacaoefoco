
import React from 'react';
import { ReflectionForm } from '@/components/ReflectionForm';
import { BackButton } from '@/components/BackButton';
import DailyMotivation from '@/components/DailyMotivation';

const Reflection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-teal-50 p-6">
      <BackButton />
      
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-serif text-gray-800 mb-6 text-center">
          Diário de Reflexão
        </h1>
        <DailyMotivation />
        <ReflectionForm />
      </div>
    </div>
  );
};

export default Reflection;
