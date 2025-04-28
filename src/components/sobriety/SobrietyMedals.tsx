
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
    <div className="bg-white/10 rounded-lg p-6 text-white backdrop-blur-sm">
      <h2 className="text-lg font-semibold mb-4">Suas Conquistas</h2>
      <div className="grid grid-cols-3 gap-4">
        {medals.map((medal) => (
          <div key={medal.id} className="text-center">
            <Trophy className={`w-8 h-8 mx-auto mb-2 ${getMedalColor(medal.days_milestone)}`} />
            <p className="text-sm">{medal.days_milestone} dias</p>
          </div>
        ))}
      </div>
    </div>
  );
};
