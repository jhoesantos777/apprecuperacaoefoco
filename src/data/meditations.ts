
import { MeditationType } from "@/types/meditation";

export const meditations: MeditationType[] = [
  {
    id: "mindfulness",
    title: "Meditação de Atenção Plena (Mindfulness)",
    objective: "Aumentar a consciência do momento presente e reduzir a ansiedade",
    description: "Guiar o usuário a se concentrar nas sensações do corpo, na respiração e nos pensamentos sem julgá-los. Isso ajuda a reduzir o estresse e a viver no presente, sem se preocupar com o passado ou futuro.",
    duration: "10-15 minutos",
    benefits: [
      "Acalma a mente",
      "Melhora o foco",
      "Ajuda a evitar reações impulsivas"
    ]
  },
  {
    id: "breathing",
    title: "Meditação de Respiração Profunda",
    objective: "Reduzir a tensão física e mental por meio da respiração controlada",
    description: "Guiar o usuário a respirar profundamente (inspiração lenta e expiração prolongada) para acalmar o sistema nervoso. Esse processo pode ser feito com contagem de 4 segundos para a inspiração, seguidos de 4 segundos para a expiração.",
    duration: "5-10 minutos",
    benefits: [
      "Relaxa o corpo",
      "Diminui a ansiedade",
      "Melhora o controle emocional"
    ]
  }
  // ... Add other meditations similarly
];
