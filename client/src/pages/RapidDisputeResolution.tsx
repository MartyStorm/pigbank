import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Scale, Gavel, Zap } from "lucide-react";

export default function RapidDisputeResolution() {
  return (
    <Layout title="Rapid Dispute Resolution">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-rdr-title">
              Rapid Dispute Resolution
            </h1>
            <p className="text-muted-foreground mt-1">
              Automate refunds for qualified transactions before disputes occur
            </p>
          </div>
        </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <Card className="w-full max-w-4xl border-border shadow-sm">
          <CardContent className="flex flex-col md:flex-row items-center p-12 gap-12">
            
            {/* Illustration Placeholder */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-48 h-48">
                <div className="absolute inset-0 bg-[#73cb43]/15 rounded-full flex items-center justify-center">
                  <Scale className="w-20 h-20 text-[#73cb43]" />
                </div>
                <div className="absolute top-0 left-0 bg-[#73cb43] p-4 rounded-xl shadow-md border border-[#73cb43] animate-swing origin-bottom-left">
                  <Gavel className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Rapid Dispute Resolution (RDR)</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                RDR acts on a pre-dispute stage and automates the refund process for qualified transactions with no action required from you.
              </p>
              
              <div className="space-y-4 pt-2">
                <Button size="lg" className="w-full md:w-auto bg-[#73cb43] hover:bg-[#65b538] text-white font-medium h-12 px-8 text-base">
                  Activate Rapid Dispute Resolution
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
