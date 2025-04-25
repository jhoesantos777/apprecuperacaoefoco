
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  message: string;
  isLoading: boolean;
  onMessageChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  maxLength?: number;
}

const MessageInput = ({ 
  message, 
  isLoading, 
  onMessageChange, 
  onSubmit, 
  placeholder = "Digite sua mensagem aqui...",
  maxLength = 1000
}: MessageInputProps) => {
  const charCount = message.length;
  const isLimit = maxLength && charCount >= maxLength;

  return (
    <div className="space-y-2">
      <Label htmlFor="message" className="text-gray-700">
        Compartilhe seus pensamentos
      </Label>
      <Textarea
        id="message"
        value={message}
        onChange={(e) => onMessageChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        className="min-h-[120px] resize-none border-gray-200 focus:border-blue-300 focus:ring-blue-200"
        disabled={isLoading}
        maxLength={maxLength}
      />
      
      {maxLength && (
        <div className="flex justify-end">
          <span className={`text-xs ${isLimit ? 'text-red-500' : 'text-gray-500'}`}>
            {charCount}/{maxLength}
          </span>
        </div>
      )}

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
    </div>
  );
};

export default MessageInput;
