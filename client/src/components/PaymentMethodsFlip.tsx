import { useState, useEffect, useRef, useCallback } from "react";

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="12" width="56" height="40" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <rect x="4" y="20" width="56" height="10" fill="currentColor" opacity="0.3"/>
    <rect x="10" y="36" width="20" height="4" rx="1" fill="currentColor"/>
    <rect x="10" y="44" width="12" height="3" rx="1" fill="currentColor" opacity="0.5"/>
    <circle cx="46" cy="40" r="6" fill="currentColor" opacity="0.7"/>
    <circle cx="52" cy="40" r="6" fill="currentColor" opacity="0.5"/>
  </svg>
);

const ACHIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 6L4 22V26H60V22L32 6Z" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <rect x="8" y="26" width="6" height="24" fill="currentColor" opacity="0.3"/>
    <rect x="18" y="26" width="6" height="24" fill="currentColor" opacity="0.5"/>
    <rect x="29" y="26" width="6" height="24" fill="currentColor" opacity="0.3"/>
    <rect x="40" y="26" width="6" height="24" fill="currentColor" opacity="0.5"/>
    <rect x="50" y="26" width="6" height="24" fill="currentColor" opacity="0.3"/>
    <rect x="4" y="50" width="56" height="8" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <circle cx="32" cy="16" r="4" fill="currentColor"/>
  </svg>
);

const CryptoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <path d="M32 14V18M32 46V50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M24 22H38C41 22 44 24 44 28C44 32 41 34 38 34H24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M24 34H40C43 34 46 36 46 40C46 44 43 46 40 46H24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M24 18V50" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="1" opacity="0.3" fill="none"/>
  </svg>
);

const ECheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="14" width="50" height="36" rx="3" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <path d="M4 26H54" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
    <rect x="10" y="32" width="24" height="3" rx="1" fill="currentColor" opacity="0.5"/>
    <rect x="10" y="38" width="16" height="3" rx="1" fill="currentColor" opacity="0.3"/>
    <path d="M40 44L46 50L58 38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="50" cy="44" r="12" stroke="currentColor" strokeWidth="2" opacity="0.3" fill="none"/>
  </svg>
);

const ClickToPayIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="18" y="4" width="28" height="50" rx="4" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <rect x="22" y="10" width="20" height="32" rx="2" fill="currentColor" opacity="0.15"/>
    <circle cx="32" cy="48" r="3" fill="currentColor"/>
    <path d="M32 24L32 32M32 32L28 28M32 32L36 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 40C8 40 12 36 16 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    <path d="M4 44C4 44 10 38 18 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
    <path d="M48 40C48 40 52 36 56 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    <path d="M46 44C46 44 52 38 60 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
  </svg>
);

const cards = [
  {
    id: "credit-cards",
    title: "Credit Cards",
    backText: "Visa, Mastercard, Amex, Discover",
    Icon: CreditCardIcon,
  },
  {
    id: "ach",
    title: "ACH Transfers",
    backText: "Direct bank payments",
    Icon: ACHIcon,
  },
  {
    id: "crypto",
    title: "Cryptocurrency",
    backText: "Bitcoin, Ethereum & more",
    Icon: CryptoIcon,
  },
  {
    id: "echecks",
    title: "eChecks",
    backText: "Digital check processing",
    Icon: ECheckIcon,
  },
  {
    id: "click-to-pay",
    title: "Click to Pay",
    backText: "Send payment links via text or email",
    Icon: ClickToPayIcon,
  },
];

function FlipCard({
  card,
  isFlipped,
  onFlip,
  onUnflip,
  onToggle,
  prefersReducedMotion,
  isAutoFlipping,
}: {
  card: (typeof cards)[0];
  isFlipped: boolean;
  onFlip: () => void;
  onUnflip: () => void;
  onToggle: () => void;
  prefersReducedMotion: boolean;
  isAutoFlipping: boolean;
}) {
  const { Icon, title, backText } = card;
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice && !isAutoFlipping) {
      onFlip();
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice && !isAutoFlipping) {
      onUnflip();
    }
  };

  const handleClick = () => {
    if (isTouchDevice) {
      onToggle();
    }
  };

  if (prefersReducedMotion) {
    return (
      <div
        className="relative w-full aspect-square cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#51AB37] focus:ring-offset-2 rounded-2xl"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-pressed={isFlipped}
        data-testid={`flip-card-${card.id}`}
      >
        <div
          className={`absolute inset-0 bg-[#51AB37] rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center transition-opacity duration-300 ${
            isFlipped ? "opacity-0" : "opacity-100"
          }`}
        >
          <Icon className="w-16 h-16 md:w-20 md:h-20 text-white mb-3" />
          <h4 className="font-semibold text-white text-center text-sm md:text-base">{title}</h4>
        </div>
        <div
          className={`absolute inset-0 bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center transition-opacity duration-300 ${
            isFlipped ? "opacity-100" : "opacity-0"
          }`}
        >
          <Icon className="w-12 h-12 md:w-14 md:h-14 text-[#1a4320] mb-2" />
          <h4 className="font-semibold text-gray-900 text-center text-sm mb-1">{title}</h4>
          <p className="text-gray-600 text-xs text-center">{backText}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-square cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#51AB37] focus:ring-offset-2 rounded-2xl group"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed={isFlipped}
      data-testid={`flip-card-${card.id}`}
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative w-full h-full transition-transform duration-[350ms] ease-out group-hover:-translate-y-1"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 bg-[#51AB37] rounded-2xl shadow-lg hover:shadow-xl p-4 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Icon className="w-16 h-16 md:w-20 md:h-20 text-white mb-3" />
          <h4 className="font-semibold text-white text-center text-sm md:text-base">{title}</h4>
        </div>
        <div
          className="absolute inset-0 bg-white rounded-2xl shadow-lg hover:shadow-xl p-4 flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Icon className="w-12 h-12 md:w-14 md:h-14 text-[#1a4320] mb-2" />
          <h4 className="font-semibold text-gray-900 text-center text-sm mb-1">{title}</h4>
          <p className="text-gray-600 text-xs text-center">{backText}</p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentMethodsFlip() {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [hasAutoFlipped, setHasAutoFlipped] = useState(false);
  const [isAutoFlipping, setIsAutoFlipping] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (hasAutoFlipped || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasAutoFlipped) {
          setHasAutoFlipped(true);
          setIsAutoFlipping(true);

          cards.forEach((card, index) => {
            setTimeout(() => {
              setFlippedCards((prev) => {
                const newSet = new Set(prev);
                newSet.add(card.id);
                return newSet;
              });
            }, index * 120);
          });

          setTimeout(() => {
            setFlippedCards(new Set());
            setIsAutoFlipping(false);
          }, cards.length * 120 + 1500);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAutoFlipped, prefersReducedMotion]);

  const flipCard = useCallback((cardId: string) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      newSet.add(cardId);
      return newSet;
    });
  }, []);

  const unflipCard = useCallback((cardId: string) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      newSet.delete(cardId);
      return newSet;
    });
  }, []);

  const toggleCard = useCallback((cardId: string) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 md:py-16 bg-[#1a4320]"
      data-testid="section-payment-methods"
    >
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Accept payments your way
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Support cards, bank payments, crypto, checks, and payment links.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {cards.map((card) => (
            <FlipCard
              key={card.id}
              card={card}
              isFlipped={flippedCards.has(card.id)}
              onFlip={() => flipCard(card.id)}
              onUnflip={() => unflipCard(card.id)}
              onToggle={() => toggleCard(card.id)}
              prefersReducedMotion={prefersReducedMotion}
              isAutoFlipping={isAutoFlipping}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
