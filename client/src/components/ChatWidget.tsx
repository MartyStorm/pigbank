import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, UserCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  content: string;
  senderType: "user" | "ai" | "staff";
  createdAt: string;
}

interface Conversation {
  id: string;
  status: string;
}

function generateSessionId(): string {
  const stored = localStorage.getItem("pigbank_chat_session");
  if (stored) return stored;
  const newId = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  localStorage.setItem("pigbank_chat_session", newId);
  return newId;
}

export function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hasRequestedHuman, setHasRequestedHuman] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startChat = async () => {
    setIsLoading(true);
    try {
      const sessionId = generateSessionId();
      const res = await fetch("/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, userId: user?.id }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setConversation(data.conversation);
        setMessages(data.messages);
        setHasRequestedHuman(data.conversation.status === 'awaiting_human');
        
        if (data.messages.length === 0) {
          setMessages([{
            id: "welcome",
            content: "Hello! 👋 I'm PigBank's virtual assistant. I can help answer questions about our payment processing services, your account, transactions, and more. How can I help you today?",
            senderType: "ai",
            createdAt: new Date().toISOString(),
          }]);
        }
      }
    } catch (error) {
      console.error("Failed to start chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !conversation) {
      startChat();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !conversation || isSending) return;

    const userContent = inputValue.trim();
    setInputValue("");
    setIsSending(true);

    const tempUserMsg: Message = {
      id: `temp_${Date.now()}`,
      content: userContent,
      senderType: "user",
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      const res = await fetch(`/api/chat/${conversation.id}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userContent, senderId: user?.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== tempUserMsg.id);
          return [...filtered, data.userMessage, data.aiMessage];
        });
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: `error_${Date.now()}`,
            content: "Sorry, I'm having trouble responding right now. Please try again.",
            senderType: "ai",
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => [
        ...prev,
        {
          id: `error_${Date.now()}`,
          content: "Connection error. Please check your internet and try again.",
          senderType: "ai",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleRequestHuman = async () => {
    if (!conversation) return;
    
    try {
      const res = await fetch(`/api/chat/${conversation.id}/request-human`, {
        method: "POST",
      });

      if (res.ok) {
        setHasRequestedHuman(true);
        const data = await res.json();
        const messages = await fetch(`/api/chat/${conversation.id}/messages`, {
          credentials: "include",
        });
        if (messages.ok) {
          const msgData = await messages.json();
          setMessages(msgData);
        }
      }
    } catch (error) {
      console.error("Failed to request human:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-2 right-2 z-40 font-sans">
      {isOpen ? (
        <div className="w-96 h-[500px] bg-card border border-border rounded-lg shadow-lg flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-[#1a4320] text-white px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold text-sm">PigBank Support</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/10"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-2",
                      msg.senderType === "user" ? "justify-end" : "justify-start"
                    )}
                    data-testid={`message-${msg.senderType}-${msg.id}`}
                  >
                    {msg.senderType !== "user" && (
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0",
                        msg.senderType === "staff" ? "bg-[#2563eb]" : "bg-[#73cb43]"
                      )}>
                        {msg.senderType === "staff" ? (
                          <UserCircle className="h-4 w-4 text-white" />
                        ) : (
                          <MessageCircle className="h-3.5 w-3.5 text-white" />
                        )}
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[75%] px-4 py-2 text-sm",
                        msg.senderType === "user"
                          ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-3xl rounded-tr-lg"
                          : msg.senderType === "staff"
                          ? "bg-[#2563eb] text-white rounded-3xl rounded-tl-lg"
                          : "bg-[#73cb43] text-white rounded-3xl rounded-tl-lg"
                      )}
                    >
                      {msg.senderType === "staff" && (
                        <div className="text-xs opacity-80 mb-1">PigBank Staff</div>
                      )}
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isSending && (
                  <div className="flex gap-2 justify-start">
                    <div className="w-7 h-7 rounded-full bg-[#73cb43] flex items-center justify-center">
                      <MessageCircle className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="bg-[#73cb43] text-white px-4 py-2 rounded-3xl rounded-tl-lg">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {!hasRequestedHuman && messages.length > 2 && (
            <div className="px-3 py-2 border-t border-border bg-muted/30">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-muted-foreground hover:text-foreground"
                onClick={handleRequestHuman}
                data-testid="button-request-human"
              >
                <UserCircle className="h-3.5 w-3.5 mr-1.5" />
                Talk to a human representative
              </Button>
            </div>
          )}

          <div className="border-t border-border p-3 bg-background">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm"
                disabled={isSending}
                data-testid="input-chat-message"
              />
              <Button
                size="icon"
                className="h-9 w-9 bg-[#73cb43] hover:bg-[#65b538]"
                onClick={handleSendMessage}
                disabled={isSending || !inputValue.trim()}
                data-testid="button-send-message"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative focus:outline-none"
          data-testid="button-open-chat"
          type="button"
        >
          <motion.div 
            className="relative drop-shadow-xl"
            initial={{ scale: 0, opacity: 0, originX: 1, originY: 1 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-16 w-16"
            >
              <path 
                d="M4 2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2v4l-4-4H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" 
                fill="#73cb43" 
                stroke="none"
              />
              <path d="M7 8h10" className="stroke-white dark:stroke-[#262626]" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7 12h10" className="stroke-white dark:stroke-[#262626]" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.div>
        </button>
      )}
    </div>
  );
}
