
import React, { useRef, useEffect } from 'react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  mood?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessages = ({ messages, isLoading }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
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
  );
};

export default ChatMessages;
