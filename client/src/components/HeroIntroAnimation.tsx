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
  const [isCollapsing, setIsCollapsing] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      onComplete();
      return;
    }
    
    const timings = [
      { delay: 300, nextPhase: 1 },
      { delay: 1800, nextPhase: 2 },
      { delay: 2800, nextPhase: 3 },
      { delay: 4200, nextPhase: 4 },
    ];
    
    const timers: NodeJS.Timeout[] = [];
    
    timings.forEach(({ delay, nextPhase }) => {
      const timer = setTimeout(() => {
        setPhase(nextPhase);
        if (nextPhase === 4) {
          setIsCollapsing(true);
        }
      }, delay);
      timers.push(timer);
    });
    
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 5300);
    timers.push(exitTimer);
    
    return () => timers.forEach(clearTimeout);
  }, [isVisible, onComplete]);

  const renderAnimatedText = (text: string, startDelay: number = 0) => {
    const words = text.split(" ");
    let charIndex = 0;
    
    return words.map((word, wordIndex) => (
      <span key={wordIndex} className="inline-block whitespace-nowrap">
        {word.split("").map((char, i) => {
          const currentCharIndex = charIndex++;
          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: startDelay + currentCharIndex * 0.04,
                duration: 0.3,
                ease: "easeOut"
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          );
        })}
        {wordIndex < words.length - 1 && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: startDelay + charIndex++ * 0.04, duration: 0.1 }}
            className="inline-block"
          >
            &nbsp;
          </motion.span>
        )}
      </span>
    ));
  };

  if (!isVisible && phase === 0) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ height: "100vh" }}
            animate={{ 
              height: isCollapsing ? "80px" : "100vh",
            }}
            exit={{ 
              height: "80px",
              transition: { duration: 0.1 }
            }}
            transition={{ 
              height: { duration: 1, ease: [0.4, 0, 0.2, 1] }
            }}
            className="fixed top-0 left-0 right-0 z-[9999] overflow-hidden"
            style={{ backgroundColor: "#1a4320" }}
            data-testid="hero-intro-animation"
          />
          
          <motion.div 
            className="fixed inset-0 z-[10000] flex items-center justify-center px-6 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{
              opacity: isCollapsing ? 0 : 1,
              y: isCollapsing ? "-30vh" : 0,
              scale: isCollapsing ? 0.85 : 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <div className="text-center w-full px-4">
              <div className="flex flex-col lg:flex-row lg:items-baseline lg:justify-center lg:gap-3 gap-2">
                {phase >= 1 && (
                  <motion.h1 
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {renderAnimatedText("Built for Business,")}
                  </motion.h1>
                )}
                
                {phase >= 2 && (
                  <motion.h1 
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-white whitespace-nowrap"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {renderAnimatedText("Payment Processing")}
                  </motion.h1>
                )}
              </div>
              
              {phase >= 3 && (
                <motion.p 
                  className="text-lg md:text-xl lg:text-2xl text-white/90 mt-6 md:mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {renderAnimatedText("The last payment processor you'll ever need")}
                </motion.p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
