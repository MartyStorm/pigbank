import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Loader2, Eye, EyeOff } from "lucide-react";

const REMEMBER_ME_KEY = "pigbank_remember_me";
const SAVED_USERNAME_KEY = "pigbank_saved_username";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem(REMEMBER_ME_KEY) === "true";
  });
  const [formData, setFormData] = useState(() => {
    const savedUsername = localStorage.getItem(SAVED_USERNAME_KEY) || "";
    return {
      username: savedUsername,
      password: "",
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ 
          email: formData.username, 
          password: formData.password,
          rememberMe 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

      // Save or clear remembered credentials
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, "true");
        localStorage.setItem(SAVED_USERNAME_KEY, formData.username);
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
        localStorage.removeItem(SAVED_USERNAME_KEY);
      }

      // Redirect based on user role
      const redirectUrl = data.redirectUrl || "/dashboard";
      setLocation(redirectUrl);
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(circle at center, #5aa55a 0%, #3d6b3d 35%, #1a3d1a 100%)' }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 [&_input]:text-gray-900 [&_input]:bg-white [&_input]:border-gray-300 [&_input::placeholder]:text-gray-400">
        <div className="flex flex-col items-center space-y-6">
          <img 
            src="/pig-bank-logo-light.png" 
            alt="PigBank" 
            className="h-14 w-auto"
            data-testid="logo-login"
          />
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900" data-testid="text-login-title">
              Welcome back!
            </h1>
            <p className="text-gray-500">Sign in to your account.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-gray-900">
              <span className="text-red-500">*</span> Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="h-12 rounded-lg border-gray-300 focus:border-[#73cb43] focus:ring-[#73cb43]"
              data-testid="input-username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-900">
              <span className="text-red-500">*</span> Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="h-12 rounded-lg border-gray-300 focus:border-[#73cb43] focus:ring-[#73cb43] pr-12"
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                data-testid="button-toggle-password"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5" />
                ) : (
                  <EyeOff className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                data-testid="checkbox-remember"
              />
              <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                Remember me
              </Label>
            </div>
            <a 
              href="/forgot-password" 
              className="text-sm text-[#73cb43] hover:underline font-medium"
              data-testid="link-forgot-password"
            >
              Forgot password
            </a>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-[#73cb43] hover:bg-[#65b53b] text-white font-medium rounded-lg text-base"
            disabled={isLoading}
            data-testid="button-login"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>

          <p className="text-sm text-center text-gray-600">
            <a 
              href="/register" 
              className="text-[#73cb43] hover:underline font-medium"
              data-testid="link-register"
            >
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
