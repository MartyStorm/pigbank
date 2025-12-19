import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Mail, MessageSquare, Loader2, CheckCircle, Plus, X } from "lucide-react";

interface MerchantNotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  notificationPhone: string | null;
  notificationEmail: string | null;
  additionalEmails: string[] | null;
  additionalPhones: string[] | null;
}

export default function Settings() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [additionalEmails, setAdditionalEmails] = useState<string[]>([]);
  const [additionalPhones, setAdditionalPhones] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const { data: merchantData, isLoading } = useQuery({
    queryKey: ["/api/onboarding/merchant"],
    queryFn: async () => {
      const res = await fetch("/api/onboarding/merchant", { credentials: "include" });
      if (!res.ok) return null;
      const data = await res.json();
      return data.merchant as MerchantNotificationSettings;
    },
  });

  // Initialize form values from fetched data
  useEffect(() => {
    if (merchantData) {
      setEmailEnabled(merchantData.emailNotifications ?? true);
      setSmsEnabled(merchantData.smsNotifications ?? false);
      setPhone(merchantData.notificationPhone || "");
      // Use notification email if set, otherwise fall back to user's registered email
      setEmail(merchantData.notificationEmail || user?.email || "");
      setAdditionalEmails(merchantData.additionalEmails || []);
      setAdditionalPhones(merchantData.additionalPhones || []);
    } else if (user?.email && !email) {
      // If no merchant data yet, pre-fill with user's registered email
      setEmail(user.email);
    }
  }, [merchantData, user]);

  const saveMutation = useMutation({
    mutationFn: async (settings: MerchantNotificationSettings) => {
      const res = await fetch("/api/onboarding/merchant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save settings");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings Saved",
        description: "Your notification preferences have been updated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/onboarding/merchant"] });
      setHasChanges(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveMutation.mutate({
      emailNotifications: emailEnabled,
      smsNotifications: smsEnabled,
      notificationPhone: smsEnabled ? phone : null,
      notificationEmail: emailEnabled ? email : null,
      additionalEmails: emailEnabled ? additionalEmails.filter(e => e.trim()) : null,
      additionalPhones: smsEnabled ? additionalPhones.filter(p => p.trim()) : null,
    });
  };

  const handleEmailChange = (checked: boolean) => {
    setEmailEnabled(checked);
    setHasChanges(true);
  };

  const handleSmsChange = (checked: boolean) => {
    setSmsEnabled(checked);
    setHasChanges(true);
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setHasChanges(true);
  };

  const handleEmailAddressChange = (value: string) => {
    setEmail(value);
    setHasChanges(true);
  };

  const addAdditionalEmail = () => {
    setAdditionalEmails([...additionalEmails, ""]);
    setHasChanges(true);
  };

  const updateAdditionalEmail = (index: number, value: string) => {
    const updated = [...additionalEmails];
    updated[index] = value;
    setAdditionalEmails(updated);
    setHasChanges(true);
  };

  const removeAdditionalEmail = (index: number) => {
    setAdditionalEmails(additionalEmails.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const addAdditionalPhone = () => {
    setAdditionalPhones([...additionalPhones, ""]);
    setHasChanges(true);
  };

  const updateAdditionalPhone = (index: number, value: string) => {
    const updated = [...additionalPhones];
    updated[index] = value;
    setAdditionalPhones(updated);
    setHasChanges(true);
  };

  const removeAdditionalPhone = (index: number) => {
    setAdditionalPhones(additionalPhones.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  if (isLoading) {
    return (
      <Layout title="Settings">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Settings">
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-settings-title">
            Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your account preferences and notification settings
          </p>
        </div>

        <Card data-testid="card-notification-settings">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Choose how you want to be notified about important updates to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <Label htmlFor="email-notifications" className="text-base font-medium">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your application status, chargebacks, and account alerts
                  </p>
                </div>
              </div>
              <Switch
                id="email-notifications"
                checked={emailEnabled}
                onCheckedChange={handleEmailChange}
                data-testid="switch-email-notifications"
              />
            </div>

            {/* Email Address Input */}
            {emailEnabled && (
              <div className="ml-12 space-y-3">
                <div>
                  <Label htmlFor="notification-email" className="text-sm font-medium">
                    Primary Email Address
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="notification-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => handleEmailAddressChange(e.target.value)}
                      className="max-w-xs"
                      data-testid="input-notification-email"
                    />
                  </div>
                </div>

                {/* Additional Emails */}
                {additionalEmails.map((additionalEmail, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      type="email"
                      placeholder="additional@example.com"
                      value={additionalEmail}
                      onChange={(e) => updateAdditionalEmail(index, e.target.value)}
                      className="max-w-xs"
                      data-testid={`input-additional-email-${index}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAdditionalEmail(index)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      data-testid={`button-remove-email-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAdditionalEmail}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  data-testid="button-add-email"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Another Email
                </Button>
              </div>
            )}

            <div className="border-t pt-6">
              {/* SMS Notifications */}
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="bg-[#73cb43]/20 p-2 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-[#73cb43]" />
                  </div>
                  <div>
                    <Label htmlFor="sms-notifications" className="text-base font-medium">
                      Text Message Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Get instant text alerts for urgent matters like chargebacks and required actions
                    </p>
                  </div>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={smsEnabled}
                  onCheckedChange={handleSmsChange}
                  data-testid="switch-sms-notifications"
                />
              </div>

              {/* Phone Number Input */}
              {smsEnabled && (
                <div className="mt-4 ml-12 space-y-3">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Primary Phone Number
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="max-w-xs"
                        data-testid="input-notification-phone"
                      />
                    </div>
                  </div>

                  {/* Additional Phones */}
                  {additionalPhones.map((additionalPhone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={additionalPhone}
                        onChange={(e) => updateAdditionalPhone(index, e.target.value)}
                        className="max-w-xs"
                        data-testid={`input-additional-phone-${index}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAdditionalPhone(index)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        data-testid={`button-remove-phone-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAdditionalPhone}
                    className="text-[#73cb43] border-[#73cb43]/30 hover:bg-[#73cb43]/10"
                    data-testid="button-add-phone"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Another Phone
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    Standard message and data rates may apply
                  </p>
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={!hasChanges || saveMutation.isPending}
                className="bg-[#73cb43] hover:bg-[#65b53b]"
                data-testid="button-save-settings"
              >
                {saveMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Types</CardTitle>
            <CardDescription>
              Here's what you'll be notified about based on your preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#73cb43]" />
                <span>Application status updates (approved, action required)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#73cb43]" />
                <span>New chargeback alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#73cb43]" />
                <span>Payout confirmations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#73cb43]" />
                <span>Account security alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#73cb43]" />
                <span>Message history between you and PigBank</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
