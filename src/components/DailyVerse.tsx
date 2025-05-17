
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import dailyVerses from '@/data/dailyVerses';

interface Verse {
  verse: string;
  reference: string;
  explanation: string;
  date: string;
}

interface DailyVerseProps {
  forceRefresh?: boolean;
}

const DailyVerse = ({ forceRefresh = false }: DailyVerseProps) => {
  const [verse, setVerse] = useState<Verse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load verse on component mount and check for updates at midnight
  useEffect(() => {
    loadDailyVerse(forceRefresh);

    // Set up a timer to check for verse updates
    const checkForUpdates = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      // Check if it's midnight (0 hours, 0 minutes)
      if (currentHour === 0 && currentMinute === 0) {
        console.log('Midnight detected, updating verse...');
        loadDailyVerse(true);
      }
    };

    // Check every minute for midnight update
    const intervalId = setInterval(checkForUpdates, 60000); // 60000ms = 1 minute

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [forceRefresh]);

  const loadDailyVerse = async (shouldForceRefresh = false) => {
    try {
      setIsLoading(true);
      
      const today = new Date().toISOString().split('T')[0];
      const storedVerse = localStorage.getItem('dailyVerse');
      
      if (storedVerse && !shouldForceRefresh) {
        const parsedVerse = JSON.parse(storedVerse);
        
        // Check if the verse is from today, if not generate a new one
        if (parsedVerse.date === today) {
          setVerse(parsedVerse);
          setIsLoading(false);
          return;
        }
      }

      // If no verse for today or forceRefresh=true, generate a new one
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
      const diff = now.getTime() - start.getTime();
      const oneDay = 1000 * 60 * 60 * 24;
      const dayOfYear = Math.floor(diff / oneDay);
      
      // Use the day of year to select a verse (ensures consistent verse per day)
      const index = (dayOfYear - 1) % dailyVerses.length;
      
      console.log(`Dia do ano: ${dayOfYear}, Índice do versículo: ${index}, Total de versículos: ${dailyVerses.length}`);
      
      const dailyVerse = dailyVerses[index];
      
      if (!dailyVerse) {
        console.error(`Nenhum versículo encontrado no índice ${index}. Versículos disponíveis: ${dailyVerses.length}`);
        throw new Error('Versículo não encontrado');
      }
      
      const newVerse = {
        verse: dailyVerse.verse,
        reference: dailyVerse.reference,
        explanation: dailyVerse.reflection,
        date: now.toISOString().split('T')[0]
      };

      // Salvar no localStorage
      localStorage.setItem('dailyVerse', JSON.stringify(newVerse));
      setVerse(newVerse);
      
      if (newVerse.date !== localStorage.getItem('lastVerseDate')) {
        toast("Novo versículo do dia disponível!");
        localStorage.setItem('lastVerseDate', newVerse.date);
      }
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
      </div>
    </div>
  );
};

export default DailyVerse;
