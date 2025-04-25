import { useToast } from "@/hooks/use-toast";

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

// This is a mock implementation of the AI chat functionality
// In a real implementation, this would call the OpenAI API
export const mockTalkToMeApi = async (
  messages: Message[], 
  mood: string
): Promise<MockApiResponse> => {
  // Get the last user message
  const userMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(mood)
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    return { message: data.choices[0].message.content };
  } catch (error) {
    console.error('Error getting AI response:', error);
    
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
