
import { Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Medal = {
  id: string;
  days_milestone: number;
};

type SobrietyMedalsProps = {
  medals: Medal[];
  daysCount: number;
  compact?: boolean;
};

export const SobrietyMedals = ({ medals, daysCount, compact = false }: SobrietyMedalsProps) => {
  const getMedalColor = (days: number) => {
    if (days >= 365) return "text-yellow-400";
    if (days >= 180) return "text-purple-400";
    if (days >= 90) return "text-blue-400";
    if (days >= 30) return "text-green-400";
    return "text-gray-400";
  };

  const getBadgeVariant = (days: number) => {
    if (days >= 365) return "gold";
    if (days >= 180) return "purple";
    if (days >= 90) return "info";
    if (days >= 30) return "success";
    return "default";
  };

  // For compact view, always show the badge with current days
  if (compact) {
    return (
      <Badge 
        variant={getBadgeVariant(daysCount)}
        size="default"
        className="flex items-center gap-1.5"
      >
        <Trophy className="w-3 h-3 ${getMedalColor(daysCount)}" />
        <span>{daysCount} dias</span>
      </Badge>
    );
  }

  // Regular view with the complete medal display
  return (
    <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl p-6 text-white backdrop-blur-sm border border-white/10 shadow-lg">
      <h2 className="text-xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300">
        Suas Conquistas
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {medals && medals.length > 0 ? (
          medals
            .sort((a, b) => b.days_milestone - a.days_milestone)
            .map((medal) => (
              <div 
                key={medal.id} 
                className="bg-white/5 p-4 rounded-lg text-center hover:bg-white/10 transition-colors"
              >
                <Trophy className={`w-8 h-8 mx-auto mb-3 ${getMedalColor(medal.days_milestone)}`} />
                <p className="text-sm font-medium">
                  {medal.days_milestone} dias
                </p>
              </div>
            ))
        ) : (
          <div className="col-span-full text-center py-4">
            <p className="text-white/70">Sem medalhas ainda</p>
          </div>
        )}
      </div>
    </div>
  );
};
