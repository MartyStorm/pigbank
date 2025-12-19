import { useState } from "react";
import { MessageCircle, MessageSquareText, X, Send } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! 👋 Welcome to PigBank support. How can I help you today?",
      sender: "agent",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thanks for your message! Our support team will get back to you shortly. For urgent issues, please contact support@pigbank.com",
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    }, 500);
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
          {/* Header */}
          <div className="bg-[#2d7438] text-white px-4 py-4 flex items-center justify-between">
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-2",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
                data-testid={`message-${msg.sender}-${msg.id}`}
              >
                <div
                  className={cn(
                    "max-w-xs px-4 py-2 text-sm",
                    msg.sender === "user"
                      ? "bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100 rounded-3xl rounded-tr-lg"
                      : "bg-[#73cb43] text-white rounded-3xl rounded-tl-lg"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 bg-background">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="text-sm"
                data-testid="input-chat-message"
              />
              <Button
                size="icon"
                className="h-9 w-9"
                onClick={handleSendMessage}
                data-testid="button-send-message"
              >
                <Send className="h-4 w-4" />
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
