
import { Trophy, Medal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Medal = {
  id: string;
  days_milestone: number;
};

export type SobrietyMedalsProps = {
  medals: Medal[];
  compact?: boolean;
  daysCount?: number;
  variant?: "sobriety" | "app";
};

export const SobrietyMedals = ({ 
  medals, 
  compact = false, 
  daysCount = 0, 
  variant = "sobriety" 
}: SobrietyMedalsProps) => {
  const getMedalColor = (days: number) => {
    if (days >= 365) return "text-yellow-400";
    if (days >= 180) return "text-purple-400";
    if (days >= 90) return "text-blue-400";
    if (days >= 30) return "text-green-400";
    return "text-gray-400";
  };

  const getMedalIcon = (days: number) => {
    if (days >= 365) return "🏆";
    if (days >= 180) return "🥇";
    if (days >= 90) return "🥈";
    if (days >= 30) return "🥉";
    return "🏅";
  };

  const getMedalName = (days: number) => {
    if (days >= 365) return "Troféu Anual";
    if (days >= 180) return "Medalha de Ouro";
    if (days >= 90) return "Medalha de Prata";
    if (days >= 30) return "Medalha de Bronze";
    return "Medalha Iniciante";
  };

  const getBadgeVariant = (days: number) => {
    if (variant === "sobriety") {
      if (days >= 365) return "gold";
      if (days >= 180) return "purple";
      if (days >= 90) return "blue";
      if (days >= 30) return "green";
      return "default";
    } else {
      if (days >= 365) return "diamond";
      if (days >= 180) return "platinum";
      if (days >= 90) return "silver";
      if (days >= 30) return "bronze";
      return "default";
    }
  };

  // Get the highest medal based on days count
  const getHighestMedal = () => {
    if (daysCount >= 365) return { days: 365, icon: "🏆" };
    if (daysCount >= 180) return { days: 180, icon: "🥇" };
    if (daysCount >= 90) return { days: 90, icon: "🥈" };
    if (daysCount >= 30) return { days: 30, icon: "🥉" };
    return { days: 0, icon: "🏅" };
  };

  const highestMedal = getHighestMedal();

  if (compact) {
    return (
      <div className="flex items-center">
        <Badge variant={getBadgeVariant(highestMedal.days)} size="lg" className="gap-1">
          <span className="text-lg">{highestMedal.icon}</span>
          <span className="ml-1 font-medium">{daysCount} dias</span>
        </Badge>
      </div>
    );
  }

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
