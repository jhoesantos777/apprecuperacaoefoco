import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

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
      toast("Erro", {
        description: "Não foi possível carregar o versículo do dia.",
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewVerse = async () => {
    try {
      setIsLoading(true);
      // Lista de versículos bíblicos para recuperação
      const verses = [
        { verse: "Porque para Deus nada é impossível.", reference: "Lucas 1:37" },
        { verse: "Tudo posso naquele que me fortalece.", reference: "Filipenses 4:13" },
        { verse: "O Senhor é meu pastor, nada me faltará.", reference: "Salmos 23:1" },
        { verse: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", reference: "Mateus 11:28" },
        { verse: "Mas os que esperam no Senhor renovarão as suas forças.", reference: "Isaías 40:31" },
        { verse: "O Senhor é a minha luz e a minha salvação; de quem terei medo?", reference: "Salmos 27:1" },
        { verse: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá.", reference: "João 14:27" },
        { verse: "O Senhor é meu refúgio e fortaleza, socorro bem presente na angústia.", reference: "Salmos 46:1" },
        { verse: "Esperei com paciência pelo Senhor, e ele se inclinou para mim e ouviu o meu clamor.", reference: "Salmos 40:1" }
      ];

      // Selecionar um versículo aleatório
      const randomVerse = verses[Math.floor(Math.random() * verses.length)];

      // Gerar explicação usando ChatGPT
      const response = await fetch('/api/verse-explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          verse: randomVerse.verse,
          reference: randomVerse.reference,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar explicação');
      }

      const data = await response.json();
      
      if (!data.explanation) {
        throw new Error('Explicação não recebida');
      }

      const newVerse = {
        verse: randomVerse.verse,
        reference: randomVerse.reference,
        explanation: data.explanation,
        date: new Date().toISOString().split('T')[0]
      };

      // Salvar no localStorage
      localStorage.setItem('dailyVerse', JSON.stringify(newVerse));
      setVerse(newVerse);
      
      toast("Sucesso", {
        description: "Novo versículo gerado com sucesso!",
        style: { backgroundColor: 'hsl(var(--success))' }
      });
    } catch (error) {
      console.error('Erro ao gerar versículo:', error);
      toast("Erro", {
        description: "Não foi possível gerar o versículo do dia. Tente novamente.",
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
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