import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Check, Plus, ExternalLink, Filter, Send } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface WixIntegrationData {
  id: string;
  isActive: boolean;
}

const staticIntegrations = [
  {
    id: "wix",
    name: "Wix",
    description: "Connect your Wix store to accept payments through PigBank's secure payment gateway.",
    category: "E-commerce",
    popular: true,
    color: "bg-gradient-to-br from-[#0C6EFC] to-[#5C4EE5]",
    configurable: true,
    route: "/integrations/wix"
  },
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    description: "Automatically sync sales receipts, invoices, and customer data to your QuickBooks Online account.",
    category: "Accounting",
    popular: true,
    color: "bg-[#2CA01C]",
    configurable: false
  },
  {
    id: "xero",
    name: "Xero",
    description: "Seamlessly reconcile transactions and manage your business finances with Xero integration.",
    category: "Accounting",
    popular: false,
    color: "bg-[#13B5EA]",
    configurable: false
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Accept payments on your Shopify store using our secure payment gateway.",
    category: "E-commerce",
    popular: true,
    color: "bg-[#95BF47]",
    configurable: false
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "The most customizable eCommerce platform for building your online business.",
    category: "E-commerce",
    popular: true,
    color: "bg-[#96588A]",
    configurable: false
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get real-time notifications for payments, disputes, and daily summaries in your team's channel.",
    category: "Communication",
    popular: false,
    color: "bg-[#4A154B]",
    configurable: false
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect with 5,000+ apps to automate your workflows without writing any code.",
    category: "Automation",
    popular: true,
    color: "bg-[#FF4F00]",
    configurable: false
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Sync customer emails from transactions to your marketing lists automatically.",
    category: "Marketing",
    popular: false,
    color: "bg-[#FFE01B]",
    configurable: false
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Create contacts and deals in HubSpot CRM from your payment activities.",
    category: "CRM",
    popular: false,
    color: "bg-[#FF7A59]",
    configurable: false
  }
];

export default function Integrations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const { toast } = useToast();

  const { data: wixIntegrations = [] } = useQuery<WixIntegrationData[]>({
    queryKey: ["/api/integrations/wix"],
  });

  const wixConnected = wixIntegrations.length > 0;

  const handleRequestIntegration = (integrationName: string) => {
    toast({
      title: "Request received!",
      description: `We've noted your interest in ${integrationName}. We'll notify you when it becomes available.`,
    });
  };

  const integrations = staticIntegrations.map(integration => ({
    ...integration,
    status: integration.id === "wix" && wixConnected ? "connected" : "disconnected"
  }));

  const categories = ["All", "Accounting", "E-commerce", "Communication", "Automation", "Marketing", "CRM"];

  const filteredIntegrations = integrations.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filter === "All" || item.category === filter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout title="Integrations">
      <div className="space-y-8 max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-integrations-title">
              Integrations
            </h1>
            <p className="text-muted-foreground mt-1">
              Connect your favorite apps and services to streamline your workflow
            </p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                className="pl-9 bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        {/* <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(cat)}
              className="rounded-full whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div> */}

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => {
            const isAvailable = integration.configurable || integration.status === "connected";
            return (
            <Card key={integration.id} className={`flex flex-col border-border shadow-sm transition-all duration-200 ${isAvailable ? "hover:shadow-md" : "bg-muted/30"}`}>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className={`w-12 h-12 rounded-lg ${integration.color} flex items-center justify-center text-white font-bold text-xl shadow-sm ${!isAvailable ? "grayscale opacity-50" : ""}`}>
                    {integration.name.charAt(0)}
                  </div>
                  {integration.status === "connected" && (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
                      <Check className="w-3 h-3" /> Connected
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{integration.name}</CardTitle>
                <CardDescription className={`line-clamp-2 h-10 ${!isAvailable ? "text-foreground/70" : ""}`}>
                  {integration.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-md bg-muted/50 border border-border text-foreground/80">
                    {integration.category}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t bg-muted/5">
                {integration.status === "connected" ? (
                   <div className="w-full flex items-center justify-between">
                      <span className="text-sm font-medium text-emerald-600">Active</span>
                      {integration.configurable && integration.route ? (
                        <Link href={integration.route}>
                          <Button variant="outline" size="sm" data-testid={`button-configure-${integration.id}`}>Configure</Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="sm" data-testid={`button-configure-${integration.id}`}>Configure</Button>
                      )}
                   </div>
                ) : integration.configurable && integration.route ? (
                  <Link href={integration.route} className="w-full">
                    <Button className="w-full bg-[#73cb43] hover:bg-[#65b53b] text-white" data-testid={`button-connect-${integration.id}`}>
                      Connect
                    </Button>
                  </Link>
                ) : (
                  <div className="w-full text-center">
                    <p className="text-xs text-foreground/60 mb-2">Coming soon</p>
                    <Button 
                      className="w-full" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRequestIntegration(integration.name)}
                      data-testid={`button-request-${integration.id}`}
                    >
                      <Send className="w-3 h-3 mr-2" />
                      Request This Integration
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          );
          })}
        </div>

        {/* Empty State */}
        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No integrations found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <Button variant="link" className="mt-2 text-primary">
              Request an integration
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
