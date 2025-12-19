import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  MessageSquare, 
  Clock, 
  ChevronRight,
  Send,
  ArrowLeft,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  sender: "merchant" | "support";
  senderName: string;
  content: string;
  timestamp: string;
}

interface MerchantThread {
  id: string;
  merchantName: string;
  merchantEmail: string;
  subject: string;
  status: "open" | "resolved" | "pending";
  priority: "low" | "normal" | "high";
  lastMessage: string;
  lastMessageDate: string;
  unread: boolean;
  assignedTo: string;
  messages: Message[];
}

const demoMerchantThreads: MerchantThread[] = [];

export default function PigBankMessages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThread, setSelectedThread] = useState<MerchantThread | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const getFilteredThreads = () => {
    let filtered = demoMerchantThreads;
    
    if (activeTab === "unread") {
      filtered = filtered.filter(t => t.unread);
    } else if (activeTab === "open") {
      filtered = filtered.filter(t => t.status === "open" || t.status === "pending");
    } else if (activeTab === "resolved") {
      filtered = filtered.filter(t => t.status === "resolved");
    }
    
    if (searchQuery) {
      filtered = filtered.filter(thread =>
        thread.merchantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.merchantEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredThreads = getFilteredThreads();
  const openCount = demoMerchantThreads.filter(t => t.status === "open" || t.status === "pending").length;
  const unreadCount = demoMerchantThreads.filter(t => t.unread).length;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  const handleMarkResolved = () => {
    if (selectedThread) {
      setSelectedThread({ ...selectedThread, status: "resolved" });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-[#b91c1c]/20 text-[#b91c1c] border border-[#b91c1c] dark:bg-red-900/30 dark:text-red-400 dark:border-red-700";
      case "normal": return "bg-blue-100 text-blue-700 border border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700";
      case "low": return "bg-gray-100 text-gray-600 border border-gray-600 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600";
      default: return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-[#73cb43]/20 text-[#39870E] border border-[#39870E] dark:bg-green-900/30 dark:text-green-400 dark:border-green-700";
      case "pending": return "bg-[#f0b100]/20 text-[#f0b100] border border-[#f0b100] dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700";
      case "resolved": return "bg-gray-100 text-gray-600 border border-gray-600 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600";
      default: return "";
    }
  };

  if (selectedThread) {
    return (
      <Layout title="PigBank Messages">
        <div className="space-y-4 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedThread(null)}
            className="mb-2"
            data-testid="button-back-to-threads"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to messages
          </Button>

          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{selectedThread.subject}</CardTitle>
                    <Badge className={getPriorityColor(selectedThread.priority)}>
                      {selectedThread.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{selectedThread.merchantName}</span>
                    <span>{selectedThread.merchantEmail}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedThread.status)}>
                    {selectedThread.status}
                  </Badge>
                  {selectedThread.status !== "resolved" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleMarkResolved}
                      data-testid="button-mark-resolved"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Resolved
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {selectedThread.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.sender === "support" ? "flex-row-reverse" : ""}`}
                    >
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className={message.sender === "support" ? "bg-primary text-primary-foreground" : ""}>
                          {message.senderName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`max-w-[70%] ${message.sender === "support" ? "text-right" : ""}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{message.senderName}</span>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        </div>
                        <div 
                          className={`rounded-lg p-3 ${
                            message.sender === "support" 
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
                    placeholder="Type your reply to the merchant..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="min-h-[60px] resize-none"
                    data-testid="input-reply-message"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="self-end"
                    data-testid="button-send-reply"
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
    <Layout title="PigBank Messages">
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-messages-title">PigBank Messages</h1>
            <p className="text-muted-foreground mt-1">
              Manage support conversations with all merchants
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <span>{openCount} open</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span>{unreadCount} unread</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by merchant name, email, or subject..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-messages"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#256726] dark:bg-[#262626]">
            <TabsTrigger value="all" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white" data-testid="tab-all">All Messages</TabsTrigger>
            <TabsTrigger value="unread" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white" data-testid="tab-unread">
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="open" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white" data-testid="tab-open">
              Open {openCount > 0 && `(${openCount})`}
            </TabsTrigger>
            <TabsTrigger value="resolved" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white" data-testid="tab-resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardContent className="p-0">
                {filteredThreads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-medium text-lg">No messages found</h3>
                    <p className="text-muted-foreground mt-1">
                      {activeTab === "unread" ? "No unread messages" : 
                       activeTab === "open" ? "No open conversations" :
                       activeTab === "resolved" ? "No resolved conversations" :
                       "No merchant messages yet"}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredThreads.map((thread) => (
                      <div
                        key={thread.id}
                        onClick={() => setSelectedThread(thread)}
                        className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                        data-testid={`merchant-thread-${thread.id}`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${thread.unread ? "bg-primary" : "bg-transparent"}`} />
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarFallback>{thread.merchantName[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <span className={`font-medium ${thread.unread ? "text-foreground" : "text-muted-foreground"}`}>
                              {thread.merchantName}
                            </span>
                            <h3 className={`text-sm truncate mt-0.5 ${thread.unread ? "font-medium" : ""}`}>
                              {thread.subject}
                            </h3>
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {thread.lastMessage}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-4">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {thread.lastMessageDate}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {thread.assignedTo}
                          </span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
