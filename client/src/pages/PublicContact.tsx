import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, MessageSquare, Settings, ArrowRight } from "lucide-react";
import { useState } from "react";

const contactOptions = [
  {
    icon: Phone,
    title: "Sales",
    description: "Contact our dedicated sales team to open your PigBank account today.",
    links: [
      { label: "Schedule a meeting", href: "#" },
      { label: "Call +1 (888) 555-0123", href: "tel:+18885550123" },
    ],
  },
  {
    icon: MessageSquare,
    title: "Chat",
    description: "Available from:\nMon – Thu 7am – 4:30pm (PST)\nFri 7am – 2pm (PST)",
    links: [
      { label: "Chat now", href: "#" },
    ],
  },
  {
    icon: Settings,
    title: "Support",
    description: "Do you have a technical issue or a question about your PigBank account?",
    links: [
      { label: "Submit a ticket", href: "#" },
      { label: "Email our support team", href: "mailto:support@pigbank.com" },
    ],
  },
];

export default function PublicContact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
    agreeToTerms: false,
  });

  const navItems = [
    { label: "Integrations", href: "/public-integrations" },
    { label: "Pricing", href: "/public-pricing" },
    { label: "Contact", href: "/public-contact" },
  ];

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
        <section className="py-16 md:py-24" style={{ background: 'linear-gradient(135deg, #e8d5f0 0%, #fde8d3 100%)' }}>
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              How can we help you?
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl">
              Not ready to start an account? Reach out to our sales, chat, or support teams.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {contactOptions.map((option) => (
                <div 
                  key={option.title}
                  className="bg-[#1a4320] rounded-2xl p-6 text-white"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#73cb43]/20 flex items-center justify-center mb-6">
                    <option.icon className="h-6 w-6 text-[#73cb43]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{option.title}</h3>
                  <p className="text-white/70 text-sm mb-6 whitespace-pre-line leading-relaxed">
                    {option.description}
                  </p>
                  <div className="space-y-2">
                    {option.links.map((link) => (
                      <a 
                        key={link.label}
                        href={link.href} 
                        className="flex items-center text-[#73cb43] font-medium hover:text-[#9ee068] transition-colors text-sm"
                      >
                        {link.label}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-6">Points of contact</h2>
                
                <div className="mb-8">
                  <p className="font-medium text-gray-900">Sales</p>
                  <a href="mailto:sales@pigbank.com" className="text-[#73cb43] hover:underline">sales@pigbank.com</a>
                </div>
                
                <div className="mb-8">
                  <p className="font-medium text-gray-900">Support</p>
                  <a href="mailto:support@pigbank.com" className="text-[#73cb43] hover:underline">support@pigbank.com</a>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 mb-6 mt-12">Our offices</h3>
                
                <div className="mb-6">
                  <p className="font-bold text-gray-900">PigBank US</p>
                  <p className="text-gray-600 text-sm">123 Business Park Drive, Suite 400</p>
                  <p className="text-gray-600 text-sm">San Francisco, CA 94105</p>
                  <p className="text-gray-500 text-sm mt-2">Hours: Mon – Thu 7am – 4:30pm (PST)</p>
                  <p className="text-gray-500 text-sm">Fri 7am – 2:30pm (PST)</p>
                  <p className="text-gray-500 text-sm">Phone: +1 888 555 0123</p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Get in touch</h2>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                      <Input 
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="bg-gray-100 border-0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                      <Input 
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="bg-gray-100 border-0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <Input 
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-gray-100 border-0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your message</label>
                    <Textarea 
                      placeholder="Write text here ..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="bg-gray-100 border-0 min-h-[150px]"
                    />
                  </div>

                  <div className="flex items-start gap-2">
                    <input 
                      type="checkbox"
                      id="terms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => setFormData({...formData, agreeToTerms: e.target.checked})}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to PigBank's <a href="#" className="text-[#73cb43] hover:underline">terms of service</a> and <a href="#" className="text-[#73cb43] hover:underline">privacy policy</a>.
                    </label>
                  </div>

                  <Button 
                    type="submit"
                    className="bg-[#73cb43] hover:bg-[#65b53b] text-white px-8"
                  >
                    Send message
                  </Button>
                </form>
              </div>
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
