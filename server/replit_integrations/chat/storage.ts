import { db } from "../../db";
import { chatConversations, chatMessages } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IChatStorage {
  getConversation(id: string): Promise<typeof chatConversations.$inferSelect | undefined>;
  getAllConversations(): Promise<(typeof chatConversations.$inferSelect)[]>;
  createConversation(sessionId: string): Promise<typeof chatConversations.$inferSelect>;
  deleteConversation(id: string): Promise<void>;
  getMessagesByConversation(conversationId: string): Promise<(typeof chatMessages.$inferSelect)[]>;
  createMessage(conversationId: string, senderType: string, content: string): Promise<typeof chatMessages.$inferSelect>;
}

export const chatStorage: IChatStorage = {
  async getConversation(id: string) {
    const [conversation] = await db.select().from(chatConversations).where(eq(chatConversations.id, id));
    return conversation;
  },

  async getAllConversations() {
    return db.select().from(chatConversations).orderBy(desc(chatConversations.createdAt));
  },

  async createConversation(sessionId: string) {
    const [conversation] = await db.insert(chatConversations).values({ sessionId, status: 'open' }).returning();
    return conversation;
  },

  async deleteConversation(id: string) {
    await db.delete(chatMessages).where(eq(chatMessages.conversationId, id));
    await db.delete(chatConversations).where(eq(chatConversations.id, id));
  },

  async getMessagesByConversation(conversationId: string) {
    return db.select().from(chatMessages).where(eq(chatMessages.conversationId, conversationId)).orderBy(chatMessages.createdAt);
  },

  async createMessage(conversationId: string, senderType: string, content: string) {
    const [message] = await db.insert(chatMessages).values({ conversationId, senderType, content }).returning();
    return message;
  },
};
