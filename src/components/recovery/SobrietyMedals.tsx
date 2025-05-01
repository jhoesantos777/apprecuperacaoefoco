
import { Trophy } from "lucide-react";

type Medal = {
  id: string;
  days_milestone: number;
};

type SobrietyMedalsProps = {
  medals: Medal[];
};

export const SobrietyMedals = ({ medals }: SobrietyMedalsProps) => {
  const getMedalColor = (days: number) => {
    if (days >= 365) return "text-yellow-400";
    if (days >= 180) return "text-purple-400";
    if (days >= 90) return "text-blue-400";
    if (days >= 30) return "text-green-400";
    return "text-gray-400";
  };

  if (!medals || medals.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-6 text-white backdrop-blur-sm border border-white/10 shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
        Suas Conquistas
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {medals.map((medal) => (
          <div 
            key={medal.id} 
            className="bg-white/5 p-4 rounded-lg text-center hover:bg-white/10 transition-colors"
          >
            <Trophy className={`w-8 h-8 mx-auto mb-3 ${getMedalColor(medal.days_milestone)}`} />
            <p className="text-sm font-medium">
              {medal.days_milestone} dias
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
