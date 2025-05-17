
import React from 'react';
import { getDevocionalDoDia } from '@/data/dailyVerses';

const DevocionalDoDia = () => {
  const devocional = getDevocionalDoDia();

  return (
    <div className="p-4 bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-2 text-white">Versículo do Dia</h2>
      <p className="text-lg italic mb-4 text-white">{devocional.verse}</p>
      <p className="text-red-600 font-medium mb-4">{devocional.reference}</p>
      <h3 className="font-semibold mb-1 text-white">Reflexão</h3>
      <p className="text-gray-300">{devocional.reflection}</p>
    </div>
  );
};

export default DevocionalDoDia;
