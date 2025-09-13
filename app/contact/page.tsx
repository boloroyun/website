import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: `Contact Us | ${process.env.NEXT_PUBLIC_SITE_NAME || 'LUX Cabinets & Stones'}`,
  description:
    'Get in touch with LUX Cabinets & Stones for your custom cabinet and stone needs. Contact us for free consultations, quotes, and expert advice.',
  keywords:
    'contact, custom cabinets, stone countertops, consultation, quote, cabinet installation',
};


export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Ready to transform your space? Contact our expert team for a free
              consultation and personalized quote.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="tel:+15713350118"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Link>
              <Link
                href="#contact-form"
                className="inline-flex items-center px-6 py-3 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 rounded-lg font-semibold transition-colors"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Send Message
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Contact Information
              </h2>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">
                      Main:{' '}
                      <a
                        href="tel:+15713350118"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        (571) 335-0118
                      </a>
                    </p>
                    <p className="text-gray-600">
                      Emergency:{' '}
                      <a
                        href="tel:+15715858345"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        (571) 585-8345
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">
                      <a
                        href="mailto:info@luxcabistones.com"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        info@luxcabistones.com
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <a
                        href="mailto:sales@luxcabistones.com"
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        sales@luxcabistones.com
                      </a>
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Showroom & Office
                    </h3>
                    <p className="text-gray-600">
                      4005 Westfax Dr, Unit M
                      <br />
                      Chantilly, VA 20151
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Business Hours
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Monday - Friday:</span>{' '}
                        8:00 AM - 6:00 PM
                      </p>
                      <p>
                        <span className="font-medium">Saturday:</span> 9:00 AM -
                        4:00 PM
                      </p>
                      <p>
                        <span className="font-medium">Sunday:</span> By
                        Appointment
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Service Areas
                </h3>
                <p className="text-gray-600 mb-4">
                  We proudly serve the following areas:
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>• Downtown District</div>
                  <div>• North Valley</div>
                  <div>• East Hills</div>
                  <div>• West Shore</div>
                  <div>• Suburban Areas</div>
                  <div>• Metro Region</div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Don't see your area? Contact us anyway - we may still be able
                  to help!
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Why Choose LUX Cabinets & Stones?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Free Consultation
                </h3>
                <p className="text-gray-600 text-sm">
                  Schedule a complimentary design consultation with our experts.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Expert Support
                </h3>
                <p className="text-gray-600 text-sm">
                  Our experienced team is here to guide you through every step.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Local Service
                </h3>
                <p className="text-gray-600 text-sm">
                  Proud to serve our local community with quality craftsmanship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
