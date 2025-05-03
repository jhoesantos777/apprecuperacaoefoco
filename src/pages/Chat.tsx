import React from 'react';
import AIChat from '@/components/AIChat';

const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d0036] to-black px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-red-600 mb-8 tracking-[-0.06em] uppercase drop-shadow">
          Assistente Virtual
        </h1>

        <div className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            <div className="text-white text-lg text-center">
              <p>Converse com nosso assistente virtual para obter apoio e orientação em sua jornada de recuperação.</p>
            </div>
            
            <AIChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 