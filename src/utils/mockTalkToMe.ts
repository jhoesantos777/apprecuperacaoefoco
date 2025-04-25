
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

  const moodContext = mood === 'happy' 
    ? "\nThe client is currently feeling good. Reinforce their positive state while maintaining focus on recovery goals."
    : mood === 'sad'
    ? "\nThe client is feeling down or sad. Provide extra emotional support while maintaining professional boundaries."
    : "\nThe client's mood is neutral. Focus on practical support and coping strategies.";

  return basePrompt + moodContext;
};

// Enhanced mock implementation for development
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
        'A ansiedade é uma resposta comum durante a recuperação. Vamos trabalhar em técnicas de respiração? Inspire por 4 segundos, segure por 2, e expire por 6. Como isso afeta seu desejo por substâncias?',
        'Entendo sua preocupação com ansiedade. Muitas vezes ela está conectada aos gatilhos de uso. Você consegue identificar situações específicas que aumentam tanto sua ansiedade quanto seu desejo?',
        'A ansiedade que você sente é normal nesse processo. Vamos trabalhar juntos em estratégias para lidar com ela sem recorrer às substâncias. Como tem sido essa experiência para você?'
      ],
      'recaída': [
        'Recaídas são parte do processo de recuperação, não significam fracasso. O importante é aprender com elas. Como você tem lidado com seus gatilhos recentemente?',
        'Falar sobre recaída mostra coragem e autoconsciência. Vamos analisar juntos os fatores que podem estar contribuindo para esses pensamentos? A identificação de gatilhos é fundamental.',
        'Preocupações com recaída são válidas e mostram seu comprometimento. Você tem mantido contato com sua rede de apoio? Lembre-se que isolamento muitas vezes precede a recaída.'
      ],
      'abstinência': [
        'Os sintomas de abstinência podem ser desafiadores, mas são temporários. Quais têm sido os mais difíceis para você enfrentar atualmente?',
        'A abstinência é uma prova do processo de cura do seu corpo. Você tem conseguido separar o desconforto físico dos pensamentos sobre uso?',
        'Durante a abstinência, é importante cuidar de necessidades básicas como sono e alimentação. Como tem sido sua rotina de autocuidado nesse período?'
      ],
      'família': [
        'As relações familiares podem ser complexas durante a recuperação. Como tem sido a comunicação com sua família sobre suas necessidades no processo de recuperação?',
        'Sua família é parte importante da sua rede de apoio, mas também precisa entender os desafios da dependência química. Eles têm participado de grupos de apoio para familiares?',
        'Reconstruir a confiança familiar leva tempo. Quais pequenos passos você tem dado para fortalecer esses laços de forma saudável?'
      ],
      'gatilhos': [
        'Identificar gatilhos é fundamental para a recuperação sustentável. Quais situações, pessoas ou emoções você percebe que aumentam seu desejo por substâncias?',
        'Trabalhar com gatilhos envolve reconhecer, evitar quando possível, e desenvolver estratégias de enfrentamento. Como você tem respondido quando se depara com um gatilho?',
        'Os gatilhos mudam ao longo do tempo e é importante revisitar regularmente suas estratégias. Algum novo gatilho surgiu recentemente em sua vida?'
      ],
      'sono': [
        'Problemas de sono são comuns durante a recuperação pois seu corpo está reaprendendo a funcionar sem substâncias. Como tem sido sua higiene do sono?',
        'Um sono reparador é fundamental para a recuperação. Você tem praticado técnicas de relaxamento antes de dormir, como meditação ou respiração profunda?',
        'Alterações no sono podem ser frustrantes, mas geralmente melhoram com o tempo. Você mantém horários regulares para dormir e acordar?'
      ],
      'solidão': [
        'A sensação de solidão é comum na recuperação, especialmente quando houve afastamento de círculos sociais ligados ao uso. Você tem encontrado novos espaços de pertencimento?',
        'Conectar-se com outros em recuperação pode diminuir o sentimento de isolamento. Como tem sido sua experiência em grupos de apoio?',
        'A solidão muitas vezes esconde medos e inseguranças sobre criar novas relações. Que pequenos passos você poderia dar para ampliar sua rede de apoio?'
      ],
      'medicação': [
        'O tratamento medicamentoso pode ser um importante aliado na recuperação da dependência química. Você tem seguido as orientações médicas corretamente?',
        'É essencial ser transparente com sua equipe médica sobre qualquer efeito colateral ou dificuldades com a medicação. Como tem sido essa comunicação?',
        'Muitas pessoas em recuperação têm receios sobre medicamentos. Quais são suas principais dúvidas ou preocupações sobre seu tratamento atual?'
      ]
    };

    // More comprehensive mood-based responses
    const moodResponses = {
      happy: [
        'É motivador ver você bem hoje! Esse estado positivo é uma força importante na recuperação. Como você tem conseguido manter esse bem-estar? Quais estratégias estão funcionando para você?',
        'Sua energia positiva é um recurso valioso! Como você planeja usar esse momento favorável para fortalecer suas práticas de recuperação?',
        'Momentos de bem-estar são importantes de se reconhecer e celebrar na jornada de recuperação. O que você tem feito diferente que contribuiu para esse estado?'
      ],
      neutral: [
        'Momentos de estabilidade são valiosos no processo de recuperação. Como você tem mantido seu equilíbrio diante dos desafios diários?',
        'A constância emocional que você demonstra é um bom sinal. Que aspectos da sua rotina você acredita que estão contribuindo para essa estabilidade?',
        'Dias de neutralidade emocional proporcionam boas oportunidades para reflexão. Como você tem aproveitado essa clareza para avaliar seu progresso?'
      ],
      sad: [
        'Percebo que hoje está sendo um momento mais desafiador. Lembre-se que sentimentos difíceis são parte do processo e não diminuem seu progresso. O que especificamente está contribuindo para esse sentimento?',
        'Sentir-se para baixo durante a recuperação é normal e não significa retrocesso. Como você tem lidado com esses momentos sem recorrer a comportamentos de risco?',
        'Seus sentimentos são válidos e importantes. Em dias difíceis como hoje, quais estratégias de autocuidado você pode ativar? O que tem funcionado no passado?'
      ]
    };

    // Check for questions about specific addiction-related topics
    const specificQuestions: {[key: string]: string[]} = {
      'como lidar com': [
        'Lidar com os desafios da recuperação envolve desenvolver novas habilidades de enfrentamento. Você já experimentou técnicas de mindfulness ou atenção plena? Elas podem ajudar a navegar momentos difíceis sem recorrer ao uso de substâncias.',
        'Desenvolver estratégias para lidar com situações desafiadoras é fundamental. Você tem um plano de prevenção de recaída que inclui passos concretos para momentos de maior vulnerabilidade?',
        'Aprender a lidar com dificuldades sem substâncias é uma habilidade que se desenvolve com prática. Quais recursos de sua rede de apoio você poderia acionar nesses momentos?'
      ],
      'quando vou': [
        'O processo de recuperação é individual e não segue uma linha do tempo fixa. O mais importante é reconhecer e valorizar seu progresso diário, por menor que pareça. Como você tem celebrado suas pequenas vitórias?',
        'Perguntas sobre o futuro da recuperação são comuns e compreensíveis. Mais do que pensar em quando algo vai acontecer, é importante focar nas ferramentas que você está construindo hoje. Quais habilidades você sente que tem fortalecido?',
        'A recuperação acontece no tempo presente, um dia de cada vez. Em vez de focar em quando certos sintomas vão passar, podemos trabalhar em como fortalecer sua resiliência hoje. O que você poderia fazer nas próximas 24 horas para cuidar de si?'
      ],
      'por que sinto': [
        'Os sentimentos durante a recuperação são complexos e muitas vezes resultam de alterações neurobiológicas, traumas passados e novos desafios. O mais importante é acolher essas emoções sem julgamento. Como você tem lidado com esses sentimentos?',
        'O que você está sentindo é uma resposta natural do corpo e da mente durante o processo de recuperação. Nomear essas emoções é o primeiro passo para processá-las de forma saudável. Você consegue descrever mais detalhadamente essa sensação?',
        'Seus sentimentos durante a recuperação têm raízes em mudanças físicas, emocionais e sociais. Compreender esses sentimentos como parte do processo, não como obstáculos, pode ajudar a integrá-los na sua jornada. Tem usado algum recurso como diário ou arte para expressar essas emoções?'
      ],
      'como saber se': [
        'O autoconhecimento se desenvolve gradualmente na recuperação. Observar seus padrões de pensamento, emoções e comportamentos ao longo do tempo pode trazer importantes insights. Você tem mantido algum registro diário de suas experiências?',
        'Saber identificar sinais sobre si mesmo é uma habilidade importante. Muitas vezes, pessoas próximas de confiança também podem oferecer perspectivas valiosas. Você tem alguém com quem pode verificar suas percepções?',
        'Aprender a reconhecer sinais do seu corpo e mente é parte fundamental da recuperação. A prática regular de momentos de reflexão, como meditação ou escrita, pode aumentar essa consciência. Que práticas de autoconsciência você tem incorporado à sua rotina?'
      ]
    };

    // Check if the message contains any of our specific topics or questions
    let response = '';
    let topicFound = false;

    // First try to match specific topics
    for (const [topic, responses] of Object.entries(topicResponses)) {
      if (userMessage.toLowerCase().includes(topic)) {
        const randomIndex = Math.floor(Math.random() * responses.length);
        response = responses[randomIndex];
        topicFound = true;
        break;
      }
    }

    // If no topic matched, check for specific question patterns
    if (!topicFound) {
      for (const [questionPattern, responses] of Object.entries(specificQuestions)) {
        if (userMessage.toLowerCase().includes(questionPattern)) {
          const randomIndex = Math.floor(Math.random() * responses.length);
          response = responses[randomIndex];
          topicFound = true;
          break;
        }
      }
    }

    // If still no specific topic or question pattern was found
    if (!topicFound) {
      // Analyze if it's a question by common question markers in Portuguese
      const isQuestion = userMessage.includes('?') || 
                        userMessage.toLowerCase().includes('como') ||
                        userMessage.toLowerCase().includes('o que') ||
                        userMessage.toLowerCase().includes('quando') ||
                        userMessage.toLowerCase().includes('onde') ||
                        userMessage.toLowerCase().includes('por que') ||
                        userMessage.toLowerCase().includes('quem') ||
                        userMessage.toLowerCase().includes('qual');

      // Get mood-appropriate responses
      const moodType = mood === 'happy' ? 'happy' : mood === 'sad' ? 'sad' : 'neutral';
      const moodResponseList = moodResponses[moodType];
      
      if (isQuestion) {
        // If it's a question not covered by specific patterns, create a contextual response
        // Extract meaningful words to reference in the response
        const words = userMessage.split(' ').filter(word => word.length > 3);
        
        if (words.length > 0) {
          // Pick a relevant word from the question to acknowledge
          const keyWords = words.filter(w => !['como', 'quando', 'onde', 'porque', 'quem', 'qual'].includes(w.toLowerCase()));
          const keyWord = keyWords.length > 0 ? 
            keyWords[Math.floor(Math.random() * keyWords.length)] : 
            words[Math.floor(Math.random() * words.length)];

          const questionResponses = [
            `Sua pergunta sobre "${keyWord}" é muito relevante no processo de recuperação. ${moodResponseList[0]} Poderia me contar mais sobre o que despertou essa questão agora?`,
            `Quando você pergunta sobre "${keyWord}", isso me mostra sua busca por compreensão, o que é valioso na recuperação. ${moodResponseList[1]} Como esse aspecto tem impactado sua jornada?`,
            `É importante explorarmos essa questão sobre "${keyWord}" que você traz. ${moodResponseList[2]} Que outras dúvidas surgem quando você pensa sobre isso?`
          ];
          
          response = questionResponses[Math.floor(Math.random() * questionResponses.length)];
        } else {
          // If no meaningful words found, use a generic question response
          const genericQuestionResponses = [
            `Essa é uma pergunta importante. ${moodResponseList[0]} Poderia elaborar um pouco mais para que eu possa entender melhor o contexto?`,
            `Obrigado por compartilhar essa dúvida. ${moodResponseList[1]} Pode me contar mais sobre o que motivou essa pergunta hoje?`,
            `Sua pergunta toca em aspectos significativos da recuperação. ${moodResponseList[2]} Como você tem pensado sobre isso ultimamente?`
          ];
          
          response = genericQuestionResponses[Math.floor(Math.random() * genericQuestionResponses.length)];
        }
      } else {
        // For statements rather than questions, provide a mood-based response
        const randomIndex = Math.floor(Math.random() * moodResponseList.length);
        response = moodResponseList[randomIndex];
        
        // Add a thoughtful follow-up if the message has content to work with
        if (userMessage.length > 10) {
          const words = userMessage.split(' ').filter(word => word.length > 4);
          if (words.length > 0) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            
            const followUps = [
              ` Você mencionou "${randomWord}" - como isso se relaciona com seus objetivos de recuperação atualmente?`,
              ` Quando você fala sobre "${randomWord}", que emoções isso desperta em você?`,
              ` Sua menção a "${randomWord}" é interessante. Como esse aspecto tem influenciado sua jornada de recuperação?`
            ];
            
            response += followUps[Math.floor(Math.random() * followUps.length)];
          }
        }
      }
    }

    return { message: response };
    
  } catch (error) {
    console.error('Error in mock API response:', error);
    
    // Fallback responses in case of API failure
    const fallbackResponses = {
      happy: 'Desculpe pelo inconveniente técnico. Estamos tendo algumas dificuldades momentâneas. É positivo ver que você está se sentindo bem hoje - continue cultivando esse estado! Tente novamente em alguns instantes.',
      neutral: 'Estamos enfrentando algumas dificuldades técnicas neste momento. Por favor, tente novamente em alguns minutos. Lembre-se que a constância é uma força importante na recuperação.',
      sad: 'Sinto muito pela dificuldade técnica. Sei que pode ser frustrante, especialmente em momentos desafiadores. Lembre-se que você não está sozinho nessa jornada. Por favor, tente novamente em breve ou contate seu conselheiro se precisar de apoio imediato.'
    };
    
    const moodType = mood === 'happy' ? 'happy' : mood === 'sad' ? 'sad' : 'neutral';
    return { message: fallbackResponses[moodType] };
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
