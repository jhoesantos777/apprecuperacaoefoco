
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/BackButton";

interface Audio {
  id: string;
  title: string;
  file_path: string;
}

const TherapeuticActivities1 = () => {
  const { data: audios, isLoading } = useQuery({
    queryKey: ['audios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audios')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching audios:', error);
        throw error;
      }
      
      return data as Audio[];
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-900 p-6">
        <div className="text-white text-center">Carregando meditações...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-900 p-6">
      <BackButton />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center text-white mb-8">
          <h1 className="text-3xl font-bold">Meditações Guiadas</h1>
          <p className="mt-2 text-lg opacity-90">
            Selecione uma meditação para começar sua jornada de mindfulness
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {audios?.map((audio) => (
            <Card key={audio.id} className="p-6 hover:shadow-xl transition-all bg-white/95 backdrop-blur">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{audio.title}</h3>
              <audio
                controls
                className="w-full"
                src={audio.file_path}
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TherapeuticActivities1;
