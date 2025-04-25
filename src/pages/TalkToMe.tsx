
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaperPlane, Loader2, Heart, Headphones } from "lucide-react";
import ChatMessages from '@/components/chat/ChatMessages';
import MessageInput from '@/components/chat/MessageInput';
import MoodSelector from '@/components/chat/MoodSelector';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  mood?: string;
}

const TalkToMe = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mood, setMood] = useState('neutral');
  const { toast } = useToast();

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Olá! Sou um conselheiro especializado em apoiar pessoas que enfrentam dependência química. Como posso ajudar você hoje? Sinta-se à vontade para compartilhar suas dúvidas ou preocupações.'
        }
      ]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message with mood
    setMessages(prev => [...prev, { role: 'user', content: message, mood }]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/talk-to-me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: message, mood }],
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao conectar com o conselheiro.');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro na comunicação",
        description: "Não foi possível conectar com o conselheiro. Por favor, tente novamente.",
        variant: "destructive"
      });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Me desculpe, estou tendo dificuldades para responder no momento. Por favor, tente novamente em alguns instantes." 
      }]);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-purple-100 p-4 rounded-full">
              <Heart className="w-8 h-8 text-purple-500" />
              <Headphones className="w-8 h-8 text-purple-500 -mt-6 ml-4" />
            </div>
          </div>
          
          <h1 className="text-3xl font-serif text-blue-900">Fale Comigo</h1>
          <p className="text-gray-600">Você não está sozinho. Sempre que precisar, fale comigo.</p>
        </div>

        <ScrollArea className="h-[50vh]">
          <ChatMessages messages={messages} isLoading={isLoading} />
        </ScrollArea>

        <Card className="p-6 bg-white/90 backdrop-blur-sm border border-blue-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <MoodSelector mood={mood} onMoodChange={setMood} />
            
            <MessageInput 
              message={message}
              isLoading={isLoading}
              onMessageChange={setMessage}
              onSubmit={handleSubmit}
              placeholder="Escreva aqui sua dúvida, angústia ou o que quiser compartilhar..."
              maxLength={1000}
            />
          </form>
        </Card>

        <p className="text-center text-sm text-gray-600 px-4">
          Todas as conversas aqui são confidenciais. Esta ferramenta não substitui atendimento médico ou psicológico, mas pode te ajudar nos momentos difíceis.
        </p>
        
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">Precisa de ajuda imediata?</p>
          <a href="https://wa.me/5511999999999" className="text-blue-600 hover:underline text-sm inline-flex items-center gap-1">
            <span>Entre em contato pelo WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TalkToMe;
