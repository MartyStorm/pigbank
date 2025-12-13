import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
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
import {
  LayoutDashboard,
  CreditCard,
  Monitor,
  Link as LinkIcon,
  Globe,
  CheckCircle2,
  FileText,
  DollarSign,
  AlertTriangle,
  BarChart3,
  ShieldAlert,
  Smartphone,
  Bitcoin,
  CalendarClock,
  Code2,
  Palette,
  Settings,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Check,
  Bell,
  Wallet,
  Database,
  Play,
  Square,
  Loader2,
  Users,
  Headset,
  MessageSquare,
  Shield,
} from "lucide-react";

interface NavItem {
  icon: any;
  label: string;
  href: string;
  disabled?: boolean;
  badge?: string;
  children?: { label: string; href: string; icon?: any; disabled?: boolean; badge?: string }[];
}

const baseNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: CreditCard, label: "Transactions", href: "/transactions" },
  { 
    icon: Wallet, 
    label: "Payment Methods", 
    href: "#",
    children: [
      { label: "Hosted Checkout", href: "/hosted-checkout" },
      { label: "Virtual Terminal", href: "/terminal" },
      { label: "Pay by Link", href: "/pay-by-link" },
      { label: "Point of Sale", href: "#", disabled: true, badge: "Soon" },
      { label: "Subscriptions", href: "#", disabled: true, badge: "Soon" },
      { label: "Checks", href: "#", disabled: true, badge: "Soon" },
      { label: "Mobile App", href: "#", disabled: true, badge: "Soon" },
      { label: "Buy Now Pay Later", href: "#", disabled: true, badge: "Soon" },
      { label: "Crypto", href: "#", disabled: true, badge: "Soon" },
    ]
  },
  { 
    icon: FileText, 
    label: "Invoicing", 
    href: "#",
    children: [
      { label: "Create Invoice", href: "/invoices/create", icon: FileText },
      { label: "List Invoices", href: "/invoices", icon: FileText },
    ]
  },
  { icon: ShieldAlert, label: "Fraud & Risk", href: "/fraud" },
  { icon: AlertTriangle, label: "Chargebacks", href: "/chargebacks" },
  { icon: DollarSign, label: "Payouts", href: "/payouts" },
  { icon: Headset, label: "Customer Support", href: "/support" },
  { 
    icon: Settings, 
    label: "Settings", 
    href: "#",
    children: [
      { label: "Admin Console", href: "/admin" },
      { label: "Notifications", href: "/settings" },
      { label: "Themes", href: "/themes" },
    ]
  },
];

const pigBankTeamItem: NavItem = {
  icon: Users,
  label: "PigBank Team",
  href: "/pigbank-team",
};

const pigBankMerchantsItem: NavItem = { 
  icon: Users, 
  label: "PigBank Merchants", 
  href: "/team/merchants",
};

const pigBankMessagesItem: NavItem = {
  icon: MessageSquare,
  label: "PigBank Messages",
  href: "/pigbank-messages",
};

const pigBankComplianceItem: NavItem = {
  icon: Shield,
  label: "Compliance Hub",
  href: "/compliance-hub",
};

