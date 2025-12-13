import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Circle, Building2, Users, Banknote, Globe, FileText, ClipboardCheck, Plus, Trash2, Loader2, AlertCircle, LogOut } from "lucide-react";
import type { Merchant, MerchantOwner } from "@shared/schema";

const steps = [
  { id: "business", title: "Business Information", icon: Building2, description: "Legal business details and address" },
  { id: "owners", title: "Owners & KYC", icon: Users, description: "Beneficial owners and identity verification" },
  { id: "bank", title: "Bank & Payouts", icon: Banknote, description: "Bank account for receiving funds" },
  { id: "website", title: "Website & Products", icon: Globe, description: "Your business website and product info" },
  { id: "documents", title: "Documents", icon: FileText, description: "Upload required documentation" },
  { id: "review", title: "Review & Submit", icon: ClipboardCheck, description: "Review and submit application" },
];

const businessTypes = [
  "Sole Proprietorship",
  "Partnership",
  "LLC",
  "Corporation",
  "S-Corporation",
  "Non-Profit",
];

const mccCategories = [
  "E-commerce / Online Retail",
  "Digital Goods / Software",
  "Subscription Services",
  "Travel & Hospitality",
  "Professional Services",
  "Health & Wellness",
  "Education & Training",
  "Gaming & Entertainment",
  "Other",
];

const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
];

interface OnboardingData {
  merchant: Merchant;
  owners: MerchantOwner[];
}

