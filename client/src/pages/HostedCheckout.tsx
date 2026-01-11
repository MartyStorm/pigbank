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
  const [showAcceptedCards, setShowAcceptedCards] = useState(true);
  const [showMoneyBackGuarantee, setShowMoneyBackGuarantee] = useState(false);
  const [showSecureMessage, setShowSecureMessage] = useState(true);
  const [showPoweredByPigBank, setShowPoweredByPigBank] = useState(true);
  const [badgeColor, setBadgeColor] = useState("#6b7280");
  const [backgroundStyle, setBackgroundStyle] = useState("light");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Extended color customization
  const [backgroundColor, setBackgroundColor] = useState("#f8f9fa");
  const [formBackgroundColor, setFormBackgroundColor] = useState("#ffffff");
  const [headingTextColor, setHeadingTextColor] = useState("#111827");
  const [bodyTextColor, setBodyTextColor] = useState("#6b7280");
  const [labelTextColor, setLabelTextColor] = useState("#6b7280");
  const [buttonColor, setButtonColor] = useState("#73cb43");
  const [buttonTextColor, setButtonTextColor] = useState("#ffffff");
  const [inputBackgroundColor, setInputBackgroundColor] = useState("#ffffff");
  const [inputBorderColor, setInputBorderColor] = useState("#e5e7eb");
  const [summaryBackgroundColor, setSummaryBackgroundColor] = useState("#f9fafb");

  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please select an image under 2MB", variant: "destructive" });
      return;
    }
    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      toast({ title: "Invalid file type", description: "Please upload a PNG or JPG image", variant: "destructive" });
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
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
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
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Customize your hosted checkout experience for customers
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col xl:flex-row gap-6 h-auto xl:h-[calc(100vh-8rem)] mt-6">
        
        {/* Editor Panel */}
        <div className="w-full xl:w-96 flex flex-col gap-4 bg-white dark:bg-card rounded-xl border border-border shadow-sm overflow-visible xl:overflow-hidden">
          <div className="p-4 border-b border-border dark:bg-[#262626] rounded-t-xl bg-[#1a4320]">
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold text-lg text-white">Customize Checkout</h2>
              <p className="text-sm text-white/80">
                {isStaffViewingMerchant 
                  ? `Editing checkout for ${merchantDisplayName}` 
                  : "Design your payment page experience"}
              </p>
            </div>
          </div>

          <div className="w-full xl:flex-1 flex flex-col min-h-0">
            <div className="xl:flex-1 xl:overflow-y-auto xl:min-h-0">
                <Accordion type="single" collapsible className="w-full">
                
                <AccordionItem value="themes" className="px-4">
                  <AccordionTrigger className="hover:no-underline text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      <span>Themes & Colors</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2 pb-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Page Background</Label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="w-10 h-10 rounded-md border border-border shadow-sm cursor-pointer" />
                        <Input value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="font-mono text-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Form Background</Label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={formBackgroundColor} onChange={(e) => setFormBackgroundColor(e.target.value)} className="w-10 h-10 rounded-md border border-border shadow-sm cursor-pointer" />
                        <Input value={formBackgroundColor} onChange={(e) => setFormBackgroundColor(e.target.value)} className="font-mono text-sm" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Order Summary Background</Label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={summaryBackgroundColor} onChange={(e) => setSummaryBackgroundColor(e.target.value)} className="w-10 h-10 rounded-md border border-border shadow-sm cursor-pointer" />
                        <Input value={summaryBackgroundColor} onChange={(e) => setSummaryBackgroundColor(e.target.value)} className="font-mono text-sm" />
                      </div>
                    </div>
                    <div className="border-t border-border pt-4 mt-4">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3 block">Text Colors</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Headings</Label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={headingTextColor} onChange={(e) => setHeadingTextColor(e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer" />
                            <Input value={headingTextColor} onChange={(e) => setHeadingTextColor(e.target.value)} className="font-mono text-xs h-8" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Body Text</Label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={bodyTextColor} onChange={(e) => setBodyTextColor(e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer" />
                            <Input value={bodyTextColor} onChange={(e) => setBodyTextColor(e.target.value)} className="font-mono text-xs h-8" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Labels</Label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={labelTextColor} onChange={(e) => setLabelTextColor(e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer" />
                            <Input value={labelTextColor} onChange={(e) => setLabelTextColor(e.target.value)} className="font-mono text-xs h-8" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-border pt-4 mt-4">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3 block">Button Styling</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Button Color</Label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer" />
                            <Input value={buttonColor} onChange={(e) => setButtonColor(e.target.value)} className="font-mono text-xs h-8" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Button Text</Label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={buttonTextColor} onChange={(e) => setButtonTextColor(e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer" />
                            <Input value={buttonTextColor} onChange={(e) => setButtonTextColor(e.target.value)} className="font-mono text-xs h-8" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-border pt-4 mt-4">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3 block">Input Fields</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Background</Label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={inputBackgroundColor} onChange={(e) => setInputBackgroundColor(e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer" />
                            <Input value={inputBackgroundColor} onChange={(e) => setInputBackgroundColor(e.target.value)} className="font-mono text-xs h-8" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Border</Label>
                          <div className="flex items-center gap-2">
                            <input type="color" value={inputBorderColor} onChange={(e) => setInputBorderColor(e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer" />
                            <Input value={inputBorderColor} onChange={(e) => setInputBorderColor(e.target.value)} className="font-mono text-xs h-8" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="logo" className="px-4">
                  <AccordionTrigger className="hover:no-underline text-gray-900 dark:text-gray-100">
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
                      className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${isDragging ? 'border-[#73cb43] bg-[#73cb43]/10' : 'border-border hover:bg-muted/50'}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
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
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Change Logo</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Upload Logo</span>
                          <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">PNG, JPG up to 2MB</span>
                        </>
                      )}
                    </div>
                    {logoUrl && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Logo Size</Label>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{logoSize}px</span>
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
                  <AccordionTrigger className="hover:no-underline text-gray-900 dark:text-gray-100">
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
                  <AccordionTrigger className="hover:no-underline text-gray-900 dark:text-gray-100">
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
                  <AccordionTrigger className="hover:no-underline text-gray-900 dark:text-gray-100">
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
                  <AccordionTrigger className="hover:no-underline text-gray-900 dark:text-gray-100">
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
                  <AccordionTrigger className="hover:no-underline text-gray-900 dark:text-gray-100">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-4 w-4" />
                      <span>Trust Badges</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div className="space-y-2 pb-2 border-b border-border">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-gray-500">Badge Color</Label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={badgeColor} onChange={(e) => setBadgeColor(e.target.value)} className="w-8 h-8 rounded border border-border cursor-pointer" />
                        <Input value={badgeColor} onChange={(e) => setBadgeColor(e.target.value)} className="font-mono text-xs h-8" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-pci">PCI Compliant Badge</Label>
                      <Switch id="show-pci" checked={showPciCompliant} onCheckedChange={setShowPciCompliant} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-secure">SSL Encrypted Badge</Label>
                      <Switch id="show-secure" checked={showSecureSsl} onCheckedChange={setShowSecureSsl} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-cards">Accepted Cards</Label>
                      <Switch id="show-cards" checked={showAcceptedCards} onCheckedChange={setShowAcceptedCards} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-moneyback">Money-Back Guarantee</Label>
                      <Switch id="show-moneyback" checked={showMoneyBackGuarantee} onCheckedChange={setShowMoneyBackGuarantee} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-secure-msg">Secure Payment Message</Label>
                      <Switch id="show-secure-msg" checked={showSecureMessage} onCheckedChange={setShowSecureMessage} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-pigbank">Powered by PigBank</Label>
                      <Switch id="show-pigbank" checked={showPoweredByPigBank} onCheckedChange={setShowPoweredByPigBank} />
                    </div>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </div>
          </div>

          <div className="p-4 flex justify-end">
            <Button onClick={handleSave} disabled={saveMutation.isPending} className="bg-[#73cb43] hover:bg-[#65b53a] text-white font-semibold">
              {saveMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>

        </div>

        {/* Preview Panel */}
        <div className="flex-1 bg-muted/30 rounded-xl border border-border flex flex-col xl:overflow-hidden min-h-[600px] xl:min-h-0">
          <div className="h-12 border-b border-border dark:bg-[#262626] rounded-t-xl flex items-center justify-between px-4 bg-[#1a4320]">
            <div className="flex items-center gap-2 text-sm text-white">
              <Globe className="h-4 w-4" />
              <span className="font-mono">checkout.pigbank.com/pay/demo-123</span>
            </div>
            <div className="flex items-center gap-1 bg-white/15 rounded-md p-0.5">
              <button 
                type="button"
                className={cn("h-6 w-6 flex items-center justify-center rounded text-white/70 hover:text-white transition-colors", previewMode === "desktop" && "bg-white text-[#2d883d]")}
                onClick={() => setPreviewMode("desktop")}
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button 
                type="button"
                className={cn("h-6 w-6 flex items-center justify-center rounded text-white/70 hover:text-white transition-colors", previewMode === "mobile" && "bg-white text-[#2d883d]")}
                onClick={() => setPreviewMode("mobile")}
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="xl:flex-1 xl:overflow-y-auto p-4 md:p-8 flex items-start justify-center" style={{ backgroundColor }}>
            <div 
              className={cn(
                "transition-all duration-300",
                previewMode === "desktop" ? "w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6" : "w-[375px] flex flex-col gap-6"
              )}
            >
              {/* Checkout Left: Order Summary */}
              <div className={cn("p-6 md:p-8 space-y-6 rounded-xl shadow-lg border", previewMode === "mobile" ? "order-1" : "order-1")} style={{ backgroundColor: summaryBackgroundColor, borderColor: inputBorderColor }}>
                <div className="flex items-center gap-3 mb-8">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" style={{ height: `${logoSize}px` }} className="object-contain" />
                  ) : (
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center shadow-sm" style={{ backgroundColor: formBackgroundColor, borderColor: inputBorderColor, borderWidth: '1px' }}>
                      <LayoutTemplate className="h-5 w-5" style={{ color: buttonColor }} />
                    </div>
                  )}
                  <span className="font-bold text-lg" style={{ color: headingTextColor }}>{brandName}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-md flex items-center justify-center shadow-sm" style={{ backgroundColor: formBackgroundColor, borderColor: inputBorderColor, borderWidth: '1px' }}>
                      <span className="text-2xl">📦</span>
                    </div>
                    <div>
                      <h3 className="font-medium" style={{ color: headingTextColor }}>Premium Subscription</h3>
                      <p className="text-sm" style={{ color: bodyTextColor }}>Monthly Plan</p>
                      <p className="font-semibold mt-1" style={{ color: headingTextColor }}>$49.00</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2" style={{ borderTopWidth: '1px', borderColor: inputBorderColor }}>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: bodyTextColor }}>Subtotal</span>
                    <span style={{ color: headingTextColor }}>$49.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: bodyTextColor }}>Tax</span>
                    <span style={{ color: headingTextColor }}>$0.00</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 mt-2" style={{ borderTopWidth: '1px', borderColor: inputBorderColor }}>
                    <span style={{ color: headingTextColor }}>Total</span>
                    <span style={{ color: headingTextColor }}>$49.00</span>
                  </div>
                </div>
              </div>

              {/* Checkout Right: Payment Form */}
              <div className={cn("p-6 md:p-8 space-y-6 rounded-xl shadow-lg border", previewMode === "mobile" ? "order-2" : "order-2")} style={{ backgroundColor: formBackgroundColor, borderColor: inputBorderColor }}>
                <div className="space-y-4">
                  <h2 className="font-semibold text-lg" style={{ color: headingTextColor }}>Payment Details</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold tracking-wider" style={{ color: labelTextColor }}>Full Name</Label>
                      <Input placeholder="John Doe" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold tracking-wider" style={{ color: labelTextColor }}>Email Address</Label>
                      <Input placeholder="you@example.com" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                    </div>

                    {showPhone && (
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold tracking-wider" style={{ color: labelTextColor }}>Phone Number</Label>
                        <Input placeholder="+1 (555) 000-0000" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                      </div>
                    )}

                    {showBillingAddress && (
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold tracking-wider" style={{ color: labelTextColor }}>Billing Address</Label>
                        <Input placeholder="Street Address" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                        <div className="grid grid-cols-3 gap-2">
                          <Input placeholder="City" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                          <Input placeholder="State" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                          <Input placeholder="ZIP" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                        </div>
                      </div>
                    )}

                    {collectShipping && (
                      <div className="space-y-2">
                        <Label className="text-xs uppercase font-bold tracking-wider" style={{ color: labelTextColor }}>Shipping Address</Label>
                        <Input placeholder="Street Address" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                        <div className="grid grid-cols-3 gap-2">
                          <Input placeholder="City" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                          <Input placeholder="State" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                          <Input placeholder="ZIP" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-xs uppercase font-bold tracking-wider" style={{ color: labelTextColor }}>Card Information</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-2.5 h-4 w-4" style={{ color: bodyTextColor }} />
                        <Input placeholder="Card number" className="pl-9" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="MM / YY" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                        <Input placeholder="CVC" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                      </div>
                    </div>

                    {showCoupons && (
                       <div className="space-y-2 pt-2">
                        <Label className="text-xs uppercase font-bold tracking-wider" style={{ color: labelTextColor }}>Discount Code</Label>
                        <div className="flex gap-2">
                          <Input placeholder="Promo Code" style={{ backgroundColor: inputBackgroundColor, borderColor: inputBorderColor, color: headingTextColor }} />
                          <Button variant="outline" style={{ borderColor: inputBorderColor, color: headingTextColor }}>Apply</Button>
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full h-12 text-base font-semibold mt-4 shadow-sm hover:opacity-90 transition-opacity border-0"
                      style={{ backgroundColor: buttonColor, color: buttonTextColor }}
                    >
                      {showLockIcon && <Lock className="h-4 w-4 mr-1" />}
                      {buttonText} $49.00
                    </Button>

                    {/* Trust Badges Section */}
                    <div className="space-y-3 mt-4">
                      {showSecureMessage && (
                        <div className="flex items-center justify-center gap-2 text-xs" style={{ color: bodyTextColor }}>
                          <Lock className="h-3 w-3" />
                          <span>Payments are secure and encrypted</span>
                        </div>
                      )}

                      {/* Badge Row */}
                      {(showPciCompliant || showSecureSsl || showMoneyBackGuarantee) && (
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                          {showPciCompliant && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" style={{ color: badgeColor }}>
                              <ShieldCheck className="h-3.5 w-3.5" />
                              <span>PCI Compliant</span>
                            </div>
                          )}
                          {showSecureSsl && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" style={{ color: badgeColor }}>
                              <Lock className="h-3.5 w-3.5" />
                              <span>SSL Encrypted</span>
                            </div>
                          )}
                          {showMoneyBackGuarantee && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium" style={{ color: badgeColor }}>
                              <BadgeCheck className="h-3.5 w-3.5" />
                              <span>Money-Back Guarantee</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Accepted Cards */}
                      {showAcceptedCards && (
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex items-center gap-2">
                            {/* Visa */}
                            <svg className="h-8 w-auto" viewBox="0 0 50 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="50" height="16" rx="2" fill="#1A1F71"/>
                              <path d="M19.5 4.5L17 11.5H15L13.5 6C13.4 5.6 13.3 5.4 13 5.2C12.4 4.9 11.5 4.6 10.7 4.4L10.8 4H14C14.5 4 14.9 4.3 15 4.9L15.8 9L17.8 4H19.5V4.5ZM24.5 11.5H22.9L23.9 4.5H25.5L24.5 11.5ZM32 4.5L30.3 11.5H28.6L27.3 6.3L26 11.5H24.3L26.5 4.5H28.1L29.3 9.5L30.5 4.5H32ZM37.5 9.2C37.5 10.7 36.2 11.7 34.3 11.7C33.4 11.7 32.5 11.5 32 11.2L32.3 9.8C32.9 10.1 33.6 10.3 34.4 10.3C35 10.3 35.5 10.1 35.5 9.6C35.5 9.2 35.2 9 34.4 8.7C33.1 8.2 32.5 7.5 32.5 6.6C32.5 5.2 33.7 4.2 35.5 4.2C36.3 4.2 37 4.4 37.4 4.6L37.1 5.9C36.7 5.7 36.1 5.5 35.4 5.5C34.8 5.5 34.4 5.8 34.4 6.2C34.4 6.5 34.7 6.7 35.5 7C36.9 7.5 37.5 8.2 37.5 9.2Z" fill="white"/>
                            </svg>
                            {/* Mastercard */}
                            <svg className="h-8 w-auto" viewBox="0 0 50 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="50" height="16" rx="2" fill="#000"/>
                              <circle cx="20" cy="8" r="5" fill="#EB001B"/>
                              <circle cx="30" cy="8" r="5" fill="#F79E1B"/>
                              <path d="M25 4.17C26.27 5.17 27.1 6.5 27.1 8C27.1 9.5 26.27 10.83 25 11.83C23.73 10.83 22.9 9.5 22.9 8C22.9 6.5 23.73 5.17 25 4.17Z" fill="#FF5F00"/>
                            </svg>
                            {/* Amex */}
                            <svg className="h-8 w-auto" viewBox="0 0 50 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="50" height="16" rx="2" fill="#006FCF"/>
                              <path d="M8 11L10.5 4H12.5L15 11H13L12.5 9.5H10.5L10 11H8ZM11 6L10.8 8H12.2L11.5 6H11ZM16 11V4H18.5L20 8L21.5 4H24V11H22V6.5L20.3 11H19.7L18 6.5V11H16ZM26 11V4H31V5.5H28V6.8H31V8.3H28V9.5H31V11H26ZM33 11L30.5 7.5L33 4H35.5L33 7.5L35.5 11H33ZM36 11V4H38.5L40 8L41.5 4H44V11H42V6.5L40.3 11H39.7L38 6.5V11H36Z" fill="white"/>
                            </svg>
                            {/* Discover */}
                            <svg className="h-8 w-auto" viewBox="0 0 50 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect width="50" height="16" rx="2" fill="#FF6000"/>
                              <ellipse cx="30" cy="8" rx="6" ry="5" fill="#FF6000"/>
                              <path d="M30 3C27.2 3 25 5.2 25 8C25 10.8 27.2 13 30 13C32.8 13 35 10.8 35 8C35 5.2 32.8 3 30 3Z" fill="#F9A533"/>
                              <path d="M7 11V4H9.5C11.5 4 13 5.3 13 7.5C13 9.7 11.5 11 9.5 11H7ZM9 9.5H9.5C10.6 9.5 11.3 8.7 11.3 7.5C11.3 6.3 10.6 5.5 9.5 5.5H9V9.5ZM14 11V4H16V11H14ZM17 9.5C17.5 9.8 18.2 10 19 10C19.8 10 20.2 9.7 20.2 9.3C20.2 8.8 19.7 8.6 18.8 8.3C17.5 7.8 17 7.2 17 6.3C17 5 18 4 19.8 4C20.6 4 21.3 4.2 21.8 4.4L21.5 5.8C21.1 5.6 20.5 5.4 19.8 5.4C19.2 5.4 18.8 5.7 18.8 6.1C18.8 6.5 19.2 6.7 20 7C21.4 7.5 22 8.1 22 9.1C22 10.5 20.9 11.5 19 11.5C18.1 11.5 17.3 11.3 16.8 11L17 9.5Z" fill="white"/>
                            </svg>
                          </div>
                        </div>
                      )}

                      {/* Powered by PigBank */}
                      {showPoweredByPigBank && (
                        <div className="flex items-center justify-center gap-1.5 pt-2 border-t" style={{ borderColor: inputBorderColor }}>
                          <span className="text-xs" style={{ color: bodyTextColor }}>Payment processed by</span>
                          <img src="/pig-bank-logo-light.png" alt="PigBank" className="h-4 object-contain" />
                        </div>
                      )}
                    </div>
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
