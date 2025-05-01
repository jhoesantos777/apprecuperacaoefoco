interface Message {
  role: 'user' | 'assistant';
  content: string;
  mood?: string;
}

interface MockApiResponse {
  message: string;
}

const getSystemPrompt = () => {
  return `Você é um psicólogo e conselheiro especializado em dependência química com vasta experiência. Suas respostas devem ser:
- Empáticas e sem julgamentos
- Baseadas em práticas comprovadas no tratamento de dependência
- Focadas na redução de danos e suporte à recuperação
- Em português
- Breves mas significativas (máx 4-5 frases)
- Com linguagem terapêutica especializada para dependência química
`;
}

// Keep track of conversation context
let conversationContext = {
  lastTopic: '',
  mentionedDrugs: [] as string[],
  mentionedEmotions: [] as string[],
  recoveryPhase: 'unknown', // unknown, early, middle, late
  sessionStartTime: new Date()
};

export const mockTalkToMeApi = async (
  messages: Message[]
): Promise<MockApiResponse> => {
  const userMessage = messages.filter(m => m.role === 'user').pop();
  const userContent = userMessage?.content || '';
  const userMood = userMessage?.mood || 'neutral';
  
  // Reset context if it's been more than an hour since the last message
  const now = new Date();
  if ((now.getTime() - conversationContext.sessionStartTime.getTime()) > 3600000) {
    conversationContext = {
      lastTopic: '',
      mentionedDrugs: [],
      mentionedEmotions: [],
      recoveryPhase: 'unknown',
      sessionStartTime: now
    };
  } else {
    conversationContext.sessionStartTime = now;
  }
  
  try {
    // Update context based on user message
    updateConversationContext(userContent);
    
    // Adapt responses based on mood
    const moodPrefix = getMoodResponsePrefix(userMood);
    
    // Extract previous assistant messages to avoid repetition
    const previousAssistantMessages = messages
      .filter(m => m.role === 'assistant')
      .map(m => m.content)
      .slice(-3);
    
    // Check for greeting patterns
    const greetingPatterns = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite'];
    if (greetingPatterns.some(pattern => userContent.toLowerCase().includes(pattern))) {
      return {
        message: `${moodPrefix} Que bom ter você neste espaço seguro de acolhimento. Como você está se sentindo hoje em sua jornada? Estou aqui para oferecer suporte e explorar juntos os caminhos da sua recuperação.`
      };
    }

    // Respostas para pedidos de ajuda genéricos com linguagem terapêutica especializada
    const helpPatterns = ['ajuda', 'ajude', 'preciso de ajuda', 'socorro'];
    if (helpPatterns.some(pattern => userContent.toLowerCase().includes(pattern))) {
      return {
        message: `${moodPrefix} Estou aqui para acompanhar você neste momento. O processo terapêutico começa quando conseguimos nomear nossas dificuldades. Pode compartilhar com mais detalhes o que está vivenciando? Lembre-se que pedir ajuda é um ato de coragem e representa um importante passo no processo de recuperação.`
      };
    }

    // Check if user is asking about the app or the assistant
    if (userContent.toLowerCase().includes('quem é você') || 
        userContent.toLowerCase().includes('o que você é') || 
        userContent.toLowerCase().includes('como funciona')) {
      return {
        message: `Sou um assistente especializado no acompanhamento de pessoas em processo de recuperação de dependência química, baseado em abordagens terapêuticas reconhecidas como eficazes neste contexto. Estou aqui para oferecer um espaço de escuta qualificada, reflexão e suporte, complementando seu tratamento presencial. Embora eu não substitua o acompanhamento profissional, posso ser um recurso adicional valioso nos momentos entre suas consultas regulares.`
      };
    }

    // Generate contextual response based on conversation history
    return {
      message: generateContextualResponse(userContent, userMood, previousAssistantMessages)
    };
    
  } catch (error) {
    console.error('Error in mock API response:', error);
    return { 
      message: 'Percebo que estamos tendo uma dificuldade de comunicação neste momento. Poderia reformular sua colocação de outra maneira? Isso me ajudaria a compreender melhor como posso oferecer o suporte adequado para você agora.' 
    };
  }
};

