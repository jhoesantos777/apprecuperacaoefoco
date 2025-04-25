
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
    // For development without API key, return mock responses based on mood
    let response = '';
    
    if (mood === 'happy') {
      response = 'É ótimo ver você se sentindo bem hoje! Essa energia positiva é valiosa na sua jornada de recuperação. Como podemos aproveitar esse bom momento para fortalecer suas estratégias de enfrentamento? Continue cultivando esses momentos positivos.';
    } else if (mood === 'sad') {
      response = 'Entendo que hoje está sendo um dia difícil para você. Seus sentimentos são válidos e faz parte do processo ter momentos assim. Respire fundo e lembre-se que essa sensação vai passar. Você tem ferramentas para lidar com isso e não está sozinho nessa jornada.';
    } else {
      response = 'Obrigado por compartilhar como está se sentindo. Manter esse diálogo aberto é fundamental para o processo de recuperação. Que estratégias têm funcionado melhor para você ultimamente? Vamos continuar construindo sua resiliência dia após dia.';
    }
    
    // If the user message contains specific keywords, customize the response
    if (userMessage.toLowerCase().includes('ansioso') || userMessage.toLowerCase().includes('ansiedade')) {
      response = 'A ansiedade pode ser desafiadora durante o processo de recuperação. Tente exercícios de respiração profunda - inspire por 4 segundos, segure por 2, expire por 6. Essa técnica simples pode ajudar a acalmar seu sistema nervoso. Você está desenvolvendo ferramentas importantes para lidar com essas situações.';
    }
    
    if (userMessage.toLowerCase().includes('recaída') || userMessage.toLowerCase().includes('recai')) {
      response = 'Recaídas fazem parte do processo de recuperação para muitas pessoas. Não significa fracasso, mas uma oportunidade de aprendizado. O importante é como você responde a esse momento. Vamos identificar os gatilhos e fortalecer seu plano de prevenção de recaídas.';
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
