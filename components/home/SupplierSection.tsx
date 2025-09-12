'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ExternalLink } from 'lucide-react';
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
        4
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
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="heading my-4 uppercase">Finding Suppliers Near You</h2>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="heading text-center uppercase my-8">
        Our Partner Suppliers
      </h2>

      {locationError && (
        <p className="text-center text-gray-500 mb-6">{locationError}</p>
      )}

      {!locationError && userLocation && (
        <p className="text-center text-gray-600 mb-6">
          Showing suppliers nearest to your location
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col items-center"
          >
            <div className="w-32 h-32 relative mb-4 flex items-center justify-center">
              <Image
                src={supplier.logoUrl}
                alt={`${supplier.name} logo`}
                width={128}
                height={128}
                className="object-contain"
                onError={handleLogoError}
              />
            </div>

            <h3 className="text-lg font-semibold text-center mb-2">
              {supplier.name}
            </h3>

            <div className="flex items-center text-gray-600 mb-2">
              <MapPin size={16} className="mr-1" />
              <span className="text-sm">
                {supplier.location.city}, {supplier.location.state}
              </span>
            </div>

            <p className="text-sm text-gray-500 text-center mb-4 line-clamp-2">
              {supplier.description}
            </p>

            <div className="mt-auto">
              <Link
                href={supplier.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
              >
                Visit Website <ExternalLink size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupplierSection;
