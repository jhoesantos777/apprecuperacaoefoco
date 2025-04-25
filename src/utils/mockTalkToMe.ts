
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  mood?: string;
}

interface MockApiResponse {
  message: string;
}

// This is a mock implementation of the AI chat functionality
// In a real implementation, this would call the OpenAI API
export const mockTalkToMeApi = async (
  messages: Message[], 
  mood: string
): Promise<MockApiResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  
  // Get the last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
  
  // Simple pattern matching for different types of messages
  let response = '';
  
  if (lastUserMessage.toLowerCase().includes('olá') || 
      lastUserMessage.toLowerCase().includes('oi') || 
      lastUserMessage.toLowerCase().includes('bom dia') || 
      lastUserMessage.toLowerCase().includes('boa tarde') || 
      lastUserMessage.toLowerCase().includes('boa noite')) {
    response = 'Olá! É bom conversar com você. Como tem sido sua jornada de recuperação recentemente?';
  } 
  else if (lastUserMessage.toLowerCase().includes('recaída') || 
      lastUserMessage.toLowerCase().includes('recai')) {
    response = 'Recaídas fazem parte do processo de recuperação. Não se culpe excessivamente. O importante é reconhecer o que aconteceu e seguir em frente. Cada dia é uma nova oportunidade para escolher o caminho da sobriedade. O que você acha que desencadeou essa situação?';
  }
  else if (lastUserMessage.toLowerCase().includes('tentado') || 
      lastUserMessage.toLowerCase().includes('tentação') ||
      lastUserMessage.toLowerCase().includes('vontade')) {
    response = 'Você está enfrentando essa tentação com grande força. Lembre-se de usar as técnicas que aprendeu: respiração profunda, contatar seu grupo de apoio, ou se envolver em alguma atividade que lhe traga prazer saudável. Você tem mais força do que imagina para superar esses momentos.';
  }
  else if (lastUserMessage.toLowerCase().includes('família') || 
      lastUserMessage.toLowerCase().includes('amigos') || 
      lastUserMessage.toLowerCase().includes('relacionamento')) {
    response = 'Os relacionamentos podem ser profundamente afetados pela dependência química, mas também são fontes importantes de apoio na recuperação. Comunicação honesta e paciência são fundamentais para reconstruir a confiança. Você está considerando conversar abertamente com eles sobre suas necessidades e sentimentos?';
  }
  else if (lastUserMessage.toLowerCase().includes('ansiedade') || 
      lastUserMessage.toLowerCase().includes('ansioso') || 
      lastUserMessage.toLowerCase().includes('medo')) {
    response = 'A ansiedade é muito comum durante o processo de recuperação. Seu corpo e mente estão se ajustando a um novo equilíbrio. Técnicas de mindfulness e respiração consciente podem ajudar a acalmar esses sentimentos. Lembre-se que é normal sentir ansiedade, mas ela não define quem você é ou seu potencial de recuperação.';
  }
  else if (mood === 'sad') {
    response = 'Percebo que você não está se sentindo bem hoje. É importante reconhecer esses sentimentos, mas lembre-se que eles são temporários. Mesmo nos dias difíceis, cada momento que você escolhe a sobriedade é uma vitória. O que poderia trazer um pouco mais de conforto para você hoje?';
  }
  else if (mood === 'happy') {
    response = 'É maravilhoso ver que você está se sentindo bem! Esses momentos positivos são preciosos e fazem parte da sua jornada de recuperação. Aproveite esse estado de espírito para fortalecer suas estratégias de enfrentamento e celebrar seu progresso.';
  }
  else {
    // Default responses
    const defaultResponses = [
      "Obrigado por compartilhar isso comigo. Como essa situação tem afetado seu bem-estar dia a dia?",
      "Sua força em buscar ajuda e falar sobre isso é admirável. O que você acredita que poderia ajudá-lo nesse momento específico?",
      "Entendo que esse é um período desafiador. Lembre-se que a recuperação é uma jornada com altos e baixos. Como você tem lidado com os momentos mais difíceis?",
      "Cada passo que você dá em direção à sua recuperação, por menor que pareça, é uma vitória significativa. Quais pequenas vitórias você teve recentemente?",
      "É normal ter esses sentimentos durante o processo de recuperação. Você tem alguma técnica específica que tem ajudado quando esses pensamentos surgem?",
      "Sua experiência é única e importante. Como posso apoiá-lo melhor durante essa conversa?",
      "A dependência química afeta muitos aspectos da vida, mas com o apoio adequado, a recuperação é possível. Você tem uma rede de apoio com quem pode contar?",
      "Obrigado por sua coragem em compartilhar. Cada conversa como esta é um passo em sua jornada de recuperação."
    ];
    
    // Select a random response
    const randomIndex = Math.floor(Math.random() * defaultResponses.length);
    response = defaultResponses[randomIndex];
  }
  
  // Add a supportive closing message
  const closingMessages = [
    "Estou aqui para apoiá-lo nessa jornada.",
    "Lembre-se que você não está sozinho nesse processo.",
    "Cada dia é uma nova oportunidade para cuidar de si mesmo.",
    "Sua força em enfrentar esses desafios é inspiradora.",
    "Continue buscando apoio—isso é um sinal de força, não de fraqueza."
  ];
  
  const randomClosingIndex = Math.floor(Math.random() * closingMessages.length);
  response += "\n\n" + closingMessages[randomClosingIndex];
  
  return { message: response };
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
