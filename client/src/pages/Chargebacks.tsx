import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search,
  RefreshCw,
  DollarSign,
  Bell,
  Scale,
  MoreHorizontal
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type ChargebackStatus = "alert" | "in_review" | "won" | "lost" | "refunded";

interface ChargebackCase {
  id: string;
  transactionId: string;
  customer: string;
  email: string;
  amount: number;
  reason: string;
  status: ChargebackStatus;
  dateReceived: string;
  deadline: string | null;
  actionRequired: boolean;
}

const mockChargebacks: ChargebackCase[] = [
  {
    id: "CB-001",
    transactionId: "TXN-8847291",
    customer: "John Smith",
    email: "john.smith@email.com",
    amount: 149.99,
    reason: "Product not received",
    status: "alert",
    dateReceived: "2024-12-09",
    deadline: "2024-12-15",
    actionRequired: true
  },
  {
    id: "CB-002",
    transactionId: "TXN-8823451",
    customer: "Sarah Johnson",
    email: "sarah.j@email.com",
    amount: 89.00,
    reason: "Unauthorized transaction",
    status: "alert",
    dateReceived: "2024-12-08",
    deadline: "2024-12-18",
    actionRequired: true
  },
  {
    id: "CB-003",
    transactionId: "TXN-8801234",
    customer: "Mike Davis",
    email: "mike.d@email.com",
    amount: 299.99,
    reason: "Product not as described",
    status: "in_review",
    dateReceived: "2024-12-05",
    deadline: "2024-12-28",
    actionRequired: false
  },
  {
    id: "CB-004",
    transactionId: "TXN-8798765",
    customer: "Emma Wilson",
    email: "emma.w@email.com",
    amount: 59.99,
    reason: "Duplicate charge",
    status: "in_review",
    dateReceived: "2024-12-01",
    deadline: "2025-01-05",
    actionRequired: false
  },
  {
    id: "CB-005",
    transactionId: "TXN-8756432",
    customer: "Robert Brown",
    email: "r.brown@email.com",
    amount: 199.00,
    reason: "Service not provided",
    status: "won",
    dateReceived: "2024-11-20",
    deadline: null,
    actionRequired: false
  },
  {
    id: "CB-006",
    transactionId: "TXN-8734521",
    customer: "Lisa Anderson",
    email: "lisa.a@email.com",
    amount: 75.00,
    reason: "Credit not processed",
    status: "refunded",
    dateReceived: "2024-12-07",
    deadline: null,
    actionRequired: false
  },
  {
    id: "CB-007",
    transactionId: "TXN-8712398",
    customer: "James Taylor",
    email: "j.taylor@email.com",
    amount: 425.00,
    reason: "Fraud - card stolen",
    status: "lost",
    dateReceived: "2024-11-15",
    deadline: null,
    actionRequired: false
  }
];

const statusConfig: Record<ChargebackStatus, { label: string; color: string; icon: any }> = {
  alert: { label: "Alert", color: "bg-[#f0b100]/20 text-[#f0b100] border border-[#f0b100] dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700", icon: Bell },
  in_review: { label: "In Review", color: "bg-purple-100 text-purple-700 border border-purple-700 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700", icon: Clock },
  won: { label: "Won", color: "bg-[#73cb43]/20 text-[#39870E] border border-[#39870E] dark:bg-green-900/30 dark:text-green-400 dark:border-green-700", icon: CheckCircle2 },
  lost: { label: "Lost", color: "bg-[#b91c1c]/20 text-[#b91c1c] border border-[#b91c1c] dark:bg-red-900/30 dark:text-red-400 dark:border-red-700", icon: XCircle },
  refunded: { label: "Refunded", color: "bg-blue-100 text-blue-700 border border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700", icon: RefreshCw }
};

