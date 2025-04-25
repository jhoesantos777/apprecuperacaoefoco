
import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MessageSquare, Send, SmileIcon, FrownIcon, MehIcon, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  mood?: string;
}

const TalkToMe = () => {
  const [message, setMessage] = useState('');
  const [mood, setMood] = useState('neutral');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initial AI message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: 'Olá! Sou um assistente especializado em apoiar pessoas que enfrentam dependência química. Como posso ajudar você hoje? Sinta-se à vontade para compartilhar o que está sentindo.'
        }
      ]);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Get mood emoji
    const moodEmoji = mood === 'happy' ? '😊' : mood === 'sad' ? '😔' : '😐';
    const userMoodMessage = `${message} (Humor atual: ${moodEmoji})`;
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMoodMessage, mood }]);
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/talk-to-me', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMoodMessage }],
          mood,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao conectar com o assistente.');
      }

      const data = await response.json();
      
      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Erro:', error);
      toast({
        title: "Erro na comunicação",
        description: "Não foi possível conectar com o assistente. Por favor, tente novamente.",
        variant: "destructive"
      });
      
      // Fallback response
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
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif text-blue-900">Fale Comigo</h1>
          <p className="text-gray-600">Um espaço seguro para compartilhar seus pensamentos</p>
        </div>

        {/* Chat Messages */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm border border-blue-100 shadow-sm max-h-[50vh] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-100 text-blue-900' 
                      : 'bg-purple-100 text-purple-900'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center mb-1">
                      <MessageSquare className="w-4 h-4 mr-1 text-purple-600" />
                      <span className="text-xs font-medium text-purple-600">Conselheiro</span>
                    </div>
                  )}
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-purple-100 text-purple-900">
                  <div className="flex items-center">
                    <Loader2 className="w-4 h-4 mr-2 text-purple-600 animate-spin" />
                    <span className="text-sm">Escrevendo resposta...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </Card>

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
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
              disabled={isLoading || !message.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Mensagem
                </>
              )}
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
