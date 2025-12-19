import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, Building2, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Checks() {
  return (
    <Layout title="eCheck Processing">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-checks-title">
              eCheck Processing
            </h1>
            <p className="text-gray-600 mt-1">
              Accept check payments online with automated processing
            </p>
          </div>
        </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
          
          {/* eCheck Plus Card */}
          <Card className="border-border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center p-8">
            <CardHeader className="pb-2 space-y-4">
              <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4 relative group">
                <Building2 className="w-10 h-10 text-primary transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">eCheck Plus</CardTitle>
                <h3 className="text-lg font-semibold text-muted-foreground">We Print!</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 flex-1 flex flex-col">
              <p className="text-muted-foreground max-w-sm mx-auto">
                Accept check payments online. We will print the checks and deposits to your traditional bank account for you.
              </p>
              
              <div className="mt-auto space-y-4 w-full">
                <Button className="w-full h-12 text-base font-medium">
                  Activate eCheck Plus
                </Button>
                
                <Button variant="link" className="text-primary gap-2">
                  I need more info <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* eCheck Mobile Card */}
          <Card className="border-border shadow-sm hover:shadow-md transition-all duration-200 flex flex-col items-center text-center p-8">
            <CardHeader className="pb-2 space-y-4">
              <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4 relative group">
                <Printer className="w-10 h-10 text-primary transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold">eCheck Mobile</CardTitle>
                <h3 className="text-lg font-semibold text-muted-foreground">You Print!</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 flex-1 flex flex-col">
              <p className="text-muted-foreground max-w-sm mx-auto">
                Accept check payments online. You will print the checks and deposits to your bank's mobile app.
              </p>
              
              <div className="mt-auto space-y-4 w-full">
                <Button className="w-full h-12 text-base font-medium">
                  Activate eCheck Mobile
                </Button>
                
                <Button variant="link" className="text-primary gap-2">
                  I need more info <ArrowRight className="w-4 h-4" />
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
