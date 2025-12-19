import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, EyeOff, Plus, Upload, FileText, ChevronDown, ChevronRight, ExternalLink, UserPlus, Users, Shield, Trash2, Loader2, Edit2, Code, Plug, Download, Copy, Key, RefreshCw } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMerchantView } from "@/hooks/useMerchantView";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TeamMember = {
  id: string;
  userId: string;
  merchantId: string;
  merchantRole: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
};

function getRoleBadge(role: string) {
  const styles: Record<string, string> = {
    owner: "bg-[#73cb43]/20 text-[#39870E] border border-[#39870E] dark:bg-green-900/30 dark:text-green-400 dark:border-green-700",
    manager: "bg-blue-100 text-blue-700 border border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700",
    staff: "bg-purple-100 text-purple-700 border border-purple-700 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700",
  };
  return styles[role] || "bg-purple-100 text-purple-700 border border-purple-700";
}

function getRoleLabel(role: string) {
  const labels: Record<string, string> = {
    owner: "Owner",
    manager: "Manager",
    staff: "Staff",
  };
  return labels[role] || role;
}

function DocumentItem({ 
  title, 
  description, 
  status, 
  agreementLink, 
  agreementText,
  uploadedFileName,
  uploadedDate
}: { 
  title: string; 
  description: string; 
  status: "pending" | "approved" | "rejected" | "required";
  agreementLink?: string;
  agreementText?: string;
  uploadedFileName?: string;
  uploadedDate?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  const statusColors = {
    pending: "text-yellow-600 dark:text-yellow-500",
    approved: "text-green-600 dark:text-green-500",
    rejected: "text-red-600 dark:text-red-500",
    required: "text-orange-600 dark:text-orange-500",
  };
  
  const statusLabels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    required: "Required",
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className="flex items-center justify-between px-4 py-3 border-t hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            <span className="font-medium text-left">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${statusColors[status]}`}>
              • {statusLabels[status]}
            </span>
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-10 py-3 bg-muted/30 border-t space-y-3">
          <p className="text-sm text-muted-foreground">{description}</p>
          
          {uploadedFileName && (
            <div className="flex items-center justify-between p-3 bg-background border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{uploadedFileName}</p>
                  {uploadedDate && (
                    <p className="text-xs text-muted-foreground">Uploaded {uploadedDate}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" data-testid={`button-view-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="ghost" size="sm" data-testid={`button-replace-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Upload className="h-4 w-4 mr-1" />
                  Replace
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" data-testid={`button-delete-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" data-testid={`button-upload-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            {agreementLink && agreementText && (
              <a 
                href={agreementLink} 
                className="text-sm text-primary hover:underline"
                data-testid={`link-agreement-${title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {agreementText}
              </a>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function AdminConsole() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { viewingMerchant, isViewingMerchant } = useMerchantView();
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteFirstName, setInviteFirstName] = useState("");
  const [inviteLastName, setInviteLastName] = useState("");
  const [inviteRole, setInviteRole] = useState("staff");
  const [editRole, setEditRole] = useState("");
  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("account");
  const [showApiKey, setShowApiKey] = useState(false);

  // Handle URL query params for tab switching
  useEffect(() => {
    const params = new URLSearchParams(searchString);
    const tab = params.get("tab");
    if (tab && ["account", "users", "documents", "billing", "invoices", "developers", "integrations", "import"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchString]);

  const teamEndpoint = isViewingMerchant && viewingMerchant
    ? `/api/staff/merchants/${viewingMerchant.id}/team`
    : "/api/merchant/team";

  const { data: teamMembers = [], isLoading: isLoadingTeam } = useQuery<TeamMember[]>({
    queryKey: [teamEndpoint],
    queryFn: async () => {
      const res = await fetch(teamEndpoint, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch team");
      return res.json();
    },
  });

  // Fetch merchant data for business profile
  const { data: merchantData } = useQuery<{ merchant: any }>({
    queryKey: ["/api/onboarding/merchant"],
    queryFn: async () => {
      const res = await fetch("/api/onboarding/merchant", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch merchant");
      return res.json();
    },
    enabled: !isViewingMerchant && !!user?.merchantId,
  });

  const currentUserMember = teamMembers.find(m => m.userId === (user as any)?.id);
  const canManageTeam = !isViewingMerchant && (currentUserMember?.merchantRole === 'owner' || currentUserMember?.merchantRole === 'manager');
  const isOwner = currentUserMember?.merchantRole === 'owner';

  const inviteMutation = useMutation({
    mutationFn: async (data: { email: string; firstName?: string; lastName?: string; merchantRole: string }) => {
      const res = await fetch("/api/merchant/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to invite member");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [teamEndpoint] });
      setInviteOpen(false);
      setInviteEmail("");
      setInviteFirstName("");
      setInviteLastName("");
      setInviteRole("staff");
      toast({ 
        title: data.isNewUser ? "Invitation sent" : "User added",
        description: data.isNewUser 
          ? `A new account was created for ${data.user.email}.` 
          : `${data.user.email} has been added.`
      });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ memberId, merchantRole }: { memberId: string; merchantRole: string }) => {
      const res = await fetch(`/api/merchant/team/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ merchantRole }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update member");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [teamEndpoint] });
      setEditingMember(null);
      toast({ title: "Role updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await fetch(`/api/merchant/team/${memberId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to remove member");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [teamEndpoint] });
      toast({ title: "User removed" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    inviteMutation.mutate({
      email: inviteEmail.trim(),
      firstName: inviteFirstName.trim() || undefined,
      lastName: inviteLastName.trim() || undefined,
      merchantRole: inviteRole,
    });
  };

  const handleUpdateRole = () => {
    if (!editingMember || !editRole) return;
    updateMutation.mutate({ memberId: editingMember.id, merchantRole: editRole });
  };

  return (
    <Layout title="Admin Console">
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-admin-title">
              Admin Console
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full h-auto bg-[#203e22] dark:bg-[#262626] p-1 grid grid-cols-4 md:grid-cols-7 gap-1">
            <TabsTrigger value="account" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white" data-testid="tab-account">Account</TabsTrigger>
            <TabsTrigger value="users" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white" data-testid="tab-users">Users</TabsTrigger>
            <TabsTrigger value="documents" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white" data-testid="tab-documents">Documents</TabsTrigger>
            <TabsTrigger value="billing" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white" data-testid="tab-billing">Billing</TabsTrigger>
            <TabsTrigger value="developers" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white" data-testid="tab-developers">Developers</TabsTrigger>
            <TabsTrigger value="integrations" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white" data-testid="tab-integrations">Integrations</TabsTrigger>
            <TabsTrigger value="import" className="text-white data-[state=active]:bg-[#73cb43] data-[state=active]:text-white" data-testid="tab-import">Data Import</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input id="firstName" defaultValue={(user as any)?.firstName || ""} data-testid="input-firstName" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input id="lastName" defaultValue={(user as any)?.lastName || ""} data-testid="input-lastName" />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Personal email</Label>
                        <Input id="email" type="email" defaultValue={(user as any)?.email || ""} data-testid="input-email" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <Input id="phone" placeholder="+1 (555) 000-0000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ssn">Social security no.</Label>
                        <Input id="ssn" placeholder="###-##-####" type="password" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address1">Address 1</Label>
                      <Input id="address1" placeholder="Street address" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address2">Address 2</Label>
                        <Input id="address2" placeholder="Apt, suite, etc." />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" placeholder="City" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Province/State</Label>
                        <Input id="state" placeholder="State" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zip">Zip code</Label>
                        <Input id="zip" placeholder="00000" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" defaultValue="United States of America" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <Label>Profile Image</Label>
                    <div className="relative group cursor-pointer" data-testid="button-upload-avatar">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={(user as any)?.profileImageUrl} />
                        <AvatarFallback className="text-2xl">
                          {merchantData?.merchant?.legalBusinessName?.[0] || merchantData?.merchant?.dba?.[0] || "M"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company name</Label>
                    <Input id="companyName" defaultValue={merchantData?.merchant?.legalBusinessName || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dba">DBA / Trade name (if different from company name)</Label>
                    <Input id="dba" defaultValue={merchantData?.merchant?.dba || ""} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input id="websiteUrl" defaultValue={merchantData?.merchant?.websiteUrl || ""} />
                </div>
                <Button className="bg-primary hover:bg-primary/90" data-testid="button-save-business">Save</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credentials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue={(user as any)?.email || ""} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        defaultValue="••••••••••••••••" 
                        disabled 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password Setting</CardTitle>
                <CardDescription>Change your current password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Old password</Label>
                    <Input id="oldPassword" type="password" placeholder="Old password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New password</Label>
                    <Input id="newPassword" type="password" placeholder="New password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Repeat new password</Label>
                    <Input id="confirmPassword" type="password" placeholder="Repeat new password" />
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90" data-testid="button-save-password">Save</Button>
              </CardContent>
            </Card>

          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Users
                  </CardTitle>
                  <CardDescription>
                    Manage users and their access levels
                  </CardDescription>
                </div>
                {canManageTeam && (
                  <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-invite-member">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite User</DialogTitle>
                        <DialogDescription>
                          Add a new user. If they don't have an account, one will be created.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleInvite} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="inviteEmail">Email Address *</Label>
                          <Input
                            id="inviteEmail"
                            type="email"
                            placeholder="user@example.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            required
                            data-testid="input-invite-email"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="inviteFirstName">First Name</Label>
                            <Input
                              id="inviteFirstName"
                              placeholder="John"
                              value={inviteFirstName}
                              onChange={(e) => setInviteFirstName(e.target.value)}
                              data-testid="input-invite-firstname"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="inviteLastName">Last Name</Label>
                            <Input
                              id="inviteLastName"
                              placeholder="Doe"
                              value={inviteLastName}
                              onChange={(e) => setInviteLastName(e.target.value)}
                              data-testid="input-invite-lastname"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="inviteRole">Role</Label>
                          <Select value={inviteRole} onValueChange={setInviteRole}>
                            <SelectTrigger data-testid="select-invite-role">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {isOwner && <SelectItem value="owner">Owner - Full access</SelectItem>}
                              <SelectItem value="manager">Manager - Can manage users and settings</SelectItem>
                              <SelectItem value="staff">Staff - Limited access</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={inviteMutation.isPending} data-testid="button-send-invite">
                            {inviteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Send Invite
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </CardHeader>
              <CardContent>
                {isLoadingTeam ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : teamMembers.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No users yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Added</TableHead>
                        {canManageTeam && <TableHead className="text-right">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member) => {
                        const isSelf = member.userId === (user as any)?.id;
                        const canEdit = canManageTeam && !isSelf && (isOwner || member.merchantRole !== 'owner');
                        const canRemove = canManageTeam && !isSelf && (isOwner || member.merchantRole !== 'owner');
                        
                        return (
                          <TableRow key={member.id} data-testid={`row-member-${member.id}`}>
                            <TableCell>
                              <div>
                                <p className="font-medium" data-testid={`text-member-name-${member.id}`}>
                                  {member.user.firstName} {member.user.lastName}
                                  {isSelf && <span className="text-muted-foreground ml-2">(You)</span>}
                                </p>
                                <p className="text-sm text-muted-foreground">{member.user.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getRoleBadge(member.merchantRole)} data-testid={`badge-role-${member.id}`}>
                                {getRoleLabel(member.merchantRole)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(member.createdAt).toLocaleDateString()}
                            </TableCell>
                            {canManageTeam && (
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {canEdit && (
                                    <Dialog 
                                      open={editingMember?.id === member.id} 
                                      onOpenChange={(open) => {
                                        if (open) {
                                          setEditingMember(member);
                                          setEditRole(member.merchantRole);
                                        } else {
                                          setEditingMember(null);
                                        }
                                      }}
                                    >
                                      <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" data-testid={`button-edit-${member.id}`}>
                                          <Edit2 className="h-4 w-4" />
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent>
                                        <DialogHeader>
                                          <DialogTitle>Edit Role</DialogTitle>
                                          <DialogDescription>
                                            Change the role for {member.user.firstName} {member.user.lastName}
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                          <div className="space-y-2">
                                            <Label>Role</Label>
                                            <Select value={editRole} onValueChange={setEditRole}>
                                              <SelectTrigger>
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {isOwner && <SelectItem value="owner">Owner</SelectItem>}
                                                <SelectItem value="manager">Manager</SelectItem>
                                                <SelectItem value="staff">Staff</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                        <DialogFooter>
                                          <Button variant="outline" onClick={() => setEditingMember(null)}>
                                            Cancel
                                          </Button>
                                          <Button onClick={handleUpdateRole} disabled={updateMutation.isPending}>
                                            {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                            Save
                                          </Button>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                  {canRemove && (
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" data-testid={`button-remove-${member.id}`}>
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Remove User</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to remove {member.user.firstName} {member.user.lastName}?
                                            They will lose access to this account.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            className="bg-red-600 hover:bg-red-700"
                                            onClick={() => removeMutation.mutate(member.id)}
                                          >
                                            Remove
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  )}
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Role Permissions</CardTitle>
                <CardDescription>Understanding what each role can do</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-[100px_1fr] items-start gap-3">
                    <Badge variant="outline" className="bg-[#73cb43]/20 text-[#39870E] border-[#39870E] dark:bg-green-900/30 dark:text-green-400 dark:border-green-700 justify-center">
                      Owner
                    </Badge>
                    <div>
                      <p className="font-medium">Admin Console Access</p>
                      <p className="text-sm text-muted-foreground">
                        Can manage the Admin Console including users, billing, integrations, and all account settings.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-start gap-3">
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700 justify-center">
                      Manager
                    </Badge>
                    <div>
                      <p className="font-medium">Operations Access</p>
                      <p className="text-sm text-muted-foreground">
                        Can manage everything outside of the Admin Console including transactions, customers, invoices, and payouts.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] items-start gap-3">
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-700 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700 justify-center">
                      Staff
                    </Badge>
                    <div>
                      <p className="font-medium">View & Refund Access</p>
                      <p className="text-sm text-muted-foreground">
                        Can view transactions and issue refunds. Cannot access Admin Console or manage other settings.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Supporting Documents</CardTitle>
                <CardDescription>View and manage your PigBank agreements, contracts, and required documents.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-[#203e22] text-white px-4 py-3 grid grid-cols-2 rounded-t-lg">
                    <span className="font-medium text-sm">NECESSARY ITEMS</span>
                    <span className="font-medium text-sm text-right">STATUS</span>
                  </div>
                  
                  <DocumentItem
                    title="Government ID"
                    description="Driver's License, Passport, or any Photo ID. Must be issued by a government entity, in date (not expired), legible, and contain a photo."
                    status="pending"
                    uploadedFileName="drivers_license.pdf"
                    uploadedDate="January 15, 2025"
                  />
                  
                  <DocumentItem
                    title="Voided Check or Bank Letter"
                    description="Document verifying your bank account information for payouts."
                    status="pending"
                    uploadedFileName="voided_check.pdf"
                    uploadedDate="January 15, 2025"
                  />
                  
                  <DocumentItem
                    title="Business License"
                    description="Valid business license or registration document."
                    status="pending"
                    uploadedFileName="business_license.pdf"
                    uploadedDate="January 15, 2025"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agreements & Contracts</CardTitle>
                <CardDescription>Your signed agreements with PigBank.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Merchant Processing Agreement</p>
                      <p className="text-sm text-muted-foreground">Accepted on January 15, 2025</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-view-agreement">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Terms of Service</p>
                      <p className="text-sm text-muted-foreground">Accepted on January 15, 2025</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-view-tos">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Privacy Policy</p>
                      <p className="text-sm text-muted-foreground">Accepted on January 15, 2025</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-view-privacy">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>View your current plan and usage.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#73cb43]/10 border border-[#73cb43]/30 rounded-lg">
                  <div>
                    <p className="font-semibold text-lg">Basic Plan</p>
                    <p className="text-sm text-muted-foreground">Free</p>
                  </div>
                  <Badge className="bg-[#73cb43] text-white">Active</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">3.5%</p>
                    <p className="text-sm text-muted-foreground">Transaction Rate</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">$0.35</p>
                    <p className="text-sm text-muted-foreground">Per Transaction</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold">Unlimited</p>
                    <p className="text-sm text-muted-foreground">Transactions</p>
                  </div>
                </div>
                <Button variant="outline" className="mt-4">Upgrade Plan</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment methods for subscription billing.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/25</p>
                    </div>
                  </div>
                  <Badge variant="outline">Default</Badge>
                </div>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="developers" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  API Keys
                </CardTitle>
                <CardDescription>Manage your API keys for integrating with PigBank's payment processing services.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                    <div className="space-y-1">
                      <p className="font-medium">Live API Key</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-background px-2 py-1 rounded font-mono">
                          {showApiKey ? "pk_live_xxxxxxxxxxxxxxxxxxxx" : "pk_live_••••••••••••••••••••"}
                        </code>
                        <Button variant="ghost" size="icon" onClick={() => setShowApiKey(!showApiKey)}>
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => {
                          navigator.clipboard.writeText("pk_live_xxxxxxxxxxxxxxxxxxxx");
                          toast({ title: "Copied", description: "API key copied to clipboard" });
                        }}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                    <div className="space-y-1">
                      <p className="font-medium">Test API Key</p>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-background px-2 py-1 rounded font-mono">
                          pk_test_xxxxxxxxxxxxxxxxxxxx
                        </code>
                        <Button variant="ghost" size="icon" onClick={() => {
                          navigator.clipboard.writeText("pk_test_xxxxxxxxxxxxxxxxxxxx");
                          toast({ title: "Copied", description: "Test key copied to clipboard" });
                        }}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Webhooks</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded border">
                      <div>
                        <p className="text-sm font-medium">https://yoursite.com/webhooks/pigbank</p>
                        <p className="text-xs text-muted-foreground">All events</p>
                      </div>
                      <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">Active</Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Webhook Endpoint
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>Access our API documentation and SDKs.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <a href="#" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <FileText className="h-8 w-8 text-[#73cb43]" />
                    <div>
                      <p className="font-medium">REST API Reference</p>
                      <p className="text-sm text-muted-foreground">Complete API documentation</p>
                    </div>
                    <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                  </a>
                  <a href="#" className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Code className="h-8 w-8 text-[#73cb43]" />
                    <div>
                      <p className="font-medium">SDKs & Libraries</p>
                      <p className="text-sm text-muted-foreground">Node.js, Python, PHP, Ruby</p>
                    </div>
                    <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6 mt-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Integrations</h2>
              <p className="text-muted-foreground mt-1">Connect your favorite apps and services to streamline your workflow</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Wix - Available */}
              <Card className="flex flex-col border-border shadow-sm transition-all duration-200 hover:shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0C6EFC] to-[#5C4EE5] flex items-center justify-center text-white font-bold text-xl shadow-sm">
                      W
                    </div>
                  </div>
                  <CardTitle className="text-lg">Wix</CardTitle>
                  <CardDescription className="line-clamp-2 h-10">
                    Connect your Wix store to accept payments through PigBank's secure payment gateway.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md bg-muted/50 border border-border text-foreground/80">E-commerce</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-muted/5">
                  <Button className="w-full bg-[#73cb43] hover:bg-[#65b53b] text-white" onClick={() => setLocation("/integrations/wix")}>
                    Connect
                  </Button>
                </CardFooter>
              </Card>

              {/* QuickBooks Online - Coming Soon */}
              <Card className="flex flex-col border-border shadow-sm transition-all duration-200 bg-muted/30">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-12 h-12 rounded-lg bg-[#2CA01C] flex items-center justify-center text-white font-bold text-xl shadow-sm grayscale opacity-50">
                      Q
                    </div>
                  </div>
                  <CardTitle className="text-lg">QuickBooks Online</CardTitle>
                  <CardDescription className="line-clamp-2 h-10 text-foreground/70">
                    Automatically sync sales receipts, invoices, and customer data to your QuickBooks Online account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md bg-muted/50 border border-border text-foreground/80">Accounting</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-muted/5">
                  <div className="w-full text-center">
                    <p className="text-xs text-foreground/60 mb-2">Coming soon</p>
                    <Button className="w-full" variant="outline" size="sm">
                      Request This Integration
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* Xero - Coming Soon */}
              <Card className="flex flex-col border-border shadow-sm transition-all duration-200 bg-muted/30">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-12 h-12 rounded-lg bg-[#13B5EA] flex items-center justify-center text-white font-bold text-xl shadow-sm grayscale opacity-50">
                      X
                    </div>
                  </div>
                  <CardTitle className="text-lg">Xero</CardTitle>
                  <CardDescription className="line-clamp-2 h-10 text-foreground/70">
                    Seamlessly reconcile transactions and manage your business finances with Xero integration.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md bg-muted/50 border border-border text-foreground/80">Accounting</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-muted/5">
                  <div className="w-full text-center">
                    <p className="text-xs text-foreground/60 mb-2">Coming soon</p>
                    <Button className="w-full" variant="outline" size="sm">
                      Request This Integration
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* Shopify - Coming Soon */}
              <Card className="flex flex-col border-border shadow-sm transition-all duration-200 bg-muted/30">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-12 h-12 rounded-lg bg-[#95BF47] flex items-center justify-center text-white font-bold text-xl shadow-sm grayscale opacity-50">
                      S
                    </div>
                  </div>
                  <CardTitle className="text-lg">Shopify</CardTitle>
                  <CardDescription className="line-clamp-2 h-10 text-foreground/70">
                    Accept payments on your Shopify store using our secure payment gateway.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md bg-muted/50 border border-border text-foreground/80">E-commerce</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-muted/5">
                  <div className="w-full text-center">
                    <p className="text-xs text-foreground/60 mb-2">Coming soon</p>
                    <Button className="w-full" variant="outline" size="sm">
                      Request This Integration
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* WooCommerce - Coming Soon */}
              <Card className="flex flex-col border-border shadow-sm transition-all duration-200 bg-muted/30">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-12 h-12 rounded-lg bg-[#96588A] flex items-center justify-center text-white font-bold text-xl shadow-sm grayscale opacity-50">
                      W
                    </div>
                  </div>
                  <CardTitle className="text-lg">WooCommerce</CardTitle>
                  <CardDescription className="line-clamp-2 h-10 text-foreground/70">
                    The most customizable eCommerce platform for building your online business.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md bg-muted/50 border border-border text-foreground/80">E-commerce</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-muted/5">
                  <div className="w-full text-center">
                    <p className="text-xs text-foreground/60 mb-2">Coming soon</p>
                    <Button className="w-full" variant="outline" size="sm">
                      Request This Integration
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* Slack - Coming Soon */}
              <Card className="flex flex-col border-border shadow-sm transition-all duration-200 bg-muted/30">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-12 h-12 rounded-lg bg-[#4A154B] flex items-center justify-center text-white font-bold text-xl shadow-sm grayscale opacity-50">
                      S
                    </div>
                  </div>
                  <CardTitle className="text-lg">Slack</CardTitle>
                  <CardDescription className="line-clamp-2 h-10 text-foreground/70">
                    Get real-time notifications for payments, disputes, and daily summaries in your team's channel.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md bg-muted/50 border border-border text-foreground/80">Communication</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-muted/5">
                  <div className="w-full text-center">
                    <p className="text-xs text-foreground/60 mb-2">Coming soon</p>
                    <Button className="w-full" variant="outline" size="sm">
                      Request This Integration
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* Zapier - Coming Soon */}
              <Card className="flex flex-col border-border shadow-sm transition-all duration-200 bg-muted/30">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-12 h-12 rounded-lg bg-[#FF4F00] flex items-center justify-center text-white font-bold text-xl shadow-sm grayscale opacity-50">
                      Z
                    </div>
                  </div>
                  <CardTitle className="text-lg">Zapier</CardTitle>
                  <CardDescription className="line-clamp-2 h-10 text-foreground/70">
                    Connect with 5,000+ apps to automate your workflows without writing any code.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md bg-muted/50 border border-border text-foreground/80">Automation</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-muted/5">
                  <div className="w-full text-center">
                    <p className="text-xs text-foreground/60 mb-2">Coming soon</p>
                    <Button className="w-full" variant="outline" size="sm">
                      Request This Integration
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* Mailchimp - Coming Soon */}
              <Card className="flex flex-col border-border shadow-sm transition-all duration-200 bg-muted/30">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-12 h-12 rounded-lg bg-[#FFE01B] flex items-center justify-center text-black font-bold text-xl shadow-sm grayscale opacity-50">
                      M
                    </div>
                  </div>
                  <CardTitle className="text-lg">Mailchimp</CardTitle>
                  <CardDescription className="line-clamp-2 h-10 text-foreground/70">
                    Sync customer emails from transactions to your marketing lists automatically.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md bg-muted/50 border border-border text-foreground/80">Marketing</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-muted/5">
                  <div className="w-full text-center">
                    <p className="text-xs text-foreground/60 mb-2">Coming soon</p>
                    <Button className="w-full" variant="outline" size="sm">
                      Request This Integration
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* HubSpot - Coming Soon */}
              <Card className="flex flex-col border-border shadow-sm transition-all duration-200 bg-muted/30">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-12 h-12 rounded-lg bg-[#FF7A59] flex items-center justify-center text-white font-bold text-xl shadow-sm grayscale opacity-50">
                      H
                    </div>
                  </div>
                  <CardTitle className="text-lg">HubSpot</CardTitle>
                  <CardDescription className="line-clamp-2 h-10 text-foreground/70">
                    Create contacts and deals in HubSpot CRM from your payment activities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-1 rounded-md bg-muted/50 border border-border text-foreground/80">CRM</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t bg-muted/5">
                  <div className="w-full text-center">
                    <p className="text-xs text-foreground/60 mb-2">Coming soon</p>
                    <Button className="w-full" variant="outline" size="sm">
                      Request This Integration
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Data Import
                </CardTitle>
                <CardDescription>Import your existing customer and transaction data from other platforms.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h4 className="font-medium mb-2">Upload CSV File</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop your file here, or click to browse
                  </p>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Supported Import Types</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Users className="h-5 w-5 text-[#73cb43]" />
                      <div>
                        <p className="font-medium text-sm">Customers</p>
                        <p className="text-xs text-muted-foreground">Names, emails, addresses</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="h-5 w-5 text-[#73cb43]" />
                      <div>
                        <p className="font-medium text-sm">Transactions</p>
                        <p className="text-xs text-muted-foreground">Historical payment records</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <FileText className="h-5 w-5 text-[#73cb43]" />
                      <div>
                        <p className="font-medium text-sm">Invoices</p>
                        <p className="text-xs text-muted-foreground">Open and paid invoices</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Key className="h-5 w-5 text-[#73cb43]" />
                      <div>
                        <p className="font-medium text-sm">Subscriptions</p>
                        <p className="text-xs text-muted-foreground">Recurring payment plans</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Import History</h4>
                  <p className="text-sm text-muted-foreground">No imports have been performed yet.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
