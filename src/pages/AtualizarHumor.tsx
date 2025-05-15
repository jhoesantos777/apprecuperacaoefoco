
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { BackButton } from '@/components/BackButton';
import { registerActivity } from '@/utils/activityPoints';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Smile, Brain } from 'lucide-react';

const AtualizarHumor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState('');
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [showMotivation, setShowMotivation] = useState(false);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const fetchMoodHistory = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('humores')
        .select('*')
        .eq('user_id', user.id)
        .order('data_registro', { ascending: false })
        .limit(5);

      if (error) throw error;
      
      setMoodHistory(data || []);
    } catch (error) {
      console.error('Error fetching mood history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodChange = (mood: string) => {
    setSelectedMood(mood);
    setShowMotivation(false);
  };

  const getMotivationalMessage = (mood: string) => {
    const messages = {
      'otimo': "Que ótimo que você está se sentindo bem hoje! Continue cultivando essa energia positiva.",
      'bem': "Sentir-se bem é uma grande conquista. Aproveite esse momento e continue avançando.",
      'desmotivado': "A desmotivação é apenas temporária. Lembre-se de seu valor e de que cada dia é uma nova oportunidade.",
      'triste': "Momentos de tristeza também passam. Seja gentil consigo mesmo e lembre-se de suas forças.",
      'irritado': "A irritação é uma energia que pode ser transformada. Respire fundo e lembre-se do seu compromisso com sua recuperação."
    };

    return messages[mood as keyof typeof messages] || "Obrigado por compartilhar como está se sentindo hoje.";
  };

  const getMoodData = (mood: string) => {
    // Updated point values as requested
    const moodData = {
      'otimo': { emocao: 'Ótimo', pontos: 20 },
      'bem': { emocao: 'Bem', pontos: 15 },
      'desmotivado': { emocao: 'Desmotivado', pontos: 10 },
      'triste': { emocao: 'Triste', pontos: 5 },
      'irritado': { emocao: 'Irritado', pontos: 0 }
    };

    return moodData[mood as keyof typeof moodData] || { emocao: 'Indefinido', pontos: 0 };
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "Aviso",
        description: "Por favor, selecione como você está se sentindo hoje.",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const moodData = getMoodData(selectedMood);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para registrar seu humor.",
          variant: "destructive"
        });
        return;
      }

      // Update this section - don't include note in the database operation
      // since the 'humores' table doesn't have a 'note' column
      const { error: humorError } = await supabase.from('humores').insert({
        user_id: user.id,
        emocao: moodData.emocao,
        pontos: moodData.pontos
      });

      if (humorError) throw humorError;

      // We'll pass the note to the activity registration instead
      await registerActivity('Humor', moodData.pontos, `Humor: ${moodData.emocao}${note ? ' - ' + note : ''}`);
      
      await queryClient.invalidateQueries({ queryKey: ['recovery-thermometer'] });
      await fetchMoodHistory();

      // Show motivational message
      setMotivationalMessage(getMotivationalMessage(selectedMood));
      setShowMotivation(true);
      
      toast({
        title: "Sucesso!",
        description: "Seu humor foi registrado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao registrar humor:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar seu humor. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const getMoodEmoji = (mood: string) => {
    const emojis = {
      'Ótimo': '😄',
      'Bem': '🙂',
      'Desmotivado': '😐',
      'Triste': '😔',
      'Irritado': '😠'
    };
    
    return emojis[mood as keyof typeof emojis] || '😶';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d0036] to-black px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <BackButton className="text-white/70 mb-6" />
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 tracking-[-0.06em] uppercase drop-shadow">
          Como você está se sentindo?
        </h1>

        <div className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-8">
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <button
                key="otimo"
                onClick={() => handleMoodChange('otimo')}
                className={`p-4 rounded-xl border transition-all transform hover:scale-105 ${
                  selectedMood === 'otimo'
                    ? 'border-[#a259ec] bg-[#4b206b]/30'
                    : 'border-[#4b206b] hover:border-[#a259ec]'
                }`}
              >
                <div className="text-4xl mb-2">😄</div>
                <div className="text-white text-sm font-medium">ÓTIMO</div>
                <div className="text-green-400 text-xs mt-1">+20 pontos</div>
              </button>
              
              <button
                key="bem"
                onClick={() => handleMoodChange('bem')}
                className={`p-4 rounded-xl border transition-all transform hover:scale-105 ${
                  selectedMood === 'bem'
                    ? 'border-[#a259ec] bg-[#4b206b]/30'
                    : 'border-[#4b206b] hover:border-[#a259ec]'
                }`}
              >
                <div className="text-4xl mb-2">🙂</div>
                <div className="text-white text-sm font-medium">BEM</div>
                <div className="text-green-400 text-xs mt-1">+15 pontos</div>
              </button>
              
              <button
                key="desmotivado"
                onClick={() => handleMoodChange('desmotivado')}
                className={`p-4 rounded-xl border transition-all transform hover:scale-105 ${
                  selectedMood === 'desmotivado'
                    ? 'border-[#a259ec] bg-[#4b206b]/30'
                    : 'border-[#4b206b] hover:border-[#a259ec]'
                }`}
              >
                <div className="text-4xl mb-2">😐</div>
                <div className="text-white text-sm font-medium">DESMOTIVADO</div>
                <div className="text-yellow-400 text-xs mt-1">+10 pontos</div>
              </button>
              
              <button
                key="triste"
                onClick={() => handleMoodChange('triste')}
                className={`p-4 rounded-xl border transition-all transform hover:scale-105 ${
                  selectedMood === 'triste'
                    ? 'border-[#a259ec] bg-[#4b206b]/30'
                    : 'border-[#4b206b] hover:border-[#a259ec]'
                }`}
              >
                <div className="text-4xl mb-2">😔</div>
                <div className="text-white text-sm font-medium">TRISTE</div>
                <div className="text-orange-400 text-xs mt-1">+5 pontos</div>
              </button>
              
              <button
                key="irritado"
                onClick={() => handleMoodChange('irritado')}
                className={`p-4 rounded-xl border transition-all transform hover:scale-105 ${
                  selectedMood === 'irritado'
                    ? 'border-[#a259ec] bg-[#4b206b]/30'
                    : 'border-[#4b206b] hover:border-[#a259ec]'
                }`}
              >
                <div className="text-4xl mb-2">😠</div>
                <div className="text-white text-sm font-medium">IRRITADO</div>
                <div className="text-red-400 text-xs mt-1">0 pontos</div>
              </button>
            </div>

            {selectedMood && (
              <div className="space-y-6">
                <div className="text-white text-lg">
                  <p className="mb-2">Por que você está se sentindo {selectedMood.toLowerCase()}?</p>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Descreva seus sentimentos..."
                    className="w-full h-32 p-4 rounded-xl bg-white/5 border border-[#4b206b] text-white placeholder-gray-400 focus:outline-none focus:border-[#a259ec] transition-all"
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-8 py-3 rounded-full bg-red-600 text-white font-bold shadow-lg hover:bg-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Registrando...' : 'Registrar Humor'}
                  </button>
                </div>
              </div>
            )}

            {showMotivation && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-xl bg-gradient-to-br from-[#4b206b]/30 to-[#2d0036]/30 border border-[#a259ec]/30 text-white text-center"
              >
                <p className="text-xl italic">{motivationalMessage}</p>
              </motion.div>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Seu Histórico de Humor</h2>
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-white/70 text-center py-4">Carregando histórico...</p>
            ) : moodHistory.length > 0 ? (
              moodHistory.map((entry: any, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-[#4b206b] bg-white/5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getMoodEmoji(entry.emocao)}</span>
                    <div>
                      <div className="text-white font-medium">{entry.emocao}</div>
                      <div className="text-gray-400 text-sm">
                        {formatDate(entry.data_registro)}
                      </div>
                      <div className="text-yellow-400 text-sm mt-1">
                        {entry.pontos} pontos
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/70 text-center py-4">Nenhum registro de humor encontrado.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtualizarHumor;
