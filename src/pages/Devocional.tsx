
import React from 'react';
import DailyVerse from '@/components/DailyVerse';
import { DevocionalDoDia } from '@/components/DevocionalDoDia';

const Devocional = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d0036] to-black px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-8 tracking-[-0.06em] uppercase drop-shadow">
          Devocional Diário
        </h1>

        <DevocionalDoDia />

        <div className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Reflexão Pessoal</h2>
            <p className="text-gray-300 leading-relaxed">
              Reserve um momento para refletir sobre o versículo do dia e como ele se aplica à sua jornada de recuperação.
              Anote seus pensamentos e sentimentos abaixo.
            </p>
            <textarea
              className="w-full h-32 p-4 rounded-xl bg-white/5 border border-[#4b206b] text-white placeholder-gray-400 focus:outline-none focus:border-[#a259ec] transition-all"
              placeholder="Escreva sua reflexão aqui..."
            />
            <div className="flex justify-end">
              <button className="px-6 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg hover:bg-red-700 transition-all transform hover:scale-105">
                Salvar Reflexão
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Devocional;
