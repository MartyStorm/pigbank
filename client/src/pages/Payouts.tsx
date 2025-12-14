import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Loader2, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [showExtraColumns, setShowExtraColumns] = useState(false);

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
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Next Payout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {nextPayout ? formatDate(nextPayout.arrivalDate) : "—"}
              </div>
              <p className="text-lg mt-1 text-[#39870E] font-semibold">
                {nextPayout ? `Pending ${formatAmount(nextPayout.amount)}` : "No pending payouts"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Last Payout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#39870E]">
                {lastPayout ? formatAmount(lastPayout.amount) : "—"}
              </div>
              <p className="text-base mt-1 text-muted-foreground">
                {lastPayout ? `Paid on ${formatDate(lastPayout.date)}` : "No completed payouts"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-start">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowExtraColumns(!showExtraColumns)}
            className="gap-2"
            data-testid="button-toggle-columns"
          >
            <Settings2 className="h-4 w-4" />
            Customize Columns
          </Button>
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
                  <TableHeader className="bg-[#2b4e2d] dark:bg-[#262626] [&_tr]:hover:bg-[#2b4e2d] dark:[&_tr]:hover:bg-[#262626]">
                    <TableRow className="border-none hover:bg-[#2b4e2d] dark:hover:bg-[#262626] [&_th:first-child]:rounded-tl-lg [&_th:last-child]:rounded-tr-lg">
                      <TableHead className="text-white">Date</TableHead>
                      <TableHead className="text-white">Amount</TableHead>
                      <TableHead className="text-white">Status</TableHead>
                      {showExtraColumns && (
                        <>
                          <TableHead className="text-white">Destination</TableHead>
                          <TableHead className="text-white">Payout ID</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPayouts.map((p) => (
                      <TableRow key={p.id} className="hover:bg-muted/30" data-testid={`row-payout-${p.id}`}>
                        <TableCell className="text-muted-foreground">{formatDate(p.date)}</TableCell>
                        <TableCell className="font-medium">{formatAmount(p.amount)}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-md text-xs font-medium border",
                            p.status === "Completed" 
                              ? "bg-[#73cb43]/20 text-[#39870E] border-[#39870E] dark:bg-green-900/30 dark:text-green-400 dark:border-green-700"
                              : p.status === "Processing"
                              ? "bg-[#f0b100]/20 text-[#f0b100] border-[#f0b100] dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700"
                              : p.status === "Pending"
                              ? "bg-blue-100 text-blue-700 border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700"
                              : "bg-[#b91c1c]/20 text-[#b91c1c] border-[#b91c1c] dark:bg-red-900/30 dark:text-red-400 dark:border-red-700"
                          )}>
                            {p.status}
                          </span>
                        </TableCell>
                        {showExtraColumns && (
                          <>
                            <TableCell className="text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                {p.destination}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-xs font-medium">{p.payoutId}</TableCell>
                          </>
                        )}
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
                    <div className="text-sm text-muted-foreground mr-2">
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