function updateConversationContext(userMessage: string) {
  const lowerMessage = userMessage.toLowerCase();
  
  // Detect drug mentions with more therapeutic focus
  const drugKeywords = ['álcool', 'alcool', 'bebida', 'cerveja', 'vinho', 'cocaína', 'cocaina', 'crack', 'maconha', 'cannabis', 'heroína', 'heroina', 'metanfetamina', 'crystal', 'ecstasy', 'mdma', 'lsd', 'cogumelos', 'remédios', 'remedios', 'benzodiazepínicos', 'anfetaminas'];
  
  drugKeywords.forEach(drug => {
    if (lowerMessage.includes(drug) && !conversationContext.mentionedDrugs.includes(drug)) {
      conversationContext.mentionedDrugs.push(drug);
    }
  });
  
  // Enhanced emotion detection for therapeutic approach
  const emotionKeywords = {
    'ansiedade': ['ansioso', 'ansiedade', 'nervoso', 'preocupado', 'tenso', 'angústia', 'aflito'],
    'tristeza': ['triste', 'deprimido', 'melancólico', 'desanimado', 'abatido', 'sem energia', 'desesperançado'],
    'raiva': ['raiva', 'irritado', 'bravo', 'furioso', 'frustrado', 'ressentido', 'indignado'],
    'medo': ['medo', 'assustado', 'temeroso', 'receio', 'pavor', 'apavorado', 'apreensivo'],
    'culpa': ['culpa', 'arrependido', 'remorso', 'vergonha', 'inadequado', 'erro'],
    'esperança': ['esperança', 'otimista', 'motivado', 'confiante', 'animado', 'determinado'],
    'craving': ['vontade de usar', 'fissura', 'desejo', 'impulso', 'tentação', 'abstinência']
  };
  
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    if (keywords.some(keyword => lowerMessage.includes(keyword)) && !conversationContext.mentionedEmotions.includes(emotion)) {
      conversationContext.mentionedEmotions.push(emotion);
    }
  });
  
  // Enhanced recovery phase detection
  if (lowerMessage.includes('comecei recentemente') || lowerMessage.includes('primeiros dias') || lowerMessage.includes('primeira semana') || lowerMessage.includes('desintoxicação')) {
    conversationContext.recoveryPhase = 'early';
  } else if (lowerMessage.includes('alguns meses') || lowerMessage.includes('estabilizando') || lowerMessage.includes('mais estável')) {
    conversationContext.recoveryPhase = 'middle';
  } else if (lowerMessage.includes('há anos') || lowerMessage.includes('bastante tempo') || lowerMessage.includes('manutenção')) {
    conversationContext.recoveryPhase = 'late';
  }
  
  // Update last topic with enhanced therapeutic focus
  const topicKeywords = {
    'abstinência': ['abstinencia', 'abstinência', 'sintomas', 'fissura', 'vontade', 'craving', 'desejo', 'impulso'],
    'recaída': ['recaída', 'recaída', 'voltei a usar', 'cai', 'caí', 'fraqueza', 'deslize', 'lapso'],
    'tratamento': ['tratamento', 'terapia', 'internar', 'clínica', 'clinica', 'médico', 'medico', 'psicólogo', 'programa'],
    'relacionamentos': ['família', 'familia', 'amigos', 'relacionamento', 'casamento', 'filhos', 'confiança', 'perdão'],
    'trabalho': ['trabalho', 'emprego', 'carreira', 'colegas', 'chefe', 'sustento', 'produtividade'],
    'saúde': ['saúde', 'saude', 'sintomas', 'doença', 'doenca', 'hospital', 'corpo', 'medicação'],
    'sono': ['sono', 'dormir', 'insônia', 'insonia', 'pesadelo', 'descanso', 'fadiga'],
    'ansiedade': ['ansiedade', 'ansioso', 'pânico', 'panico', 'ataque', 'nervoso', 'preocupação'],
    'depressão': ['depressão', 'depressao', 'tristeza', 'vontade de morrer', 'suicídio', 'sem energia', 'vazio'],
    'espiritualidade': ['deus', 'fé', 'espiritualidade', 'sentido', 'propósito', 'meditação', 'oração', 'significado']
  };
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => lowerMessage.includes(keyword))) {
      conversationContext.lastTopic = topic;
    }
  });
}

