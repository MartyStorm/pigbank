import { useState } from "react";
import { Bell, ChevronDown, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const handleActivateDemo = async () => {
    setIsLoadingDemo(true);
    try {
      const response = await fetch("/api/demo/activate", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to activate demo");
      }
      
      // Invalidate all queries to refresh data
      await queryClient.invalidateQueries();
      
      toast({
        title: "Demo Account Activated",
        description: `Loaded ${data.stats.transactions} transactions, ${data.stats.customers} customers, ${data.stats.invoices} invoices, and ${data.stats.payouts} payouts.`,
      });
    } catch (error) {
      toast({
        title: "Failed to activate demo",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDemo(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.firstName?.[0]) return user.firstName[0].toUpperCase();
    if (user.lastName?.[0]) return user.lastName[0].toUpperCase();
    return user.email?.[0]?.toUpperCase() || "U";
  };

  const getUserDisplayName = () => {
    if (!user) return "Guest";
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    return user.email || "User";
  };

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <header className="flex h-16 items-center justify-end px-6 sticky top-0 z-10 bg-white dark:bg-[#262626]">
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="relative h-10 w-10 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10 p-0">
          <Bell className="!h-6 !w-6" />
          <span className="absolute top-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-white dark:border-[#333333]" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 pl-0 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300">
              <Avatar className="h-8 w-8 bg-gray-200 dark:bg-gray-700 text-[#73cb43] border-none font-bold">
                {!isAuthenticated ? (
                  <AvatarImage src="/pig-bank-logo-dark.png" alt="PigBank" className="p-1" />
                ) : user?.profileImageUrl ? (
                  <AvatarImage src={user.profileImageUrl} alt={getUserDisplayName()} />
                ) : null}
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-sm">
                <span className="font-medium">{getUserDisplayName()}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSeparator />
            {isAuthenticated && (
              <DropdownMenuItem 
                onClick={handleActivateDemo} 
                disabled={isLoadingDemo}
                className="text-[#73cb43] focus:text-[#73cb43]"
                data-testid="header-button-demo"
              >
                {isLoadingDemo ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Demo...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    View Demo Account
                  </>
                )}
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {isAuthenticated ? (
              <DropdownMenuItem onClick={handleLogout} data-testid="header-button-logout">Log out</DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <a href="/api/login" data-testid="header-button-login">Log in with Google</a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
