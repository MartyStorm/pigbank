import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  RefreshCw, 
  Calendar,
  ArrowRight,
  Download,
  CreditCard,
  Building2,
  Wallet,
  Plus
} from "lucide-react";
import { format } from "date-fns";

interface DataImportRecord {
  id: string;
  source: string;
  status: string;
  transactionsImported: number;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
}

interface ImportSource {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  fields: { key: string; label: string; type: string; placeholder: string }[];
  available: boolean;
}

const importSources: ImportSource[] = [
  {
    id: "bankful",
    name: "Bankful",
    description: "Import transactions from Bankful payment processor",
    icon: CreditCard,
    color: "bg-blue-500",
    available: true,
    fields: [
      { key: "username", label: "API Username / Key", type: "text", placeholder: "Enter your Bankful API key" },
      { key: "password", label: "API Password / Secret", type: "password", placeholder: "Enter your Bankful API secret" },
    ],
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Import transactions from your Stripe account",
    icon: Wallet,
    color: "bg-purple-500",
    available: false,
    fields: [
      { key: "apiKey", label: "Secret API Key", type: "password", placeholder: "sk_live_..." },
    ],
  },
  {
    id: "square",
    name: "Square",
    description: "Import transactions from Square payments",
    icon: Building2,
    color: "bg-green-500",
    available: false,
    fields: [
      { key: "accessToken", label: "Access Token", type: "password", placeholder: "Enter your Square access token" },
    ],
  },
  {
    id: "csv",
    name: "CSV Upload",
    description: "Upload a CSV file with transaction data",
    icon: Database,
    color: "bg-orange-500",
    available: false,
    fields: [],
  },
];

export default function DataImport() {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [connectionError, setConnectionError] = useState("");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const selectedSourceConfig = importSources.find(s => s.id === selectedSource);

  const { data: imports = [], isLoading: importsLoading } = useQuery<DataImportRecord[]>({
    queryKey: ["/api/bankful/imports"],
  });

  const testConnectionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/${selectedSource}/test-connection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    },
    onMutate: () => {
      setConnectionStatus("testing");
      setConnectionError("");
    },
    onSuccess: (data) => {
      if (data.success) {
        setConnectionStatus("success");
        toast({
          title: "Connection successful",
          description: `Your ${selectedSourceConfig?.name} credentials are valid.`,
        });
      } else {
        setConnectionStatus("error");
        setConnectionError(data.error || "Connection failed");
      }
    },
    onError: (error: Error) => {
      setConnectionStatus("error");
      setConnectionError(error.message);
      toast({
        title: "Connection failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const importMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/${selectedSource}/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          ...credentials,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Import completed",
        description: `Imported ${data.imported} new transactions. ${data.skipped} duplicates skipped.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bankful/imports"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/bankful/imports"] });
    },
  });

  const handleSourceSelect = (sourceId: string) => {
    setSelectedSource(sourceId);
    setCredentials({});
    setConnectionStatus("idle");
    setConnectionError("");
  };

  const handleCredentialChange = (key: string, value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }));
  };

  const handleTestConnection = () => {
    const requiredFields = selectedSourceConfig?.fields || [];
    const missingFields = requiredFields.filter(f => !credentials[f.key]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing credentials",
        description: `Please fill in all required fields.`,
        variant: "destructive",
      });
      return;
    }
    testConnectionMutation.mutate();
  };

  const handleImport = () => {
    const requiredFields = selectedSourceConfig?.fields || [];
    const missingFields = requiredFields.filter(f => !credentials[f.key]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing credentials",
        description: `Please fill in all required fields.`,
        variant: "destructive",
      });
      return;
    }
    importMutation.mutate();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-700 border-green-500/30">Completed</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500/20 text-blue-700 border-blue-500/30">In Progress</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSourceIcon = (sourceId: string) => {
    const source = importSources.find(s => s.id === sourceId);
    if (!source) return Database;
    return source.icon;
  };

  const getSourceColor = (sourceId: string) => {
    const source = importSources.find(s => s.id === sourceId);
    return source?.color || "bg-gray-500";
  };

  const hasRequiredCredentials = () => {
    const requiredFields = selectedSourceConfig?.fields || [];
    return requiredFields.every(f => credentials[f.key]);
  };

  return (
    <Layout title="Data Import">
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-data-import-title">
              Data Import
            </h1>
            <p className="text-gray-600 mt-1">
              Connect to your payment processor and import transaction history into PigBank
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Select Import Source
            </CardTitle>
            <CardDescription>
              Choose which payment processor or data source to import from.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {importSources.map((source) => {
                const Icon = source.icon;
                const isSelected = selectedSource === source.id;
                
                return (
                  <button
                    key={source.id}
                    onClick={() => source.available && handleSourceSelect(source.id)}
                    disabled={!source.available}
                    data-testid={`button-source-${source.id}`}
                    className={cn(
                      "relative flex items-start gap-4 p-4 rounded-lg border-2 text-left transition-all",
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-muted hover:border-muted-foreground/30",
                      !source.available && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-white", source.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{source.name}</h3>
                        {!source.available && (
                          <Badge variant="secondary" className="text-[10px]">Coming Soon</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{source.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-primary absolute top-4 right-4" />
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {selectedSourceConfig && selectedSourceConfig.available && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <selectedSourceConfig.icon className="h-5 w-5" />
                  {selectedSourceConfig.name} Connection
                </CardTitle>
                <CardDescription>
                  Enter your {selectedSourceConfig.name} API credentials to connect and import transactions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {selectedSourceConfig.fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key}>{field.label}</Label>
                      <Input
                        id={field.key}
                        data-testid={`input-${selectedSource}-${field.key}`}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={credentials[field.key] || ""}
                        onChange={(e) => handleCredentialChange(field.key, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleTestConnection}
                    disabled={testConnectionMutation.isPending || !hasRequiredCredentials()}
                    data-testid="button-test-connection"
                  >
                    {testConnectionMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : connectionStatus === "success" ? (
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    ) : connectionStatus === "error" ? (
                      <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Test Connection
                  </Button>
                  
                  {connectionStatus === "success" && (
                    <span className="text-sm text-green-600">Connection verified!</span>
                  )}
                  {connectionStatus === "error" && connectionError && (
                    <span className="text-sm text-red-600">{connectionError}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Import Options
                </CardTitle>
                <CardDescription>
                  Optionally filter which transactions to import by date range.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date (optional)</Label>
                    <Input
                      id="startDate"
                      data-testid="input-start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date (optional)</Label>
                    <Input
                      id="endDate"
                      data-testid="input-end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleImport}
                  disabled={importMutation.isPending || !hasRequiredCredentials()}
                  data-testid="button-import-transactions"
                  className="w-full md:w-auto"
                >
                  {importMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Import from {selectedSourceConfig.name}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Import History</CardTitle>
            <CardDescription>
              View your previous import attempts and their status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {importsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : imports.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No imports yet. Select a source above to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {imports.map((importRecord) => {
                  const SourceIcon = getSourceIcon(importRecord.source);
                  return (
                    <div 
                      key={importRecord.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-muted/30"
                      data-testid={`row-import-${importRecord.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center text-white", getSourceColor(importRecord.source))}>
                          <SourceIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {importRecord.source.charAt(0).toUpperCase() + importRecord.source.slice(1)} Import
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(importRecord.startedAt), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{importRecord.transactionsImported} transactions</p>
                          {importRecord.errorMessage && (
                            <p className="text-sm text-red-600">{importRecord.errorMessage}</p>
                          )}
                        </div>
                        {getStatusBadge(importRecord.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
