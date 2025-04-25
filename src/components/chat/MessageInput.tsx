
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
}

const MessageInput = ({ message, isLoading, onMessageChange, onSubmit }: MessageInputProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-700">
          Compartilhe seus pensamentos
        </Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Digite sua mensagem aqui..."
          className="min-h-[150px] resize-none border-gray-200 focus:border-blue-300 focus:ring-blue-200"
          disabled={isLoading}
        />
      </div>

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
  );
};

export default MessageInput;
