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

const navItems = [
  { label: "Integrations", href: "/public-integrations" },
  { label: "Pricing", href: "/public-pricing" },
  { label: "Contact", href: "/public-contact" },
];

export default function PublicIntegrations() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#1a4320]/20 bg-[#1a4320] fixed top-0 left-0 right-0 z-50">
        <div className="flex h-20 items-center justify-between px-4 md:px-6 lg:px-8 w-full">
          <div className="flex items-center gap-10">
            <a href="/landing">
              <img 
                src="/attached_assets/Pig_Bank_Logo_new_y_copy_1767787947888.png" 
                alt="PigBank" 
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
                  className="bg-[#1a4320] rounded-2xl p-6 text-white hover:bg-[#1a3319] transition-colors group"
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
    </div>
  );
}
