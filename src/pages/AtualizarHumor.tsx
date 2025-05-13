
import React, { useState } from 'react';
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
    const moodData = {
      'otimo': { emocao: 'Ótimo', pontos: 20 }, // Updated to match new scoring rules
      'bem': { emocao: 'Bem', pontos: 15 },
      'desmotivado': { emocao: 'Desmotivado', pontos: 10 },
      'triste': { emocao: 'Triste', pontos: 5 },
      'irritado': { emocao: 'Irritado', pontos: 5 }
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

      const { error: humorError } = await supabase.from('humores').insert({
        user_id: user.id,
        emocao: moodData.emocao,
        pontos: moodData.pontos,
        note: note
      });

      if (humorError) throw humorError;

      await registerActivity('Humor', moodData.pontos, `Humor: ${moodData.emocao}`);
      
      await queryClient.invalidateQueries({ queryKey: ['recovery-thermometer'] });

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d0036] to-black px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 tracking-[-0.06em] uppercase drop-shadow">
          Como você está se sentindo?
        </h1>

        <div className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-8">
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#2d0036] to-black border border-[#4b206b] rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Seu Histórico de Humor</h2>
          <div className="space-y-4">
            {/* moodHistory.map((entry, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-[#4b206b] bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{entry.mood.emoji}</span>
                  <div>
                    <div className="text-white font-medium">{entry.mood.label}</div>
                    <div className="text-gray-400 text-sm">
                      {new Date(entry.timestamp).toLocaleString()}
                    </div>
                    {entry.note && (
                      <div className="text-gray-300 mt-2 text-sm">{entry.note}</div>
                    )}
                  </div>
                </div>
              </div>
            )) */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtualizarHumor;
