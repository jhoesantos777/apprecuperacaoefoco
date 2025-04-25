
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { BackButton } from '@/components/BackButton';
import { Smile, Frown, Meh, Heart, Star } from "lucide-react";

interface MoodOption {
  value: string;
  label: string;
  icon: React.ElementType;
  description: string;
  points: number;
  color: string;
}

const moodOptions: MoodOption[] = [
  {
    value: 'great',
    label: 'Ótimo',
    icon: Smile,
    description: 'Estou me sentindo muito bem hoje!',
    points: 10,
    color: 'bg-green-100 text-green-600 hover:bg-green-200'
  },
  {
    value: 'good',
    label: 'Bem',
    icon: Heart,
    description: 'Estou me sentindo bem e esperançoso.',
    points: 7,
    color: 'bg-blue-100 text-blue-600 hover:bg-blue-200'
  },
  {
    value: 'neutral',
    label: 'Neutro',
    icon: Meh,
    description: 'Estou me sentindo normal.',
    points: 5,
    color: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
  },
  {
    value: 'challenging',
    label: 'Desafiado',
    icon: Star,
    description: 'Enfrentando alguns desafios.',
    points: 3,
    color: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
  },
  {
    value: 'difficult',
    label: 'Difícil',
    icon: Frown,
    description: 'Hoje está sendo um dia difícil.',
    points: 1,
    color: 'bg-red-100 text-red-600 hover:bg-red-200'
  }
];

const MoodSelection = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "Selecione um humor",
        description: "Por favor, selecione como você está se sentindo.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const selectedOption = moodOptions.find(option => option.value === selectedMood);
      if (!selectedOption) return;

      // Insert mood entry
      const { error: moodError } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood: selectedMood,
          description: description.trim() || null,
          points: selectedOption.points
        });

      if (moodError) throw moodError;

      // Update profile's current mood
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          current_mood: selectedMood,
          last_mood_update: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast({
        title: "Humor registrado",
        description: "Seu humor foi registrado com sucesso!",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving mood:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar seu humor. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <BackButton />
      
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Como você está se sentindo?</h1>
          <p className="text-white/80">Selecione a opção que melhor representa seu humor atual</p>
        </div>

        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {moodOptions.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className={`h-32 flex flex-col items-center justify-center p-4 ${
                  selectedMood === option.value ? option.color : ''
                }`}
                onClick={() => setSelectedMood(option.value)}
              >
                <option.icon className="w-8 h-8 mb-2" />
                <span className="font-medium">{option.label}</span>
              </Button>
            ))}
          </div>

          {selectedMood && (
            <div className="space-y-4">
              <Textarea
                placeholder="Deseja compartilhar mais sobre como está se sentindo? (opcional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />

              <Button 
                className="w-full"
                onClick={handleSubmit}
              >
                Confirmar
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MoodSelection;
