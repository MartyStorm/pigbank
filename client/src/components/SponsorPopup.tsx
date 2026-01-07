import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Rocket, Phone, Mail } from "lucide-react";

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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[9997]"
            onClick={handleDismiss}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9998] w-full max-w-md mx-4"
            data-testid="sponsor-popup"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-[#1a4320] to-[#2d5a34] p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-xl">Coming Soon</h3>
                      <p className="text-white/80 text-sm">In Development</p>
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
              
              <div className="p-5 space-y-4">
                <p className="text-gray-700 text-base leading-relaxed">
                  This website and our systems are still in development. For inquiries, please reach out to us.
                </p>
                
                <div className="space-y-3 pt-2">
                  <p className="text-gray-800 font-medium">Contact us:</p>
                  
                  <a 
                    href="tel:865-243-6011" 
                    className="flex items-center gap-3 text-gray-700 hover:text-[#1a4320] transition-colors"
                    data-testid="link-phone"
                  >
                    <Phone className="w-5 h-5 text-[#73cb43]" />
                    <span>865-243-6011</span>
                  </a>
                  
                  <a 
                    href="mailto:marty@pigbank.us" 
                    className="flex items-center gap-3 text-gray-700 hover:text-[#1a4320] transition-colors"
                    data-testid="link-email"
                  >
                    <Mail className="w-5 h-5 text-[#73cb43]" />
                    <span>marty@pigbank.us</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
