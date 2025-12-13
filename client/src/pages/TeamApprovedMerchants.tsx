import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, CheckCircle, Loader2, Eye, UserCheck } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useMerchantView } from "@/hooks/useMerchantView";
import type { Merchant } from "@shared/schema";

const riskColors: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

interface MerchantsResponse {
  merchants: Merchant[];
  total: number;
}

export default function TeamApprovedMerchants() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { enterMerchantView } = useMerchantView();
  const [, setLocation] = useLocation();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setTimeout(() => setDebouncedSearch(value), 300);
  };

  const handleViewAccount = (merchant: Merchant) => {
    enterMerchantView(merchant);
    setLocation("/dashboard");
  };

  const { data, isLoading, error } = useQuery<MerchantsResponse>({
    queryKey: ["/api/team/merchants", "approved", debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("status", "approved");
      if (debouncedSearch) params.append("search", debouncedSearch);
      const res = await fetch(`/api/team/merchants?${params.toString()}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch merchants");
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-approved-title">
              Approved Merchants
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage approved merchant accounts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="count-total-approved">{data?.total || 0}</p>
                  <p className="text-sm text-muted-foreground">Total Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="count-active">
                    {merchants.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Merchants</p>
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
                  data-testid="input-search-approved"
                />
              </div>
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
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Monthly Volume</TableHead>
                    <TableHead>Approved Date</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {merchants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                        No approved merchants found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    merchants.map((merchant) => (
                      <TableRow key={merchant.id} data-testid={`row-approved-${merchant.id}`}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{merchant.legalBusinessName || "Unnamed"}</p>
                            {merchant.dba && <p className="text-sm text-gray-500">DBA: {merchant.dba}</p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {merchant.riskLevel ? (
                            <Badge className={riskColors[merchant.riskLevel] || "bg-gray-100"}>
                              {merchant.riskLevel}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>{formatVolume(merchant.expectedMonthlyVolume)}</TableCell>
                        <TableCell>{formatDate(merchant.submittedAt)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={() => handleViewAccount(merchant)}
                              data-testid={`button-view-account-${merchant.id}`}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              View Account
                            </Button>
                            <Link href={`/team/merchants/${merchant.id}`}>
                              <Button variant="ghost" size="sm" data-testid={`button-view-approved-${merchant.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </Link>
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
