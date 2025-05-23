
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";
import { triggers, TriggerType, getCategoryTriggers } from '@/utils/triggerTips';
import { registerActivity } from '@/utils/activityPoints';
import { useQueryClient } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';

const TriggerForm = () => {
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [showTips, setShowTips] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("social");
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

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

  const categories = [
    { id: "social", label: "Social" },
    { id: "emocional", label: "Emocional" },
    { id: "local", label: "Local" },
    { id: "biologico", label: "Biológico" },
    { id: "outros", label: "Outros" }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="social" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className={`w-full ${isMobile ? 'flex flex-wrap justify-center gap-1 h-auto py-1' : 'grid grid-cols-5'} mb-4`}>
          {categories.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id} 
              className={`${isMobile ? 'text-xs py-1 px-2 flex-1 min-w-fit' : ''}`}
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getCategoryTriggers(category.id).map((trigger) => {
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
                      className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-amber-500 hover:text-amber-400 transition-colors"
                    >
                      <Icon className="h-4 w-4 text-amber-500" />
                      <span>{trigger.label}</span>
                    </label>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

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
                  {trigger && <trigger.icon className="h-5 w-5 mt-0.5 flex-shrink-0 text-amber-500" />}
                  <div>
                    <p className="font-medium text-amber-500">{trigger?.label}</p>
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
