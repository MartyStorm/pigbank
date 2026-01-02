import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto py-12 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-[#1a4320] hover:text-[#75C947] mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8" data-testid="text-page-title">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">Last updated: January 2, 2026</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 mb-4">
              PigBank Payments ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our payment processing services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
            <p className="text-gray-600 mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Business information (company name, address, tax identification number)</li>
              <li>Contact information (name, email address, phone number)</li>
              <li>Financial information (bank account details, transaction history)</li>
              <li>Identity verification documents</li>
              <li>Transaction data processed through our platform</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Process payment transactions on your behalf</li>
              <li>Verify your identity and prevent fraud</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Improve our services and develop new features</li>
              <li>Send important notices about your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Payment networks and financial institutions necessary to process transactions</li>
              <li>Service providers who assist in our operations</li>
              <li>Law enforcement or regulatory bodies when required by law</li>
              <li>Third parties with your explicit consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement industry-standard security measures including 256-bit encryption, PCI DSS Level 1 compliance, and regular security audits to protect your information from unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-600 mb-4">
              We retain your information for as long as necessary to provide our services and comply with legal obligations. Transaction records are retained for a minimum of seven years as required by financial regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your data (subject to legal requirements)</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-600">
              PigBank Payments<br />
              910 Chartres Street<br />
              New Orleans, LA 70116<br />
              Phone: (865) 243-6011<br />
              Email: privacy@pigbank.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
