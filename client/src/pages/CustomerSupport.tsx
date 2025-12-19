import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  ChevronRight,
  Send,
  ArrowLeft
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  sender: "merchant" | "support";
  senderName: string;
  content: string;
  timestamp: string;
}

interface Thread {
  id: string;
  subject: string;
  status: "open" | "resolved";
  lastMessage: string;
  lastMessageDate: string;
  unread: boolean;
  messages: Message[];
}

const demoThreads: Thread[] = [
  {
    id: "1",
    subject: "Question about transaction fees",
    status: "open",
    lastMessage: "We'll look into this for you and get back shortly.",
    lastMessageDate: "2 hours ago",
    unread: true,
    messages: [
      { id: "1a", sender: "merchant", senderName: "You", content: "Hi, I noticed my transaction fees seem higher than expected. Can you explain the fee structure?", timestamp: "Dec 9, 2025 2:30 PM" },
      { id: "1b", sender: "support", senderName: "Sarah from PigBank", content: "Hi! Thanks for reaching out. I'd be happy to help explain your fees. Could you tell me which specific transactions you're concerned about?", timestamp: "Dec 9, 2025 3:15 PM" },
      { id: "1c", sender: "merchant", senderName: "You", content: "The ones from last week - they show 3.5% instead of the 2.9% I was expecting.", timestamp: "Dec 9, 2025 3:45 PM" },
      { id: "1d", sender: "support", senderName: "Sarah from PigBank", content: "We'll look into this for you and get back shortly.", timestamp: "Dec 9, 2025 4:00 PM" },
    ]
  },
  {
    id: "2",
    subject: "How to set up recurring payments?",
    status: "resolved",
    lastMessage: "That worked! Thank you so much for your help.",
    lastMessageDate: "3 days ago",
    unread: false,
    messages: [
      { id: "2a", sender: "merchant", senderName: "You", content: "I want to set up recurring payments for my subscription customers. How do I do that?", timestamp: "Dec 6, 2025 10:00 AM" },
      { id: "2b", sender: "support", senderName: "Mike from PigBank", content: "Great question! You can set up recurring payments through the Subscriptions feature. Go to Payment Methods > Subscriptions and click 'Create Subscription Plan'.", timestamp: "Dec 6, 2025 10:30 AM" },
      { id: "2c", sender: "merchant", senderName: "You", content: "That worked! Thank you so much for your help.", timestamp: "Dec 6, 2025 11:00 AM" },
    ]
  },
  {
    id: "3",
    subject: "Payout not received",
    status: "resolved",
    lastMessage: "The payout has been processed and should arrive within 1-2 business days.",
    lastMessageDate: "1 week ago",
    unread: false,
    messages: [
      { id: "3a", sender: "merchant", senderName: "You", content: "I haven't received my payout that was scheduled for last Friday. Can you check on this?", timestamp: "Dec 2, 2025 9:00 AM" },
      { id: "3b", sender: "support", senderName: "Jessica from PigBank", content: "I'm sorry to hear that. Let me check your payout status right away.", timestamp: "Dec 2, 2025 9:30 AM" },
      { id: "3c", sender: "support", senderName: "Jessica from PigBank", content: "I found the issue - there was a temporary hold on your account due to a verification requirement. I've cleared that now.", timestamp: "Dec 2, 2025 10:00 AM" },
      { id: "3d", sender: "support", senderName: "Jessica from PigBank", content: "The payout has been processed and should arrive within 1-2 business days.", timestamp: "Dec 2, 2025 10:05 AM" },
    ]
  },
];

export default function CustomerSupport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newConvoSubject, setNewConvoSubject] = useState("");
  const [newConvoCategory, setNewConvoCategory] = useState("");
  const [newConvoMessage, setNewConvoMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useAuth();
  const isDemoActive = user?.demoActive ?? false;

  const threadsData = isDemoActive ? demoThreads : [];
  
  const filteredThreads = threadsData.filter(thread =>
    thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  const handleStartConversation = () => {
    if (!newConvoSubject.trim() || !newConvoMessage.trim()) return;
    setNewConvoSubject("");
    setNewConvoCategory("");
    setNewConvoMessage("");
    setDialogOpen(false);
  };

  if (selectedThread) {
    return (
      <Layout title="Customer Support">
        <div className="space-y-4 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedThread(null)}
            className="mb-2"
            data-testid="button-back-to-threads"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to conversations
          </Button>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedThread.subject}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Started {selectedThread.messages[0]?.timestamp}
                  </p>
                </div>
                <Badge variant={selectedThread.status === "open" ? "default" : "secondary"}>
                  {selectedThread.status === "open" ? "Open" : "Resolved"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {selectedThread.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.sender === "merchant" ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className={message.sender === "support" ? "bg-primary text-primary-foreground" : ""}>
                          {message.senderName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[70%] ${message.sender === "merchant" ? "text-right" : ""}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{message.senderName}</span>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        </div>
                        <div 
                          className={`rounded-lg p-3 ${
                            message.sender === "merchant" 
                              ? "bg-primary text-primary-foreground ml-auto" 
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea 
                    placeholder="Type your message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[60px] resize-none"
                    data-testid="input-new-message"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="self-end"
                    data-testid="button-send-message"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Customer Support">
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-support-title">Customer Support</h1>
            <p className="text-gray-600 mt-1">
              View and manage your conversations with PigBank support
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-new-conversation">
                <Plus className="h-4 w-4 mr-2" />
                New Conversation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start a new conversation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input 
                    id="subject" 
                    placeholder="What do you need help with?"
                    value={newConvoSubject}
                    onChange={(e) => setNewConvoSubject(e.target.value)}
                    data-testid="input-new-subject"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newConvoCategory} onValueChange={setNewConvoCategory}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="billing">Billing & Fees</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="payouts">Payouts</SelectItem>
                      <SelectItem value="account">Account & Settings</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Describe your issue or question..."
                    value={newConvoMessage}
                    onChange={(e) => setNewConvoMessage(e.target.value)}
                    className="min-h-[100px]"
                    data-testid="input-new-message-body"
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleStartConversation}
                  data-testid="button-submit-conversation"
                >
                  Start Conversation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search conversations..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search-conversations"
          />
        </div>

        <Card>
          <CardContent className="p-0">
            {filteredThreads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">No conversations yet</h3>
                <p className="text-muted-foreground mt-1">
                  Start a new conversation to get help from PigBank support
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => setSelectedThread(thread)}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    data-testid={`thread-${thread.id}`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${thread.unread ? "bg-primary" : "bg-transparent"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-medium truncate ${thread.unread ? "text-foreground" : "text-muted-foreground"}`}>
                            {thread.subject}
                          </h3>
                          <Badge variant={thread.status === "open" ? "default" : "secondary"} className="flex-shrink-0">
                            {thread.status === "open" ? "Open" : "Resolved"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {thread.lastMessage}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {thread.lastMessageDate}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
