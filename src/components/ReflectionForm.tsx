
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Save, HelpCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const GUIDING_QUESTIONS = [
  "O que me fez bem hoje?",
  "Com o que eu aprendi?",
  "Que vitórias celebrei?",
  "Como me senti ao longo do dia?",
  "O que me ajudou a manter minha sobriedade?",
  "O que posso fazer melhor amanhã?"
];

export const ReflectionForm = () => {
  const [reflection, setReflection] = useState('');
  const { toast } = useToast();

  const handleSave = () => {
    if (!reflection.trim()) {
      toast({
        title: "Campo vazio",
        description: "Por favor, escreva sua reflexão antes de salvar.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement saving to database
    toast({
      title: "Reflexão salva!",
      description: "Sua reflexão do dia foi salva com sucesso.",
    });
  };

  return (
    <Card className="bg-white/95 shadow-lg border-none">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-rose-400" />
            <h3 className="font-serif text-lg text-gray-700">Perguntas para reflexão:</h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {GUIDING_QUESTIONS.map((question, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-rose-400">•</span>
                {question}
              </li>
            ))}
          </ul>
        </div>
        
        <Textarea
          placeholder="Escreva aqui sua reflexão do dia..."
          className="min-h-[200px] mb-4 text-gray-700 bg-gray-50/50 border-gray-200 focus:border-rose-200 focus:ring-rose-200"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        />
        
        <Button 
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 transition-all duration-300"
        >
          <Save className="h-4 w-4 mr-2" />
          Salvar Reflexão
        </Button>
      </CardContent>
    </Card>
  );
};
