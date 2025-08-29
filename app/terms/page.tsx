import React from 'react';
import {
  FileText,
  Gavel,
  AlertTriangle,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import SocialShare from '@/components/SocialShare';

// Force dynamic rendering to prevent build-time analysis issues
export const dynamic = 'force-dynamic';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              Terms of Service
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            These terms govern your use of LUX Cabinets & Stones services and
            website. Please read them carefully.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: December 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          {/* Acceptance of Terms */}
          <section>
            <div className="flex items-center mb-4">
              <Gavel className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Acceptance of Terms
              </h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                By accessing and using the services of LUX Cabinets & Stones
                ("we," "us," or "our"), including our website, requesting
                quotes, or engaging our services, you agree to be bound by these
                Terms of Service ("Terms"). If you do not agree to these Terms,
                please do not use our services.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you
                and LUX Cabinets & Stones, a countertop fabrication and custom
                cabinetry company located in Chantilly, Virginia.
              </p>
            </div>
          </section>

          {/* Services Description */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Services
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>LUX Cabinets & Stones provides the following services:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Online product sales and e-commerce services</li>
                <li>Custom countertop fabrication and installation</li>
                <li>Kitchen and bathroom cabinet design and installation</li>
                <li>Natural stone and engineered quartz supply</li>
                <li>Online project quotes and design consultation services</li>
                <li>Home remodeling consultation and design services</li>
                <li>Hardware and accessories supply</li>
                <li>Professional installation services</li>
                <li>Maintenance and repair services</li>
              </ul>
              <p className="mt-3">
                We serve customers in Virginia, Maryland, and Washington DC
                areas through our online platform and physical showroom. All
                services are subject to availability and our professional
                assessment of project feasibility.
              </p>
            </div>
          </section>

          {/* Online Orders */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Online Orders and E-commerce
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Product Orders
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    Products are available for online purchase through our
                    website
                  </li>
                  <li>
                    All orders are subject to product availability and
                    verification
                  </li>
                  <li>
                    We reserve the right to cancel orders due to pricing errors
                    or inventory issues
                  </li>
                  <li>
                    Shipping costs and delivery timeframes are provided at
                    checkout
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Payment Processing
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    We accept major credit cards, Razorpay, Stripe, and Cash on
                    Delivery (COD)
                  </li>
                  <li>
                    Payment is processed securely through third-party providers
                  </li>
                  <li>
                    COD orders require verification and may have additional fees
                  </li>
                  <li>
                    All prices are in USD and include applicable taxes where
                    required
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Project Agreements */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Project Agreements and Quotes
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Quote Process
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    Online quotes are provided free of charge through our
                    website and are valid for 30 days unless otherwise specified
                  </li>
                  <li>
                    Quotes are based on the information provided by the customer
                    and initial measurements or specifications
                  </li>
                  <li>
                    Final pricing may vary based on actual site conditions and
                    final measurements for installation projects
                  </li>
                  <li>
                    We reserve the right to adjust pricing for changes in
                    material costs or project scope
                  </li>
                  <li>
                    Online quotes may require follow-up consultation for complex
                    projects
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Contract Terms
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    All projects require a signed contract before work begins
                  </li>
                  <li>
                    A deposit of 50% is typically required upon contract signing
                  </li>
                  <li>
                    Final payment is due upon completion and customer approval
                  </li>
                  <li>
                    Project timelines are estimates and may vary due to material
                    availability or unforeseen circumstances
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Payment Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Payment Terms
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Payment Schedule
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Deposit: 50% upon contract signing</li>
                  <li>
                    Progress payment: 40% when materials are delivered or work
                    begins
                  </li>
                  <li>
                    Final payment: 10% upon project completion and customer
                    approval
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Accepted Payment Methods
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Cash, check, or bank transfer</li>
                  <li>Credit cards (processing fees may apply)</li>
                  <li>Financing options (subject to credit approval)</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Late Payments
                </h3>
                <p>
                  Overdue payments may incur a service charge of 1.5% per month.
                  Work may be suspended for accounts more than 30 days past due.
                </p>
              </div>
            </div>
          </section>

          {/* Warranties and Guarantees */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Warranties and Guarantees
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Workmanship Warranty
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    We provide a 15-year warranty on workmanship for countertop
                    installations
                  </li>
                  <li>
                    Cabinet installation carries a 10-year workmanship warranty
                  </li>
                  <li>
                    Warranty covers defects in installation and craftsmanship
                  </li>
                  <li>
                    Normal wear and tear, misuse, or damage is not covered
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Material Warranties
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Material warranties are provided by manufacturers</li>
                  <li>
                    We will assist in warranty claims but are not responsible
                    for manufacturer defects
                  </li>
                  <li>
                    Natural stone variations in color and pattern are not
                    considered defects
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Customer Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Customer Responsibilities
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>Customers are responsible for:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Providing accurate project information and measurements</li>
                <li>Ensuring site access for our team and equipment</li>
                <li>Obtaining necessary permits (unless otherwise agreed)</li>
                <li>Protecting personal property during installation</li>
                <li>Final inspection and approval of completed work</li>
                <li>Proper care and maintenance of installed products</li>
                <li>Timely payment according to agreed schedule</li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <div className="flex items-start mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-600 mr-3 mt-1" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Limitation of Liability
              </h2>
            </div>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                Our liability is limited to the cost of the services provided.
                We are not liable for:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of use, revenue, or profits</li>
                <li>Damage to property not directly related to our work</li>
                <li>Delays due to circumstances beyond our control</li>
                <li>Issues arising from customer-supplied materials</li>
                <li>Problems with pre-existing conditions not disclosed</li>
              </ul>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-amber-800">
                  <strong>Important:</strong> We carry comprehensive insurance
                  but recommend customers verify their homeowner's insurance
                  coverage during renovation projects.
                </p>
              </div>
            </div>
          </section>

          {/* Cancellation and Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cancellation and Changes
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Project Cancellation
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>
                    Customers may cancel within 3 business days of contract
                    signing for a full refund
                  </li>
                  <li>
                    Cancellations after material ordering may incur material and
                    restocking fees
                  </li>
                  <li>
                    Cancellations after fabrication begins are subject to
                    charges for work completed
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Project Changes
                </h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Changes to project scope must be approved in writing</li>
                  <li>
                    Additional charges may apply for changes after fabrication
                    begins
                  </li>
                  <li>
                    Timeline extensions may be necessary for significant changes
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Website Use */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Website Use
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>When using our website, you agree to:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>Not use the site for any unlawful purposes</li>
                <li>Respect intellectual property rights</li>
                <li>Not attempt to disrupt or compromise site security</li>
                <li>Not use automated systems to access the site</li>
              </ul>
              <p className="mt-3">
                We reserve the right to terminate access for violations of these
                terms.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Intellectual Property
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                All content on our website, including designs, logos, text, and
                images, is owned by LUX Cabinets & Stones or used with
                permission. You may not reproduce, distribute, or create
                derivative works without written permission.
              </p>
              <p>
                Custom designs created for customers remain our intellectual
                property unless otherwise agreed in writing. However, customers
                have the right to use designs for their intended purpose.
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Dispute Resolution
            </h2>
            <div className="text-gray-600 leading-relaxed space-y-3">
              <p>
                We are committed to resolving any disputes amicably. In case of
                disagreements:
              </p>
              <ol className="list-decimal list-inside ml-4 space-y-2">
                <li>Contact us directly to discuss the issue</li>
                <li>We will work in good faith to reach a resolution</li>
                <li>
                  If necessary, disputes will be resolved through binding
                  arbitration in Virginia
                </li>
                <li>Virginia state law governs these terms</li>
              </ol>
            </div>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Changes to Terms
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We may update these Terms of Service from time to time. Changes
              will be posted on our website with an updated effective date.
              Continued use of our services after changes constitutes acceptance
              of the new terms. For significant changes, we will provide notice
              to existing customers.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              For questions about these Terms of Service or to discuss your
              project needs, please contact us:
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
                <strong>Business License:</strong> VA License #2705123456 | EPA
                Lead-Safe Certified
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <strong>Service Areas:</strong> Virginia, Maryland, and
                Washington DC
              </p>
            </div>
          </section>
        </div>

        {/* Social Share Section */}
        <div className="mt-8 text-center">
          <SocialShare
            variant="minimal"
            title="LUX Cabinets & Stones - Terms of Service"
            description="Professional terms of service for premium kitchen cabinets and stone surfaces."
            hashtags={['Terms', 'LUXCabinets', 'Professional']}
          />
        </div>
      </div>

      {/* Floating Social Share Button */}
      <SocialShare
        variant="floating"
        title="LUX Cabinets & Stones - Terms of Service"
        description="Comprehensive terms of service for countertop fabrication and custom cabinetry."
        hashtags={['Terms', 'LUXCabinets', 'Service']}
      />
    </div>
  );
};

export default TermsOfService;
