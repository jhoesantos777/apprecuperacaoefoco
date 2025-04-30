
import { Beer, PartyPopper, Users, Brain, Wallet, Moon, Cigarette, 
  Pill, HeartPulse, Home, Coffee, Angry, SquareX, Frown,
  MessageSquare, Clock, BadgeAlert, CloudRain } from "lucide-react";

export type TriggerType = {
  id: string;
  label: string;
  icon: typeof Beer;
  tip: string;
  category: "social" | "emocional" | "local" | "biologico" | "outros";
};

export const triggers: TriggerType[] = [
  // Gatilhos Sociais
  {
    id: "festas",
    label: "Festas",
    icon: PartyPopper,
    tip: "Planeje com antecedência uma desculpa para sair cedo ou recuse convites perigosos.",
    category: "social"
  },
  {
    id: "bares",
    label: "Bares",
    icon: Beer,
    tip: "Substitua o ambiente: vá a um cinema, parque ou cafeteria.",
    category: "social"
  },
  {
    id: "amigos",
    label: "Amigos que usam",
    icon: Users,
    tip: "Lembre-se: você está se protegendo. Mantenha distância até estar mais forte.",
    category: "social"
  },
  {
    id: "reunioes",
    label: "Reuniões sociais",
    icon: MessageSquare,
    tip: "Tenha sempre alguém de confiança ao seu lado que saiba do seu compromisso com a sobriedade.",
    category: "social"
  },

  // Gatilhos Emocionais
  {
    id: "estresse",
    label: "Estresse",
    icon: Brain,
    tip: "Pratique respiração profunda ou escreva o que está sentindo para aliviar.",
    category: "emocional"
  },
  {
    id: "raiva",
    label: "Raiva",
    icon: Angry,
    tip: "Antes de reagir, conte até 10 e faça exercícios físicos para liberar a tensão.",
    category: "emocional"
  },
  {
    id: "tristeza",
    label: "Tristeza",
    icon: Frown,
    tip: "Converse com alguém de confiança sobre seus sentimentos ou faça uma atividade que te alegre.",
    category: "emocional"
  },
  {
    id: "rejeicao",
    label: "Rejeição",
    icon: SquareX,
    tip: "Lembre-se que rejeição é uma experiência universal. Busque apoio com pessoas que te valorizam.",
    category: "emocional"
  },

  // Gatilhos Locais
  {
    id: "casa",
    label: "Locais antigos de uso",
    icon: Home,
    tip: "Evite passar por locais onde você costumava usar drogas ou beber até se sentir mais forte.",
    category: "local"
  },
  {
    id: "vendas",
    label: "Pontos de venda",
    icon: BadgeAlert,
    tip: "Planeje rotas alternativas para evitar passar por locais onde vendem drogas ou bebidas.",
    category: "local"
  },

  // Gatilhos Biológicos
  {
    id: "fome",
    label: "Fome",
    icon: Coffee,
    tip: "Mantenha lanches saudáveis por perto para não confundir fome com desejo por drogas.",
    category: "biologico"
  },
  {
    id: "insonia",
    label: "Insônia",
    icon: Moon,
    tip: "Evite telas antes de dormir e tente uma meditação guiada.",
    category: "biologico"
  },
  {
    id: "cansaco",
    label: "Cansaço físico",
    icon: Clock,
    tip: "Estabeleça uma rotina de sono regular e priorize o descanso adequado.",
    category: "biologico"
  },
  {
    id: "dor",
    label: "Dor física",
    icon: HeartPulse,
    tip: "Busque tratamentos alternativos para dor e consulte um médico regularmente.",
    category: "biologico"
  },

  // Outros Gatilhos
  {
    id: "financeiros",
    label: "Problemas financeiros",
    icon: Wallet,
    tip: "Busque apoio profissional ou um mentor para aconselhamento financeiro.",
    category: "outros"
  },
  {
    id: "clima",
    label: "Tempo/clima",
    icon: CloudRain,
    tip: "Tenha planos alternativos para dias de chuva ou quando o clima te deixa vulnerável.",
    category: "outros"
  },
  {
    id: "cheiro",
    label: "Cheiro de drogas",
    icon: Cigarette,
    tip: "Saia imediatamente do local e entre em contato com alguém da sua rede de apoio.",
    category: "outros"
  },
  {
    id: "remedio",
    label: "Medicamentos",
    icon: Pill,
    tip: "Informe seu médico sobre seu histórico e peça alternativas não-viciantes quando possível.",
    category: "outros"
  }
];

export const getCategoryTriggers = (category: string) => {
  return triggers.filter(trigger => trigger.category === category);
};

