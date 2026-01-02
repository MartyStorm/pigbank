import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto py-12 md:py-20">
        <Link href="/" className="inline-flex items-center gap-2 text-[#1a4320] hover:text-[#75C947] mb-8" data-testid="link-back-home">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8" data-testid="text-page-title">Cookie Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">Last updated: January 2, 2026</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. What Are Cookies</h2>
            <p className="text-gray-600 mb-4">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-600 mb-4">PigBank Payments uses cookies to:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Keep you signed in to your merchant account</li>
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our platform</li>
              <li>Improve our services and user experience</li>
              <li>Ensure the security of your transactions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
            
            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Essential Cookies</h3>
            <p className="text-gray-600 mb-4">
              These cookies are necessary for the website to function properly. They enable core functionality such as security, account access, and session management. You cannot opt out of these cookies.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Performance Cookies</h3>
            <p className="text-gray-600 mb-4">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website performance.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Functional Cookies</h3>
            <p className="text-gray-600 mb-4">
              These cookies enable enhanced functionality and personalization, such as remembering your language preferences or the region you are in.
            </p>

            <h3 className="text-lg font-medium text-gray-800 mt-6 mb-3">Security Cookies</h3>
            <p className="text-gray-600 mb-4">
              These cookies are used to detect fraud and protect your account. They help us identify suspicious activity and prevent unauthorized access.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-600 mb-4">
              We may use third-party services that place cookies on your device. These include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Analytics providers (to understand website usage)</li>
              <li>Security services (to prevent fraud)</li>
              <li>Customer support tools (to provide assistance)</li>
            </ul>
            <p className="text-gray-600 mb-4">
              These third parties have their own privacy policies governing how they use information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Cookie Duration</h2>
            <p className="text-gray-600 mb-4">Cookies on our website fall into two categories:</p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li><strong>Session cookies:</strong> Temporary cookies that expire when you close your browser</li>
              <li><strong>Persistent cookies:</strong> Cookies that remain on your device for a set period or until you delete them</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Managing Cookies</h2>
            <p className="text-gray-600 mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>View what cookies are stored on your device</li>
              <li>Delete individual cookies or all cookies</li>
              <li>Block cookies from specific or all websites</li>
              <li>Set preferences for certain types of cookies</li>
            </ul>
            <p className="text-gray-600 mb-4">
              Please note that blocking essential cookies may prevent you from accessing certain features of our platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Do Not Track</h2>
            <p className="text-gray-600 mb-4">
              Some browsers have a "Do Not Track" feature that signals to websites that you do not want your online activity tracked. Our website currently does not respond to Do Not Track signals.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Updates to This Policy</h2>
            <p className="text-gray-600 mb-4">
              We may update this Cookie Policy from time to time. Changes will be posted on this page with an updated revision date. Continued use of our website after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
            <p className="text-gray-600">
              If you have questions about our use of cookies, please contact us at:<br /><br />
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
