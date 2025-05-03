import React, { useState, useEffect } from 'react';
import { devotionalService } from '@/services/devotionalService';
import { toast } from '@/components/ui/sonner';
import { Loader2 } from 'lucide-react';

interface Devotional {
  title: string;
  verse: string;
  reference: string;
  message: string;
  date: string;
}

const Devotional = () => {
  const [devotional, setDevotional] = useState<Devotional | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDevotional();
  }, []);

  const loadDevotional = async () => {
    try {
      const data = await devotionalService.getDailyDevotional();
      setDevotional(data);
    } catch (error) {
      console.error('Erro ao carregar devocional:', error);
      toast("Erro", {
        description: "Não foi possível carregar o devocional do dia.",
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewDevotional = async () => {
    try {
      setIsLoading(true);
      const data = await devotionalService.generateNewDevotional();
      setDevotional(data);
      toast("Sucesso", {
        description: "Novo devocional gerado com sucesso!",
        style: { backgroundColor: 'hsl(var(--success))' }
      });
    } catch (error) {
      console.error('Erro ao gerar devocional:', error);
      toast("Erro", {
        description: "Não foi possível gerar o devocional. Tente novamente.",
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2d0036] to-black py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
        <img
          src="/philos-logo.png"
          alt="Logo Philos"
          className="fixed top-4 right-4 w-20 h-20 z-50"
        />
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-white">Carregando devocional...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d0036] to-black py-12 px-4 sm:px-6 lg:px-8 relative">
      <img
        src="/philos-logo.png"
        alt="Logo Philos"
        className="fixed top-4 right-4 w-20 h-20 z-50"
      />
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-8">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">{devotional?.title}</h1>
              <div className="bg-purple-900/30 p-6 rounded-xl mb-4">
                <p className="text-xl text-white italic mb-2">{devotional?.verse}</p>
                <p className="text-red-500 font-medium">{devotional?.reference}</p>
              </div>
            </div>

            <div className="border-t border-[#4b206b] pt-6">
              <h2 className="text-xl font-semibold text-white mb-4">Reflexão</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{devotional?.message}</p>
            </div>

            <div className="text-center text-sm text-gray-400">
              <p>Este devocional é atualizado automaticamente a cada 24 horas.</p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={generateNewDevotional}
                disabled={isLoading}
                className="px-6 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg hover:bg-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Gerando...' : 'Gerar Novo Devocional'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Devotional;
