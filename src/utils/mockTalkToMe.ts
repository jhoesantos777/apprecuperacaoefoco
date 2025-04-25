
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
    // For development without API key, return mock responses based on mood and message content
    // Base responses according to mood
    const moodResponses = {
      happy: [
        'É ótimo ver você se sentindo bem hoje! Essa energia positiva é valiosa na sua jornada de recuperação. Como podemos aproveitar esse bom momento para fortalecer suas estratégias de enfrentamento?',
        'Que bom que está se sentindo positivo! Vamos utilizar esse momento para refletir sobre o que tem funcionado bem no seu processo de recuperação.',
        'Sua atitude positiva é inspiradora! Como podemos transformar esse bom momento em ferramentas para os dias mais desafiadores?'
      ],
      neutral: [
        'Obrigado por compartilhar como está se sentindo. Manter esse diálogo aberto é fundamental para o processo de recuperação.',
        'Entendo que hoje você está se sentindo neutro. Esses momentos são importantes para reflexão e planejamento do próximo passo.',
        'Mesmo nos dias comuns, cada passo em sua recuperação é significativo. O que podemos trabalhar hoje?'
      ],
      sad: [
        'Entendo que hoje está sendo um dia difícil para você. Seus sentimentos são válidos e faz parte do processo ter momentos assim. Respire fundo e lembre-se que essa sensação vai passar.',
        'Dias difíceis fazem parte da jornada de recuperação. É importante acolher esses sentimentos sem julgamento. O que poderia trazer um pouco de alívio hoje?',
        'Sinto que você está enfrentando dificuldades hoje. Lembre-se que esse momento vai passar e você tem desenvolvido habilidades importantes para lidar com esses desafios.'
      ]
    };
    
    // Topic-based responses that are relevant regardless of mood
    const topicResponses: {[key: string]: string[]} = {
      ansiedade: [
        'A ansiedade pode ser desafiadora durante o processo de recuperação. Tente exercícios de respiração profunda - inspire por 4 segundos, segure por 2, expire por 6. Essa técnica simples pode ajudar a acalmar seu sistema nervoso.',
        'Quando a ansiedade aparece, observe-a como um visitante temporário. Tente praticar o "surf na onda" - observar a ansiedade subir e descer sem lutar contra ela. Quais técnicas de manejo de ansiedade têm funcionado para você?',
        'A ansiedade muitas vezes vem de pensamentos sobre o futuro. Tente trazer sua atenção para o momento presente através dos cinco sentidos: observe 5 coisas que você vê, 4 que pode tocar, 3 que pode ouvir, 2 que pode cheirar e 1 que pode provar.'
      ],
      recaída: [
        'Recaídas fazem parte do processo de recuperação para muitas pessoas. Não significa fracasso, mas uma oportunidade de aprendizado. O importante é como você responde a esse momento.',
        'Vamos analisar essa situação como um cientista analisaria um experimento - com curiosidade e sem julgamento. O que aconteceu antes da recaída? Quais foram os gatilhos? Esta informação é valiosa para fortalecer seu plano de prevenção.',
        'Uma recaída não apaga todo seu progresso anterior. É importante retomar seu caminho o mais rápido possível e aprender com essa experiência. O que você acha que poderia fazer diferente da próxima vez?'
      ],
      sono: [
        'O sono é fundamental para a recuperação, pois ajuda a regular emoções e reduzir desejos. Tente criar uma rotina consistente antes de dormir, como ler algo leve ou praticar relaxamento muscular progressivo.',
        'Problemas de sono são comuns durante a recuperação. Considere limitar cafeína após o meio-dia, criar um ambiente escuro e fresco para dormir, e evitar telas uma hora antes de deitar.',
        'Quando não conseguimos dormir, muitas vezes nos preocupamos com isso, o que piora a situação. Se não conseguir dormir após 20 minutos, levante-se, vá para outro cômodo, faça algo relaxante e retorne quando sentir sono.'
      ],
      família: [
        'Relacionamentos familiares podem ser complexos durante a recuperação. É importante estabelecer limites saudáveis e comunicar suas necessidades com clareza e sem culpa.',
        'Sua família pode precisar de tempo para reconstruir a confiança. Lembre-se que ações consistentes ao longo do tempo comunicam mais que palavras. Quais pequenos passos você pode dar nessa direção?',
        'Considere convidar membros da família para participar de sessões de terapia familiar. Isso pode ajudá-los a entender melhor a dependência e como apoiar sua recuperação de forma saudável.'
      ]
    };
    
    // Determine the appropriate response
    let response = '';
    
    // First check if the message contains specific topics
    let topicFound = false;
    
    Object.entries(topicResponses).forEach(([topic, responses]) => {
      if (userMessage.toLowerCase().includes(topic)) {
        // Randomly select a response for the identified topic
        const randomIndex = Math.floor(Math.random() * responses.length);
        response = responses[randomIndex];
        topicFound = true;
      }
    });
    
    // If no specific topic was found, respond based on mood
    if (!topicFound) {
      const moodType = mood === 'happy' ? 'happy' : mood === 'sad' ? 'sad' : 'neutral';
      const responses = moodResponses[moodType];
      const randomIndex = Math.floor(Math.random() * responses.length);
      response = responses[randomIndex];
      
      // Add a question based on the user's message if not empty
      if (userMessage.length > 0) {
        // Extract a potential keyword from the user message
        const words = userMessage.split(' ').filter(word => word.length > 4);
        if (words.length > 0) {
          const randomWord = words[Math.floor(Math.random() * words.length)];
          response += ` Você mencionou "${randomWord}" - poderia me contar mais sobre como isso está afetando você neste momento?`;
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
