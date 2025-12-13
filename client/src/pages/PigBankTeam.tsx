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
import { UserPlus, Users, Shield, Trash2, Loader2, Edit2, Building2 } from "lucide-react";

type PigBankTeamMember = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: string;
};

function getRoleBadge(role: string) {
  const styles: Record<string, string> = {
    pigbank_admin: "bg-[#b91c1c]/20 text-[#b91c1c] border border-[#b91c1c] dark:bg-red-900/30 dark:text-red-400 dark:border-red-700",
    pigbank_staff: "bg-[#f0b100]/20 text-[#f0b100] border border-[#f0b100] dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700",
  };
  return styles[role] || "bg-gray-100 text-gray-600 border border-gray-600 dark:bg-gray-700/30 dark:text-gray-400 dark:border-gray-600";
}

function getRoleLabel(role: string) {
  const labels: Record<string, string> = {
    pigbank_admin: "Admin",
    pigbank_staff: "Staff",
  };
  return labels[role] || role;
}

export default function PigBankTeam() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<PigBankTeamMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteFirstName, setInviteFirstName] = useState("");
  const [inviteLastName, setInviteLastName] = useState("");
  const [inviteRole, setInviteRole] = useState("pigbank_staff");
  const [editRole, setEditRole] = useState("");

  const isAdmin = (user as any)?.role === 'pigbank_admin';

  const { data: teamMembers = [], isLoading } = useQuery<PigBankTeamMember[]>({
    queryKey: ["/api/pigbank/team"],
    queryFn: async () => {
      const res = await fetch("/api/pigbank/team", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch team");
      return res.json();
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (data: { email: string; firstName?: string; lastName?: string; role: string }) => {
      const res = await fetch("/api/pigbank/team/invite", {
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
      queryClient.invalidateQueries({ queryKey: ["/api/pigbank/team"] });
      setInviteOpen(false);
      setInviteEmail("");
      setInviteFirstName("");
      setInviteLastName("");
      setInviteRole("pigbank_staff");
      toast({ 
        title: data.isNewUser ? "Invitation sent" : "Team member added",
        description: data.isNewUser 
          ? `A new account was created for ${data.user.email}.` 
          : `${data.user.email} has been added to the PigBank team.`
      });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: string }) => {
      const res = await fetch(`/api/pigbank/team/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ role }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update member");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pigbank/team"] });
      setEditingMember(null);
      toast({ title: "Role updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await fetch(`/api/pigbank/team/${memberId}`, {
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
      queryClient.invalidateQueries({ queryKey: ["/api/pigbank/team"] });
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
      role: inviteRole,
    });
  };

  const handleUpdateRole = () => {
    if (!editingMember || !editRole) return;
    updateMutation.mutate({ memberId: editingMember.id, role: editRole });
  };

  return (
    <Layout title="PigBank Team">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-pigbank-team-title">
              PigBank Team
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage PigBank staff members and administrators
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                PigBank Team Members
              </CardTitle>
              <CardDescription>
                Manage internal PigBank staff and administrators
              </CardDescription>
            </div>
            {isAdmin && (
              <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogTrigger asChild>
                  <Button data-testid="button-invite-pigbank-member">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add PigBank Team Member</DialogTitle>
                    <DialogDescription>
                      Add a new staff member or admin to the PigBank team.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleInvite} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="staff@pigbank.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        data-testid="input-pigbank-invite-email"
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
                          data-testid="input-pigbank-invite-firstname"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={inviteLastName}
                          onChange={(e) => setInviteLastName(e.target.value)}
                          data-testid="input-pigbank-invite-lastname"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Select value={inviteRole} onValueChange={setInviteRole}>
                        <SelectTrigger data-testid="select-pigbank-invite-role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pigbank_admin">Admin - Full access to all merchants</SelectItem>
                          <SelectItem value="pigbank_staff">Staff - Can view and manage merchants</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={inviteMutation.isPending} data-testid="button-send-pigbank-invite">
                        {inviteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Add Member
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
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => {
                    const isSelf = member.id === (user as any)?.id;
                    const canEdit = isAdmin && !isSelf;
                    const canRemove = isAdmin && !isSelf;
                    
                    return (
                      <TableRow key={member.id} data-testid={`row-pigbank-member-${member.id}`}>
                        <TableCell>
                          <div>
                            <p className="font-medium" data-testid={`text-pigbank-member-name-${member.id}`}>
                              {member.firstName} {member.lastName}
                              {isSelf && <span className="text-muted-foreground ml-2">(You)</span>}
                            </p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRoleBadge(member.role)} data-testid={`badge-pigbank-role-${member.id}`}>
                            {getRoleLabel(member.role)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {canEdit && (
                                <Dialog 
                                  open={editingMember?.id === member.id} 
                                  onOpenChange={(open) => {
                                    if (open) {
                                      setEditingMember(member);
                                      setEditRole(member.role);
                                    } else {
                                      setEditingMember(null);
                                    }
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" data-testid={`button-edit-pigbank-${member.id}`}>
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Role</DialogTitle>
                                      <DialogDescription>
                                        Change the role for {member.firstName} {member.lastName}
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
                                            <SelectItem value="pigbank_admin">Admin</SelectItem>
                                            <SelectItem value="pigbank_staff">Staff</SelectItem>
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
                                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" data-testid={`button-remove-pigbank-${member.id}`}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to remove {member.firstName} {member.lastName} from the PigBank team?
                                        They will lose access to the staff portal.
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
            <CardDescription>Understanding what each PigBank role can do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="bg-[#b91c1c]/20 text-[#b91c1c] border-[#b91c1c] dark:bg-red-900/30 dark:text-red-400 dark:border-red-700 mt-0.5">
                  Admin
                </Badge>
                <div>
                  <p className="font-medium">Full Access</p>
                  <p className="text-sm text-muted-foreground">
                    Can manage all merchants, approve/reject applications, manage the PigBank team, and access all settings.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="bg-[#f0b100]/20 text-[#f0b100] border-[#f0b100] dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700 mt-0.5">
                  Staff
                </Badge>
                <div>
                  <p className="font-medium">Merchant Management</p>
                  <p className="text-sm text-muted-foreground">
                    Can view merchants, review applications, and view merchant dashboards. Cannot manage other PigBank staff.
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
