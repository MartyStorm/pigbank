import { Sidebar } from "./Sidebar";
import { Menu, LogOut, User, Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-muted/10">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Mobile Header - Visible only on Mobile */}
        <div className="md:hidden sticky top-0 z-50 bg-[#1a4320] border-b border-[#1a331c]">
          <div className="flex items-center justify-between p-3 relative z-50 bg-[#1a4320]">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <img 
                  src="/pig-bank-logo-dark.png" 
                  alt="PigBank" 
                  className="h-14 w-auto object-contain block" 
                />
              </div>
            </Link>

            <Button 
                variant="ghost" 
                size="icon" 
                className="h-12 w-12 rounded-full text-[#73cb43] [&_svg]:size-8 hover:bg-primary/10"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed inset-x-0 bottom-0 top-[73px] bg-white dark:bg-[#262626] z-40 overflow-hidden border-t border-border/50 shadow-2xl"
              >
                <Sidebar className="w-full h-full" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50 dark:bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
