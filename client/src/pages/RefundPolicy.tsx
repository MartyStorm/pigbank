import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto py-12 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-[#1a4320] hover:text-[#75C947] mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8" data-testid="text-page-title">Refund & Cancellation Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">Last updated: January 2, 2026</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Overview</h2>
            <p className="text-gray-600 mb-4">
              This Refund and Cancellation Policy outlines the terms under which PigBank Payments handles refunds, cancellations, and account terminations for our merchant services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Service Cancellation</h2>
            <p className="text-gray-600 mb-4">
              Merchants may cancel their PigBank Payments account at any time by providing 30 days written notice. To cancel:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Contact our support team at (865) 243-6011</li>
              <li>Email cancellation@pigbank.com with your merchant ID</li>
              <li>Submit a cancellation request through your merchant dashboard</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. No Setup Fee Refunds</h2>
            <p className="text-gray-600 mb-4">
              PigBank Payments does not charge setup fees. If you were charged a setup fee by error, please contact support for a full refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Monthly Service Fees</h2>
            <p className="text-gray-600 mb-4">
              Monthly service fees are non-refundable once the billing cycle has begun. If you cancel mid-cycle, you will not receive a prorated refund for the remaining days. However, no additional monthly fees will be charged after your cancellation is processed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Transaction Fees</h2>
            <p className="text-gray-600 mb-4">
              Transaction processing fees are non-refundable as they cover the cost of processing each transaction through the payment networks. This applies regardless of whether the underlying transaction is later refunded by the merchant to their customer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Customer Refunds</h2>
            <p className="text-gray-600 mb-4">
              Refunds to your customers are processed through your merchant dashboard. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Issuing refunds in accordance with your own refund policy</li>
              <li>Ensuring sufficient funds are available in your settlement account</li>
              <li>Processing refunds within card network timeframes (typically 120 days)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Reserve Funds</h2>
            <p className="text-gray-600 mb-4">
              Upon account cancellation, any reserve funds held will be retained for a period of up to 180 days to cover potential chargebacks or disputes. After this period, remaining reserve funds will be released to your designated bank account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Chargeback Fees</h2>
            <p className="text-gray-600 mb-4">
              Chargeback fees are non-refundable regardless of the outcome of the chargeback dispute. These fees cover the administrative costs of processing chargebacks through the card networks.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Equipment Returns</h2>
            <p className="text-gray-600 mb-4">
              If you have leased or purchased payment terminals or equipment from PigBank:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Leased equipment must be returned within 30 days of cancellation</li>
              <li>Purchased equipment is non-refundable after 14 days</li>
              <li>Damaged or unreturned leased equipment may result in additional charges</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Exceptions</h2>
            <p className="text-gray-600 mb-4">
              We may make exceptions to this policy in cases of documented service failures, billing errors, or other circumstances at our sole discretion. Contact our support team to discuss your specific situation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">11. Contact Us</h2>
            <p className="text-gray-600">
              For refund or cancellation inquiries:<br /><br />
              PigBank Payments<br />
              910 Chartres Street<br />
              New Orleans, LA 70116<br />
              Phone: (865) 243-6011<br />
              Email: support@pigbank.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
