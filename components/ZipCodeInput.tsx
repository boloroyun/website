'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCityByZipCode } from '@/lib/address-database';
import { CheckCircle, MapPin } from 'lucide-react';

interface ZipCodeInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onLocationFound?: (location: {
    city: string;
    state: string;
    stateCode: string;
  }) => void;
  placeholder?: string;
  id?: string;
  country?: string;
}

const ZipCodeInput = ({
  label,
  value,
  onChange,
  onLocationFound,
  placeholder,
  id,
  country = 'US',
}: ZipCodeInputProps) => {
  const [isValidZip, setIsValidZip] = useState(false);
  const [foundLocation, setFoundLocation] = useState<{
    city: string;
    state: string;
    stateCode: string;
  } | null>(null);

  useEffect(() => {
    if (value.length >= 5 && country === 'US') {
      const location = getCityByZipCode(value);
      if (location) {
        setFoundLocation(location);
        setIsValidZip(true);
        if (onLocationFound) {
          onLocationFound(location);
        }
      } else {
        setFoundLocation(null);
        setIsValidZip(false);
      }
    } else {
      setFoundLocation(null);
      setIsValidZip(false);
    }
  }, [value, country, onLocationFound]); // Include onLocationFound in dependencies

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    if (country === 'US') {
      // Format US ZIP code
      inputValue = inputValue.replace(/\D/g, ''); // Remove non-digits

      if (inputValue.length > 5) {
        // Format as 12345-6789
        inputValue = `${inputValue.slice(0, 5)}-${inputValue.slice(5, 9)}`;
      }

      // Limit to 10 characters (12345-6789)
      if (inputValue.length > 10) {
        inputValue = inputValue.slice(0, 10);
      }
    }

    onChange(inputValue);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          maxLength={country === 'US' ? 10 : 20}
          className={`pr-10 ${
            isValidZip ? 'border-green-500 focus:border-green-500' : ''
          }`}
        />

        {/* Success indicator */}
        {isValidZip && foundLocation && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <CheckCircle className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>

      {/* Location display */}
      {foundLocation && (
        <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-md">
          <MapPin className="h-4 w-4" />
          <span>
            📍 {foundLocation.city}, {foundLocation.stateCode}
          </span>
        </div>
      )}

      {/* Invalid ZIP message */}
      {value.length >= 5 && !isValidZip && country === 'US' && (
        <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-md">
          ⚠️ ZIP code not found. Please verify the ZIP code.
        </div>
      )}
    </div>
  );
};

export default ZipCodeInput;
