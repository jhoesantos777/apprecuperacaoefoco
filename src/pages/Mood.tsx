
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Smile, 
  Frown, 
  Meh, 
  Angry, 
  Confused 
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

const moodOptions = [
  { 
    icon: Smile, 
    label: 'Feliz', 
    points: 10,
    color: 'bg-green-100 text-green-600',
    description: 'Aproveite esse momento! Mantenha essa energia positiva.'
  },
  { 
    icon: Confused, 
    label: 'Ansioso', 
    points: -5,
    color: 'bg-yellow-100 text-yellow-600',
    description: 'Respire fundo. Pratique meditação ou converse com alguém.'
  },
  { 
    icon: Frown, 
    label: 'Triste', 
    points: -10,
    color: 'bg-blue-100 text-blue-600',
    description: 'Seja gentil consigo mesmo. Talvez um abraço ou uma conversa ajude.'
  },
  { 
    icon: Angry, 
    label: 'Irritado', 
    points: -10,
    color: 'bg-red-100 text-red-600',
    description: 'Tire um tempo para si. Faça exercícios de respiração.'
  },
  { 
    icon: Meh, 
    label: 'Esperançoso', 
    points: 5,
    color: 'bg-purple-100 text-purple-600',
    description: 'Continue acreditando. Cada dia é uma nova oportunidade.'
  }
];

const Mood = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMoodSelect = async (mood: string, points: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para registrar seu humor.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.from('mood_entries').insert({
        user_id: user.id,
        mood,
        description: description || null,
        points
      });

      if (error) throw error;

      toast({
        title: "Humor registrado",
        description: "Seu humor foi registrado com sucesso!"
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error registering mood:', error);
      toast({
        title: "Erro",
        description: "Não foi possível registrar seu humor.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-teal-900 p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Como você está se sentindo hoje?</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {moodOptions.map((mood) => (
          <Button
            key={mood.label}
            variant="outline"
            className={`flex flex-col items-center p-4 h-32 ${
              selectedMood === mood.label ? mood.color : 'bg-white'
            }`}
            onClick={() => setSelectedMood(mood.label)}
          >
            <mood.icon className="h-10 w-10 mb-2" />
            <span>{mood.label}</span>
          </Button>
        ))}
      </div>

      {selectedMood && (
        <div className="bg-white rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-2">
            {moodOptions.find(m => m.label === selectedMood)?.description}
          </h2>
          <Textarea
            placeholder="Descreva brevemente como você está se sentindo (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-4"
          />
          <Button 
            onClick={() => {
              const selectedMoodData = moodOptions.find(m => m.label === selectedMood);
              if (selectedMoodData) {
                handleMoodSelect(selectedMoodData.label, selectedMoodData.points);
              }
            }}
            className="w-full"
          >
            Registrar Humor
          </Button>
        </div>
      )}
    </div>
  );
};

export default Mood;
