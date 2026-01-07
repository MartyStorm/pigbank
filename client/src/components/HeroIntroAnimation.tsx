import { useState, useEffect, useRef, RefObject, useCallback } from "react";
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
  const hasStartedRef = useRef(false);

  const measureElements = useCallback(() => {
    if (heroHeadlineRef?.current) {
      setHeadlineRect(heroHeadlineRef.current.getBoundingClientRect());
    }
    if (heroSubtitleRef?.current) {
      setSubtitleRect(heroSubtitleRef.current.getBoundingClientRect());
    }
  }, [heroHeadlineRef, heroSubtitleRef]);

  useEffect(() => {
    if (!isVisible || hasStartedRef.current) {
      if (!isVisible) {
        onComplete();
        onPhaseChange?.(5);
      }
      return;
    }
    
    hasStartedRef.current = true;
    
    setTimeout(measureElements, 100);
    
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
        if (nextPhase === 4) {
          measureElements();
        }
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
    };
  }, [isVisible, onComplete, onPhaseChange, measureElements]);

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
              initial={{ backgroundColor: "rgba(60, 58, 59, 0)" }}
              animate={{
                backgroundColor: isTransitioning ? "rgba(60, 58, 59, 1)" : "rgba(60, 58, 59, 0)",
                paddingLeft: isTransitioning ? 16 : 0,
                paddingRight: isTransitioning ? 16 : 0,
                paddingTop: isTransitioning ? 8 : 0,
                paddingBottom: isTransitioning ? 12 : 0,
                borderRadius: isTransitioning ? 8 : 0,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.span 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 1 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                Built for Business,
              </motion.span>
              <motion.span 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white ml-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase >= 2 ? 1 : 0 }}
                transition={{ duration: 0.5 }}
              >
                Payment Processing
              </motion.span>
            </motion.div>
          </motion.div>
          
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
              opacity: phase >= 3 ? (phase >= 5 ? 0 : 1) : 0,
            }}
            transition={{ 
              duration: 0.8, 
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <motion.div
              className="text-center whitespace-nowrap"
              initial={{ backgroundColor: "rgba(60, 58, 59, 0)" }}
              animate={{
                backgroundColor: isTransitioning ? "rgba(60, 58, 59, 1)" : "rgba(60, 58, 59, 0)",
                paddingLeft: isTransitioning ? 12 : 0,
                paddingRight: isTransitioning ? 12 : 0,
                paddingTop: isTransitioning ? 4 : 0,
                paddingBottom: isTransitioning ? 4 : 0,
                borderRadius: isTransitioning ? 8 : 0,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <span className="text-lg sm:text-xl md:text-2xl text-white font-semibold">
                The last payment processor you'll ever need
              </span>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
