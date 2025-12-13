import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Link as LinkIcon, 
  QrCode, 
  Pencil,
  Copy
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app this would come from API
const mockLinks: Record<string, {
  id: string;
  name: string;
  description: string;
  price: number;
  linkId: string;
  active: boolean;
  linkType: string;
  maxQuantity: number;
  createdAt: string;
  clicks: number;
  conversions: number;
}> = {
  "1": {
    id: "1",
    name: "Almond Croissant",
    description: "Croissant filled with marzipan, topped with sliced almonds.",
    price: 3.50,
    linkId: "almcro",
    active: true,
    linkType: "Sell an item",
    maxQuantity: 1,
    createdAt: "2024-12-01",
    clicks: 145,
    conversions: 23
  },
  "2": {
    id: "2",
    name: "Monthly Subscription",
    description: "Premium membership with all features included.",
    price: 29.99,
    linkId: "monsub",
    active: true,
    linkType: "Subscription",
    maxQuantity: 1,
    createdAt: "2024-11-15",
    clicks: 892,
    conversions: 156
  },
  "3": {
    id: "3",
    name: "Consultation Fee",
    description: "One-hour business consultation session.",
    price: 150.00,
    linkId: "conslt",
    active: false,
    linkType: "Service",
    maxQuantity: 1,
    createdAt: "2024-10-20",
    clicks: 67,
    conversions: 12
  },
  "4": {
    id: "4",
    name: "Digital Course Access",
    description: "Full access to the complete online course library.",
    price: 199.00,
    linkId: "dgcrs",
    active: true,
    linkType: "Digital Product",
    maxQuantity: 1,
    createdAt: "2024-12-05",
    clicks: 234,
    conversions: 45
  }
};

export default function PayByLinkDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const linkData = mockLinks[id || "1"];
  const [active, setActive] = useState(linkData?.active ?? true);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://pay.pigbank.com/${linkData?.linkId}`);
    toast({
      title: "Link Copied",
      description: "Payment link copied to clipboard"
    });
  };

  if (!linkData) {
    return (
      <Layout title="Pay by Link">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Payment Link Not Found</h2>
          <Link href="/pay-by-link">
            <Button variant="outline">Back to Payment Links</Button>
          </Link>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout title="Pay by Link">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Back Link */}
        <Link href="/pay-by-link" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Payment Links
        </Link>

        {/* Page Header with Status */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-pay-by-link-detail-title">
              {linkData.name}
            </h1>
            <Badge variant={active ? "default" : "secondary"} className={active ? "bg-[#73cb43] hover:bg-[#73cb43]" : ""}>
              {active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-4">
            {/* Combined Details Card */}
            <Card>
              <CardContent className="p-5 space-y-4">
                {/* Link Type Section */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Link Type</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium">{linkData.linkType}</span>
                    <span className="text-sm text-muted-foreground">— Fixed price product or service</span>
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Checkout Details Section */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Checkout Details</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-3 gap-x-6">
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">Item name</div>
                      <div className="font-medium">{linkData.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">Link ID</div>
                      <div className="font-mono text-sm">{linkData.linkId}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">Price</div>
                      <div className="font-semibold text-[#4a9c22] dark:text-[#73cb43]">${linkData.price.toFixed(2)} USD</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-0.5">Max quantity</div>
                      <div>{linkData.maxQuantity} per order</div>
                    </div>
                    <div className="col-span-2 sm:col-span-4">
                      <div className="text-xs text-muted-foreground mb-0.5">Description</div>
                      <div className="text-sm text-foreground/80">{linkData.description}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Stats Section */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Performance</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">{linkData.clicks}</div>
                      <div className="text-xs text-muted-foreground">Total Clicks</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">{linkData.conversions}</div>
                      <div className="text-xs text-muted-foreground">Conversions</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">
                        {linkData.clicks > 0 ? ((linkData.conversions / linkData.clicks) * 100).toFixed(1) : 0}%
                      </div>
                      <div className="text-xs text-muted-foreground">Conversion Rate</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Customer Data Section */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">Customer Data</h3>
                  <div className="text-sm text-muted-foreground italic">No customer data requirements configured.</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Actions - 1 column */}
          <div className="lg:col-span-1 space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Quick Actions</div>
            <Button 
              className="w-full justify-start h-10 bg-[#73cb43] hover:bg-[#65b538] text-white gap-2 shadow-sm text-sm"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </Button>
            
            <Button className="w-full justify-start h-10 bg-[#73cb43] hover:bg-[#65b538] text-white gap-2 shadow-sm text-sm">
              <QrCode className="h-4 w-4" />
              Get QR Code
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
