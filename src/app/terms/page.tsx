"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-primary-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-dark-900">
                Terms of Service
              </h1>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          <p className="text-dark-600 mb-8">
            <strong>Last Updated:</strong> November 14, 2025
          </p>

          <div className="prose prose-blue max-w-none space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-dark-700 leading-relaxed">
                By accessing and using Halo Hair Lounge's website and services,
                you accept and agree to be bound by the terms and provision of
                this agreement. If you do not agree to these terms, please do
                not use our services.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">
                2. Services Description
              </h2>
              <p className="text-dark-700 leading-relaxed mb-3">
                Halo Hair Lounge provides professional hair care services,
                including but not limited to:
              </p>
              <ul className="list-disc list-inside text-dark-700 space-y-2 ml-4">
                <li>Hair cutting and styling</li>
                <li>Hair coloring and highlighting</li>
                <li>Hair treatments and conditioning</li>
                <li>Hair extensions and braiding</li>
                <li>Sale of hair care products</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">
                3. Appointments and Bookings
              </h2>
              <div className="space-y-3 text-dark-700">
                <p className="leading-relaxed">
                  <strong>3.1 Booking:</strong> Appointments can be booked
                  through our website, phone, or in person. All bookings are
                  subject to availability.
                </p>
                <p className="leading-relaxed">
                  <strong>3.2 Cancellation:</strong> Cancellations must be made
                  at least 24 hours in advance. Late cancellations or no-shows
                  may result in a cancellation fee.
                </p>
                <p className="leading-relaxed">
                  <strong>3.3 Late Arrivals:</strong> We reserve the right to
                  reschedule or shorten appointments if you arrive more than 15
                  minutes late.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">
                4. Payment Terms
              </h2>
              <div className="space-y-3 text-dark-700">
                <p className="leading-relaxed">
                  <strong>4.1 Payment Methods:</strong> We accept cash, credit
                  cards, and debit cards. Payment is due at the time of service.
                </p>
                <p className="leading-relaxed">
                  <strong>4.2 Pricing:</strong> All prices are subject to change
                  without notice. Current pricing will be confirmed at the time
                  of booking.
                </p>
                <p className="leading-relaxed">
                  <strong>4.3 Tips:</strong> Gratuities are appreciated but not
                  mandatory.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">
                5. Product Sales and Returns
              </h2>
              <div className="space-y-3 text-dark-700">
                <p className="leading-relaxed">
                  <strong>5.1 Returns:</strong> Unopened products may be
                  returned within 14 days with receipt. Opened products cannot
                  be returned due to health and safety regulations.
                </p>
                <p className="leading-relaxed">
                  <strong>5.2 Product Advice:</strong> We strive to provide
                  accurate product recommendations, but results may vary based
                  on individual hair type and condition.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">
                6. Health and Safety
              </h2>
              <div className="space-y-3 text-dark-700">
                <p className="leading-relaxed">
                  <strong>6.1 Allergies:</strong> Clients must inform us of any
                  allergies, sensitivities, or medical conditions before
                  services.
                </p>
                <p className="leading-relaxed">
                  <strong>6.2 Patch Tests:</strong> We recommend patch tests for
                  color services. Clients who decline are solely responsible for
                  any adverse reactions.
                </p>
                <p className="leading-relaxed">
                  <strong>6.3 Hygiene:</strong> We maintain the highest
                  standards of cleanliness and sanitation. All tools are
                  sanitized between clients.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">
                7. Liability and Disclaimer
              </h2>
              <p className="text-dark-700 leading-relaxed">
                While we strive for excellence, hair services involve inherent
                risks. We are not liable for damages resulting from failure to
                follow aftercare instructions or pre-existing hair conditions.
                Our liability is limited to the cost of the service provided.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">
                8. User Accounts
              </h2>
              <div className="space-y-3 text-dark-700">
                <p className="leading-relaxed">
                  <strong>8.1 Account Security:</strong> You are responsible for
                  maintaining the confidentiality of your account credentials.
                </p>
                <p className="leading-relaxed">
                  <strong>8.2 Accurate Information:</strong> You agree to
                  provide accurate and current information when creating an
                  account.
                </p>
                <p className="leading-relaxed">
                  <strong>8.3 Account Termination:</strong> We reserve the right
                  to terminate accounts that violate these terms.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">
                9. Intellectual Property
              </h2>
              <p className="text-dark-700 leading-relaxed">
                All content on this website, including text, graphics, logos,
                and images, is the property of Halo Hair Lounge and protected by
                copyright laws. Unauthorized use is prohibited.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">
                10. Privacy
              </h2>
              <p className="text-dark-700 leading-relaxed">
                Your privacy is important to us. Please review our{" "}
                <Link
                  href="/privacy"
                  className="text-primary-600 hover:text-primary-700 font-medium underline"
                >
                  Privacy Policy
                </Link>{" "}
                to understand how we collect, use, and protect your personal
                information.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">
                11. Changes to Terms
              </h2>
              <p className="text-dark-700 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes
                will be effective immediately upon posting. Continued use of our
                services constitutes acceptance of modified terms.
              </p>
            </section>

            {/* Section 12 */}
            <section>
              <h2 className="text-2xl font-bold text-dark-900 mb-4">
                12. Contact Information
              </h2>
              <p className="text-dark-700 leading-relaxed">
                If you have questions about these Terms of Service, please
                contact us at:
              </p>
              <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                <p className="text-dark-800">
                  <strong>Email:</strong> support@halohair-lounge.site
                </p>
                <p className="text-dark-800">
                  <strong>Phone:</strong> +1 (234) 567-890
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
