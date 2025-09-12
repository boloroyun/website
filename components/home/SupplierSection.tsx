'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ExternalLink, Truck, Star } from 'lucide-react';
import {
  Supplier,
  findNearestSuppliers,
  getAllSuppliers,
} from '@/lib/suppliers-data';

const SupplierSection = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get the user's location
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLocationError(null);
          },
          (error) => {
            console.error('Error getting location:', error);
            setLocationError(
              'Unable to get your location. Showing all suppliers.'
            );
            // If we can't get location, just show all suppliers
            setSuppliers(getAllSuppliers());
          }
        );
      } else {
        setLocationError(
          'Geolocation is not supported by your browser. Showing all suppliers.'
        );
        // If geolocation is not supported, show all suppliers
        setSuppliers(getAllSuppliers());
      }
    };

    getUserLocation();
  }, []);

  // When user location changes, find nearest suppliers
  useEffect(() => {
    if (userLocation) {
      const nearest = findNearestSuppliers(
        userLocation.lat,
        userLocation.lng,
        6
      );
      setSuppliers(nearest);
    }
    setLoading(false);
  }, [userLocation]);

  // Fallback for supplier logos
  const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/placeholder-logo.svg';
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Finding Suppliers Near You</h2>
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-5">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)',
          backgroundSize: '30px 30px' 
        }}></div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
            TRUSTED PARTNERS
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">OUR PREMIUM SUPPLIERS</h2>
          <div className="w-24 h-1 bg-indigo-600 mx-auto"></div>
          
          {locationError ? (
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              {locationError}
            </p>
          ) : userLocation ? (
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We've partnered with the best suppliers in the industry to bring you premium materials and products.
              <span className="block mt-2 text-indigo-600 font-medium">
                Showing suppliers nearest to your location
              </span>
            </p>
          ) : null}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {suppliers.map((supplier, index) => (
            <div
              key={supplier.id}
              className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Colored Top Bar */}
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
              
              <div className="p-8">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-20 relative flex items-center justify-center bg-white rounded-lg p-2">
                    <Image
                      src={supplier.logoUrl}
                      alt={`${supplier.name} logo`}
                      width={120}
                      height={60}
                      className="object-contain"
                      onError={handleLogoError}
                    />
                  </div>
                </div>
                
                {/* Supplier Info */}
                <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                  {supplier.name}
                </h3>
                
                <div className="flex items-center justify-center text-gray-600 mb-4">
                  <MapPin size={16} className="mr-1 text-indigo-500" />
                  <span className="text-sm">
                    {supplier.location.city}, {supplier.location.state}
                  </span>
                </div>
                
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"} 
                    />
                  ))}
                </div>
                
                <p className="text-sm text-gray-600 text-center mb-6 line-clamp-2">
                  {supplier.description}
                </p>
                
                {/* Features */}
                <div className="flex justify-center space-x-4 mb-6">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                      <Truck size={14} className="text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-600">Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mb-1">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-600">Quality Products</span>
                  </div>
                </div>
                
                {/* CTA */}
                <div className="border-t border-gray-100 pt-4 flex justify-center">
                  <Link
                    href={supplier.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                  >
                    Visit Website <ExternalLink size={14} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link
            href="/suppliers"
            className="inline-flex items-center px-6 py-3 border border-indigo-600 text-indigo-600 bg-white rounded-lg font-medium hover:bg-indigo-50 transition-colors shadow-sm"
          >
            View All Suppliers
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SupplierSection;