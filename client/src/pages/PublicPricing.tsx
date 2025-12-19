import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

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

export default function PublicPricing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white fixed top-0 left-0 right-0 z-50">
        <div className="container flex h-20 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
          <a href="/landing">
            <img 
              src="/pig-bank-logo-light.png" 
              alt="PigBank" 
              className="h-12 w-auto object-contain" 
            />
          </a>
          <div className="flex items-center gap-5">
            <a 
              href="/login" 
              className="text-base text-gray-700 hover:text-gray-900 transition-colors hidden sm:block"
            >
              Log in
            </a>
            <a 
              href="/register"
              className="bg-[#73cb43] hover:bg-[#65b53b] text-white font-medium px-5 py-2 rounded-md transition-colors"
            >
              Get started
            </a>
          </div>
        </div>
      </header>

      <main className="pt-20">
        <section 
          className="py-16 md:py-24"
          style={{ background: 'radial-gradient(ellipse at center, #2d5a2d 0%, #264a26 40%, #1a4320 70%, #1a3319 100%)' }}
        >
          <div className="container px-4 md:px-6 max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Flexible plans that grow with your business
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              Choose the plan that's right for you.
            </p>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-gray-100 rounded-full p-1">
                <button className="px-6 py-2 rounded-full bg-[#1a4320] text-white font-medium text-sm">
                  Standard plans
                </button>
                <button className="px-6 py-2 rounded-full text-gray-600 font-medium text-sm hover:text-gray-900">
                  Alternative payment methods
                </button>
              </div>
            </div>

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
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              All plans include
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {[
                "PCI Compliance",
                "SSL Encryption",
                "Fraud Monitoring",
                "24/7 Uptime",
              ].map((item) => (
                <div key={item} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#73cb43]/10 flex items-center justify-center">
                    <Check className="h-6 w-6 text-[#73cb43]" />
                  </div>
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#1a4320] py-12">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <img 
              src="/pig-bank-logo-dark.png" 
              alt="PigBank" 
              className="h-10"
            />
            <p className="text-white/60 text-sm">
              © 2024 PigBank. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
