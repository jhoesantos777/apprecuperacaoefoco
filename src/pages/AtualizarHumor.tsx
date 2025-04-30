
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
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

  const handleConfirm = async () => {
    if (!selectedMood) {
      toast("Aviso", {
        description: "Por favor, selecione como você está se sentindo hoje.",
      });
      return;
    }

    try {
      const moodData = getMoodData(selectedMood);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast("Erro: Você precisa estar logado para registrar seu humor.", {
          description: "Faça login e tente novamente.",
          style: { backgroundColor: 'hsl(var(--destructive))' }
        });
        return;
      }

      const { error: humorError } = await supabase.from('humores').insert({
        user_id: user.id,
        emocao: moodData.emocao,
        pontos: moodData.pontos
      });

      if (humorError) throw humorError;

      await registerActivity('Humor', moodData.pontos, `Humor: ${moodData.emocao}`);
      
      await queryClient.invalidateQueries({ queryKey: ['recovery-thermometer'] });

      // Show motivational message
      setMotivationalMessage(getMotivationalMessage(selectedMood));
      setShowMotivation(true);
      
      toast("Sucesso!", {
        description: "Seu humor foi registrado com sucesso."
      });
    } catch (error) {
      console.error('Erro ao registrar humor:', error);
      toast("Erro", {
        description: "Não foi possível registrar seu humor. Tente novamente.",
        style: { backgroundColor: 'hsl(var(--destructive))' }
      });
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
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-b from-blue-700 to-indigo-900 flex flex-col p-6"
      style={{
        backgroundImage: 'url("/bg-pattern-blue.svg")',
        backgroundSize: 'cover',
        backgroundBlendMode: 'soft-light'
      }}
    >
      <motion.div variants={itemVariants} className="mb-6">
        <BackButton text="Voltar" className="text-white hover-scale" />
      </motion.div>
      
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Smile className="w-8 h-8 text-blue-300" />
            <h1 className="text-3xl font-bold text-white">Atualizar Humor</h1>
          </div>
          <p className="text-white/80 text-sm">aperte o botão da emoção</p>
        </motion.div>

        {!showMotivation ? (
          <div className="w-full space-y-4">
            <motion.div variants={itemVariants}>
              <Button 
                onClick={() => handleMoodChange('otimo')}
                className={`w-full py-4 text-xl font-medium bg-gradient-to-r from-teal-500 to-green-500 hover:brightness-110 hover-scale rounded-xl ${selectedMood === 'otimo' ? 'ring-2 ring-white' : ''}`}
              >
                ÓTIMO 😄
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button 
                onClick={() => handleMoodChange('bem')}
                className={`w-full py-4 text-xl font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:brightness-110 hover-scale rounded-xl ${selectedMood === 'bem' ? 'ring-2 ring-white' : ''}`}
              >
                BEM 🙂
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button 
                onClick={() => handleMoodChange('desmotivado')}
                className={`w-full py-4 text-xl font-medium bg-gradient-to-r from-yellow-500 to-yellow-400 hover:brightness-110 hover-scale rounded-xl ${selectedMood === 'desmotivado' ? 'ring-2 ring-white' : ''}`}
              >
                DESMOTIVADO 😐
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button 
                onClick={() => handleMoodChange('triste')}
                className={`w-full py-4 text-xl font-medium bg-gradient-to-r from-amber-700 to-amber-500 hover:brightness-110 hover-scale rounded-xl ${selectedMood === 'triste' ? 'ring-2 ring-white' : ''}`}
              >
                TRISTE 😔
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <Button 
                onClick={() => handleMoodChange('irritado')}
                className={`w-full py-4 text-xl font-medium bg-gradient-to-r from-red-700 to-red-500 hover:brightness-110 hover-scale rounded-xl ${selectedMood === 'irritado' ? 'ring-2 ring-white' : ''}`}
              >
                IRRITADO 😠
              </Button>
            </motion.div>
            
            <motion.div variants={itemVariants} className="pt-4">
              <Button 
                onClick={handleConfirm}
                className="w-full py-4 mt-8 text-xl font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl shadow-lg hover-scale"
              >
                CONFIRMAR
              </Button>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <Card className="p-6 text-center space-y-6 glass rounded-xl">
              <Brain className="w-12 h-12 text-blue-500 mx-auto" />
              <h2 className="text-xl font-semibold text-blue-600">Mensagem para você:</h2>
              <p className="text-lg text-gray-700 py-6 px-4 bg-blue-50/80 rounded-lg border border-blue-100">
                {motivationalMessage}
              </p>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-4 text-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg hover-scale"
              >
                Voltar ao Painel
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AtualizarHumor;
