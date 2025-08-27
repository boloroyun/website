import React from 'react';
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
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4 md:px-6 lg:px-8 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
      </div>
      {/* Main container: Handles the grid layout for the footer's content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative z-10">
        {/* Column 1: Company Information & Contact */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                LUX
              </h2>
              <div className="text-sm">
                <div className="font-semibold">CABINETS</div>
                <div className="text-gray-300">& STONES</div>
              </div>
            </div>

            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Premium countertop fabrication and custom cabinetry solutions.
              Transform your space with expert craftsmanship.
            </p>

            {/* Contact Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-blue-400 flex-shrink-0" />
                <p className="text-sm">
                  4005 Westfax Dr, Unit M
                  <br />
                  Chantilly, VA 20151
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-blue-400 flex-shrink-0" />
                  <p className="text-sm">
                    Main:{' '}
                    <a
                      href="tel:+15713350118"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      (571) 335-0118
                    </a>
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-red-400 flex-shrink-0" />
                  <p className="text-sm">
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
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-400 flex-shrink-0" />
                <p className="text-sm">info@luxcabistones.com</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-blue-400 flex-shrink-0" />
                <p className="text-sm">sales@luxcabistones.com</p>
              </div>
            </div>
          </div>

          {/* Social media links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">
              FOLLOW US
            </h4>
            <div className="flex space-x-3">
              <div className="p-3 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors cursor-pointer">
                <Facebook size={16} />
              </div>
              <div className="p-3 bg-gray-800 rounded-full hover:bg-pink-600 transition-colors cursor-pointer">
                <Instagram size={16} />
              </div>
              <div className="p-3 bg-gray-800 rounded-full hover:bg-red-600 transition-colors cursor-pointer">
                <Youtube size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Services & Showroom Hours */}
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-5 text-blue-400">
              SERVICES
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                <Link href="/products/cabinets">Custom Cabinets</Link>
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                <Link href="/products/stones">Countertop Fabrication</Link>
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                <Link href="/products">Quartz & Granite</Link>
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                Kitchen Remodeling
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                Bathroom Vanities
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                Free Consultation
              </li>
            </ul>
          </div>

          {/* Showroom Hours */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-4 rounded-xl border border-gray-600 shadow-lg">
            <div className="flex items-center space-x-2 mb-3">
              <Clock size={16} className="text-blue-400" />
              <h4 className="font-semibold text-sm">SHOWROOM HOURS</h4>
            </div>
            <div className="text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Mon - Fri:</span>
                <span className="font-medium text-white">
                  8:00 AM - 5:00 PM
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Saturday:</span>
                <span className="font-medium text-white">
                  9:00 AM - 3:00 PM
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Sunday:</span>
                <span className="font-medium text-blue-400">
                  By Appointment
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 3: Products & Support */}
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-5 text-blue-400">
              PRODUCTS
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                <Link href="/products/stones">Natural Stone</Link>
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                <Link href="/products/stones">Engineered Quartz</Link>
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                <Link href="/products/cabinets">Kitchen Cabinets</Link>
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                <Link href="/products/cabinets">Bathroom Cabinets</Link>
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                <Link href="/products">Hardware & Accessories</Link>
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                <Link href="/bestsellers">Featured Products</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5 text-blue-400">
              SUPPORT
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                <Link href="/contact">Contact Us</Link>
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                <Link href="/about">About Us</Link>
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                Free Design Consultation
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                <Link href="/track-order">Track Your Order</Link>
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                Installation Services
              </li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">
                <Link href="/profile">My Account</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Column 4: Trust Badges & Newsletter */}
        <div className="space-y-8">
          {/* Trust badges and certifications */}
          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 p-4 rounded-xl border border-green-400/20 shadow-lg">
            <h4 className="font-semibold text-sm mb-4 flex items-center">
              <Shield size={16} className="text-green-400 mr-2" />
              TRUSTED & LICENSED
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-lg">
                <Award size={14} className="text-yellow-400 flex-shrink-0" />
                <span>Licensed Contractor</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-lg">
                <Shield size={14} className="text-green-400 flex-shrink-0" />
                <span>Insured & Bonded</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-lg">
                <Award size={14} className="text-blue-400 flex-shrink-0" />
                <span>BBB A+ Rating</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-lg">
                <Shield size={14} className="text-purple-400 flex-shrink-0" />
                <span>15-Year Warranty</span>
              </div>
            </div>
          </div>

          {/* Newsletter subscription */}
          <NewsletterSubscribe />

          {/* Additional Support Links */}
        </div>
      </div>

      {/* Footer bottom section: Legal information and business details */}
      <div className="mt-16 pt-8 border-t border-gray-600 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 text-gray-400">
            <p>
              © {new Date().getFullYear()} LUX Cabinets & Stones. All rights
              reserved.
            </p>
            <p>VA License #</p>
            <p>EPA Lead-Safe Certified</p>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0 text-gray-400">
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

        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-8 text-xs text-gray-500">
            <span>Serving Virginia, Maryland & Washington DC</span>
            <span>•</span>
            <span>Free In-Home Consultation</span>
            <span>•</span>
            <span>Licensed, Bonded & Insured</span>
            <span>•</span>
            <span>10-Year Warranty</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
