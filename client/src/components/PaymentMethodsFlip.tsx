import { useState, useEffect, useRef, useCallback } from "react";

const cards = [
  {
    id: "credit-cards",
    title: "Credit Cards",
    backText: "Visa, Mastercard, Amex, Discover",
    image: "/attached_assets/ChatGPT_Image_Dec_29,_2025,_06_07_44_PM_1767074862782.png",
  },
  {
    id: "ach",
    title: "ACH Transfers",
    backText: "Direct bank payments",
    image: "/attached_assets/ChatGPT_Image_Dec_29,_2025,_06_14_12_PM_1767074862781.png",
  },
  {
    id: "crypto",
    title: "Cryptocurrency",
    backText: "Bitcoin, Ethereum & more",
    image: "/attached_assets/ChatGPT_Image_Dec_29,_2025,_06_11_53_PM_1767074862781.png",
  },
  {
    id: "echecks",
    title: "eChecks",
    backText: "Digital check processing",
    image: "/attached_assets/ChatGPT_Image_Dec_29,_2025,_06_13_19_PM_1767074862781.png",
  },
  {
    id: "click-to-pay",
    title: "Click to Pay",
    backText: "Send payment links via text or email",
    image: "/attached_assets/ChatGPT_Image_Dec_30,_2025,_12_07_25_AM_1767074862780.png",
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    backText: "Recurring billing & memberships",
    image: "/attached_assets/generated_images/subscription_icon_dark_bg.png",
  },
  {
    id: "tap-to-pay",
    title: "Tap to Pay",
    backText: "Phone to phone contactless payments",
    image: "/attached_assets/generated_images/tap_to_pay_dark_bg.png",
  },
  {
    id: "apple-pay",
    title: "Apple Pay",
    backText: "Fast, secure mobile payments",
    image: "/attached_assets/generated_images/apple_pay_icon_dark_bg.png",
  },
  {
    id: "direct-input",
    title: "Direct Input",
    backText: "Manual card entry via virtual terminal",
    image: "/attached_assets/generated_images/direct_input_icon_dark_bg.png",
  },
  {
    id: "bnpl",
    title: "Buy Now Pay Later",
    backText: "Flexible installment payments",
    image: "/attached_assets/generated_images/bnpl_icon_dark_bg.png",
  },
  {
    id: "ipad-terminal",
    title: "iPad Terminal",
    backText: "In-person POS payments",
    image: "/attached_assets/generated_images/ipad_terminal_dark_bg.png",
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
  const { image, title, backText } = card;
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
          className={`absolute inset-0 bg-[#1a4320] rounded-2xl shadow-lg p-4 flex flex-col items-center justify-center transition-opacity duration-300 ${
            isFlipped ? "opacity-0" : "opacity-100"
          }`}
        >
          <img src={image} alt={title} className="w-32 h-32 md:w-36 md:h-36 object-contain mb-1" />
          <h4 className="font-semibold text-white text-center text-sm md:text-base">{title}</h4>
        </div>
        <div
          className={`absolute inset-0 bg-[#75c947] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center transition-opacity duration-300 ${
            isFlipped ? "opacity-100" : "opacity-0"
          }`}
        >
          <h4 className="font-bold text-white text-center text-base md:text-lg mb-2">{title}</h4>
          <p className="text-white/90 text-sm text-center">{backText}</p>
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
          className="absolute inset-0 bg-[#1a4320] rounded-2xl shadow-lg hover:shadow-xl p-4 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img src={image} alt={title} className="w-32 h-32 md:w-36 md:h-36 object-contain mb-1" />
          <h4 className="font-semibold text-white text-center text-sm md:text-base">{title}</h4>
        </div>
        <div
          className="absolute inset-0 bg-[#75c947] rounded-2xl shadow-lg hover:shadow-xl p-6 flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <h4 className="font-bold text-white text-center text-base md:text-lg mb-2">{title}</h4>
          <p className="text-white/90 text-sm text-center">{backText}</p>
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
      className="py-12 md:py-16 bg-[#ffffff]"
      data-testid="section-payment-methods"
    >
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Accept payments your way
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Support cards, bank payments, crypto, subscriptions, tap-to-pay, and more.
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
