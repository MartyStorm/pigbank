import type { Express, Request, Response } from "express";
import OpenAI from "openai";
import { chatStorage } from "./storage";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export function registerChatRoutes(app: Express): void {
  app.get("/api/integration/conversations", async (req: Request, res: Response) => {
    try {
      const conversations = await chatStorage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.get("/api/integration/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const conversation = await chatStorage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await chatStorage.getMessagesByConversation(id);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  app.post("/api/integration/conversations", async (req: Request, res: Response) => {
    try {
      const { sessionId = "default" } = req.body;
      const conversation = await chatStorage.createConversation(sessionId);
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  app.delete("/api/integration/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await chatStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  app.post("/api/integration/conversations/:id/messages", async (req: Request, res: Response) => {
    try {
      const conversationId = req.params.id;
      const { content } = req.body;

      await chatStorage.createMessage(conversationId, "user", content);

      const messages = await chatStorage.getMessagesByConversation(conversationId);
      const chatMessages = messages.map((m) => ({
        role: m.senderType === "user" ? "user" as const : "assistant" as const,
        content: m.content,
      }));

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: chatMessages,
        stream: true,
        max_completion_tokens: 2048,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const chunkContent = chunk.choices[0]?.delta?.content || "";
        if (chunkContent) {
          fullResponse += chunkContent;
          res.write(`data: ${JSON.stringify({ content: chunkContent })}\n\n`);
        }
      }

      await chatStorage.createMessage(conversationId, "ai", fullResponse);

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Error sending message:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to send message" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to send message" });
      }
    }
  });
}
