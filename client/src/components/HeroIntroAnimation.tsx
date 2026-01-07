import { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
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
  const [showCombinedLogo, setShowCombinedLogo] = useState(false);

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
      { delay: 6200, action: 'showCombinedLogo' },
      { delay: 6500, nextPhase: 5 },
    ];
    
    const timers: NodeJS.Timeout[] = [];
    
    timings.forEach(({ delay, nextPhase, action }) => {
      const timer = setTimeout(() => {
        if (action === 'showCombinedLogo') {
          setShowCombinedLogo(true);
        } else if (nextPhase !== undefined) {
          setPhase(nextPhase);
          if (nextPhase === 5) {
            setIsCollapsing(true);
          }
        }
      }, delay);
      timers.push(timer);
    });
    
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
          
          <LayoutGroup>
            <motion.div
              className="fixed z-[10001] flex items-center gap-2"
              initial={{ 
                left: "50%",
                top: "50%",
                x: "-50%",
                y: 60,
                opacity: 0,
                scale: 1.2
              }}
              animate={{
                left: isCollapsing ? "16px" : "50%",
                top: isCollapsing ? "40px" : "50%",
                x: isCollapsing ? 0 : "-50%",
                y: isCollapsing ? "-50%" : 60,
                opacity: phase >= 4 ? 1 : 0,
                scale: isCollapsing ? 1 : 1.2,
              }}
              transition={{
                left: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
                top: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
                x: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
                y: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
                opacity: { duration: 0.5 },
                scale: { duration: 1, ease: [0.25, 0.1, 0.25, 1] },
              }}
            >
              <AnimatePresence mode="wait">
                {!showCombinedLogo ? (
                  <motion.div 
                    key="separate"
                    className="flex items-center gap-2"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.img
                      src="/attached_assets/Favacon_Pigbank_1767785903584.png"
                      alt="PigBank mascot"
                      className="h-12 w-auto object-contain"
                      initial={{ rotate: 0 }}
                      animate={{
                        rotate: phase >= 4 && !showCombinedLogo ? [0, -8, 8, -8, 8, 0] : 0,
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
                    <span className="text-white text-2xl font-bold whitespace-nowrap">
                      Pig<span className="text-[#73cb43]">Bank</span>
                    </span>
                  </motion.div>
                ) : (
                  <motion.img
                    key="combined"
                    layoutId="pigbank-header-logo"
                    src="/attached_assets/Pig_Bank_Logo_new_copy_1767532854610.png"
                    alt="PigBank"
                    className="h-12 w-auto object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </>
      )}
    </AnimatePresence>
  );
}
