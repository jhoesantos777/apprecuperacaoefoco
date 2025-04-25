
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ChatMessages from '@/components/chat/ChatMessages';
import MessageInput from '@/components/chat/MessageInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const TalkToMe = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
    
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/talk-to-me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: message }],
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif text-blue-900">Fale com o Conselheiro</h1>
          <p className="text-gray-600">Um espaço seguro para suas dúvidas e preocupações</p>
        </div>

        <ChatMessages messages={messages} isLoading={isLoading} />

        <Card className="p-6 bg-white/90 backdrop-blur-sm border border-blue-100 shadow-sm">
          <MessageInput 
            message={message}
            isLoading={isLoading}
            onMessageChange={setMessage}
            onSubmit={handleSubmit}
          />
        </Card>

        <p className="text-center text-sm text-gray-600">
          Estamos aqui para ouvir e apoiar você em sua jornada de recuperação.
        </p>
      </div>
    </div>
  );
};

export default TalkToMe;
