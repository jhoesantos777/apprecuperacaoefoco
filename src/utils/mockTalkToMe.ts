
interface Message {
  role: 'user' | 'assistant';
  content: string;
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
  const userMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
  
  try {
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

    // Check for specific questions
    const questionPatterns = {
      'como lidar': [
        'Entendo sua busca por estratégias de enfrentamento. Vamos trabalhar juntos em técnicas específicas para sua situação. Poderia me contar mais sobre os momentos em que você sente maior dificuldade? Isso nos ajudará a desenvolver um plano personalizado.',
        'Cada pessoa encontra diferentes formas de lidar com os desafios da recuperação. Vamos explorar quais estratégias podem funcionar melhor para você. Que métodos você já tentou? O que funcionou e o que não funcionou?'
      ],
      'quanto tempo': [
        'A recuperação é uma jornada individual e cada pessoa tem seu próprio ritmo. Em vez de focar no tempo, vamos nos concentrar em como fortalecer suas estratégias de recuperação no presente. Como você tem medido seu progresso até agora?',
        'É natural querer saber sobre prazos, mas cada jornada é única. O mais importante é fortalecer suas ferramentas de recuperação diariamente. Que aspectos da sua recuperação você sente que precisam de mais atenção agora?'
      ],
      'por que': [
        'Sua pergunta sobre os motivos é muito importante e mostra seu desejo de compreender melhor o processo. Vamos explorar juntos os fatores que podem estar contribuindo para essa situação. Como você tem percebido esse aspecto afetando sua recuperação?',
        'Entender o "por quê" é uma parte importante do processo de recuperação. Isso nos ajuda a desenvolver estratégias mais efetivas. Poderia me contar mais sobre quando você começou a notar isso?'
      ]
    };

    // Default responses for when no specific pattern is matched
    const defaultResponses = [
      'Agradeço você compartilhar isso comigo. Como tem sido lidar com essa situação no seu dia a dia? Podemos explorar juntos algumas estratégias que podem ajudar.',
      'Sua experiência é válida e importante. Vamos trabalhar juntos para encontrar as melhores formas de fortalecer sua recuperação. O que você sente que seria mais útil neste momento?',
      'Obrigado por confiar em mim para compartilhar isso. Como você tem se sentido ao lidar com essa situação? Podemos desenvolver estratégias específicas para ajudar.'
    ];

    // Find matching topic response
    let response = '';
    for (const [topic, responses] of Object.entries(topicResponses)) {
      if (userMessage.toLowerCase().includes(topic)) {
        response = responses[Math.floor(Math.random() * responses.length)];
        break;
      }
    }

    // If no topic matched, check for question patterns
    if (!response) {
      for (const [pattern, responses] of Object.entries(questionPatterns)) {
        if (userMessage.toLowerCase().includes(pattern)) {
          response = responses[Math.floor(Math.random() * responses.length)];
          break;
        }
      }
    }

    // If still no match, use default response
    if (!response) {
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    return { message: response };
    
  } catch (error) {
    console.error('Error in mock API response:', error);
    return { 
      message: 'Desculpe, estou tendo dificuldade para processar sua mensagem. Poderia reformular de outra maneira?' 
    };
  }
};

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
