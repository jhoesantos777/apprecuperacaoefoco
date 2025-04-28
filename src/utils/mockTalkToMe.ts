
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
      responseText = "Estou aqui para te ajudar durante essa jornada de recuperação. É importante que você saiba que não está sozinho - muitas pessoas passaram pelo mesmo processo e conseguiram superar a dependência. Quais são seus principais desafios neste momento? Está enfrentando gatilhos específicos? Problemas com abstinência? Dificuldades no ambiente familiar ou social? Quanto mais você compartilhar, melhor poderei direcionar nossas conversas para estratégias que funcionem especificamente para você.";
    }
    else if (userContent.includes('recaída') || userContent.includes('recai')) {
      responseText = "Recaídas são parte do processo de recuperação para muitas pessoas - não são um sinal de fracasso, mas uma oportunidade de aprendizado. Pesquisas mostram que 40-60% das pessoas em recuperação experimentam alguma recaída. O importante agora é identificar o que provocou essa situação: foi um gatilho emocional, social, um ambiente específico? Vamos analisar juntos o que aconteceu antes da recaída e desenvolver um plano de prevenção mais eficaz. Quais estratégias você já tentou para lidar com os momentos de impulso? Poderíamos trabalhar em técnicas de mindfulness e estratégias de substituição comportamental que estudos mostram serem eficazes na redução de recaídas.";
    }
    else if (userContent.includes('ansiedade') || userContent.includes('ansioso') || userContent.includes('ansied')) {
      responseText = "A ansiedade é extremamente comum durante o processo de recuperação - seu cérebro está se reajustando a funcionar sem a substância. Alguns estudos indicam que até 50% das pessoas em recuperação experimentam sintomas significativos de ansiedade nas primeiras semanas. Além das técnicas de respiração diafragmática (respiração profunda e lenta, contando até 4 na inspiração e até 6 na expiração), existem outras abordagens comprovadas cientificamente, como a prática regular de atividade física moderada, que libera endorfinas naturais, e técnicas de reestruturação cognitiva para identificar e desafiar pensamentos ansiosos. Você tem praticado alguma dessas técnicas? Podemos trabalhar em um plano personalizado para reduzir sua ansiedade de forma gradual e sustentável.";
    }
    else if (userContent.includes('família') || userContent.includes('amigos') || userContent.includes('familiar')) {
      responseText = "O apoio social é um dos fatores mais decisivos para o sucesso da recuperação a longo prazo. Estudos mostram que pessoas com sistema de apoio robusto têm taxas de recuperação significativamente maiores. Como está a dinâmica com sua família atualmente? Eles compreendem a dependência como uma condição de saúde ou ainda existem julgamentos? Em muitos casos, é útil incluir alguns familiares no processo terapêutico através de sessões de psicoeducação. Também poderia ser benéfico considerar grupos de apoio para familiares, como o Nar-Anon ou Al-Anon, que ajudam os entes queridos a entender melhor a dependência e aprender como apoiar sem co-dependência. Você acha que algum familiar estaria aberto a participar desse tipo de grupo?";
    }
    else if (userContent.includes('tratamento') || userContent.includes('terapia') || userContent.includes('terapi')) {
      responseText = "O tratamento profissional aumenta significativamente as chances de recuperação sustentável. Existem diversas modalidades comprovadas cientificamente: terapia cognitivo-comportamental, que ajuda a identificar e modificar padrões de pensamento ligados ao uso; entrevista motivacional, que fortalece sua própria motivação para mudança; terapia de aceitação e compromisso, que trabalha com a aceitação das emoções difíceis sem recorrer à substância; e em alguns casos, o tratamento medicamentoso supervisionado, que pode ajudar a reduzir a fissura e estabilizar a química cerebral. A combinação de terapia individual com grupos de apoio tem mostrado os melhores resultados a longo prazo. Em que fase do tratamento você se encontra? Gostaria de discutir opções específicas para seu caso?";
    }
    else if (userContent.includes('como estou') || userContent.includes('como vai')) {
      responseText = "Obrigado por perguntar! Estou aqui focado em ajudá-lo em sua jornada de recuperação. Na verdade, essa é uma ótima oportunidade para refletirmos sobre seu progresso. Como você avaliaria seu bem-estar hoje numa escala de 0 a 10? Quais aspectos da recuperação têm sido mais desafiadores recentemente? E quais pequenas vitórias você tem conquistado que talvez não esteja reconhecendo? Lembre-se que o progresso na recuperação nem sempre é linear - há dias mais difíceis e dias mais fáceis, mas cada momento de resistência à fissura é uma vitória importante.";
    }
    else if (userContent.includes('obrigado') || userContent.includes('agradeço')) {
      responseText = "Fico genuinamente feliz em poder fazer parte do seu processo de recuperação. Lembre-se que cada passo, mesmo os pequenos, conta muito nessa jornada. A neurociência mostra que cada dia sem a substância contribui para que seu cérebro restabeleça suas conexões naturais de prazer e recompensa. Continue investindo em seu autocuidado e construindo uma rede de apoio sólida. Estou aqui sempre que precisar discutir estratégias, comemorar progressos ou simplesmente conversar nos momentos difíceis.";
    }
    else if (userContent.includes('fissura') || userContent.includes('vontade de usar')) {
      responseText = "A fissura é um dos maiores desafios da recuperação e é completamente normal experimentá-la, especialmente nos primeiros meses. Cientificamente, ela representa um conjunto de reações neuroquímicas que diminuem com o tempo de abstinência. Quando sentir fissura, tente aplicar o método DEPA: Demora (espere alguns minutos, a fissura tende a diminuir); Evite (afaste-se do gatilho); Pense (lembre-se das consequências negativas); e Aja (envolva-se em uma atividade alternativa prazerosa ou que exija concentração). Também pode ser útil manter um diário de fissura para identificar padrões e gatilhos específicos. Em que situações você geralmente sente mais fissura? Poderíamos trabalhar em estratégias personalizadas para esses momentos.";
    }
    else if (userContent.includes('motivação') || userContent.includes('motivado') || userContent.includes('desanimo')) {
      responseText = "As flutuações na motivação são parte natural do processo de recuperação. A neurociência explica que seu cérebro está se readaptando a encontrar motivação e prazer sem a substância, o que leva tempo. Pode ser útil criar uma lista física dos seus motivos para se manter em recuperação e revisitá-la nos momentos de baixa motivação. Também é importante estabelecer metas pequenas e alcançáveis, celebrando cada conquista. Muitas pessoas também se beneficiam de ter um 'mantra pessoal' ou uma afirmação positiva para repetir nos momentos difíceis. Qual seria sua maior fonte de motivação para seguir em recuperação? O que você gostaria de reconquistar ou construir em sua vida que a dependência tinha comprometido?";
    }
    else if (userContent.includes('insônia') || userContent.includes('dormir')) {
      responseText = "Os problemas de sono são extremamente comuns durante a recuperação, especialmente nos primeiros meses, pois seu corpo está reaprendendo a regular os ciclos de sono naturalmente. Algumas estratégias que têm evidência científica para melhorar esse quadro incluem: manter horários regulares para dormir e acordar, mesmo nos fins de semana; criar uma rotina relaxante antes de dormir; evitar telas pelo menos 1 hora antes; praticar exercícios regularmente, mas não próximo ao horário de dormir; evitar cafeína após as 14h; e manter o quarto escuro, silencioso e em temperatura agradável. Técnicas de relaxamento como meditação guiada específica para sono também podem ajudar. Como tem sido sua rotina de sono? Há fatores específicos que você percebe que interferem em seu descanso?";
    }
    else if (userContent.includes('gatilho') || userContent.includes('trigger')) {
      responseText = "Identificar seus gatilhos é uma parte crucial da recuperação. Eles geralmente se dividem em categorias como: emocionais (estresse, solidão), sociais (certos amigos ou locais), situacionais (horários específicos, rituais) e físicos (fome, cansaço). Uma estratégia eficaz é o mapeamento detalhado desses gatilhos e a criação de um plano específico para cada um deles. Para gatilhos que não podem ser evitados, como certos estados emocionais, é importante desenvolver respostas alternativas saudáveis. A terapia cognitivo-comportamental tem excelentes resultados nesse aspecto. Quais gatilhos você já identificou em sua rotina? Poderíamos trabalhar juntos para desenvolver estratégias específicas para cada um deles.";
    }
    else {
      // Advanced mood-based responses
      switch (userMood) {
        case 'happy':
          responseText = "É realmente inspirador ver você com esse ânimo! Esses momentos de bem-estar são preciosos no processo de recuperação e representam seu cérebro gradualmente reaprendendo a experimentar prazer natural. A neurociência mostra que cada experiência positiva sem a substância fortalece novos circuitos neurais de recompensa. Como você poderia capitalizar essa energia positiva hoje? Talvez realizando uma atividade que você costumava gostar antes da dependência, conectando-se com pessoas que apoiam sua recuperação, ou até mesmo começando um pequeno projeto que tenha significado para você? Esses momentos de motivação são ótimas oportunidades para fortalecer comportamentos que sustentarão sua recuperação a longo prazo.";
          break;
        case 'sad':
          responseText = "Reconheço que você está passando por um momento de tristeza, e quero que saiba que esses sentimentos são completamente normais durante o processo de recuperação. Seu cérebro está reajustando sua química e, durante esse período, as emoções podem parecer intensificadas. A tristeza, embora desconfortável, também carrega mensagens importantes - talvez sobre perdas que precisam ser processadas ou necessidades que não estão sendo atendidas. Ao invés de fugir desse sentimento, como talvez fizesse no passado com a substância, posso te convidar a explorá-lo com curiosidade? O que essa tristeza pode estar tentando te dizer? Lembre-se que enfrentar essas emoções, em vez de evitá-las, é parte fundamental do processo de cura. Você consegue identificar o que pode estar contribuindo para esse sentimento hoje?";
          break;
        case 'angry':
          responseText = "Percebo sua frustração e raiva, e quero validar que essas são emoções completamente compreensíveis no contexto da recuperação. A raiva muitas vezes mascara outras emoções mais vulneráveis como medo, impotência ou tristeza. Em vez de julgar esse sentimento, podemos usá-lo como informação valiosa. A raiva geralmente surge quando limites importantes são violados ou quando nossas necessidades não estão sendo atendidas. Durante muito tempo, talvez você tenha usado a substância para amortecer essa emoção, mas agora temos a oportunidade de aprender a processá-la de forma saudável. Técnicas como escrever sobre o que está sentindo sem filtro, exercício físico intenso ou até mesmo expressar verbalmente em um ambiente seguro podem ajudar a canalizar essa energia. Consegue identificar o que desencadeou esse sentimento hoje? E mais importante, qual necessidade legítima pode estar por trás dessa raiva?";
          break;
        case 'neutral':
        default:
          responseText = "Agradeço por compartilhar seus pensamentos comigo. A jornada de recuperação é única para cada pessoa, e estou aqui para apoiar a sua de forma personalizada. Os estudos mostram que o suporte consistente, mesmo em momentos aparentemente tranquilos, é um dos fatores mais importantes para a recuperação sustentável. Gostaria de explorar algum aspecto específico de sua recuperação hoje? Poderíamos discutir estratégias de prevenção de recaída, técnicas para lidar com gatilhos, formas de fortalecer sua rede de apoio, ou talvez refletir sobre seus objetivos de vida agora que você está em recuperação. Ou, se preferir, podemos simplesmente conversar sobre como tem sido seu dia-a-dia e identificar pequenas oportunidades para fortalecer sua jornada de recuperação.";
      }
    }
  } else {
    responseText = "Olá! Sou um conselheiro especializado em apoiar pessoas que enfrentam dependência química. Como posso ajudar você hoje no seu processo de recuperação? Estou aqui para oferecer suporte sem julgamentos, compartilhar estratégias baseadas em evidências e acompanhar sua jornada rumo à recuperação. Sinta-se à vontade para compartilhar o que está vivenciando no momento.";
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
