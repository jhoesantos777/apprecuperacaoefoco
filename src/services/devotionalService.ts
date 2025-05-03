interface Devotional {
  title: string;
  verse: string;
  reference: string;
  message: string;
  date: string;
}

const CACHE_KEY = 'dailyDevotional';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas em milissegundos

const BIBLE_VERSES = [
  {
    verse: "Porque para Deus nada é impossível.",
    reference: "Lucas 1:37",
    themes: ["Fé", "Milagres", "Esperança"]
  },
  {
    verse: "Tudo posso naquele que me fortalece.",
    reference: "Filipenses 4:13",
    themes: ["Força", "Superação", "Confiança"]
  },
  {
    verse: "O Senhor é meu pastor, nada me faltará.",
    reference: "Salmos 23:1",
    themes: ["Provisão", "Cuidado", "Segurança"]
  },
  {
    verse: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.",
    reference: "Mateus 11:28",
    themes: ["Descanso", "Alívio", "Conforto"]
  },
  {
    verse: "Mas os que esperam no Senhor renovarão as suas forças.",
    reference: "Isaías 40:31",
    themes: ["Renovação", "Paciência", "Força"]
  },
  {
    verse: "O Senhor é a minha luz e a minha salvação; de quem terei medo?",
    reference: "Salmos 27:1",
    themes: ["Coragem", "Proteção", "Confiança"]
  },
  {
    verse: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá.",
    reference: "João 14:27",
    themes: ["Paz", "Conforto", "Segurança"]
  },
  {
    verse: "O Senhor é meu refúgio e fortaleza, socorro bem presente na angústia.",
    reference: "Salmos 46:1",
    themes: ["Proteção", "Força", "Conforto"]
  },
  {
    verse: "Esperei com paciência pelo Senhor, e ele se inclinou para mim e ouviu o meu clamor.",
    reference: "Salmos 40:1",
    themes: ["Paciência", "Oração", "Resposta"]
  }
];

const THEME_TITLES = {
  "Fé": ["Fé que Move Montanhas", "Confiança Inabalável", "Crer é Ver"],
  "Milagres": ["Milagres do Cotidiano", "O Poder do Impossível", "Sinais de Esperança"],
  "Esperança": ["Esperança Renovada", "Um Novo Amanhã", "Luz no Caminho"],
  "Força": ["Força Interior", "Superando Limites", "Vencendo Desafios"],
  "Superação": ["Rumo à Vitória", "Além dos Obstáculos", "Conquistando Metas"],
  "Confiança": ["Confiança Total", "Firme na Promessa", "Segurança em Deus"],
  "Provisão": ["Cuidado Divino", "Nada nos Falta", "Bênçãos Diárias"],
  "Cuidado": ["Nos Cuidados de Deus", "Proteção Celestial", "Amor que Cuida"],
  "Segurança": ["Refúgio Seguro", "Proteção Eterna", "Abraço do Pai"],
  "Descanso": ["Paz Interior", "Descanso na Fé", "Renovação da Alma"],
  "Alívio": ["Alívio para a Alma", "Conforto Divino", "Cura Interior"],
  "Conforto": ["Conforto Celestial", "Abraço do Pai", "Paz que Acalma"],
  "Renovação": ["Renovação Diária", "Vida Nova", "Transformação"],
  "Paciência": ["Espera com Fé", "Tempo de Deus", "Paciência que Vence"],
  "Coragem": ["Coragem para Vencer", "Força Interior", "Ousadia na Fé"],
  "Proteção": ["Escudo Divino", "Proteção Celestial", "Refúgio Seguro"],
  "Paz": ["Paz que Excede", "Tranquilidade Interior", "Serenidade da Alma"],
  "Oração": ["Poder da Oração", "Comunhão com Deus", "Diálogo com o Pai"],
  "Resposta": ["Deus Responde", "Ouvindo a Voz", "Sinais do Céu"]
};

const generateDevotionalMessage = (verse: string, reference: string, theme: string, title: string): string => {
  const messages = [
    `Hoje, vamos refletir sobre ${reference}. ${verse} Este versículo nos lembra que ${theme.toLowerCase()} é um presente de Deus para nós. Em meio às nossas lutas diárias, podemos encontrar ${theme.toLowerCase()} quando confiamos em Deus.`,
    `Que bela promessa encontramos em ${reference}: "${verse}" Este versículo nos ensina sobre ${theme.toLowerCase()}. Em nossa jornada, precisamos lembrar que Deus está sempre conosco, oferecendo ${theme.toLowerCase()} em cada momento.`,
    `Reflita hoje sobre ${reference}: "${verse}" Este versículo nos fala sobre ${theme.toLowerCase()}. Em um mundo cheio de desafios, podemos encontrar ${theme.toLowerCase()} quando nos aproximamos de Deus.`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

export const devotionalService = {
  async getDailyDevotional(): Promise<Devotional> {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { devotional, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      if (now - timestamp < CACHE_DURATION) {
        return devotional;
      }
    }

    return this.generateNewDevotional();
  },

  async generateNewDevotional(): Promise<Devotional> {
    try {
      // Selecionar versículo aleatório
      const randomVerse = BIBLE_VERSES[Math.floor(Math.random() * BIBLE_VERSES.length)];
      
      // Selecionar tema aleatório do versículo
      const randomTheme = randomVerse.themes[Math.floor(Math.random() * randomVerse.themes.length)];
      
      // Selecionar título aleatório para o tema
      const themeTitles = THEME_TITLES[randomTheme as keyof typeof THEME_TITLES];
      const randomTitle = themeTitles[Math.floor(Math.random() * themeTitles.length)];

      const message = generateDevotionalMessage(
        randomVerse.verse,
        randomVerse.reference,
        randomTheme,
        randomTitle
      );

      const devotional: Devotional = {
        title: randomTitle,
        verse: randomVerse.verse,
        reference: randomVerse.reference,
        message,
        date: new Date().toISOString().split('T')[0]
      };

      // Salvar no localStorage com timestamp
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        devotional,
        timestamp: Date.now()
      }));
      
      return devotional;
    } catch (error) {
      console.error('Erro ao gerar devocional:', error);
      throw error;
    }
  }
}; 