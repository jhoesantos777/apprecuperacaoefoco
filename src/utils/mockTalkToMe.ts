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
        message: `${moodPrefix} Que bom ter você aqui. Como está se sentindo hoje? Estou aqui para ouvir e conversar sobre o que você precisar.`
      };
    }

    // Respostas para pedidos de ajuda genéricos
    const helpPatterns = ['ajuda', 'ajude', 'preciso de ajuda', 'socorro'];
    if (helpPatterns.some(pattern => userContent.toLowerCase().includes(pattern))) {
      return {
        message: `${moodPrefix} Estou aqui para te ajudar. Pode me contar um pouco mais sobre o que está passando? Às vezes o primeiro passo é simplesmente compartilhar o que está sentindo, sem julgamentos.`
      };
    }

    // Check if user is asking about the app or the assistant
    if (userContent.toLowerCase().includes('quem é você') || 
        userContent.toLowerCase().includes('o que você é') || 
        userContent.toLowerCase().includes('como funciona')) {
      return {
        message: `Sou um assistente digital focado em apoiar pessoas em recuperação de dependência química. Estou aqui para conversar, oferecer suporte e informações baseadas em práticas reconhecidas. Embora eu não substitua o atendimento profissional, posso ser um recurso complementar quando você precisar conversar.`
      };
    }

    // Generate contextual response based on conversation history
    return {
      message: generateContextualResponse(userContent, userMood, previousAssistantMessages)
    };
    
  } catch (error) {
    console.error('Error in mock API response:', error);
    return { 
      message: 'Desculpe, estou tendo dificuldade para processar sua mensagem. Poderia reformular de outra maneira?' 
    };
  }
};

