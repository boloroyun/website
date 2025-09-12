import React from 'react';
import Image from 'next/image';
import {
  Facebook,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  Shield,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import NewsletterSubscribe from './NewsletterSubscribe';

/**
 * Footer Component
 *
 * Professional footer for LUX Cabinets & Stones company.
 * Features company information, services, contact details, showroom hours,
 * and customer resources for countertop fabrication and custom cabinetry.
 *
 * Includes trust badges, licensing information, and newsletter subscription
 * to build credibility and maintain customer engagement.
 *
 * @returns JSX.Element
 */
const Footer = () => {
  return (
    <footer className="relative">
      {/* Top wave separator */}
      <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-full transform rotate-180"
          style={{ fill: '#111827' }}
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
        </svg>
      </div>

      {/* Main footer content */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-24 pb-16 px-4 md:px-6 lg:px-8 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
            backgroundSize: '30px 30px' 
          }}></div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-40 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        {/* Main container: Handles the grid layout for the footer's content */}
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Footer top section with logo and quick links */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 pb-10 border-b border-gray-700/50">
            <div className="mb-8 md:mb-0">
              <Image
                src="/images/logo.jpeg"
                alt="LUX Cabinets & Stones"
                width={200}
                height={60}
                className="h-16 w-auto object-contain bg-white p-2 rounded-lg shadow-lg"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors font-medium">
                About Us
              </Link>
              <Link href="/products" className="text-gray-300 hover:text-white transition-colors font-medium">
                Products
              </Link>
              <Link href="/gallery" className="text-gray-300 hover:text-white transition-colors font-medium">
                Gallery
              </Link>
              <Link href="/blog" className="text-gray-300 hover:text-white transition-colors font-medium">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors font-medium">
                Contact
              </Link>
            </div>
          </div>
          
          {/* Main footer grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            {/* Column 1: Company Information & Contact */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                  CONTACT US
                  <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-500"></span>
                </h3>

                <p className="text-gray-300 leading-relaxed mb-6">
                  Premium countertop fabrication and custom cabinetry solutions.
                  Transform your space with expert craftsmanship.
                </p>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      <MapPin size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Our Showroom</p>
                      <p className="text-gray-400">
                        4005 Westfax Dr, Unit M
                        <br />
                        Chantilly, VA 20151
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      <Phone size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Phone</p>
                      <p className="text-gray-400">
                        Main:{' '}
                        <a
                          href="tel:+15713350118"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          (571) 335-0118
                        </a>
                      </p>
                      <p className="text-gray-400">
                        Emergency:{' '}
                        <a
                          href="tel:+15715858345"
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          (571) 585-8345
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      <Mail size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Email</p>
                      <p className="text-gray-400">
                        <a href="mailto:info@luxcabistones.com" className="hover:text-blue-400 transition-colors">
                          info@luxcabistones.com
                        </a>
                      </p>
                      <p className="text-gray-400">
                        <a href="mailto:sales@luxcabistones.com" className="hover:text-blue-400 transition-colors">
                          sales@luxcabistones.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social media links */}
              <div>
                <h4 className="text-white font-medium mb-4">
                  CONNECT WITH US
                </h4>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-blue-600/20 hover:bg-blue-600 flex items-center justify-center rounded-lg transition-colors">
                    <Facebook size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-pink-600/20 hover:bg-pink-600 flex items-center justify-center rounded-lg transition-colors">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-red-600/20 hover:bg-red-600 flex items-center justify-center rounded-lg transition-colors">
                    <Youtube size={18} />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Services & Showroom Hours */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                  SERVICES
                  <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-500"></span>
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/products/cabinets" className="text-gray-300 hover:text-blue-400 transition-colors">
                      Custom Cabinets
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/products/stones" className="text-gray-300 hover:text-blue-400 transition-colors">
                      Countertop Fabrication
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/products" className="text-gray-300 hover:text-blue-400 transition-colors">
                      Quartz & Granite
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/services" className="text-gray-300 hover:text-blue-400 transition-colors">
                      Kitchen Remodeling
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/services" className="text-gray-300 hover:text-blue-400 transition-colors">
                      Bathroom Vanities
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                      Free Consultation
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Showroom Hours */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-5 rounded-xl border border-gray-600/30 shadow-lg">
                <div className="flex items-center space-x-2 mb-4">
                  <Clock size={18} className="text-blue-400" />
                  <h4 className="font-bold text-white">SHOWROOM HOURS</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Mon - Fri</span>
                    <span className="font-medium text-white bg-blue-500/20 px-3 py-1 rounded-full text-sm">
                      9:00 AM - 5:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Saturday</span>
                    <span className="font-medium text-white bg-blue-500/20 px-3 py-1 rounded-full text-sm">
                      10:00 AM - 3:00 PM
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Sunday</span>
                    <span className="font-medium text-white bg-blue-500/20 px-3 py-1 rounded-full text-sm">
                      By Appointment
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Products & Support */}
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                  PRODUCTS
                  <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-500"></span>
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/products/stones" className="text-gray-300 hover:text-blue-400 transition-colors">
                      Natural Stone
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/products/stones" className="text-gray-300 hover:text-blue-400 transition-colors">
                      Engineered Quartz
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/products/cabinets" className="text-gray-300 hover:text-blue-400 transition-colors">
                      Kitchen Cabinets
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/products/cabinets" className="text-gray-300 hover:text-blue-400 transition-colors">
                      Bathroom Cabinets
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/products/closets" className="text-gray-300 hover:text-blue-400 transition-colors">
                      Custom Closets
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/products" className="text-gray-300 hover:text-blue-400 transition-colors">
                      Hardware & Accessories
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-6 text-white relative inline-block">
                  SUPPORT
                  <span className="absolute -bottom-2 left-0 w-12 h-1 bg-blue-500"></span>
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                      Contact Us
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link href="/design" className="text-gray-300 hover:text-blue-400 transition-colors">
                      Free Design Consultation
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 4: Trust Badges & Newsletter */}
            <div className="space-y-8">
              {/* Trust badges and certifications */}
              <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 p-5 rounded-xl border border-blue-500/20 shadow-lg">
                <h4 className="font-bold text-white mb-4 flex items-center">
                  <Shield size={18} className="text-blue-400 mr-2" />
                  TRUSTED & LICENSED
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2 p-3 bg-black/20 rounded-lg">
                    <Award size={16} className="text-yellow-400 flex-shrink-0" />
                    <span className="text-sm text-gray-200">Licensed Contractor</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-black/20 rounded-lg">
                    <Shield size={16} className="text-green-400 flex-shrink-0" />
                    <span className="text-sm text-gray-200">Insured & Bonded</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-black/20 rounded-lg">
                    <Award size={16} className="text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-gray-200">BBB A+ Rating</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-black/20 rounded-lg">
                    <Shield size={16} className="text-purple-400 flex-shrink-0" />
                    <span className="text-sm text-gray-200">15-Year Warranty</span>
                  </div>
                </div>
              </div>

              {/* Newsletter subscription */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-5 rounded-xl border border-gray-600/30 shadow-lg">
                <h4 className="font-bold text-white mb-4">NEWSLETTER</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Subscribe to our newsletter for design tips, special offers, and updates.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    Subscribe
                    <ArrowRight size={16} className="ml-2" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom section: Legal information and business details */}
        <div className="mt-16 pt-8 border-t border-gray-700/50 relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-6 md:space-y-0">
            <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 text-gray-400">
              <p>
                © {new Date().getFullYear()} LUX Cabinets & Stones. All rights
                reserved.
              </p>
              <p>VA License #</p>
              <p>EPA Lead-Safe Certified</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-gray-400">
              <Link
                href="/privacy"
                className="hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/sitemap"
                className="hover:text-blue-400 transition-colors"
              >
                Sitemap
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 text-xs text-gray-500">
              <span>Serving Virginia, Maryland & Washington DC</span>
              <span className="hidden md:inline">•</span>
              <span>Free In-Home Consultation</span>
              <span className="hidden md:inline">•</span>
              <span>Licensed, Bonded & Insured</span>
              <span className="hidden md:inline">•</span>
              <span>15-Year Warranty</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;