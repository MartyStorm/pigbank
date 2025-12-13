import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Shield, Ban, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Fraud() {
  const { user } = useAuth();
  const isDemoActive = user?.demoActive ?? false;
  
  return (
    <Layout title="Fraud & Risk">
      <div className="space-y-6 max-w-6xl">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-fraud-title">
              Fraud & Risk
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor account health and configure fraud protection rules
            </p>
          </div>
        </div>

        {/* Rules Config */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Active Protection Rules
              </CardTitle>
              <CardDescription>Configure automated risk blocking rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Block High-Risk Countries</div>
                  <div className="text-sm text-muted-foreground">Automatically decline transactions from Tier 3 countries</div>
                </div>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">AVS Mismatch Block</div>
                  <div className="text-sm text-muted-foreground">Decline if billing address does not match card</div>
                </div>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">CVV Requirement</div>
                  <div className="text-sm text-muted-foreground">Require CVV for all transactions</div>
                </div>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Velocity Checks</div>
                  <div className="text-sm text-muted-foreground">Limit transactions per card per hour</div>
                </div>
                <Switch checked={false} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-[#f0b100]" />
                Recent Blocks
              </CardTitle>
              <CardDescription>Transactions automatically blocked by rules.</CardDescription>
            </CardHeader>
            <CardContent>
              {isDemoActive ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#f0b100]/10 text-[#f0b100] flex items-center justify-center">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">IP Country Block</p>
                          <p className="text-xs text-muted-foreground">Attempt from Nigeria (NG)</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">2m ago</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Ban className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No blocked transactions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
