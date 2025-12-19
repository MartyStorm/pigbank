import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTheme } from "@/components/theme-provider";
import { Monitor, Moon, Sun, SunMoon } from "lucide-react";

export default function Themes() {
  const { theme, setTheme } = useTheme();

  return (
    <Layout title="Themes">
      <div className="space-y-6 max-w-3xl">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white" data-testid="text-themes-title">
              Themes
            </h1>
            <p className="text-muted-foreground mt-1">
              Customize the look and feel of your dashboard
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Choose a theme that's comfortable for your eyes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              defaultValue={theme}
              onValueChange={(value) => setTheme(value as "light" | "dark" | "green" | "system")}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {/* Light */}
              <div>
                <RadioGroupItem value="light" id="light" className="peer sr-only" />
                <Label
                  htmlFor="light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Sun className="mb-3 h-6 w-6" />
                  Light
                </Label>
              </div>

              {/* Green */}
              <div>
                <RadioGroupItem value="green" id="green" className="peer sr-only" />
                <Label
                  htmlFor="green"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <SunMoon className="mb-3 h-6 w-6" />
                  Green
                </Label>
              </div>

              {/* Dark */}
              <div>
                <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                <Label
                  htmlFor="dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Moon className="mb-3 h-6 w-6" />
                  Dark
                </Label>
              </div>

              {/* System */}
              <div>
                <RadioGroupItem value="system" id="system" className="peer sr-only" />
                <Label
                  htmlFor="system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Monitor className="mb-3 h-6 w-6" />
                  System
                </Label>
              </div>
            </RadioGroup>
            
            <div className="mt-6 text-sm text-muted-foreground">
              <p className="mb-2">Theme Details:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Light:</strong> Standard high-contrast light mode.</li>
                <li><strong>Green:</strong> Light mode with green accents.</li>
                <li><strong>Dark:</strong> Designed for low light conditions.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
