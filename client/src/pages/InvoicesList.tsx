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
import { Badge } from "@/components/ui/badge";

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
  switch (status) {
    case "Paid":
      return { 
        color: "bg-[#73cb43]/20 text-[#4a9c22] border-[#73cb43]/30", 
        icon: CheckCircle 
      };
    case "Pending":
      return { 
        color: "bg-[#f0b100]/20 text-[#d49900] border-[#f0b100]/30", 
        icon: Clock 
      };
    case "Overdue":
      return { 
        color: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800", 
        icon: AlertCircle 
      };
    case "Draft":
      return { 
        color: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700", 
        icon: FileText 
      };
    case "Cancelled":
      return { 
        color: "bg-gray-100 text-gray-500 border-gray-200", 
        icon: XCircle 
      };
    default:
      return { 
        color: "bg-gray-100 text-gray-600 border-gray-200", 
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
            <p className="text-gray-600 mt-1">
              Manage and track all your sent invoices
            </p>
          </div>
          <Button onClick={() => setLocation("/invoices/create")} className="bg-[#73cb43] hover:bg-[#65b538]">
            <Plus className="mr-2 h-4 w-4" /> Create Invoice
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-[#636363] dark:bg-[#262626]">
              <TableRow className="border-b-[#636363] dark:border-b-gray-700 hover:bg-[#636363] dark:hover:bg-[#262626]">
                <TableHead className="text-white w-[50px]"></TableHead>
                <TableHead className="text-white">Invoice</TableHead>
                <TableHead className="text-white">Customer</TableHead>
                <TableHead className="text-white">Amount</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Due Date</TableHead>
                <TableHead className="text-white">Created</TableHead>
                <TableHead className="text-white w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Loading invoices...
                  </TableCell>
                </TableRow>
              ) : invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-[#73cb43]">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
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
                        <Badge variant="outline" className={cn("gap-1 font-medium", statusConfig.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {invoice.status}
                        </Badge>
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
