import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SponsorPopupProps {
  show: boolean;
  delay?: number;
}

export function SponsorPopup({ show, delay = 500 }: SponsorPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (show && !dismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [show, delay, dismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-[9998] max-w-sm"
          data-testid="sponsor-popup"
        >
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1a4320] to-[#2d5a34] p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Coming Soon</h3>
                    <p className="text-white/80 text-sm">Now Seeking Bank Sponsors</p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="text-white/70 hover:text-white transition-colors p-1"
                  data-testid="button-dismiss-sponsor-popup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <p className="text-gray-700 text-sm leading-relaxed">
                This platform is currently in development. We are actively seeking bank sponsorships to bring this payment processing solution to market.
              </p>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Building2 className="w-4 h-4" />
                <span>Interested in partnering with us?</span>
              </div>
              
              <Button 
                asChild
                className="w-full bg-[#1a4320] hover:bg-[#2d5a34] text-white"
                data-testid="button-contact-sponsorship"
              >
                <a href="/public-contact">Contact for Sponsorship</a>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
