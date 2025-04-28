
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";
import { triggers, TriggerType } from '@/utils/triggerTips';
import { registerActivity } from '@/utils/activityPoints';
import { useQueryClient } from '@tanstack/react-query';

const TriggerForm = () => {
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [showTips, setShowTips] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleTriggerToggle = (triggerId: string) => {
    setSelectedTriggers(prev =>
      prev.includes(triggerId)
        ? prev.filter(id => id !== triggerId)
        : [...prev, triggerId]
    );
    setShowTips(false);
  };

  const handleShowTips = () => {
    if (selectedTriggers.length === 0) {
      toast("Selecione pelo menos um gatilho");
      return;
    }
    setShowTips(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTriggers.length === 0) {
      toast("Selecione pelo menos um gatilho");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast("Usuário não autenticado");
        return;
      }

      // Register each trigger as a negative point activity
      const promises = selectedTriggers.map(triggerId => {
        const trigger = triggers.find(t => t.id === triggerId);
        return registerActivity(
          'Gatilho',
          -1, // Negative point for each trigger
          trigger?.label
        );
      });

      await Promise.all(promises);
      
      // Invalidate recovery score query to update the thermometer
      queryClient.invalidateQueries({ queryKey: ['recovery-score'] });

      toast("Gatilhos registrados com sucesso");
      setSelectedTriggers([]);
      setShowTips(false);
    } catch (error) {
      console.error('Error registering triggers:', error);
      toast("Erro ao registrar gatilhos");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {triggers.map((trigger) => {
          const Icon = trigger.icon;
          return (
            <div key={trigger.id} className="flex items-start space-x-3">
              <Checkbox
                id={trigger.id}
                checked={selectedTriggers.includes(trigger.id)}
                onCheckedChange={() => handleTriggerToggle(trigger.id)}
              />
              <label
                htmlFor={trigger.id}
                className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                <Icon className="h-4 w-4" />
                <span>{trigger.label}</span>
              </label>
            </div>
          );
        })}
      </div>

      {!showTips && selectedTriggers.length > 0 && (
        <Button
          type="button"
          onClick={handleShowTips}
          className="w-full"
          variant="outline"
        >
          Ver Dicas de Ação
        </Button>
      )}

      {showTips && selectedTriggers.length > 0 && (
        <div className="space-y-4">
          {selectedTriggers.map(triggerId => {
            const trigger = triggers.find(t => t.id === triggerId);
            return (
              <Card key={triggerId} className="p-4 bg-muted">
                <div className="flex items-start space-x-3">
                  {trigger && <trigger.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                  <div>
                    <p className="font-medium">{trigger?.label}</p>
                    <p className="text-sm text-muted-foreground mt-1">{trigger?.tip}</p>
                  </div>
                </div>
              </Card>
            )})}
        </div>
      )}

      {selectedTriggers.length > 0 && (
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando...' : 'Registrar Gatilhos'}
        </Button>
      )}
    </form>
  );
};

export default TriggerForm;
