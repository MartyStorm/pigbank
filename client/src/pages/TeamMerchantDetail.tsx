import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building2, User, Banknote, Globe, FileText, MessageSquare, CheckCircle, XCircle, Loader2, Send, Scale, ClipboardCheck, AlertCircle, CheckCircle2, UserCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Layout } from "@/components/layout/Layout";
import { useMerchantView } from "@/hooks/useMerchantView";

type Merchant = {
  id: string;
  status: string;
  onboardingStatus: string;
  riskLevel: string | null;
  monthlyVolume: string | null;
  legalBusinessName: string | null;
  dba: string | null;
  ein: string | null;
  businessAddress: string | null;
  businessCity: string | null;
  businessState: string | null;
  businessZip: string | null;
  businessCountry: string | null;
  businessType: string | null;
  websiteUrl: string | null;
  productDescription: string | null;
  mccCategory: string | null;
  expectedMonthlyVolume: string | null;
  averageTicketSize: string | null;
  bankName: string | null;
  bankRoutingNumber: string | null;
  bankAccountNumber: string | null;
  bankAccountType: string | null;
  articlesOfIncorporationUrl: string | null;
  voidedCheckUrl: string | null;
  createdAt: string;
  submittedAt: string | null;
};

type Owner = {
  id: string;
  fullName: string;
  dateOfBirth: string | null;
  homeAddress: string | null;
  ssnLast4: string | null;
  governmentIdUrl: string | null;
  ownershipPercentage: string | null;
  kycConsent: boolean;
};

type Note = {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
};

type MerchantDetailResponse = {
  merchant: Merchant;
  owners: Owner[];
  teamMembers: any[];
  notes: Note[];
  events: any[];
};

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    submitted: "bg-yellow-100 text-yellow-700",
    action_required: "bg-orange-100 text-orange-700",
    in_onboarding: "bg-blue-100 text-blue-700",
    under_review: "bg-blue-100 text-blue-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
  };
  return styles[status] || "bg-gray-100 text-gray-700";
}

const statusLabels: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  action_required: "Action Required",
  in_onboarding: "In Onboarding",
  under_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  suspended: "Suspended",
};

function getRiskBadge(risk: string | null) {
  if (!risk) return "bg-gray-100 text-gray-700";
  const styles: Record<string, string> = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };
  return styles[risk.toLowerCase()] || "bg-gray-100 text-gray-700";
}

function formatCurrency(amount: string | null) {
  if (!amount) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseFloat(amount));
}

function maskValue(value: string | null, showLast: number = 4) {
  if (!value) return "Not provided";
  if (value.length <= showLast) return value;
  return "****" + value.slice(-showLast);
}

