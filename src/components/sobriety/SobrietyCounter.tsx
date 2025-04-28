
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
    <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-8 text-center text-white backdrop-blur-sm border border-white/10 shadow-lg">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-purple-500/20 p-4 rounded-full">
          <CalendarDays className="w-10 h-10 text-purple-300" />
        </div>
      </div>
      <h1 className="text-6xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
        {daysCount}
      </h1>
      <p className="text-2xl mb-6 font-medium text-white/90">Minha Sobriedade</p>
      <p className="text-white/80 italic bg-white/5 p-4 rounded-lg">{randomPhrase}</p>
    </div>
  );
};
