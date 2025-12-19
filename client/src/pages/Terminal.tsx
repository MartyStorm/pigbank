import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, DollarSign, User, Mail, MapPin, Lock, Loader2, CheckCircle2 } from "lucide-react";

export default function Terminal() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  
  const handleProcess = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Transaction Approved",
        description: `Successfully processed payment of $${amount || "0.00"}`,
      });
      setAmount("");
    }, 2000);
  };

  return (
    <Layout title="Virtual Terminal">
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-terminal-title">
              Virtual Terminal
            </h1>
            <p className="text-muted-foreground mt-1">
              Manually process card payments without physical hardware
            </p>
          </div>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="py-4">
            <CardTitle>New Transaction</CardTitle>
            <CardDescription>Enter payment details to process a charge manually.</CardDescription>
          </CardHeader>
          <CardContent className="py-0 pb-4">
            <form id="payment-form" onSubmit={handleProcess} className="grid grid-cols-12 gap-6">
              
              {/* Left Column: Amount & Payment Method */}
              <div className="col-span-12 lg:col-span-5 space-y-6 border-r border-border pr-6">
                {/* Amount & Type */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="amount" 
                      placeholder="0.00" 
                      className="pl-9 text-lg font-semibold"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium uppercase text-muted-foreground">Payment Details</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="cardNumber" placeholder="0000 0000 0000 0000" className="pl-9" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <div className="relative">
                          <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input id="cvc" placeholder="123" className="pl-9" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer & Billing */}
              <div className="col-span-12 lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Details */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium uppercase text-muted-foreground">Customer Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="customer-name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="customer-name" placeholder="John Doe" className="pl-9" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-email">Email Address (Optional)</Label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="customer-email" type="email" placeholder="john@example.com" className="pl-9" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customer-phone">Phone (Optional)</Label>
                      <Input id="customer-phone" placeholder="+1 (555) 000-0000" />
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium uppercase text-muted-foreground">Billing Address</h3>
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input id="address" placeholder="123 Main St" className="pl-9" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="New York" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input id="zip" placeholder="10001" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Select defaultValue="us">
                        <SelectTrigger id="country">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Send Receipt</Label>
                      <p className="text-xs text-muted-foreground">Email a copy of the receipt to the customer</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

            </form>
          </CardContent>
          <CardFooter className="bg-[#2f8a2b] border-t border-border px-6 py-4 flex justify-end rounded-b-xl">
            <Button 
              type="submit" 
              form="payment-form" 
              className="w-full md:w-auto bg-white hover:bg-gray-100 text-[#2f8a2b] font-semibold" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Charge {amount ? `$${amount}` : "Card"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}
