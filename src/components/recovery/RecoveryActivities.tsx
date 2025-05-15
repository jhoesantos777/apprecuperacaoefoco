
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/sonner';
import { 
  Book, 
  Heart, 
  Users, 
  Calendar, 
  BookOpen, 
  Music, 
  Dumbbell, 
  Smile, 
  Star, 
  Brain,
  Utensils,
  Moon, 
  GlassWater, 
  HandHeart, 
  MessagesSquare,
  HeartHandshake,
  Book as BookIcon,
  Clock,
  Lightbulb,
  MessageSquare
} from 'lucide-react';
import { registerActivity } from '@/utils/activityPoints';

interface ActivityOption {
  id: string;
  label: string;
  description: string;
  points: number;
}

type ActivityCategory = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  activities: ActivityOption[];
  type: 'Reflexão' | 'Devocional' | 'Tarefas' | 'Humor' | 'HojeNãoVouUsar' | 'Gatilho' | 'Exercício' | 'Família';
};

const RecoveryActivities = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: ActivityCategory[] = [
    {
      id: 'mindfulness',
      title: 'Reflexão e Mindfulness',
      description: 'Atividades que promovem a consciência plena e autoconhecimento',
      icon: Brain,
      color: 'bg-purple-500',
      type: 'Reflexão',
      activities: [
        { 
          id: 'journal', 
          label: 'Diário de Recuperação', 
          description: 'Escrevi no meu diário hoje sobre meus pensamentos e sentimentos', 
          points: 3 
        },
        { 
          id: 'meditation', 
          label: 'Meditação Consciente', 
          description: 'Pratiquei 10+ minutos de meditação ou respiração consciente', 
          points: 3 
        },
        { 
          id: 'gratitude', 
          label: 'Gratidão', 
          description: 'Listei pelo menos 3 coisas pelas quais sou grato hoje', 
          points: 2 
        },
        { 
          id: 'triggers', 
          label: 'Análise de Gatilhos', 
          description: 'Identifiquei e refleti sobre meus gatilhos e como lidar com eles', 
          points: 4 
        },
        { 
          id: 'mindful-walk', 
          label: 'Caminhada Consciente', 
          description: 'Fiz uma caminhada prestando atenção às sensações e ao ambiente', 
          points: 2 
        },
        { 
          id: 'values', 
          label: 'Reflexão sobre Valores', 
          description: 'Refleti sobre meus valores e como alinhá-los com minhas ações', 
          points: 3 
        }
      ]
    },
    {
      id: 'spiritual',
      title: 'Espiritualidade',
      description: 'Conexão com sua dimensão espiritual e propósito maior',
      icon: BookOpen,
      color: 'bg-blue-500',
      type: 'Devocional',
      activities: [
        { 
          id: 'prayer', 
          label: 'Oração/Meditação', 
          description: 'Dediquei tempo à oração ou prática espiritual', 
          points: 3 
        },
        { 
          id: 'reading', 
          label: 'Leitura Espiritual', 
          description: 'Li textos inspiradores ou sagrados', 
          points: 2 
        },
        { 
          id: 'community', 
          label: 'Comunidade de Fé', 
          description: 'Participei de um grupo ou comunidade espiritual', 
          points: 4 
        },
        { 
          id: 'service', 
          label: 'Serviço ao Próximo', 
          description: 'Ajudei alguém ou pratiquei um ato de bondade', 
          points: 3 
        },
        { 
          id: 'spiritual-reflection', 
          label: 'Reflexão Espiritual', 
          description: 'Refleti sobre meu propósito e sentido na vida', 
          points: 3 
        },
        { 
          id: 'forgiveness', 
          label: 'Perdão', 
          description: 'Pratiquei o perdão a mim mesmo ou a outros', 
          points: 4 
        }
      ]
    },
    {
      id: 'physical',
      title: 'Saúde Física',
      description: 'Cuidados com seu corpo e saúde física',
      icon: Dumbbell,
      color: 'bg-green-500',
      type: 'Exercício',
      activities: [
        { 
          id: 'exercise', 
          label: 'Exercício Físico', 
          description: 'Fiz pelo menos 20 minutos de atividade física', 
          points: 3 
        },
        { 
          id: 'nutrition', 
          label: 'Alimentação Balanceada', 
          description: 'Fiz refeições saudáveis e equilibradas hoje', 
          points: 2 
        },
        { 
          id: 'sleep', 
          label: 'Sono Adequado', 
          description: 'Dormi pelo menos 7 horas na noite passada', 
          points: 2 
        },
        { 
          id: 'hydration', 
          label: 'Hidratação', 
          description: 'Bebi pelo menos 2 litros de água hoje', 
          points: 1 
        },
        { 
          id: 'outdoor', 
          label: 'Atividade ao Ar Livre', 
          description: 'Passei tempo ao ar livre em contato com a natureza', 
          points: 2 
        },
        { 
          id: 'relaxation', 
          label: 'Técnicas de Relaxamento', 
          description: 'Pratiquei técnicas corporais de relaxamento', 
          points: 2 
        }
      ]
    },
    {
      id: 'social',
      title: 'Conexões Sociais',
      description: 'Cultivando relacionamentos saudáveis',
      icon: Users,
      color: 'bg-pink-500',
      type: 'Família',
      activities: [
        { 
          id: 'support-group', 
          label: 'Grupo de Apoio', 
          description: 'Participei de um grupo de apoio à recuperação', 
          points: 5 
        },
        { 
          id: 'healthy-contact', 
          label: 'Contato Saudável', 
          description: 'Conversei com alguém que apoia minha recuperação', 
          points: 3 
        },
        { 
          id: 'boundaries', 
          label: 'Limites Saudáveis', 
          description: 'Estabeleci ou mantive limites com pessoas em minha vida', 
          points: 4 
        },
        { 
          id: 'family-time', 
          label: 'Tempo em Família', 
          description: 'Passei tempo de qualidade com minha família', 
          points: 3 
        },
        { 
          id: 'community-activity', 
          label: 'Atividade Comunitária', 
          description: 'Participei de uma atividade ou evento comunitário', 
          points: 3 
        },
        { 
          id: 'sponsor-talk', 
          label: 'Conversa com Padrinho/Madrinha', 
          description: 'Conversei com meu padrinho/madrinha de recuperação', 
          points: 4 
        }
      ]
    },
    {
      id: 'emotional',
      title: 'Bem-estar Emocional',
      description: 'Regulando emoções de forma saudável',
      icon: Heart,
      color: 'bg-yellow-500',
      type: 'Humor',
      activities: [
        { 
          id: 'emotion-awareness', 
          label: 'Consciência Emocional', 
          description: 'Identifiquei e nomeei minhas emoções hoje', 
          points: 2 
        },
        { 
          id: 'self-care', 
          label: 'Autocuidado', 
          description: 'Pratiquei uma atividade específica de autocuidado', 
          points: 3 
        },
        { 
          id: 'relax', 
          label: 'Relaxamento', 
          description: 'Dediquei tempo para relaxar e reduzir o estresse', 
          points: 2 
        },
        { 
          id: 'creative', 
          label: 'Expressão Criativa', 
          description: 'Me expressei através de arte, música ou outra forma criativa', 
          points: 3 
        },
        { 
          id: 'therapy-session', 
          label: 'Sessão Terapêutica', 
          description: 'Participei de uma sessão de terapia ou aconselhamento', 
          points: 4 
        },
        { 
          id: 'affirmations', 
          label: 'Afirmações Positivas', 
          description: 'Pratiquei afirmações positivas para fortalecer minha autoestima', 
          points: 2 
        }
      ]
    },
    {
      id: 'commitment',
      title: 'Compromisso com a Sobriedade',
      description: 'Reforçando seu compromisso diário',
      icon: Star,
      color: 'bg-red-500',
      type: 'HojeNãoVouUsar',
      activities: [
        { 
          id: 'daily-pledge', 
          label: 'Compromisso Diário', 
          description: 'Reafirmei meu compromisso: "Hoje eu não vou usar"', 
          points: 5 
        },
        { 
          id: 'avoid-triggers', 
          label: 'Evitar Gatilhos', 
          description: 'Evitei conscientemente situações ou pessoas de risco', 
          points: 4 
        },
        { 
          id: 'coping-skills', 
          label: 'Habilidades de Enfrentamento', 
          description: 'Utilizei estratégias saudáveis para lidar com desejos/vontades', 
          points: 4 
        },
        { 
          id: 'celebrate', 
          label: 'Celebrar Progressos', 
          description: 'Celebrei um marco ou progresso na minha recuperação', 
          points: 3 
        },
        { 
          id: 'replacement-activities', 
          label: 'Atividades Substitutivas', 
          description: 'Substitui o desejo de usar por uma atividade saudável', 
          points: 4 
        },
        { 
          id: 'relapse-prevention', 
          label: 'Prevenção de Recaída', 
          description: 'Revisei e atualizei meu plano de prevenção de recaída', 
          points: 5 
        }
      ]
    },
    {
      id: 'intellectual',
      title: 'Desenvolvimento Intelectual',
      description: 'Estimulando a mente de forma construtiva',
      icon: BookIcon,
      color: 'bg-indigo-500',
      type: 'Tarefas',
      activities: [
        { 
          id: 'learning', 
          label: 'Aprendizado', 
          description: 'Aprendi algo novo relacionado aos meus interesses ou objetivos', 
          points: 3 
        },
        { 
          id: 'reading', 
          label: 'Leitura', 
          description: 'Li um livro ou artigo que contribui para meu crescimento', 
          points: 2 
        },
        { 
          id: 'course', 
          label: 'Curso ou Estudo', 
          description: 'Dediquei tempo a estudos ou um curso que estou fazendo', 
          points: 3 
        },
        { 
          id: 'hobby', 
          label: 'Hobby Construtivo', 
          description: 'Pratiquei um hobby que estimula minhas habilidades cognitivas', 
          points: 2 
        },
        { 
          id: 'recovery-education', 
          label: 'Educação sobre Recuperação', 
          description: 'Aprendi mais sobre dependência, recuperação e saúde mental', 
          points: 3 
        },
        { 
          id: 'problem-solving', 
          label: 'Resolução de Problemas', 
          description: 'Abordei um problema ou desafio de forma construtiva', 
          points: 3 
        }
      ]
    },
    {
      id: 'professional',
      title: 'Desenvolvimento Profissional',
      description: 'Construindo uma vida profissional estável',
      icon: Clock,
      color: 'bg-cyan-500',
      type: 'Tarefas',
      activities: [
        { 
          id: 'work-goals', 
          label: 'Metas Profissionais', 
          description: 'Estabeleci ou trabalhei em direção a objetivos profissionais', 
          points: 3 
        },
        { 
          id: 'skill-building', 
          label: 'Desenvolvimento de Habilidades', 
          description: 'Aprendi ou pratiquei habilidades relevantes para minha carreira', 
          points: 3 
        },
        { 
          id: 'work-consistency', 
          label: 'Consistência no Trabalho', 
          description: 'Mantive um compromisso consistente com minhas responsabilidades', 
          points: 4 
        },
        { 
          id: 'work-balance', 
          label: 'Equilíbrio Trabalho-Vida', 
          description: 'Mantive um equilíbrio saudável entre trabalho e vida pessoal', 
          points: 3 
        },
        { 
          id: 'networking', 
          label: 'Networking Profissional', 
          description: 'Construí ou mantive conexões profissionais positivas', 
          points: 2 
        },
        { 
          id: 'financial-health', 
          label: 'Saúde Financeira', 
          description: 'Tomei decisões financeiras responsáveis alinhadas com minha recuperação', 
          points: 3 
        }
      ]
    },
    {
      id: 'leisure',
      title: 'Lazer e Diversão Saudável',
      description: 'Encontrando prazer em atividades sem substâncias',
      icon: Smile,
      color: 'bg-emerald-500',
      type: 'Humor',
      activities: [
        { 
          id: 'nature-time', 
          label: 'Tempo na Natureza', 
          description: 'Passei tempo em um ambiente natural (parque, praia, etc.)', 
          points: 2 
        },
        { 
          id: 'creative-hobby', 
          label: 'Hobby Criativo', 
          description: 'Dediquei tempo a um hobby criativo que me dá prazer', 
          points: 3 
        },
        { 
          id: 'clean-fun', 
          label: 'Diversão Sóbria', 
          description: 'Participei de uma atividade divertida sem o uso de substâncias', 
          points: 3 
        },
        { 
          id: 'laughter', 
          label: 'Risadas e Humor', 
          description: 'Encontrei momentos de riso e leveza em meu dia', 
          points: 2 
        },
        { 
          id: 'new-experience', 
          label: 'Nova Experiência', 
          description: 'Experimentei uma nova atividade saudável que trouxe satisfação', 
          points: 3 
        },
        { 
          id: 'music-dance', 
          label: 'Música e Dança', 
          description: 'Me conectei com música ou dança de forma positiva', 
          points: 2 
        }
      ]
    },
    {
      id: 'communication',
      title: 'Comunicação e Relacionamentos',
      description: 'Desenvolvendo interações saudáveis e assertivas',
      icon: MessageSquare,
      color: 'bg-orange-500',
      type: 'Família',
      activities: [
        { 
          id: 'assertive-comm', 
          label: 'Comunicação Assertiva', 
          description: 'Me comuniquei de forma clara e assertiva em uma situação desafiadora', 
          points: 4 
        },
        { 
          id: 'active-listen', 
          label: 'Escuta Ativa', 
          description: 'Pratiquei escuta ativa em uma conversa importante', 
          points: 3 
        },
        { 
          id: 'conflict-resolution', 
          label: 'Resolução de Conflitos', 
          description: 'Abordei um conflito de forma construtiva e respeitosa', 
          points: 4 
        },
        { 
          id: 'honesty', 
          label: 'Honestidade', 
          description: 'Pratiquei honestidade em minhas interações, evitando mentiras', 
          points: 3 
        },
        { 
          id: 'apology', 
          label: 'Pedido de Desculpas', 
          description: 'Pedi desculpas sinceramente quando necessário', 
          points: 3 
        },
        { 
          id: 'gratitude-express', 
          label: 'Expressão de Gratidão', 
          description: 'Expressei gratidão a alguém que me apoia', 
          points: 2 
        }
      ]
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    setSelectedActivity(null);
  };

  const handleActivitySelect = (activityId: string) => {
    setSelectedActivity(activityId);
  };

  const getSelectedActivityDetails = () => {
    if (!selectedCategory || !selectedActivity) return null;
    
    const category = categories.find(c => c.id === selectedCategory);
    if (!category) return null;
    
    const activity = category.activities.find(a => a.id === selectedActivity);
    return activity ? { ...activity, category } : null;
  };

  const handleSubmit = async () => {
    const details = getSelectedActivityDetails();
    if (!details) {
      toast("Por favor, selecione uma atividade");
      return;
    }

    try {
      setIsSubmitting(true);
      await registerActivity(
        details.category.type, 
        details.points, 
        details.label
      );
      
      toast.success(`Parabéns! Você ganhou ${details.points} pontos por "${details.label}"`);
      setSelectedActivity(null);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Erro ao registrar atividade:', error);
      toast.error("Não foi possível registrar a atividade");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">Jornada de Recuperação</h2>
          <p className="text-xl text-white/80 mt-2">Registre suas atividades diárias para fortalecer sua recuperação</p>
        </motion.div>
      
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = category.id === selectedCategory;

            return (
              <motion.div
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategorySelect(category.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card 
                  className={`p-4 cursor-pointer transition-all duration-300 border ${
                    isSelected ? 'border-white shadow-glow' : 'border-white/20'
                  } bg-white/10 backdrop-blur-sm hover:bg-white/20`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${category.color} bg-opacity-90 flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{category.title}</h3>
                      <p className="text-xs text-white/70">{category.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-6"
          >
            <div className="text-white mb-4">
              <h3 className="text-xl font-bold mb-2">
                {categories.find(c => c.id === selectedCategory)?.title}
              </h3>
              <p className="text-white/80 text-sm">
                Selecione uma atividade que você realizou hoje:
              </p>
            </div>

            <RadioGroup 
              value={selectedActivity || ""} 
              onValueChange={handleActivitySelect}
              className="space-y-3"
            >
              {categories
                .find(c => c.id === selectedCategory)
                ?.activities.map(activity => (
                  <div 
                    key={activity.id} 
                    className={`flex items-start space-x-3 p-3 rounded-md transition-all ${
                      selectedActivity === activity.id 
                        ? 'bg-white/20 border border-white/40' 
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <RadioGroupItem 
                      value={activity.id} 
                      id={activity.id} 
                      className="mt-1"
                    />
                    <div className="flex-1 cursor-pointer" onClick={() => handleActivitySelect(activity.id)}>
                      <div className="flex justify-between">
                        <label htmlFor={activity.id} className="font-medium text-white cursor-pointer">
                          {activity.label}
                        </label>
                        <span className="text-sm font-semibold text-green-400">+{activity.points} pts</span>
                      </div>
                      <p className="text-sm text-white/70 mt-1">{activity.description}</p>
                    </div>
                  </div>
                ))
              }
            </RadioGroup>
            
            <Button
              onClick={handleSubmit}
              disabled={!selectedActivity || isSubmitting}
              className="w-full mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Atividade'}
            </Button>
          </motion.div>
        )}
      
        {!selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/80 mt-4"
          >
            <p>Selecione uma categoria para registrar suas atividades</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecoveryActivities;
