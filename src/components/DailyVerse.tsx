
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import dailyVerses from '@/data/dailyVerses';

interface Verse {
  verse: string;
  reference: string;
  explanation: string;
  date: string;
}

const DailyVerse = () => {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDailyVerse();
  }, []);

  const loadDailyVerse = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const storedVerse = localStorage.getItem('dailyVerse');
      
      if (storedVerse) {
        const parsedVerse = JSON.parse(storedVerse);
        if (parsedVerse.date === today) {
          setVerse(parsedVerse);
          setIsLoading(false);
          return;
        }
      }

      // Se não houver versículo para hoje, gerar um novo
      await generateNewVerse();
    } catch (error) {
      console.error('Erro ao carregar versículo:', error);
      toast("Erro ao carregar versículo do dia. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewVerse = async () => {
    try {
      setIsLoading(true);
      
      // Get today's day of the year (1-365)
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      
      // Use the day of year to select a verse (ensures consistent verse per day)
      const index = (dayOfYear - 1) % dailyVerses.length;
      const dailyVerse = dailyVerses[index];
      
      const newVerse = {
        verse: dailyVerse.verse,
        reference: dailyVerse.reference,
        explanation: dailyVerse.reflection,
        date: new Date().toISOString().split('T')[0]
      };

      // Salvar no localStorage
      localStorage.setItem('dailyVerse', JSON.stringify(newVerse));
      setVerse(newVerse);
      
      toast("Novo versículo gerado com sucesso!");
    } catch (error) {
      console.error('Erro ao gerar versículo:', error);
      toast("Erro ao gerar o versículo do dia. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-[#4b206b]/30 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-8">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Versículo do Dia</h2>
          <p className="text-xl text-white italic mb-2">{verse?.verse}</p>
          <p className="text-red-600 font-medium">{verse?.reference}</p>
        </div>

        <div className="border-t border-[#4b206b] pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Reflexão</h3>
          <p className="text-gray-300 leading-relaxed">{verse?.explanation}</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={generateNewVerse}
            disabled={isLoading}
            className="px-6 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg hover:bg-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Gerando...' : 'Gerar Novo Versículo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyVerse;
