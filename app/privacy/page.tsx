import React from 'react';
import { Shield, Eye, Database, Phone, Mail, MapPin } from 'lucide-react';
import SocialShare from '@/components/SocialShare';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            At LUX Cabinets & Stones, we are committed to protecting your
            privacy and ensuring the security of your personal information.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Information We Collect */}
          <section>
            <div className="flex items-center mb-4">
              <Database className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Information We Collect
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We collect information that you provide directly to us,
                  including:
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2 ml-4 space-y-1">
                  <li>Name, email address, and phone number</li>
                  <li>Home address and project location details</li>
                  <li>Project specifications and design preferences</li>
                  <li>
                    Payment information (processed securely through third-party
                    providers)
                  </li>
                  <li>Communication records and service requests</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Automatically Collected Information
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  When you visit our website, we may automatically collect:
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2 ml-4 space-y-1">
                  <li>IP address and browser information</li>
                  <li>Website usage data and page interactions</li>
                  <li>Device information and operating system</li>
                  <li>Referral sources and search terms</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center mb-4">
              <Eye className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                How We Use Your Information
              </h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  Provide and improve our countertop fabrication and cabinetry
                  services
                </li>
                <li>Process quotes, orders, and schedule installations</li>
                <li>
                  Communicate with you about your projects and appointments
                </li>
                <li>
                  Send design inspiration and product updates (with your
                  consent)
                </li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Improve our website and service offerings</li>
                <li>
                  Comply with legal obligations and protect our business
                  interests
                </li>
              </ul>
            </div>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Information Sharing
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                We do not sell, trade, or rent your personal information to
                third parties. We may share your information only in the
                following circumstances:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong>Service Providers:</strong> With trusted contractors,
                  suppliers, and installation teams necessary to complete your
                  project
                </li>
                <li>
                  <strong>Business Partners:</strong> With manufacturers and
                  material suppliers for warranty and product support
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law,
                  court order, or government regulations
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  sale, merger, or acquisition of our business
                </li>
                <li>
                  <strong>Consent:</strong> When you have given us explicit
                  permission to share specific information
                </li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Data Security
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Secure data transmission using SSL encryption</li>
                <li>Regular security assessments and updates</li>
                <li>
                  Limited access to personal information on a need-to-know basis
                </li>
                <li>
                  Secure payment processing through PCI-compliant providers
                </li>
                <li>Regular backup and disaster recovery procedures</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Your Rights and Choices
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                You have the following rights regarding your personal
                information:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of the personal
                  information we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> Request correction of inaccurate
                  or incomplete information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your personal
                  information (subject to legal requirements)
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing
                  communications at any time
                </li>
                <li>
                  <strong>Data Portability:</strong> Request your data in a
                  structured, machine-readable format
                </li>
              </ul>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cookies and Tracking Technologies
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                We use cookies and similar technologies to enhance your website
                experience:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong>Essential Cookies:</strong> Necessary for website
                  functionality and security
                </li>
                <li>
                  <strong>Analytics Cookies:</strong> Help us understand how
                  visitors use our website
                </li>
                <li>
                  <strong>Marketing Cookies:</strong> Used to show relevant
                  advertisements and measure campaign effectiveness
                </li>
                <li>
                  <strong>Preference Cookies:</strong> Remember your settings
                  and preferences
                </li>
              </ul>
              <p className="mt-3">
                You can control cookie settings through your browser
                preferences.
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Third-Party Services
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                Our website may include links to third-party websites and
                services:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Google Analytics for website usage analysis</li>
                <li>Social media platforms for content sharing</li>
                <li>Payment processors for secure transactions</li>
                <li>Customer review platforms</li>
              </ul>
              <p className="mt-3">
                These third parties have their own privacy policies, and we are
                not responsible for their practices.
              </p>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our services are not directed to children under 18 years of age.
              We do not knowingly collect personal information from children
              under 18. If we become aware that a child has provided us with
              personal information, we will take steps to delete such
              information.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or for legal, regulatory, or operational
              reasons. We will notify you of any material changes by posting the
              updated policy on our website and updating the "Last updated"
              date. Your continued use of our services after any changes
              constitutes acceptance of the updated Privacy Policy.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700">info@luxcabistones.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700">571-335-0118</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700">
                  4005 Westfax Dr, Unit M, Chantilly, VA 20151, United States
                </span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white rounded border-l-4 border-blue-600">
              <p className="text-sm text-gray-600">
                <strong>Privacy Officer:</strong> For specific privacy concerns
                or data requests, please email us with "Privacy Request" in the
                subject line.
              </p>
            </div>
          </section>
        </div>

        {/* Social Share Section */}
        <div className="mt-8 text-center">
          <SocialShare
            variant="minimal"
            title="LUX Cabinets & Stones - Privacy Policy"
            description="Learn about our commitment to protecting your privacy and personal information."
            hashtags={['Privacy', 'LUXCabinets', 'DataProtection']}
          />
        </div>
      </div>

      {/* Floating Social Share Button */}
      <SocialShare
        variant="floating"
        title="LUX Cabinets & Stones - Privacy Policy"
        description="Transparent privacy practices for premium kitchen cabinets and stone surfaces."
        hashtags={['Privacy', 'LUXCabinets', 'Transparency']}
      />
    </div>
  );
};

export default PrivacyPolicy;