export function Sidebar({ className }: { className?: string }) {
  const [location] = useLocation();
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const isDemoActive = user?.demoActive ?? false;
  const isLoadingDemoState = isAuthLoading || isLoadingDemo;
  const { toast } = useToast();

  const handleToggleDemo = async () => {
    setIsLoadingDemo(true);
    try {
      if (isDemoActive) {
        // Deactivate demo
        const response = await fetch("/api/demo/deactivate", {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to deactivate demo");
        }
        
        await queryClient.invalidateQueries();
        
        toast({
          title: "Demo Account Deactivated",
          description: "Demo data has been cleared from your account.",
        });
      } else {
        // Activate demo
        const response = await fetch("/api/demo/activate", {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to activate demo");
        }
        
        await queryClient.invalidateQueries();
        
        toast({
          title: "Demo Account Activated",
          description: `Loaded ${data.stats.transactions} transactions, ${data.stats.customers} customers, ${data.stats.invoices} invoices, and ${data.stats.payouts} payouts.`,
        });
      }
    } catch (error) {
      toast({
        title: isDemoActive ? "Failed to deactivate demo" : "Failed to activate demo",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDemo(false);
    }
  };

  const getUserInitials = () => {
    if (!user) return "U";
    // Use merchant/business name's first letter if available
    if (user.merchantName?.[0]) return user.merchantName[0].toUpperCase();
    if (user.firstName?.[0]) return user.firstName[0].toUpperCase();
    if (user.lastName?.[0]) return user.lastName[0].toUpperCase();
    return user.email?.[0]?.toUpperCase() || "U";
  };

  const getUserDisplayName = () => {
    if (!user) return "Login";
    // Show merchant/company name if available, otherwise fall back to user name
    if (user.merchantName) {
      return user.merchantName;
    }
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    return user.email || "User";
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      queryClient.setQueryData(["/api/auth/user"], null);
      queryClient.removeQueries({ queryKey: ["/api/auth/user"] });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isTeamMember = user?.role === "pigbank_staff" || user?.role === "pigbank_admin";
  
  // PigBank staff items are rendered in a separate section at the bottom
  const navItems = baseNavItems;
  const pigBankItems = isTeamMember ? [pigBankTeamItem, pigBankMerchantsItem, pigBankMessagesItem, pigBankComplianceItem] : [];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Automatically open menus if a child is active
  useEffect(() => {
    const newOpenMenus = { ...openMenus };
    let hasChanges = false;

    navItems.forEach(item => {
      if (item.children && item.children.some(child => location === child.href)) {
        if (!newOpenMenus[item.label]) {
          newOpenMenus[item.label] = true;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setOpenMenus(newOpenMenus);
    }
  }, [location]);

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");
  const isLightMode = !isDark;

  return (
    <div className={cn("flex h-screen w-64 flex-col bg-[#203E22] dark:bg-[#262626] text-sidebar-foreground", className)}>
      <div className="hidden md:flex h-20 items-center justify-center bg-[#203E22] dark:bg-[#262626]">
        <Link href="/dashboard">
          <img 
            src="/pig-bank-logo-dark.png" 
            alt="PigBank" 
            className="h-14 object-contain block dark:hidden cursor-pointer" 
          />
          <img 
            src="/pig-bank-logo-dark.png" 
            alt="PigBank" 
            className="h-14 object-contain hidden dark:block cursor-pointer" 
          />
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto pb-4 pt-0 bg-[#203E22] dark:bg-[#262626]">
        <nav className="space-y-1 px-3 mt-4 md:mt-0">
          {navItems.map((item) => {
            const isActive = location === item.href;
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openMenus[item.label];
            const isChildActive = item.children?.some(child => location === child.href);

            if (hasChildren) {
              return (
                <div key={item.label} className="space-y-1">
                  <div
                    onClick={() => toggleMenu(item.label)}
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-3 md:py-2 text-base md:text-sm font-medium transition-all duration-200 cursor-pointer",
                      (isActive || isChildActive)
                        ? "text-white dark:text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", 
                      (isActive || isChildActive)
                        ? "text-white" 
                        : "text-white/70 group-hover:text-white dark:text-gray-300 dark:group-hover:text-white"
                    )} />
                    <span className="flex-1">{item.label}</span>
                    {isOpen ? (
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    ) : (
                      <ChevronRight className="h-3 w-3 opacity-50" />
                    )}
                  </div>
                  
                  {isOpen && (
                    <div className="pl-9 space-y-1">
                      {item.children?.map((child) => {
                        const isChildActive = location === child.href;
                        return (
                          <Link key={child.label} href={child.disabled ? "#" : child.href}>
                            <div
                              className={cn(
                                "group flex items-center gap-3 rounded-md px-3 py-3 md:py-2 text-base md:text-sm font-medium transition-all duration-200",
                                child.disabled
                                  ? "opacity-50 cursor-not-allowed text-white/50 dark:text-gray-400"
                                  : isChildActive
                                    ? "bg-white/20 text-white shadow-sm"
                                    : "text-white/70 hover:bg-white/10 hover:text-white dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                              )}
                            >
                              <span className="flex-1">{child.label}</span>
                              {child.badge && (
                                <span className={cn("ml-auto text-[10px] uppercase tracking-wider font-bold opacity-70 px-1.5 py-0.5 rounded-full", 
                                  "bg-white/20 text-white dark:bg-white/20 dark:text-white"
                                )}>
                                  {child.badge}
                                </span>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link key={item.label} href={item.disabled ? "#" : item.href}>
                <div
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-3 md:py-2 text-base md:text-sm font-medium transition-all duration-200",
                    item.disabled 
                      ? "opacity-50 cursor-not-allowed text-white/50 dark:text-gray-400"
                      : isActive
                        ? "bg-white/20 text-white shadow-sm"
                        : "text-white/80 hover:bg-white/10 hover:text-white dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", 
                    isActive 
                      ? "text-white" 
                      : "text-white/70 group-hover:text-white dark:text-white dark:group-hover:text-white"
                  )} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={cn("ml-auto text-[10px] uppercase tracking-wider font-bold opacity-70 px-1.5 py-0.5 rounded-full", 
                      "bg-white/20 text-white dark:bg-white/20 dark:text-white"
                    )}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* PigBank Staff Section */}
      {pigBankItems.length > 0 && (
        <div className="border-t border-white/10 px-3 py-3 bg-[#203E22] dark:bg-[#262626]">
          <div className="text-[10px] uppercase tracking-wider text-white/40 font-semibold mb-2 px-3">
            PigBank Staff
          </div>
          <nav className="space-y-1">
            {pigBankItems.map((item) => {
              const isActive = location === item.href;
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openMenus[item.label];
              const isChildActive = item.children?.some(child => location === child.href);

              if (hasChildren) {
                return (
                  <div key={item.label} className="space-y-1">
                    <div
                      onClick={() => toggleMenu(item.label)}
                      className={cn(
                        "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 cursor-pointer",
                        (isActive || isChildActive)
                          ? "text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", 
                        (isActive || isChildActive) ? "text-white" : "text-white/70 group-hover:text-white"
                      )} />
                      <span className="flex-1">{item.label}</span>
                      {isOpen ? (
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      ) : (
                        <ChevronRight className="h-3 w-3 opacity-50" />
                      )}
                    </div>
                    
                    {isOpen && (
                      <div className="pl-9 space-y-1">
                        {item.children?.map((child) => {
                          const isChildItemActive = location === child.href;
                          return (
                            <Link key={child.label} href={child.href}>
                              <div
                                className={cn(
                                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                                  isChildItemActive
                                    ? "bg-white/20 text-white shadow-sm"
                                    : "text-white/70 hover:bg-white/10 hover:text-white dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                                )}
                              >
                                <span className="flex-1">{child.label}</span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link key={item.label} href={item.href}>
                  <div
                    className={cn(
                      "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-white/20 text-white shadow-sm"
                        : "text-white/80 hover:bg-white/10 hover:text-white dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", 
                      isActive ? "text-white" : "text-white/70 group-hover:text-white"
                    )} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <div className="border-t border-white/10 p-2 bg-[#203E22] dark:bg-[#262626]">
        <a 
          href="/landing" 
          className="flex items-center gap-2 px-3 py-2 mb-1 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          data-testid="link-back-to-landing"
        >
          <ChevronRight className="h-3 w-3 rotate-180" />
          <span>Back to Landing Page</span>
        </a>
        <a 
          href="/onboarding" 
          className="flex items-center gap-2 px-3 py-2 mb-2 text-xs text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          data-testid="link-back-to-onboarding"
        >
          <ChevronRight className="h-3 w-3 rotate-180" />
          <span>Back to Onboarding</span>
        </a>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center gap-3 px-2 hover:bg-white/10 dark:hover:bg-white/10 text-white dark:text-gray-300 justify-start h-auto py-3">
              <Avatar className="h-8 w-8 bg-gray-200 dark:bg-gray-700 text-[#73cb43] border-none font-black">
                {!isAuthenticated ? (
                  <AvatarImage src="/favicon.png" alt="PigBank" className="p-1" />
                ) : user?.profileImageUrl ? (
                  <AvatarImage src={user.profileImageUrl} alt={getUserDisplayName()} />
                ) : null}
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm overflow-hidden">
                <span className="font-medium truncate w-full">{getUserDisplayName()}</span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-70 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56" side="right" sideOffset={10}>
            <DropdownMenuItem asChild>
              <a href="/admin" data-testid="link-admin-console">
                <Settings className="mr-2 h-4 w-4" />
                Admin Console
              </a>
            </DropdownMenuItem>
            {isAuthenticated && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleToggleDemo} 
                  disabled={isLoadingDemoState}
                  className={isDemoActive ? "text-red-500 focus:text-red-500" : "text-[#73cb43] focus:text-[#73cb43]"}
                  data-testid="sidebar-button-demo"
                >
                  {isLoadingDemoState ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isLoadingDemo ? (isDemoActive ? "Exiting Demo..." : "Loading Demo...") : "Loading..."}
                    </>
                  ) : isDemoActive ? (
                    <>
                      <Square className="mr-2 h-4 w-4" />
                      Exit Demo Account
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      View Demo Account
                    </>
                  )}
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            {isAuthenticated ? (
              <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">Log out</DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <a href="/login" data-testid="button-login">Log in</a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
