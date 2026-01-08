import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Loader2, CheckCircle, Mail, Lock, ArrowRight, Eye, EyeOff, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { identifyAnalyticsSession } from "@/hooks/use-analytics-tracker";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password validation
  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password),
  };
  const isPasswordValid = passwordRequirements.minLength && passwordRequirements.hasUppercase && passwordRequirements.hasSymbol;

  // Force light theme on register page
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (!isPasswordValid) {
      toast({
        title: "Password requirements not met",
        description: "Password must be at least 8 characters with an uppercase letter and a symbol.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Link analytics session to authenticated user
      await identifyAnalyticsSession();
      
      // Store email and show confirmation dialog
      setRegisteredEmail(formData.email);
      setShowConfirmation(true);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueToApplication = () => {
    setShowConfirmation(false);
    setLocation("/onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#1a4320]">
      {/* Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-[#73cb43]/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-[#73cb43]" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center">Account Created!</DialogTitle>
            <DialogDescription className="text-center space-y-4">
              <p>
                Your account has been created successfully. You can now continue with your merchant application.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Save these login details:
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="font-mono text-gray-700 dark:text-gray-300">{registeredEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">Your password</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                You can save and exit the application at any time. Just log back in with your email and password to continue where you left off.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={handleContinueToApplication}
              className="w-full sm:w-auto bg-[#73cb43] hover:bg-[#65b53b] text-white gap-2"
              data-testid="button-continue-application"
            >
              Continue to Application
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="w-full max-w-md shadow-2xl bg-white [&_input]:text-gray-900 [&_input]:bg-white [&_input]:border-gray-300 [&_input::placeholder]:text-gray-400 [&_label]:text-gray-700 [&_p]:text-gray-600">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <a href="/landing" data-testid="link-logo-home">
              <img 
                src="/attached_assets/Pig_Bank_Logo_new_y_compliance_copy_1767877796184.png" 
                alt="PigBank" 
                className="h-14 w-auto cursor-pointer"
                data-testid="logo-register"
              />
            </a>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900" data-testid="text-register-title">Create an account</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-12 rounded-lg border-gray-300"
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-12 rounded-lg border-gray-300 pr-12"
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  data-testid="button-toggle-password"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    {passwordRequirements.minLength ? (
                      <Check className="h-4 w-4 text-[#73cb43]" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={passwordRequirements.minLength ? "text-[#73cb43]" : "text-gray-500"}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordRequirements.hasUppercase ? (
                      <Check className="h-4 w-4 text-[#73cb43]" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={passwordRequirements.hasUppercase ? "text-[#73cb43]" : "text-gray-500"}>
                      At least 1 uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordRequirements.hasSymbol ? (
                      <Check className="h-4 w-4 text-[#73cb43]" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={passwordRequirements.hasSymbol ? "text-[#73cb43]" : "text-gray-500"}>
                      At least 1 special character (!@#$%...)
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onPaste={(e) => e.preventDefault()}
                  required
                  className="h-12 rounded-lg border-gray-300 pr-12"
                  data-testid="input-confirm-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  data-testid="button-toggle-confirm-password"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full h-12 bg-[#73cb43] hover:bg-[#65b53b] text-white font-medium rounded-lg text-base"
              disabled={isLoading}
              data-testid="button-register"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="text-[#73cb43] hover:underline font-medium"
                data-testid="link-login"
              >
                Sign in
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