function generateContextualResponse(userMessage: string, mood: string, previousResponses: string[]): string {
  const lowerMessage = userMessage.toLowerCase();
  const moodPrefix = getMoodResponsePrefix(mood);
  
  // Enhanced therapeutic responses based on updated context
  if (conversationContext.lastTopic) {
    const topicResponses: {[key: string]: string[]} = {
      'abstinência': [
        'Os sintomas de abstinência representam um processo natural de restauração do seu organismo. Cada desconforto sinaliza que seu corpo está trabalhando para encontrar um novo equilíbrio. Podemos explorar estratégias específicas para cada sintoma que você está experimentando. O que tem sido mais desafiador para você neste momento?',
        'A abstinência é um processo fisiológico e psicológico temporário, embora possa parecer interminável quando estamos no meio dele. Seu corpo está se readaptando e reconstruindo conexões neurais mais saudáveis. Como tem sido sua alimentação e hidratação durante este período? Estes cuidados básicos podem diminuir significativamente a intensidade dos sintomas.',
        'Na fase de abstinência, seu cérebro está trabalhando para reequilibrar neurotransmissores importantes como a dopamina e a serotonina. A prática de exercícios leves, mesmo uma caminhada diária, pode ajudar significativamente neste reequilíbrio bioquímico. Você tem conseguido incorporar alguma atividade física regular na sua rotina?'
      ],
      'recaída': [
        'É importante compreendermos a recaída como parte do processo de recuperação e não como fracasso. Na perspectiva terapêutica, este momento representa uma oportunidade valiosa para identificarmos padrões e gatilhos que precisam ser trabalhados. Poderia compartilhar quais sentimentos ou situações precederam este episódio?',
        'A recaída frequentemente nos revela áreas importantes do tratamento que ainda precisam de atenção. Vamos analisar este episódio não como um retrocesso, mas como um momento significativo de aprendizado no seu processo terapêutico. Como você percebe a diferença entre os fatores internos e externos que contribuíram para esta situação?',
        'Na abordagem cognitivo-comportamental, reconhecemos que pensamentos precedem comportamentos. Identificar os pensamentos automáticos que surgiram antes da recaída é fundamental para intervenções futuras mais eficazes. Consegue identificar quais pensamentos estavam presentes quando a vontade de usar se intensificou?'
      ],
      'sono': [
        'As alterações no padrão de sono são esperadas durante o processo de recuperação e representam uma readaptação do seu ritmo circadiano, anteriormente afetado pelo uso de substâncias. A implementação de uma higiene do sono consistente é uma intervenção terapêutica eficaz. Vamos explorar que rotinas poderiam ajudar no seu caso específico?',
        'O sono é um componente fundamental na recuperação neurobiológica. Durante esta fase, seu cérebro realiza processos importantes de consolidação de memória e restauração celular. Técnicas de respiração diafragmática e relaxamento muscular progressivo antes de dormir podem ajudar significativamente. Gostaria de conhecer estas técnicas?',
        'As dificuldades de sono durante a recuperação têm forte base neuroquímica e psicológica. Seu cérebro está reaprendendo a produzir naturalmente substâncias relacionadas ao relaxamento e ao sono. Além de intervenções comportamentais, existe alguma preocupação recorrente que você percebe surgir justamente na hora de dormir?'
      ],
      'espiritualidade': [
        'A dimensão espiritual representa um componente fundamental no processo terapêutico da dependência, independente de afiliações religiosas específicas. Muitas pessoas encontram na espiritualidade recursos importantes para desenvolver sentido, propósito e conexão. Como você percebe que esta dimensão tem se manifestado em sua jornada de recuperação?',
        'Na jornada de recuperação, a espiritualidade frequentemente oferece um contexto mais amplo para compreender o sofrimento e transformá-lo em crescimento pessoal. Muitos encontram força em práticas como meditação, oração ou contemplação da natureza. Existe alguma prática que você sente que poderia incorporar à sua rotina diária?',
        'O desenvolvimento espiritual na recuperação muitas vezes envolve reconectar-se com valores pessoais profundos e encontrar um sentido maior que transcenda o uso de substâncias. Esta reconexão tem um importante papel terapêutico. Quais valores você consideraria fundamentais para sua vida e como poderia expressá-los mais no seu cotidiano?'
      ],
      // ... keep existing code for other topics
    };
    
    if (topicResponses[conversationContext.lastTopic]) {
      const possibleResponses = topicResponses[conversationContext.lastTopic];
      // Find a response that hasn't been used recently
      for (const response of possibleResponses) {
        if (!previousResponses.some(prev => prev.includes(response.substring(0, 30)))) {
          return `${moodPrefix} ${response}`;
        }
      }
      // If all responses have been used, pick one anyway
      return `${moodPrefix} ${possibleResponses[Math.floor(Math.random() * possibleResponses.length)]}`;
    }
  }
  
  // Generate response based on detected emotions with enhanced therapeutic language
  if (conversationContext.mentionedEmotions.length > 0) {
    const lastEmotion = conversationContext.mentionedEmotions[conversationContext.mentionedEmotions.length - 1];
    const emotionResponses: {[key: string]: string[]} = {
      'ansiedade': [
        'A ansiedade que você está experimentando é uma resposta natural do sistema nervoso, intensificada durante o processo de recuperação quando os mecanismos químicos de autorregulação emocional estão se reequilibrando. Vamos trabalhar com técnicas de respiração diafragmática e aterramento para ajudar a acalmar o sistema nervoso autônomo. Você identifica situações específicas que intensificam essa ansiedade?',
        'Na perspectiva da terapia cognitivo-comportamental, podemos compreender a ansiedade como um sinal importante que seu sistema nervoso está enviando. Durante a recuperação, é comum que esses sinais estejam temporariamente amplificados. Explorar os pensamentos antecipatórios que surgem pode nos oferecer importantes insights terapêuticos. Consegue identificar quais pensamentos recorrentes precedem esses momentos de maior ansiedade?',
        'A intensificação da ansiedade durante a recuperação tem componentes neurofisiológicos importantes, incluindo a hipersensibilidade do sistema de alerta enquanto o cérebro se reequilibra. Podemos integrar práticas sistemáticas de regulação do sistema nervoso, como a técnica 5-4-3-2-1, que ativa seus cinco sentidos para reconexão com o momento presente. Gostaria de explorar esta e outras ferramentas práticas?'
      ],
      'tristeza': [
        'A tristeza que você está vivenciando é parte integrante do processo terapêutico de recuperação. Ela frequentemente emerge quando começamos a entrar em contato com perdas significativas e com sentimentos anteriormente anestesiados pelo uso de substâncias. Este é um indicador de que você está desenvolvendo maior consciência emocional, uma habilidade essencial para a recuperação sustentável. Como você tem acolhido estes sentimentos?',
        'Na abordagem psicodinâmica do tratamento da dependência, a tristeza emergente durante a recuperação frequentemente representa o importante trabalho de luto - luto pelo tempo perdido, pelos relacionamentos afetados e pela identidade anterior. Este processo, embora doloroso, é terapêutico e necessário. Quais aspectos específicos desta tristeza parecem mais presentes para você neste momento?',
        'Sua capacidade de reconhecer e nomear a tristeza demonstra um importante avanço terapêutico na reconexão com seu mundo emocional. Durante o uso de substâncias, muitas emoções são suprimidas, e sua emergência indica um retorno saudável da capacidade de sentir toda a gama de experiências humanas. Que estratégias de autocuidado você tem utilizado quando estes sentimentos se intensificam?'
      ],
      'craving': [
        'O craving ou fissura que você está experimentando é um fenômeno neurobiológico complexo, envolvendo memórias, gatilhos ambientais e desequilíbrios químicos temporários no cérebro. É importante reconhecer que estas sensações intensas são temporárias e tendem a diminuir com o tempo de abstinência. Vamos explorar técnicas específicas de manejo de craving como o adiamento, distração e diálogo interno. Você consegue identificar um padrão nos momentos em que estas sensações se intensificam?',
        'Na perspectiva terapêutica, o craving representa uma oportunidade para desenvolvermos maior consciência sobre os gatilhos internos e externos que impactam seu processo de recuperação. Cada episódio de fissura superado fortalece as novas vias neurais que estão se formando. Que estratégias você já descobriu que ajudam a reduzir a intensidade destas sensações quando elas surgem?',
        'O manejo eficiente do craving envolve reconhecer que estas sensações, embora intensas, são temporárias e não precisariam levar ao uso. Técnicas como "surfar na onda" da fissura ou o acrônimo ACEITAR (Acolher a sensação, Conectar com a respiração, Explorar sensações corporais, Investigar pensamentos, Tolerar o desconforto, Abrir-se à experiência, Responder conscientemente) podem ser ferramentas valiosas. Gostaria que explorássemos alguma dessas técnicas mais detalhadamente?'
      ],
      // ... keep existing code for other emotions
    };
    
    if (emotionResponses[lastEmotion]) {
      const possibleResponses = emotionResponses[lastEmotion];
      for (const response of possibleResponses) {
        if (!previousResponses.some(prev => prev.includes(response.substring(0, 30)))) {
          return `${moodPrefix} ${response}`;
        }
      }
      return `${moodPrefix} ${possibleResponses[Math.floor(Math.random() * possibleResponses.length)]}`;
    }
  }
  
  // Enhanced responses for specific recovery phases
  if (conversationContext.recoveryPhase !== 'unknown') {
    const phaseResponses: {[key: string]: string[]} = {
      'early': [
        'Esta fase inicial da recuperação representa um período crucial onde estão ocorrendo importantes adaptações neurobiológicas e psicológicas. Os desafios que você enfrenta agora são esperados e temporários. A consistência nas novas rotinas, mesmo pequenas, é mais importante que a perfeição. Como tem sido para você implementar novos hábitos neste início de jornada?',
        'Na fase inicial da recuperação, seu cérebro está trabalhando intensamente para reestabelecer o equilíbrio neuroquímico. Flutuações de humor, energia e motivação são esperadas neste momento e não indicam que o processo não está funcionando. Pelo contrário, são sinais de que a recuperação está em andamento. Que aspectos desta fase inicial têm sido mais desafiadores para você?',
        'Este começo de jornada representa um importante período de reestruturação identitária, onde começamos a desenvolver uma nova relação consigo mesmo além da substância. As dificuldades desta fase servem como importantes oportunidades de crescimento terapêutico. Quais recursos internos e externos você já identificou que podem apoiar esta fase crítica da sua recuperação?'
      ],
      'middle': [
        'A fase intermediária da recuperação que você está vivenciando frequentemente envolve a consolidação das mudanças iniciais e o aprofundamento do trabalho terapêutico. É um momento importante para desenvolver maior autoeficácia e explorar questões subjacentes que podem ter contribuído para o padrão de uso. Como você percebe sua evolução desde o início do processo até este ponto?',
        'Nesta etapa da recuperação, muitas pessoas começam a experimentar maior estabilidade e capacidade de autorregulação emocional. É um momento propício para fortalecer habilidades de prevenção de recaída e desenvolver maior profundidade no autoconhecimento. Quais aspectos da sua vida parecem estar se beneficiando mais claramente do seu processo de recuperação?',
        'A fase intermediária representa um momento de transição importante onde o foco terapêutico gradualmente se expande da abstinência para a construção de uma vida plena e significativa. É comum surgirem novos desafios relacionados a relacionamentos, trabalho e questões existenciais mais amplas. Como você tem navegado estas diferentes dimensões da sua recuperação?'
      ],
      'late': [
        'Sua experiência de longo prazo na recuperação oferece uma perspectiva valiosa sobre a natureza processual e contínua da transformação pessoal. Na fase de manutenção, o trabalho terapêutico frequentemente envolve integrar a experiência da dependência na narrativa mais ampla da sua vida, transformando-a em fonte de significado e propósito. Como você percebe que sua história tem informado quem você é hoje?',
        'A recuperação de longo prazo frequentemente envolve um processo contínuo de crescimento, onde a abstinência torna-se apenas o fundamento sobre o qual se constrói uma vida de autenticidade e propósito. Nesta fase, muitas pessoas descobrem que suas experiências podem ser transformadas em recursos para ajudar outros. Como você tem encontrado significado em sua jornada de recuperação continuada?',
        'A manutenção da recuperação a longo prazo representa um compromisso com o crescimento contínuo e autoconhecimento. A vigilância sobre os padrões de pensamento e comportamento continua importante, mas frequentemente de forma mais integrada e natural. Quais práticas e valores têm sido fundamentais para sustentar seu bem-estar ao longo do tempo?'
      ]
    };
    
    if (phaseResponses[conversationContext.recoveryPhase]) {
      const possibleResponses = phaseResponses[conversationContext.recoveryPhase];
      for (const response of possibleResponses) {
        if (!previousResponses.some(prev => prev.includes(response.substring(0, 30)))) {
          return `${moodPrefix} ${response}`;
        }
      }
      return `${moodPrefix} ${possibleResponses[Math.floor(Math.random() * possibleResponses.length)]}`;
    }
  }
  
  // Enhanced general therapeutic responses
  const generalResponses = [
    'Gostaria de compreender melhor sua experiência atual. Na abordagem terapêutica da dependência, reconhecemos que cada pessoa possui um caminho único na recuperação, influenciado por fatores biológicos, psicológicos, sociais e espirituais. Como você tem percebido estas diferentes dimensões interagindo em sua própria jornada?',
    'Agradeço por compartilhar seus pensamentos. Na perspectiva da entrevista motivacional, estamos sempre navegando entre diferentes estágios de mudança - pré-contemplação, contemplação, preparação, ação e manutenção. Refletindo sobre este modelo, em que ponto desta jornada você sente que está atualmente?',
    'Sua reflexão demonstra importante autoconsciência. No trabalho terapêutico com dependência química, reconhecemos a importância de identificar padrões de pensamento, emoção e comportamento que podem estar interconectados. Você percebe alguma conexão entre essas diferentes dimensões na sua experiência recente?',
    'O processo terapêutico na recuperação envolve desenvolver maior consciência sobre nossos padrões relacionais, incluindo como nos relacionamos conosco mesmos. A autocompaixão é um componente fundamental neste processo. Como você descreveria a maneira como tem se relacionado consigo mesmo durante os desafios recentes?'
  ];

  // Find a general response that hasn't been used recently
  for (const response of generalResponses) {
    if (!previousResponses.some(prev => prev.includes(response.substring(0, 30)))) {
      return `${moodPrefix} ${response}`;
    }
  }

  // Default fallback with therapeutic language
  return `${moodPrefix} ${generalResponses[Math.floor(Math.random() * generalResponses.length)]}`;
}

// Enhanced therapeutic response prefixes based on mood
function getMoodResponsePrefix(mood: string): string {
  switch (mood) {
    case 'happy':
      return 'Percebo em você uma energia positiva hoje, o que é um recurso valioso no processo terapêutico.';
    case 'sad':
      return 'Noto que você está experimentando tristeza hoje, um sentimento importante que nos conecta com nossas necessidades mais profundas.';
    case 'angry':
      return 'Observo que você está em contato com sentimentos de frustração ou raiva, emoções que frequentemente sinalizam limites ou necessidades não atendidas.';
    case 'neutral':
    default:
      return 'Em nosso diálogo terapêutico de hoje, gostaria de compreender melhor sua experiência.';
  }
}

export const fetchMockTalkToMeApi = async (
  messages: Message[]
): Promise<Response> => {
  try {
    const data = await mockTalkToMeApi(messages);
    // Add a small delay to simulate API latency
    await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 1000));
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to get response" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
