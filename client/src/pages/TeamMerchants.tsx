import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearch, useLocation } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Building2, AlertTriangle, Clock, CheckCircle, Loader2, Eye, UserCheck, Trash2, FileEdit } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Layout } from "@/components/layout/Layout";
import { useMerchantView } from "@/hooks/useMerchantView";
import type { Merchant } from "@shared/schema";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600 border border-gray-600 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600",
  submitted: "bg-[#f0b100]/20 text-[#f0b100] border border-[#f0b100] dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
  action_required: "bg-orange-100 text-orange-700 border border-orange-700 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700",
  in_onboarding: "bg-blue-100 text-blue-700 border border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
  approved: "bg-[#73cb43]/20 text-[#39870E] border border-[#39870E] dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
  rejected: "bg-[#b91c1c]/20 text-[#b91c1c] border border-[#b91c1c] dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
  suspended: "bg-[#b91c1c]/20 text-[#b91c1c] border border-[#b91c1c] dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
};

const statusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  action_required: "Action Required",
  in_onboarding: "Onboarding",
  approved: "Active",
  rejected: "Rejected",
  suspended: "Suspended",
};

const riskColors: Record<string, string> = {
  low: "bg-[#73cb43]/20 text-[#39870E] border border-[#39870E] dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
  medium: "bg-[#f0b100]/20 text-[#f0b100] border border-[#f0b100] dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
  high: "bg-[#b91c1c]/20 text-[#b91c1c] border border-[#b91c1c] dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
};

interface MerchantsResponse {
  merchants: Merchant[];
  total: number;
}

export default function TeamMerchants() {
  const searchString = useSearch();
  const urlParams = new URLSearchParams(searchString);
  const initialStatus = urlParams.get("status") || "all";
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { enterMerchantView } = useMerchantView();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleViewAccount = (merchant: Merchant) => {
    enterMerchantView(merchant);
    setLocation("/dashboard");
  };

  const deleteMutation = useMutation({
    mutationFn: async (merchantId: string) => {
      const res = await fetch(`/api/team/merchants/${merchantId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Application deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/team/merchants"] });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    },
  });
  
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const urlStatus = params.get("status") || "all";
    if (urlStatus !== statusFilter) {
      setStatusFilter(urlStatus);
    }
  }, [searchString]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setTimeout(() => setDebouncedSearch(value), 300);
  };

  const { data, isLoading, error } = useQuery<MerchantsResponse>({
    queryKey: ["/api/team/merchants", statusFilter, debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (debouncedSearch) params.append("search", debouncedSearch);
      const res = await fetch(`/api/team/merchants?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch merchants");
      return res.json();
    },
  });

  const { data: submittedData } = useQuery<MerchantsResponse>({
    queryKey: ["/api/team/merchants", "submitted", "count"],
    queryFn: async () => {
      const res = await fetch("/api/team/merchants?status=submitted&limit=1", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { data: onboardingData } = useQuery<MerchantsResponse>({
    queryKey: ["/api/team/merchants", "in_onboarding", "count"],
    queryFn: async () => {
      const res = await fetch("/api/team/merchants?status=in_onboarding&limit=1", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { data: approvedData } = useQuery<MerchantsResponse>({
    queryKey: ["/api/team/merchants", "approved", "count"],
    queryFn: async () => {
      const res = await fetch("/api/team/merchants?status=approved&limit=1", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { data: actionRequiredData } = useQuery<MerchantsResponse>({
    queryKey: ["/api/team/merchants", "action_required", "count"],
    queryFn: async () => {
      const res = await fetch("/api/team/merchants?status=action_required&limit=1", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { data: draftData } = useQuery<MerchantsResponse>({
    queryKey: ["/api/team/merchants", "draft", "count"],
    queryFn: async () => {
      const res = await fetch("/api/team/merchants?status=draft&limit=1", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const merchants = data?.merchants || [];

  const formatDate = (date: string | Date | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const formatVolume = (volume: string | null) => {
    if (!volume) return "-";
    return `$${parseFloat(volume).toLocaleString()}`;
  };

  return (
    <Layout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-merchants-title">
              Applications
            </h1>
            <p className="text-muted-foreground mt-1">
              Review and manage merchant applications
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <FileEdit className="h-6 w-6 text-gray-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="count-draft">{draftData?.total || 0}</p>
                  <p className="text-sm text-muted-foreground">Draft</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Clock className="h-6 w-6 text-[#f0b100]" />
                <div>
                  <p className="text-2xl font-bold" data-testid="count-pending">{submittedData?.total || 0}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="count-action-required">{actionRequiredData?.total || 0}</p>
                  <p className="text-sm text-muted-foreground">Action Required</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Building2 className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold" data-testid="count-onboarding">{onboardingData?.total || 0}</p>
                  <p className="text-sm text-muted-foreground">Onboarding</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <CheckCircle className="h-6 w-6 text-[#73cb43]" />
                <div>
                  <p className="text-2xl font-bold" data-testid="count-active">{approvedData?.total || 0}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by business name..."
                  value={search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-merchants"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48" data-testid="select-status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="action_required">Action Required</SelectItem>
                  <SelectItem value="in_onboarding">In Onboarding</SelectItem>
                  <SelectItem value="approved">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                Failed to load merchants. Please try again.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Expected Volume</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {merchants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No merchants found. Applications will appear here when submitted.
                      </TableCell>
                    </TableRow>
                  ) : (
                    merchants.map((merchant) => (
                      <TableRow key={merchant.id} data-testid={`row-merchant-${merchant.id}`}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{merchant.legalBusinessName || "Unnamed"}</p>
                            {merchant.dba && <p className="text-sm text-muted-foreground">DBA: {merchant.dba}</p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`min-w-[90px] justify-center ${statusColors[merchant.status] || "bg-gray-100"}`}>
                            {statusLabels[merchant.status] || merchant.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {merchant.riskLevel ? (
                            <Badge className={`min-w-[70px] justify-center ${riskColors[merchant.riskLevel] || "bg-gray-100"}`}>
                              {merchant.riskLevel}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>{formatVolume(merchant.expectedMonthlyVolume)}</TableCell>
                        <TableCell>{formatDate(merchant.submittedAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Link href={`/team/merchants/${merchant.id}`}>
                              <Button variant="ghost" size="sm" data-testid={`button-view-${merchant.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  data-testid={`button-delete-${merchant.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Application</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete the application for "{merchant.legalBusinessName || "Unnamed"}"? This action cannot be undone and will permanently remove all associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteMutation.mutate(merchant.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
