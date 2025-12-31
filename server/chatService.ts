import OpenAI from "openai";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (openaiClient) return openaiClient;
  
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OpenAI API key not configured - chat will use fallback responses");
    return null;
  }
  
  openaiClient = new OpenAI({
    apiKey,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
  return openaiClient;
}

const SYSTEM_PROMPT = `You are a helpful customer support assistant for PigBank, a high-risk payment processing company.

About PigBank:
- PigBank specializes in payment processing for high-risk industries
- We offer card processing (Visa, Mastercard, Amex, Discover), ACH transfers, wire transfers, and crypto payments
- We provide fraud protection, chargeback management, and real-time transaction monitoring
- Our platform includes invoicing, customer management, and detailed analytics
- We offer competitive rates for high-risk merchants
- Account setup typically takes 1-3 business days after application approval

Your role:
1. Answer questions ONLY about PigBank's services, features, pricing, and payment processing
2. Help users understand how to use the PigBank platform
3. Provide guidance on transactions, chargebacks, payouts, and account management
4. Be professional, helpful, and concise

IMPORTANT RULES:
- If a user asks about topics unrelated to PigBank or payment processing, politely decline and redirect them to PigBank-related topics
- Never provide advice on illegal activities, tax evasion, or money laundering
- For specific account issues (disputes, account holds, billing), suggest they request to speak with a human representative
- Keep responses concise and friendly
- If you don't know something specific about PigBank, say so and suggest contacting support

Example off-topic response: "I'm here to help with PigBank and payment processing questions. Is there anything about your PigBank account or our services I can help you with?"`;

export interface ChatHistoryMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function getChatResponse(
  userMessage: string,
  conversationHistory: ChatHistoryMessage[] = []
): Promise<string> {
  const openai = getOpenAIClient();
  
  if (!openai) {
    return getFallbackResponse(userMessage);
  }
  
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...conversationHistory.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user", content: userMessage },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_completion_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || "I apologize, but I'm having trouble responding right now. Please try again or contact support@pigbank.com for assistance.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm having trouble connecting to our AI system. Please try again in a moment, or contact support@pigbank.com for immediate assistance.";
  }
}

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes("pricing") || lowerMessage.includes("cost") || lowerMessage.includes("fee")) {
    return "Our pricing is competitive for high-risk merchants. Transaction fees typically range from 2.9% to 4.9% depending on your industry and volume. For a personalized quote, please contact our sales team or speak with a human representative.";
  }
  
  if (lowerMessage.includes("chargeback")) {
    return "PigBank offers comprehensive chargeback management tools including real-time alerts, dispute resolution assistance, and prevention strategies. You can view and manage chargebacks in your dashboard under the Transactions section.";
  }
  
  if (lowerMessage.includes("payout") || lowerMessage.includes("withdraw")) {
    return "Payouts are processed daily for approved merchants. You can track your payout status in the Payouts section of your dashboard. Standard processing takes 1-2 business days.";
  }
  
  if (lowerMessage.includes("fraud") || lowerMessage.includes("security")) {
    return "PigBank uses advanced fraud detection including real-time risk scoring, velocity checks, and AVS/CVV verification. You can configure your fraud rules in the Settings section.";
  }
  
  if (lowerMessage.includes("account") || lowerMessage.includes("setup") || lowerMessage.includes("apply")) {
    return "To set up a PigBank account, complete our merchant application. Approval typically takes 1-3 business days. If you have a pending application, check the Onboarding section for required documents.";
  }
  
  if (lowerMessage.includes("human") || lowerMessage.includes("agent") || lowerMessage.includes("support")) {
    return "I'd be happy to connect you with a human representative. Please click the 'Talk to a human representative' button below this chat, and our team will review your conversation and respond as soon as possible.";
  }
  
  return "Thanks for your message! I'm here to help with questions about PigBank's payment processing services. You can ask about transactions, chargebacks, payouts, fraud protection, or account setup. For complex issues, feel free to request a human representative.";
}
