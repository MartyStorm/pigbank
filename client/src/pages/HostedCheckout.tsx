import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Save, Globe, LayoutTemplate, Check, Upload, Smartphone, Monitor, CreditCard, ShieldCheck, Lock, Palette, Type, Image as ImageIcon, FileText, Timer, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMerchantView } from "@/hooks/useMerchantView";
import { useAuth } from "@/hooks/useAuth";
import type { CheckoutSettings } from "@shared/schema";

export default function HostedCheckout() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { viewingMerchant, isViewingMerchant } = useMerchantView();
  const { isPigBankStaff } = useAuth();
  
  // Determine the API endpoint based on staff view mode
  const settingsEndpoint = isPigBankStaff && isViewingMerchant && viewingMerchant
    ? `/api/staff/merchants/${viewingMerchant.id}/checkout-settings`
    : '/api/checkout-settings';
  
  // Fetch checkout settings - include endpoint in query key to ensure refetch when merchant changes
  const { data: settings, isLoading: isLoadingSettings } = useQuery<CheckoutSettings | null>({
    queryKey: ['checkout-settings', settingsEndpoint],
    queryFn: async () => {
      const res = await fetch(settingsEndpoint, { credentials: 'include' });
      if (!res.ok) {
        if (res.status === 400) return null;
        throw new Error('Failed to fetch settings');
      }
      return res.json();
    },
  });
  
  // Get merchant name for display
  const merchantDisplayName = isPigBankStaff && isViewingMerchant && viewingMerchant
    ? (viewingMerchant.dba || viewingMerchant.legalBusinessName || "Merchant")
    : "Acme Corp";
  
  // Customization State with defaults
  const [brandName, setBrandName] = useState(merchantDisplayName);
  const [primaryColor, setPrimaryColor] = useState("#0f172a");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(40);
  const [showPhone, setShowPhone] = useState(true);
  const [showBillingAddress, setShowBillingAddress] = useState(true);
  const [showCoupons, setShowCoupons] = useState(false);
  const [collectShipping, setCollectShipping] = useState(false);
  const [buttonText, setButtonText] = useState("Pay Now");
  const [showLockIcon, setShowLockIcon] = useState(true);
  const [enableTimer, setEnableTimer] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [showPciCompliant, setShowPciCompliant] = useState(true);
  const [showSecureSsl, setShowSecureSsl] = useState(true);
  const [backgroundStyle, setBackgroundStyle] = useState("light");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "File too large", description: "Please select an image under 2MB", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          if (img.width < 200 || img.height < 200) {
            toast({ 
              title: "Image too small", 
              description: "Please upload an image at least 200x200 pixels for best quality", 
              variant: "destructive" 
            });
            return;
          }
          setLogoUrl(reader.result as string);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Load settings when data is fetched
  useEffect(() => {
    if (settings) {
      setBrandName(settings.brandName || merchantDisplayName);
      setPrimaryColor(settings.primaryColor || "#0f172a");
      setLogoUrl(settings.logoUrl || null);
      setShowPhone(settings.showPhone ?? true);
      setShowBillingAddress(settings.showBillingAddress ?? true);
      setShowCoupons(settings.showCoupons ?? false);
      setCollectShipping(settings.collectShipping ?? false);
      setButtonText(settings.buttonText || "Pay Now");
      setShowLockIcon(settings.showLockIcon ?? true);
      setEnableTimer(settings.enableTimer ?? false);
      setTimerMinutes(settings.timerMinutes ?? 10);
      setShowPciCompliant(settings.showPciCompliant ?? true);
      setShowSecureSsl(settings.showSecureSsl ?? true);
      setBackgroundStyle(settings.backgroundStyle || "light");
    }
  }, [settings, merchantDisplayName]);
  
  // Determine save endpoint based on staff view mode
  const saveEndpoint = isPigBankStaff && isViewingMerchant && viewingMerchant
    ? `/api/staff/merchants/${viewingMerchant.id}/checkout-settings`
    : '/api/checkout-settings';
  
  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<CheckoutSettings>) => {
      const res = await fetch(saveEndpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkout-settings', saveEndpoint] });
      toast({
        title: "Settings Saved",
        description: "Your hosted payment page settings have been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveMutation.mutate({
      brandName,
      primaryColor,
      logoUrl,
      showPhone,
      showBillingAddress,
      showCoupons,
      collectShipping,
      buttonText,
      showLockIcon,
      enableTimer,
      timerMinutes,
      showPciCompliant,
      showSecureSsl,
      backgroundStyle,
    });
  };
  
  // Check if staff is viewing a merchant
  const isStaffViewingMerchant = isPigBankStaff && isViewingMerchant;

  return (
    <Layout title="Hosted Payment Page">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-hosted-checkout-title">
              Hosted Payment Page
            </h1>
            <p className="text-gray-600 mt-1">
              Customize your hosted checkout experience for customers
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-6 h-auto xl:h-[calc(100vh-8rem)] mt-6">
        
        {/* Editor Panel */}
        <div className="w-full xl:w-96 flex flex-col gap-4 bg-white dark:bg-card rounded-xl border border-border shadow-sm overflow-visible xl:overflow-hidden">
          <div className="p-4 border-b border-border bg-[#2d7438] rounded-t-xl">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-lg text-white">Customize Checkout</h2>
              <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-white hover:bg-gray-100 text-[#1a4320] font-semibold">
                {saveMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
            <p className="text-sm text-white/80">
              {isStaffViewingMerchant 
                ? `Editing checkout for ${merchantDisplayName}` 
                : "Design your payment page experience"}
            </p>
          </div>

          <div className="w-full xl:flex-1 flex flex-col min-h-0">
            <div className="xl:flex-1 xl:overflow-y-auto xl:min-h-0">
                <Accordion type="single" collapsible className="w-full">
                
                <AccordionItem value="themes" className="px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      <span>Themes & Colors</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Brand Color</Label>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-md border border-border shadow-sm"
                          style={{ backgroundColor: primaryColor }}
                        />
                        <Input 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)} 
                          className="font-mono"
                          
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Background Style</Label>
                      <Select value={backgroundStyle} onValueChange={setBackgroundStyle} >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light Clean</SelectItem>
                          <SelectItem value="dark">Dark Modern</SelectItem>
                          <SelectItem value="gradient">Soft Gradient</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="logo" className="px-4">
                  <AccordionTrigger className="hover:no-underline">
                     <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span>Logo</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Brand Name</Label>
                      <Input value={brandName} onChange={(e) => setBrandName(e.target.value)}  />
                    </div>
                    <div 
                      className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        className="hidden"
                        onChange={handleLogoUpload}
                      />
                      {logoUrl ? (
                        <>
                          <img src={logoUrl} alt="Logo" className="h-16 max-w-48 object-contain mb-2" />
                          <span className="text-sm text-muted-foreground font-medium">Change Logo</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground font-medium">Upload Logo</span>
                          <span className="text-xs text-muted-foreground/70 mt-1">PNG, JPG up to 2MB</span>
                        </>
                      )}
                    </div>
                    {logoUrl && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Logo Size</Label>
                          <span className="text-sm text-muted-foreground">{logoSize}px</span>
                        </div>
                        <Slider 
                          value={[logoSize]} 
                          onValueChange={(v) => setLogoSize(v[0])} 
                          min={24} 
                          max={80} 
                          step={4}
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Switch id="show-logo" defaultChecked  />
                      <Label htmlFor="show-logo">Show Logo</Label>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="header" className="px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <LayoutTemplate className="h-4 w-4" />
                      <span>Header</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sticky-header">Sticky Header</Label>
                      <Switch id="sticky-header"  />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-cart">Show Cart Summary</Label>
                      <Switch id="show-cart" defaultChecked  />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fields" className="px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>Form Fields</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-phone">Phone Number</Label>
                      <Switch id="show-phone" checked={showPhone} onCheckedChange={setShowPhone}  />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-billing">Billing Address</Label>
                      <Switch id="show-billing" checked={showBillingAddress} onCheckedChange={setShowBillingAddress}  />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-shipping">Shipping Address</Label>
                      <Switch id="show-shipping" checked={collectShipping} onCheckedChange={setCollectShipping}  />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-coupons">Discount Codes</Label>
                      <Switch id="show-coupons" checked={showCoupons} onCheckedChange={setShowCoupons}  />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="button" className="px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Payment Button</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <Label>Button Text</Label>
                      <Input value={buttonText} onChange={(e) => setButtonText(e.target.value)}  />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-lock">Show Lock Icon</Label>
                      <Switch id="show-lock" checked={showLockIcon} onCheckedChange={setShowLockIcon}  />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="timer" className="px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4" />
                      <span>Timer Box</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-timer">Enable Checkout Timer</Label>
                      <Switch id="enable-timer" checked={enableTimer} onCheckedChange={setEnableTimer}  />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration (minutes)</Label>
                      <Input type="number" value={timerMinutes} onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 10)}  />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                 <AccordionItem value="badges" className="px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4" />
                      <span>Trust Badges</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-pci">Show PCI Compliant</Label>
                      <Switch id="show-pci" checked={showPciCompliant} onCheckedChange={setShowPciCompliant}  />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-secure">Show Secure SSL</Label>
                      <Switch id="show-secure" checked={showSecureSsl} onCheckedChange={setShowSecureSsl}  />
                    </div>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </div>

        </div>

        {/* Preview Panel */}
        <div className="flex-1 bg-muted/30 rounded-xl border border-border flex flex-col xl:overflow-hidden min-h-[600px] xl:min-h-0">
          <div className="h-12 border-b border-border bg-[#2d7438] rounded-t-xl flex items-center justify-between px-4">
            <div className="flex items-center gap-2 text-sm text-white">
              <Globe className="h-4 w-4" />
              <span className="font-mono">checkout.pigbank.com/pay/demo-123</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 p-1 rounded-lg border border-white/30">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-7 px-2 text-white hover:bg-white/20", previewMode === "desktop" && "bg-white text-[#1a4320] shadow-sm hover:bg-white")}
                onClick={() => setPreviewMode("desktop")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-7 px-2 text-white hover:bg-white/20", previewMode === "mobile" && "bg-white text-[#1a4320] shadow-sm hover:bg-white")}
                onClick={() => setPreviewMode("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="xl:flex-1 xl:overflow-y-auto p-4 md:p-8 flex items-start justify-center bg-gray-100/50">
            <div 
              className={cn(
                "bg-white shadow-xl rounded-lg transition-all duration-300 overflow-hidden border border-gray-200",
                previewMode === "desktop" ? "w-full max-w-4xl grid grid-cols-1 md:grid-cols-2" : "w-[375px] flex flex-col"
              )}
            >
              {/* Checkout Left: Payment Form */}
              <div className={cn("p-6 md:p-8 space-y-6 bg-white", previewMode === "mobile" ? "order-2" : "order-1")}>
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg text-gray-900">Payment Details</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Email Address</Label>
                      <Input placeholder="you@example.com" className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400" />
                    </div>

                    {showPhone && (
                      <div className="space-y-2">
                        <Label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Phone Number</Label>
                        <Input placeholder="+1 (555) 000-0000" className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400" />
                      </div>
                    )}

                    {collectShipping && (
                      <div className="space-y-2">
                        <Label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Shipping Address</Label>
                        <Input placeholder="123 Main St" className="mb-2 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400" />
                        <div className="grid grid-cols-2 gap-2">
                          <Input placeholder="City" className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400" />
                          <Input placeholder="ZIP Code" className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400" />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Card Information</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input placeholder="Card number" className="pl-9 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="MM / YY" className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400" />
                        <Input placeholder="CVC" className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400" />
                      </div>
                    </div>

                    {showBillingAddress && (
                       <div className="space-y-2">
                        <Label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Name on Card</Label>
                        <Input placeholder="Full Name" className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400" />
                      </div>
                    )}

                    {showCoupons && (
                       <div className="space-y-2 pt-2">
                        <Label className="text-xs uppercase text-gray-500 font-bold tracking-wider">Discount Code</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Promo Code" className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-gray-400" />
                          <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">Apply</Button>
                        </div>
                      </div>
                    )}

                    <Button 
                      className="hover-elevate active-elevate-2 border-primary-border inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 min-h-9 px-4 py-2 w-full h-12 text-base font-semibold mt-4 text-white shadow-sm hover:opacity-90 transition-opacity border-0 bg-[#72cb43]"
                    >
                      {showLockIcon && <Lock className="h-4 w-4 mr-1" />}
                      {buttonText} $49.00
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-4">
                      <Lock className="h-3 w-3" />
                      <span>Payments are secure and encrypted</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checkout Right: Order Summary */}
              <div className={cn("bg-gray-50/80 p-6 md:p-8 space-y-6 border-gray-100", previewMode === "mobile" ? "order-1 border-b" : "order-2 border-l")}>
                <div className="flex items-center gap-3 mb-8">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" style={{ height: `${logoSize}px`, maxWidth: '200px' }} className="object-contain" />
                  ) : (
                    <div className="h-8 w-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                      <LayoutTemplate className="h-5 w-5 text-gray-900" style={{ color: primaryColor }} />
                    </div>
                  )}
                  <span className="font-bold text-lg text-gray-900">{brandName}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 bg-white rounded-md border border-gray-200 flex items-center justify-center shadow-sm">
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Premium Subscription</h3>
                      <p className="text-sm text-gray-500">Monthly Plan</p>
                      <p className="font-semibold mt-1 text-gray-900">$49.00</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">$49.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span className="text-gray-900">$0.00</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200 mt-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">$49.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
