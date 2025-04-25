import React, { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Heart, Headphones } from "lucide-react";
import ChatMessages from '@/components/chat/ChatMessages';
import MessageInput from '@/components/chat/MessageInput';
import MoodSelector from '@/components/chat/MoodSelector';
import { BackButton } from '@/components/BackButton';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const savedMessages = sessionStorage.getItem('chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
          return;
        }
      } catch (e) {
        console.error('Error parsing saved messages:', e);
      }
    }
    
    setMessages([
      {
        role: 'assistant' as const,
        content: 'Olá! Sou um conselheiro especializado em apoiar pessoas que enfrentam dependência química. Como posso ajudar você hoje? Sinta-se à vontade para compartilhar suas dúvidas ou preocupações.'
      }
    ]);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    const userMessage: Message = { role: 'user', content: message, mood };
    setMessages([...messages, userMessage]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/talk-to-me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao conectar com o conselheiro.');
      }

      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.message };
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro na comunicação",
        description: "Não foi possível conectar com o conselheiro. Por favor, tente novamente.",
        variant: "destructive"
      });
      
      const errorMessage: Message = { 
        role: 'assistant', 
        content: "Me desculpe, estou tendo dificuldades para responder no momento. Por favor, tente novamente em alguns instantes." 
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  const handleResetConversation = () => {
    sessionStorage.removeItem('chat-messages');
    setMessages([
      {
        role: 'assistant' as const,
        content: 'Olá! Sou um conselheiro especializado em apoiar pessoas que enfrentam dependência química. Como posso ajudar você hoje? Sinta-se à vontade para compartilhar suas dúvidas ou preocupações.'
      }
    ]);
    toast({
      title: "Conversa reiniciada",
      description: "Iniciamos uma nova conversa.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      <BackButton />
      
      <div className="mb-20">
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

          <div className="flex justify-end">
            <button 
              onClick={handleResetConversation}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Iniciar nova conversa
            </button>
          </div>

          <ScrollArea className="h-[50vh] border border-gray-100 rounded-lg p-4 bg-white/80">
            <ChatMessages messages={messages} isLoading={isLoading} />
            <div ref={messagesEndRef} />
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
    </div>
  );
};

export default TalkToMe;
