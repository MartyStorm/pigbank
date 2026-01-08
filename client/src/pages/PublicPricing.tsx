import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "$0",
    period: "/monthly fee",
    description: "Manage your transactions with smooth and secure credit card processing.",
    minimum: "$50 monthly minimum",
    features: [
      "Credit card processing",
      "Basic fraud protection",
      "Email support",
      "Standard payouts (2-3 days)",
    ],
    popular: false,
  },
  {
    name: "Plus",
    price: "$25",
    period: "/monthly fee",
    description: "Designed to enhance efficiency and elevate the payment experience for your customers.",
    minimum: "$50 monthly minimum",
    features: [
      "Everything in Basic",
      "Advanced fraud protection",
      "Priority email support",
      "Faster payouts (next day)",
      "Chargeback management",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "$95",
    period: "/monthly fee",
    description: "Optimize your operations and boost revenue with our comprehensive suite of products.",
    minimum: "$0 monthly minimum",
    features: [
      "Everything in Plus",
      "Phone support",
      "Same-day payouts",
      "Dedicated account manager",
      "Custom integrations",
      "Volume discounts",
    ],
    popular: false,
  },
  {
    name: "API Concierge",
    price: "$495",
    period: "/monthly fee",
    description: "Best for large scale uses and extended redistribution rights.",
    minimum: "$0 monthly minimum",
    features: [
      "Everything in Premium",
      "White-label solutions",
      "Custom API development",
      "24/7 priority support",
      "SLA guarantees",
      "Enterprise security",
    ],
    popular: false,
  },
];

const navItems = [
  { label: "Integrations", href: "/public-integrations" },
  { label: "Pricing", href: "/public-pricing" },
  { label: "Contact", href: "/public-contact" },
];

export default function PublicPricing() {
  const [activeTab, setActiveTab] = useState<'standard' | 'alternative'>('standard');

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#1a4320]/20 bg-[#1a4320] fixed top-0 left-0 right-0 z-50">
        <div className="flex h-20 items-center justify-between px-4 md:px-6 lg:px-8 w-full">
          <div className="flex items-center gap-10">
            <a href="/landing">
              <img 
                src="/attached_assets/Pig_Bank_Logo_new_y_compliance_copy_1767877796184.png" 
                alt="Pigbank" 
                className="h-12 w-auto object-contain"
              />
            </a>
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <a 
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-1 text-base text-white/90 hover:text-[#73cb43] transition-all py-6 border-b-2 border-transparent hover:border-[#73cb43]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <a 
              href="/login" 
              className="text-base text-white/90 hover:text-[#73cb43] transition-colors hidden sm:block"
            >
              Log in
            </a>
            <a 
              href="/register"
              className="bg-[#75C947] hover:bg-[#67b83c] text-white font-medium px-5 py-2 rounded-md transition-colors"
            >
              Get started
            </a>
          </div>
        </div>
      </header>
      <main className="pt-20">
        <section className="py-16 md:py-24 bg-[#effad6]">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Flexible plans that grow with your business
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that's right for you.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-gray-100 rounded-full p-1">
                <button 
                  onClick={() => setActiveTab('standard')}
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                    activeTab === 'standard' 
                      ? 'bg-[#1a4320] text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  data-testid="button-tab-standard"
                >
                  Standard plans
                </button>
                <button 
                  onClick={() => setActiveTab('alternative')}
                  className={`px-6 py-2 rounded-full font-medium text-sm transition-colors ${
                    activeTab === 'alternative' 
                      ? 'bg-[#1a4320] text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  data-testid="button-tab-alternative"
                >
                  Alternative payment methods
                </button>
              </div>
            </div>

            {activeTab === 'alternative' ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-full bg-[#effad6] flex items-center justify-center mb-6">
                  <Clock className="w-10 h-10 text-[#1a4320]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Coming Soon</h3>
                <p className="text-gray-600 text-center max-w-md">
                  Alternative payment methods including ACH, cryptocurrency, and eChecks are coming soon. 
                  Contact us for early access.
                </p>
                <Button 
                  asChild
                  className="mt-6 bg-[#73cb43] hover:bg-[#65b53b] text-white"
                >
                  <a href="/public-contact">Contact us</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <div 
                  key={plan.name}
                  className={`rounded-2xl p-6 border ${plan.popular ? 'border-[#73cb43] border-2' : 'border-gray-200'} bg-white relative`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#73cb43] text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 text-sm mb-6 min-h-[60px]">
                    {plan.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{plan.minimum}</p>
                  <p className="text-sm text-[#73cb43] font-medium mb-6">+ processing fees</p>
                  
                  <Button 
                    asChild
                    className={`w-full mb-6 ${plan.popular ? 'bg-[#73cb43] hover:bg-[#65b53b] text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                  >
                    <a href="/register">Get started</a>
                  </Button>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="h-5 w-5 text-[#73cb43] flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              </div>
            )}
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
              <a href="/privacy" className="hover:text-gray-900">Privacy Policy</a>
              <a href="/terms" className="hover:text-gray-900">Terms of Service</a>
              <a href="/refund-policy" className="hover:text-gray-900">Refund Policy</a>
              <a href="/cookie-policy" className="hover:text-gray-900">Cookie Policy</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <p>© 2026 Pigbank Payments. All rights reserved.</p>
              <p className="mt-1">910 Chartres Street, New Orleans, LA 70116 | (865) 243-6011</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Made in the USA</span>
              <span className="text-lg">🇺🇸</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