export default function Onboarding() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const { setTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Merchant>>({});
  const [owners, setOwners] = useState<Partial<MerchantOwner>[]>([]);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isExiting, setIsExiting] = useState(false);
  const [profileData, setProfileData] = useState({ firstName: "", lastName: "" });
  const [profileSaveTimeout, setProfileSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Force light theme on onboarding
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  const { data, isLoading, error } = useQuery<OnboardingData>({
    queryKey: ["/api/onboarding/merchant"],
    queryFn: async () => {
      const res = await fetch("/api/onboarding/merchant", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load merchant data");
      return res.json();
    },
  });

  useEffect(() => {
    if (data?.merchant) {
      setFormData(data.merchant);
    }
    if (data?.owners) {
      setOwners(data.owners.length > 0 ? data.owners : [{ fullName: "" }]);
    }
  }, [data]);

  // Initialize profile data from user
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);


  const saveMutation = useMutation({
    mutationFn: async (merchantData: Partial<Merchant>) => {
      const res = await fetch("/api/onboarding/merchant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(merchantData),
      });
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding/merchant"] });
    },
  });

  const profileMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string }) => {
      const res = await fetch("/api/onboarding/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
  });

  const autoSaveProfile = useCallback((newData: { firstName: string; lastName: string }) => {
    if (profileSaveTimeout) clearTimeout(profileSaveTimeout);
    const timeout = setTimeout(() => {
      profileMutation.mutate(newData);
    }, 1500);
    setProfileSaveTimeout(timeout);
  }, [profileSaveTimeout, profileMutation]);

  const updateProfileField = (field: "firstName" | "lastName", value: string) => {
    const newData = { ...profileData, [field]: value };
    setProfileData(newData);
    autoSaveProfile(newData);
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/onboarding/submit", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit application");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your merchant application has been submitted for review.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding/merchant"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      // Redirect to dashboard with welcome modal
      setLocation("/?welcome=true");
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const autoSave = useCallback((newData: Partial<Merchant>) => {
    if (saveTimeout) clearTimeout(saveTimeout);
    const timeout = setTimeout(() => {
      saveMutation.mutate(newData);
    }, 1500);
    setSaveTimeout(timeout);
  }, [saveTimeout, saveMutation]);

  const updateField = (field: keyof Merchant, value: string | null) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    autoSave(newData);
  };

  const saveOwnerMutation = useMutation({
    mutationFn: async ({ owner, isNew }: { owner: Partial<MerchantOwner>; isNew: boolean }) => {
      const url = isNew ? "/api/onboarding/owners" : `/api/onboarding/owners/${owner.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(owner),
      });
      if (!res.ok) throw new Error("Failed to save owner");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding/merchant"] });
    },
  });

  const deleteOwnerMutation = useMutation({
    mutationFn: async (ownerId: string) => {
      const res = await fetch(`/api/onboarding/owners/${ownerId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete owner");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding/merchant"] });
    },
  });

  const progress = ((currentStep + 1) / steps.length) * 100;

  const isStepComplete = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0:
        return !!(formData.legalBusinessName && formData.businessAddress && formData.businessCity && formData.businessState && formData.businessZip);
      case 1:
        return owners.some(o => o.fullName && o.kycConsent);
      case 2:
        return !!(formData.bankName && formData.bankRoutingNumber && formData.bankAccountNumber);
      case 3:
        return !!(formData.websiteUrl && formData.productDescription && formData.mccCategory && formData.expectedMonthlyVolume && formData.averageTicketSize);
      case 4:
        return !!(formData.articlesOfIncorporationUrl && formData.bankVerificationDocumentUrl);
      case 5:
        return isSubmitted;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      saveMutation.mutate(formData);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Validate all required fields before submission
    if (!formData.legalBusinessName || !formData.businessAddress || !formData.businessCity || !formData.businessState || !formData.businessZip) {
      alert("Please complete all required business information fields.");
      setCurrentStep(0);
      return;
    }
    if (!owners.some(o => o.fullName && o.kycConsent)) {
      alert("Please add at least one owner with KYC consent.");
      setCurrentStep(1);
      return;
    }
    if (!formData.bankName || !formData.bankRoutingNumber || !formData.bankAccountNumber) {
      alert("Please complete all required bank information fields.");
      setCurrentStep(2);
      return;
    }
    if (!formData.websiteUrl || !formData.productDescription || !formData.mccCategory || !formData.expectedMonthlyVolume || !formData.averageTicketSize) {
      alert("Please complete all required website and product fields including expected monthly volume and average transaction size.");
      setCurrentStep(3);
      return;
    }
    if (!formData.articlesOfIncorporationUrl || !formData.bankVerificationDocumentUrl) {
      alert("Please upload all required documents before submitting your application.");
      setCurrentStep(4);
      return;
    }
    submitMutation.mutate();
  };

  const handleExit = async () => {
    setIsExiting(true);
    
    // Clear any pending auto-save timeouts
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    if (profileSaveTimeout) {
      clearTimeout(profileSaveTimeout);
    }
    
    // Save both merchant data and profile data
    // Use Promise.allSettled to ensure both saves are attempted even if one fails
    // Also skip if a mutation is already pending to avoid conflicts
    const savePromises: Promise<any>[] = [];
    
    if (!saveMutation.isPending) {
      savePromises.push(saveMutation.mutateAsync(formData).catch(() => {}));
    }
    if (!profileMutation.isPending) {
      savePromises.push(profileMutation.mutateAsync(profileData).catch(() => {}));
    }
    
    if (savePromises.length > 0) {
      await Promise.allSettled(savePromises);
    }
    
    // Log out the user so they need to sign in again to continue
    try {
      const logoutResponse = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      
      // Always clear local auth cache regardless of server response
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      if (!logoutResponse.ok) {
        console.warn("Logout request failed, but proceeding with redirect");
      }
    } catch (e) {
      // Clear local cache even if network request fails
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      console.warn("Logout error, but proceeding with redirect:", e);
    }
    
    setLocation("/landing");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(circle at center, #5aa55a 0%, #3d6b3d 35%, #1a3d1a 100%)' }}>
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(circle at center, #5aa55a 0%, #3d6b3d 35%, #1a3d1a 100%)' }}>
        <div className="text-center bg-white rounded-xl p-8 shadow-xl">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load application data. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  const isSubmitted = data?.merchant?.status === 'submitted';

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {/* Your Information Section */}
            <div className="border-b pb-6">
              <h4 className="font-medium text-gray-900 mb-4">Your Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => updateProfileField("firstName", e.target.value)}
                    placeholder="Your first name"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => updateProfileField("lastName", e.target.value)}
                    placeholder="Your last name"
                    data-testid="input-last-name"
                  />
                </div>
              </div>
            </div>

            {/* Business Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="legalBusinessName">Legal Business Name *</Label>
                <Input
                  id="legalBusinessName"
                  value={formData.legalBusinessName || ""}
                  onChange={(e) => updateField("legalBusinessName", e.target.value)}
                  placeholder="Enter your registered business name"
                  data-testid="input-legal-business-name"
                />
              </div>
              <div>
                <Label htmlFor="dba">DBA (Doing Business As)</Label>
                <Input
                  id="dba"
                  value={formData.dba || ""}
                  onChange={(e) => updateField("dba", e.target.value)}
                  placeholder="Optional trade name"
                  data-testid="input-dba"
                />
              </div>
              <div>
                <Label htmlFor="ein">EIN (Tax ID) *</Label>
                <Input
                  id="ein"
                  value={formData.ein || ""}
                  onChange={(e) => updateField("ein", e.target.value)}
                  placeholder="XX-XXXXXXX"
                  data-testid="input-ein"
                />
              </div>
              <div>
                <Label htmlFor="businessType">Business Type *</Label>
                <Select value={formData.businessType || ""} onValueChange={(v) => updateField("businessType", v)}>
                  <SelectTrigger data-testid="select-business-type">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Business Address</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="businessAddress">Street Address *</Label>
                  <Input
                    id="businessAddress"
                    value={formData.businessAddress || ""}
                    onChange={(e) => updateField("businessAddress", e.target.value)}
                    placeholder="123 Main Street, Suite 100"
                    data-testid="input-business-address"
                  />
                </div>
                <div>
                  <Label htmlFor="businessCity">City *</Label>
                  <Input
                    id="businessCity"
                    value={formData.businessCity || ""}
                    onChange={(e) => updateField("businessCity", e.target.value)}
                    placeholder="City"
                    data-testid="input-business-city"
                  />
                </div>
                <div>
                  <Label htmlFor="businessState">State *</Label>
                  <Select value={formData.businessState || ""} onValueChange={(v) => updateField("businessState", v)}>
                    <SelectTrigger data-testid="select-business-state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {usStates.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="businessZip">ZIP Code *</Label>
                  <Input
                    id="businessZip"
                    value={formData.businessZip || ""}
                    onChange={(e) => updateField("businessZip", e.target.value)}
                    placeholder="12345"
                    data-testid="input-business-zip"
                  />
                </div>
                <div>
                  <Label htmlFor="businessCountry">Country</Label>
                  <Input
                    id="businessCountry"
                    value={formData.businessCountry || "USA"}
                    onChange={(e) => updateField("businessCountry", e.target.value)}
                    disabled
                    data-testid="input-business-country"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Please provide information about all beneficial owners who own 25% or more of the business.
            </p>
            
            {owners.map((owner, index) => (
              <div key={owner.id || index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Owner {index + 1}</h4>
                  {owners.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (owner.id) {
                          deleteOwnerMutation.mutate(owner.id);
                        }
                        setOwners(owners.filter((_, i) => i !== index));
                      }}
                      data-testid={`button-remove-owner-${index}`}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name *</Label>
                    <Input
                      value={owner.fullName || ""}
                      onChange={(e) => {
                        const newOwners = [...owners];
                        newOwners[index] = { ...owner, fullName: e.target.value };
                        setOwners(newOwners);
                      }}
                      placeholder="Full legal name"
                      data-testid={`input-owner-name-${index}`}
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={owner.dateOfBirth || ""}
                      onChange={(e) => {
                        const newOwners = [...owners];
                        newOwners[index] = { ...owner, dateOfBirth: e.target.value };
                        setOwners(newOwners);
                      }}
                      data-testid={`input-owner-dob-${index}`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Home Street Address * <span className="text-gray-400 font-normal text-xs">(No PO Boxes)</span></Label>
                    <Input
                      value={owner.homeStreetAddress || ""}
                      onChange={(e) => {
                        const newOwners = [...owners];
                        newOwners[index] = { ...owner, homeStreetAddress: e.target.value };
                        setOwners(newOwners);
                      }}
                      placeholder="123 Main Street, Apt 4B"
                      data-testid={`input-owner-street-${index}`}
                    />
                  </div>
                  <div>
                    <Label>City *</Label>
                    <Input
                      value={owner.homeCity || ""}
                      onChange={(e) => {
                        const newOwners = [...owners];
                        newOwners[index] = { ...owner, homeCity: e.target.value };
                        setOwners(newOwners);
                      }}
                      placeholder="City"
                      data-testid={`input-owner-city-${index}`}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>State *</Label>
                      <Select
                        value={owner.homeState || ""}
                        onValueChange={(value) => {
                          const newOwners = [...owners];
                          newOwners[index] = { ...owner, homeState: value };
                          setOwners(newOwners);
                        }}
                      >
                        <SelectTrigger data-testid={`select-owner-state-${index}`}>
                          <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          {usStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>ZIP Code *</Label>
                      <Input
                        value={owner.homeZipCode || ""}
                        onChange={(e) => {
                          const newOwners = [...owners];
                          newOwners[index] = { ...owner, homeZipCode: e.target.value.replace(/\D/g, "").slice(0, 5) };
                          setOwners(newOwners);
                        }}
                        placeholder="12345"
                        maxLength={5}
                        data-testid={`input-owner-zip-${index}`}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Social Security Number *</Label>
                    <Input
                      value={owner.ssn || ""}
                      onChange={(e) => {
                        const newOwners = [...owners];
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                        let formatted = digits;
                        if (digits.length > 5) {
                          formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
                        } else if (digits.length > 3) {
                          formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
                        }
                        newOwners[index] = { ...owner, ssn: formatted };
                        setOwners(newOwners);
                      }}
                      placeholder="XXX-XX-XXXX"
                      maxLength={11}
                      data-testid={`input-owner-ssn-${index}`}
                    />
                  </div>
                  <div>
                    <Label>Ownership Percentage *</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={owner.ownershipPercentage || ""}
                      onChange={(e) => {
                        const newOwners = [...owners];
                        newOwners[index] = { ...owner, ownershipPercentage: e.target.value };
                        setOwners(newOwners);
                      }}
                      placeholder="25"
                      data-testid={`input-owner-percentage-${index}`}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <Label>Government-Issued Photo ID Type *</Label>
                      <Select
                        value={owner.governmentIdType || ""}
                        onValueChange={(value) => {
                          const newOwners = [...owners];
                          newOwners[index] = { ...owner, governmentIdType: value, governmentIdFrontUrl: "", governmentIdBackUrl: "" };
                          setOwners(newOwners);
                        }}
                      >
                        <SelectTrigger data-testid={`select-owner-id-type-${index}`}>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                          <SelectItem value="state_id">State ID Card</SelectItem>
                          <SelectItem value="passport">Passport</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {owner.governmentIdType && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>{owner.governmentIdType === "passport" ? "Passport Photo Page *" : "Front of ID *"}</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const newOwners = [...owners];
                                  newOwners[index] = { ...owner, governmentIdFrontUrl: file.name };
                                  setOwners(newOwners);
                                }
                              }}
                              className="flex-1"
                              data-testid={`input-owner-id-front-${index}`}
                            />
                            {owner.governmentIdFrontUrl && (
                              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                        
                        {owner.governmentIdType !== "passport" && (
                          <div>
                            <Label>Back of ID *</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const newOwners = [...owners];
                                    newOwners[index] = { ...owner, governmentIdBackUrl: file.name };
                                    setOwners(newOwners);
                                  }
                                }}
                                className="flex-1"
                                data-testid={`input-owner-id-back-${index}`}
                              />
                              {owner.governmentIdBackUrl && (
                                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`kyc-${index}`}
                    checked={owner.kycConsent || false}
                    onCheckedChange={(checked) => {
                      const newOwners = [...owners];
                      newOwners[index] = { ...owner, kycConsent: checked as boolean };
                      setOwners(newOwners);
                    }}
                    data-testid={`checkbox-kyc-consent-${index}`}
                  />
                  <Label htmlFor={`kyc-${index}`} className="text-sm text-gray-600">
                    I consent to identity verification and background checks
                  </Label>
                </div>
                
                {owner.fullName && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      saveOwnerMutation.mutate({ owner, isNew: !owner.id });
                    }}
                    disabled={saveOwnerMutation.isPending}
                    data-testid={`button-save-owner-${index}`}
                  >
                    {saveOwnerMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Save Owner Info
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              variant="outline"
              onClick={() => setOwners([...owners, { fullName: "" }])}
              className="w-full"
              data-testid="button-add-owner"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Owner
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Enter your business bank account details for receiving payouts.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input
                  id="bankName"
                  value={formData.bankName || ""}
                  onChange={(e) => updateField("bankName", e.target.value)}
                  placeholder="e.g., Chase, Bank of America"
                  data-testid="input-bank-name"
                />
              </div>
              <div>
                <Label htmlFor="bankRoutingNumber">Routing Number *</Label>
                <Input
                  id="bankRoutingNumber"
                  value={formData.bankRoutingNumber || ""}
                  onChange={(e) => updateField("bankRoutingNumber", e.target.value.replace(/\D/g, "").slice(0, 9))}
                  placeholder="9 digits"
                  maxLength={9}
                  data-testid="input-routing-number"
                />
              </div>
              <div>
                <Label htmlFor="bankAccountNumber">Account Number *</Label>
                <Input
                  id="bankAccountNumber"
                  value={formData.bankAccountNumber || ""}
                  onChange={(e) => updateField("bankAccountNumber", e.target.value.replace(/\D/g, ""))}
                  placeholder="Account number"
                  data-testid="input-account-number"
                />
              </div>
              <div>
                <Label htmlFor="bankAccountType">Account Type *</Label>
                <Select value={formData.bankAccountType || ""} onValueChange={(v) => updateField("bankAccountType", v)}>
                  <SelectTrigger data-testid="select-account-type">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="websiteUrl">Website URL *</Label>
                <Input
                  id="websiteUrl"
                  value={formData.websiteUrl || ""}
                  onChange={(e) => updateField("websiteUrl", e.target.value)}
                  placeholder="https://www.example.com"
                  data-testid="input-website-url"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="productDescription">Product/Service Description *</Label>
                <Textarea
                  id="productDescription"
                  value={formData.productDescription || ""}
                  onChange={(e) => updateField("productDescription", e.target.value)}
                  placeholder="Describe what products or services you sell..."
                  rows={4}
                  data-testid="input-product-description"
                />
              </div>
              <div>
                <Label htmlFor="mccCategory">Business Category *</Label>
                <Select value={formData.mccCategory || ""} onValueChange={(v) => updateField("mccCategory", v)}>
                  <SelectTrigger data-testid="select-mcc-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {mccCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.mccCategory === "Other" && (
                  <Input
                    className="mt-2"
                    value={formData.mccCategoryOther || ""}
                    onChange={(e) => updateField("mccCategoryOther", e.target.value)}
                    placeholder="Please describe your business category"
                    data-testid="input-mcc-category-other"
                  />
                )}
              </div>
              <div>
                <Label htmlFor="expectedMonthlyVolume">Expected Monthly Volume ($) *</Label>
                <Input
                  id="expectedMonthlyVolume"
                  type="number"
                  value={formData.expectedMonthlyVolume || ""}
                  onChange={(e) => updateField("expectedMonthlyVolume", e.target.value)}
                  placeholder="e.g., 50000"
                  data-testid="input-expected-volume"
                />
              </div>
              <div>
                <Label htmlFor="averageTicketSize">Average Transaction Size ($) *</Label>
                <Input
                  id="averageTicketSize"
                  type="number"
                  value={formData.averageTicketSize || ""}
                  onChange={(e) => updateField("averageTicketSize", e.target.value)}
                  placeholder="e.g., 75"
                  data-testid="input-average-ticket"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div 
                className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                  formData.articlesOfIncorporationUrl ? 'border-green-300 bg-green-50/50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-[#73cb43]', 'bg-[#73cb43]/5');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-[#73cb43]', 'bg-[#73cb43]/5');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-[#73cb43]', 'bg-[#73cb43]/5');
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    updateField("articlesOfIncorporationUrl", file.name);
                  }
                }}
                data-testid="dropzone-articles"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Articles of Incorporation</h4>
                    <p className="text-sm text-gray-500">LLC Operating Agreement, Corporate Bylaws, or equivalent</p>
                    <p className="text-xs text-gray-400 mt-1">Drag & drop or click to select • PDF, JPG, PNG, GIF, WebP, HEIC, BMP, TIFF</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      id="articles-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.bmp,.tiff,.tif"
                      data-testid="input-file-articles"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateField("articlesOfIncorporationUrl", file.name);
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => document.getElementById('articles-upload')?.click()}
                      data-testid="button-upload-articles"
                    >
                      {formData.articlesOfIncorporationUrl ? "Change" : "Select File"}
                    </Button>
                  </div>
                </div>
                {formData.articlesOfIncorporationUrl && (
                  <p className="text-sm text-green-600 mt-2">✓ Selected: {formData.articlesOfIncorporationUrl}</p>
                )}
              </div>
              
              <div 
                className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                  formData.bankVerificationDocumentUrl ? 'border-green-300 bg-green-50/50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('border-[#73cb43]', 'bg-[#73cb43]/5');
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-[#73cb43]', 'bg-[#73cb43]/5');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-[#73cb43]', 'bg-[#73cb43]/5');
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    updateField("bankVerificationDocumentUrl", file.name);
                  }
                }}
                data-testid="dropzone-bank-verification"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium">Bank Account Verification</h4>
                    <p className="text-sm text-gray-500 mt-1">Upload one of the following to verify the account where payouts will be sent:</p>
                    <ul className="text-sm text-gray-500 mt-2 space-y-1 list-disc list-inside">
                      <li>Bank statement (first page only)</li>
                      <li>Online banking screenshot showing business name, routing number, and account number</li>
                      <li>Bank letter with account details</li>
                      <li>Voided business check</li>
                    </ul>
                    <p className="text-xs text-gray-400 mt-2">Drag & drop or click to select • PDF, JPG, PNG, GIF, WebP, HEIC, BMP, TIFF</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <input
                      type="file"
                      id="bank-verification-upload"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.bmp,.tiff,.tif"
                      data-testid="input-file-bank-verification"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          updateField("bankVerificationDocumentUrl", file.name);
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => document.getElementById('bank-verification-upload')?.click()}
                      data-testid="button-upload-bank-verification"
                    >
                      {formData.bankVerificationDocumentUrl ? "Change" : "Select File"}
                    </Button>
                  </div>
                </div>
                {formData.bankVerificationDocumentUrl && (
                  <p className="text-sm text-green-600 mt-2">✓ Selected: {formData.bankVerificationDocumentUrl}</p>
                )}
              </div>
            </div>
            
            <div className="bg-[#73cb43]/20 border border-[#39870E] rounded-lg p-4">
              <p className="text-sm text-green-700">
                <strong>Additional verification:</strong> After you submit your application, PigBank will send two small micro-deposits to your bank account. You'll confirm these amounts in your dashboard to complete bank verification.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium mb-4">Application Summary</h4>
              
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-500">Business Name:</span>
                  <span className="font-medium">{formData.legalBusinessName || "-"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-500">DBA:</span>
                  <span className="font-medium">{formData.dba || "-"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-500">Business Type:</span>
                  <span className="font-medium">{formData.businessType || "-"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-500">Address:</span>
                  <span className="font-medium">
                    {formData.businessAddress ? `${formData.businessAddress}, ${formData.businessCity}, ${formData.businessState} ${formData.businessZip}` : "-"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-500">Website:</span>
                  <span className="font-medium">{formData.websiteUrl || "-"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-500">Bank:</span>
                  <span className="font-medium">{formData.bankName || "-"}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-gray-500">Owners:</span>
                  <span className="font-medium">{owners.filter(o => o.fullName).map(o => o.fullName).join(", ") || "-"}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-[#73cb43]/20 border border-[#39870E] rounded-lg p-4">
              <p className="text-sm text-green-700">
                By submitting this application, you certify that all information provided is accurate and complete.
                You authorize PigBank to verify the information and conduct necessary background checks.
              </p>
              <p className="text-sm text-green-700 mt-3">
                By clicking "Submit Application", you agree to our{" "}
                <a 
                  href="/terms" 
                  target="_blank" 
                  className="text-[#39870E] hover:underline font-medium"
                  data-testid="link-terms"
                >
                  Terms of Service
                </a>
                {" "}and{" "}
                <a 
                  href="/privacy" 
                  target="_blank" 
                  className="text-[#39870E] hover:underline font-medium"
                  data-testid="link-privacy"
                >
                  Privacy Policy
                </a>.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(circle at center, #5aa55a 0%, #3d6b3d 35%, #1a3d1a 100%)' }}>
      <header className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={() => setLocation("/landing")} className="cursor-pointer bg-transparent border-0 p-0">
            <img src="/pig-bank-logo-dark.png" alt="PigBank" className="h-12" data-testid="logo-onboarding" />
          </button>
          <div className="flex items-center gap-4">
            {saveMutation.isPending && (
              <span className="text-sm text-white/70 flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </span>
            )}
            <Button
              onClick={handleExit}
              disabled={isExiting}
              className="bg-[#73cb43] hover:bg-[#65b53b] text-white px-6 border-0 ring-0 outline-none focus:ring-0 focus-visible:ring-0"
              data-testid="button-exit-onboarding"
            >
              {isExiting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save & Exit
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white" data-testid="text-onboarding-title">
            Complete Your Merchant Application
          </h1>
          <p className="text-white/70 mt-1">
            Follow the steps below to activate your merchant account
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-1">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isComplete = isStepComplete(index);
                    const isCurrent = index === currentStep;
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(index)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          isCurrent
                            ? "bg-[#73cb43]/10 text-[#73cb43]"
                            : isComplete
                            ? "text-gray-900 hover:bg-gray-50"
                            : "text-gray-400 hover:bg-gray-50"
                        }`}
                        data-testid={`button-step-${step.id}`}
                      >
                        {isComplete && !isCurrent ? (
                          <CheckCircle className="h-5 w-5 text-[#73cb43]" />
                        ) : isCurrent ? (
                          <StepIcon className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                        <span className="text-sm font-medium">{step.title}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <CardTitle className="mt-4">{steps[currentStep].title}</CardTitle>
                <CardDescription>{steps[currentStep].description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[300px]">
                  {renderStepContent()}
                </div>

                <div className="flex justify-between mt-6 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    data-testid="button-prev-step"
                  >
                    Previous
                  </Button>
                  {currentStep === steps.length - 1 ? (
                    <Button
                      onClick={handleSubmit}
                      disabled={submitMutation.isPending || isSubmitted}
                      className="bg-[#73cb43] hover:bg-[#65b53b]"
                      data-testid="button-submit-application"
                    >
                      {submitMutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      {isSubmitted ? "Application Submitted" : "Submit Application"}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNext}
                      disabled={isSubmitted}
                      className="bg-[#73cb43] hover:bg-[#65b53b]"
                      data-testid="button-next-step"
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
