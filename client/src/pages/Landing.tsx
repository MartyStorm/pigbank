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
  ArrowDownLeft,
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
  Users,
  Star,
  Building2,
  Coins,
  FileCheck,
  Link,
  Check
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
import posTerminalImage from "@assets/1x1_Day_Care_-_Three-Quarter_-_Eddy_White_with_Person_Visitor_1766103263637.webp";
import PaymentMethodsFlip from "@/components/PaymentMethodsFlip";

const floatingCards = [
  {
    icon: CreditCard,
    title: "Payments",
    color: "bg-[#1a4320]",
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
  { icon: Store, title: "In-Person Payments", color: "bg-[#1a4320]", x: -180, y: -120 },
  { icon: Globe2, title: "Online Checkout", color: "bg-[#73cb43]", x: 180, y: -100 },
  { icon: Receipt, title: "Invoices & Pay Links", color: "bg-amber-600", x: -200, y: 40 },
  { icon: RefreshCcw, title: "Subscriptions", color: "bg-violet-600", x: 200, y: 60 },
  { icon: Monitor, title: "Virtual Terminal", color: "bg-gray-700", x: -160, y: 180 },
  { icon: Banknote, title: "Fast Payouts", color: "bg-emerald-600", x: 160, y: 160 },
];

const testimonials = [
  {
    id: 1,
    quote: "As a nutraceuticals company, finding a processor who understands our industry was tough. PigBank made onboarding simple and their support team actually gets what we do.",
    name: "TN Scientific",
    title: "Nutraceuticals & Research Products",
    image: "/attached_assets/tn_scientific_logo.png",
  },
  {
    id: 2,
    quote: "Other processors treated us like a liability. PigBank treated us like a partner. Fast approvals, fair rates, and they actually answer the phone when we call.",
    name: "TN Scientific",
    title: "Nutraceuticals & Research Products",
    image: "/attached_assets/tn_scientific_logo.png",
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
      className="py-12 md:py-16 overflow-hidden relative bg-[#1a4320]"
    >
      <div className="text-center mb-4">
        <p className="text-xs md:text-sm font-semibold text-white/70 uppercase tracking-[0.2em]">
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
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#85bb65] mx-4"
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
    <div className="mt-10">
      <div className="text-center mb-4">
        <p className="text-xs font-semibold text-[#1a4320] uppercase tracking-[0.2em]">
          DON'T TAKE OUR WORD FOR IT — HERE'S WHAT OUR PARTNERS SAY
        </p>
      </div>
      
      <div className="relative">
        <button
          onClick={scrollPrev}
          className="absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-white/80 transition-colors"
          data-testid="button-testimonial-prev"
        >
          <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
        </button>
        
        <button
          onClick={scrollNext}
          className="absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-white/80 transition-colors"
          data-testid="button-testimonial-next"
        >
          <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
        </button>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto px-10 md:px-14"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                  <div className="order-2 lg:order-1">
                    <blockquote className="text-lg md:text-xl lg:text-2xl font-light text-[#1a4320] leading-relaxed mb-3">
                      "{testimonial.quote}"
                    </blockquote>
                    <div>
                      <p className="text-white font-semibold uppercase tracking-wider text-xs">
                        {testimonial.name}, {testimonial.title}
                      </p>
                    </div>
                  </div>
                  <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
                    <div 
                      className="relative w-36 h-36 md:w-44 md:h-44 rounded-xl overflow-hidden bg-white flex items-center justify-center p-4 shadow-lg"
                    >
                      <img 
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="max-w-full max-h-full object-contain"
                        data-testid={`img-testimonial-${testimonial.id}`}
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-1 rounded-full transition-all ${
              index === current ? 'w-8 bg-white' : 'w-4 bg-white/40'
            }`}
            data-testid={`button-testimonial-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const [transactionVolume, setTransactionVolume] = useState(50000);
  const [scrollY, setScrollY] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const { setTheme } = useTheme();
  
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
      <header className="border-b border-[#1a4320]/20 bg-[#1a4320]">
        <div className="flex h-20 items-center justify-between px-4 md:px-6 lg:px-8 w-full">
          <div className="flex items-center gap-10">
            <img 
              src="/pig-bank-logo-white.png" 
              alt="PigBank" 
              className="h-12 w-auto object-contain" 
              data-testid="logo-header"
            />
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.hasDropdown ? (
                    <button 
                      className="flex items-center gap-1 text-base text-white/90 hover:text-[#73cb43] transition-colors py-6"
                      data-testid={`nav-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  ) : (
                    <a 
                      href={item.href}
                      className="flex items-center gap-1 text-base text-white/90 hover:text-[#73cb43] transition-colors py-6"
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
                                    <div className="w-10 h-10 rounded-lg bg-[#1a4320] flex items-center justify-center flex-shrink-0">
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
                                    <div className="w-10 h-10 rounded-lg bg-[#1a4320] flex items-center justify-center flex-shrink-0">
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
          <div className="flex items-center gap-5">
            <a 
              href="/login" 
              className="text-base text-white/90 hover:text-[#73cb43] transition-colors hidden sm:block"
              data-testid="link-login"
            >
              Log in
            </a>
            <a 
              href="/login"
              className="bg-[#75C947] hover:bg-[#67b83c] text-white font-medium px-5 py-2 rounded-md transition-colors sm:hidden"
              data-testid="button-login-mobile"
            >
              Log in
            </a>
            <a 
              href="/register"
              className="bg-[#75C947] hover:bg-[#67b83c] text-white font-medium px-5 py-2 rounded-md transition-colors hidden sm:block"
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
            backgroundImage: 'url(/attached_assets/ChatGPT_Image_Dec_29,_2025,_05_19_21_PM_1767050375367.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom'
          }}
        >
          <div className="min-h-[520px] md:min-h-[700px] flex items-center py-4 md:py-16">
            <div 
              className="hero-container w-full px-6 md:px-12 max-w-[1200px] mx-auto relative z-10"
              style={{ containerType: 'inline-size' }}
            >
              <div className="flex flex-col items-center text-center gap-6">
                <div className="space-y-4">
                  <h1 className="hero-title font-bold tracking-tight text-[#1a4320]" style={{ textShadow: '0 2px 8px rgba(255,255,255,0.3)' }}>
                    Built for Business, Payment Processing
                  </h1>
                  <p className="text-xl md:text-2xl text-[#1a4320] font-semibold" style={{ textShadow: '0 2px 8px rgba(255,255,255,0.3)' }}>
                    The last payment processor you'll ever need
                  </p>
                  <div className="flex gap-4 justify-center pt-2">
                    <Button 
                      asChild 
                      size="lg" 
                      className="bg-[#1a4320] hover:bg-[#0f2912] text-white rounded-md px-8 shadow-lg focus:outline-none focus:ring-0 outline-none ring-0 border-0"
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
                      className="w-[340px] md:w-[450px] lg:w-[540px] xl:w-[620px] h-auto"
                    />
                    <img 
                      src="/iphone-payouts.png" 
                      alt="PigBank Payouts on iPhone" 
                      className="absolute w-[55px] md:w-[70px] lg:w-[85px] xl:w-[100px] h-auto z-20 bottom-0 right-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-[#1a4320]">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center justify-items-center">
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
                  <span className="text-lg font-bold text-white tracking-tight">Digital Transactions</span>
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
                  <span className="text-lg font-bold text-white tracking-tight">PaymentsJournal</span>
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
                  <span className="text-lg font-bold text-white tracking-tight">Business.com</span>
                </div>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-semibold text-[#9be870] uppercase tracking-widest mb-3">
                  RECOMMENDED PROVIDER
                </p>
                <div className="flex items-center justify-center gap-2">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span className="text-lg font-bold text-white tracking-tight italic">Payment Review</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-4 bg-[#2f8a2b] overflow-hidden">
          <div className="relative flex items-center overflow-hidden h-10">
            <div className="animate-marquee whitespace-nowrap flex items-center h-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex items-center gap-2 mx-8">
                    <Star className="h-5 w-5 text-white" fill="white" />
                    <span className="text-base font-semibold text-white uppercase tracking-wider">5 Stars on Google</span>
                  </div>
                  <span className="text-white/60 mx-4">|</span>
                  <div className="flex items-center gap-2 mx-8">
                    <TrendingUp className="h-5 w-5 text-white" />
                    <span className="text-base font-semibold text-white uppercase tracking-wider">Processing Millions for Partners</span>
                  </div>
                  <span className="text-white/60 mx-4">|</span>
                  <div className="flex items-center gap-2 mx-8">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                    <span className="text-base font-semibold text-white uppercase tracking-wider">Trustpilot Verified</span>
                  </div>
                  <span className="text-white/60 mx-4">|</span>
                  <div className="flex items-center gap-2 mx-8">
                    <Clock className="h-5 w-5 text-white" />
                    <span className="text-base font-semibold text-white uppercase tracking-wider">6+ Years Processing Experience</span>
                  </div>
                  <span className="text-white/60 mx-4">|</span>
                </div>
              ))}
            </div>
            <div className="animate-marquee2 whitespace-nowrap flex items-center h-full absolute left-0 top-0">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <div className="flex items-center gap-2 mx-8">
                    <Star className="h-5 w-5 text-white" fill="white" />
                    <span className="text-base font-semibold text-white uppercase tracking-wider">5 Stars on Google</span>
                  </div>
                  <span className="text-white/60 mx-4">|</span>
                  <div className="flex items-center gap-2 mx-8">
                    <TrendingUp className="h-5 w-5 text-white" />
                    <span className="text-base font-semibold text-white uppercase tracking-wider">Processing Millions for Partners</span>
                  </div>
                  <span className="text-white/60 mx-4">|</span>
                  <div className="flex items-center gap-2 mx-8">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                    <span className="text-base font-semibold text-white uppercase tracking-wider">Trustpilot Verified</span>
                  </div>
                  <span className="text-white/60 mx-4">|</span>
                  <div className="flex items-center gap-2 mx-8">
                    <Clock className="h-5 w-5 text-white" />
                    <span className="text-base font-semibold text-white uppercase tracking-wider">6+ Years Processing Experience</span>
                  </div>
                  <span className="text-white/60 mx-4">|</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-12 md:py-16 bg-[#ffffff]">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Payment processing made simple
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Learn how PigBank helps merchants like you accept payments, grow your business, and get the support you deserve.
              </p>
            </div>
            <div 
              className="relative w-full aspect-video cursor-pointer group rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="absolute inset-0 bg-[#d9d7d3]" />
              <img 
                src="/attached_assets/ChatGPT_Image_Dec_28,_2025,_03_13_36_AM_1766913248786.png"
                alt="Payment Processing Flow Diagram"
                className="absolute inset-0 w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              <button 
                className="absolute inset-0 flex items-center justify-center z-20"
                data-testid="button-play-video"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#73cb43] flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Play className="h-6 w-6 md:h-8 md:w-8 text-white ml-1" fill="currentColor" />
                </div>
              </button>
            </div>
          </div>
        </section>

        <HorizontalScrollText />

        <PaymentMethodsFlip />

        {/* POS Hardware Section */}
        <section className="py-20 md:py-32 relative overflow-hidden bg-[#e5e7ec]">
          <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full bg-gradient-to-l from-lime-300/10 to-[#75C947]/5 blur-3xl translate-x-1/2" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-gradient-to-t from-emerald-300/8 to-[#75C947]/5 blur-3xl translate-y-1/2" />
          <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="lg:w-1/2 space-y-6 text-center flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  POS hardware
                </h2>
                <p className="text-lg text-gray-600 max-w-lg">
                  Sleek, durable hardware built for busy retail environments. 
                  Our terminals, card readers, and swivel stands 
                  make in-person checkout fast and seamless.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-[#75C947] hover:bg-[#67b83c] text-white rounded-lg px-8"
                  data-testid="button-learn-more-terminals"
                >
                  <a href="/register">
                    Explore hardware
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="w-72 h-72 md:w-96 md:h-96 mx-auto rounded-3xl overflow-hidden shadow-2xl">
                    <img 
                      src={posTerminalImage} 
                      alt="iPad POS terminal swivel stand for in-person payment processing" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POS Software Section */}
        <section className="py-20 md:py-32 relative overflow-hidden bg-[#ffffff]">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#75C947]/10 to-lime-300/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tl from-[#75C947]/8 to-emerald-200/5 blur-3xl translate-x-1/3 translate-y-1/3" />
          <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden bg-[#85bb65] flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-xl p-5 w-52 md:w-64">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600">POS Dashboard</span>
                        <Monitor className="h-5 w-5 text-[#73cb43]" />
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Today's Sales</span>
                          <span className="font-semibold text-gray-900">$4,280</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-[#73cb43] rounded-full" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Receipt className="h-3 w-3 text-[#73cb43]" />
                            <span className="text-xs text-gray-700">Orders</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-900">142</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-700">Customers</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-900">89</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6 order-1 lg:order-2 text-center flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  POS software
                </h2>
                <p className="text-lg text-gray-600 max-w-lg">
                  Powerful iPad POS software that handles sales, inventory, 
                  and customer management. Track orders, manage staff, 
                  and get real-time analytics—all from one intuitive app.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-[#75C947] hover:bg-[#67b83c] text-white rounded-lg px-8"
                  data-testid="button-learn-more-pos-software"
                >
                  <a href="/register">
                    Explore software
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Payment Gateway Section */}
        <section className="py-20 md:py-32 relative overflow-hidden bg-[#e5e7ec]">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-gradient-to-br from-[#75C947]/10 to-lime-300/5 blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tl from-[#75C947]/8 to-emerald-200/5 blur-3xl translate-x-1/3 translate-y-1/3" />
          <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="lg:w-1/2 space-y-6 text-center flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Payment gateway & management system
                </h2>
                <p className="text-lg text-gray-600 max-w-lg">
                  A secure payment gateway with a complete merchant management 
                  system. Real-time transaction routing, chargeback management, 
                  fraud monitoring, and detailed reporting—all from one 
                  centralized dashboard built for high-risk merchants.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-[#75C947] hover:bg-[#67b83c] text-white rounded-lg px-8"
                  data-testid="button-learn-more-gateway"
                >
                  <a href="/register">
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden bg-[#85bb65] flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-xl p-5 w-52 md:w-64">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600">Payment Gateway</span>
                        <CreditCard className="h-5 w-5 text-[#73cb43]" />
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Processed Today</span>
                          <span className="font-semibold text-gray-900">$24,850</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full w-4/5 bg-[#73cb43] rounded-full" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-[#73cb43]" />
                            <span className="text-xs text-gray-700">Approved</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-900">98.2%</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <RefreshCcw className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-700">Refunds</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-900">1.8%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="py-20 md:py-32 overflow-hidden relative bg-[#ffffff]">
          <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-b from-[#75C947]/8 to-lime-200/5 blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-gradient-to-r from-emerald-300/10 to-[#75C947]/5 blur-3xl -translate-x-1/3" />
          <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                  <div className="flex gap-4 md:gap-6 justify-center">
                    {/* Left Column - Scrolls Up */}
                    <div className="flex flex-col gap-4 animate-scroll-up">
                      {[...Array(2)].map((_, setIndex) => (
                        <div key={setIndex} className="flex flex-col gap-4">
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <span className="text-purple-600 font-bold text-lg">WOO</span>
                          </div>
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <Store className="h-8 w-8 text-green-600" />
                          </div>
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <span className="text-black font-bold text-lg">WIX</span>
                          </div>
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <Globe className="h-8 w-8 text-blue-500" />
                          </div>
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <Bitcoin className="h-8 w-8 text-orange-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Middle Column - Scrolls Down */}
                    <div className="flex flex-col gap-4 animate-scroll-down">
                      {[...Array(2)].map((_, setIndex) => (
                        <div key={setIndex} className="flex flex-col gap-4">
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <Monitor className="h-8 w-8 text-gray-800" />
                          </div>
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <Wallet className="h-8 w-8 text-black" />
                          </div>
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <Receipt className="h-8 w-8 text-green-600" />
                          </div>
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <CreditCard className="h-8 w-8 text-blue-600" />
                          </div>
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <BarChart3 className="h-8 w-8 text-purple-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Right Column - Scrolls Up */}
                    <div className="flex flex-col gap-4 animate-scroll-up-slow">
                      {[...Array(2)].map((_, setIndex) => (
                        <div key={setIndex} className="flex flex-col gap-4">
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <Smartphone className="h-8 w-8 text-gray-800" />
                          </div>
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <RefreshCcw className="h-8 w-8 text-blue-500" />
                          </div>
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <Banknote className="h-8 w-8 text-green-600" />
                          </div>
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <Globe2 className="h-8 w-8 text-orange-500" />
                          </div>
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100">
                            <Shield className="h-8 w-8 text-indigo-600" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#f9fafb] to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f9fafb] to-transparent pointer-events-none" />
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6 order-1 lg:order-2 text-center flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Integrations that power your growth
                </h2>
                <p className="text-lg text-gray-600 max-w-lg">
                  Connect with the industry's leading platforms instantly. Whether you need 
                  plug-and-play solutions or custom connections, our payment technology 
                  fits seamlessly into your existing workflow.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-[#75C947] hover:bg-[#67b83c] text-white rounded-lg px-8"
                  data-testid="button-view-integrations"
                >
                  <a href="/register">
                    View integrations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Payouts Section */}
        <section className="py-20 md:py-32 relative overflow-hidden bg-[#e5e7ec]">
          <div className="absolute top-1/2 right-0 w-72 h-72 rounded-full bg-gradient-to-l from-lime-300/10 to-[#75C947]/5 blur-3xl translate-x-1/2" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full bg-gradient-to-t from-emerald-300/8 to-[#75C947]/5 blur-3xl translate-y-1/2" />
          <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="lg:w-1/2 space-y-6 text-center flex flex-col items-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Fast and automatic payouts
                </h2>
                <p className="text-lg text-gray-600 max-w-lg">
                  No waiting for your funds. Get same-day or next-day payouts 
                  directly to your bank account. You can even access funds 
                  instantly with our Express Payout feature.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-[#75C947] hover:bg-[#67b83c] text-white rounded-lg px-8"
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
                  <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden bg-[#85bb65] flex items-center justify-center">
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
                        className="w-full mt-4 bg-[#1a4320] hover:bg-[#1a3319] text-white rounded-xl"
                        size="sm"
                      >
                        Transfer now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Level Section */}
        <section className="py-16 md:py-24 relative overflow-hidden bg-[#1a4320]">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                Payment processing for every risk level
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                We specialize in providing tailored payment solutions for merchants operating across all risk levels.
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4 lg:min-h-[520px]">
              {/* Medium & Low Risk Card */}
              <div 
                className="group relative flex-1 bg-[#6B7280] rounded-3xl p-8 md:p-10 overflow-hidden lg:cursor-pointer transition-all duration-500 lg:hover:flex-[1.5]"
                data-testid="card-low-risk"
              >
                {/* Arrow Icon - Top Left */}
                <div className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-white" />
                </div>

                {/* Faded Graph Line Effect - Behind Images - Hidden until hover */}
                <div className="absolute bottom-0 right-0 w-80 h-64 hidden lg:block pointer-events-none lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                  <svg viewBox="0 0 200 100" className="w-full h-full opacity-20">
                    <defs>
                      <linearGradient id="graphGradientLow2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="30%" stopColor="#ffffff" stopOpacity="0.3" />
                        <stop offset="70%" stopColor="#ffffff" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 0 80 Q 30 70 50 60 T 80 45 T 120 35 T 160 20 T 200 10" 
                      stroke="url(#graphGradientLow2)" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    <path 
                      d="M 0 90 Q 40 85 60 75 T 100 60 T 140 45 T 180 30 T 200 25" 
                      stroke="url(#graphGradientLow2)" 
                      strokeWidth="1.5" 
                      fill="none"
                      opacity="0.6"
                    />
                  </svg>
                </div>

                {/* Layered Product Images - Right Side (Desktop) - Hidden until hover */}
                <div className="absolute top-1/2 -translate-y-1/2 right-[-20px] hidden lg:block z-10 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                  <div className="relative w-72 h-72">
                    {/* Back image - Coffee shop */}
                    <div className="absolute top-0 left-0 w-40 h-48 rounded-2xl overflow-hidden shadow-2xl rotate-[-8deg] transform">
                      <img 
                        src="/attached_assets/ChatGPT_Image_Dec_31,_2025,_04_23_24_AM_1767177394146.png" 
                        alt="Coffee Shop Payment" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Middle image - Tap to Pay */}
                    <div className="absolute top-[-16px] left-28 w-40 h-48 rounded-2xl overflow-hidden shadow-2xl rotate-[8deg] transform z-10">
                      <img 
                        src="/attached_assets/ChatGPT_Image_Dec_31,_2025,_04_36_23_AM_1767177394146.png" 
                        alt="Tap to Pay" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Front image - Subscriptions */}
                    <div className="absolute bottom-[-24px] left-10 w-40 h-48 rounded-2xl overflow-hidden shadow-2xl rotate-[-3deg] transform z-20">
                      <img 
                        src="/attached_assets/ChatGPT_Image_Jan_3,_2026,_12_18_17_AM_1767489858976.png" 
                        alt="Subscriptions" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col h-full pt-14 relative z-10">
                  <div>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                      Medium & low<br />risk industries
                    </h3>
                    <p className="text-white/80 text-sm mt-4 max-w-xs">
                      Your business will be supported by a dedicated team of merchant service specialists.
                    </p>
                  </div>
                  
                  {/* Industry list - Hidden until hover on desktop */}
                  <div className="mt-6 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 max-w-[50%]">
                    <div className="flex flex-col gap-y-1.5">
                      {[
                        "Subscription",
                        "Accounting",
                        "Dropshipping",
                        "High volume",
                        "Apparel",
                        "Home goods",
                        "Pet supplies",
                        "Beauty products",
                      ].map((industry) => (
                        <div key={industry} className="flex items-center gap-2 text-white/90">
                          <Check className="h-3.5 w-3.5 text-white flex-shrink-0" />
                          <span className="text-sm">{industry}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* High Risk Card */}
              <div 
                className="group relative flex-1 rounded-3xl p-8 md:p-10 overflow-hidden lg:cursor-pointer transition-all duration-500 lg:hover:flex-[1.5] bg-[#85BB65]"
                data-testid="card-high-risk"
              >
                {/* Arrow Icon - Top Left */}
                <div className="absolute top-6 left-6 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-white" />
                </div>

                {/* Faded Graph Line Effect - Behind Images - Hidden until hover */}
                <div className="absolute bottom-0 right-0 w-80 h-64 hidden lg:block pointer-events-none lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                  <svg viewBox="0 0 200 100" className="w-full h-full opacity-20">
                    <defs>
                      <linearGradient id="graphGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="30%" stopColor="#ffffff" stopOpacity="0.3" />
                        <stop offset="70%" stopColor="#ffffff" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 0 80 Q 30 70 50 60 T 80 45 T 120 35 T 160 20 T 200 10" 
                      stroke="url(#graphGradient2)" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    <path 
                      d="M 0 90 Q 40 85 60 75 T 100 60 T 140 45 T 180 30 T 200 25" 
                      stroke="url(#graphGradient2)" 
                      strokeWidth="1.5" 
                      fill="none"
                      opacity="0.6"
                    />
                  </svg>
                </div>

                {/* Layered Product Images - Right Side (Desktop) - Hidden until hover */}
                <div className="absolute top-1/2 -translate-y-1/2 right-[-20px] hidden lg:block z-10 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                  <div className="relative w-72 h-72">
                    {/* Back image - CBD (top left) */}
                    <div className="absolute top-0 left-0 w-40 h-48 rounded-2xl overflow-hidden shadow-2xl rotate-[-8deg] transform">
                      <img 
                        src="/attached_assets/ChatGPT_Image_Dec_31,_2025,_03_29_04_AM_1767173536473.png" 
                        alt="CBD Products" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Middle image - Casino/Gambling (top right, overlapping) */}
                    <div className="absolute top-[-16px] left-28 w-40 h-48 rounded-2xl overflow-hidden shadow-2xl rotate-[8deg] transform z-10">
                      <img 
                        src="/attached_assets/ChatGPT_Image_Dec_31,_2025,_03_30_41_AM_1767173536473.png" 
                        alt="Casino Gambling" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Front image - Firearms (bottom center, overlapping both) */}
                    <div className="absolute bottom-[-24px] left-10 w-40 h-48 rounded-2xl overflow-hidden shadow-2xl rotate-[-3deg] transform z-20">
                      <img 
                        src="/attached_assets/ChatGPT_Image_Dec_31,_2025,_03_25_52_AM_1767173536473.png" 
                        alt="Firearms Store" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col h-full pt-14">
                  <div>
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                      High risk industries
                    </h3>
                    <p className="text-white/70 text-sm mt-4 max-w-xs">
                      Just because a bank deems your business risky, doesn't mean you can't prosper.
                    </p>
                  </div>
                  
                  {/* Industry list - Below subtitle - Hidden until hover on desktop */}
                  <div className="mt-6 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 max-w-[50%]">
                    <div className="flex flex-col gap-y-1.5">
                      {[
                        "CBD & Hemp",
                        "Adult products",
                        "Bail bonds",
                        "Guns & firearms",
                        "Nutraceuticals",
                        "Tech support",
                        "Dating sites",
                        "Tobacco",
                      ].map((industry) => (
                        <div key={industry} className="flex items-center gap-2 text-white/90">
                          <Check className="h-3.5 w-3.5 text-white flex-shrink-0" />
                          <span className="text-sm">{industry}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-16 md:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.15) 0%, transparent 60%),
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100% 100%, 40px 40px, 40px 40px'
            }}
          />
          <div className="container px-4 md:px-6 max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Enterprise-grade security
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Your data is protected with the same encryption used by major banks. We're PCI DSS Level 1 compliant—the highest security standard in the payment industry.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                <div className="w-14 h-14 rounded-xl bg-[#75C947] flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-7 w-7 text-white" />
                </div>
                <h4 className="font-semibold text-white text-lg mb-2">256-bit encryption</h4>
                <p className="text-white/60 text-sm">Your data is scrambled into unbreakable code before traveling online</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                <div className="w-14 h-14 rounded-xl bg-[#75C947] flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
                <h4 className="font-semibold text-white text-lg mb-2">PCI DSS Compliant</h4>
                <p className="text-white/60 text-sm">Meeting industry security standards for payment processing</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                <div className="w-14 h-14 rounded-xl bg-[#75C947] flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h4 className="font-semibold text-white text-lg mb-2">We never sell your data</h4>
                <p className="text-white/60 text-sm">Your business data stays private—period. No exceptions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team & Testimonials Section */}
        <section 
          className="py-12 md:py-20 relative overflow-hidden bg-white"
        >
          <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-8 md:mb-10">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#1a4320] mb-3">
                Your success is our business
              </h3>
              <p className="text-base md:text-lg text-[#1a4320]/80 max-w-4xl mx-auto">
                We're a focused team that actually knows your business. Fast responses, personal service, and Oink—a custom AI built and trained specifically for PigBank, ready to help 24/7.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              <div className="flex flex-col items-center">
                <div className="mb-3">
                  <div className="w-36 h-48 md:w-44 md:h-56 rounded-xl overflow-hidden border-4 border-white shadow-xl">
                    <img 
                      src="/attached_assets/founder_photo.png" 
                      alt="Founder" 
                      className="w-full h-full object-cover object-top grayscale"
                    />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-[#1a4320]">Marty</h4>
                <p className="text-[#1a4320]/70 text-sm">Founder</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-3">
                  <div className="w-36 h-48 md:w-44 md:h-56 rounded-xl overflow-hidden border-4 border-white shadow-xl">
                    <img 
                      src="/attached_assets/4080994360202994240_1766076263672.png" 
                      alt="Patricia - Operations" 
                      className="w-full h-full object-cover grayscale"
                      style={{ objectPosition: 'center 15%' }}
                    />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-[#1a4320]">Patricia</h4>
                <p className="text-[#1a4320]/70 text-sm">Operations</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-3">
                  <div className="w-36 h-48 md:w-44 md:h-56 rounded-xl overflow-hidden border-4 border-white shadow-xl">
                    <img 
                      src="/attached_assets/accounting_team.png" 
                      alt="Accounting" 
                      className="w-full h-full object-cover object-top grayscale"
                    />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-[#1a4320]">Kat</h4>
                <p className="text-[#1a4320]/70 text-sm">Accounting</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-3">
                  <div className="w-36 h-48 md:w-44 md:h-56 rounded-xl overflow-hidden border-4 border-white shadow-xl">
                    <img 
                      src="/attached_assets/sales_darth_maul.png" 
                      alt="Darth Maul - Sales" 
                      className="w-full h-full object-cover object-top grayscale"
                    />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-[#1a4320]">Darth Maul</h4>
                <p className="text-[#1a4320]/70 text-sm">Sales</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="mb-3">
                  <div className="w-36 h-48 md:w-44 md:h-56 rounded-xl overflow-hidden border-4 border-white shadow-xl">
                    <img 
                      src="/attached_assets/ChatGPT_Image_Dec_18,_2025,_04_31_02_AM_1766053868295.png" 
                      alt="Oink - AI Team Lead" 
                      className="w-full h-full object-cover object-top grayscale"
                    />
                  </div>
                </div>
                <h4 className="text-lg font-bold text-[#1a4320]">Oink</h4>
                <p className="text-[#1a4320]/70 text-sm">AI Team Lead</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 md:py-20 bg-[#e5e7ec]">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <TestimonialsCarousel />
          </div>
        </section>

        <section className="py-20 md:py-32 bg-[#1a4320] relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
          <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to bring home the bacon?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of merchants who trust PigBank to power their payments. 
              Start accepting payments in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-[#75C947] hover:bg-[#67b83c] text-white rounded-lg px-8 ring-0 outline-none focus-visible:ring-0 focus:ring-0 focus:outline-none border-0"
                data-testid="button-get-started-cta"
              >
                <a href="/register">
                  Get started
                </a>
              </Button>
              <Button 
                size="lg" 
                className="rounded-lg px-8 bg-white text-[#1a4320] hover:bg-gray-100 border-0 ring-0 outline-none focus-visible:ring-0 focus:ring-0 focus:outline-none"
                data-testid="button-contact-us"
              >
                Contact us
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white" />
                <span>No setup fees</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white" />
                <span>No monthly minimums</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-white" />
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
                <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                <li><a href="/public-contact" className="hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 mb-8">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <a href="/privacy" className="hover:text-gray-900" data-testid="link-privacy-policy">Privacy Policy</a>
              <a href="/terms" className="hover:text-gray-900" data-testid="link-terms-of-service">Terms of Service</a>
              <a href="/refund-policy" className="hover:text-gray-900" data-testid="link-refund-policy">Refund Policy</a>
              <a href="/cookie-policy" className="hover:text-gray-900" data-testid="link-cookie-policy">Cookie Policy</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p>© 2026 PigBank Payments. All rights reserved.</p>
              <p className="mt-1">910 Chartres Street, New Orleans, LA 70116 | (865) 243-6011</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Made in the USA</span>
              <span className="text-lg">🇺🇸</span>
            </div>
          </div>
        </div>
      </footer>
      <style>{`
        /* Hero Styles */
        .hero-title {
          font-size: clamp(1.75rem, 5vw, 3.5rem);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        
        @media (min-width: 640px) {
          .hero-title {
            white-space: nowrap;
          }
        }
        
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
          animation: marquee 120s linear infinite;
        }
        
        .animate-marquee2 {
          animation: marquee2 120s linear infinite;
        }
        
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        
        @keyframes scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        
        .animate-scroll-up {
          animation: scroll-up 20s linear infinite;
        }
        
        .animate-scroll-down {
          animation: scroll-down 20s linear infinite;
        }
        
        .animate-scroll-up-slow {
          animation: scroll-up 25s linear infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: rotate(12deg) scale(1); }
          50% { transform: rotate(12deg) scale(1.05); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
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
