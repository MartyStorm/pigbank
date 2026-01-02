import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

interface LoadingScreenProps {
  minDisplayTime?: number;
}

export function LoadingScreen({ minDisplayTime = 1800 }: LoadingScreenProps) {
  const [location] = useLocation();
  const isLandingPage = location === "/" || location === "/landing";
  const hasSeenLoading = sessionStorage.getItem("pigbank_loading_shown") === "true";
  
  const [isVisible, setIsVisible] = useState(isLandingPage && !hasSeenLoading);

  useEffect(() => {
    if (!isVisible) return;
    
    sessionStorage.setItem("pigbank_loading_shown", "true");
    
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime, isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: "#1a4320" }}
          data-testid="loading-screen"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, -2, 2, 0],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center"
          >
            <img
              src="/attached_assets/Favacon_Pigbank_1767311997830.png"
              alt="PigBank Loading"
              className="w-32 h-32 md:w-40 md:h-40"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4"
            >
              <div className="flex items-center gap-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  className="w-2 h-2 rounded-full bg-[#75C947]"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 rounded-full bg-[#75C947]"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  className="w-2 h-2 rounded-full bg-[#75C947]"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
