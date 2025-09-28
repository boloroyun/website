import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Award,
  Clock,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  Wrench,
  Palette,
  Calculator,
  UserCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | LUX Cabinets & Stones',
  description:
    'Meet our experienced team of professionals specializing in custom cabinets, countertops, and modern closets. 10+ years of expertise in fabrication and installation.',
  keywords:
    'about us, team, cabinet installation, countertop fabrication, custom cabinets, Chantilly VA',
  openGraph: {
    title: 'About LUX Cabinets & Stones - Expert Team & Services',
    description:
      'Meet our experienced team of professionals specializing in custom cabinets, countertops, and modern closets.',
    type: 'website',
  },
};

// Team member interface
interface TeamMember {
  name: string;
  role: string;
  experience: string;
  description: string;
  icon: React.ComponentType<any>;
  specialties: string[];
}

// Team members data
const teamMembers: TeamMember[] = [
  {
    name: 'Ulaanaa',
    role: 'Master Fabricator & Installer',
    experience: '10+ Years Experience',
    description:
      'Expert in countertop installation and fabrication with over a decade of hands-on experience creating beautiful, durable surfaces.',
    icon: Wrench,
    specialties: [
      'Countertop Installation',
      'Stone Fabrication',
      'Precision Cutting',
      'Quality Control',
    ],
  },
  {
    name: 'Shirnen',
    role: 'Senior Fabricator & Installer',
    experience: '10+ Years Experience',
    description:
      'Skilled craftsman specializing in countertop installation and fabrication, bringing precision and artistry to every project.',
    icon: Award,
    specialties: [
      'Custom Fabrication',
      'Installation Expertise',
      'Material Handling',
      'Project Management',
    ],
  },
  {
    name: 'Bayar',
    role: 'Sales Manager & Designer',
    experience: 'Design & Sales Expert',
    description:
      'Experienced sales manager with a keen eye for design, helping customers bring their vision to life with expert guidance and creative solutions.',
    icon: Palette,
    specialties: [
      'Interior Design',
      'Customer Relations',
      'Project Planning',
      'Material Selection',
    ],
  },
  {
    name: 'Bolor',
    role: 'Designer, Sales Manager & Account Manager',
    experience: 'Multi-Role Expert',
    description:
      'Versatile professional combining design expertise, sales management, and account coordination to deliver comprehensive customer service from initial consultation through project completion.',
    icon: UserCheck,
    specialties: [
      'Interior Design',
      'Sales Management',
      'Account Management',
      'Customer Relations',
      'Project Coordination',
      'Design Consultation',
    ],
  },
];

// Services data
const services = [
  {
    title: 'Stock Cabinets',
    description:
      'Ready-to-install cabinets available in various styles and finishes for quick delivery and installation.',
    features: [
      'Quick Delivery',
      'Standard Sizes',
      'Popular Styles',
      'Budget-Friendly',
    ],
    icon: CheckCircle,
  },
  {
    title: 'Semi-Stock Cabinets',
    description:
      'Customizable cabinet options with modified dimensions and finishes to fit your specific needs.',
    features: [
      'Modified Dimensions',
      'Custom Finishes',
      'Flexible Options',
      'Moderate Timeline',
    ],
    icon: Calculator,
  },
  {
    title: 'Custom Cabinets',
    description:
      'Fully customized cabinets designed and built to your exact specifications and unique requirements.',
    features: [
      'Unique Designs',
      'Premium Materials',
      'Perfect Fit',
      'Unlimited Options',
    ],
    icon: Star,
  },
  {
    title: 'Countertops',
    description:
      'Professional fabrication and installation of granite, quartz, marble, and other premium stone surfaces.',
    features: [
      'Premium Materials',
      'Expert Fabrication',
      'Precise Installation',
      'Lifetime Beauty',
    ],
    icon: Award,
  },
  {
    title: 'Modern Closets',
    description:
      'Contemporary closet systems designed for maximum storage efficiency and modern aesthetics.',
    features: [
      'Space Optimization',
      'Modern Design',
      'Custom Organization',
      'Quality Hardware',
    ],
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About LUX Cabinets & Stones
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Transforming homes with premium cabinets, countertops, and modern
              closets
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm md:text-base">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>10+ Years Experience</span>
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2" />
                <span>Expert Craftsmanship</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>Professional Team</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Story Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Story
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Crafting Excellence Since Day One
                </h3>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  At LUX Cabinets & Stones, we believe that every home deserves
                  the finest craftsmanship. Our journey began with a simple
                  mission: to transform ordinary spaces into extraordinary
                  living environments through premium cabinets, stunning
                  countertops, and modern closet solutions.
                </p>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  With over a decade of combined experience in fabrication and
                  installation, our team brings unmatched expertise to every
                  project. We specialize in stock, semi-stock, and fully custom
                  solutions to meet every budget and design preference.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">10+</div>
                    <div className="text-sm text-gray-600">
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">500+</div>
                    <div className="text-sm text-gray-600">
                      Projects Completed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <div className="text-sm text-gray-600">
                      Customer Satisfaction
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Why Choose LUX?
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">
                        Expert craftsmanship with 10+ years experience
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">
                        Stock, semi-stock, and custom solutions
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">
                        Premium materials and modern designs
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">
                        Professional installation and service
                      </span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      <span className="text-gray-700">
                        Competitive pricing and quality guarantee
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our Expert Team
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our experienced professionals bring decades of combined
                expertise in fabrication, installation, design, and customer
                service to every project.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <member.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-semibold">
                        {member.role}
                      </p>
                      <p className="text-sm text-gray-500">
                        {member.experience}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {member.description}
                  </p>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Specialties:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {member.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Services
              </h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From stock solutions to fully custom designs, we offer
                comprehensive services to transform your space with premium
                materials and expert craftsmanship.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                      <service.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {service.title}
                    </h3>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-sm text-gray-600"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Space?
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 mb-8">
              Contact our expert team today for a free consultation and discover
              how we can bring your vision to life with premium cabinets,
              countertops, and closets.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Phone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
                <a
                  href="tel:571-335-0118"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  (571) 335-0118
                </a>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                <a
                  href="mailto:info@luxcabistones.com"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  info@luxcabistones.com
                </a>
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <MapPin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600 text-center">
                  4005 Westfax Dr, Unit M<br />
                  Chantilly, VA 20151
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Get Free Consultation
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200"
              >
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
