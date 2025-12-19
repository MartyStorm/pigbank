import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, CalendarClock } from "lucide-react";

export default function Subscriptions() {
  return (
    <Layout title="Subscription Billing">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-subscriptions-title">
              Subscription Billing
            </h1>
            <p className="text-gray-600 mt-1">
              Manage recurring payments and subscription plans
            </p>
          </div>
        </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          
          {/* Subscription Management Card */}
          <Card className="border-border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center p-8">
            <CardHeader className="pb-2 space-y-4">
              <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4 relative group">
                <RefreshCw className="w-10 h-10 text-primary transition-transform duration-300 group-hover:rotate-180" />
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <RefreshCw className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">Recurring Billing</CardTitle>
                <h3 className="text-lg font-semibold text-muted-foreground">Automated Payments</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 flex-1 flex flex-col">
              <p className="text-muted-foreground max-w-sm mx-auto">
                Create and manage recurring subscription plans. Automate customer billing cycles and reduce churn.
              </p>
              
              <div className="mt-auto space-y-4 w-full">
                <Button className="w-full h-12 text-base font-medium">
                  Activate Subscriptions
                </Button>
                
                <Button variant="link" className="text-primary gap-2">
                  I need more info <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Card - Placeholder for future features */}
          <Card className="border-border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center p-8 opacity-75">
            <CardHeader className="pb-2 space-y-4">
              <div className="w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4 relative group">
                <CalendarClock className="w-10 h-10 text-muted-foreground" />
                <div className="absolute -top-2 -right-2 bg-muted-foreground text-background rounded-full px-2 py-0.5 text-xs font-bold">
                  SOON
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">Usage-Based Billing</CardTitle>
                <h3 className="text-lg font-semibold text-muted-foreground">Pay As You Go</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 flex-1 flex flex-col">
              <p className="text-muted-foreground max-w-sm mx-auto">
                Metered billing based on actual usage. Perfect for API services, data storage, and utility-style pricing.
              </p>
              
              <div className="mt-auto space-y-4 w-full">
                <Button className="w-full h-12 text-base font-medium" disabled>
                  Coming Soon
                </Button>
                
                <Button variant="link" className="text-muted-foreground gap-2" disabled>
                  Notify me when available <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
      </div>
    </Layout>
  );
}
