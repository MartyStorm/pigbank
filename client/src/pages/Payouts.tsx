import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";

interface Payout {
  id: string;
  userId: string;
  payoutId: string;
  date: string;
  amount: string;
  status: string;
  destination: string;
  type: string;
  arrivalDate: string;
}

export default function Payouts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [columns, setColumns] = useState({
    date: true,
    amount: true,
    status: true,
    destination: false,
    payoutId: false,
  });

  const toggleColumn = (column: keyof typeof columns) => {
    setColumns(prev => ({ ...prev, [column]: !prev[column] }));
  };

  const { data: payouts = [], isLoading } = useQuery<Payout[]>({
    queryKey: ["/api/payouts"],
  });

  const totalPages = Math.max(1, Math.ceil(payouts.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayouts = payouts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const completedPayouts = payouts.filter(p => p.status === "Completed");
  const lastPayout = completedPayouts.length > 0 ? completedPayouts[0] : null;

  const pendingPayouts = payouts.filter(p => p.status === "Pending");
  const nextPayout = pendingPayouts.length > 0 ? pendingPayouts[0] : null;
  
  const processingPayouts = payouts.filter(p => p.status === "Processing");
  const processingTotal = processingPayouts.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return (
    <Layout title="Payouts">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-payouts-title">
              Payouts
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your bank payouts
            </p>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border border-blue-400 shadow-sm bg-blue-50 dark:bg-blue-950/30 dark:border-blue-700 rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">Next Payout</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {processingPayouts.length > 0 ? formatDate(processingPayouts[0].arrivalDate) : (nextPayout ? formatDate(nextPayout.arrivalDate) : "—")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {processingTotal > 0 ? `$${processingTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    {processingTotal > 0 ? "Processing" : "No pending payouts"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[#39870E] shadow-sm bg-[#73cb43]/10 dark:bg-green-950/30 dark:border-green-700 rounded-xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#73cb43]/20 dark:bg-green-900/50 flex items-center justify-center">
                    <span className="text-lg font-bold text-[#39870E] dark:text-green-400">$</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">Last Payout</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {lastPayout ? `Paid on ${formatDate(lastPayout.date)}` : "No completed payouts"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {lastPayout ? formatAmount(lastPayout.amount) : "—"}
                  </p>
                  <p className="text-sm text-[#39870E] dark:text-green-400 font-medium">
                    Completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-start">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                data-testid="button-toggle-columns"
              >
                <Settings2 className="h-4 w-4" />
                Customize Columns
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="start">
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground mb-2">Show columns</p>
                <div className="flex items-center space-x-2">
                  <Checkbox id="col-date" checked={columns.date} onCheckedChange={() => toggleColumn('date')} />
                  <label htmlFor="col-date" className="text-sm cursor-pointer">Date</label>
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
                  <Checkbox id="col-destination" checked={columns.destination} onCheckedChange={() => toggleColumn('destination')} />
                  <label htmlFor="col-destination" className="text-sm cursor-pointer">Destination</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="col-payoutId" checked={columns.payoutId} onCheckedChange={() => toggleColumn('payoutId')} />
                  <label htmlFor="col-payoutId" className="text-sm cursor-pointer">Payout ID</label>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : payouts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p className="text-lg font-medium">No payouts yet</p>
                <p className="text-sm mt-1">Payouts will appear here once they are processed</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader className="bg-[#386a1d] dark:bg-[#262626] [&_tr]:hover:bg-[#386a1d] dark:[&_tr]:hover:bg-[#262626]">
                    <TableRow className="border-none hover:bg-[#386a1d] dark:hover:bg-[#262626] [&_th:first-child]:rounded-tl-lg [&_th:last-child]:rounded-tr-lg">
                      {columns.date && <TableHead className="text-white">Date</TableHead>}
                      {columns.amount && <TableHead className="text-white">Amount</TableHead>}
                      {columns.status && <TableHead className="text-white">Status</TableHead>}
                      {columns.destination && <TableHead className="text-white">Destination</TableHead>}
                      {columns.payoutId && <TableHead className="text-white">Payout ID</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPayouts.map((p) => (
                      <TableRow key={p.id} className="hover:bg-muted/30" data-testid={`row-payout-${p.id}`}>
                        {columns.date && <TableCell className="text-muted-foreground">{formatDate(p.date)}</TableCell>}
                        {columns.amount && <TableCell className="font-medium">{formatAmount(p.amount)}</TableCell>}
                        {columns.status && (
                          <TableCell>
                            <span className={cn(
                              "px-2.5 py-0.5 rounded-md text-xs font-medium border inline-block w-[90px] text-center",
                              p.status === "Completed" 
                                ? "bg-[#73cb43]/20 text-[#39870E] border-[#39870E] dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                                : p.status === "Processing"
                                ? "bg-blue-100 text-blue-700 border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700"
                                : p.status === "Pending"
                                ? "bg-[#f0b100]/20 text-[#f0b100] border-[#f0b100] dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700"
                                : "bg-[#b91c1c]/20 text-[#b91c1c] border-[#b91c1c] dark:bg-red-900/30 dark:text-red-400 dark:border-red-700"
                            )}>
                              {p.status}
                            </span>
                          </TableCell>
                        )}
                        {columns.destination && (
                          <TableCell className="text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                              {p.destination}
                            </div>
                          </TableCell>
                        )}
                        {columns.payoutId && <TableCell className="font-mono text-xs font-medium">{p.payoutId}</TableCell>}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex items-center justify-between px-4 py-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Rows per page</span>
                    <Select 
                      value={itemsPerPage.toString()} 
                      onValueChange={(value) => {
                        setItemsPerPage(Number(value));
                        setCurrentPage(1);
                      }}
                    >
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={itemsPerPage} />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {[5, 10, 20, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground mr-2 whitespace-nowrap">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
