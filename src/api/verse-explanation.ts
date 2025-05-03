import { OpenAI } from 'openai';
import { supabase } from '@/integrations/supabase/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Você é um assistente especializado em explicar versículos bíblicos para pessoas em recuperação de dependência química.
Sua função é fornecer uma explicação clara, acolhedora e motivadora do versículo, relacionando-o com o processo de recuperação.
Mantenha um tom empático e esperançoso. Use linguagem simples e acessível.
Sempre enfatize a mensagem de esperança e força que o versículo traz para a jornada de recuperação.`;

export async function POST(req: Request) {
  try {
    const { verse, reference } = await req.json();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const messages = [
      { role: 'system' as const, content: SYSTEM_PROMPT },
      { 
        role: 'user' as const, 
        content: `Por favor, explique o seguinte versículo bíblico de forma que seja relevante para alguém em recuperação de dependência química: "${verse}" (${reference})` 
      },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const explanation = completion.choices[0].message.content;

    return new Response(JSON.stringify({ explanation }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro ao gerar explicação:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 