
import React from 'react';
import { Alert } from '@/components/ui/alert';
import { AlertTriangle, Check, CircleAlert, Flag, CheckCircle, AlertCircle, Gauge } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ScoreBreakdown {
  taskPoints: number;
  moodPoints: number;
  devotionalPoints: number;
  sobrietyPoints: number;
  reflectionPoints: number;
}

interface ThermometerProps {
  score: number;
  hasMultipleTriggers: boolean;
  details?: ScoreBreakdown;
}

const RecoveryThermometer = ({ score, hasMultipleTriggers, details }: ThermometerProps) => {
  const getStatus = () => {
    if (score >= 7) return { 
      level: 'Zona Saudável', 
      color: 'bg-green-500', 
      textColor: 'text-green-500',
      bgColor: 'bg-green-50',
      icon: CheckCircle 
    };
    if (score >= 4) return { 
      level: 'Zona de Atenção', 
      color: 'bg-yellow-500', 
      textColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      icon: Flag 
    };
    return { 
      level: 'Zona Crítica', 
      color: 'bg-red-500', 
      textColor: 'text-red-500',
      bgColor: 'bg-red-50',
      icon: AlertCircle 
    };
  };

  const getMessage = () => {
    if (score >= 7) return "Continue assim! Você está mantendo um excelente equilíbrio hoje.";
    if (score >= 4) return "Atenção! Que tal reforçar algumas atividades de recuperação?";
    return "Momento delicado. A recaída começa no pensamento. Busque ajuda agora.";
  };

  const status = getStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20">
          <Gauge className={cn("w-8 h-8", status.textColor)} />
        </div>
        <div>
          <h3 className="font-semibold text-xl">{status.level}</h3>
          <p className="text-lg text-gray-500">Pontuação: {score}/10</p>
        </div>
      </div>

      <Card className={cn("p-4", status.bgColor)}>
        <div className="space-y-4">
          <Progress 
            value={score * 10} 
            className={cn("h-4 rounded-full", status.color)} 
          />
          <p className="text-lg font-medium">{getMessage()}</p>
        </div>
      </Card>

      {details && (
        <Card className="p-4 space-y-3 bg-white/5 backdrop-blur-sm">
          <h4 className="font-semibold text-lg">Detalhes da Pontuação</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>✅ Tarefas completadas ({details.taskPoints}/27)</span>
              <span>+{details.taskPoints}</span>
            </div>
            <div className="flex justify-between">
              <span>😊 Humor do dia (0-5)</span>
              <span>+{details.moodPoints}</span>
            </div>
            <div className="flex justify-between">
              <span>🙏 Devocional (0-2)</span>
              <span>+{details.devotionalPoints}</span>
            </div>
            <div className="flex justify-between">
              <span>🚨 Hoje Eu Não Vou Usar (0-5)</span>
              <span>+{details.sobrietyPoints}</span>
            </div>
            <div className="flex justify-between">
              <span>📝 Reflexão do Dia (0-3)</span>
              <span>+{details.reflectionPoints}</span>
            </div>
            <div className="h-px bg-gray-200 my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>
                {(details.taskPoints + details.moodPoints + details.devotionalPoints + 
                  details.sobrietyPoints + details.reflectionPoints)}/42
              </span>
            </div>
          </div>
        </Card>
      )}

      {(score < 4 || hasMultipleTriggers) && (
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
