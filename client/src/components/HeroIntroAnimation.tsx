import { useState, useEffect, RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";

interface HeroIntroAnimationProps {
  onComplete: () => void;
  onPhaseChange?: (phase: number) => void;
  heroHeadlineRef?: RefObject<HTMLSpanElement | null>;
  heroSubtitleRef?: RefObject<HTMLSpanElement | null>;
}

export function HeroIntroAnimation({ 
  onComplete, 
  onPhaseChange,
  heroHeadlineRef,
  heroSubtitleRef 
}: HeroIntroAnimationProps) {
  const [location] = useLocation();
  const isLandingPage = location === "/" || location === "/landing";
  
  const [isVisible, setIsVisible] = useState(isLandingPage);
  const [phase, setPhase] = useState(0);
  const [headlineRect, setHeadlineRect] = useState<DOMRect | null>(null);
  const [subtitleRect, setSubtitleRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isVisible) {
      onComplete();
      onPhaseChange?.(5);
      return;
    }
    
    const measureElements = () => {
      if (heroHeadlineRef?.current) {
        setHeadlineRect(heroHeadlineRef.current.getBoundingClientRect());
      }
      if (heroSubtitleRef?.current) {
        setSubtitleRect(heroSubtitleRef.current.getBoundingClientRect());
      }
    };

    measureElements();
    window.addEventListener('resize', measureElements);
    
    const timings = [
      { delay: 300, nextPhase: 1 },
      { delay: 1200, nextPhase: 2 },
      { delay: 2100, nextPhase: 3 },
      { delay: 3500, nextPhase: 4 },
      { delay: 4500, nextPhase: 5 },
    ];
    
    const timers: NodeJS.Timeout[] = [];
    
    timings.forEach(({ delay, nextPhase }) => {
      const timer = setTimeout(() => {
        setPhase(nextPhase);
        onPhaseChange?.(nextPhase);
      }, delay);
      timers.push(timer);
    });
    
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, 4800);
    timers.push(exitTimer);
    
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', measureElements);
    };
  }, [isVisible, onComplete, onPhaseChange, heroHeadlineRef, heroSubtitleRef]);

  const renderAnimatedText = (text: string) => {
    return text.split("").map((char, i) => (
      <motion.span
        key={i}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: i * 0.03,
          duration: 0.2,
          ease: "easeOut"
        }}
        className="inline-block"
        style={{ whiteSpace: char === " " ? "pre" : "normal" }}
      >
        {char}
      </motion.span>
    ));
  };

  if (!isVisible && phase === 0) return null;

  const isTransitioning = phase >= 4;
  const headerHeight = 80;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            initial={{ height: "100vh" }}
            animate={{ 
              height: isTransitioning ? `${headerHeight}px` : "100vh",
            }}
            exit={{ 
              height: `${headerHeight}px`,
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
            className="fixed z-[10000] pointer-events-none"
            initial={{ 
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              top: isTransitioning && headlineRect ? `${headlineRect.top}px` : "50%",
              left: isTransitioning && headlineRect ? `${headlineRect.left + headlineRect.width / 2}px` : "50%",
              x: "-50%",
              y: isTransitioning ? "0%" : "-50%",
              opacity: phase >= 5 ? 0 : 1,
            }}
            transition={{ 
              duration: 0.8, 
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <motion.div
              className="text-center whitespace-nowrap"
              animate={{
                backgroundColor: isTransitioning ? "#3c3a3b" : "transparent",
                paddingLeft: isTransitioning ? "16px" : "0px",
                paddingRight: isTransitioning ? "16px" : "0px",
                paddingTop: isTransitioning ? "8px" : "0px",
                paddingBottom: isTransitioning ? "12px" : "0px",
                borderRadius: isTransitioning ? "8px" : "0px",
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {phase >= 1 && (
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                  {renderAnimatedText("Built for Business,")}
                </span>
              )}
              {phase >= 2 && (
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white ml-2">
                  {renderAnimatedText("Payment Processing")}
                </span>
              )}
            </motion.div>
          </motion.div>
          
          {phase >= 3 && (
            <motion.div 
              className="fixed z-[10000] pointer-events-none"
              initial={{ 
                top: "55%",
                left: "50%",
                x: "-50%",
                opacity: 0,
              }}
              animate={{
                top: isTransitioning && subtitleRect ? `${subtitleRect.top}px` : "55%",
                left: isTransitioning && subtitleRect ? `${subtitleRect.left + subtitleRect.width / 2}px` : "50%",
                x: "-50%",
                y: isTransitioning ? "0%" : "0%",
                opacity: phase >= 5 ? 0 : 1,
              }}
              transition={{ 
                duration: 0.8, 
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <motion.div
                className="text-center whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  backgroundColor: isTransitioning ? "#3c3a3b" : "transparent",
                  paddingLeft: isTransitioning ? "12px" : "0px",
                  paddingRight: isTransitioning ? "12px" : "0px",
                  paddingTop: isTransitioning ? "4px" : "0px",
                  paddingBottom: isTransitioning ? "4px" : "0px",
                  borderRadius: isTransitioning ? "8px" : "0px",
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <span className="text-lg sm:text-xl md:text-2xl text-white font-semibold">
                  {renderAnimatedText("The last payment processor you'll ever need")}
                </span>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
