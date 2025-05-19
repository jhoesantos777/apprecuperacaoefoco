
import React, { useState } from 'react';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Smile, Frown, Meh, AlertTriangle, Angry, Check } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { registerActivity, getActivityPointValue } from '@/utils/activityPoints';
import { useNavigate } from 'react-router-dom';

type MoodOption = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  points: number;
  description: string;
};

const AtualizarHumor = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const moodOptions: MoodOption[] = [
    {
      id: 'Ótimo',
      label: 'Ótimo',
      icon: Smile,
      color: 'bg-gradient-to-br from-green-500 to-green-600 border-green-400',
      points: 10,
      description: 'Estou me sentindo muito bem, animado e confiante'
    },
    {
      id: 'Bem',
      label: 'Bem',
      icon: Smile,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400',
      points: 5,
      description: 'Estou me sentindo tranquilo e estável'
    },
    {
      id: 'Desmotivado',
      label: 'Desmotivado',
      icon: Meh,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600 border-yellow-400',
      points: 0,
      description: 'Estou me sentindo sem energia ou motivação'
    },
    {
      id: 'Triste',
      label: 'Triste',
      icon: Frown,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600 border-orange-400',
      points: -5,
      description: 'Estou me sentindo para baixo e desanimado'
    },
    {
      id: 'Irritado',
      label: 'Irritado',
      icon: Angry,
      color: 'bg-gradient-to-br from-red-500 to-red-600 border-red-400',
      points: -10,
      description: 'Estou me sentindo frustrado e irritado'
    }
  ];
  
  const updateMood = useMutation({
    mutationFn: async (mood: string) => {
      if (!mood) return;
      
      const timestamp = new Date().toISOString();
      const moodOption = moodOptions.find(m => m.id === mood);
      
      if (!moodOption) throw new Error('Opção de humor inválida');
      
      // Register mood activity with appropriate points
      await registerActivity(
        'Humor',
        moodOption.points,
        `Humor registrado: ${moodOption.label}`
      );
      
      // Update user profile mood
      await supabase.rpc('update_user_mood', {
        mood_value: mood,
        mood_timestamp: timestamp
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['activity-points'] });
      
      const moodOption = moodOptions.find(m => m.id === selectedMood);
      const points = moodOption?.points || 0;
      
      if (points > 0) {
        toast.success(`Humor registrado com sucesso! +${points} pontos`);
      } else if (points < 0) {
        toast.success(`Humor registrado. ${points} pontos. Continue firme!`);
      } else {
        toast.success('Humor registrado com sucesso!');
      }
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    },
    onError: (error) => {
      toast.error('Erro ao atualizar seu humor');
      console.error('Error updating mood:', error);
    }
  });
  
  const handleMoodSubmit = () => {
    if (!selectedMood) {
      toast.error('Por favor, selecione como está se sentindo');
      return;
    }
    
    setIsSubmitting(true);
    updateMood.mutate(selectedMood);
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-6">
      <BackButton className="text-white mb-6" />
      
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Como Você Está Hoje?</h1>
          <p className="text-white/80 mt-2">
            Registre seu estado emocional e ganhe pontos para seu termômetro
          </p>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {moodOptions.map((option) => (
            <motion.div key={option.id} variants={item}>
              <Card 
                onClick={() => setSelectedMood(option.id)}
                className={`cursor-pointer border-2 transition-all ${
                  selectedMood === option.id 
                    ? `${option.color} shadow-lg scale-[1.02]` 
                    : 'bg-white/10 border-white/20 hover:border-white/40 backdrop-blur-md'
                }`}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedMood === option.id ? 'bg-white/30' : 'bg-white/10'
                  }`}>
                    <option.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white flex items-center gap-2">
                      {option.label}
                      <span className={`text-sm font-normal ${
                        option.points > 0 ? 'text-green-300' : 
                        option.points < 0 ? 'text-red-300' : 'text-gray-300'
                      }`}>
                        {option.points > 0 ? `+${option.points}` : option.points} pts
                      </span>
                    </h3>
                    <p className="text-sm text-white/70">{option.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <Button
            onClick={handleMoodSubmit}
            disabled={!selectedMood || isSubmitting}
            size="lg"
            className="px-8 py-6 text-lg font-bold"
          >
            <Check className="mr-2 h-5 w-5" />
            {isSubmitting ? 'Registrando...' : 'Registrar Humor'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AtualizarHumor;
