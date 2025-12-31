import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Send, MoreHorizontal, FileText, Clock, CheckCircle, XCircle, AlertCircle, Settings2 } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useStaffApi } from "@/hooks/useStaffApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  subtotal: string;
  tax: string;
  discount: string;
  shipping: string;
  total: string;
  status: string;
  dueDate: string | null;
  createdAt: string;
}

const getStatusConfig = (status: string) => {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case "paid":
      return { 
        color: "bg-[#73cb43]/20 text-[#39870E] border-[#39870E] dark:bg-green-900/30 dark:text-green-400 dark:border-green-700", 
        icon: CheckCircle 
      };
    case "pending":
      return { 
        color: "bg-[#f0b100]/20 text-[#f0b100] border-[#f0b100] dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700", 
        icon: Clock 
      };
    case "overdue":
      return { 
        color: "bg-[#b91c1c]/20 text-[#b91c1c] border-[#b91c1c] dark:bg-red-900/30 dark:text-red-400 dark:border-red-700", 
        icon: AlertCircle 
      };
    case "draft":
      return { 
        color: "bg-gray-100 text-gray-600 border-gray-600 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600", 
        icon: FileText 
      };
    case "cancelled":
      return { 
        color: "bg-gray-100 text-gray-500 border-gray-500 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600", 
        icon: XCircle 
      };
    default:
      return { 
        color: "bg-gray-100 text-gray-600 border-gray-600 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600", 
        icon: FileText 
      };
  }
};

export default function InvoicesList() {
  const [_, setLocation] = useLocation();
  const { getApiUrl, getQueryKey } = useStaffApi();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [columns, setColumns] = useState({
    invoice: true,
    customer: true,
    amount: true,
    status: true,
    dueDate: true,
    created: true,
  });

  const toggleColumn = (key: keyof typeof columns) => {
    setColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const visibleColumnCount = Object.values(columns).filter(Boolean).length + 1;

  const invoicesApiUrl = getApiUrl("/api/invoices");
  const { data: invoices = [], isLoading } = useQuery<Invoice[]>({
    queryKey: getQueryKey("/api/invoices"),
    queryFn: async () => {
      const res = await fetch(invoicesApiUrl, { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Layout title="Invoices">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-invoices-title">
              Invoices
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and track all your sent invoices
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Customize Columns
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48" align="end">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Show Columns</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="col-invoice" checked={columns.invoice} onCheckedChange={() => toggleColumn('invoice')} />
                      <label htmlFor="col-invoice" className="text-sm cursor-pointer">Invoice</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="col-customer" checked={columns.customer} onCheckedChange={() => toggleColumn('customer')} />
                      <label htmlFor="col-customer" className="text-sm cursor-pointer">Customer</label>
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
                      <Checkbox id="col-dueDate" checked={columns.dueDate} onCheckedChange={() => toggleColumn('dueDate')} />
                      <label htmlFor="col-dueDate" className="text-sm cursor-pointer">Due Date</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="col-created" checked={columns.created} onCheckedChange={() => toggleColumn('created')} />
                      <label htmlFor="col-created" className="text-sm cursor-pointer">Created</label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button onClick={() => setLocation("/invoices/create")} className="bg-[#73cb43] hover:bg-[#65b538]">
              <Plus className="mr-2 h-4 w-4" /> Create Invoice
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-[#74747d] dark:bg-[#262626]">
              <TableRow className="border-b-[#74747d] dark:border-b-gray-700 hover:bg-[#74747d] dark:hover:bg-[#262626]">
                {columns.invoice && <TableHead className="text-white text-center border-r border-white/30">Invoice</TableHead>}
                {columns.customer && <TableHead className="text-white text-center border-r border-white/30">Customer</TableHead>}
                {columns.amount && <TableHead className="text-white text-center border-r border-white/30">Amount</TableHead>}
                {columns.status && <TableHead className="text-white text-center border-r border-white/30">Status</TableHead>}
                {columns.dueDate && <TableHead className="text-white text-center border-r border-white/30">Due Date</TableHead>}
                {columns.created && <TableHead className="text-white text-center border-r border-white/30">Created</TableHead>}
                <TableHead className="text-white text-center w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={visibleColumnCount} className="text-center py-8 text-muted-foreground">
                    Loading invoices...
                  </TableCell>
                </TableRow>
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleColumnCount} className="text-center py-8 text-muted-foreground">
                    No invoices yet. Create your first invoice to get started.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => {
                  const statusConfig = getStatusConfig(invoice.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <TableRow 
                      key={invoice.id}
                      className="cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => setSelectedInvoice(invoice)}
                      data-testid={`row-invoice-${invoice.id}`}
                    >
                      {columns.invoice && (
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-mono font-medium text-sm">{invoice.invoiceNumber}</span>
                          </div>
                        </TableCell>
                      )}
                      {columns.customer && (
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{invoice.customerName}</span>
                            <span className="text-xs text-muted-foreground">{invoice.customerEmail}</span>
                          </div>
                        </TableCell>
                      )}
                      {columns.amount && <TableCell className="font-semibold">{formatCurrency(invoice.total)}</TableCell>}
                      {columns.status && (
                        <TableCell>
                          <span className={cn("px-2.5 py-0.5 rounded-md text-xs font-medium border inline-flex items-center gap-1", statusConfig.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {invoice.status}
                          </span>
                        </TableCell>
                      )}
                      {columns.dueDate && <TableCell className="text-muted-foreground text-sm">{formatDate(invoice.dueDate)}</TableCell>}
                      {columns.created && <TableCell className="text-muted-foreground text-sm">{formatDate(invoice.createdAt)}</TableCell>}
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedInvoice(invoice)}>
                              <Eye className="mr-2 h-4 w-4" /> View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="mr-2 h-4 w-4" /> Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" /> Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {invoices.length} invoices</span>
        </div>
      </div>

      <Sheet open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          {selectedInvoice && (
            <div className="space-y-4 mt-4">
              <SheetHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <SheetTitle className="text-lg font-mono">{selectedInvoice.invoiceNumber}</SheetTitle>
                  <span className={cn("px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border", getStatusConfig(selectedInvoice.status).color)}>
                    {selectedInvoice.status}
                  </span>
                </div>
                <SheetDescription className="text-xs">
                  Created {formatDate(selectedInvoice.createdAt)}
                </SheetDescription>
              </SheetHeader>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Amount</p>
                  <p className="text-xl font-bold text-foreground">{formatCurrency(selectedInvoice.total)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Due Date</p>
                  <p className="text-sm font-medium text-foreground mt-1">{formatDate(selectedInvoice.dueDate)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Customer</h3>
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium text-sm">{selectedInvoice.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-sm truncate">{selectedInvoice.customerEmail}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Breakdown</h3>
                <div className="p-3 rounded-lg border border-border bg-card space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  {parseFloat(selectedInvoice.tax) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">{formatCurrency(selectedInvoice.tax)}</span>
                    </div>
                  )}
                  {parseFloat(selectedInvoice.discount) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="font-medium text-[#39870E]">-{formatCurrency(selectedInvoice.discount)}</span>
                    </div>
                  )}
                  {parseFloat(selectedInvoice.shipping) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">{formatCurrency(selectedInvoice.shipping)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between text-sm font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(selectedInvoice.total)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex gap-2">
                <Button variant="outline" className="flex-1 h-9">
                  <Send className="mr-1.5 h-3.5 w-3.5" /> Send Reminder
                </Button>
                <Button variant="outline" className="flex-1 h-9">
                  <FileText className="mr-1.5 h-3.5 w-3.5" /> Download PDF
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </Layout>
  );
}
