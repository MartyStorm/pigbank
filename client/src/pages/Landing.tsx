import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { 
  Shield, 
  TrendingUp, 
  Zap, 
  Lock, 
  BarChart3,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  FileText,
  Globe,
  Wallet,
  ChevronDown,
  Play,
  Smartphone,
  Store,
  Globe2,
  Receipt,
  RefreshCcw,
  Monitor,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Bitcoin,
  MapPin,
  ShieldCheck,
  Calendar,
  Clock,
  Pause,
  Play as PlayIcon,
  Settings,
  Headphones,
  Users
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import testimonial1 from "@assets/stock_images/professional_busines_474b617c.jpg";
import testimonial2 from "@assets/stock_images/professional_busines_a263e9a1.jpg";
import testimonial3 from "@assets/stock_images/professional_busines_1f8f6e40.jpg";
import testimonial4 from "@assets/stock_images/professional_busines_8f8097a7.jpg";
import moneyImage from "@assets/stock_images/stack_of_money_cash__c01d6a2c.jpg";

const floatingCards = [
  {
    icon: CreditCard,
    title: "Payments",
    color: "bg-[#203e22]",
    position: "left-0 top-24",
  },
  {
    icon: Shield,
    title: "Fraud Protection",
    color: "bg-gray-700",
    position: "left-16 bottom-12",
  },
  {
    icon: FileText,
    title: "Invoicing",
    color: "bg-amber-700",
    position: "left-4 bottom-48",
  },
  {
    icon: Zap,
    title: "Payouts",
    color: "bg-violet-600",
    position: "right-0 top-16",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    color: "bg-black",
    position: "right-16 bottom-24",
  },
  {
    icon: Globe,
    title: "Global",
    color: "bg-[#73cb43]",
    position: "right-4 top-56",
  },
];

const navItems = [
  { label: "Products", hasDropdown: true, href: "#" },
  { label: "Integrations", hasDropdown: false, href: "/public-integrations" },
  { label: "Pricing", hasDropdown: false, href: "/public-pricing" },
  { label: "Contact", hasDropdown: false, href: "/public-contact" },
];

const productMenuItems = {
  paymentTypes: [
    { icon: CreditCard, title: "Credit card processing", description: "Secure payments for all merchants" },
    { icon: Receipt, title: "eCheck", description: "Reliable electronic processing" },
    { icon: Bitcoin, title: "Crypto", description: "Accept digital currencies globally" },
    { icon: MapPin, title: "LocalPay", description: "Payments in your market" },
  ],
  valueAddedServices: [
    { icon: Wallet, title: "Digital wallets", description: "Modern mobile payment solutions" },
    { icon: ShieldCheck, title: "Chargeback management", description: "Advanced revenue protection" },
    { icon: Calendar, title: "Subscriptions", description: "Scale your recurring revenue" },
    { icon: Clock, title: "Buy now pay later", description: "Boost sales with flexible options" },
  ],
};


const featureCards = [
  { icon: Store, title: "In-Person Payments", color: "bg-[#203e22]", x: -180, y: -120 },
  { icon: Globe2, title: "Online Checkout", color: "bg-[#73cb43]", x: 180, y: -100 },
  { icon: Receipt, title: "Invoices & Pay Links", color: "bg-amber-600", x: -200, y: 40 },
  { icon: RefreshCcw, title: "Subscriptions", color: "bg-violet-600", x: 200, y: 60 },
  { icon: Monitor, title: "Virtual Terminal", color: "bg-gray-700", x: -160, y: 180 },
  { icon: Banknote, title: "Fast Payouts", color: "bg-emerald-600", x: 160, y: 160 },
];

const testimonials = [
  {
    id: 1,
    quote: "PigBank completely transformed how we handle payments. Our chargebacks dropped by 60% and our approval rates went through the roof.",
    name: "Sarah Mitchell",
    title: "CEO, TechStart Inc.",
    image: testimonial1,
  },
  {
    id: 2,
    quote: "After being rejected by three other processors, PigBank gave us a chance. Now we're processing over $500K monthly with zero issues.",
    name: "Marcus Chen",
    title: "Founder, Digital Commerce Co.",
    image: testimonial2,
  },
  {
    id: 3,
    quote: "The fraud protection is incredible. We've saved thousands in potential chargebacks. PigBank pays for itself many times over.",
    name: "Elena Rodriguez",
    title: "CFO, Global Retail Solutions",
    image: testimonial3,
  },
  {
    id: 4,
    quote: "Fast payouts, excellent support, and rates that actually make sense. PigBank is everything we needed in a payment processor.",
    name: "James Thompson",
    title: "Owner, Premium Services LLC",
    image: testimonial4,
  },
];

function HorizontalScrollText() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  const textX = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 bg-white overflow-hidden"
    >
      <div className="text-center mb-8">
        <p className="text-xs md:text-sm font-semibold text-gray-900 uppercase tracking-[0.2em]">
          A BETTER WAY TO PAY
        </p>
      </div>
      
      <div className="relative">
        <motion.div 
          className="flex whitespace-nowrap"
          style={{ x: textX }}
        >
          {[...Array(4)].map((_, i) => (
            <span 
              key={i}
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-gray-200 mx-4"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Why PigBank - 
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AppleScrollSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  const cardOpacity = useTransform(smoothProgress, [0, 0.15, 0.35], [1, 1, 0]);
  const cardScale = useTransform(smoothProgress, [0, 0.15, 0.35], [1, 1, 0.8]);
  
  const circleScale = useTransform(smoothProgress, [0.2, 0.6], [1, 12]);
  const circleOpacity = useTransform(smoothProgress, [0.2, 0.4, 0.75, 0.85], [0, 1, 1, 0]);
  
  const headlineOpacity = useTransform(smoothProgress, [0.45, 0.6], [0, 1]);
  const headlineY = useTransform(smoothProgress, [0.45, 0.6], [60, 0]);

  const phoneOpacity = useTransform(smoothProgress, [0.35, 0.5], [1, 0]);
  const phoneScale = useTransform(smoothProgress, [0.35, 0.5], [1, 0.9]);

  const card0X = useTransform(smoothProgress, [0.1, 0.35], [0, -360]);
  const card0Y = useTransform(smoothProgress, [0.1, 0.35], [0, -180]);
  const card1X = useTransform(smoothProgress, [0.1, 0.35], [0, 360]);
  const card1Y = useTransform(smoothProgress, [0.1, 0.35], [0, -150]);
  const card2X = useTransform(smoothProgress, [0.1, 0.35], [0, -400]);
  const card2Y = useTransform(smoothProgress, [0.1, 0.35], [0, 60]);
  const card3X = useTransform(smoothProgress, [0.1, 0.35], [0, 400]);
  const card3Y = useTransform(smoothProgress, [0.1, 0.35], [0, 90]);
  const card4X = useTransform(smoothProgress, [0.1, 0.35], [0, -320]);
  const card4Y = useTransform(smoothProgress, [0.1, 0.35], [0, 270]);
  const card5X = useTransform(smoothProgress, [0.1, 0.35], [0, 320]);
  const card5Y = useTransform(smoothProgress, [0.1, 0.35], [0, 240]);

  const cardTransforms = [
    { x: card0X, y: card0Y },
    { x: card1X, y: card1Y },
    { x: card2X, y: card2Y },
    { x: card3X, y: card3Y },
    { x: card4X, y: card4Y },
    { x: card5X, y: card5Y },
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative bg-white"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <motion.div 
          className="absolute rounded-full bg-[#f5efe4]"
          style={{
            width: 280,
            height: 280,
            scale: circleScale,
            opacity: circleOpacity,
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            {featureCards.map((card, index) => {
              const transforms = cardTransforms[index];
              return (
                <motion.div
                  key={card.title}
                  className={`absolute ${card.color} rounded-2xl p-4 shadow-lg min-w-[120px]`}
                  style={{
                    x: transforms.x,
                    y: transforms.y,
                    opacity: cardOpacity,
                    scale: cardScale,
                    left: "50%",
                    top: "50%",
                    marginLeft: card.x - 60,
                    marginTop: card.y - 30,
                  }}
                >
                  <card.icon className="h-6 w-6 text-white mb-2" />
                  <span className="text-white text-sm font-medium whitespace-nowrap">{card.title}</span>
                </motion.div>
              );
            })}

            <motion.div 
              className="relative bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl z-20"
              style={{
                opacity: phoneOpacity,
                scale: phoneScale,
              }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-xl z-30" />
              <div className="bg-white rounded-[2rem] overflow-hidden w-[220px] md:w-[260px] h-[440px] md:h-[520px]">
                <div className="bg-[#203e22] p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/60 text-xs">×</span>
                    <img src="/favicon.png" alt="PigBank" className="h-5 w-5" />
                  </div>
                  <p className="text-white/70 text-xs mb-1">Your total Balance</p>
                  <p className="text-white text-2xl md:text-3xl font-bold">$47,892</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-white/60">Return: $12,450</span>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-3 text-xs">
                    <span className="text-gray-500">$47,892 today</span>
                  </div>
                  <div className="h-32 flex items-end gap-1">
                    {[35, 42, 38, 55, 48, 62, 58, 75, 68, 82, 78, 95].map((h, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-gradient-to-t from-[#73cb43] to-[#9ee068] rounded-t"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                    <span>Jan</span>
                    <span>Dec</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <div className="flex-1 bg-gray-100 rounded-full py-2 px-3 text-xs text-center">
                      <span className="text-gray-600">Years: </span>
                      <span className="font-semibold text-[#73cb43]">5</span>
                    </div>
                    <div className="flex-1 bg-gray-100 rounded-full py-2 px-3 text-xs text-center">
                      <span className="text-gray-600">Return: </span>
                      <span className="font-semibold text-[#73cb43]">12%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-30"
            style={{
              opacity: headlineOpacity,
              y: headlineY,
            }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 max-w-4xl mb-6">
              One platform for every way you get paid
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
              Accept payments in-person, online, or on-the-go. PigBank handles it all.
            </p>
            <Button 
              asChild
              size="lg" 
              className="bg-[#73cb43] hover:bg-[#65b53b] text-white rounded-full px-8 shadow-lg"
              data-testid="button-learn-payments"
            >
              <a href="/register">
                Start accepting payments
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollPrev = useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const scrollTo = useCallback((index: number) => {
    api?.scrollTo(index);
  }, [api]);

  useEffect(() => {
    if (!api) return;
    
    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="bg-[#1a1a1a] py-16 md:py-24 relative">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-xs md:text-sm font-semibold text-[#73cb43] uppercase tracking-[0.2em]">
            TRUSTED BY MERCHANTS
          </p>
        </div>
        
        <div className="relative">
          <button
            onClick={scrollPrev}
            className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
            data-testid="button-testimonial-prev"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          
          <button
            onClick={scrollNext}
            className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
            data-testid="button-testimonial-next"
          >
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>

          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto px-12 md:px-16"
          >
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id}>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="order-2 lg:order-1">
                      <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-relaxed mb-8">
                        "{testimonial.quote}"
                      </blockquote>
                      <div>
                        <p className="text-[#73cb43] font-semibold uppercase tracking-wider text-sm">
                          {testimonial.name}, {testimonial.title}
                        </p>
                      </div>
                    </div>
                    <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                      <div 
                        className="relative w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, #9ee068 0%, #73cb43 50%, #4a9a2a 100%)'
                        }}
                      >
                        <img 
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover object-top mix-blend-luminosity opacity-90"
                          data-testid={`img-testimonial-${testimonial.id}`}
                        />
                        <div className="absolute bottom-4 right-4 bg-white rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
                          <img src="/favicon.png" alt="PigBank" className="h-5 w-5" />
                          <span className="text-xs font-medium text-gray-900">PigBank</span>
                          <span className="text-xs text-gray-500">Payment Processing</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === current ? 'bg-[#73cb43]' : 'bg-white/30'
              }`}
              data-testid={`button-testimonial-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  const [transactionVolume, setTransactionVolume] = useState(50000);
  const [scrollY, setScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { setTheme } = useTheme();
  
  // Hero carousel state
  const [heroApi, setHeroApi] = useState<CarouselApi>();
  const [heroCurrentSlide, setHeroCurrentSlide] = useState(0);
  const [heroIsPaused, setHeroIsPaused] = useState(false);
  const [heroProgress, setHeroProgress] = useState(0);
  const heroSlideCount = 4;
  const heroSlideDuration = 10000; // 10 seconds

  // Hero carousel slide selection
  useEffect(() => {
    if (!heroApi) return;

    setHeroCurrentSlide(heroApi.selectedScrollSnap());

    const onSelect = () => {
      setHeroCurrentSlide(heroApi.selectedScrollSnap());
      setHeroProgress(0); // Reset progress when slide changes
    };

    heroApi.on("select", onSelect);

    return () => {
      heroApi.off("select", onSelect);
    };
  }, [heroApi]);

  // Hero carousel auto-play with progress
  useEffect(() => {
    if (!heroApi || heroIsPaused) return;

    const progressInterval = 50; // Update progress every 50ms
    const progressIncrement = (progressInterval / heroSlideDuration) * 100;

    const timer = setInterval(() => {
      setHeroProgress((prev) => {
        if (prev >= 100) {
          // Move to next slide
          if (heroApi.canScrollNext()) {
            heroApi.scrollNext();
          } else {
            heroApi.scrollTo(0);
          }
          return 0;
        }
        return prev + progressIncrement;
      });
    }, progressInterval);

    return () => clearInterval(timer);
  }, [heroApi, heroIsPaused]);

  // Force light theme on landing page
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      if (currentScrollY < 10) {
        setHeaderVisible(true);
      } else if (currentScrollY < lastScrollY.current) {
        setHeaderVisible(true);
      } else {
        setHeaderVisible(false);
      }
      
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const calculateFees = (volume: number) => {
    const rate = 0.029;
    const perTransaction = 0.30;
    const avgTransactionSize = 85;
    const numTransactions = Math.round(volume / avgTransactionSize);
    const fees = (volume * rate) + (numTransactions * perTransaction);
    return {
      fees: fees.toFixed(2),
      saved: (volume * 0.01).toFixed(2),
    };
  };

  const { fees, saved } = calculateFees(transactionVolume);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-10">
            <img 
              src="/pig-bank-logo-light.png" 
              alt="PigBank" 
              className="h-12 w-auto object-contain" 
              data-testid="logo-header"
            />
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.hasDropdown ? (
                    <button 
                      className="flex items-center gap-1 text-base text-gray-700 hover:text-gray-900 transition-colors py-6"
                      data-testid={`nav-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  ) : (
                    <a 
                      href={item.href}
                      className="flex items-center gap-1 text-base text-gray-700 hover:text-gray-900 transition-colors py-6"
                      data-testid={`nav-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </a>
                  )}
                  {item.label === "Products" && (
                    <div className="absolute top-full -left-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white rounded-b-xl shadow-2xl min-w-[600px]">
                        <div className="flex justify-center pt-1 pb-3">
                          <div className="w-[90%] h-0.5 bg-[#73cb43] rounded-full"></div>
                        </div>
                        <div className="px-6 pb-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <p className="text-xs font-semibold text-[#73cb43] uppercase tracking-wider mb-4">Payment Types</p>
                              <div className="space-y-3">
                                {productMenuItems.paymentTypes.map((product) => (
                                  <a key={product.title} href="#" className="flex items-start gap-3 group/item p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-[#203e22] flex items-center justify-center flex-shrink-0">
                                      <product.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-gray-900 font-medium group-hover/item:text-[#73cb43] transition-colors">{product.title}</p>
                                      <p className="text-gray-500 text-sm">{product.description}</p>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-[#73cb43] uppercase tracking-wider mb-4">Value-Added Services</p>
                              <div className="space-y-3">
                                {productMenuItems.valueAddedServices.map((service) => (
                                  <a key={service.title} href="#" className="flex items-start gap-3 group/item p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-[#203e22] flex items-center justify-center flex-shrink-0">
                                      <service.icon className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-gray-900 font-medium group-hover/item:text-[#73cb43] transition-colors">{service.title}</p>
                                      <p className="text-gray-500 text-sm">{service.description}</p>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-5" style={{ marginRight: '11px' }}>
            <a 
              href="/login" 
              className="text-base text-gray-700 hover:text-gray-900 transition-colors hidden sm:block"
              data-testid="link-login"
            >
              Log in
            </a>
            <a 
              href="/register"
              className="bg-[#73cb43] hover:bg-[#65b53b] text-white font-medium px-5 py-2 rounded-md transition-colors"
              data-testid="button-get-started-header"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      <main>
        <section 
          className="overflow-hidden relative"
          style={{
            background: 'radial-gradient(ellipse at center, #9ee068 0%, #73cb43 40%, #5ab032 70%, #4a9a2a 100%)'
          }}
        >
          <Carousel
            setApi={setHeroApi}
            opts={{ loop: true }}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {/* Slide 1: Personal service */}
              <CarouselItem className="pl-0">
                <div 
                  className="relative overflow-hidden"
                  style={{
                    background: 'radial-gradient(ellipse at center, #9ee068 0%, #73cb43 40%, #5ab032 70%, #4a9a2a 100%)'
                  }}
                >
                  {/* Falling dollar bills with realistic paper bending animation */}
                  <style>{`
                    /* Fall pattern 1: Gentle flutter with full flip */
                    @keyframes fall1 {
                      0% { transform: translateY(-120px) translateX(0) rotateX(0deg) rotateY(0deg) rotateZ(-10deg); }
                      15% { transform: translateY(calc(15vh)) translateX(25px) rotateX(45deg) rotateY(-30deg) rotateZ(15deg); }
                      30% { transform: translateY(calc(30vh)) translateX(-20px) rotateX(-30deg) rotateY(60deg) rotateZ(-20deg); }
                      45% { transform: translateY(calc(45vh)) translateX(30px) rotateX(60deg) rotateY(-45deg) rotateZ(25deg); }
                      60% { transform: translateY(calc(60vh)) translateX(-25px) rotateX(-45deg) rotateY(90deg) rotateZ(-15deg); }
                      75% { transform: translateY(calc(75vh)) translateX(20px) rotateX(30deg) rotateY(-60deg) rotateZ(30deg); }
                      90% { transform: translateY(calc(90vh)) translateX(-15px) rotateX(-60deg) rotateY(45deg) rotateZ(-25deg); }
                      100% { transform: translateY(calc(115vh)) translateX(10px) rotateX(15deg) rotateY(-30deg) rotateZ(10deg); }
                    }
                    /* Fall pattern 2: Tumbling with 360 flip */
                    @keyframes fall2 {
                      0% { transform: translateY(-100px) translateX(0) rotateX(0deg) rotateY(0deg) rotateZ(20deg); }
                      12% { transform: translateY(calc(12vh)) translateX(-30px) rotateX(90deg) rotateY(45deg) rotateZ(-10deg); }
                      25% { transform: translateY(calc(25vh)) translateX(25px) rotateX(180deg) rotateY(-30deg) rotateZ(35deg); }
                      37% { transform: translateY(calc(37vh)) translateX(-20px) rotateX(270deg) rotateY(60deg) rotateZ(-25deg); }
                      50% { transform: translateY(calc(50vh)) translateX(35px) rotateX(360deg) rotateY(-45deg) rotateZ(15deg); }
                      62% { transform: translateY(calc(62vh)) translateX(-25px) rotateX(270deg) rotateY(90deg) rotateZ(-30deg); }
                      75% { transform: translateY(calc(75vh)) translateX(20px) rotateX(180deg) rotateY(-60deg) rotateZ(20deg); }
                      87% { transform: translateY(calc(87vh)) translateX(-30px) rotateX(90deg) rotateY(45deg) rotateZ(-15deg); }
                      100% { transform: translateY(calc(115vh)) translateX(15px) rotateX(0deg) rotateY(-30deg) rotateZ(25deg); }
                    }
                    /* Fall pattern 3: Side-heavy drift */
                    @keyframes fall3 {
                      0% { transform: translateY(-80px) translateX(0) rotateX(-15deg) rotateY(20deg) rotateZ(-25deg); }
                      10% { transform: translateY(calc(10vh)) translateX(40px) rotateX(50deg) rotateY(-40deg) rotateZ(30deg); }
                      25% { transform: translateY(calc(25vh)) translateX(-35px) rotateX(-40deg) rotateY(70deg) rotateZ(-35deg); }
                      40% { transform: translateY(calc(40vh)) translateX(45px) rotateX(70deg) rotateY(-50deg) rotateZ(25deg); }
                      55% { transform: translateY(calc(55vh)) translateX(-40px) rotateX(-55deg) rotateY(80deg) rotateZ(-20deg); }
                      70% { transform: translateY(calc(70vh)) translateX(35px) rotateX(45deg) rotateY(-70deg) rotateZ(40deg); }
                      85% { transform: translateY(calc(85vh)) translateX(-30px) rotateX(-35deg) rotateY(60deg) rotateZ(-30deg); }
                      100% { transform: translateY(calc(115vh)) translateX(20px) rotateX(25deg) rotateY(-40deg) rotateZ(15deg); }
                    }
                    /* Fall pattern 4: Spiraling descent */
                    @keyframes fall4 {
                      0% { transform: translateY(-150px) translateX(0) rotateX(30deg) rotateY(-20deg) rotateZ(0deg); }
                      8% { transform: translateY(calc(8vh)) translateX(20px) rotateX(-45deg) rotateY(45deg) rotateZ(45deg); }
                      16% { transform: translateY(calc(16vh)) translateX(-25px) rotateX(60deg) rotateY(-60deg) rotateZ(90deg); }
                      25% { transform: translateY(calc(25vh)) translateX(30px) rotateX(-75deg) rotateY(75deg) rotateZ(135deg); }
                      33% { transform: translateY(calc(33vh)) translateX(-35px) rotateX(80deg) rotateY(-80deg) rotateZ(180deg); }
                      42% { transform: translateY(calc(42vh)) translateX(25px) rotateX(-65deg) rotateY(65deg) rotateZ(225deg); }
                      50% { transform: translateY(calc(50vh)) translateX(-20px) rotateX(50deg) rotateY(-50deg) rotateZ(270deg); }
                      58% { transform: translateY(calc(58vh)) translateX(35px) rotateX(-40deg) rotateY(40deg) rotateZ(315deg); }
                      67% { transform: translateY(calc(67vh)) translateX(-30px) rotateX(55deg) rotateY(-55deg) rotateZ(360deg); }
                      75% { transform: translateY(calc(75vh)) translateX(25px) rotateX(-70deg) rotateY(70deg) rotateZ(315deg); }
                      83% { transform: translateY(calc(83vh)) translateX(-20px) rotateX(45deg) rotateY(-45deg) rotateZ(270deg); }
                      92% { transform: translateY(calc(92vh)) translateX(30px) rotateX(-30deg) rotateY(30deg) rotateZ(225deg); }
                      100% { transform: translateY(calc(115vh)) translateX(-15px) rotateX(20deg) rotateY(-20deg) rotateZ(180deg); }
                    }
                    /* Fall pattern 5: Lazy float */
                    @keyframes fall5 {
                      0% { transform: translateY(-130px) translateX(0) rotateX(-20deg) rotateY(15deg) rotateZ(30deg); }
                      20% { transform: translateY(calc(20vh)) translateX(35px) rotateX(40deg) rotateY(-50deg) rotateZ(-20deg); }
                      40% { transform: translateY(calc(40vh)) translateX(-30px) rotateX(-50deg) rotateY(65deg) rotateZ(35deg); }
                      60% { transform: translateY(calc(60vh)) translateX(40px) rotateX(35deg) rotateY(-40deg) rotateZ(-25deg); }
                      80% { transform: translateY(calc(80vh)) translateX(-25px) rotateX(-40deg) rotateY(55deg) rotateZ(40deg); }
                      100% { transform: translateY(calc(115vh)) translateX(15px) rotateX(25deg) rotateY(-35deg) rotateZ(-15deg); }
                    }
                    /* Fall pattern 6: Quick tumble with back flip */
                    @keyframes fall6 {
                      0% { transform: translateY(-90px) translateX(0) rotateX(0deg) rotateY(180deg) rotateZ(-15deg); }
                      14% { transform: translateY(calc(14vh)) translateX(-35px) rotateX(120deg) rotateY(120deg) rotateZ(25deg); }
                      28% { transform: translateY(calc(28vh)) translateX(30px) rotateX(240deg) rotateY(60deg) rotateZ(-35deg); }
                      42% { transform: translateY(calc(42vh)) translateX(-25px) rotateX(360deg) rotateY(0deg) rotateZ(20deg); }
                      56% { transform: translateY(calc(56vh)) translateX(40px) rotateX(240deg) rotateY(-60deg) rotateZ(-25deg); }
                      70% { transform: translateY(calc(70vh)) translateX(-30px) rotateX(120deg) rotateY(-120deg) rotateZ(30deg); }
                      84% { transform: translateY(calc(84vh)) translateX(25px) rotateX(60deg) rotateY(-180deg) rotateZ(-20deg); }
                      100% { transform: translateY(calc(115vh)) translateX(-20px) rotateX(0deg) rotateY(-240deg) rotateZ(15deg); }
                    }
                    .bill-container { perspective: 1000px; transform-style: preserve-3d; }
                    .falling-bill { 
                      transform-style: preserve-3d; 
                      backface-visibility: visible;
                      will-change: transform;
                    }
                  `}</style>
                  <div className="absolute inset-0 overflow-hidden pointer-events-none bill-container">
                    {/* Bill 1 - smooth paper curl with all 4 edges and synced ellipse */}
                    <svg className="absolute left-[3%] w-16 h-12 opacity-35 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall1 9s ease-in-out infinite', animationDelay: '0s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.18">
                        <animate attributeName="d" dur="2.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="2.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="2.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;35;35;35;35;35;35;35"/>
                        <animate attributeName="rx" dur="2.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="14;13;11;9;9;11;13;14"/>
                        <animate attributeName="ry" dur="2.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="12;11;9;7;7;9;11;12"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 2 */}
                    <svg className="absolute left-[18%] w-14 h-11 opacity-32 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall2 11s ease-in-out infinite', animationDelay: '-3s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.16">
                        <animate attributeName="d" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34;33;32;32;33;34;35"/>
                        <animate attributeName="rx" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="12;11.5;11;10;10;11;11.5;12"/>
                        <animate attributeName="ry" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="11;10.5;9;8;8;9;10.5;11"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 3 */}
                    <svg className="absolute left-[35%] w-15 h-11 opacity-30 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall3 8s ease-in-out infinite', animationDelay: '-1s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.15">
                        <animate attributeName="d" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33.5;32.5;32.5;33.5;34.5;35"/>
                        <animate attributeName="rx" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="13;12.5;12;11;11;12;12.5;13"/>
                        <animate attributeName="ry" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="11;10.5;9.5;8.5;8.5;9.5;10.5;11"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="15" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 4 */}
                    <svg className="absolute left-[52%] w-17 h-12 opacity-38 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall4 12s ease-in-out infinite', animationDelay: '-5s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.18">
                        <animate attributeName="d" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33.5;32.5;32.5;33.5;34.5;35"/>
                        <animate attributeName="rx" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="14;13.5;12.5;11.5;11.5;12.5;13.5;14"/>
                        <animate attributeName="ry" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="12;11.5;10.5;9.5;9.5;10.5;11.5;12"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 5 */}
                    <svg className="absolute left-[70%] w-14 h-10 opacity-28 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall5 10s ease-in-out infinite', animationDelay: '-7s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.15">
                        <animate attributeName="d" dur="2.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="2.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="2.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34;33;32;32;33;34;35"/>
                        <animate attributeName="rx" dur="2.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="12;11.5;11;10;10;11;11.5;12"/>
                        <animate attributeName="ry" dur="2.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="10;9.5;8.5;7.5;7.5;8.5;9.5;10"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 6 */}
                    <svg className="absolute left-[88%] w-13 h-10 opacity-26 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall6 7s ease-in-out infinite', animationDelay: '-2s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.14">
                        <animate attributeName="d" dur="2.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="2.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="2.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33.5;32.5;32.5;33.5;34.5;35"/>
                        <animate attributeName="rx" dur="2.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="11;10.5;10;9;9;10;10.5;11"/>
                        <animate attributeName="ry" dur="2.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="10;9.5;8.5;7.5;7.5;8.5;9.5;10"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 7 */}
                    <svg className="absolute left-[8%] w-15 h-11 opacity-34 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall3 13s ease-in-out infinite', animationDelay: '-9s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.17">
                        <animate attributeName="d" dur="3.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="3.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="3.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33.5;32.5;32.5;33.5;34.5;35"/>
                        <animate attributeName="rx" dur="3.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="13;12.5;12;11;11;12;12.5;13"/>
                        <animate attributeName="ry" dur="3.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="11;10.5;9.5;8.5;8.5;9.5;10.5;11"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="15" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 8 */}
                    <svg className="absolute left-[25%] w-16 h-12 opacity-36 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall1 8s ease-in-out infinite', animationDelay: '-4s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.16">
                        <animate attributeName="d" dur="2.4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="2.4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="2.4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33;32;32;33;34.5;35"/>
                        <animate attributeName="rx" dur="2.4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="14;13.5;13;12;12;13;13.5;14"/>
                        <animate attributeName="ry" dur="2.4s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="12;11.5;10;9;9;10;11.5;12"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 9 */}
                    <svg className="absolute left-[42%] w-14 h-10 opacity-30 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall6 11s ease-in-out infinite', animationDelay: '-6s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.15">
                        <animate attributeName="d" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34;33;32;32;33;34;35"/>
                        <animate attributeName="rx" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="12;11.5;11;10;10;11;11.5;12"/>
                        <animate attributeName="ry" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="10;9.5;8.5;7.5;7.5;8.5;9.5;10"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 10 */}
                    <svg className="absolute left-[60%] w-15 h-11 opacity-32 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall2 9s ease-in-out infinite', animationDelay: '-8s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.16">
                        <animate attributeName="d" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33;32;32;33;34.5;35"/>
                        <animate attributeName="rx" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="13;12.5;12;11;11;12;12.5;13"/>
                        <animate attributeName="ry" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="11;10.5;9.5;8.5;8.5;9.5;10.5;11"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="15" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 11 */}
                    <svg className="absolute left-[78%] w-16 h-12 opacity-35 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall4 10s ease-in-out infinite', animationDelay: '-10s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.17">
                        <animate attributeName="d" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33;32;32;33;34.5;35"/>
                        <animate attributeName="rx" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="14;13.5;13;12;12;13;13.5;14"/>
                        <animate attributeName="ry" dur="3.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="12;11.5;10;9;9;10;11.5;12"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 12 */}
                    <svg className="absolute left-[95%] w-13 h-10 opacity-28 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall5 8s ease-in-out infinite', animationDelay: '-11s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.14">
                        <animate attributeName="d" dur="2.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="2.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="2.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33.5;32.5;32.5;33.5;34.5;35"/>
                        <animate attributeName="rx" dur="2.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="11;10.5;10;9;9;10;10.5;11"/>
                        <animate attributeName="ry" dur="2.6s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="10;9.5;8.5;7.5;7.5;8.5;9.5;10"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 13 */}
                    <svg className="absolute left-[12%] w-14 h-11 opacity-33 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall6 12s ease-in-out infinite', animationDelay: '-12s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.16">
                        <animate attributeName="d" dur="2.9s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="2.9s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="2.9s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33;32;32;33;34.5;35"/>
                        <animate attributeName="rx" dur="2.9s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="12;11.5;11;10;10;11;11.5;12"/>
                        <animate attributeName="ry" dur="2.9s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="11;10.5;9.5;8.5;8.5;9.5;10.5;11"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 14 */}
                    <svg className="absolute left-[30%] w-15 h-11 opacity-30 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall3 7s ease-in-out infinite', animationDelay: '-0.5s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.15">
                        <animate attributeName="d" dur="2.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="2.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="2.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33;32;32;33;34.5;35"/>
                        <animate attributeName="rx" dur="2.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="13;12.5;12;11;11;12;12.5;13"/>
                        <animate attributeName="ry" dur="2.5s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="11;10.5;9.5;8.5;8.5;9.5;10.5;11"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="15" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 15 */}
                    <svg className="absolute left-[48%] w-16 h-12 opacity-36 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall1 14s ease-in-out infinite', animationDelay: '-13s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.18">
                        <animate attributeName="d" dur="3.3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="3.3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="3.3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33;32;32;33;34.5;35"/>
                        <animate attributeName="rx" dur="3.3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="14;13.5;13;12;12;13;13.5;14"/>
                        <animate attributeName="ry" dur="3.3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="12;11.5;10;9;9;10;11.5;12"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 16 */}
                    <svg className="absolute left-[65%] w-14 h-10 opacity-29 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall2 6s ease-in-out infinite', animationDelay: '-2.5s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.15">
                        <animate attributeName="d" dur="2.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="2.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="2.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33.5;32.5;32.5;33.5;34.5;35"/>
                        <animate attributeName="rx" dur="2.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="12;11.5;11;10;10;11;11.5;12"/>
                        <animate attributeName="ry" dur="2.2s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="10;9.5;8.5;7.5;7.5;8.5;9.5;10"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 17 */}
                    <svg className="absolute left-[82%] w-15 h-11 opacity-34 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall4 9s ease-in-out infinite', animationDelay: '-4.5s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.17">
                        <animate attributeName="d" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33;32;32;33;34.5;35"/>
                        <animate attributeName="rx" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="13;12.5;12;11;11;12;12.5;13"/>
                        <animate attributeName="ry" dur="3s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="11;10.5;9.5;8.5;8.5;9.5;10.5;11"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="15" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 18 */}
                    <svg className="absolute left-[5%] w-13 h-10 opacity-27 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall5 11s ease-in-out infinite', animationDelay: '-6.5s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.14">
                        <animate attributeName="d" dur="2.7s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="2.7s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="2.7s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33.5;32.5;32.5;33.5;34.5;35"/>
                        <animate attributeName="rx" dur="2.7s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="11;10.5;10;9;9;10;10.5;11"/>
                        <animate attributeName="ry" dur="2.7s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="10;9.5;8.5;7.5;7.5;8.5;9.5;10"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 19 */}
                    <svg className="absolute left-[22%] w-14 h-11 opacity-31 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall6 10s ease-in-out infinite', animationDelay: '-8.5s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.16">
                        <animate attributeName="d" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33;32;32;33;34.5;35"/>
                        <animate attributeName="rx" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="12;11.5;11;10;10;11;11.5;12"/>
                        <animate attributeName="ry" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="11;10.5;9.5;8.5;8.5;9.5;10.5;11"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">$</text>
                    </svg>
                    
                    {/* Bill 20 */}
                    <svg className="absolute left-[55%] w-16 h-12 opacity-37 falling-bill" viewBox="0 0 120 70" fill="none" style={{ animation: 'fall1 13s ease-in-out infinite', animationDelay: '-10.5s' }}>
                      <path stroke="white" strokeWidth="2" fill="white" fillOpacity="0.18">
                        <animate attributeName="d" dur="3.1s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M10,16 Q60,2 110,16 L110,54 Q60,44 10,54 L10,16 Z;
                          M7,13 Q60,4 113,13 L113,57 Q60,50 7,57 L7,13 Z;
                          M5,11 Q60,7 115,11 L115,59 Q60,55 5,59 L5,11 Z;
                          M4,10 Q60,10 116,10 L116,60 Q60,60 4,60 L4,10 Z"
                        />
                      </path>
                      <ellipse stroke="white" strokeWidth="1.5" fill="none">
                        <animate attributeName="cx" dur="3.1s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="60;60;60;60;60;60;60;60"/>
                        <animate attributeName="cy" dur="3.1s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="35;34.5;33;32;32;33;34.5;35"/>
                        <animate attributeName="rx" dur="3.1s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="14;13.5;13;12;12;13;13.5;14"/>
                        <animate attributeName="ry" dur="3.1s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1; 0.4 0 0.6 1" values="12;11.5;10;9;9;10;11.5;12"/>
                      </ellipse>
                      <text x="60" y="40" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">$</text>
                    </svg>
                  </div>
                  
                  <div className="flex min-h-[650px] md:min-h-[730px] lg:min-h-[700px] items-center pt-6 pb-8">
                    <div className="container px-6 md:px-12 max-w-6xl mx-auto relative z-10">
                      <div className="flex flex-col items-center text-center gap-6">
                        <div className="space-y-4 max-w-3xl">
                          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                            The last payment processor you'll ever need
                          </h1>
                          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                            Fast approvals, secure data, real customer support, & custom built to fit your business.
                          </p>
                          <div className="flex gap-4 justify-center pt-2">
                            <Button 
                              asChild 
                              size="lg" 
                              className="bg-[#203e22] hover:bg-[#1a3319] text-white rounded-md px-8 shadow-lg focus:outline-none focus:ring-0 outline-none ring-0 border-0"
                              data-testid="button-get-started-hero"
                            >
                              <a href="/register">Get started</a>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="relative flex items-center justify-center mt-4">
                          <div 
                            className="relative"
                            style={{ transform: `translateY(${scrollY * 0.015}px)` }}
                          >
                            <div 
                              className="absolute bottom-[-8px] left-[-10%] right-[-10%] h-[30px] rounded-[50%]"
                              style={{ 
                                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)',
                                filter: 'blur(8px)'
                              }}
                            />
                            <img 
                              src="/macbook-dashboard-new.png" 
                              alt="PigBank Dashboard on MacBook" 
                              className="w-[380px] md:w-[500px] lg:w-[600px] xl:w-[700px] h-auto"
                            />
                            <img 
                              src="/iphone-payouts.png" 
                              alt="PigBank Payouts on iPhone" 
                              className="absolute w-[65px] md:w-[80px] lg:w-[100px] xl:w-[115px] h-auto z-20 bottom-0 left-0"
                            />
                            <img 
                              src="/pig-suit-new.png" 
                              alt="PigBank Mascot" 
                              className="absolute w-[90px] md:w-[110px] lg:w-[140px] xl:w-[160px] h-auto z-30 bottom-0 right-[-5%]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Slide 2: Video - What is payment processing */}
              <CarouselItem className="pl-0">
                <div 
                  className="relative overflow-hidden"
                  style={{
                    background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #141414 40%, #0f0f0f 70%, #0a0a0a 100%)'
                  }}
                >
                  <div className="flex min-h-[650px] md:min-h-[730px] lg:h-[580px] items-center">
                    <div className="container px-6 md:px-12 max-w-6xl mx-auto relative">
                      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
                        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                            See how payment processing works
                          </h2>
                          <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto lg:mx-0">
                            Watch how PigBank simplifies payments for your business. From checkout to payout in seconds.
                          </p>
                        </div>
                        
                        <div className="lg:w-1/2 relative w-full flex items-center justify-center">
                          <div className="relative w-full max-w-md aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                              <div className="text-center">
                                <div className="w-20 h-20 rounded-full bg-[#73cb43] flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-[#65b53b] transition-colors shadow-lg">
                                  <Play className="h-8 w-8 text-white ml-1" />
                                </div>
                                <p className="text-white/60 text-sm">Video coming soon</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Slide 3: Customer Service */}
              <CarouselItem className="pl-0">
                <div 
                  className="relative overflow-hidden"
                  style={{
                    background: 'radial-gradient(ellipse at center, #f0fdf4 0%, #dcfce7 35%, #bbf7d0 70%, #86efac 100%)'
                  }}
                >
                  <div className="flex min-h-[650px] md:min-h-[730px] lg:h-[580px] items-center">
                    <div className="container px-6 md:px-12 max-w-6xl mx-auto relative">
                      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
                        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                            Real humans, real support
                          </h2>
                          <p className="text-lg md:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0">
                            No bots, no runaround. Talk to dedicated account managers who know your business and answer your calls.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <Button 
                              asChild 
                              size="lg" 
                              className="bg-[#203e22] hover:bg-[#1a3319] text-white rounded-md px-8 shadow-lg focus:outline-none focus:ring-0 outline-none ring-0 border-0"
                              data-testid="button-get-started-hero-3"
                            >
                              <a href="/register">Get personal support</a>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="lg:w-1/2 relative w-full flex items-center justify-center lg:justify-end">
                          <div className="relative bg-white rounded-3xl p-8 shadow-2xl max-w-sm">
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-14 h-14 rounded-full bg-[#73cb43] flex items-center justify-center">
                                <Smartphone className="h-7 w-7 text-white" />
                              </div>
                              <div>
                                <p className="font-bold text-xl text-gray-900">24/7 Support</p>
                                <p className="text-gray-500">Always here for you</p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                <CheckCircle2 className="h-5 w-5 text-[#73cb43]" />
                                <span className="text-gray-700">Dedicated account manager</span>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                <CheckCircle2 className="h-5 w-5 text-[#73cb43]" />
                                <span className="text-gray-700">Direct phone line</span>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                <CheckCircle2 className="h-5 w-5 text-[#73cb43]" />
                                <span className="text-gray-700">Average response: 2 minutes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Slide 4: Security */}
              <CarouselItem className="pl-0">
                <div 
                  className="relative overflow-hidden"
                  style={{
                    background: 'radial-gradient(ellipse at center, #2a2a2a 0%, #222222 40%, #1a1a1a 70%, #141414 100%)'
                  }}
                >
                  <div className="flex min-h-[650px] md:min-h-[730px] lg:h-[580px] items-center">
                    <div className="container px-6 md:px-12 max-w-6xl mx-auto relative">
                      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
                        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                            Bank-level security
                          </h2>
                          <p className="text-lg md:text-xl text-white/90 max-w-xl mx-auto lg:mx-0">
                            256-bit encryption, PCI DSS Level 1 compliance, and we never sell your data. Your security is our priority.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <Button 
                              asChild 
                              size="lg" 
                              className="bg-[#73cb43] hover:bg-[#65b53b] text-white rounded-md px-8 shadow-lg focus:outline-none focus:ring-0 outline-none ring-0 border-0"
                              data-testid="button-get-started-hero-4"
                            >
                              <a href="/register">Secure your payments</a>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="lg:w-1/2 relative w-full flex items-center justify-center lg:justify-end">
                          <div className="relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-64 h-64 rounded-full border-4 border-[#73cb43]/20 animate-ping" style={{ animationDuration: '3s' }} />
                            </div>
                            <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                              <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-[#203e22] flex items-center justify-center">
                                  <Lock className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                  <p className="font-bold text-xl text-gray-900">Protected</p>
                                  <p className="text-gray-500">Enterprise Security</p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                  <Shield className="h-5 w-5 text-[#73cb43]" />
                                  <span className="text-gray-700">256-bit encryption</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                  <Shield className="h-5 w-5 text-[#73cb43]" />
                                  <span className="text-gray-700">PCI DSS Level 1</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                                  <Shield className="h-5 w-5 text-[#73cb43]" />
                                  <span className="text-gray-700">We never sell your data</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Slide 5: Get paid fast */}
              <CarouselItem className="pl-0">
                <div 
                  className="relative overflow-hidden"
                  style={{
                    background: 'radial-gradient(ellipse at center, #f5efe4 0%, #e8dfd0 35%, #d9cdb8 70%, #c9bca3 100%)'
                  }}
                >
                  <div className="flex min-h-[650px] md:min-h-[730px] lg:h-[580px] items-center">
                    <div className="container px-6 md:px-12 max-w-6xl mx-auto relative">
                      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
                        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                            Get paid faster
                          </h2>
                          <p className="text-lg md:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0">
                            Same-day and next-day payouts. No waiting weeks for your money. Access your funds when you need them.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <Button 
                              asChild 
                              size="lg" 
                              className="bg-[#203e22] hover:bg-[#1a3319] text-white rounded-md px-8 shadow-lg focus:outline-none focus:ring-0 outline-none ring-0 border-0"
                              data-testid="button-get-started-hero-5"
                            >
                              <a href="/register">Start earning faster</a>
                            </Button>
                          </div>
                        </div>
                        
                        <div className="lg:w-1/2 relative w-full flex items-center justify-center lg:justify-end">
                          <div className="relative">
                            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm">
                              <div className="flex items-center justify-between mb-6">
                                <span className="text-lg font-semibold text-gray-900">Payout Schedule</span>
                                <Zap className="h-6 w-6 text-[#73cb43]" />
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-[#73cb43]/10 rounded-xl border-2 border-[#73cb43]">
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-[#73cb43]" />
                                    <span className="font-medium text-gray-900">Same Day</span>
                                  </div>
                                  <span className="text-[#73cb43] font-bold">Instant</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                                    <span className="font-medium text-gray-700">Next Day</span>
                                  </div>
                                  <span className="text-gray-500">T+1</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                  <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                                    <span className="font-medium text-gray-700">Standard</span>
                                  </div>
                                  <span className="text-gray-500">T+2</span>
                                </div>
                              </div>
                              <div className="mt-6 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle2 className="h-4 w-4 text-[#73cb43]" />
                                  <span>No hidden fees on payouts</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          
          {/* Navigation arrows - inner edges aligned with header content boundaries */}
          <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none">
            <button
              onClick={() => {
                heroApi?.scrollPrev();
                setHeroProgress(0);
              }}
              className="absolute top-1/2 -translate-y-1/2 z-10 hover:opacity-70 transition-opacity pointer-events-auto"
              style={{ left: '6px' }}
              data-testid="button-hero-prev"
            >
              <ChevronLeft className="h-8 w-8 md:h-10 md:w-10" style={{ color: '#1877F2' }} />
            </button>
            <button
              onClick={() => {
                heroApi?.scrollNext();
                setHeroProgress(0);
              }}
              className="absolute top-1/2 -translate-y-1/2 z-10 hover:opacity-70 transition-opacity pointer-events-auto"
              style={{ right: '6px' }}
              data-testid="button-hero-next"
            >
              <ChevronRight className="h-8 w-8 md:h-10 md:w-10" style={{ color: '#1877F2' }} />
            </button>
          </div>
          
          {/* Carousel progress indicators with pause button */}
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10"
          >
            <div className="flex items-center gap-2">
              {Array.from({ length: heroSlideCount }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    heroApi?.scrollTo(index);
                    setHeroProgress(0);
                  }}
                  className={`relative w-12 h-1.5 rounded-full overflow-hidden transition-colors ${
                    index === heroCurrentSlide 
                      ? 'bg-white hover:bg-white' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  data-testid={`button-hero-progress-${index}`}
                >
                  <div 
                    className="absolute left-0 top-0 h-full rounded-full transition-all duration-75"
                    style={{ 
                      backgroundColor: '#1877F2',
                      width: index === heroCurrentSlide 
                        ? `${heroProgress}%` 
                        : index < heroCurrentSlide 
                          ? '100%' 
                          : '0%'
                    }}
                  />
                </button>
              ))}
            </div>
            <button
              onClick={() => setHeroIsPaused(!heroIsPaused)}
              className="px-3 py-1.5 rounded-md bg-transparent backdrop-blur-sm border border-white/30 hover:border-white/50 hover:bg-white/10 flex items-center justify-center transition-all"
              data-testid="button-hero-pause"
            >
              {heroIsPaused ? (
                <PlayIcon className="h-3.5 w-3.5 text-white" />
              ) : (
                <Pause className="h-3.5 w-3.5 text-white" />
              )}
            </button>
          </div>
          
        </section>

        <section className="bg-[#15391c] py-8">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center">
              <div className="text-center">
                <p className="text-[10px] font-semibold text-[#9be870] uppercase tracking-widest mb-3">
                  TOP PAYMENT PROCESSOR FOR HIGH-RISK
                </p>
                <div className="flex items-center justify-center gap-2">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                  <span className="text-xl font-bold text-white tracking-tight">Digital Transactions</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold text-[#9be870] uppercase tracking-widest mb-3">
                  BEST MERCHANT SERVICES 2025
                </p>
                <div className="flex items-center justify-center gap-2">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.5L19 8l-7 3.5L5 8l7-3.5z"/>
                  </svg>
                  <span className="text-xl font-bold text-white tracking-tight">PaymentsJournal</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold text-[#9be870] uppercase tracking-widest mb-3">
                  TRUSTED PAYMENT GATEWAY
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                    <span className="text-[#15391c] font-bold text-sm">B</span>
                  </div>
                  <span className="text-xl font-bold text-white tracking-tight">Business.com</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#e8f5e0]">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto py-16 md:py-24">
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Payment processing for every risk level
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                We specialize in providing tailored payment solutions for merchants operating across all risk levels.
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4 min-h-[500px]">
              <div 
                className="group relative flex-1 bg-[#203e22] rounded-3xl p-8 md:p-10 overflow-hidden cursor-pointer transition-all duration-500 hover:flex-[2] lg:hover:flex-[2]"
                data-testid="card-high-risk"
              >
                <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-white" />
                </div>
                
                <div className="mt-16 space-y-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-white">
                    High risk industries
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {[
                      "CBD & Hemp",
                      "Adult products",
                      "Bail bonds",
                      "Guns & firearms",
                      "Nutraceuticals",
                      "Fantasy sports",
                      "Tech support",
                      "Kratom",
                      "Vape & E-cig",
                      "Collections",
                    ].map((industry) => (
                      <div key={industry} className="flex items-center gap-2 text-white/90">
                        <CheckCircle2 className="h-4 w-4 text-[#9be870]" />
                        <span className="text-sm">{industry}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-white/70 text-sm">
                    Specialized underwriting for merchants others can't approve
                  </span>
                </div>
              </div>

              <div 
                className="group relative flex-1 bg-[#c8e6b9] rounded-3xl p-8 md:p-10 overflow-hidden cursor-pointer transition-all duration-500 hover:flex-[2] lg:hover:flex-[2]"
                data-testid="card-low-risk"
              >
                <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-[#203e22]/10 flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-[#203e22]" />
                </div>
                
                <div className="mt-16 space-y-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-[#203e22]">
                    Medium & Low risk
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {[
                      "E-commerce",
                      "SaaS",
                      "Professional services",
                      "Restaurants",
                      "Healthcare",
                      "Education",
                      "Travel",
                      "Retail",
                      "Subscription",
                      "Non-profit",
                    ].map((industry) => (
                      <div key={industry} className="flex items-center gap-2 text-[#203e22]/90">
                        <CheckCircle2 className="h-4 w-4 text-[#203e22]" />
                        <span className="text-sm">{industry}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-[#203e22]/70 text-sm">
                    Competitive rates for traditional business models
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-4 bg-[#2f8a2b] overflow-hidden">
          <div className="relative flex overflow-hidden h-10">
            <div className="animate-marquee whitespace-nowrap flex items-center">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M15.337 3.415c-.084-.076-.196-.112-.306-.102-.114.008-.22.057-.297.143L6.742 12.23l5.692 1.566 2.903-10.381zm6.542 5.46l-3.107-2.94a.42.42 0 00-.288-.114.422.422 0 00-.288.114l-1.073 1.014 4.756 4.5V6.875zM5.61 13.622l-1.073-1.014a.422.422 0 00-.576 0l-3.107 2.94v4.576l4.756-4.5v-2.002zm12.78 1.206l-5.692-1.566-2.903 10.381c.084.076.196.112.306.102.114-.008.22-.057.297-.143l7.992-8.774z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">SHOPIFY</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M2.289 4.729c-.217.644-.341 1.477-.341 2.547 0 3.398 2.106 5.746 5.461 5.746.241 0 .471-.012.698-.035v1.795c-.227.023-.457.035-.698.035-4.354 0-7.409-3.003-7.409-7.541 0-1.253.158-2.341.479-3.237l1.81.69zm19.371 11.555c.217-.644.341-1.477.341-2.547 0-3.398-2.106-5.746-5.461-5.746-.241 0-.471.012-.698.035V6.231c.227-.023.457-.035.698-.035 4.354 0 7.409 3.003 7.409 7.541 0 1.253-.158 2.341-.479 3.237l-1.81-.69zM12 3c-2.392 0-4.575.894-6.231 2.368l1.283 1.283C8.474 5.482 10.143 4.8 12 4.8s3.526.682 4.948 1.851l1.283-1.283C16.575 3.894 14.392 3 12 3zm0 18c2.392 0 4.575-.894 6.231-2.368l-1.283-1.283c-1.422 1.169-3.091 1.851-4.948 1.851s-3.526-.682-4.948-1.851l-1.283 1.283C7.425 20.106 9.608 21 12 21z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">WOOCOMMERCE</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18.5c-4.687 0-8.5-3.813-8.5-8.5S7.313 3.5 12 3.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5zm-2-12.5l4 4-4 4V8z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">WORDPRESS</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M13.5 2L3 7v10l10.5 5 10.5-5V7L13.5 2zm0 2.18L21 8l-7.5 3.82L6 8l7.5-3.82zM5 9.5l7 3.5v7.5l-7-3.5V9.5zm9 11v-7.5l7-3.5v7.5l-7 3.5z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">WIX</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l3 2v6l7 4 7-4V9l3-2-10-5zm0 15l-5-3v-4l5 3 5-3v4l-5 3z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">SQUARESPACE</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">BIGCOMMERCE</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.18L18 8v8l-6 3-6-3V8l6-3.82z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">MAGENTO</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">SEZZLE</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">QUICKBOOKS</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <Settings className="h-5 w-5 text-white" />
                    <span className="text-base font-semibold text-white uppercase tracking-wider">CUSTOM INTEGRATION</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                </div>
              ))}
            </div>
            <div className="animate-marquee2 whitespace-nowrap flex items-center absolute top-0">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M15.337 3.415c-.084-.076-.196-.112-.306-.102-.114.008-.22.057-.297.143L6.742 12.23l5.692 1.566 2.903-10.381zm6.542 5.46l-3.107-2.94a.42.42 0 00-.288-.114.422.422 0 00-.288.114l-1.073 1.014 4.756 4.5V6.875zM5.61 13.622l-1.073-1.014a.422.422 0 00-.576 0l-3.107 2.94v4.576l4.756-4.5v-2.002zm12.78 1.206l-5.692-1.566-2.903 10.381c.084.076.196.112.306.102.114-.008.22-.057.297-.143l7.992-8.774z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">SHOPIFY</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M2.289 4.729c-.217.644-.341 1.477-.341 2.547 0 3.398 2.106 5.746 5.461 5.746.241 0 .471-.012.698-.035v1.795c-.227.023-.457.035-.698.035-4.354 0-7.409-3.003-7.409-7.541 0-1.253.158-2.341.479-3.237l1.81.69zm19.371 11.555c.217-.644.341-1.477.341-2.547 0-3.398-2.106-5.746-5.461-5.746-.241 0-.471.012-.698.035V6.231c.227-.023.457-.035.698-.035 4.354 0 7.409 3.003 7.409 7.541 0 1.253-.158 2.341-.479 3.237l-1.81-.69zM12 3c-2.392 0-4.575.894-6.231 2.368l1.283 1.283C8.474 5.482 10.143 4.8 12 4.8s3.526.682 4.948 1.851l1.283-1.283C16.575 3.894 14.392 3 12 3zm0 18c2.392 0 4.575-.894 6.231-2.368l-1.283-1.283c-1.422 1.169-3.091 1.851-4.948 1.851s-3.526-.682-4.948-1.851l-1.283 1.283C7.425 20.106 9.608 21 12 21z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">WOOCOMMERCE</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18.5c-4.687 0-8.5-3.813-8.5-8.5S7.313 3.5 12 3.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5zm-2-12.5l4 4-4 4V8z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">WORDPRESS</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M13.5 2L3 7v10l10.5 5 10.5-5V7L13.5 2zm0 2.18L21 8l-7.5 3.82L6 8l7.5-3.82zM5 9.5l7 3.5v7.5l-7-3.5V9.5zm9 11v-7.5l7-3.5v7.5l-7 3.5z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">WIX</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l3 2v6l7 4 7-4V9l3-2-10-5zm0 15l-5-3v-4l5 3 5-3v4l-5 3z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">SQUARESPACE</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">BIGCOMMERCE</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.18L18 8v8l-6 3-6-3V8l6-3.82z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">MAGENTO</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">SEZZLE</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                    <span className="text-base font-semibold text-white uppercase tracking-wider">QUICKBOOKS</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                  <div className="flex items-center gap-2 mx-6">
                    <Settings className="h-5 w-5 text-white" />
                    <span className="text-base font-semibold text-white uppercase tracking-wider">CUSTOM INTEGRATION</span>
                  </div>
                  <span className="text-white/60 mx-2">•</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Service Strip */}
        <section className="bg-[#203e22] py-12 md:py-16">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                  Real people. Real support.
                </h3>
                <p className="text-lg text-white/80 max-w-xl">
                  Your dedicated account manager picks up the phone. No bots, no runaround, no waiting on hold for hours.
                </p>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-end gap-6 md:gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#73cb43] flex items-center justify-center">
                    <Headphones className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="font-semibold">24/7 Support</p>
                    <p className="text-white/70 text-sm">Always available</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#73cb43] flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="font-semibold">Dedicated Team</p>
                    <p className="text-white/70 text-sm">Knows your business</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#73cb43] flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-white">
                    <p className="font-semibold">2 Min Response</p>
                    <p className="text-white/70 text-sm">Average wait time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <div className="lg:w-1/2 space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Bank-level security you can trust
                </h2>
                <p className="text-lg text-gray-600">
                  Your data is protected with the same encryption used by major banks. We're PCI DSS Level 1 compliant—the highest security standard in the payment industry.
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#203e22] flex items-center justify-center flex-shrink-0">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">256-bit encryption</h4>
                      <p className="text-gray-600 text-sm">Every transaction is protected with military-grade encryption</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#203e22] flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">PCI DSS Level 1</h4>
                      <p className="text-gray-600 text-sm">The highest security certification in the payments industry</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#203e22] flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">We never sell your data</h4>
                      <p className="text-gray-600 text-sm">Your business data stays private—period. No exceptions.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#73cb43]/20 rounded-full blur-3xl scale-150" />
                  <div className="relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-[#203e22] flex items-center justify-center">
                        <Lock className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-xl text-gray-900">Fully Protected</p>
                        <p className="text-gray-500">Enterprise Security</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                        <CheckCircle2 className="h-5 w-5 text-[#73cb43]" />
                        <span className="text-gray-700">SOC 2 Type II Certified</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                        <CheckCircle2 className="h-5 w-5 text-[#73cb43]" />
                        <span className="text-gray-700">99.99% Uptime SLA</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                        <CheckCircle2 className="h-5 w-5 text-[#73cb43]" />
                        <span className="text-gray-700">Fraud Monitoring 24/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-[#f5f0e8] overflow-hidden">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div 
              className="relative w-full cursor-pointer group rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #d9d2c7 0%, #c4bdb2 100%)'
              }}
            >
              <div className="flex flex-col lg:flex-row items-center justify-between p-6 md:p-10 lg:p-12 gap-6 lg:gap-8">
                <div className="lg:w-2/3 relative">
                  <img 
                    src="/macbook-dashboard.png" 
                    alt="PigBank Dashboard on MacBook" 
                    className="w-full h-auto max-w-[550px] mx-auto"
                  />
                </div>
                
                <div className="lg:w-1/3 flex flex-col items-center lg:items-start gap-4">
                  <img 
                    src={moneyImage} 
                    alt="Money and success" 
                    className="w-32 md:w-40 lg:w-48 h-auto drop-shadow-lg rounded-xl object-cover"
                  />
                  <div className="text-center lg:text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                      See PigBank in Action
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      Watch how easy it is to manage payments, track transactions, and grow your business.
                    </p>
                  </div>
                </div>
              </div>
              
              <button 
                className="absolute inset-0 flex items-center justify-center z-20"
                data-testid="button-play-video"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-white/90 backdrop-blur shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-gray-900 ml-1" fill="currentColor" />
                </div>
              </button>
            </div>
          </div>
        </section>

        <AppleScrollSection />

        <HorizontalScrollText />

        <section className="py-20 md:py-32">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Payment tools for every stage of business
                </h2>
                <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                  Starting out? Scaling up? Going global? Wherever you are on your 
                  business journey, PigBank's payment tools can help you reach 
                  your goals.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-[#73cb43] hover:bg-[#65b53b] text-white rounded-full px-8"
                  data-testid="button-learn-more-1"
                >
                  <a href="/register">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full bg-gradient-to-br from-[#73cb43]/20 to-[#203e22]/20 flex items-center justify-center">
                    <div className="w-48 h-48 md:w-60 md:h-60 rounded-full bg-gradient-to-br from-[#73cb43]/30 to-[#203e22]/30 flex items-center justify-center">
                      <div className="bg-white rounded-2xl shadow-xl p-6 w-36 md:w-44">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-[#73cb43] flex items-center justify-center">
                            <Shield className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-medium text-gray-600">Protected</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">100%</div>
                        <div className="text-xs text-gray-500">Fraud Prevention</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-xl p-5 w-52 md:w-64">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600">Express Payout</span>
                        <Zap className="h-5 w-5 text-[#73cb43]" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#73cb43]" />
                            <span className="text-sm text-gray-700">Available</span>
                          </div>
                          <span className="font-semibold text-gray-900">$12,450</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-400" />
                            <span className="text-sm text-gray-700">Pending</span>
                          </div>
                          <span className="font-semibold text-gray-900">$3,200</span>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4 bg-[#203e22] hover:bg-[#1a3319] text-white rounded-xl"
                        size="sm"
                      >
                        Transfer now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6 order-1 lg:order-2 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Fast and automatic payouts
                </h2>
                <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                  No waiting for your funds. Get same-day or next-day payouts 
                  directly to your bank account. You can even access funds 
                  instantly with our Express Payout feature.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-[#73cb43] hover:bg-[#65b53b] text-white rounded-full px-8"
                  data-testid="button-learn-more-2"
                >
                  <a href="/register">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Professional invoicing, simplified
                </h2>
                <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                  Create and send professional invoices in seconds. Track payments, 
                  send reminders, and get paid faster with built-in payment links 
                  that your customers can use instantly.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-[#73cb43] hover:bg-[#65b53b] text-white rounded-full px-8"
                  data-testid="button-learn-more-3"
                >
                  <a href="/register">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-xl p-5 w-52 md:w-64">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600">Invoice #1234</span>
                        <FileText className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="border-b border-gray-100 pb-3 mb-3">
                        <div className="text-xs text-gray-500 mb-1">Amount Due</div>
                        <div className="text-2xl font-bold text-gray-900">$2,450.00</div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Due Date</span>
                        <span className="font-medium text-gray-900">Dec 15, 2024</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-500">Status</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-4 border-[#73cb43]/20 animate-ping" style={{ animationDuration: '3s' }} />
                      </div>
                      <div className="relative bg-white rounded-full p-8 shadow-xl">
                        <Lock className="h-16 w-16 text-[#203e22]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6 order-1 lg:order-2 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Security as strong as a vault
                </h2>
                <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                  From day one, your transactions are protected with bank-level 
                  encryption, PCI DSS Level 1 compliance, and our advanced 
                  AI-powered fraud detection system.
                </p>
                <ul className="space-y-3 text-left max-w-lg mx-auto lg:mx-0">
                  {[
                    "256-bit SSL encryption",
                    "PCI DSS Level 1 certified",
                    "Real-time fraud monitoring",
                    "3D Secure authentication",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-[#73cb43] flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-32 bg-white">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-gray-900 tracking-tight">
              No hidden fees. No commissions.
            </h2>
          </div>
        </section>

        <section className="bg-[#203e22] py-16 md:py-24">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="space-y-8">
                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                    Monthly Transaction Volume
                  </label>
                  <div className="mt-3 text-3xl md:text-4xl font-bold text-[#73cb43]">
                    ${transactionVolume.toLocaleString()}
                  </div>
                  <div className="mt-4 relative">
                    <input
                      type="range"
                      min="5000"
                      max="500000"
                      step="5000"
                      value={transactionVolume}
                      onChange={(e) => setTransactionVolume(Number(e.target.value))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-green"
                      data-testid="slider-volume"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                    Average Transaction Size
                  </label>
                  <div className="mt-3 text-3xl md:text-4xl font-bold text-[#73cb43]">
                    $85
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                    Current Processor Rate
                  </label>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-[#73cb43] bg-[#73cb43]" />
                      <span className="text-white text-sm">3.5%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/40" />
                      <span className="text-white/60 text-sm">4.0%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/40" />
                      <span className="text-white/60 text-sm">4.5%</span>
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full bg-[#73cb43] hover:bg-[#65b53b] text-white rounded-full py-6 text-base font-semibold mt-4"
                  data-testid="button-calculate"
                >
                  Calculate my savings
                </Button>
              </div>

              <div>
                <div className="mb-2">
                  <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                    Estimated Annual Savings:
                  </span>
                </div>
                <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#73cb43] mb-8">
                  ${(parseFloat(saved) * 12).toLocaleString()}
                </div>
                
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#73cb43]" />
                    <span className="text-sm text-white/80">Your Savings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/40" />
                    <span className="text-sm text-white/80">Competitor Fees</span>
                  </div>
                </div>

                <div className="h-64 flex items-end gap-1">
                  {[...Array(24)].map((_, i) => {
                    const baseHeight = 20 + (i * 3);
                    const savingsHeight = baseHeight * 0.3;
                    return (
                      <div key={i} className="flex-1 flex flex-col gap-0.5">
                        <div 
                          className="w-full bg-[#73cb43] rounded-t-sm"
                          style={{ height: `${savingsHeight}%` }}
                        />
                        <div 
                          className="w-full bg-white/30 rounded-t-sm"
                          style={{ height: `${baseHeight - savingsHeight}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between mt-4 text-xs text-white/50">
                  <span>Year 1</span>
                  <span>Year 2</span>
                </div>

                <p className="text-xs text-white/50 mt-6 leading-relaxed">
                  The chart shows an estimate of how much you could save over time based on the transaction volume and current processor rate specified. Changes in these variables can affect the outcome. Results do not predict actual savings and are for illustrative purposes only.
                </p>
              </div>
            </div>
          </div>
        </section>

        <TestimonialsCarousel />

        <section className="py-20 md:py-32">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Ready to grow your business?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of merchants who trust PigBank to power their payments. 
              Start accepting payments in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-[#203e22] hover:bg-[#1a3319] text-white rounded-full px-8"
                data-testid="button-get-started-cta"
              >
                <a href="/register">
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-8 border-gray-300"
                data-testid="button-talk-to-sales"
              >
                Talk to sales
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#73cb43]" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#73cb43]" />
                <span>No monthly minimums</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#73cb43]" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="container px-4 md:px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Payments</a></li>
                <li><a href="#" className="hover:text-gray-900">Invoicing</a></li>
                <li><a href="#" className="hover:text-gray-900">Payouts</a></li>
                <li><a href="#" className="hover:text-gray-900">Fraud Protection</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">E-commerce</a></li>
                <li><a href="#" className="hover:text-gray-900">SaaS</a></li>
                <li><a href="#" className="hover:text-gray-900">Marketplaces</a></li>
                <li><a href="#" className="hover:text-gray-900">Platforms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Developers</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="hover:text-gray-900">API Reference</a></li>
                <li><a href="#" className="hover:text-gray-900">SDKs</a></li>
                <li><a href="#" className="hover:text-gray-900">Webhooks</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="/team-login" className="hover:text-gray-900" data-testid="link-team-login">PigBank Team Login</a></li>
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              © 2024 PigBank Payments. All rights reserved.
            </p>
          </div>
        </div>
      </footer>


      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0%); }
        }
        
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        
        .animate-marquee2 {
          animation: marquee2 25s linear infinite;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #73cb43;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #73cb43;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
