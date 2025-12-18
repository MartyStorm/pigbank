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
  Users,
  Star,
  Building2,
  Coins,
  FileCheck,
  Link
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
      className="py-12 md:py-16 overflow-hidden bg-[#f3f4f6]"
    >
      <div className="text-center mb-4">
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
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-400 mx-4"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              PigBank Payments - 
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
    <section className="py-10 md:py-14 relative bg-[#232323]">
      <div className="container px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-6">
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
                      <blockquote className="text-xl md:text-2xl lg:text-3xl font-light text-white leading-relaxed mb-6">
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
                        className="relative w-48 h-60 md:w-64 md:h-72 rounded-2xl overflow-hidden bg-white flex items-center justify-center p-6"
                      >
                        <img 
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="max-w-full max-h-full object-contain"
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

        <div className="flex items-center justify-center gap-2 mt-6">
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
  const heroSlideCount = 5;
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
                  
                  <div className="flex min-h-[650px] md:min-h-[730px] lg:min-h-[700px] items-center pt-12 md:pt-16 pb-12 md:pb-16">
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
                              className="w-[340px] md:w-[450px] lg:w-[540px] xl:w-[620px] h-auto"
                            />
                            <img 
                              src="/iphone-payouts.png" 
                              alt="PigBank Payouts on iPhone" 
                              className="absolute w-[55px] md:w-[70px] lg:w-[85px] xl:w-[100px] h-auto z-20 bottom-0 right-0"
                            />
                            {/* Free Gateway Badge - Certificate Seal */}
                            <div className="absolute -top-6 -right-4 md:-top-4 md:-right-2 z-30">
                              <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                                  <defs>
                                    <linearGradient id="sealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                      <stop offset="0%" stopColor="#73cb43" />
                                      <stop offset="100%" stopColor="#203e22" />
                                    </linearGradient>
                                  </defs>
                                  <path 
                                    d="M50,5 L55,18 L65,8 L66,22 L78,15 L76,29 L90,26 L84,38 L97,42 L88,52 L97,62 L84,66 L90,78 L76,75 L78,89 L66,82 L65,96 L55,86 L50,99 L45,86 L35,96 L34,82 L22,89 L24,75 L10,78 L16,66 L3,62 L12,52 L3,42 L16,38 L10,26 L24,29 L22,15 L34,22 L35,8 L45,18 Z" 
                                    fill="url(#sealGradient)"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                    <span className="text-[9px] md:text-[11px] lg:text-[13px] font-black text-white leading-tight block" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                                      GATEWAY
                                    </span>
                                    <span className="text-[9px] md:text-[11px] lg:text-[13px] font-black text-white leading-tight block" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                                      INCLUDED
                                    </span>
                                  </div>
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
        </section>

        <section className="bg-[#15391c] py-8">
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
        <section className="py-12 md:py-16 bg-[#f9fafb]">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
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
              style={{
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              }}
            >
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

        {/* Payment Methods Section */}
        <section className="py-12 md:py-16 bg-[#ffffff]">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Accept payments your way
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Give your customers the flexibility to pay however they prefer. 
                We support all major payment methods so you never miss a sale.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
              <div className="rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow" style={{ background: 'linear-gradient(135deg, #1d441f 0%, #2a5a2e 100%)' }}>
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-7 w-7 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-1">Credit Cards</h4>
                <p className="text-white/70 text-sm">Visa, Mastercard, Amex, Discover</p>
              </div>
              <div className="rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow" style={{ background: 'linear-gradient(135deg, #1d441f 0%, #2a5a2e 100%)' }}>
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-1">ACH Transfers</h4>
                <p className="text-white/70 text-sm">Direct bank payments</p>
              </div>
              <div className="rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow" style={{ background: 'linear-gradient(135deg, #1d441f 0%, #2a5a2e 100%)' }}>
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Coins className="h-7 w-7 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-1">Cryptocurrency</h4>
                <p className="text-white/70 text-sm">Bitcoin, Ethereum & more</p>
              </div>
              <div className="rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow" style={{ background: 'linear-gradient(135deg, #1d441f 0%, #2a5a2e 100%)' }}>
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <FileCheck className="h-7 w-7 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-1">eChecks</h4>
                <p className="text-white/70 text-sm">Digital check processing</p>
              </div>
              <div className="rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow" style={{ background: 'linear-gradient(135deg, #1d441f 0%, #2a5a2e 100%)' }}>
                <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Link className="h-7 w-7 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-1">Click to Pay</h4>
                <p className="text-white/70 text-sm">Send payment links via text or email</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f9fafb]">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto py-16 md:py-24">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Payment processing for every risk level
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We specialize in providing tailored payment solutions for merchants operating across all risk levels.
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4 min-h-[500px]">
              <div 
                className="group relative flex-1 rounded-3xl p-8 md:p-10 overflow-hidden cursor-pointer transition-all duration-500 hover:flex-[2] lg:hover:flex-[2]"
                style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}
                data-testid="card-high-risk"
              >
                <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-white" />
                </div>
                
                <div className="mt-16 space-y-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-white">
                    High risk industries
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
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

                <div className="absolute bottom-8 left-8 right-8">
                  <span className="text-white/60 text-sm italic">
                    Just because a bank deems your business risky, doesn't mean you can't prosper.
                  </span>
                </div>
              </div>

              <div 
                className="group relative flex-1 bg-[#73cb43] rounded-3xl p-8 md:p-10 overflow-hidden cursor-pointer transition-all duration-500 hover:flex-[2] lg:hover:flex-[2]"
                data-testid="card-low-risk"
              >
                <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowUpRight className="h-5 w-5 text-white" />
                </div>
                
                <div className="mt-16 space-y-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-white">
                    Medium & Low risk
                  </h3>
                  
                  <p className="text-white/80 text-sm">
                    Your business will be supported by a dedicated team of merchant service specialists.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HorizontalScrollText />

        {/* Customer Service Strip */}
        <section className="py-12 md:py-16 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #16391c 0%, #1d4a24 50%, #16391c 100%)' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#73cb43] blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#73cb43] blur-3xl translate-y-1/2 -translate-x-1/3" />
          </div>
          <div className="container px-4 md:px-6 max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-8 md:mb-10">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                A small team that gives you big attention
              </h3>
              <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
                We're a focused team that actually knows your business. Fast responses, personal service, 
                and an AI assistant to help you anytime—even when we're closed.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              <div className="flex flex-col items-center">
                <div className="w-36 h-48 md:w-44 md:h-56 rounded-xl overflow-hidden border-4 border-white shadow-xl mb-3">
                  <img 
                    src="/attached_assets/founder_photo.png" 
                    alt="Founder" 
                    className="w-full h-full object-cover object-top grayscale"
                  />
                </div>
                <h4 className="text-lg font-bold text-white">Marty</h4>
                <p className="text-white/60 text-sm">Your account manager</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-36 h-48 md:w-44 md:h-56 rounded-xl overflow-hidden border-4 border-white shadow-xl mb-3">
                  <img 
                    src="/attached_assets/operations_patricia.png" 
                    alt="Patricia - Operations" 
                    className="w-full h-full object-cover object-top grayscale"
                  />
                </div>
                <h4 className="text-lg font-bold text-white">Patricia</h4>
                <p className="text-white/60 text-sm">Keeps things running</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-36 h-48 md:w-44 md:h-56 rounded-xl overflow-hidden border-4 border-white shadow-xl mb-3">
                  <img 
                    src="/attached_assets/accounting_team.png" 
                    alt="Accounting" 
                    className="w-full h-full object-cover object-top grayscale"
                  />
                </div>
                <h4 className="text-lg font-bold text-white">Kat</h4>
                <p className="text-white/60 text-sm">Accounting</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-36 h-48 md:w-44 md:h-56 rounded-xl bg-gradient-to-br from-[#73cb43] to-[#5ab334] flex items-center justify-center border-4 border-white shadow-xl mb-3">
                </div>
                <h4 className="text-lg font-bold text-white">Sales</h4>
                <p className="text-white/60 text-sm">Your partner</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-36 h-48 md:w-44 md:h-56 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-xl mb-3">
                  <Zap className="h-14 w-14 md:h-16 md:w-16 text-white" />
                </div>
                <h4 className="text-lg font-bold text-white">AI Assistant</h4>
                <p className="text-white/60 text-sm">Available 24/7</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-[#ffffff]">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
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

        <section className="py-20 md:py-32 bg-[#f9fafb]">
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

        {/* Security Section */}
        <section className="py-16 md:py-24" style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}>
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Bank-level security you can trust
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Your data is protected with the same encryption used by major banks. We're PCI DSS Level 1 compliant—the highest security standard in the payment industry.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                <div className="w-14 h-14 rounded-xl bg-[#73cb43] flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-7 w-7 text-white" />
                </div>
                <h4 className="font-semibold text-white text-lg mb-2">256-bit encryption</h4>
                <p className="text-white/60 text-sm">Every transaction is protected with military-grade encryption</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                <div className="w-14 h-14 rounded-xl bg-[#73cb43] flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
                <h4 className="font-semibold text-white text-lg mb-2">PCI DSS Level 1</h4>
                <p className="text-white/60 text-sm">The highest security certification in the payments industry</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                <div className="w-14 h-14 rounded-xl bg-[#73cb43] flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <h4 className="font-semibold text-white text-lg mb-2">We never sell your data</h4>
                <p className="text-white/60 text-sm">Your business data stays private—period. No exceptions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="py-20 md:py-32 overflow-hidden bg-[#ffffff]">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
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
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#f8f9fa] to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f8f9fa] to-transparent pointer-events-none" />
                </div>
              </div>
              <div className="lg:w-1/2 space-y-6 order-1 lg:order-2 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Integrations that power your growth
                </h2>
                <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                  Connect with the industry's leading platforms instantly. Whether you need 
                  plug-and-play solutions or custom connections, our payment technology 
                  fits seamlessly into your existing workflow.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-[#73cb43] hover:bg-[#65b53b] text-white rounded-full px-8"
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

        {/* Transparent Pricing Section */}
        <section className="py-20 md:py-32 bg-[#f9fafb]">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
                  Transparent pricing, no surprises
                </h2>
                <p className="text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                  Know exactly what you're paying before you sign up. Our straightforward 
                  pricing means no hidden fees, no surprise charges, and no confusing rate 
                  structures. What you see is what you get.
                </p>
                <Button 
                  asChild
                  size="lg" 
                  className="bg-[#73cb43] hover:bg-[#65b53b] text-white rounded-full px-8"
                  data-testid="button-view-pricing"
                >
                  <a href="/register">
                    View pricing
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="w-64 h-64 md:w-80 md:h-80 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                    <div className="bg-white rounded-2xl shadow-xl p-5 w-52 md:w-64">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600">Your Rate</span>
                        <CheckCircle2 className="h-5 w-5 text-[#73cb43]" />
                      </div>
                      <div className="text-center py-3">
                        <div className="text-3xl font-bold text-gray-900">2.9% + 30¢</div>
                        <div className="text-sm text-gray-500 mt-1">per transaction</div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-[#73cb43]" />
                          <span>No monthly fees</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="h-4 w-4 text-[#73cb43]" />
                          <span>No hidden charges</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TestimonialsCarousel />

        <section className="py-20 md:py-32 bg-[#1d441f]">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to bring home the bacon?
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Join thousands of merchants who trust PigBank to power their payments. 
              Start accepting payments in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                size="lg" 
                className="bg-[#73cb43] hover:bg-[#65b53b] text-white rounded-full px-8"
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
                className="rounded-full px-8 border-white/30 text-white hover:bg-white/10"
                data-testid="button-talk-to-sales"
              >
                Talk to sales
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm text-white/60">
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
            <p className="text-sm text-gray-500">© 2026 PigBank Payments. All rights reserved.</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Made in the USA</span>
              <span className="text-lg">🇺🇸</span>
            </div>
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
