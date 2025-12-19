import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Check, 
  Copy, 
  ExternalLink, 
  Loader2, 
  RefreshCw, 
  Trash2,
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon
} from "lucide-react";
import { Link } from "wouter";
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

interface WixIntegration {
  id: string;
  userId: string;
  siteId: string;
  siteName: string | null;
  apiKey: string;
  accountId: string | null;
  isActive: boolean;
  webhookUrl: string | null;
  lastSyncAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function WixIntegration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [siteId, setSiteId] = useState("");
  const [siteName, setSiteName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const { data: integrations = [], isLoading } = useQuery<WixIntegration[]>({
    queryKey: ["/api/integrations/wix"],
  });

  const existingIntegration = integrations.length > 0 ? integrations[0] : null;

  const createMutation = useMutation({
    mutationFn: async (data: { siteId: string; siteName: string; apiKey: string }) => {
      const response = await fetch("/api/integrations/wix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create integration");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations/wix"] });
      toast({ title: "Wix integration connected successfully" });
      setSiteId("");
      setSiteName("");
      setApiKey("");
      setTestResult(null);
    },
    onError: () => {
      toast({ title: "Failed to connect Wix integration", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<WixIntegration> }) => {
      const response = await fetch(`/api/integrations/wix/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update integration");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations/wix"] });
      toast({ title: "Integration updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update integration", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/integrations/wix/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete integration");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/integrations/wix"] });
      toast({ title: "Wix integration disconnected" });
    },
    onError: () => {
      toast({ title: "Failed to disconnect integration", variant: "destructive" });
    },
  });

  const handleTestConnection = async () => {
    if (!siteId || !apiKey) {
      toast({ title: "Please enter Site ID and API Key", variant: "destructive" });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/integrations/wix/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ siteId, apiKey }),
      });

      const result = await response.json();
      setTestResult({
        success: result.success,
        message: result.success ? "Connection verified successfully!" : result.error || "Connection failed",
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: "Failed to test connection",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleConnect = () => {
    if (!siteId || !apiKey) {
      toast({ title: "Please enter Site ID and API Key", variant: "destructive" });
      return;
    }
    createMutation.mutate({ siteId, siteName, apiKey });
  };

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "Webhook URL copied to clipboard" });
  };

  if (isLoading) {
    return (
      <Layout title="Wix Integration">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Wix Integration">
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-wix-integration-title">
              Wix Integration
            </h1>
            <p className="text-gray-600 mt-1">
              Connect your Wix store to accept payments through PigBank
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/integrations">
            <Button variant="ghost" size="sm" data-testid="button-back-integrations">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Integrations
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#0C6EFC] to-[#5C4EE5] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            W
          </div>
          <div>
            <h2 className="text-xl font-bold">Connection Details</h2>
            <p className="text-muted-foreground">
              Manage your Wix store connection settings
            </p>
          </div>
        </div>

        {existingIntegration ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle>Connection Status</CardTitle>
                    <Badge variant="outline" className={existingIntegration.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-gray-50 text-gray-600"}>
                      {existingIntegration.isActive ? (
                        <><CheckCircle2 className="w-3 h-3 mr-1" /> Connected</>
                      ) : (
                        <><AlertCircle className="w-3 h-3 mr-1" /> Inactive</>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={existingIntegration.isActive}
                      onCheckedChange={(checked) => 
                        updateMutation.mutate({ id: existingIntegration.id, data: { isActive: checked } })
                      }
                      data-testid="switch-integration-active"
                    />
                    <span className="text-sm text-muted-foreground">
                      {existingIntegration.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-sm">Site ID</Label>
                    <p className="font-mono text-sm" data-testid="text-site-id">{existingIntegration.siteId}</p>
                  </div>
                  {existingIntegration.siteName && (
                    <div>
                      <Label className="text-muted-foreground text-sm">Site Name</Label>
                      <p data-testid="text-site-name">{existingIntegration.siteName}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground text-sm">Connected Since</Label>
                    <p data-testid="text-connected-since">
                      {new Date(existingIntegration.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {existingIntegration.lastSyncAt && (
                    <div>
                      <Label className="text-muted-foreground text-sm">Last Sync</Label>
                      <p data-testid="text-last-sync">
                        {new Date(existingIntegration.lastSyncAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {existingIntegration.webhookUrl && (
                  <div className="pt-4 border-t">
                    <Label className="text-muted-foreground text-sm">Webhook URL</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 text-xs bg-muted px-3 py-2 rounded font-mono truncate" data-testid="text-webhook-url">
                        {existingIntegration.webhookUrl}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyWebhookUrl(existingIntegration.webhookUrl!)}
                        data-testid="button-copy-webhook"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add this URL to your Wix site's webhook settings
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" data-testid="button-disconnect">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Disconnect Wix Integration?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will disconnect your Wix store from PigBank. You can reconnect at any time.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(existingIntegration.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Disconnect
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="outline" size="sm" data-testid="button-refresh-sync">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Now
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Setup Instructions</CardTitle>
                <CardDescription>
                  Follow these steps to complete the Wix integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4 text-sm">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">1</span>
                    <div>
                      <p className="font-medium">Copy the Webhook URL above</p>
                      <p className="text-muted-foreground">You'll need this to configure payment notifications</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">2</span>
                    <div>
                      <p className="font-medium">Open your Wix Dashboard</p>
                      <p className="text-muted-foreground">Go to Settings → Developer Tools → Webhooks</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">3</span>
                    <div>
                      <p className="font-medium">Add a new webhook</p>
                      <p className="text-muted-foreground">Paste the webhook URL and select payment events to subscribe to</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">4</span>
                    <div>
                      <p className="font-medium">Configure payment provider</p>
                      <p className="text-muted-foreground">In Wix, go to Accept Payments and add PigBank as a payment method</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <a href="https://support.wix.com/en/article/adding-a-webhook" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Wix Documentation
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Wix Store</CardTitle>
              <CardDescription>
                Enter your Wix API credentials to enable payment processing through PigBank
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteId">Site ID *</Label>
                  <Input
                    id="siteId"
                    placeholder="Your Wix Site ID"
                    value={siteId}
                    onChange={(e) => setSiteId(e.target.value)}
                    data-testid="input-site-id"
                  />
                  <p className="text-xs text-muted-foreground">
                    Find this in your Wix Dashboard under Settings → Developer Tools
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name (optional)</Label>
                  <Input
                    id="siteName"
                    placeholder="My Wix Store"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    data-testid="input-site-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key *</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Your Wix API Key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    data-testid="input-api-key"
                  />
                  <p className="text-xs text-muted-foreground">
                    Generate an API key from your Wix Dashboard → Developer Tools → API Keys
                  </p>
                </div>
              </div>

              {testResult && (
                <div className={`p-4 rounded-lg flex items-center gap-3 ${testResult.success ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {testResult.success ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                  <span data-testid="text-test-result">{testResult.message}</span>
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  How to get your Wix API credentials
                </h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Log in to your Wix account and go to your site dashboard</li>
                  <li>Navigate to Settings → Developer Tools → API Keys</li>
                  <li>Click "Generate API Key" and select the required permissions</li>
                  <li>Copy your Site ID from the Dashboard URL or Settings</li>
                </ol>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting || !siteId || !apiKey}
                data-testid="button-test-connection"
              >
                {isTesting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Test Connection
              </Button>
              <Button
                onClick={handleConnect}
                disabled={createMutation.isPending || !siteId || !apiKey}
                data-testid="button-connect"
              >
                {createMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Connect Wix Store
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
}
