
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";

const TriggerForm = () => {
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      const { error } = await supabase
        .from('recovery_triggers')
        .insert([{ trigger_description: description }]);

      if (error) throw error;

      toast.success("Gatilho registrado com sucesso");
      setDescription('');
    } catch (error) {
      console.error('Error registering trigger:', error);
      toast.error("Erro ao registrar gatilho");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descreva a situação de risco que você está enfrentando..."
        className="min-h-[100px]"
      />
      <Button type="submit" className="w-full">
        Registrar Gatilho
      </Button>
    </form>
  );
};

export default TriggerForm;
