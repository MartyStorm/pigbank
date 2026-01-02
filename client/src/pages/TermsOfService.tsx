import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto py-12 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-[#1a4320] hover:text-[#75C947] mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8" data-testid="text-page-title">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">Last updated: January 2, 2026</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing or using PigBank Payments services, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Services</h2>
            <p className="text-gray-600 mb-4">
              PigBank Payments provides payment processing services including credit card processing, ACH transfers, invoicing, and related financial services for businesses. We act as a payment facilitator between merchants and payment networks.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Eligibility</h2>
            <p className="text-gray-600 mb-4">To use our services, you must:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Have the legal authority to bind your business to these terms</li>
              <li>Operate a legitimate business in compliance with applicable laws</li>
              <li>Provide accurate and complete information during registration</li>
              <li>Pass our underwriting and verification process</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Account Responsibilities</h2>
            <p className="text-gray-600 mb-4">You are responsible for:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
              <li>Ensuring your business practices comply with card network rules</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Prohibited Activities</h2>
            <p className="text-gray-600 mb-4">You may not use our services for:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Illegal activities or transactions</li>
              <li>Fraudulent or deceptive practices</li>
              <li>Money laundering or terrorist financing</li>
              <li>Transactions that violate card network rules</li>
              <li>Activities that could harm PigBank's reputation or operations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Fees and Payments</h2>
            <p className="text-gray-600 mb-4">
              Transaction fees, monthly fees, and other charges will be disclosed in your merchant agreement. We reserve the right to modify fees with 30 days notice. Fees are deducted from your settlement funds or charged to your designated payment method.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Reserves and Holdbacks</h2>
            <p className="text-gray-600 mb-4">
              We may establish a reserve account to cover potential chargebacks, refunds, or other liabilities. Reserve requirements will be specified in your merchant agreement and may be adjusted based on your transaction history and risk profile.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Chargebacks and Disputes</h2>
            <p className="text-gray-600 mb-4">
              You are responsible for all chargebacks and disputes. We will notify you of chargebacks and assist with the dispute process, but the final decision rests with the card networks. Chargeback fees apply as specified in your merchant agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-600 mb-4">
              Either party may terminate this agreement with 30 days written notice. We may suspend or terminate your account immediately for violations of these terms, excessive chargebacks, or suspected fraud. Upon termination, reserves may be held for up to 180 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              To the maximum extent permitted by law, PigBank Payments shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability shall not exceed the fees paid by you in the preceding twelve months.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-600 mb-4">
              These terms shall be governed by the laws of the State of Louisiana. Any disputes shall be resolved in the courts of Orleans Parish, Louisiana.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-600">
              PigBank Payments<br />
              910 Chartres Street<br />
              New Orleans, LA 70116<br />
              Phone: (865) 243-6011<br />
              Email: legal@pigbank.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
