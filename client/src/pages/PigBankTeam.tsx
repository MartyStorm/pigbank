import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { UserPlus, Loader2, Building2 } from "lucide-react";

export default function PigBankTeam() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteFirstName, setInviteFirstName] = useState("");
  const [inviteLastName, setInviteLastName] = useState("");
  const [inviteRole, setInviteRole] = useState("pigbank_staff");

  const isAdmin = (user as any)?.role === 'pigbank_admin';

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

  return (
    <Layout title="PigBank Team">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-pigbank-team-title">
              PigBank Team
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage PigBank staff members and administrators
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                  <Button className="w-full sm:w-auto" data-testid="button-invite-pigbank-member">
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
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>Understanding what each PigBank role can do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Badge variant="outline" className="min-w-[70px] justify-center bg-[#73cb43]/20 text-[#39870E] border-[#39870E] dark:bg-green-900/30 dark:text-green-400 dark:border-green-700 mt-0.5">
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
                <Badge variant="outline" className="min-w-[70px] justify-center bg-blue-100 text-blue-700 border-blue-700 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700 mt-0.5">
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
