
import { CalendarDays } from "lucide-react";

type SobrietyCounterProps = {
  daysCount: number;
};

export const SobrietyCounter = ({ daysCount }: SobrietyCounterProps) => {
  const motivationalPhrases = [
    "Você está vencendo um dia de cada vez!",
    "Cada dia limpo é uma vitória!",
    "Sua força é maior que qualquer desafio!",
  ];

  const randomPhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];

  return (
    <div className="bg-white/10 rounded-lg p-6 text-center text-white backdrop-blur-sm">
      <div className="flex items-center justify-center mb-4">
        <CalendarDays className="w-8 h-8 text-yellow-300" />
      </div>
      <h1 className="text-5xl font-bold mb-2">{daysCount}</h1>
      <p className="text-xl mb-4">Dias em Sobriedade</p>
      <p className="text-white/80 italic">{randomPhrase}</p>
    </div>
  );
};
