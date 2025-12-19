import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BellRing, AlertCircle, ShieldCheck } from "lucide-react";

export default function ChargebackAlerts() {
  return (
    <Layout title="Chargeback Alerts">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-chargeback-alerts-title">
              Chargeback Alerts
            </h1>
            <p className="text-gray-600 mt-1">
              Preempt chargebacks with early warning alerts
            </p>
          </div>
        </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <Card className="w-full max-w-4xl border-border shadow-sm">
          <CardContent className="flex flex-col md:flex-row items-center p-12 gap-12">
            
            {/* Illustration Placeholder */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-[#73cb43]/20 rounded-full flex items-center justify-center">
                  <BellRing className="w-20 h-20 text-[#73cb43]" />
                </div>
                <div className="absolute top-0 right-0 bg-[#73cb43] p-4 rounded-xl shadow-lg border border-[#73cb43] animate-bounce duration-3000">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Chargeback Alerts</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Our enriched chargeback alert system lets you preempt pending chargebacks by cancelling future billing or refunding the customer.
              </p>
              
              <div className="space-y-4 pt-2">
                <Button size="lg" className="w-full md:w-auto bg-[#73cb43] hover:bg-[#65b538] text-white font-medium h-12 px-8 text-base">
                  Activate Chargeback Alerts
                </Button>
                
                <div className="flex justify-center md:justify-start">
                  <Button variant="link" className="text-[#73cb43] hover:text-[#65b538] gap-2 h-auto p-0 font-normal">
                    I need more info <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
      </div>
    </Layout>
  );
}
