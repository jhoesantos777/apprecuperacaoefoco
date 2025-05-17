
import React, { useEffect } from 'react';
import DailyVerse from '@/components/DailyVerse';
import { DevotionalNotes } from '@/components/devotional/DevotionalNotes';
import { BackButton } from '@/components/BackButton';
import { Logo } from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Devotional = () => {
  // Effect to track devotional visits for analytics
  useEffect(() => {
    const registerDailyVisit = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('devotional_visits')
            .insert([{ user_id: user.id }]);
        }
      } catch (error) {
        console.error("Error registering devotional visit:", error);
      }
    };
    
    registerDailyVisit();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d0036] to-black py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="flex justify-between items-center absolute top-4 left-4 right-4">
        <BackButton className="text-white/70" />
        <Logo size="sm" />
      </div>

      <div className="max-w-3xl mx-auto pt-16">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Devocional Diário</h1>
        
        {/* Daily Verse Component - Force refreshing daily */}
        <div className="mb-8">
          <DailyVerse forceRefresh={true} />
        </div>
        
        {/* Devotional Notes Component */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <DevotionalNotes />
        </div>
      </div>
    </div>
  );
};

export default Devotional;
