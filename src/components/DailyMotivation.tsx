import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Quote } from 'lucide-react';

const motivationalMessages = [
  "Cada dia sóbrio é uma vitória que merece ser celebrada.",
  "Sua força é maior que qualquer vício. Confie na sua jornada.",
  "Recuperação não é uma linha reta, é uma estrada com curvas. Continue avançando.",
  "O primeiro passo para mudar é acreditar que você pode.",
  "Você não está sozinho nessa jornada. Há pessoas que se importam.",
  "Tropeçar não significa cair. Levante-se e continue.",
  "Viva um dia de cada vez. Hoje é o que importa.",
  "Sua história ainda está sendo escrita. Faça desse capítulo um de superação.",
  "A recuperação é um presente que você dá a si mesmo diariamente.",
  "Quando você se sente fraco, lembre-se de todas as batalhas que já venceu.",
  "A fé move montanhas e também afasta vícios.",
  "O poder de mudar está dentro de você.",
  "Substituir velhos hábitos por novos é parte da sua transformação.",
  "Seu valor não é definido pelos seus erros, mas pela sua coragem de recomeçar.",
  "Você é mais forte do que pensa e mais capaz do que imagina.",
  "A jornada de recuperação revela uma força interior que você nem sabia que tinha.",
  "A sobriedade não é apenas abstinência, é redescobrir quem você realmente é.",
  "Cada momento de tentação superada é um tijolo na construção da sua nova vida.",
  "Há beleza em recomeçar. Há graça em perdoar-se.",
  "Você não é definido pelo seu passado, mas pelo seu potencial futuro.",
  "A verdadeira coragem é continuar quando tudo parece impossível.",
  "Pequenos passos todos os dias levam a grandes mudanças.",
  "A recuperação traz de volta o que a dependência tirou: sua verdadeira essência.",
  "Hoje é um novo dia, uma nova chance de fazer escolhas diferentes.",
  "Sua luta de hoje é sua força de amanhã.",
  "Acredite no processo. A recuperação acontece um dia por vez.",
  "Você está se tornando a pessoa que sempre foi destinado a ser.",
  "Para cada tentação existe uma força interior maior esperando ser descoberta.",
  "Agradeça por mais um dia de clareza e sobriedade.",
  "Quando o caminho parece difícil, lembre-se do quanto você já percorreu.",
  "A recuperação não é apenas sobre parar, é sobre começar uma nova vida."
];

const inspirationalQuotes = [
  {
    text: "Tudo posso naquele que me fortalece.",
    source: "Filipenses 4:13"
  },
  {
    text: "O Senhor é meu pastor e nada me faltará.",
    source: "Salmos 23:1"
  },
  {
    text: "Cada amanhecer é uma nova oportunidade para recomeçar.",
    source: "Anônimo"
  },
  {
    text: "A paz vem de dentro. Não a procure à sua volta.",
    source: "Buda"
  },
  {
    text: "A força não provém da capacidade física, mas de uma vontade indomável.",
    source: "Mahatma Gandhi"
  }
];

export const DailyMotivation = () => {
  const [todaysMessage, setTodaysMessage] = useState('');
  const [todaysQuote, setTodaysQuote] = useState({ text: '', source: '' });
  
  useEffect(() => {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - startOfYear.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const messageIndex = dayOfYear % motivationalMessages.length;
    const quoteIndex = dayOfYear % inspirationalQuotes.length;
    
    setTodaysMessage(motivationalMessages[messageIndex]);
    setTodaysQuote(inspirationalQuotes[quoteIndex]);
  }, []);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-amber-50 to-rose-50 border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start">
            <Quote className="text-rose-500 w-8 h-8 mr-3 mt-1 flex-shrink-0" />
            <div>
              <p className="text-lg font-serif italic text-gray-800 mb-2">{todaysQuote.text}</p>
              <p className="text-sm text-gray-600 font-medium">{todaysQuote.source}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex items-start">
            <Quote className="text-blue-500 w-8 h-8 mr-3 mt-1 flex-shrink-0" />
            <div>
              <p className="text-lg font-medium text-gray-800 italic">{todaysMessage}</p>
              <p className="text-sm text-gray-600 mt-2">
                {format(new Date(), "dd 'de' MMMM, yyyy")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyMotivation;
