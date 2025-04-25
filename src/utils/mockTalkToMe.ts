interface Message {
  role: 'user' | 'assistant';
  content: string;
  mood?: string;
}

interface MockApiResponse {
  message: string;
}

// Custom system prompt for the addiction counselor persona
const getSystemPrompt = (mood: string) => {
  const basePrompt = `You are an experienced psychologist and addiction counselor with deep expertise in chemical dependency treatment. Your responses should be:
- Empathetic and non-judgmental
- Based on evidence-based practices in addiction treatment
- Focused on harm reduction and recovery support
- Tailored to the emotional state of the client
- In Portuguese language always
- Brief but meaningful (max 4-5 sentences)
`;

  const moodContext = mood === 'sad' 
    ? "\nThe client is currently feeling down or sad. Provide extra emotional support while maintaining professional boundaries."
    : mood === 'happy'
    ? "\nThe client is in a positive mood. Help reinforce this positivity while staying focused on recovery goals."
    : "\nThe client's mood is neutral. Focus on practical support and coping strategies.";

  return basePrompt + moodContext;
};

// Mock implementation for development
export const mockTalkToMeApi = async (
  messages: Message[], 
  mood: string
): Promise<MockApiResponse> => {
  // Get the last user message
  const userMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
  
  try {
    // First, check for specific topics in the user message
    const topicResponses: {[key: string]: string[]} = {
      ansiedade: [
        'Entendo sua preocupação com ansiedade. Vamos trabalhar algumas técnicas de respiração juntos? Inspire profundamente por 4 segundos, segure por 2, e expire por 6. Como você se sente após fazer isso?',
        'A ansiedade pode ser muito desafiadora. Você tem identificado situações específicas que aumentam sua ansiedade? Podemos desenvolver estratégias específicas para esses momentos.',
        'É normal sentir ansiedade durante a recuperação. Que tal focarmos no momento presente? O que você consegue ver, ouvir e sentir agora?'
      ],
      'recaída': [
        'Recaídas são parte do processo de recuperação. O importante é como reagimos a elas. Você pode me contar mais sobre o que está sentindo neste momento?',
        'Vamos analisar juntos o que pode ter contribuído para essa situação? Identificar os gatilhos nos ajuda a fortalecer suas estratégias de prevenção.',
        'Você está dando um passo importante ao falar sobre isso. Que tipo de suporte você sente que precisa agora?'
      ],
      'sono': [
        'Problemas com sono são comuns durante a recuperação. Você tem mantido uma rotina regular para dormir? Vamos trabalhar em algumas estratégias juntos.',
        'O sono é fundamental para sua recuperação. Como tem sido sua rotina antes de dormir? Podemos ajustar alguns hábitos para melhorar seu descanso.',
        'Dificuldades para dormir podem ser frustrantes. Você tem praticado alguma técnica de relaxamento antes de dormir?'
      ],
      'família': [
        'As relações familiares podem ser complexas durante a recuperação. Como você tem se comunicado com sua família sobre suas necessidades?',
        'É importante estabelecer limites saudáveis com a família. Que tipo de apoio você sente que precisa deles neste momento?',
        'Sua família é parte importante da sua rede de apoio. Como podemos trabalhar para fortalecer esses laços de forma saudável?'
      ],
      'solidão': [
        'A sensação de solidão é comum, mas você não está sozinho nesta jornada. Você tem participado de grupos de apoio ou outras atividades sociais?',
        'É importante construir uma rede de apoio. Quem são as pessoas com quem você pode contar quando precisa conversar?',
        'Momentos de solidão podem ser desafiadores. Como você tem lidado com esses sentimentos?'
      ]
    };

    const moodResponses = {
      happy: [
        'Que bom ver você bem hoje! Como podemos manter esse momento positivo? Conte-me mais sobre o que está funcionando para você.',
        'Sua energia positiva é inspiradora! Como você tem conseguido manter esse estado de espírito?',
        'É ótimo que você esteja se sentindo bem! Vamos aproveitar esse momento para fortalecer suas estratégias de recuperação.'
      ],
      neutral: [
        'Como posso ajudá-lo hoje? Estou aqui para conversarmos sobre qualquer aspecto da sua jornada.',
        'Às vezes, dias neutros são bons para reflexão. Sobre o que você gostaria de conversar?',
        'Seu equilíbrio é importante. Como você tem mantido sua estabilidade?'
      ],
      sad: [
        'Percebo que hoje está mais difícil. Pode me contar um pouco mais sobre o que está te deixando assim?',
        'Seus sentimentos são válidos e importantes. Como posso te ajudar a lidar com esse momento?',
        'Dias difíceis fazem parte da jornada, mas vão passar. O que você acha que poderia trazer um pouco de conforto agora?'
      ]
    };

    // Check if the message contains any of our specific topics
    let response = '';
    let topicFound = false;

    // First try to match specific topics
    Object.entries(topicResponses).forEach(([topic, responses]) => {
      if (userMessage.toLowerCase().includes(topic)) {
        const randomIndex = Math.floor(Math.random() * responses.length);
        response = responses[randomIndex];
        topicFound = true;
      }
    });

    // If no specific topic was found, analyze the message for questions
    if (!topicFound) {
      const isQuestion = userMessage.includes('?') || 
                        userMessage.toLowerCase().includes('como') ||
                        userMessage.toLowerCase().includes('o que') ||
                        userMessage.toLowerCase().includes('quando') ||
                        userMessage.toLowerCase().includes('onde') ||
                        userMessage.toLowerCase().includes('por que');

      const moodType = mood === 'happy' ? 'happy' : mood === 'sad' ? 'sad' : 'neutral';
      const moodResponseList = moodResponses[moodType];
      
      if (isQuestion) {
        // If it's a question, provide a more specific response based on the question content
        const words = userMessage.split(' ').filter(word => word.length > 3);
        const keyWord = words[Math.floor(Math.random() * words.length)];
        response = `Entendo sua pergunta sobre "${keyWord}". ${moodResponseList[0]} Pode me contar mais sobre suas expectativas em relação a isso?`;
      } else {
        // If it's not a question, provide a mood-based response and ask a follow-up
        const randomIndex = Math.floor(Math.random() * moodResponseList.length);
        response = moodResponseList[randomIndex];
        
        // Add a contextual follow-up question
        if (userMessage.length > 0) {
          const words = userMessage.split(' ').filter(word => word.length > 4);
          if (words.length > 0) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            response += ` Você mencionou "${randomWord}" - poderia me explicar melhor como isso se relaciona com o que você está sentindo?`;
          }
        }
      }
    }

    return { message: response };
    
  } catch (error) {
    console.error('Error in mock API response:', error);
    
    // Fallback responses in case of API failure
    let fallbackResponse = 'Desculpe, estou tendo dificuldades técnicas no momento. ' +
      'Por favor, tente novamente em alguns instantes. ' +
      'Se precisar de ajuda imediata, considere contatar seu conselheiro ou linha de apoio.';
    
    if (mood === 'sad') {
      fallbackResponse += ' Lembre-se que você não está sozinho nessa jornada.';
    }
    
    return { message: fallbackResponse };
  }
};

// Mock API function to be used in the TalkToMe component
export const fetchMockTalkToMeApi = async (
  messages: Message[], 
  mood: string
): Promise<Response> => {
  try {
    const data = await mockTalkToMeApi(messages, mood);
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
