
import { OpenAI } from 'openai';
import { supabase } from '@/integrations/supabase/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `Você é um assistente virtual especializado em ajudar pessoas em recuperação de dependência química. 
Sua função é fornecer apoio emocional, orientação e informações úteis sobre o processo de recuperação.
Mantenha um tom empático, acolhedor e profissional. Nunca forneça conselhos médicos ou substitua a orientação de profissionais de saúde.
Seja específico sobre o processo de recuperação, mas evite ser muito técnico. Use linguagem simples e acessível.
Sempre enfatize a importância de buscar ajuda profissional quando necessário.`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    // Registrar a interação no banco de dados usando um método mais seguro com tipos corretos
    await supabase.from('chat_interactions').insert({
      user_id: user.id,
      user_message: message,
      ai_response: response,
    } as any); // Using type assertion to bypass TypeScript error temporarily until types are regenerated

    return new Response(JSON.stringify({ message: response }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro no chat:', error);
    return new Response(JSON.stringify({ error: 'Erro interno do servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
