
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, SmileIcon, FrownIcon, MehIcon } from 'lucide-react';

const TalkToMe = () => {
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState('neutral');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Temporary notification until we integrate with an AI service
    toast({
      title: "Mensagem Enviada",
      description: "Em breve implementaremos a integração com IA para responder suas mensagens.",
    });
    
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif text-blue-900">Fale Comigo</h1>
          <p className="text-gray-600">Um espaço seguro para compartilhar seus pensamentos</p>
        </div>

        <Card className="p-6 bg-white/90 backdrop-blur-sm border border-blue-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mood Selection */}
            <div className="space-y-3">
              <Label className="text-gray-700">Como você está se sentindo hoje?</Label>
              <RadioGroup
                defaultValue="neutral"
                className="flex justify-center gap-8"
                value={mood}
                onValueChange={setMood}
              >
                <div className="flex flex-col items-center gap-1">
                  <RadioGroupItem value="happy" id="happy" className="sr-only" />
                  <Label
                    htmlFor="happy"
                    className={`p-2 rounded-full cursor-pointer transition-colors ${
                      mood === 'happy' ? 'bg-green-100' : 'hover:bg-gray-100'
                    }`}
                  >
                    <SmileIcon className="w-8 h-8 text-green-500" />
                  </Label>
                  <span className="text-sm text-gray-600">Bem</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <RadioGroupItem value="neutral" id="neutral" className="sr-only" />
                  <Label
                    htmlFor="neutral"
                    className={`p-2 rounded-full cursor-pointer transition-colors ${
                      mood === 'neutral' ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                  >
                    <MehIcon className="w-8 h-8 text-blue-500" />
                  </Label>
                  <span className="text-sm text-gray-600">Regular</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                  <RadioGroupItem value="sad" id="sad" className="sr-only" />
                  <Label
                    htmlFor="sad"
                    className={`p-2 rounded-full cursor-pointer transition-colors ${
                      mood === 'sad' ? 'bg-red-100' : 'hover:bg-gray-100'
                    }`}
                  >
                    <FrownIcon className="w-8 h-8 text-red-500" />
                  </Label>
                  <span className="text-sm text-gray-600">Mal</span>
                </div>
              </RadioGroup>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-700">
                Compartilhe seus pensamentos
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem aqui..."
                className="min-h-[150px] resize-none border-gray-200 focus:border-blue-300 focus:ring-blue-200"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar Mensagem
            </Button>
          </form>
        </Card>

        {/* Supportive Message */}
        <p className="text-center text-sm text-gray-600">
          Estamos aqui para ouvir e apoiar você em sua jornada de recuperação.
        </p>
      </div>
    </div>
  );
};

export default TalkToMe;
