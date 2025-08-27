'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { searchCities, CityData, getZipCodesForCity } from '@/lib/address-database';
import { MapPin, Building } from 'lucide-react';

interface CityAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onCitySelect?: (city: CityData) => void;
  placeholder?: string;
  id?: string;
  country?: string;
  stateCode?: string;
}

const CityAutocomplete = ({
  label,
  value,
  onChange,
  onCitySelect,
  placeholder,
  id,
  country = 'US',
  stateCode,
}: CityAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2 && country === 'US') {
      const citySuggestions = searchCities(value, 8);
      
      // Filter by state if provided
      const filteredSuggestions = stateCode 
        ? citySuggestions.filter(city => city.stateCode === stateCode)
        : citySuggestions;
      
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [value, country, stateCode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleCitySelect = (city: CityData) => {
    onChange(city.city);
    setShowSuggestions(false);
    if (onCitySelect) {
      onCitySelect(city);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleCitySelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  return (
    <div className="space-y-2 relative">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          autoComplete="address-level2"
        />

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {suggestions.map((city, index) => (
              <div
                key={`${city.city}-${city.stateCode}`}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                  index === selectedIndex ? 'bg-blue-50 text-blue-900' : ''
                }`}
                onClick={() => handleCitySelect(city)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <MapPin className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium text-sm">{city.city}</div>
                    <div className="text-xs text-gray-500 flex items-center space-x-2">
                      <span>{city.state}</span>
                      {city.county && (
                        <>
                          <span>•</span>
                          <span className="flex items-center space-x-1">
                            <Building className="h-3 w-3" />
                            <span>{city.county}</span>
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      ZIP: {city.zipCodes.slice(0, 3).join(', ')}
                      {city.zipCodes.length > 3 && ` +${city.zipCodes.length - 3} more`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="px-4 py-2 text-xs text-gray-400 bg-gray-50 border-t">
              💡 Tip: Use arrow keys to navigate, Enter to select
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityAutocomplete;
