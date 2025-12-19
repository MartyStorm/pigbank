import { useState, useMemo, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, CreditCard, Activity, Calendar, ChevronDown, BarChart2, LineChart as LineChartIcon, ShieldCheck, Clock, AlertTriangle, CheckCircle, FileText, Bell, Upload, X, Camera, User } from "lucide-react";
import { ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, AreaChart, Area, Cell, PieChart, Pie, Legend, CartesianGrid } from "recharts";
import { cn } from "@/lib/utils";
import { format, subDays, startOfDay, eachDayOfInterval, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { useStaffApi } from "@/hooks/useStaffApi";
import { useAuth } from "@/hooks/useAuth";
import type { DateRange } from "react-day-picker";

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

interface MerchantData {
  id: string;
  status: string;
  onboardingStatus: string;
  legalBusinessName: string | null;
  hasSeenWelcome: boolean;
}

export default function Dashboard() {
  const [showPrevious, setShowPrevious] = useState(false);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [searchQuery, setSearchQuery] = useState("");
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const queryClient = useQueryClient();
  const { getApiUrl, getQueryKey, isStaffViewingMerchant, isInitialized } = useStaffApi();
  const { isPigBankStaff, isAuthenticated, isLoading: isAuthLoading, user } = useAuth();

  // Fetch merchant data to show application status
  const { data: merchantData } = useQuery<MerchantData>({
    queryKey: ["/api/onboarding/merchant"],
    queryFn: async () => {
      const res = await fetch("/api/onboarding/merchant", { credentials: "include" });
      if (!res.ok) return null;
      const data = await res.json();
      return data.merchant;
    },
    enabled: isAuthenticated && !isPigBankStaff,
  });

  // Mutation to mark welcome as seen
  const markWelcomeSeenMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/onboarding/merchant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ hasSeenWelcome: true }),
      });
      if (!res.ok) throw new Error("Failed to update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding/merchant"] });
    },
  });

  // Mutation to update profile picture
  const updateProfileMutation = useMutation({
    mutationFn: async (profileImageUrl: string) => {
      const res = await fetch("/api/onboarding/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ profileImageUrl }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Check for welcome query param and show modal
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    if (params.get("welcome") === "true") {
      setShowWelcomeModal(true);
      // Clear the query param from URL
      setLocation("/", { replace: true });
    }
  }, [searchString, setLocation]);

  // Also show welcome modal if merchant hasn't seen it yet (fallback)
  useEffect(() => {
    if (merchantData && merchantData.status === 'submitted' && merchantData.hasSeenWelcome === false) {
      setShowWelcomeModal(true);
    }
  }, [merchantData]);

  // Redirect to landing page if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      setLocation("/landing");
    }
  }, [isAuthenticated, isAuthLoading, setLocation]);

  const handleCloseWelcome = () => {
    setShowWelcomeModal(false);
    markWelcomeSeenMutation.mutate();
    // Save profile picture if one was selected
    if (profileImagePreview) {
      updateProfileMutation.mutate(profileImagePreview);
    }
  };

  // Determine if we should show the application status card
  const showApplicationStatus = merchantData && 
    ['submitted', 'action_required', 'in_onboarding'].includes(merchantData.status) &&
    !isPigBankStaff;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'submitted':
        return { label: 'Under Review', color: 'text-blue-600', bgColor: 'bg-blue-100', icon: Clock };
      case 'action_required':
        return { label: 'Action Required', color: 'text-amber-600', bgColor: 'bg-amber-100', icon: AlertTriangle };
      case 'in_onboarding':
        return { label: 'In Progress', color: 'text-purple-600', bgColor: 'bg-purple-100', icon: FileText };
      case 'approved':
        return { label: 'Approved', color: 'text-[#73cb43]', bgColor: 'bg-[#73cb43]/20', icon: CheckCircle };
      default:
        return { label: 'Pending', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: Clock };
    }
  };


  const transactionsApiUrl = getApiUrl("/api/transactions");
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: getQueryKey("/api/transactions"),
    queryFn: async () => {
      const res = await fetch(transactionsApiUrl, { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });

  const stats = useMemo(() => {
    const approved = transactions.filter(t => t.status === "Approved");
    const declined = transactions.filter(t => t.status === "Declined");
    const refunded = transactions.filter(t => t.status === "Refunded" || t.status === "Partially Refunded");
    
    const totalSales = approved.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const declinedAmount = declined.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const refundedAmount = refunded.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalTxns = transactions.length;
    const approvalRate = totalTxns > 0 ? (approved.length / totalTxns) * 100 : 0;
    
    // Only show demo data when demo mode is explicitly active
    if (user?.demoActive) {
      return [
        { title: "Today's Gross Sales", value: "$47,892", trend: "+12.4%", trendUp: true, icon: DollarSign },
        { title: "Approval Rate", value: "89%", trend: "+2.1%", trendUp: true, icon: CreditCard },
        { title: "Chargeback Rate", value: "0.05%", trend: "-0.02%", trendUp: true, icon: TrendingUp },
        { title: "Declined Amount", value: "$4,231", trend: "-8.3%", trendUp: false, icon: ArrowDownRight },
        { title: "Refund Amount", value: "$1,847", trend: "-3.2%", trendUp: false, icon: ArrowUpRight },
      ];
    }
    
    return [
      { title: "Today's Gross Sales", value: `$${totalSales.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, trend: "—", trendUp: true, icon: DollarSign },
      { title: "Approval Rate", value: totalTxns > 0 ? `${Math.round(approvalRate)}%` : "—", trend: "—", trendUp: true, icon: CreditCard },
      { title: "Chargeback Rate", value: "0%", trend: "—", trendUp: true, icon: TrendingUp },
      { title: "Declined Amount", value: `$${declinedAmount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, trend: "—", trendUp: false, icon: ArrowDownRight },
      { title: "Refund Amount", value: `$${refundedAmount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`, trend: "—", trendUp: true, icon: ArrowUpRight },
    ];
  }, [transactions, user?.demoActive]);

  const chartData = useMemo(() => {
    // Use the selected date range
    const start = dateRange?.from || startOfMonth(new Date());
    const end = dateRange?.to || endOfMonth(new Date());
    const days = eachDayOfInterval({ start, end });
    
    // Only show demo chart data when demo mode is explicitly active
    if (user?.demoActive) {
      // Pre-defined organic growth pattern with natural variation
      const organicMultipliers = [
        1.00, 0.92, 1.08, 1.15, 1.03, 1.22, 1.18, 1.31, 1.25, 1.38,
        1.42, 1.35, 1.52, 1.48, 1.61, 1.55, 1.68, 1.72, 1.65, 1.78,
        1.85, 1.79, 1.92, 1.88, 2.01, 1.95, 2.12, 2.08, 2.21, 2.28,
        2.18, 2.35, 2.42, 2.38, 2.52, 2.48, 2.61, 2.58, 2.72, 2.68
      ];
      return days.map((day, index) => {
        const baseValue = 18000;
        const multiplier = organicMultipliers[index % organicMultipliers.length];
        const current = Math.round(baseValue * multiplier);
        return { 
          date: format(day, "MMM d"), 
          current: current, 
          previous: Math.round(current * 0.82) 
        };
      });
    }
    
    return days.map(day => {
      const dayStart = startOfDay(day);
      const dayTxns = transactions.filter(t => {
        const txnDate = startOfDay(new Date(t.date));
        return txnDate.getTime() === dayStart.getTime() && t.status === "Approved";
      });
      const total = dayTxns.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      return { date: format(day, "MMM d"), current: total, previous: 0 };
    });
  }, [transactions, dateRange, user?.demoActive]);

  const transactionStatusData = useMemo(() => {
    const approved = transactions.filter(t => t.status === "Approved").length;
    const refunded = transactions.filter(t => t.status === "Refunded" || t.status === "Partially Refunded").length;
    const declined = transactions.filter(t => t.status === "Declined").length;
    const errors = transactions.filter(t => t.status === "Error").length;
    const total = transactions.length || 1;
    
    // Only show demo data when demo mode is explicitly active
    if (user?.demoActive) {
      return [
        { name: "Charges", value: 892, percentage: 89, color: "#73cb43", chartValue: 89 },
        { name: "Refunds", value: 34, percentage: 3, color: "#1877F2", chartValue: 3 },
        { name: "Declines", value: 67, percentage: 7, color: "#b91c1c", chartValue: 7 },
        { name: "Errors", value: 8, percentage: 1, color: "#f0b100", chartValue: 1 },
      ];
    }
    
    return [
      { name: "Charges", value: approved, percentage: Math.round((approved / total) * 100), color: "#73cb43", chartValue: approved },
      { name: "Refunds", value: refunded, percentage: Math.round((refunded / total) * 100), color: "#1877F2", chartValue: refunded },
      { name: "Declines", value: declined, percentage: Math.round((declined / total) * 100), color: "#b91c1c", chartValue: declined },
      { name: "Errors", value: errors, percentage: Math.round((errors / total) * 100), color: "#f0b100", chartValue: errors },
    ];
  }, [transactions, user?.demoActive]);

  const payoutBalance = useMemo(() => {
    // Only show demo payout balance when demo mode is explicitly active
    if (user?.demoActive) {
      return 47892;
    }
    return transactions
      .filter(t => t.status === "Approved")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }, [transactions, user?.demoActive]);

  const chargebackCount = useMemo(() => {
    // If demo mode is active, always show 0 chargebacks
    if (user?.demoActive) {
      return 0;
    }
    return transactions.filter(t => t.status === "Chargeback").length;
  }, [transactions, user?.demoActive]);
  
  // Use CSS variable for grid color to handle dark mode
  const gridColor = "var(--border)";
  const textColor = "var(--muted-foreground)";

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setLocation(`/transactions?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Layout title="Dashboard">
      {/* Welcome Modal for New Merchants */}
      <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0" data-testid="modal-welcome">
          {/* Dark green header */}
          <div className="bg-[#1a4d1a] px-6 py-8 text-center">
            <div className="flex justify-center mb-4">
              <img src="/pig-bank-logo-white.png" alt="PigBank" className="h-14" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Welcome!</h2>
            <p className="text-white/90 text-lg">
              Your merchant application has been submitted successfully.
            </p>
          </div>
          
          <div className="px-6 py-6 space-y-4">
            {/* Profile Picture Upload Section */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden border-2 border-[#73cb43]">
                  {profileImagePreview || user?.profileImageUrl ? (
                    <img 
                      src={profileImagePreview || user?.profileImageUrl || ''} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <label 
                  htmlFor="profile-image-upload"
                  className="absolute -bottom-1 -right-1 bg-[#73cb43] hover:bg-[#65b53b] p-1.5 rounded-full cursor-pointer shadow-md transition-colors"
                >
                  <Camera className="h-3.5 w-3.5 text-white" />
                </label>
                <input
                  type="file"
                  id="profile-image-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  data-testid="input-profile-image"
                />
              </div>
              <div>
                <h5 className="font-medium">Add Your Profile Picture</h5>
                <p className="text-sm text-muted-foreground">
                  Personalize your account with a photo
                </p>
              </div>
            </div>

            <div className="bg-[#73cb43]/10 border border-[#73cb43]/30 rounded-lg p-4">
              <h4 className="font-semibold text-[#1a4d1a] mb-2">What happens next?</h4>
              <p className="text-sm text-[#2d6a2d]">
                Our team will review your application within 1-2 business days. We'll contact you if we need any additional information.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-[#73cb43]/20 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-[#73cb43]" />
                </div>
                <div>
                  <h5 className="font-medium">Track Your Status</h5>
                  <p className="text-sm text-muted-foreground">
                    Your application status will be shown at the top of the dashboard. Check back anytime to see updates.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-[#73cb43]/20 p-2 rounded-lg">
                  <Upload className="h-5 w-5 text-[#73cb43]" />
                </div>
                <div>
                  <h5 className="font-medium">Upload Documents</h5>
                  <p className="text-sm text-muted-foreground">
                    If we need additional documents, you'll see a request in your status card with an upload option.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-[#73cb43]/20 p-2 rounded-lg">
                  <Bell className="h-5 w-5 text-[#73cb43]" />
                </div>
                <div>
                  <h5 className="font-medium">Get Notified</h5>
                  <p className="text-sm text-muted-foreground">
                    We'll email you with updates. Enable text notifications in Settings or from the Dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 pb-6 flex justify-end">
            <Button 
              onClick={handleCloseWelcome}
              className="bg-[#73cb43] hover:bg-[#65b53b] px-8"
              data-testid="button-close-welcome"
            >
              Got It
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {/* Application Status Card - Only show for pending merchants */}
        {showApplicationStatus && (
          <Card className="border border-blue-200 bg-blue-50/50" data-testid="card-application-status">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {(() => {
                    const status = getStatusInfo(merchantData.status);
                    const StatusIcon = status.icon;
                    return (
                      <>
                        <div className={cn("p-3 rounded-full", status.bgColor)}>
                          <StatusIcon className={cn("h-6 w-6", status.color)} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Application Status</h3>
                          <div className="flex items-center gap-2">
                            <span className={cn("font-medium", status.color)}>{status.label}</span>
                            {merchantData.legalBusinessName && (
                              <span className="text-muted-foreground">• {merchantData.legalBusinessName}</span>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
                {merchantData.status === 'action_required' && (
                  <Button 
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                    onClick={() => setLocation("/onboarding")}
                    data-testid="button-complete-action"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Complete Required Actions
                  </Button>
                )}
                {merchantData.status === 'submitted' && (
                  <Button 
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
                    onClick={() => setLocation("/settings")}
                    data-testid="button-enable-sms"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Enable Text Alerts
                  </Button>
                )}
              </div>
              {merchantData.status === 'submitted' && (
                <div className="mt-3 pl-16">
                  <p className="text-sm text-muted-foreground">
                    Your application is being reviewed by our team. We'll notify you by email when there are updates.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-dashboard-title">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Overview of your payment processing activity and performance
            </p>
          </div>
        </div>

        {/* Mobile Top Section: Search */}
        <div className="flex flex-col gap-5 mt-0">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <input
              type="text"
              placeholder="Search transactions, customers, issue refunds..."
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9 border-muted-foreground/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              data-testid="input-dashboard-search"
            />
          </div>
        </div>

        {/* Account Health & Payout Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Chargeback Alert Widget */}
          <div className={cn(
            "w-full rounded-xl p-4 flex items-center justify-between gap-3",
            chargebackCount > 0 
              ? "bg-[#f0b100]/20 border border-[#f0b100]" 
              : "bg-[#73cb43]/20 border border-[#39870E]"
          )}>
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle className={cn("h-5 w-5 flex-shrink-0", chargebackCount > 0 ? "text-warning-text" : "text-success-text")} />
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate">Chargeback Alert</h3>
                <span className={cn("text-[10px] font-medium block", chargebackCount > 0 ? "text-warning-text" : "text-success-text")}>
                  {chargebackCount > 0 ? "Action Required" : "No Action Required"}
                </span>
              </div>
            </div>
            <span className="font-bold text-foreground text-lg flex-shrink-0">{chargebackCount}</span>
          </div>

          {/* Account Health Widget */}
          <div className="w-full bg-[#73cb43]/20 border border-[#39870E] rounded-xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="h-5 w-5 text-success-text flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate">Account Health</h3>
                <span className="text-[10px] text-success-text font-medium block">Status</span>
              </div>
            </div>
            <span className="font-bold text-foreground text-lg flex-shrink-0">Good</span>
          </div>

          {/* Total Payout Balance Widget */}
          <button 
            onClick={() => setLocation("/payouts")}
            className="w-full bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-muted/50 transition-colors text-left"
            data-testid="button-payout-balance-card"
          >
            <div className="flex items-center gap-2 min-w-0">
              <DollarSign className="h-5 w-5 text-success-text flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate">Payout Balance</h3>
                <span className="text-[10px] text-muted-foreground block">{payoutBalance > 0 ? "Processing" : "No balance"}</span>
              </div>
            </div>
            <span className="font-bold text-success-text text-lg flex-shrink-0">${payoutBalance.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
          </button>
        </div>

        {/* Performance Metrics Header & Date Selector */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-foreground">Performance Metrics</h2>
            <p className="text-[10px] text-muted-foreground md:hidden">Based on selected date range</p>
          </div>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 border-dashed" data-testid="button-daterange-dashboard">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {dateRange?.from ? format(dateRange.from, "MMM dd, yyyy") : "Start"} - {dateRange?.to ? format(dateRange.to, "MMM dd, yyyy") : "End"}
                </span>
                <span className="sm:hidden">
                  {dateRange?.from ? format(dateRange.from, "MMM dd") : "Start"} - {dateRange?.to ? format(dateRange.to, "MMM dd") : "End"}
                </span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  if (range?.from && range?.to) {
                    setDatePickerOpen(false);
                  }
                }}
                numberOfMonths={2}
                defaultMonth={dateRange?.from}
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight text-foreground">{stat.value}</div>
                <div className="flex items-center text-xs mt-1">
                  <span className={cn("flex items-center font-medium", stat.trendUp ? "text-[#73cb43]" : "text-rose-600 dark:text-rose-400")}>
                    {stat.trendUp ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                    {stat.trend}
                  </span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Volume Chart */}
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-semibold">Processed Volume Over Time</CardTitle>
                <p className="text-sm text-gray-600">Daily transaction volume</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border rounded-md overflow-hidden bg-muted">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 rounded-none px-0 transition-colors border-transparent",
                      chartType === 'bar' 
                        ? "bg-[#73cb43e6] text-white hover:bg-[#65b538]" 
                        : "bg-[#d1d5db] text-gray-600 hover:bg-[#c4c9cf]"
                    )}
                    onClick={() => setChartType('bar')}
                    title="Bar Chart"
                  >
                    <BarChart2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "h-8 w-8 rounded-none px-0 transition-colors border-transparent",
                      chartType === 'line' 
                        ? "bg-[#73cb43e6] text-white hover:bg-[#65b538]" 
                        : "bg-[#d1d5db] text-gray-600 hover:bg-[#c4c9cf]"
                    )}
                    onClick={() => setChartType('line')}
                    title="Line Chart"
                  >
                    <LineChartIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="h-[240px] w-full pb-0">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'bar' ? (
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barGap={4}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#73cb43" stopOpacity={1} />
                          <stop offset="100%" stopColor="#8fdc65" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#e5e7eb" vertical={false} strokeDasharray="0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tick={{ fill: "#9ca3af" }}
                        interval={4}
                        dy={10}
                        padding={{ left: 10, right: 10 }}
                      />
                      <YAxis 
                        stroke="#9ca3af" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `${value / 1000}k`}
                        tick={{ fill: "#9ca3af" }}
                        width={35}
                        domain={[0, 'auto']}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                        formatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                        cursor={{ fill: 'transparent' }}
                      />
                      <Bar dataKey="current" fill="url(#barGradient)" name="Current Period" radius={[0, 0, 0, 0]} barSize={12} />
                    </BarChart>
                  ) : (
                    <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                      <CartesianGrid stroke="#e5e7eb" vertical={false} strokeDasharray="0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tick={{ fill: "#9ca3af" }}
                        interval={4}
                        dy={10}
                        padding={{ left: 10, right: 10 }}
                      />
                      <YAxis 
                        stroke="#9ca3af" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        tickFormatter={(value) => `${value / 1000}k`}
                        tick={{ fill: "#9ca3af" }}
                        width={35}
                        domain={[0, 'auto']}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                        formatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <Area type="monotone" dataKey="current" stroke="#73cb43" fillOpacity={0.3} fill="#73cb43" strokeWidth={2} name="Current Period" />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transactions by Status */}
          <Card className="w-full lg:col-span-1 border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Transactions by status</CardTitle>
              <p className="text-sm text-muted-foreground">
                {transactions.length > 0 
                  ? "Showing: All transactions Jan 1 - Dec 25, 2025" 
                  : "No transactions yet"}
              </p>
            </CardHeader>
            <CardContent>
            
            {transactions.length > 0 ? (
              <div className="flex flex-col items-center gap-4">
                {/* Donut Chart */}
                <div className="h-[180px] w-[180px] flex-shrink-0 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={transactionStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={0}
                        dataKey="chartValue"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {transactionStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                        ))}
                      </Pie>
                      <Tooltip 
                         contentStyle={{ backgroundColor: "hsl(var(--card))", borderRadius: "8px", border: "1px solid hsl(var(--border))" }}
                         itemStyle={{ color: "hsl(var(--foreground))" }}
                         formatter={(value: number, name: string, props: any) => [props.payload.value, props.payload.name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-foreground">{transactions.length}</span>
                    <span className="text-xs text-muted-foreground">Total</span>
                  </div>
                </div>

                {/* Legend Table */}
                <div className="w-full">
                  <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Count</span>
                  </div>
                  <div className="space-y-2">
                    {transactionStatusData.map((item, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-[2px] flex-shrink-0" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium text-foreground">{item.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground font-mono">
                          {item.value} ({item.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-muted/30 rounded-xl border border-dashed border-muted-foreground/20">
                <div className="bg-[#73cb43]/10 p-4 rounded-full mb-4">
                  <BarChart2 className="h-8 w-8 text-[#73cb43]" />
                </div>
                <h4 className="font-medium text-foreground mb-2">No transaction data yet</h4>
                <p className="text-sm text-muted-foreground max-w-[200px]">
                  Your transaction breakdown will appear here once you start processing payments.
                </p>
              </div>
            )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
