
// This file contains mock implementations for the Talk To Me API

interface Message {
  role: 'user' | 'assistant';
  content: string;
  mood?: string;
}

export const fetchMockTalkToMeApi = async (messages: Message[]): Promise<Response> => {
  console.log('Mock API called with messages:', messages);
  
  // Get the last message to respond to (should be from user)
  const lastMessage = messages[messages.length - 1];
  const userMood = lastMessage?.mood || 'neutral';
  
  // Create a response based on the user's message and mood
  let responseText = '';
  
  if (lastMessage && lastMessage.content) {
    const userContent = lastMessage.content.toLowerCase();
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check for specific topics to respond to
    if (userContent.includes('ajuda') || userContent.includes('socorro')) {
      responseText = "Estou aqui para te ajudar. Lembre-se que você não está sozinho nesse processo. Quais são seus principais desafios no momento?";
    }
    else if (userContent.includes('recaída') || userContent.includes('recai')) {
      responseText = "Recaídas fazem parte do processo de recuperação. O importante é não desistir e aprender com cada experiência. Vamos conversar sobre o que te levou a essa situação e como podemos criar estratégias para evitar isso no futuro.";
    }
    else if (userContent.includes('ansiedade') || userContent.includes('ansioso')) {
      responseText = "A ansiedade é comum durante o processo de recuperação. Algumas técnicas que podem ajudar incluem respiração profunda, meditação e atividade física. Você já experimentou alguma dessas abordagens?";
    }
    else if (userContent.includes('família') || userContent.includes('amigos')) {
      responseText = "O apoio da família e amigos é fundamental para a recuperação. Como está seu relacionamento com eles atualmente? Há alguma forma específica em que eles poderiam te apoiar melhor?";
    }
    else if (userContent.includes('tratamento') || userContent.includes('terapia')) {
      responseText = "O tratamento profissional é um grande passo. Terapia individual, grupos de apoio e, em alguns casos, medicação podem fazer parte desse processo. Você já iniciou algum tipo de tratamento?";
    }
    else if (userContent.includes('como estou') || userContent.includes('como vai')) {
      responseText = "Obrigado por perguntar! Estou aqui para te acompanhar em seu processo de recuperação. E você, como está se sentindo hoje?";
    }
    else if (userContent.includes('obrigado') || userContent.includes('agradeço')) {
      responseText = "Estou aqui para ajudar. Continue firme no seu processo de recuperação, cada passo é importante.";
    }
    else {
      // Mood-based generic responses
      switch (userMood) {
        case 'happy':
          responseText = "É ótimo ver você animado! Esse sentimento positivo é valioso no seu processo de recuperação. Como você pretende aproveitar essa energia hoje?";
          break;
        case 'sad':
          responseText = "Entendo que você esteja se sentindo triste. Estes sentimentos são normais e fazem parte do processo. Gostaria de conversar sobre o que está te deixando assim?";
          break;
        case 'angry':
          responseText = "Percebo sua frustração. A raiva é uma emoção natural que precisa ser reconhecida. Vamos trabalhar juntos para entender o que está causando esse sentimento e como podemos lidar com ele de forma saudável.";
          break;
        case 'neutral':
        default:
          responseText = "Agradeço por compartilhar seus pensamentos. Estou aqui para te apoiar nessa jornada. Tem algo específico sobre sua recuperação que gostaria de discutir hoje?";
      }
    }
  } else {
    responseText = "Olá! Como posso ajudar você hoje no seu processo de recuperação?";
  }
  
  // Create a mock response object
  return new Response(
    JSON.stringify({ message: responseText }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
};
