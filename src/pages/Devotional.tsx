import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Book as BibleIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BackButton } from '@/components/BackButton';
import { DevotionalNotes } from '@/components/devotional/DevotionalNotes';
import { supabase } from "@/integrations/supabase/client";
import dailyVerses from '../data/dailyVerses';

// Helper to get today's verse
const getTodaysVerse = () => {
  // Calculate day of year (0-364)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = Number(now) - Number(start);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  // Get verse for today (mod 365 to ensure it wraps around)
  return dailyVerses[dayOfYear % 365];
};

const Devotional = () => {
  const currentDate = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  const todaysVerse = getTodaysVerse();

  const { data: notes } = useQuery({
    queryKey: ['devotional-notes', new Date().toISOString().split('T')[0]],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from('devotional_notes')
        .select('notes')
        .eq('user_id', user.id)
        .eq('verse_date', new Date().toISOString().split('T')[0])
        .single();

      return data?.notes;
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      <BackButton />
      
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif text-blue-900 font-bold">Devocional Diário</h1>
          <p className="text-gray-700 font-medium">{currentDate}</p>
        </div>

        {/* Verse Card */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm border border-purple-200 shadow-md">
          <div className="flex items-start gap-4">
            <BibleIcon className="text-purple-700 w-6 h-6 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-lg font-serif text-gray-900 italic font-medium">"{todaysVerse.verse}"</p>
              <p className="text-purple-800 text-sm font-semibold">{todaysVerse.reference}</p>
            </div>
          </div>
        </Card>

        {/* Reflection Card */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm border border-blue-200 shadow-md">
          <div className="flex items-start gap-4">
            <BibleIcon className="text-blue-700 w-6 h-6 flex-shrink-0" />
            <div className="space-y-2">
              <h2 className="text-xl font-serif text-blue-900 font-bold">Reflexão do Dia</h2>
              <p className="text-gray-800 leading-relaxed font-medium">{todaysVerse.reflection}</p>
            </div>
          </div>
        </Card>

        {/* Notes Section */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm border border-purple-200 shadow-md">
          <DevotionalNotes currentNotes={notes} />
        </Card>
      </div>
    </div>
  );
};

export default Devotional;
