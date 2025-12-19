import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, Send, Save, Pencil, Download, HelpCircle, Upload, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

interface InvoiceItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  rate: number;
  tax: number;
}

export default function CreateInvoice() {
  const [date, setDate] = useState<Date>();
  const [paymentTerms, setPaymentTerms] = useState("");
  
  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  
  // Shipping Address State
  const [shippingName, setShippingName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingZip, setShippingZip] = useState("");
  const [shippingCountry, setShippingCountry] = useState("");
  
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [invoiceNumber, setInvoiceNumber] = useState("INV-0001");
  const [note, setNote] = useState("");
  const [terms, setTerms] = useState("");
  
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", sku: "", name: "", quantity: 1, rate: 0, tax: 0 }
  ]);

  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [discountType, setDiscountType] = useState("amount");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setLogoError('Please upload an image file (PNG, JPG, or SVG)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('Logo must be under 2MB');
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Warn if dimensions are not optimal
        if (img.width < 200 || img.height < 60) {
          setLogoError(`Image is ${img.width}x${img.height}px. For best results, use at least 200x60px.`);
        } else if (img.width > 400 || img.height > 120) {
          setLogoError(`Image is ${img.width}x${img.height}px. Large images will be scaled down.`);
        } else {
          setLogoError(null);
        }
        setLogoUrl(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoUrl(null);
    setLogoError(null);
  };

  const addItem = () => {
    setItems([...items, { 
      id: Math.random().toString(36).substr(2, 9), 
      sku: "", 
      name: "", 
      quantity: 1, 
      rate: 0, 
      tax: 0 
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = discountType === "percentage" ? (subtotal * discount / 100) : discount;
    return subtotal - discountAmount + shipping;
  };

  return (
    <Layout title="Create Invoice">
      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-create-invoice-title">
              Create Invoice
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and send professional invoices to your customers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Addresses */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">Your Business Information</h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                
                {/* Logo Upload Section */}
                <div className="mb-4 pb-4 border-b">
                  <Label className="text-sm font-medium mb-2 block">Company Logo</Label>
                  {logoUrl ? (
                    <div className="relative inline-block">
                      <img 
                        src={logoUrl} 
                        alt="Company logo" 
                        className="max-h-16 max-w-[200px] object-contain border rounded p-1"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={removeLogo}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:border-muted-foreground/50 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground font-medium">Upload Logo</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </label>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended size: <span className="font-semibold">200 x 60 pixels</span> (PNG or JPG, max 2MB)
                  </p>
                  {logoError && (
                    <p className="text-xs text-amber-600 mt-1">{logoError}</p>
                  )}
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">Acme Corp Inc.</p>
                  <p>123 Business Rd</p>
                  <p>San Francisco, CA 94107</p>
                  <p>billing@acmecorp.com</p>
                </div>
              </CardContent>
            </Card>

            {/* Bill To Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-lg">Bill To Information</h3>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Pencil className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Customer Name</Label>
                    <Input 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Select or enter customer" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input 
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="customer@example.com" 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Billing Address</Label>
                    <Input 
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      placeholder="Street Address" 
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="same-address" 
                      checked={sameAsBilling}
                      onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
                    />
                    <Label htmlFor="same-address" className="font-normal cursor-pointer">Ship to same as billing address</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {!sameAsBilling && (
              <Card className="animate-in fade-in slide-in-from-top-4">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold text-lg">Shipping Information</h3>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Recipient Name</Label>
                      <Input 
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        placeholder="Recipient Name" 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Address</Label>
                      <Input 
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Street Address" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input 
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        placeholder="City" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State / Province</Label>
                      <Input 
                        value={shippingState}
                        onChange={(e) => setShippingState(e.target.value)}
                        placeholder="State" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Zip / Postal Code</Label>
                      <Input 
                        value={shippingZip}
                        onChange={(e) => setShippingZip(e.target.value)}
                        placeholder="Zip Code" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input 
                        value={shippingCountry}
                        onChange={(e) => setShippingCountry(e.target.value)}
                        placeholder="Country" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Invoice Details */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-semibold text-lg mb-4">Invoice Information</h3>
                
                <div className="space-y-2">
                  <Label>Invoice No:</Label>
                  <Input 
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="font-mono" 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Invoice Date:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal border-input shadow-sm h-9 px-3",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Payment Terms</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter terms like "Net 30" or "Due on Receipt"</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Input 
                    value={paymentTerms} 
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    placeholder="e.g. Net 30"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>


        {/* Items Table */}
        <Card>
          <CardContent className="p-0">
            <div className="p-4 bg-muted/40 border-b font-medium">
              Goods / Services
            </div>
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">SKU</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="w-[150px]">Rate</TableHead>
                    <TableHead className="w-[100px]">Tax (%)</TableHead>
                    <TableHead className="w-[150px] text-right">Total Amount</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input 
                          value={item.sku} 
                          onChange={(e) => updateItem(item.id, 'sku', e.target.value)}
                          placeholder="SKU" 
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          value={item.name} 
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          placeholder="Item Name" 
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value))}
                          min={1} 
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={item.rate} 
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value))}
                          min={0} 
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={item.tax} 
                          onChange={(e) => updateItem(item.id, 'tax', parseFloat(e.target.value))}
                          min={0} 
                        />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${(item.quantity * item.rate).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-foreground">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 flex justify-end">
                <Button onClick={addItem} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="mr-2 h-4 w-4" /> Add Item Row
                </Button>
              </div>

              {/* Totals Section */}
              <div className="mt-8 flex flex-col items-end space-y-2">
                <div className="w-full md:w-1/3 space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="font-medium">Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24">Discount</span>
                    <Input 
                      type="number" 
                      value={discount} 
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full" 
                    />
                    <Select value={discountType} onValueChange={setDiscountType}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amount">$</SelectItem>
                        <SelectItem value="percentage">%</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="w-24 text-right text-muted-foreground">
                      -${(discountType === "percentage" ? (calculateSubtotal() * discount / 100) : discount).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24">Shipping</span>
                    <Input 
                      type="number" 
                      value={shipping} 
                      onChange={(e) => setShipping(parseFloat(e.target.value) || 0)}
                      className="w-full" 
                    />
                    <span className="w-24 text-right text-muted-foreground">
                      ${shipping.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-4 border-t border-b bg-muted/10 px-2">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-border shadow-sm">
            <CardContent className="p-6 space-y-2">
              <Label>Note to Recipient</Label>
              <Textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="For Example, 'Thank you for your business'" 
                className="h-32" 
              />
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-6 space-y-2">
              <Label>Terms and Conditions</Label>
              <Textarea 
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Include your return or cancellation policy" 
                className="h-32" 
              />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" size="lg">
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button variant="outline" size="lg">
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Send className="mr-2 h-4 w-4" /> Send Invoice
          </Button>
        </div>

        {/* Live Preview */}
        <div className="pt-12 border-t mt-12">
          <h2 className="text-2xl font-bold mb-6">Live Preview</h2>
          <Card className="max-w-4xl mx-auto bg-white text-gray-900 shadow-lg border-none">
            <CardContent className="p-12 space-y-8">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                  <p className="text-lg font-medium"># {invoiceNumber}</p>
                </div>
                <div className="text-right">
                  {logoUrl && (
                    <img 
                      src={logoUrl} 
                      alt="Company logo" 
                      className="max-h-12 max-w-[160px] object-contain ml-auto mb-2"
                    />
                  )}
                  <h3 className="font-bold text-xl mb-1">Acme Corp Inc.</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>123 Business Rd</p>
                    <p>San Francisco, CA 94107</p>
                    <p>billing@acmecorp.com</p>
                  </div>
                </div>
              </div>

              {/* Bill To & Dates */}
              <div className="grid grid-cols-2 gap-8 mt-8">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h4>
                  <div className="font-medium">
                    <p className="text-lg">{customerName || "Customer Name"}</p>
                    <p className="text-gray-500">{customerEmail || "email@example.com"}</p>
                    <p className="text-gray-500 mt-1">Billing: {billingAddress || "Billing Address"}</p>
                    {!sameAsBilling && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider mb-1">Shipping To:</p>
                        <p className="text-gray-900">{shippingName}</p>
                        <p className="text-gray-500">{shippingAddress}</p>
                        <p className="text-gray-500">{[shippingCity, shippingState, shippingZip].filter(Boolean).join(", ")}</p>
                        <p className="text-gray-500">{shippingCountry}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-right">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Date</p>
                    <p className="font-medium">{date ? format(date, "MMM dd, yyyy") : "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Payment Terms</p>
                    <p className="font-medium">
                      {paymentTerms || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mt-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="text-left py-3 font-semibold">Item Description</th>
                      <th className="text-center py-3 font-semibold w-24">Qty</th>
                      <th className="text-right py-3 font-semibold w-32">Rate</th>
                      <th className="text-right py-3 font-semibold w-32">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-4">
                          <p className="font-medium">{item.name || "Item Name"}</p>
                          <p className="text-sm text-gray-500">{item.sku}</p>
                        </td>
                        <td className="text-center py-4">{item.quantity}</td>
                        <td className="text-right py-4">${item.rate.toFixed(2)}</td>
                        <td className="text-right py-4 font-medium">${(item.quantity * item.rate).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mt-6">
                <div className="w-1/2 md:w-1/3 space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Discount</span>
                    <span className="font-medium text-gray-500">-${(discountType === "percentage" ? (calculateSubtotal() * discount / 100) : discount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-t-2 border-gray-100">
                    <span className="text-xl font-bold">Total</span>
                    <span className="text-xl font-bold text-gray-900">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes & Terms */}
              {(note || terms) && (
                <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-100">
                  {note && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Notes</h4>
                      <p className="text-sm opacity-80">{note}</p>
                    </div>
                  )}
                  {terms && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Terms & Conditions</h4>
                      <p className="text-sm opacity-80">{terms}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </Layout>
  );
}
