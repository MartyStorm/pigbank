import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Copy, Terminal } from "lucide-react";

export default function Developers() {
  return (
    <Layout title="Developers">
      <div className="space-y-6 max-w-5xl">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-developers-title">
              Developers
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage API keys and access developer resources
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your secret keys. Do not share these with anyone.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Publishable Key</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input value="pk_live_51Nq..." readOnly className="font-mono bg-muted/50" />
                </div>
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Secret Key</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input value="sk_live_........................" type="password" readOnly className="font-mono bg-muted/50" />
                </div>
                <Button variant="outline" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Last used: Just now</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Example Request</CardTitle>
            <CardDescription>Create a charge using the API.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-950 text-slate-50 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`curl https://api.pigbank.com/v1/charges \\
  -u sk_test_YOUR_SECRET_KEY_HERE: \\
  -d amount=2000 \\
  -d currency=usd \\
  -d source=tok_visa \\
  -d description="Charge for jenny.rosen@example.com"`}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
