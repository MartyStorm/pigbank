import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Send, MoreHorizontal, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
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
          <Button onClick={() => setLocation("/invoices/create")} className="bg-[#73cb43] hover:bg-[#65b538]">
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-[#74747d] dark:bg-[#262626]">
              <TableRow className="border-b-[#74747d] dark:border-b-gray-700 hover:bg-[#74747d] dark:hover:bg-[#262626]">
                <TableHead className="text-white text-center border-r border-white/30">Invoice</TableHead>
                <TableHead className="text-white text-center border-r border-white/30">Customer</TableHead>
                <TableHead className="text-white text-center border-r border-white/30">Amount</TableHead>
                <TableHead className="text-white text-center border-r border-white/30">Status</TableHead>
                <TableHead className="text-white text-center border-r border-white/30">Due Date</TableHead>
                <TableHead className="text-white text-center border-r border-white/30">Created</TableHead>
                <TableHead className="text-white text-center w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Loading invoices...
                  </TableCell>
                </TableRow>
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
                      data-testid={`row-invoice-${invoice.id}`}
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono font-medium text-sm">{invoice.invoiceNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{invoice.customerName}</span>
                          <span className="text-xs text-muted-foreground">{invoice.customerEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>
                        <span className={cn("px-2.5 py-0.5 rounded-md text-xs font-medium border inline-flex items-center gap-1", statusConfig.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {invoice.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(invoice.createdAt)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
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
    </Layout>
  );
}
