
import React from 'react';
import { Alert } from '@/components/ui/alert';
import { AlertTriangle, Check, CircleAlert, Flag, CheckCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ScoreBreakdown {
  taskPoints: number;
  moodPoints: number;
  devotionalPoints: number;
  sobrietyPoints: number;
  triggerPoints: number;
}

interface ThermometerProps {
  score: number;
  hasMultipleTriggers: boolean;
  details?: ScoreBreakdown;
}

const RecoveryThermometer = ({ score, hasMultipleTriggers, details }: ThermometerProps) => {
  const getStatus = () => {
    if (score >= 6) return { 
      level: 'Seguro', 
      color: 'bg-green-500', 
      textColor: 'text-green-500',
      bgColor: 'bg-green-50',
      icon: CheckCircle 
    };
    if (score >= 3) return { 
      level: 'Em atenção', 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      icon: Flag 
    };
    if (score >= 1) return { 
      level: 'Vulnerável', 
      color: 'bg-orange-500', 
      textColor: 'text-orange-500',
      bgColor: 'bg-orange-50',
      icon: AlertTriangle 
    };
    return { 
      level: 'Em risco', 
      color: 'bg-red-500', 
      textColor: 'text-red-500',
      bgColor: 'bg-red-50',
      icon: AlertCircle 
    };
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
        <status.icon className={cn("w-12 h-12", status.textColor)} />
        <div>
          <h3 className="font-semibold text-xl">{status.level}</h3>
          <p className="text-lg text-gray-500">Pontuação: {score}/10</p>
        </div>
      </div>

      <Card className={cn("p-4", status.bgColor)}>
        <div className="space-y-4">
          <Progress 
            value={progressPercentage} 
            className={cn("h-4 rounded-full", status.color)} 
          />
          <p className="text-lg font-medium">{getMessage()}</p>
        </div>
      </Card>

      {details && (
        <Card className="p-4 space-y-3">
          <h4 className="font-semibold text-lg">Detalhes da Pontuação</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>✅ Tarefas completadas</span>
              <span>+{details.taskPoints}</span>
            </div>
            <div className="flex justify-between">
              <span>😊 Humor do dia</span>
              <span>+{details.moodPoints}</span>
            </div>
            <div className="flex justify-between">
              <span>🙏 Devocional</span>
              <span>+{details.devotionalPoints}</span>
            </div>
            <div className="flex justify-between">
              <span>🚨 Declaração de sobriedade</span>
              <span>+{details.sobrietyPoints}</span>
            </div>
            {details.triggerPoints < 0 && (
              <div className="flex justify-between text-red-500">
                <span>⚠️ Gatilhos registrados</span>
                <span>{details.triggerPoints}</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {(score < 3 || hasMultipleTriggers) && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <p className="font-medium">Alerta de Risco</p>
          <p>Você está precisando de apoio. Não hesite em buscar ajuda.</p>
          <Button 
            className="w-full mt-2 bg-red-600 hover:bg-red-700"
            onClick={() => window.location.href = '/support'}
          >
            Preciso de ajuda agora
          </Button>
        </Alert>
      )}
    </div>
  );
};

export default RecoveryThermometer;
