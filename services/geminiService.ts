import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
  console.error("API KEY não encontrada");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Enhances a raw user description into a more appealing, mysterious, or professional listing
 * depending on the tone of c.pandox.
 */
export const enhanceGigDescription = async (
  rawText: string,
  category: string,
): Promise<string> => {
  if (!apiKey) return rawText;
  try {
    const model = 'gemini-3-flash-preview';
    const prompt = `
      Você é o AI assistente do "c.pandox", um app de demandas inusitadas e exóticas.
      O usuário escreveu o seguinte rascunho de pedido na categoria "${category}": "${rawText}".
      
      Por favor, reescreva este pedido para torná-lo mais atraente, claro e seguro, mantendo a essência do desejo original.
      Use um tom misterioso mas profissional.
      Não use markdown, apenas texto puro. Máximo de 3 frases.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text?.trim() || rawText;
  } catch (error) {
    console.error("Erro ao conectar com Gemini:", error);
    return rawText; // Fallback to original text
  }
};

/**
 * Generates suggested tags for a request.
 */
export const generateTags = async (description: string): Promise<string[]> => {
  if (!process.env.GEMINI_API_KEY) return ['Exótico', 'Único'];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere 3 tags curtas (uma palavra cada) para este pedido: "${description}". Responda apenas com as palavras separadas por vírgula.`,
    });
    
    const text = response.text || '';
    return text.split(',').map(s => s.trim()).slice(0, 3);
  } catch (error) {
    return ['Personalizado', 'Exclusivo'];
  }
};

/**
 * Analisa a segurança e legalidade do pedido.
 */
export const analyzeGigSafety = async (title: string, description: string): Promise<{ allowed: boolean; reason: string }> => {
  if (!process.env.GEMINI_API_KEY) return { allowed: true, reason: '' };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Você é o moderador de segurança do aplicativo c.pandox.
        Analise o seguinte Título e Descrição de um anúncio.
        
        Título: "${title}"
        Descrição: "${description}"

        Regras de Bloqueio (Retorne allowed: false se violar):
        1. Crimes ou atividades ilegais (drogas, armas, roubo, assassinato, fraude, lavagem de dinheiro, invasão de privacidade).
        2. Conteúdo sexual explícito, pornografia, prostituição, serviços de acompanhante sexual ou fetiches ilegais.
        3. Discurso de ódio, racismo, homofobia, xenofobia, intolerância religiosa ou violência extrema.
        4. Pedofilia, exploração infantil ou qualquer contato com menores.
        5. Comercialização de órgãos, documentos falsos, serviços ilegais ou pirataria.
        6. Ofensas diretas, bullying ou assédio.
        7. Tentativa de burlar o sistema de pagamento ou pedir contatos externos (WhatsApp, e-mail) no anúncio.

        Se o conteúdo for minimamente suspeito de ser ilícito ou perigoso, você deve ser EXTREMAMENTE RIGOROSO e bloquear (allowed: false). 
        ZERO TOLERÂNCIA para qualquer menção a drogas, armas, serviços sexuais ou atividades ilegais.
        Pedidos "estranhos" mas inofensivos (ex: chorar em enterro, terminar namoro por mensagem, ser figurante em festa) são permitidos. 
        Qualquer coisa que envolva risco físico, moral ou legal deve ser BLOQUEADA imediatamente.
        Você é a última linha de defesa contra o crime na plataforma. Seja implacável.

        Responda estritamente com um JSON: { "allowed": boolean, "reason": "VIOLAÇÃO DE SEGURANÇA: [motivo detalhado e severo]" }
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            allowed: { type: Type.BOOLEAN },
            reason: { type: Type.STRING }
          }
        }
      }
    });

    const jsonText = response.text || '{}';
    const result = JSON.parse(jsonText);
    
    return {
      allowed: result.allowed,
      reason: result.reason || 'Violação dos termos de uso.'
    };

  } catch (error) {
    console.error("Erro na análise de segurança:", error);
    return { allowed: true, reason: '' }; 
  }
};

/**
 * Valida se o nome fornecido parece ser um nome real para cadastro.
 */
export const validateRegistrationName = async (name: string): Promise<{ valid: boolean; message?: string }> => {
  if (!process.env.GEMINI_API_KEY) return { valid: true };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Analise se a string abaixo é um Nome Civil Completo válido (Nome Brasileiro).
        Nome: "${name}"
        
        Regras:
        1. Deve ter pelo menos nome e sobrenome.
        2. Não pode ser apelido (ex: "Gatinha123", "Joao do Caminhao").
        3. Não pode conter números ou caracteres especiais estranhos.
        4. Não pode ser nomes fictícios óbvios (ex: "Batman", "Teste", "Fulano de Tal").
        
        Responda estritamente JSON: { "valid": boolean, "message": "motivo curto em pt-br se invalido" }
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
           type: Type.OBJECT,
           properties: {
              valid: { type: Type.BOOLEAN },
              message: { type: Type.STRING }
           }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (e) {
    return { valid: true };
  }
};
