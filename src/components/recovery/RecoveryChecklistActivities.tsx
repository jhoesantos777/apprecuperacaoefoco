
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Progress } from '@/components/ui/progress';
import { registerActivity } from '@/utils/activityPoints';
import {
  Book,
  Pencil,
  Heart,
  Leaf,
  Music,
  Lightbulb,
  Home,
  BookOpen,
  Dumbbell,
  GlassWater,
  Utensils,
  Moon,
  Phone,
  Users,
  MessagesSquare,
  AlertCircle,
  HandHeart,
  HeartHandshake,
  Brain,
  Clock,
  Star,
  CircleCheck,
  MessageSquare
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

interface ActivityCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  bgColor: string;
  items: ChecklistItem[];
  type: string;
}

const RecoveryChecklistActivities = () => {
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define all the activity categories and their checklist items
  const activityCategories: ActivityCategory[] = [
    {
      id: 'mental-care',
      title: 'Cuidado Mental',
      description: 'Atividades para saúde mental e autodesenvolvimento',
      icon: Brain,
      bgColor: 'from-blue-600/10 to-indigo-600/10',
      type: 'Reflexão',
      items: [
        {
          id: 'daily-reading',
          label: 'Leitura diária de livros ou artigos',
          description: 'Dediquei 10 minutos para leitura sobre crescimento pessoal ou autocontrole',
          icon: Book
        },
        {
          id: 'reflection-notebook',
          label: 'Anotar pensamentos e aprendizados',
          description: 'Registrei reflexões no caderno (ao acordar ou antes de dormir)',
          icon: Pencil
        },
        {
          id: 'meditation-practice',
          label: 'Praticar meditação ou atenção plena',
          description: 'Pratiquei 5-10 minutos de meditação com app gratuito',
          icon: Brain
        },
        {
          id: 'limit-social-media',
          label: 'Evitar consumo excessivo de redes sociais',
          description: 'Respeitei o limite diário de uso de redes sociais',
          icon: AlertCircle
        },
        {
          id: 'educational-videos',
          label: 'Assistir vídeos sobre inteligência emocional',
          description: 'Vi conteúdos sobre autocuidado e desenvolvimento emocional',
          icon: Brain
        }
      ]
    },
    {
      id: 'spirituality',
      title: 'Espiritualidade',
      description: 'Práticas de conexão e propósito espiritual',
      icon: Heart,
      bgColor: 'from-purple-600/10 to-indigo-600/10',
      type: 'Devocional',
      items: [
        {
          id: 'gratitude-practice',
          label: 'Prática de gratidão ao acordar',
          description: 'Listei 3 coisas boas do dia anterior',
          icon: Heart
        },
        {
          id: 'nature-walks',
          label: 'Caminhadas em silêncio na natureza',
          description: 'Dediquei tempo para contemplação e conexão interior na natureza',
          icon: Leaf
        },
        {
          id: 'peaceful-music',
          label: 'Ouvir músicas que tragam paz',
          description: 'Ouvi músicas que inspiram e trazem propósito',
          icon: Music
        },
        {
          id: 'value-reflection',
          label: 'Refletir sobre valores e propósito',
          description: 'Refleti sobre o que realmente importa para mim',
          icon: Lightbulb
        },
        {
          id: 'calm-space',
          label: 'Criar um espaço de calma',
          description: 'Criei ou mantive um espaço simbólico de paz em casa',
          icon: Home
        }
      ]
    },
    {
      id: 'body-health',
      title: 'Corpo e Saúde',
      description: 'Práticas para bem-estar físico e saúde',
      icon: Dumbbell,
      bgColor: 'from-green-600/10 to-teal-600/10',
      type: 'Exercício',
      items: [
        {
          id: 'daily-walks',
          label: 'Caminhadas diárias de 30 minutos',
          description: 'Caminhei em ritmo leve ou moderado',
          icon: BookOpen
        },
        {
          id: 'home-exercises',
          label: 'Exercícios físicos em casa',
          description: 'Pratiquei exercícios (treino funcional, yoga, alongamento)',
          icon: Dumbbell
        },
        {
          id: 'hydration',
          label: 'Beber ao menos 2 litros de água',
          description: 'Bebi água suficiente e evitei excesso de café/açúcar',
          icon: GlassWater
        },
        {
          id: 'healthy-meals',
          label: 'Planejar refeições simples e saudáveis',
          description: 'Me alimentei com refeições balanceadas',
          icon: Utensils
        },
        {
          id: 'sleep-routine',
          label: 'Dormir e acordar nos mesmos horários',
          description: 'Mantive uma rotina regular de sono',
          icon: Moon
        }
      ]
    },
    {
      id: 'relationships',
      title: 'Relacionamentos e Conexão',
      description: 'Construindo e mantendo vínculos saudáveis',
      icon: Users,
      bgColor: 'from-pink-600/10 to-rose-600/10',
      type: 'Família',
      items: [
        {
          id: 'trusted-contact',
          label: 'Contato com pessoa de confiança',
          description: 'Conversei com alguém de confiança hoje',
          icon: Phone
        },
        {
          id: 'healthy-groups',
          label: 'Participar de grupos sociais saudáveis',
          description: 'Participei de atividade em grupo positiva',
          icon: Users
        },
        {
          id: 'active-listening',
          label: 'Praticar escuta ativa',
          description: 'Me comuniquei com clareza e ouvi com atenção',
          icon: MessageSquare
        },
        {
          id: 'avoid-triggers',
          label: 'Evitar ambientes e pessoas de risco',
          description: 'Evitei conscientemente situações que favoreçam recaídas',
          icon: AlertCircle
        },
        {
          id: 'help-someone',
          label: 'Ajudar alguém da família ou vizinhança',
          description: 'Pratiquei um ato de solidariedade',
          icon: HandHeart
        }
      ]
    },
    {
      id: 'active-recovery',
      title: 'Recuperação Ativa',
      description: 'Estratégias para fortalecer a recuperação',
      icon: Star,
      bgColor: 'from-orange-600/10 to-amber-600/10',
      type: 'HojeNãoVouUsar',
      items: [
        {
          id: 'support-meetings',
          label: 'Participar de grupos de apoio',
          description: 'Fui a reunião de apoio (NA, AA, Celebrate Recovery, etc)',
          icon: Users
        },
        {
          id: 'recovery-mentor',
          label: 'Conversar com padrinho/referência',
          description: 'Conversei com alguém que me apoia na recuperação',
          icon: HeartHandshake
        },
        {
          id: 'daily-journal',
          label: 'Registro diário de fortalezas e desafios',
          description: 'Anotei "o que me fortaleceu hoje e o que foi desafio"',
          icon: Pencil
        },
        {
          id: 'avoid-testing-limits',
          label: 'Evitar "testar os limites"',
          description: 'Lembrei diariamente do porquê da sobriedade',
          icon: AlertCircle
        },
        {
          id: 'recovery-content',
          label: 'Conteúdo sobre recuperação',
          description: 'Assisti/li sobre dependência e recuperação',
          icon: BookOpen
        }
      ]
    },
    {
      id: 'emotional',
      title: 'Emocionais',
      description: 'Identificação e manejo de emoções',
      icon: Heart,
      bgColor: 'from-yellow-600/10 to-amber-600/10',
      type: 'Humor',
      items: [
        {
          id: 'identify-emotions',
          label: 'Reconhecer e nomear emoções',
          description: 'Identifiquei conscientemente o que senti hoje',
          icon: Heart
        },
        {
          id: 'breathing-technique',
          label: 'Respiração profunda ou técnica 5-5-5',
          description: 'Pratiquei respiração consciente (inspirar 5s, segurar 5s, expirar 5s)',
          icon: Brain
        },
        {
          id: 'artistic-activities',
          label: 'Atividades artísticas simples',
          description: 'Desenhar, escrever poesia, pintar ou tocar instrumento',
          icon: Lightbulb
        },
        {
          id: 'seek-help',
          label: 'Evitar isolamento e buscar ajuda',
          description: 'Busquei apoio ao sentir tristeza, ansiedade ou irritação',
          icon: HandHeart
        },
        {
          id: 'self-care-time',
          label: 'Tempo de autocuidado semanal',
          description: 'Dediquei tempo para cuidar de mim (banho relaxante, organizar ambiente)',
          icon: Heart
        }
      ]
    }
  ];

  const totalActivities = activityCategories.reduce((sum, category) => sum + category.items.length, 0);
  const totalSelectedActivities = selectedActivities.length;
  const progressPercentage = (totalSelectedActivities / totalActivities) * 100;

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId);
      } else {
        return [...prev, activityId];
      }
    });
  };

  const findActivityCategory = (activityId: string) => {
    for (const category of activityCategories) {
      const item = category.items.find(item => item.id === activityId);
      if (item) {
        return { category, item };
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    if (selectedActivities.length === 0) {
      toast("Por favor, selecione pelo menos uma atividade");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Group activities by category for efficient processing
      const activitiesByCategory = new Map<string, number>();
      
      for (const activityId of selectedActivities) {
        const result = findActivityCategory(activityId);
        if (result) {
          const { category } = result;
          const currentPoints = activitiesByCategory.get(category.type) || 0;
          activitiesByCategory.set(category.type, currentPoints + 1);
        }
      }

      // Register activity points for each category
      const registerPromises = Array.from(activitiesByCategory.entries()).map(
        ([categoryType, points]) => registerActivity(categoryType as any, points, `Atividades de ${categoryType}`)
      );

      await Promise.all(registerPromises);
      
      const totalPoints = selectedActivities.length;
      
      toast.success(`Parabéns! Você registrou ${totalPoints} atividades e ganhou ${totalPoints} pontos!`);
      setSelectedActivities([]);
    } catch (error) {
      console.error('Erro ao registrar atividades:', error);
      toast.error("Não foi possível registrar as atividades");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 rounded-xl p-6 text-white backdrop-blur-sm border border-white/10">
        <h2 className="text-2xl font-bold mb-2">Lista de Atividades para Recuperação</h2>
        <p className="opacity-80">Selecione as atividades que você realizou hoje. Cada atividade vale 1 ponto.</p>
        
        <div className="mt-6 bg-white/10 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-sm">Progresso</span>
            <span className="text-sm">{totalSelectedActivities}/{totalActivities} atividades</span>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-white/20" />
        </div>
      </div>

      <div className="space-y-8">
        {activityCategories.map((category) => (
          <motion.div 
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm shadow-md"
          >
            <div className={`p-4 bg-gradient-to-r ${category.bgColor} flex items-center gap-3`}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/20">
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{category.title}</h3>
                <p className="text-sm text-white/80">{category.description}</p>
              </div>
            </div>

            <div className="bg-white/5 p-4 divide-y divide-white/10">
              {category.items.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id={item.id}
                      checked={selectedActivities.includes(item.id)}
                      onCheckedChange={() => handleActivityToggle(item.id)}
                      className="mt-1 h-5 w-5 border-2 text-primary border-white/30"
                    />
                    <div className="space-y-1">
                      <label htmlFor={item.id} className="text-base font-medium text-white cursor-pointer">
                        {item.label}
                      </label>
                      <p className="text-sm text-white/70">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="sticky bottom-4 flex justify-center mt-8"
      >
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || selectedActivities.length === 0}
          size="lg"
          className="px-10 py-6 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full shadow-lg"
        >
          <CircleCheck className="mr-2 h-6 w-6" />
          {isSubmitting 
            ? "Enviando..." 
            : `Concluir e Somar (${selectedActivities.length} pontos)`}
        </Button>
      </motion.div>
    </div>
  );
};

export default RecoveryChecklistActivities;
