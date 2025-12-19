import { useState, useEffect, useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useStaffApi } from "@/hooks/useStaffApi";
import { useAuth } from "@/hooks/useAuth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Search, Download, Filter, Eye, RefreshCw, Share, CreditCard, ShieldAlert, Loader2, Calendar, ChevronDown, ChevronUp, Settings2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  customerName: string;
  customerEmail: string;
  amount: string;
  method: string;
  status: string;
  risk: string;
  avs: string;
}

export default function Transactions() {
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { getApiUrl, getQueryKey, isStaffViewingMerchant, isInitialized } = useStaffApi();
  const { isPigBankStaff } = useAuth();
  
  const [columns, setColumns] = useState({
    customer: true,
    date: true,
    amount: true,
    status: true,
    risk: true,
    transactionId: true,
  });

  const toggleColumn = (column: keyof typeof columns) => {
    setColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  const visibleColumnCount = Object.values(columns).filter(Boolean).length;
  
  // Search State
  const searchString = useSearch();
  const urlParams = new URLSearchParams(searchString);
  const initialSearch = urlParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [, setLocation] = useLocation();


  const transactionsApiUrl = getApiUrl("/api/transactions");

  // Fetch transactions from API
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: getQueryKey("/api/transactions", searchQuery),
    queryFn: async () => {
      const url = searchQuery 
        ? `${transactionsApiUrl}?search=${encodeURIComponent(searchQuery)}`
        : transactionsApiUrl;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
  });

  // Update search when URL changes
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const urlSearch = params.get("search") || "";
    setSearchQuery(urlSearch);
  }, [searchString]);

  // Format transaction for display
  const formatTransaction = (txn: Transaction) => ({
    ...txn,
    displayDate: format(new Date(txn.date), "MMM d, yyyy h:mm a"),
    displayAmount: `$${parseFloat(txn.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
  });

  const formattedTransactions = transactions.map(formatTransaction);

  // Handle search input
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      setLocation(`/transactions?search=${encodeURIComponent(value.trim())}`, { replace: true });
    } else {
      setLocation("/transactions", { replace: true });
    }
  };
  
  // Refund State
  const [refundAmount, setRefundAmount] = useState("");

  // Advanced Search State
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);

  // Reset refund amount when selected txn changes
  useEffect(() => {
    if (selectedTxn && refundAmount === "") {
      setRefundAmount(selectedTxn.amount);
    }
  }, [selectedTxn]);

  const handleEmailReceipt = () => {
    toast({
      title: "Receipt Sent",
      description: `Receipt for ${selectedTxn?.transactionId} has been emailed to ${selectedTxn?.customerEmail}`,
    });
  };

  const handleProcessRefund = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Refund Processed",
        description: `Transaction ${selectedTxn?.transactionId} has been refunded for $${refundAmount}.`,
      });
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "bg-[#73cb43]/20 text-[#39870E] border-[#39870E] dark:bg-green-900/30 dark:text-green-400 dark:border-green-700";
      case "Declined": return "bg-[#f0b100]/20 text-[#f0b100] border-[#f0b100] dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700";
      case "Pending": return "bg-gray-100 text-gray-600 border-gray-600 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600";
      case "Refunded": return "bg-blue-100 text-blue-700 border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700";
      case "Partially Refunded": return "bg-purple-100 text-purple-700 border-purple-700 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700";
      case "Chargeback": return "bg-[#b91c1c]/20 text-[#b91c1c] border-[#b91c1c] dark:bg-red-900/30 dark:text-red-400 dark:border-red-700";
      default: return "bg-blue-100 text-blue-700 border-blue-700";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-[#73cb43]/20 text-[#39870E] border-[#39870E] dark:bg-green-900/30 dark:text-green-400 dark:border-green-700";
      case "Medium": return "bg-[#f0b100]/20 text-[#f0b100] border-[#f0b100] dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700";
      case "High": return "bg-[#b91c1c]/20 text-[#b91c1c] border-[#b91c1c] dark:bg-red-900/30 dark:text-red-400 dark:border-red-700";
      default: return "bg-blue-100 text-blue-700 border-blue-700";
    }
  };

  return (
    <Layout title="Transactions">
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-transactions-title">
              Transactions
            </h1>
            <p className="text-gray-600 mt-1">
              View and manage all payment transactions
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg shadow-sm border border-border/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Transaction ID, name, or email..."
              className="pl-9 bg-background border-muted-foreground/20"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              data-testid="input-transactions-search"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <Button variant="outline" size="sm" className="gap-2 border-dashed hidden md:flex" data-testid="button-daterange-transactions">
              <Calendar className="h-4 w-4" />
              <span>Oct 24 - Nov 24</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>

            <Select defaultValue="all">
              <SelectTrigger className="w-[130px] bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="declined">Declined</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="partially_refunded">Partially Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Columns</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-48">
                <div className="space-y-3">
                  <p className="text-sm font-medium">Toggle Columns</p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="col-customer" checked={columns.customer} onCheckedChange={() => toggleColumn('customer')} />
                      <label htmlFor="col-customer" className="text-sm cursor-pointer">Customer</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="col-date" checked={columns.date} onCheckedChange={() => toggleColumn('date')} />
                      <label htmlFor="col-date" className="text-sm cursor-pointer">Date & Time</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="col-amount" checked={columns.amount} onCheckedChange={() => toggleColumn('amount')} />
                      <label htmlFor="col-amount" className="text-sm cursor-pointer">Amount</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="col-status" checked={columns.status} onCheckedChange={() => toggleColumn('status')} />
                      <label htmlFor="col-status" className="text-sm cursor-pointer">Status</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="col-risk" checked={columns.risk} onCheckedChange={() => toggleColumn('risk')} />
                      <label htmlFor="col-risk" className="text-sm cursor-pointer">Risk</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="col-transactionId" checked={columns.transactionId} onCheckedChange={() => toggleColumn('transactionId')} />
                      <label htmlFor="col-transactionId" className="text-sm cursor-pointer">Transaction ID</label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Advanced Search */}
        <Collapsible
          open={isAdvancedSearchOpen}
          onOpenChange={setIsAdvancedSearchOpen}
          className="bg-card rounded-lg border border-border/50 shadow-sm"
        >
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2 font-medium">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span>Advanced Search</span>
              </div>
              {isAdvancedSearchOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4 pt-0 space-y-6 border-t border-border/50 mt-2">
              
              {/* Amount Range */}
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Amount Range</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Minimum Amount</Label>
                    <Input placeholder="0.00" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Maximum Amount</Label>
                    <Input placeholder="0.00" type="number" />
                  </div>
                </div>
              </div>

              {/* Transaction Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Transaction Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Transaction ID</Label>
                    <Input placeholder="TXN-..." />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Transaction Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-9" placeholder="Select date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Transaction Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="auth">Authorization</SelectItem>
                        <SelectItem value="refund">Refund</SelectItem>
                        <SelectItem value="void">Void</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Transaction Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="declined">Declined</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Currency</Label>
                    <Input placeholder="USD" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Auth Code</Label>
                    <Input placeholder="Auth Code" />
                  </div>
                </div>
              </div>

              {/* Card Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Card Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Card Brand</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="amex">American Express</SelectItem>
                        <SelectItem value="discover">Discover</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Last 4 Digits</Label>
                    <Input placeholder="0000" maxLength={4} />
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Customer Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs">First Name</Label>
                    <Input placeholder="First Name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Last Name</Label>
                    <Input placeholder="Last Name" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Email</Label>
                    <Input placeholder="Email Address" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Phone</Label>
                    <Input placeholder="Phone Number" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="w-full md:w-auto">
                  Search Transactions
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Table */}
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-[#4b5563] dark:bg-[#262626] [&_tr]:hover:bg-[#4b5563] dark:[&_tr]:hover:bg-[#262626] [&_th]:text-white">
              <TableRow className="border-b-[#4b5563] dark:border-b-gray-700">
                {columns.customer && <TableHead className="text-white">Customer</TableHead>}
                {columns.date && <TableHead className="text-white">Date & Time</TableHead>}
                {columns.amount && <TableHead className="text-white">Amount</TableHead>}
                {columns.status && <TableHead className="text-white">Status</TableHead>}
                {columns.risk && <TableHead className="text-white">Risk</TableHead>}
                {columns.transactionId && <TableHead className="text-white">Transaction ID</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={visibleColumnCount} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Loader2 className="h-8 w-8 mb-2 animate-spin" />
                      <p className="text-sm">Loading transactions...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : formattedTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumnCount} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      {searchQuery ? (
                        <>
                          <Search className="h-8 w-8 mb-2 opacity-50" />
                          <p className="text-sm">No transactions found for "{searchQuery}"</p>
                          <Button 
                            variant="link" 
                            className="text-sm mt-1" 
                            onClick={() => handleSearchChange("")}
                            data-testid="button-clear-search"
                          >
                            Clear search
                          </Button>
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-12 w-12 mb-3 opacity-30" />
                          <p className="text-base font-medium text-foreground mb-1">No transactions yet</p>
                          <p className="text-sm text-muted-foreground">Transactions will appear here once you start processing payments.</p>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                formattedTransactions.map((txn) => (
                  <TableRow 
                    key={txn.id} 
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => setSelectedTxn(txn)}
                    data-testid={`row-transaction-${txn.transactionId}`}
                  >
                    {columns.customer && (
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{txn.customerName}</span>
                          <span className="text-xs text-muted-foreground">{txn.customerEmail}</span>
                        </div>
                      </TableCell>
                    )}
                    {columns.date && <TableCell className="text-muted-foreground text-sm">{txn.displayDate}</TableCell>}
                    {columns.amount && <TableCell className="font-medium">{txn.displayAmount}</TableCell>}
                    {columns.status && (
                      <TableCell>
                        <span className={cn("px-2.5 py-0.5 rounded-md text-xs font-medium border", getStatusColor(txn.status))}>
                          {txn.status}
                        </span>
                      </TableCell>
                    )}
                    {columns.risk && (
                      <TableCell>
                        <span className={cn("px-2.5 py-0.5 rounded-md text-xs font-medium border", getRiskColor(txn.risk))}>
                          {txn.risk}
                        </span>
                      </TableCell>
                    )}
                    {columns.transactionId && <TableCell className="font-mono text-xs font-medium">{txn.transactionId}</TableCell>}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detail Drawer */}
      <Sheet open={!!selectedTxn} onOpenChange={() => setSelectedTxn(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          {selectedTxn && (
            <div className="space-y-8 mt-6">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-xl font-mono">{selectedTxn.transactionId}</SheetTitle>
                  <span className={cn("px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border", getStatusColor(selectedTxn.status))}>
                    {selectedTxn.status}
                  </span>
                </div>
                <SheetDescription>
                  Processed on {format(new Date(selectedTxn.date), "MMM d, yyyy h:mm a")} via Templar Gateway
                </SheetDescription>
              </SheetHeader>

              {/* Summary Section */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Amount</p>
                  <p className="text-2xl font-bold text-foreground">${parseFloat(selectedTxn.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Method</p>
                  <p className="text-base font-medium text-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> {selectedTxn.method} •••• 4242
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Customer Details</h3>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedTxn.customerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedTxn.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">IP Address</p>
                    <p className="font-medium">192.168.1.42 (US)</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>

              {/* Risk Analysis */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Security & Risk</h3>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium">Fraud Risk Score</span>
                    <span className={cn("px-2.5 py-0.5 rounded-md text-xs font-medium border", getRiskColor(selectedTxn.risk))}>
                      {selectedTxn.risk}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">AVS Check</span>
                      <span className="text-emerald-600 font-medium">Matched</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">CVV Check</span>
                      <span className="text-emerald-600 font-medium">Matched</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Device Fingerprint</span>
                      <span className="font-mono text-xs">f4a2...9b12</span>
                    </div>
                  </div>
                </div>
              </div>

              <SheetFooter className="flex-col sm:flex-col sm:space-x-0 gap-3 pt-4 border-t border-border">
                <div className="space-y-2 w-full mb-2">
                   <Label htmlFor="refund-amount" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Refund Amount</Label>
                   <div className="relative">
                     <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                     <Input 
                       id="refund-amount"
                       value={refundAmount}
                       onChange={(e) => setRefundAmount(e.target.value)}
                       className="pl-7"
                       placeholder="0.00"
                     />
                   </div>
                </div>
                <Button className="w-full hover:bg-primary/10 hover:border-primary transition-all duration-200" variant="outline" onClick={handleEmailReceipt} data-testid="button-email-receipt">
                  <Share className="mr-2 h-4 w-4" /> Email Receipt
                </Button>
                <Button 
                  className="w-full hover:shadow-lg hover:opacity-90 transition-all duration-200 bg-[#dc2626] text-white hover:bg-[#b91c1c]" 
                  variant="default" 
                  onClick={handleProcessRefund}
                  disabled={isLoading}
                  data-testid="button-refund-transaction"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Refund Transaction
                </Button>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>

    </Layout>
  );
}
