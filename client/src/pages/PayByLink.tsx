import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Link as LinkIcon, 
  QrCode, 
  ExternalLink,
  Copy
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useStaffApi } from "@/hooks/useStaffApi";

interface PaymentLink {
  id: string;
  name: string;
  description: string;
  price: number;
  linkId: string;
  active: boolean;
  createdAt: string;
  clicks: number;
  conversions: number;
}

const demoLinks: PaymentLink[] = [
  {
    id: "1",
    name: "Almond Croissant",
    description: "Croissant filled with marzipan, topped with sliced almonds.",
    price: 3.50,
    linkId: "almcro",
    active: true,
    createdAt: "2024-12-01",
    clicks: 145,
    conversions: 23
  },
  {
    id: "2",
    name: "Monthly Subscription",
    description: "Premium membership with all features included.",
    price: 29.99,
    linkId: "monsub",
    active: true,
    createdAt: "2024-11-15",
    clicks: 892,
    conversions: 156
  },
  {
    id: "3",
    name: "Consultation Fee",
    description: "One-hour business consultation session.",
    price: 150.00,
    linkId: "conslt",
    active: false,
    createdAt: "2024-10-20",
    clicks: 67,
    conversions: 12
  },
  {
    id: "4",
    name: "Digital Course Access",
    description: "Full access to the complete online course library.",
    price: 199.00,
    linkId: "dgcrs",
    active: true,
    createdAt: "2024-12-05",
    clicks: 234,
    conversions: 45
  }
];

export default function PayByLink() {
  const { user, isPigBankStaff } = useAuth();
  const { isStaffViewingMerchant } = useStaffApi();
  const isDemoActive = user?.demoActive ?? false;
  
  const [links, setLinks] = useState<PaymentLink[]>([]);
  
  // Update links based on demo mode and viewing context
  // When a payment links API is added, this should fetch real merchant links
  // For now: demo mode shows sample data, otherwise show empty state for link creation
  useEffect(() => {
    if (isDemoActive) {
      // Demo mode: show sample links for testing/demonstration
      setLinks(demoLinks);
    } else {
      // Non-demo mode: show empty state (real links would be fetched from API)
      // - PigBank staff not viewing a merchant: empty
      // - PigBank staff viewing a merchant: would fetch that merchant's links
      // - Merchant logged in: would fetch their own links
      setLinks([]);
    }
  }, [isDemoActive, isPigBankStaff, isStaffViewingMerchant]);
  
  const toggleActive = (id: string) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, active: !link.active } : link
    ));
  };

  const copyToClipboard = (linkId: string) => {
    navigator.clipboard.writeText(`https://pay.pigbank.com/${linkId}`);
  };
  
  return (
    <Layout title="Pay by Link">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-pay-by-link-title">
              Pay by Link
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage payment links for your products and services
            </p>
          </div>
          <Button className="bg-[#73cb43e6] hover:bg-[#65b538] text-white gap-2">
            <Plus className="h-4 w-4" />
            Create New Link
          </Button>
        </div>

        {/* Links List */}
        <div className="space-y-3">
          {links.map((link) => (
            <Card key={link.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Link Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <Link 
                        href={`/pay-by-link/${link.id}`}
                        className="font-semibold text-lg hover:text-[#73cb43] transition-colors"
                      >
                        {link.name}
                      </Link>
                      <Badge 
                        variant={link.active ? "default" : "secondary"} 
                        className={link.active ? "bg-[#73cb43] hover:bg-[#73cb43]" : ""}
                      >
                        {link.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                      {link.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        pay.pigbank.com/{link.linkId}
                      </span>
                      <span className="font-semibold text-[#4a9c22] dark:text-[#73cb43]">
                        ${link.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">{link.clicks}</div>
                      <div className="text-xs text-muted-foreground">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{link.conversions}</div>
                      <div className="text-xs text-muted-foreground">Sales</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">
                        {link.clicks > 0 ? ((link.conversions / link.clicks) * 100).toFixed(1) : 0}%
                      </div>
                      <div className="text-xs text-muted-foreground">Rate</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 lg:border-l lg:pl-4 lg:ml-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Active</span>
                      <Switch 
                        checked={link.active} 
                        onCheckedChange={() => toggleActive(link.id)}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => copyToClipboard(link.linkId)}
                      title="Copy Link"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      title="Get QR Code"
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                    <Link href={`/pay-by-link/${link.id}`}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        title="View Details"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {links.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <LinkIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payment links yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first payment link to start accepting payments
              </p>
              <Button className="bg-[#73cb43e6] hover:bg-[#65b538] text-white gap-2">
                <Plus className="h-4 w-4" />
                Create New Link
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
