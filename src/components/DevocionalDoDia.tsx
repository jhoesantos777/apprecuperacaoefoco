
import { useState } from 'react';
import { DailyVerse } from '@/components/DailyVerse';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, BookOpen } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { motion } from 'framer-motion';
import { registerActivity, ACTIVITY_POINTS } from '@/utils/activityPoints';

export const DevocionalDoDia = () => {
  const [reflectionNote, setReflectionNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  
  const handleSubmitReflection = async () => {
    if (!reflectionNote.trim()) {
      toast.error("Por favor, escreva uma reflexão antes de enviar.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Register devotional activity with 30 points
      await registerActivity(
        'Devocional', 
        ACTIVITY_POINTS.Devocional,
        'Reflexão devocional diária'
      );
      
      toast.success(`Reflexão devocional registrada com sucesso! +${ACTIVITY_POINTS.Devocional} pontos`);
      setHasSubmitted(true);
      
      // Reset after a delay
      setTimeout(() => {
        setReflectionNote('');
        setHasSubmitted(false);
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao registrar reflexão devocional:', error);
      toast.error("Não foi possível registrar sua reflexão devocional");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 rounded-xl p-6 backdrop-blur-md border border-white/20">
      <motion.h2 
        className="text-2xl font-bold text-white mb-2 flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <BookOpen className="h-6 w-6" />
        Devocional do Dia (+{ACTIVITY_POINTS.Devocional} pts)
      </motion.h2>
      
      <motion.p 
        className="text-white/80 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Reserve um momento para reflexão espiritual e conexão interior
      </motion.p>
      
      <DailyVerse />
      
      <motion.div 
        className="mt-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <h3 className="text-lg font-medium text-white">Sua Reflexão</h3>
        <Textarea 
          value={reflectionNote}
          onChange={(e) => setReflectionNote(e.target.value)}
          placeholder="O que esta passagem significa para você hoje? Como você pode aplicá-la em sua jornada de recuperação?"
          rows={6}
          className="bg-white/5 border-white/20 text-white resize-none"
          disabled={isSubmitting || hasSubmitted}
        />
        
        <div className="flex justify-end">
          <Button
            onClick={handleSubmitReflection}
            disabled={isSubmitting || hasSubmitted || !reflectionNote.trim()}
            className={`font-medium ${hasSubmitted ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            <Check className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Registrando...' : hasSubmitted ? 'Reflexão Registrada' : 'Concluir Devocional'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
