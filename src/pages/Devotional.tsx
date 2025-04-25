
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bible, Book, Music, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Devotional = () => {
  const { toast } = useToast();
  const currentDate = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Temporary static content - in a real app this would come from a database
  const devotional = {
    verse: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
    reference: "João 3:16",
    reflection: "O amor de Deus por nós é incondicional e eterno. Ele demonstrou esse amor através do maior presente que poderia nos dar: Seu próprio Filho. Hoje, reflita sobre como esse amor infinito pode transformar sua vida e como você pode compartilhar esse amor com outros.",
    prayer: "Senhor, agradeço pelo Seu amor incomparável. Ajuda-me a viver hoje demonstrando esse amor aos outros. Amém."
  };

  const handlePlayAudio = (type: 'prayer' | 'music') => {
    // This would be connected to an audio service in a real implementation
    toast({
      title: type === 'prayer' ? "Oração do Dia" : "Música Devocional",
      description: "Em breve disponibilizaremos o áudio para este recurso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif text-blue-900">Devocional Diário</h1>
          <p className="text-gray-600">{currentDate}</p>
        </div>

        {/* Verse Card */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-purple-100 shadow-sm">
          <div className="flex items-start gap-4">
            <Bible className="text-purple-600 w-6 h-6 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-lg font-serif text-gray-800 italic">"{devotional.verse}"</p>
              <p className="text-gray-600 text-sm">{devotional.reference}</p>
            </div>
          </div>
        </Card>

        {/* Reflection Card */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-blue-100 shadow-sm">
          <div className="flex items-start gap-4">
            <Book className="text-blue-600 w-6 h-6 flex-shrink-0" />
            <div className="space-y-2">
              <h2 className="text-xl font-serif text-blue-900">Reflexão do Dia</h2>
              <p className="text-gray-700 leading-relaxed">{devotional.reflection}</p>
            </div>
          </div>
        </Card>

        {/* Audio Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => handlePlayAudio('prayer')}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Heart className="w-5 h-5" />
            Ouvir Oração do Dia
          </Button>
          <Button
            onClick={() => handlePlayAudio('music')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Music className="w-5 h-5" />
            Ouvir Música Devocional
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Devotional;
