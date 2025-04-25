import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowLeft, Award } from "lucide-react";
import { BackButton } from '@/components/BackButton';

const Achievements = () => {
  const navigate = useNavigate();

  const { data: medals } = useQuery({
    queryKey: ['user-medals'],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_medals')
        .select(`
          *,
          medal:medals (
            title,
            description,
            icon
          )
        `)
        .order('earned_at', { ascending: false });
      
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-indigo-900 p-6">
      <BackButton />
      
      <button
        onClick={() => navigate('/dashboard')}
        className="text-white/70 hover:text-white flex items-center gap-2 mb-6"
      >
        <ArrowLeft size={24} />
        Voltar
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Award className="h-12 w-12 text-yellow-300" />
          <div>
            <h1 className="text-3xl font-bold text-white">Minhas Conquistas</h1>
            <p className="text-white/70">Sua jornada de superação e vitórias</p>
          </div>
        </div>

        <div className="space-y-4">
          {medals?.map((medal) => (
            <Card key={medal.id} className="bg-white/10 border-none text-white">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="text-4xl">{medal.medal.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold">{medal.medal.title}</h3>
                  <p className="text-white/70">{medal.medal.description}</p>
                  <p className="text-sm text-yellow-300 mt-1">
                    Conquistada em {format(new Date(medal.earned_at), 'dd/MM/yyyy')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}

          {!medals?.length && (
            <Card className="bg-white/10 border-none text-white">
              <CardContent className="p-6 text-center">
                <p className="text-white/70">
                  Continue sua jornada para conquistar suas primeiras medalhas!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
