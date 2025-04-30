
interface DailyMotivation {
  phrase: string;
  reflection: string;
}

const dailyMotivations: DailyMotivation[] = [
  {
    phrase: "Só por hoje, escolho a paz.",
    reflection: "Você não precisa vencer todas as batalhas. Escolher a paz é um ato de coragem e autocuidado."
  },
  {
    phrase: "A recuperação começa com um passo de cada vez.",
    reflection: "Não se apresse. Cada pequeno avanço é uma vitória real e merece ser celebrada."
  },
  {
    phrase: "Eu sou mais forte do que qualquer desejo passageiro.",
    reflection: "A vontade vem e vai. Sua essência é mais firme, mais profunda e mais duradoura do que qualquer impulso."
  },
  {
    phrase: "Mesmo nos dias difíceis, eu continuo seguindo.",
    reflection: "Persistência é mais poderosa que perfeição. Você está se movendo, e isso importa."
  },
  {
    phrase: "Eu não estou sozinho nesta jornada.",
    reflection: "Outros caminham ao seu lado. Há apoio, compreensão e amor esperando por você."
  },
  {
    phrase: "Minha história não acaba aqui.",
    reflection: "Cada capítulo difícil é apenas parte da jornada. Há páginas novas sendo escritas com esperança."
  },
  {
    phrase: "Hoje eu escolho cuidar de mim.",
    reflection: "Cuidar de você não é egoísmo — é sobrevivência, é amor, é recuperação."
  },
  {
    phrase: "Tudo o que preciso para vencer hoje já está dentro de mim.",
    reflection: "A força, a coragem, a calma — elas já vivem aí. Respire e confie."
  },
  {
    phrase: "Posso recomeçar quantas vezes forem necessárias.",
    reflection: "Recomeçar não é fracasso. É prova de que você está vivo, consciente e disposto."
  },
  {
    phrase: "A vida em sobriedade vale a pena.",
    reflection: "A clareza, os afetos verdadeiros e a liberdade não têm preço. Vale a pena, sim."
  },
  {
    phrase: "Sentir é parte da cura.",
    reflection: "Não fuja das emoções. Elas são pontes para a transformação."
  },
  {
    phrase: "Peço ajuda quando preciso — e tudo bem.",
    reflection: "Você não precisa carregar tudo sozinho. Pedir ajuda é força, não fraqueza."
  },
  {
    phrase: "Hoje, escolho o amor em vez do medo.",
    reflection: "O medo paralisa. O amor move. Faça sua escolha com gentileza."
  },
  {
    phrase: "Errar faz parte. Aprender é o que importa.",
    reflection: "Você não é seu erro. Você é quem levanta, aprende e segue."
  },
  {
    phrase: "Sou digno de viver em paz.",
    reflection: "A paz não é luxo, é direito. Você merece viver com leveza."
  },
  {
    phrase: "Gratidão transforma a alma.",
    reflection: "Mesmo em meio à dor, há algo pelo qual agradecer. Isso muda tudo."
  },
  {
    phrase: "Respirar fundo já é um bom começo.",
    reflection: "Quando tudo parecer demais, volte ao simples. Um suspiro pode abrir espaço para recomeçar."
  },
  {
    phrase: "Eu posso mudar minha história.",
    reflection: "Você não está preso ao passado. O futuro é construído a partir do agora."
  },
  {
    phrase: "Hoje, aceito onde estou.",
    reflection: "Aceitação não é resignação. É o primeiro passo para crescer com verdade."
  },
  {
    phrase: "Meu valor não depende dos meus erros.",
    reflection: "Você é mais do que qualquer falha. Seu valor é inteiro e imutável."
  },
  {
    phrase: "A cada manhã, uma nova chance.",
    reflection: "A vida se renova. Você também pode."
  },
  {
    phrase: "Confio que o processo da recuperação está funcionando.",
    reflection: "Mesmo quando não parece, algo está mudando dentro de você. Confie nisso."
  },
  {
    phrase: "Eu escolho viver com propósito.",
    reflection: "Quando você sabe por que está lutando, fica mais fácil continuar."
  },
  {
    phrase: "Sou merecedor de amor e respeito.",
    reflection: "Você é digno — sem precisar provar nada para ninguém."
  },
  {
    phrase: "Hoje, não preciso ser perfeito. Só preciso ser honesto.",
    reflection: "A honestidade consigo mesmo é o maior sinal de força."
  },
  {
    phrase: "A recuperação é difícil, mas vale cada esforço.",
    reflection: "Cada lágrima, cada decisão, cada dia limpo — tudo conta. Tudo vale."
  },
  {
    phrase: "Não estou sozinho. Há quem entenda o que sinto.",
    reflection: "Outras pessoas já passaram por isso. Você é parte de algo maior."
  },
  {
    phrase: "O agora é tudo o que tenho.",
    reflection: "Você não precisa resolver tudo hoje. Apenas esteja aqui, neste momento."
  },
  {
    phrase: "Eu posso ser feliz sem precisar fugir de mim.",
    reflection: "A felicidade verdadeira nasce quando você se encontra, não quando se esconde."
  },
  {
    phrase: "A recaída não é o fim — é parte da jornada.",
    reflection: "Levantar é mais importante que nunca ter caído. Você ainda está na luta, e isso importa."
  }
];

// Helper to get today's motivation
export const getTodaysMotivation = () => {
  // Calculate day of year (0-364)
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = Number(now) - Number(start);
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay) - 1;
  
  // Get motivation for today (mod by array length to ensure it wraps around)
  return dailyMotivations[dayOfYear % dailyMotivations.length];
};

export default dailyMotivations;
