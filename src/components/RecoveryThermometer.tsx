
import React from 'react';
import { AlertTriangle, Check, CircleAlert, Flag } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThermometerProps {
  score: number;
  hasMultipleTriggers: boolean;
}

const RecoveryThermometer = ({ score, hasMultipleTriggers }: ThermometerProps) => {
  const getStatus = () => {
    if (score >= 6) return { level: 'Seguro', color: 'bg-green-500', icon: Check };
    if (score >= 3) return { level: 'Em atenção', color: 'bg-yellow-500', icon: Flag };
    if (score >= 1) return { level: 'Vulnerável', color: 'bg-orange-500', icon: AlertTriangle };
    return { level: 'Em risco', color: 'bg-red-500', icon: CircleAlert };
  };

  const getMessage = () => {
    if (score >= 6) return "Continue assim! Você está cuidando bem de si hoje.";
    if (score >= 3) return "Atenção aos detalhes. Que tal reforçar sua fé ou falar com alguém?";
    if (score >= 1) return "Dia desafiador. A recuperação precisa de apoio. Busque acolhimento.";
    return "Alerta de risco! A recaída começa no pensamento. Clique aqui e fale com alguém agora.";
  };

  const status = getStatus();
  const normalizedScore = Math.min(Math.max(score, 0), 10);
  const progressPercentage = (normalizedScore / 10) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <status.icon className={cn("w-8 h-8", 
          score >= 6 ? "text-green-500" :
          score >= 3 ? "text-yellow-500" :
          score >= 1 ? "text-orange-500" : "text-red-500"
        )} />
        <div>
          <h3 className="font-semibold text-lg">{status.level}</h3>
          <p className="text-sm text-gray-500">Pontuação: {score}/10</p>
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={progressPercentage} className={cn("h-3",
          status.color
        )} />
      </div>

      <div className={cn("p-4 rounded-lg",
        score >= 6 ? "bg-green-50 text-green-700" :
        score >= 3 ? "bg-yellow-50 text-yellow-700" :
        score >= 1 ? "bg-orange-50 text-orange-700" : "bg-red-50 text-red-700"
      )}>
        <p>{getMessage()}</p>
      </div>

      {(score < 3 || hasMultipleTriggers) && (
        <Button 
          className="w-full bg-red-600 hover:bg-red-700"
          onClick={() => window.location.href = '/support'}
        >
          Preciso de ajuda agora
        </Button>
      )}
    </div>
  );
};

export default RecoveryThermometer;