export default function Chargebacks() {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChargeback, setSelectedChargeback] = useState<ChargebackCase | null>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isDemoActive = user?.demoActive ?? false;

  const handleAction = (cb: ChargebackCase) => {
    setSelectedChargeback(cb);
    setIsActionDialogOpen(true);
  };

  const handleDispute = () => {
    if (selectedChargeback) {
      toast({
        title: "Dispute Filed",
        description: `Dispute has been filed for ${selectedChargeback.id}. You will be notified of updates.`,
      });
      setIsActionDialogOpen(false);
      setSelectedChargeback(null);
    }
  };

  const handleRefund = () => {
    if (selectedChargeback) {
      toast({
        title: "Refund Issued",
        description: `Refund of $${selectedChargeback.amount.toFixed(2)} has been issued for ${selectedChargeback.id}.`,
      });
      setIsActionDialogOpen(false);
      setSelectedChargeback(null);
    }
  };

  const chargebacksData = isDemoActive ? mockChargebacks : [];
  
  const filteredChargebacks = chargebacksData.filter(cb => {
    const matchesFilter = filter === "all" || cb.status === filter;
    const matchesSearch = searchQuery === "" || 
      cb.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cb.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cb.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate stats
  const alertCount = chargebacksData.filter(cb => cb.status === "alert").length;
  const activeCount = chargebacksData.filter(cb => cb.status === "in_review").length;
  const totalAmount = chargebacksData.reduce((sum, cb) => sum + cb.amount, 0);

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <Layout title="Chargebacks">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-chargebacks-title">
              Chargebacks
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage alerts, disputes, and resolutions in one place
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Bell className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Alerts</p>
                  <p className="text-2xl font-bold">{alertCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Scale className="h-5 w-5 text-purple-700 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Disputes</p>
                  <p className="text-2xl font-bold">{activeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <DollarSign className="h-5 w-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total at Risk</p>
                  <p className="text-2xl font-bold">${totalAmount.toFixed(0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer, transaction ID, or case ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cases</SelectItem>
                  <SelectItem value="alert">Alerts</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Chargebacks Table */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-[#2b4e2d] dark:bg-[#262626] [&_tr]:hover:bg-[#2b4e2d] dark:[&_tr]:hover:bg-[#262626] [&_th]:text-white">
                <TableRow className="border-b-[#1f3b20] dark:border-b-gray-700">
                  <TableHead className="text-white">Case ID</TableHead>
                  <TableHead className="text-white">Customer</TableHead>
                  <TableHead className="text-white">Amount</TableHead>
                  <TableHead className="text-white">Reason</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Deadline</TableHead>
                  <TableHead className="text-right text-white">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChargebacks.map((cb) => {
                  const StatusIcon = statusConfig[cb.status].icon;
                  const daysRemaining = getDaysRemaining(cb.deadline);
                  
                  return (
                    <TableRow key={cb.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{cb.id}</p>
                          <p className="text-xs text-muted-foreground">{cb.transactionId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{cb.customer}</p>
                          <p className="text-xs text-muted-foreground">{cb.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">${cb.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <p className="text-sm max-w-[200px] truncate">{cb.reason}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${statusConfig[cb.status].color} gap-1`}>
                          {statusConfig[cb.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {cb.deadline ? (
                          <div className={`text-sm font-medium ${daysRemaining !== null && daysRemaining < 7 ? 'text-red-600' : ''}`}>
                            {new Date(cb.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {cb.actionRequired && (
                          <Button 
                            size="sm" 
                            className="bg-[#b91c1c]/75 hover:bg-[#b91c1c] text-white border border-[#b91c1c]/20"
                            onClick={() => handleAction(cb)}
                          >
                            Action
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredChargebacks.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No chargebacks found matching your criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Take Action on {selectedChargeback?.id}</DialogTitle>
            <DialogDescription>
              {selectedChargeback && (
                <span>
                  Amount: ${selectedChargeback.amount.toFixed(2)} • {selectedChargeback.customer}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Reason: {selectedChargeback?.reason}
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white"
                onClick={handleDispute}
              >
                <Scale className="mr-2 h-4 w-4" />
                Dispute Chargeback
              </Button>
              <Button 
                className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white"
                onClick={handleRefund}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Issue Refund
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsActionDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
