
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

export const mockTalkToMeApi = async (
  messages: Message[]
): Promise<MockApiResponse> => {
  const userMessage = messages.filter(m => m.role === 'user').pop();
  const userContent = userMessage?.content || '';
  const userMood = userMessage?.mood || 'neutral';
  
  try {
    // Adapt responses based on mood
    const moodPrefix = getMoodResponsePrefix(userMood);
    
    // Respostas para saudações e mensagens iniciais
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

    // Mantém as respostas específicas para tópicos importantes
    const topicResponses: {[key: string]: string[]} = {
      ansiedade: [
        'A ansiedade durante o processo de recuperação é comum e compreensível. Podemos trabalhar juntos em técnicas específicas para gerenciá-la sem recorrer a substâncias. Você já identificou situações específicas que aumentam sua ansiedade? Como tem lidado com esses momentos?',
        'Entendo sua preocupação com a ansiedade, é um desafio significativo na recuperação. Vamos explorar algumas estratégias de enfrentamento que funcionam especificamente para você. Que tipo de situações têm desencadeado essa ansiedade? Podemos começar desenvolvendo um plano personalizado.',
        'É importante reconhecer que a ansiedade que você está sentindo é uma resposta natural do corpo e da mente durante a recuperação. Poderíamos começar com exercícios simples de respiração ou outras técnicas de relaxamento. Você já experimentou alguma técnica específica que ajudou?'
      ],
      recaída: [
        'Pensar sobre recaída mostra sua consciência e comprometimento com a recuperação. É importante lembrar que ter pensamentos sobre uso não significa fracasso - são oportunidades para fortalecer suas estratégias de prevenção. Poderia me contar mais sobre o que tem despertado esses pensamentos?',
        'Vamos analisar juntos os fatores que podem estar contribuindo para esses pensamentos de recaída. A identificação precoce de gatilhos é uma ferramenta poderosa na prevenção. Como está sua rede de apoio neste momento? Tem conseguido compartilhar essas preocupações com alguém?',
        'Falar abertamente sobre recaída é um sinal de força, não de fraqueza. Isso nos permite trabalhar proativamente na prevenção. Vamos explorar quais estratégias de enfrentamento têm funcionado para você e onde podemos fortalecer seu plano de prevenção de recaída.'
      ],
      abstinência: [
        'Os sintomas de abstinência são desafiadores, mas cada dia que passa é uma vitória e seu corpo está se recuperando. Quais sintomas têm sido mais difíceis para você? Podemos discutir estratégias específicas para lidar com cada um deles.',
        'É importante lembrar que os sintomas de abstinência são temporários e cada pessoa os experimenta de forma diferente. Como tem sido seu sono e sua alimentação durante este período? Estas necessidades básicas são fundamentais para fortalecer seu processo de recuperação.',
        'Você está demonstrando muita coragem ao enfrentar a abstinência. Vamos focar em estratégias práticas para cada sintoma específico. Que tipo de suporte você sente que seria mais útil neste momento?'
      ],
      sono: [
        'Problemas com o sono são muito comuns durante a recuperação, pois seu corpo está se reajustando. Vamos trabalhar em uma rotina noturna que possa ajudar? Que horários você costuma ir dormir e acordar?',
        'Um sono reparador é fundamental para sua recuperação. Podemos começar estabelecendo uma rotina relaxante antes de dormir. Você tem praticado alguma técnica de relaxamento? Existem atividades específicas que você nota que interferem no seu sono?',
        'Entendo sua preocupação com o sono, é uma parte crucial da recuperação. Vamos explorar juntos o que pode estar afetando seu descanso. Tem notado padrões específicos ou situações que pioram ou melhoram seu sono?'
      ],
      família: [
        'As relações familiares podem ser especialmente delicadas durante a recuperação. Como tem sido a comunicação com sua família? Podemos trabalhar em estratégias para fortalecer esses vínculos de forma saudável.',
        'É comum que as dinâmicas familiares precisem de ajustes durante o processo de recuperação. Sua família tem participado de grupos de apoio para familiares? Isso pode ser muito benéfico para todos os envolvidos.',
        'Reconstruir a confiança familiar é um processo gradual que requer paciência. Que pequenos passos você poderia dar para melhorar a comunicação com sua família? Como podemos trabalhar para estabelecer expectativas realistas de ambos os lados?'
      ]
    };

    // Procura por tópicos específicos na mensagem do usuário
    for (const [topic, responses] of Object.entries(topicResponses)) {
      if (userContent.toLowerCase().includes(topic)) {
        return { 
          message: responses[Math.floor(Math.random() * responses.length)] 
        };
      }
    }

    // Respostas padrão mais naturais e engajadas
    const defaultResponses = [
      'Me conte mais sobre isso. Como você tem se sentido ultimamente? Estou aqui para te escutar e juntos podemos encontrar caminhos.',
      'Entendo que cada situação é única. Pode me explicar melhor o que está acontecendo? Isso vai me ajudar a te apoiar da melhor forma possível.',
      'Às vezes é difícil expressar o que estamos sentindo. Não se preocupe, pode ir no seu tempo. Estou aqui para te ouvir e apoiar.',
      'O que você está sentindo é válido e importante. Vamos conversar mais sobre isso? Me conte um pouco mais sobre sua situação.'
    ];

    return { 
      message: `${moodPrefix} ${defaultResponses[Math.floor(Math.random() * defaultResponses.length)]}` 
    };
    
  } catch (error) {
    console.error('Error in mock API response:', error);
    return { 
      message: 'Desculpe, estou tendo dificuldade para processar sua mensagem. Poderia reformular de outra maneira?' 
    };
  }
};

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