function updateConversationContext(userMessage: string) {
  const lowerMessage = userMessage.toLowerCase();
  
  // Detect drug mentions
  const drugKeywords = ['álcool', 'alcool', 'bebida', 'cerveja', 'vinho', 'cocaína', 'cocaina', 'crack', 'maconha', 'cannabis', 'heroína', 'heroina', 'metanfetamina', 'crystal', 'ecstasy', 'mdma', 'lsd', 'cogumelos', 'remédios', 'remedios', 'benzodiazepínicos', 'anfetaminas'];
  
  drugKeywords.forEach(drug => {
    if (lowerMessage.includes(drug) && !conversationContext.mentionedDrugs.includes(drug)) {
      conversationContext.mentionedDrugs.push(drug);
    }
  });
  
  // Detect emotions
  const emotionKeywords = {
    'ansiedade': ['ansioso', 'ansiedade', 'nervoso', 'preocupado', 'tenso'],
    'tristeza': ['triste', 'deprimido', 'melancólico', 'desanimado', 'abatido'],
    'raiva': ['raiva', 'irritado', 'bravo', 'furioso', 'frustrado'],
    'medo': ['medo', 'assustado', 'temeroso', 'receio', 'pavor'],
    'culpa': ['culpa', 'arrependido', 'remorso', 'vergonha'],
    'esperança': ['esperança', 'otimista', 'motivado', 'confiante']
  };
  
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    if (keywords.some(keyword => lowerMessage.includes(keyword)) && !conversationContext.mentionedEmotions.includes(emotion)) {
      conversationContext.mentionedEmotions.push(emotion);
    }
  });
  
  // Detect recovery phase mentions
  if (lowerMessage.includes('comecei recentemente') || lowerMessage.includes('primeiros dias') || lowerMessage.includes('primeira semana')) {
    conversationContext.recoveryPhase = 'early';
  } else if (lowerMessage.includes('alguns meses') || lowerMessage.includes('estabilizando')) {
    conversationContext.recoveryPhase = 'middle';
  } else if (lowerMessage.includes('há anos') || lowerMessage.includes('bastante tempo')) {
    conversationContext.recoveryPhase = 'late';
  }
  
  // Update last topic
  const topicKeywords = {
    'abstinência': ['abstinencia', 'abstinência', 'sintomas', 'fissura', 'vontade'],
    'recaída': ['recaída', 'recaída', 'voltei a usar', 'cai', 'caí'],
    'tratamento': ['tratamento', 'terapia', 'internar', 'clínica', 'clinica', 'médico', 'medico'],
    'relacionamentos': ['família', 'familia', 'amigos', 'relacionamento', 'casamento', 'filhos'],
    'trabalho': ['trabalho', 'emprego', 'carreira', 'colegas', 'chefe'],
    'saúde': ['saúde', 'saude', 'sintomas', 'doença', 'doenca', 'hospital'],
    'sono': ['sono', 'dormir', 'insônia', 'insonia', 'pesadelo'],
    'ansiedade': ['ansiedade', 'ansioso', 'pânico', 'panico', 'ataque'],
    'depressão': ['depressão', 'depressao', 'tristeza', 'vontade de morrer', 'suicídio']
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
  
  // Check for topic-specific responses based on updated context
  if (conversationContext.lastTopic) {
    const topicResponses: {[key: string]: string[]} = {
      'abstinência': [
        'Os sintomas de abstinência são desafiadores, mas cada dia que passa é uma vitória e seu corpo está se recuperando. Quais sintomas têm sido mais difíceis para você? Podemos discutir estratégias específicas para lidar com cada um deles.',
        'É importante lembrar que os sintomas de abstinência são temporários e cada pessoa os experimenta de forma diferente. Como tem sido seu sono e sua alimentação durante este período? Estas necessidades básicas são fundamentais para fortalecer seu processo de recuperação.',
        'Você está demonstrando muita coragem ao enfrentar a abstinência. Vamos focar em estratégias práticas para cada sintoma específico. Que tipo de suporte você sente que seria mais útil neste momento?'
      ],
      'recaída': [
        'Pensar sobre recaída mostra sua consciência e comprometimento com a recuperação. É importante lembrar que ter pensamentos sobre uso não significa fracasso - são oportunidades para fortalecer suas estratégias de prevenção. Poderia me contar mais sobre o que tem despertado esses pensamentos?',
        'Vamos analisar juntos os fatores que podem estar contribuindo para esses pensamentos de recaída. A identificação precoce de gatilhos é uma ferramenta poderosa na prevenção. Como está sua rede de apoio neste momento? Tem conseguido compartilhar essas preocupações com alguém?',
        'Falar abertamente sobre recaída é um sinal de força, não de fraqueza. Isso nos permite trabalhar proativamente na prevenção. Vamos explorar quais estratégias de enfrentamento têm funcionado para você e onde podemos fortalecer seu plano de prevenção de recaída.'
      ],
      'sono': [
        'Problemas com o sono são muito comuns durante a recuperação, pois seu corpo está se reajustando. Vamos trabalhar em uma rotina noturna que possa ajudar? Que horários você costuma ir dormir e acordar?',
        'Um sono reparador é fundamental para sua recuperação. Podemos começar estabelecendo uma rotina relaxante antes de dormir. Você tem praticado alguma técnica de relaxamento? Existem atividades específicas que você nota que interferem no seu sono?',
        'Entendo sua preocupação com o sono, é uma parte crucial da recuperação. Vamos explorar juntos o que pode estar afetando seu descanso. Tem notado padrões específicos ou situações que pioram ou melhoram seu sono?'
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
  
  // Generate response based on detected emotions
  if (conversationContext.mentionedEmotions.length > 0) {
    const lastEmotion = conversationContext.mentionedEmotions[conversationContext.mentionedEmotions.length - 1];
    const emotionResponses: {[key: string]: string[]} = {
      'ansiedade': [
        'A ansiedade durante o processo de recuperação é comum e compreensível. Podemos trabalhar juntos em técnicas específicas para gerenciá-la sem recorrer a substâncias. Você já identificou situações específicas que aumentam sua ansiedade?',
        'Entendo sua preocupação com a ansiedade, é um desafio significativo na recuperação. Vamos explorar algumas estratégias de enfrentamento que funcionam especificamente para você. Que tipo de situações têm desencadeado essa ansiedade?',
        'É importante reconhecer que a ansiedade que você está sentindo é uma resposta natural do corpo e da mente durante a recuperação. Poderíamos começar com exercícios simples de respiração ou outras técnicas de relaxamento. Você já experimentou alguma técnica específica?'
      ],
      'tristeza': [
        'É natural sentir tristeza durante o processo de recuperação. Você está lidando com muitas mudanças e, às vezes, também com perdas significativas. Como você costuma lidar com esses sentimentos quando surgem?',
        'A tristeza que você está sentindo merece ser acolhida e compreendida. Você consegue identificar o que específicamente tem desencadeado esse sentimento? Às vezes, nomear a causa pode ser o primeiro passo para processar a emoção.',
        'Obrigado por compartilhar como está se sentindo. A tristeza é uma emoção importante que nos diz algo sobre nossas necessidades. Tem praticado alguma forma de autocuidado para apoiar sua saúde emocional neste momento?'
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
  
  // Handle specific recovery phase responses
  if (conversationContext.recoveryPhase !== 'unknown') {
    const phaseResponses: {[key: string]: string[]} = {
      'early': [
        'Os primeiros dias e semanas de recuperação são frequentemente os mais desafiadores, mas também demonstram sua força e comprometimento. Quais têm sido seus maiores desafios neste início de jornada?',
        'É muito significativo que você esteja dando esses primeiros passos na recuperação. Como está se adaptando às mudanças iniciais em sua rotina? Pequenas vitórias diárias são importantes nesta fase.',
        'O início da recuperação exige muito coragem. Você está construindo uma nova base para sua vida. Tem conseguido identificar o que funciona para você quando os momentos difíceis surgem?'
      ],
      'middle': [
        'Esta fase intermediária da recuperação traz seus próprios desafios, mas você já acumulou experiência valiosa. Como você percebe sua evolução desde o início da sua jornada?',
        'Você está em um ponto importante da recuperação, onde muitos dos desafios iniciais já foram superados, mas surgem novas questões. Como tem sido equilibrar as diferentes áreas da sua vida neste momento?',
        'Nesta fase da recuperação, muitas pessoas começam a reconstruir relacionamentos e aspectos práticos da vida. Como está esse processo para você? Há áreas específicas onde sente que precisa de mais apoio?'
      ],
      'late': [
        'Sua experiência de longo prazo na recuperação é muito valiosa. Como você vê seu processo hoje, comparado com os primeiros tempos? O que gostaria de compartilhar com quem está começando agora?',
        'A recuperação de longo prazo traz uma perspectiva única sobre a vida. Quais valores e práticas você considera mais importantes para manter sua estabilidade e bem-estar?',
        'Manter a recuperação por um longo período é uma conquista significativa. Como você tem cuidado da sua saúde e bem-estar nesta fase mais estável do processo? Há novos objetivos que você está buscando alcançar?'
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
  
  // General contextual responses if nothing else matches
  const generalResponses = [
    'Me conte mais sobre isso. Como você tem se sentido ultimamente? Estou aqui para te escutar e juntos podemos encontrar caminhos.',
    'Entendo que cada situação é única. Pode me explicar melhor o que está acontecendo? Isso vai me ajudar a te apoiar da melhor forma possível.',
    'Às vezes é difícil expressar o que estamos sentindo. Não se preocupe, pode ir no seu tempo. Estou aqui para te ouvir e apoiar.',
    'O que você está sentindo é válido e importante. Vamos conversar mais sobre isso? Me conte um pouco mais sobre sua situação.'
  ];

  // Find a general response that hasn't been used recently
  for (const response of generalResponses) {
    if (!previousResponses.some(prev => prev.includes(response.substring(0, 30)))) {
      return `${moodPrefix} ${response}`;
    }
  }

  // Default fallback
  return `${moodPrefix} ${generalResponses[Math.floor(Math.random() * generalResponses.length)]}`;
}

// Helper function to get response prefix based on mood
function getMoodResponsePrefix(mood: string): string {
  switch (mood) {
    case 'happy':
      return 'É bom ver que você está se sentindo bem hoje.';
    case 'sad':
      return 'Percebo que você está triste hoje. É normal ter dias assim durante a recuperação.';
    case 'angry':
      return 'Entendo que você está se sentindo irritado. Suas emoções são válidas.';
    case 'neutral':
    default:
      return 'Olá!';
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
