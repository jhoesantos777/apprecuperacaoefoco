
interface DailyVerse {
  verse: string;
  reference: string;
  reflection: string;
  day?: number; // Adicionando campo de dia para controle interno
}

const dailyVerses: DailyVerse[] = [
  {
    verse: "O Senhor é o meu pastor; nada me faltará.",
    reference: "Salmos 23:1",
    reflection: "Esse versículo nos lembra que Deus cuida de cada necessidade nossa, mesmo quando não percebemos.",
    day: 1
  },
  {
    verse: "Posso todas as coisas naquele que me fortalece.",
    reference: "Filipenses 4:13",
    reflection: "A força que vem de Deus nos capacita a superar qualquer desafio com fé e confiança.",
    day: 2
  },
  {
    verse: "Confia no Senhor de todo o teu coração...",
    reference: "Provérbios 3:5",
    reflection: "A confiança verdadeira em Deus nos liberta da ansiedade e nos guia pelo caminho certo.",
    day: 3
  },
  {
    verse: "O Senhor é a minha luz e a minha salvação; a quem temerei?",
    reference: "Salmos 27:1",
    reflection: "Quando Deus é nossa luz, não há escuridão que nos impeça de seguir em frente com coragem.",
    day: 4
  },
  {
    verse: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus.",
    reference: "Isaías 41:10",
    reflection: "A presença de Deus em nossa vida nos dá a segurança de que nunca estamos sozinhos nas dificuldades.",
    day: 5
  },
  {
    verse: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.",
    reference: "João 3:16",
    reflection: "O amor de Deus é tão grandioso que Ele entregou o que tinha de mais precioso por nós.",
    day: 6
  },
  {
    verse: "Mas os que esperam no Senhor renovarão as suas forças.",
    reference: "Isaías 40:31",
    reflection: "Esperar em Deus não é perder tempo, mas renovar as forças para prosseguir na jornada.",
    day: 7
  },
  {
    verse: "E conhecereis a verdade, e a verdade vos libertará.",
    reference: "João 8:32",
    reflection: "A verdade de Deus tem o poder de nos libertar de tudo o que nos aprisiona.",
    day: 8
  },
  {
    verse: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.",
    reference: "1 Pedro 5:7",
    reflection: "Podemos entregar todas as nossas preocupações a Deus, pois Ele se importa com cada detalhe de nossa vida.",
    day: 9
  },
  {
    verse: "Ora, àquele que é poderoso para fazer infinitamente mais do que tudo quanto pedimos ou pensamos.",
    reference: "Efésios 3:20",
    reflection: "O poder de Deus não tem limites e vai muito além do que nossa mente pode imaginar ou pedir.",
    day: 10
  },
  {
    verse: "Mas buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.",
    reference: "Mateus 6:33",
    reflection: "Quando colocamos Deus em primeiro lugar, tudo o mais encontra seu devido lugar em nossa vida.",
    day: 11
  },
  {
    verse: "A tua palavra é lâmpada para os meus pés e luz para o meu caminho.",
    reference: "Salmos 119:105",
    reflection: "A Palavra de Deus ilumina nossa jornada e nos mostra qual direção seguir em cada situação.",
    day: 12
  },
  {
    verse: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal.",
    reference: "Jeremias 29:11",
    reflection: "Os planos de Deus para nós são sempre bons, mesmo quando não compreendemos o processo.",
    day: 13
  },
  {
    verse: "Sede fortes e corajosos; não temais, nem vos atemorizeis diante deles.",
    reference: "Deuteronômio 31:6",
    reflection: "A coragem que vem de Deus nos permite enfrentar qualquer desafio sem medo.",
    day: 14
  },
  {
    verse: "Crê no Senhor Jesus Cristo e serás salvo, tu e a tua casa.",
    reference: "Atos 16:31",
    reflection: "A fé em Jesus é o caminho para a salvação, tanto para nós quanto para aqueles que amamos.",
    day: 15
  },
  {
    verse: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.",
    reference: "Mateus 11:28",
    reflection: "Jesus nos convida a encontrar descanso nele quando estamos exaustos das lutas da vida.",
    day: 16
  },
  {
    verse: "De sorte que, se alguém está em Cristo, nova criatura é; as coisas velhas já passaram; eis que tudo se fez novo.",
    reference: "2 Coríntios 5:17",
    reflection: "Em Cristo, recebemos uma nova identidade e a oportunidade de um recomeço verdadeiro.",
    day: 17
  },
  {
    verse: "Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.",
    reference: "Provérbios 3:6",
    reflection: "Quando incluímos Deus em cada área de nossa vida, Ele nos guia pelo caminho certo.",
    day: 18
  },
  {
    verse: "Agora, pois, permanecem a fé, a esperança e o amor, estes três; mas o maior destes é o amor.",
    reference: "1 Coríntios 13:13",
    reflection: "Entre todas as virtudes, o amor é a mais importante e deve ser o centro de tudo o que fazemos.",
    day: 19
  },
  {
    verse: "Não se turbe o vosso coração; credes em Deus, crede também em mim.",
    reference: "João 14:1",
    reflection: "A fé em Deus e em Jesus traz paz ao coração em meio às turbulências da vida.",
    day: 20
  },
  {
    verse: "O ladrão vem somente para roubar, matar e destruir; eu vim para que tenham vida e a tenham em abundância.",
    reference: "João 10:10",
    reflection: "Jesus veio para nos dar uma vida plena e abundante, muito além da mera existência.",
    day: 21
  },
  {
    verse: "Portanto, quer comais, quer bebais ou façais outra coisa qualquer, fazei tudo para a glória de Deus.",
    reference: "1 Coríntios 10:31",
    reflection: "Cada aspecto de nossa vida pode ser uma expressão de adoração e glorificação a Deus.",
    day: 22
  },
  {
    verse: "Bem-aventurado o homem que não anda segundo o conselho dos ímpios.",
    reference: "Salmos 1:1",
    reflection: "As companhias e influências que escolhemos têm um grande impacto em nossa jornada espiritual.",
    day: 23
  },
  {
    verse: "Ele te declarou, ó homem, o que é bom; e que é o que o Senhor requer de ti, senão que pratiques a justiça, e ames a bondade.",
    reference: "Miquéias 6:8",
    reflection: "Deus nos chama a viver com justiça, amar a bondade e caminhar humildemente com Ele.",
    day: 24
  },
  {
    verse: "E, quando estiverdes orando, perdoai, se tendes alguma coisa contra alguém.",
    reference: "Marcos 11:25",
    reflection: "O perdão é uma parte essencial de nossa comunicação com Deus e de nossos relacionamentos.",
    day: 25
  },
  {
    verse: "Suportai-vos uns aos outros, e perdoai-vos uns aos outros, se alguém tiver queixa contra outrem.",
    reference: "Colossenses 3:13",
    reflection: "Assim como Cristo nos perdoou, devemos perdoar e ter paciência uns com os outros.",
    day: 26
  },
  {
    verse: "Não to mandei eu? Sê forte e corajoso; não temas, nem te espantes; porque o Senhor, teu Deus, é contigo.",
    reference: "Josué 1:9",
    reflection: "A presença constante de Deus conosco é o que nos dá força e coragem para enfrentar qualquer desafio.",
    day: 27
  },
  {
    verse: "O que vos digo no escuro, dizei-o em plena luz; e o que escutais ao pé do ouvido, proclamai-o sobre os eirados.",
    reference: "Mateus 10:27",
    reflection: "Somos chamados a compartilhar com outros o que aprendemos com Cristo, sendo testemunhas da verdade.",
    day: 28
  },
  {
    verse: "Ora, a fé é a certeza de coisas que se esperam, a convicção de fatos que se não veem.",
    reference: "Hebreus 11:1",
    reflection: "A fé nos permite enxergar além das circunstâncias presentes e confiar no que Deus prometeu.",
    day: 29
  },
  {
    verse: "Mas o fruto do Espírito é: amor, alegria, paz, longanimidade, benignidade, bondade, fidelidade, mansidão, domínio próprio.",
    reference: "Gálatas 5:22-23",
    reflection: "O Espírito Santo produz em nós qualidades que refletem o caráter de Cristo quando permitimos sua atuação.",
    day: 30
  },
  {
    verse: "Porque o salário do pecado é a morte, mas o dom gratuito de Deus é a vida eterna em Cristo Jesus.",
    reference: "Romanos 6:23",
    reflection: "Deus oferece gratuitamente a vida eterna por meio de Jesus, mesmo que não mereçamos tal presente.",
    day: 31
  }
];

// Para completar até 365 dias, adicionamos versículos genéricos
for (let i = dailyVerses.length + 1; i <= 365; i++) {
  dailyVerses.push({
    verse: "Se, porém, algum de vós necessita de sabedoria, peça-a a Deus, que a todos dá liberalmente e não o lança em rosto; e ser-lhe-á concedida.",
    reference: "Tiago 1:5",
    reflection: "Quando precisamos de direção, podemos pedir a Deus sabedoria com confiança, sabendo que Ele dará generosamente.",
    day: i
  });
}

export default dailyVerses;