export default function TeamMerchantDetail() {
  const params = useParams<{ id: string }>();
  const merchantId = params.id;
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [newNote, setNewNote] = useState("");
  const [, setLocation] = useLocation();
  const { enterMerchantView } = useMerchantView();

  const handleViewAccount = (merchant: Merchant) => {
    enterMerchantView({
      id: merchant.id,
      legalBusinessName: merchant.legalBusinessName,
      dba: merchant.dba,
      status: merchant.status,
      onboardingStatus: merchant.onboardingStatus,
    } as any);
    setLocation("/dashboard");
  };

  const { data, isLoading, error } = useQuery<MerchantDetailResponse>({
    queryKey: ["/api/team/merchants", merchantId],
    queryFn: async () => {
      const res = await fetch(`/api/team/merchants/${merchantId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch merchant");
      return res.json();
    },
  });

  const approveMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/team/merchants/${merchantId}/approve`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to approve");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team/merchants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/team/merchants", merchantId] });
      toast({ title: "Merchant approved successfully" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/team/merchants/${merchantId}/reject`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to reject");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team/merchants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/team/merchants", merchantId] });
      toast({ title: "Merchant rejected" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const actionRequiredMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/team/merchants/${merchantId}/action-required`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update status");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team/merchants"] });
      queryClient.invalidateQueries({ queryKey: ["/api/team/merchants", merchantId] });
      toast({ title: "Status updated to Action Required" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/team/merchants/${merchantId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to add note");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team/merchants", merchantId] });
      setNewNote("");
      toast({ title: "Note added" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    addNoteMutation.mutate(newNote);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">Failed to load merchant details</p>
            <Link href="/team/merchants">
              <Button variant="outline">Back to Merchants</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const { merchant, owners, notes } = data;
  const canApproveReject = merchant.status === "submitted" || merchant.status === "under_review" || merchant.status === "action_required";

  return (
    <Layout>
      <div>
        <Link href="/team/merchants" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gray-900 dark:hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Merchants
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-merchant-name">
              {merchant.legalBusinessName || merchant.dba || "Untitled Merchant"}
            </h1>
            <p className="text-muted-foreground">ID: {merchantId}</p>
          </div>
          <div className="flex gap-3">
            {merchant.status === "approved" && (
              <Button 
                className="bg-[#73cb43] hover:bg-[#65b53b]" 
                data-testid="button-view-account"
                onClick={() => handleViewAccount(merchant)}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                View Account
              </Button>
            )}
            {canApproveReject && (
              <>
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white" 
                  data-testid="button-reject"
                  onClick={() => rejectMutation.mutate()}
                  disabled={rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Reject
                </Button>
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white" 
                  data-testid="button-action-required"
                  onClick={() => actionRequiredMutation.mutate()}
                  disabled={actionRequiredMutation.isPending}
                >
                  {actionRequiredMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  )}
                  Action Required
                </Button>
                <Button 
                  className="bg-[#73cb43] hover:bg-[#65b53b]" 
                  data-testid="button-approve"
                  onClick={() => approveMutation.mutate()}
                  disabled={approveMutation.isPending}
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={getStatusBadge(merchant.status)}>
                  {statusLabels[merchant.status] || merchant.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">Application Status</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={getRiskBadge(merchant.riskLevel)}>
                  {merchant.riskLevel || "Not Set"}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">Risk Level</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{formatCurrency(merchant.expectedMonthlyVolume)}</p>
              <p className="text-sm text-gray-500">Expected Monthly Volume</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="business" className="space-y-4">
          <TabsList className="bg-[#1a4320] dark:bg-[#262626] w-full h-auto grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2 p-2">
            <TabsTrigger value="business" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white justify-center w-full" data-testid="tab-business">
              <Building2 className="h-4 w-4 mr-2" />
              Business Info
            </TabsTrigger>
            <TabsTrigger value="owners" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white justify-center w-full" data-testid="tab-owners">
              <User className="h-4 w-4 mr-2" />
              Owners & KYC
            </TabsTrigger>
            <TabsTrigger value="bank" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white justify-center w-full" data-testid="tab-bank">
              <Banknote className="h-4 w-4 mr-2" />
              Bank Details
            </TabsTrigger>
            <TabsTrigger value="website" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white justify-center w-full" data-testid="tab-website">
              <Globe className="h-4 w-4 mr-2" />
              Website & Products
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white justify-center w-full" data-testid="tab-documents">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="underwriting" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white justify-center w-full" data-testid="tab-underwriting">
              <Scale className="h-4 w-4 mr-2" />
              Underwriting
            </TabsTrigger>
            <TabsTrigger value="onboarding" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white justify-center w-full" data-testid="tab-onboarding">
              <ClipboardCheck className="h-4 w-4 mr-2" />
              Onboarding
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white justify-center w-full" data-testid="tab-notes">
              <MessageSquare className="h-4 w-4 mr-2" />
              Notes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="business">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Legal Business Name</label>
                    <p className="text-gray-900" data-testid="text-legal-name">{merchant.legalBusinessName || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">DBA (Doing Business As)</label>
                    <p className="text-gray-900" data-testid="text-dba">{merchant.dba || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">EIN / Tax ID</label>
                    <p className="text-gray-900" data-testid="text-ein">{maskValue(merchant.ein)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Type</label>
                    <p className="text-gray-900" data-testid="text-business-type">{merchant.businessType || "Not provided"}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Business Address</label>
                    <p className="text-gray-900" data-testid="text-address">
                      {merchant.businessAddress ? (
                        `${merchant.businessAddress}, ${merchant.businessCity || ""}, ${merchant.businessState || ""} ${merchant.businessZip || ""} ${merchant.businessCountry || ""}`
                      ) : (
                        "Not provided"
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="owners">
            <Card>
              <CardHeader>
                <CardTitle>Owners & KYC</CardTitle>
              </CardHeader>
              <CardContent>
                {owners.length === 0 ? (
                  <p className="text-gray-500 text-center py-12">No owner data available</p>
                ) : (
                  <div className="space-y-6">
                    {owners.map((owner, index) => (
                      <div key={owner.id} className="border rounded-lg p-4" data-testid={`card-owner-${owner.id}`}>
                        <h3 className="font-medium text-gray-900 mb-4">Owner {index + 1}: {owner.fullName}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                            <p className="text-gray-900">{owner.dateOfBirth || "Not provided"}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">Ownership %</label>
                            <p className="text-gray-900">{owner.ownershipPercentage ? `${owner.ownershipPercentage}%` : "Not provided"}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">SSN (Last 4)</label>
                            <p className="text-gray-900">{owner.ssnLast4 ? `****${owner.ssnLast4}` : "Not provided"}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">KYC Consent</label>
                            <p className="text-gray-900">{owner.kycConsent ? "Yes" : "No"}</p>
                          </div>
                          <div className="col-span-2">
                            <label className="text-sm font-medium text-gray-500">Home Address</label>
                            <p className="text-gray-900">{owner.homeAddress || "Not provided"}</p>
                          </div>
                          {owner.governmentIdUrl && (
                            <div className="col-span-2">
                              <label className="text-sm font-medium text-gray-500">Government ID</label>
                              <a href={owner.governmentIdUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block">
                                View Document
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank">
            <Card>
              <CardHeader>
                <CardTitle>Bank Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Bank Name</label>
                    <p className="text-gray-900" data-testid="text-bank-name">{merchant.bankName || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Type</label>
                    <p className="text-gray-900" data-testid="text-account-type">{merchant.bankAccountType || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Routing Number</label>
                    <p className="text-gray-900" data-testid="text-routing">{maskValue(merchant.bankRoutingNumber)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Number</label>
                    <p className="text-gray-900" data-testid="text-account">{maskValue(merchant.bankAccountNumber)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="website">
            <Card>
              <CardHeader>
                <CardTitle>Website & Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website URL</label>
                    {merchant.websiteUrl ? (
                      <a href={merchant.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline block" data-testid="link-website">
                        {merchant.websiteUrl}
                      </a>
                    ) : (
                      <p className="text-gray-900">Not provided</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">MCC Category</label>
                    <p className="text-gray-900" data-testid="text-mcc">{merchant.mccCategory || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Expected Monthly Volume</label>
                    <p className="text-gray-900">{formatCurrency(merchant.expectedMonthlyVolume)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Average Ticket Size</label>
                    <p className="text-gray-900">{formatCurrency(merchant.averageTicketSize)}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Product Description</label>
                    <p className="text-gray-900 whitespace-pre-wrap" data-testid="text-product-desc">
                      {merchant.productDescription || "Not provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Articles of Incorporation</p>
                      <p className="text-sm text-gray-500">Business formation documents</p>
                    </div>
                    {merchant.articlesOfIncorporationUrl ? (
                      <a href={merchant.articlesOfIncorporationUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" data-testid="button-view-articles">View</Button>
                      </a>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100">Not uploaded</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Voided Check</p>
                      <p className="text-sm text-gray-500">Bank account verification</p>
                    </div>
                    {merchant.voidedCheckUrl ? (
                      <a href={merchant.voidedCheckUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" data-testid="button-view-check">View</Button>
                      </a>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100">Not uploaded</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="underwriting">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-3xl font-bold text-primary">{merchant.riskLevel === "high" ? "72" : merchant.riskLevel === "medium" ? "45" : "22"}</p>
                      <p className="text-sm text-muted-foreground">Risk Score</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <Badge variant="outline" className={getRiskBadge(merchant.riskLevel)}>
                        {merchant.riskLevel || "Pending"}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">Risk Level</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-xl font-bold">{merchant.mccCategory || "5999"}</p>
                      <p className="text-sm text-muted-foreground">MCC Code</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <Badge className="bg-yellow-100 text-yellow-700">Moderate</Badge>
                      <p className="text-sm text-muted-foreground mt-2">Reserve Tier</p>
                    </div>
                  </div>

                  <h4 className="font-medium mb-3">Scoring Factors</h4>
                  <div className="space-y-4">
                    {[
                      { factor: "Business Age", score: 15, maxScore: 15, status: "pass", note: "Established 3+ years" },
                      { factor: "Processing History", score: 12, maxScore: 20, status: "warning", note: "New to processing" },
                      { factor: "Credit Score", score: 12, maxScore: 15, status: "pass", note: "Good credit (720+)" },
                      { factor: "Industry Risk", score: 18, maxScore: 25, status: "warning", note: "Medium-risk MCC" },
                      { factor: "Financial Docs", score: 10, maxScore: 15, status: "pass", note: "Complete financials provided" },
                      { factor: "Delivery Method", score: 8, maxScore: 10, status: "pass", note: "Immediate fulfillment" },
                    ].map((item) => (
                      <div key={item.factor} className="flex items-center gap-4">
                        <div className="w-40">
                          <p className="text-sm font-medium">{item.factor}</p>
                        </div>
                        <div className="flex-1">
                          <Progress value={(item.score / item.maxScore) * 100} className="h-2" />
                        </div>
                        <div className="w-20 text-right">
                          <span className="text-sm">{item.score}/{item.maxScore}</span>
                        </div>
                        <div className="w-8">
                          {item.status === "pass" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Underwriting Decision</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Recommended Action</label>
                      <p className="text-lg font-medium mt-1">
                        {merchant.status === "approved" ? (
                          <span className="text-green-600">Approved</span>
                        ) : merchant.status === "rejected" ? (
                          <span className="text-red-600">Rejected</span>
                        ) : (
                          <span className="text-yellow-600">Manual Review Required</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Reserve Requirement</label>
                      <p className="text-lg font-medium mt-1">5% Rolling (7 days)</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Processing Limit</label>
                      <p className="text-lg font-medium mt-1">{formatCurrency(merchant.expectedMonthlyVolume)}/month</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Transaction Limit</label>
                      <p className="text-lg font-medium mt-1">{formatCurrency(merchant.averageTicketSize)} max per txn</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="onboarding">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Onboarding Checklist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Completion Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {merchant.status === "approved" ? "100%" : merchant.status === "submitted" ? "75%" : "40%"}
                      </span>
                    </div>
                    <Progress value={merchant.status === "approved" ? 100 : merchant.status === "submitted" ? 75 : 40} />
                  </div>

                  <div className="space-y-3">
                    {[
                      { item: "Business Information", complete: !!merchant.legalBusinessName, required: true },
                      { item: "Business Address", complete: !!merchant.businessAddress, required: true },
                      { item: "EIN / Tax ID", complete: !!merchant.ein, required: true },
                      { item: "Owner Information", complete: owners.length > 0, required: true },
                      { item: "Owner KYC Consent", complete: owners.some(o => o.kycConsent), required: true },
                      { item: "Government ID", complete: owners.some(o => o.governmentIdUrl), required: true },
                      { item: "Bank Account Details", complete: !!merchant.bankAccountNumber, required: true },
                      { item: "Voided Check", complete: !!merchant.voidedCheckUrl, required: true },
                      { item: "Articles of Incorporation", complete: !!merchant.articlesOfIncorporationUrl, required: true },
                      { item: "Website URL", complete: !!merchant.websiteUrl, required: true },
                      { item: "Product Description", complete: !!merchant.productDescription, required: true },
                      { item: "Processing History", complete: false, required: false },
                    ].map((doc, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center gap-2">
                          <span className={doc.complete ? "text-foreground" : "text-muted-foreground"}>
                            {doc.item}
                          </span>
                          {doc.required && !doc.complete && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                        {doc.complete ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Verification Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { check: "OFAC Sanctions Screening", status: "passed", date: "Dec 9, 2025" },
                      { check: "Business Verification", status: "passed", date: "Dec 9, 2025" },
                      { check: "Identity Verification", status: owners.some(o => o.governmentIdUrl) ? "passed" : "pending", date: owners.some(o => o.governmentIdUrl) ? "Dec 9, 2025" : null },
                      { check: "Bank Account Verification", status: merchant.voidedCheckUrl ? "passed" : "pending", date: merchant.voidedCheckUrl ? "Dec 9, 2025" : null },
                      { check: "MATCH/TMF Screening", status: "passed", date: "Dec 9, 2025" },
                    ].map((verification, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {verification.status === "passed" ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : verification.status === "failed" ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          )}
                          <span className="font-medium">{verification.check}</span>
                        </div>
                        <div className="text-right">
                          <Badge className={
                            verification.status === "passed" ? "bg-green-100 text-green-700" :
                            verification.status === "failed" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }>
                            {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                          </Badge>
                          {verification.date && (
                            <p className="text-xs text-muted-foreground mt-1">{verification.date}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Textarea
                    placeholder="Add a note about this merchant..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="mb-2"
                    data-testid="input-note"
                  />
                  <Button 
                    onClick={handleAddNote} 
                    disabled={!newNote.trim() || addNoteMutation.isPending}
                    data-testid="button-add-note"
                  >
                    {addNoteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Add Note
                  </Button>
                </div>
                
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No internal notes yet</p>
                ) : (
                  <div className="space-y-4">
                    {notes.map((note) => (
                      <div key={note.id} className="border rounded-lg p-4" data-testid={`card-note-${note.id}`}>
                        <p className="text-gray-900 whitespace-pre-wrap">{note.content}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {format(new Date(note.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
