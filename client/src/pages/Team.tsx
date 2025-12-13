import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useMerchantView } from "@/hooks/useMerchantView";
import { UserPlus, Users, Shield, Trash2, Loader2, Edit2 } from "lucide-react";

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
    owner: "bg-purple-100 text-purple-700",
    manager: "bg-blue-100 text-blue-700",
    staff: "bg-gray-100 text-gray-700",
  };
  return styles[role] || "bg-gray-100 text-gray-700";
}

function getRoleLabel(role: string) {
  const labels: Record<string, string> = {
    owner: "Owner",
    manager: "Manager",
    staff: "Staff",
  };
  return labels[role] || role;
}

export default function Team() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { viewingMerchant, isViewingMerchant } = useMerchantView();
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteFirstName, setInviteFirstName] = useState("");
  const [inviteLastName, setInviteLastName] = useState("");
  const [inviteRole, setInviteRole] = useState("staff");
  const [editRole, setEditRole] = useState("");

  // Use staff endpoint when viewing a merchant, otherwise use merchant endpoint
  const teamEndpoint = isViewingMerchant && viewingMerchant
    ? `/api/staff/merchants/${viewingMerchant.id}/team`
    : "/api/merchant/team";

  const { data: teamMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: [teamEndpoint],
    queryFn: async () => {
      const res = await fetch(teamEndpoint, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch team");
      return res.json();
    },
  });

  const currentUserMember = teamMembers.find(m => m.userId === (user as any)?.id);
  // Disable team management when viewing another merchant
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
        title: data.isNewUser ? "Invitation sent" : "Team member added",
        description: data.isNewUser 
          ? `A new account was created for ${data.user.email}. They will need to set their password.` 
          : `${data.user.email} has been added to your team.`
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
      toast({ title: "Team member removed" });
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
    <Layout title="Team">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-team-title">
              Team
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your team members and their access levels
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription>
                View and manage team member roles
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
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                      Add a new member to your team. If they don't have an account, one will be created for them.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleInvite} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="member@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        data-testid="input-invite-email"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={inviteFirstName}
                          onChange={(e) => setInviteFirstName(e.target.value)}
                          data-testid="input-invite-firstname"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={inviteLastName}
                          onChange={(e) => setInviteLastName(e.target.value)}
                          data-testid="input-invite-lastname"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger data-testid="select-invite-role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {isOwner && <SelectItem value="owner">Owner - Full access</SelectItem>}
                          <SelectItem value="manager">Manager - Can manage team and settings</SelectItem>
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
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No team members yet</p>
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
                            <Shield className="h-3 w-3 mr-1" />
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
                                      <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to remove {member.user.firstName} {member.user.lastName} from your team?
                                        They will lose access to this merchant account.
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

        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>Understanding what each role can do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="bg-purple-100 text-purple-700 mt-0.5">
                  <Shield className="h-3 w-3 mr-1" />
                  Owner
                </Badge>
                <div>
                  <p className="font-medium">Full Access</p>
                  <p className="text-sm text-muted-foreground">
                    Can manage all settings, team members, transactions, and account details. Can invite other owners.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="bg-blue-100 text-blue-700 mt-0.5">
                  <Shield className="h-3 w-3 mr-1" />
                  Manager
                </Badge>
                <div>
                  <p className="font-medium">Team & Operations</p>
                  <p className="text-sm text-muted-foreground">
                    Can invite managers and staff, view transactions, manage customer data, and access most features.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="bg-gray-100 text-gray-700 mt-0.5">
                  <Shield className="h-3 w-3 mr-1" />
                  Staff
                </Badge>
                <div>
                  <p className="font-medium">Limited Access</p>
                  <p className="text-sm text-muted-foreground">
                    Can view transactions and basic account information. Cannot manage team or change settings.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
