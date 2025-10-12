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

// Custom Pinterest and TikTok icons since they're not in lucide-react
const PinterestIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.001 24c6.624 0 11.999-5.373 11.999-12C24 5.372 18.626.001 12.001.001z"/>
  </svg>
);

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

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
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
              backgroundSize: '30px 30px',
            }}
          ></div>
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
                width={350}
                height={105}
                className="h-24 w-auto object-contain bg-white p-3 rounded-lg shadow-lg"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              <Link
                href="/about"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                About Us
              </Link>
              <Link
                href="/products"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Products
              </Link>
              <Link
                href="/gallery"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Gallery
              </Link>
              <Link
                href="/blog"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
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
                        <a
                          href="mailto:info@luxcabistones.com"
                          className="hover:text-blue-400 transition-colors"
                        >
                          info@luxcabistones.com
                        </a>
                      </p>
                      <p className="text-gray-400">
                        <a
                          href="mailto:sales@luxcabistones.com"
                          className="hover:text-blue-400 transition-colors"
                        >
                          sales@luxcabistones.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social media links */}
              <div>
                <h4 className="text-white font-medium mb-4">CONNECT WITH US</h4>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=100077834019795"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600/20 hover:bg-blue-600 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110"
                    aria-label="Follow us on Facebook"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href="https://www.instagram.com/luxcabistones/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-pink-600/20 hover:bg-pink-600 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110"
                    aria-label="Follow us on Instagram"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href="https://www.youtube.com/@LUXCabinetsStones"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-red-600/20 hover:bg-red-600 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110"
                    aria-label="Subscribe to our YouTube channel"
                  >
                    <Youtube size={18} />
                  </a>
                  <a
                    href="https://www.pinterest.com/076iuae2zizrvl52yffotd3mrm5alu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-red-500/20 hover:bg-red-500 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110"
                    aria-label="Follow us on Pinterest"
                  >
                    <PinterestIcon size={18} />
                  </a>
                  <a
                    href="https://www.tiktok.com/@luxcabinetstones"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800/20 hover:bg-gray-800 flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110"
                    aria-label="Follow us on TikTok"
                  >
                    <TikTokIcon size={18} />
                  </a>
                </div>
                <p className="text-gray-400 text-sm mt-3">
                  Follow us for design inspiration, project updates, and expert tips!
                </p>
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
                    <Link
                      href="/products/cabinets"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      Custom Cabinets
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link
                      href="/products/stones"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      Countertop Fabrication
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link
                      href="/products"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      Quartz & Granite
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link
                      href="/services"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      Kitchen Remodeling
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link
                      href="/services"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      Bathroom Vanities
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link
                      href="/contact"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
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
                    <Link
                      href="/products/stones"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      Natural Stone
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link
                      href="/products/stones"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      Engineered Quartz
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link
                      href="/products/cabinets"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      Kitchen Cabinets
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link
                      href="/products/cabinets"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      Bathroom Cabinets
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link
                      href="/products/closets"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      Custom Closets
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link
                      href="/products"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
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
                    <Link
                      href="/contact"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link
                      href="/about"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <ChevronRight size={16} className="text-blue-400 mr-2" />
                    <Link
                      href="/design"
                      className="text-gray-300 hover:text-blue-400 transition-colors"
                    >
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
                    <Award
                      size={16}
                      className="text-yellow-400 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-200">
                      Licensed Contractor
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-black/20 rounded-lg">
                    <Shield
                      size={16}
                      className="text-green-400 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-200">
                      Insured & Bonded
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-black/20 rounded-lg">
                    <Award size={16} className="text-blue-400 flex-shrink-0" />
                    <span className="text-sm text-gray-200">BBB A+ Rating</span>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-black/20 rounded-lg">
                    <Shield
                      size={16}
                      className="text-purple-400 flex-shrink-0"
                    />
                    <span className="text-sm text-gray-200">
                      15-Year Warranty
                    </span>
                  </div>
                </div>
              </div>

              {/* Newsletter subscription */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-5 rounded-xl border border-gray-600/30 shadow-lg">
                <h4 className="font-bold text-white mb-4">NEWSLETTER</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Subscribe to our newsletter for design tips, special offers,
                  and updates.
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
