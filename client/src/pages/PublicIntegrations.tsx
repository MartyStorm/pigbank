import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const integrations = [
  {
    name: "Square",
    logo: "□",
    logoColor: "bg-black",
    description: "Accept payments seamlessly through Square's platform while leveraging PigBank's advanced payment processing capabilities.",
  },
  {
    name: "Shopify",
    logo: "🛍",
    logoColor: "bg-[#95bf47]",
    description: "Power your Shopify store with PigBank's comprehensive payment solutions and enjoy simplified high-risk merchant processing.",
  },
  {
    name: "Wix",
    logo: "WIX",
    logoColor: "bg-gray-800",
    description: "Integrate PigBank's payment processing directly into your Wix website for a seamless checkout experience.",
  },
  {
    name: "WooCommerce",
    logo: "woo",
    logoColor: "bg-[#7f54b3]",
    description: "Connect your WooCommerce store to PigBank for powerful payment processing and fraud protection.",
  },
  {
    name: "BigCommerce",
    logo: "B",
    logoColor: "bg-[#34313f]",
    description: "Seamlessly integrate PigBank with BigCommerce to accept payments and manage transactions.",
  },
  {
    name: "Ecwid",
    logo: "🛒",
    logoColor: "bg-[#0070e0]",
    description: "Add PigBank payment processing to your Ecwid store and start accepting payments globally.",
  },
];

export default function PublicIntegrations() {
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
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Connect and grow with powerful integrations
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Start accepting payments quickly with our pre-built connections to leading eCommerce and business software.
            </p>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map((integration) => (
                <div 
                  key={integration.name}
                  className="bg-[#203e22] rounded-2xl p-6 text-white hover:bg-[#1a3319] transition-colors group"
                >
                  <div className={`w-14 h-14 ${integration.logoColor} rounded-xl flex items-center justify-center mb-6 text-white font-bold text-lg`}>
                    {integration.logo}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{integration.name}</h3>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    {integration.description}
                  </p>
                  <a 
                    href="#" 
                    className="inline-flex items-center text-[#73cb43] font-medium hover:text-[#9ee068] transition-colors"
                  >
                    View integration
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Don't see your platform?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We're constantly adding new integrations. Contact us to request a new integration or learn about our API.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-[#73cb43] hover:bg-[#65b53b] text-white rounded-md px-8"
              >
                <a href="/register">Get started</a>
              </Button>
              <Button 
                asChild
                size="lg" 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md px-8"
              >
                <a href="#">Contact sales</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#203e22] py-12">
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
