import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

interface HeroIntroAnimationProps {
  onComplete: () => void;
}

export function HeroIntroAnimation({ onComplete }: HeroIntroAnimationProps) {
  const [location] = useLocation();
  const isLandingPage = location === "/" || location === "/landing";
  
  const [isVisible, setIsVisible] = useState(isLandingPage);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      onComplete();
      return;
    }
    
    const timings = [
      { delay: 300, nextPhase: 1 },
      { delay: 1200, nextPhase: 2 },
      { delay: 2100, nextPhase: 3 },
      { delay: 3500, nextPhase: 4 },
    ];
    
    const timers: NodeJS.Timeout[] = [];
    
    timings.forEach(({ delay, nextPhase }) => {
      const timer = setTimeout(() => {
        setPhase(nextPhase);
      }, delay);
      timers.push(timer);
    });
    
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 4500);
    timers.push(exitTimer);
    
    return () => timers.forEach(clearTimeout);
  }, [isVisible, onComplete]);

  const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.04,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  };

  const renderAnimatedText = (text: string, startDelay: number = 0) => {
    return text.split("").map((char, i) => (
      <motion.span
        key={i}
        custom={i}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 10 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              delay: startDelay + i * 0.04,
              duration: 0.3,
              ease: "easeOut"
            }
          }
        }}
        className="inline-block"
        style={{ whiteSpace: char === " " ? "pre" : "normal" }}
      >
        {char}
      </motion.span>
    ));
  };

  if (!isVisible && phase === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6"
          style={{ backgroundColor: "#1a4320" }}
          data-testid="hero-intro-animation"
        >
          <div className="text-center space-y-4 md:space-y-6 max-w-4xl">
            {phase >= 1 && (
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {renderAnimatedText("Built for Business,")}
              </motion.h1>
            )}
            
            {phase >= 2 && (
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {renderAnimatedText("Payment Processing")}
              </motion.h1>
            )}
            
            {phase >= 3 && (
              <motion.p 
                className="text-xl md:text-2xl lg:text-3xl text-white/90 mt-6 md:mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {renderAnimatedText("The last payment processor you'll ever need")}
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
