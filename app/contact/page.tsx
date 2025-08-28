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

export const metadata: Metadata = {
  title: `Contact Us | ${process.env.NEXT_PUBLIC_SITE_NAME || 'LUX Cabinets & Stones'}`,
  description:
    'Get in touch with LUX Cabinets & Stones for your custom cabinet and stone needs. Contact us for free consultations, quotes, and expert advice.',
  keywords:
    'contact, custom cabinets, stone countertops, consultation, quote, cabinet installation',
};

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  projectType: string;
  budget: string;
}

async function submitContactForm(formData: FormData) {
  'use server';

  const data: ContactFormData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    subject: formData.get('subject') as string,
    message: formData.get('message') as string,
    projectType: formData.get('projectType') as string,
    budget: formData.get('budget') as string,
  };

  try {
    // Here you can add your contact form submission logic
    // For now, we'll just log the data (in production, send to email service)
    console.log('Contact form submission:', data);

    // You could integrate with services like:
    // - SendGrid
    // - Nodemailer
    // - Resend
    // - Or save to database

    // Success - form submission completed
    console.log('Contact form submitted successfully');
  } catch (error) {
    console.error('Contact form error:', error);
    // Error handling could be improved with proper error reporting
  }
}

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
            <div id="contact-form">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Send Us a Message
                </h2>

                <form action={submitContactForm} className="space-y-6">
                  {/* Name and Email Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone and Subject Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="What can we help you with?"
                      />
                    </div>
                  </div>

                  {/* Project Type and Budget Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="projectType"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Project Type
                      </label>
                      <select
                        id="projectType"
                        name="projectType"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select project type</option>
                        <option value="kitchen-cabinets">
                          Kitchen Cabinets
                        </option>
                        <option value="bathroom-cabinets">
                          Bathroom Cabinets
                        </option>
                        <option value="countertops">Countertops</option>
                        <option value="full-remodel">Full Remodel</option>
                        <option value="custom-millwork">Custom Millwork</option>
                        <option value="consultation">Consultation Only</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="budget"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select budget range</option>
                        <option value="under-10k">Under $10,000</option>
                        <option value="10k-25k">$10,000 - $25,000</option>
                        <option value="25k-50k">$25,000 - $50,000</option>
                        <option value="50k-100k">$50,000 - $100,000</option>
                        <option value="over-100k">Over $100,000</option>
                        <option value="not-sure">Not sure yet</option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tell us about your project, timeline, and any specific requirements..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Send Message
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    We typically respond within 24 hours. For urgent inquiries,
                    please call us directly.
                  </p>
                </form>
              </div>
            </div>
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
