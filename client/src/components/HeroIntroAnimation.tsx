import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

interface HeroIntroAnimationProps {
  onComplete: () => void;
  headerLogoRef?: React.RefObject<HTMLImageElement | null>;
}

export function HeroIntroAnimation({ onComplete, headerLogoRef }: HeroIntroAnimationProps) {
  const [location] = useLocation();
  const isLandingPage = location === "/" || location === "/landing";
  
  const [isVisible, setIsVisible] = useState(isLandingPage);
  const [phase, setPhase] = useState(0);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const [logoFadingOut, setLogoFadingOut] = useState(false);
  const [targetPosition, setTargetPosition] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    if (headerLogoRef?.current && isCollapsing) {
      const rect = headerLogoRef.current.getBoundingClientRect();
      setTargetPosition({ left: rect.left, top: rect.top });
    }
  }, [headerLogoRef, isCollapsing]);

  useEffect(() => {
    if (!isVisible) {
      onComplete();
      return;
    }
    
    const timings = [
      { delay: 300, nextPhase: 1 },
      { delay: 1800, nextPhase: 2 },
      { delay: 2800, nextPhase: 3 },
      { delay: 5200, nextPhase: 4 },
      { delay: 6500, nextPhase: 5 },
    ];
    
    const timers: NodeJS.Timeout[] = [];
    
    timings.forEach(({ delay, nextPhase }) => {
      const timer = setTimeout(() => {
        setPhase(nextPhase);
        if (nextPhase === 5) {
          setIsCollapsing(true);
        }
      }, delay);
      timers.push(timer);
    });
    
    const fadeOutTimer = setTimeout(() => {
      setLogoFadingOut(true);
    }, 7300);
    timers.push(fadeOutTimer);
    
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 7600);
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
          >
            </motion.div>
          
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
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white flex flex-col lg:flex-row lg:items-baseline justify-center lg:gap-3 gap-2">
                <span className={`whitespace-nowrap ${phase >= 1 ? '' : 'invisible'}`}>
                  {phase >= 1 ? renderAnimatedText("Built for Business,") : "Built for Business,"}
                </span>
                <span className={`whitespace-nowrap ${phase >= 2 ? '' : 'invisible'}`}>
                  {phase >= 2 ? renderAnimatedText("Payment Processing") : "Payment Processing"}
                </span>
              </h1>
              
              <p className={`text-lg md:text-xl lg:text-2xl text-white/90 mt-6 md:mt-8 ${phase >= 3 ? '' : 'invisible'}`}>
                {phase >= 3 ? renderAnimatedText("The last payment processor you'll ever need") : "The last payment processor you'll ever need"}
              </p>
              
              <div className="mt-8 h-12" />
            </div>
          </motion.div>
          
          <motion.div
            className="fixed z-[10001] flex items-center"
            initial={{ 
              left: "50%",
              top: "50%",
              x: "-50%",
              y: 55,
              opacity: 0,
              scale: 1.5
            }}
            animate={{
              left: isCollapsing && targetPosition ? targetPosition.left : "50%",
              top: isCollapsing && targetPosition ? targetPosition.top : "50%",
              x: isCollapsing ? 0 : "-50%",
              y: isCollapsing ? 0 : 55,
              opacity: logoFadingOut ? 0 : phase >= 4 ? 1 : 0,
              scale: isCollapsing ? 1 : 1.5,
            }}
            transition={{
              left: { duration: 1, ease: [0.4, 0, 0.2, 1] },
              top: { duration: 1, ease: [0.4, 0, 0.2, 1] },
              x: { duration: 1, ease: [0.4, 0, 0.2, 1] },
              y: { duration: 1, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.2 },
              scale: { duration: 1, ease: [0.4, 0, 0.2, 1] },
            }}
          >
            <motion.img
              src="/attached_assets/Pig_Bank_Logo_new_y_copy_1767787947888.png"
              alt="PigBank"
              className="h-12 w-auto object-contain"
              initial={{ rotate: 0 }}
              animate={{
                rotate: phase >= 4 && !isCollapsing ? [0, -3, 3, -3, 3, 0] : 0,
              }}
              transition={{
                rotate: { 
                  delay: 0.5,
                  duration: 0.5, 
                  ease: "easeInOut",
                  times: [0, 0.2, 0.4, 0.6, 0.8, 1]
                },
              }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
