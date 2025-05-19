
import React, { useState } from 'react';
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CalendarIcon, Check } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Label } from '@/components/ui/label';
import { registerActivity, ACTIVITY_POINTS } from '@/utils/activityPoints';
import { toast } from '@/components/ui/sonner';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';

export const ReflectionForm = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error("Por favor preencha título e conteúdo da reflexão");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Save reflection to database
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Você precisa estar logado para salvar reflexões");
        return;
      }
      
      const { error } = await supabase.from('reflections').insert({
        user_id: user.id,
        content: content
      });
      
      if (error) {
        console.error("Erro ao salvar reflexão:", error);
        toast.error("Não foi possível salvar sua reflexão");
        return;
      }
      
      // Register activity points
      await registerActivity(
        'Reflexão', 
        ACTIVITY_POINTS.Reflexão, 
        `Reflexão: ${title}`
      );
      
      toast.success(`Reflexão registrada com sucesso! +${ACTIVITY_POINTS.Reflexão} pontos`);
      setHasSubmitted(true);
      
      // Reset form after short delay
      setTimeout(() => {
        setTitle('');
        setContent('');
        setDate(new Date());
        setHasSubmitted(false);
      }, 2000);
      
    } catch (error) {
      console.error("Erro ao processar reflexão:", error);
      toast.error("Ocorreu um erro ao processar sua reflexão");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="title" className="text-white mb-2">
              Título da Reflexão
            </Label>
            <Input
              id="title"
              placeholder="Dê um título para sua reflexão"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/5 border-white/20 text-white"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <Label htmlFor="date" className="text-white mb-2">
              Data
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[200px] justify-start text-left font-normal bg-white/5 border-white/20 text-white",
                    !date && "text-muted-foreground"
                  )}
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div>
          <Label htmlFor="content" className="text-white mb-2">
            Reflexão (+{ACTIVITY_POINTS.Reflexão} pts)
          </Label>
          <Textarea
            id="content"
            placeholder="Compartilhe seus pensamentos, sentimentos e reflexões do dia..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="bg-white/5 border-white/20 text-white resize-none"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting || hasSubmitted}
            className={cn(
              "px-8",
              hasSubmitted && "bg-green-600 hover:bg-green-700"
            )}
          >
            <Check className="mr-2 h-4 w-4" />
            {isSubmitting ? "Salvando..." : hasSubmitted ? "Reflexão Registrada" : "Concluir Reflexão"}
          </Button>
        </div>
      </form>
    </div>
  );
};
