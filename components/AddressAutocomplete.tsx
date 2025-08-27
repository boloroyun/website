'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { searchAddresses, generateAddressSuggestions, StreetPattern } from '@/lib/address-database';

interface AddressSuggestion {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isReal?: boolean;
}

interface AddressAutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onAddressSelect?: (suggestion: AddressSuggestion) => void;
  placeholder?: string;
  id?: string;
  country?: string;
  currentCity?: string;
  currentState?: string;
}

const AddressAutocomplete = ({
  label,
  value,
  onChange,
  onAddressSelect,
  placeholder,
  id,
  country = 'US',
  currentCity,
  currentState,
}: AddressAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length >= 2 && country === 'US') {
      const allSuggestions: AddressSuggestion[] = [];
      
      // First, get real address patterns
      const realAddresses = searchAddresses(value, 5);
      realAddresses.forEach(pattern => {
        allSuggestions.push({
          address: pattern.pattern,
          city: pattern.city,
          state: pattern.state,
          zipCode: pattern.zipCode,
          isReal: true,
        });
      });
      
      // Then, generate dynamic suggestions based on input
      if (allSuggestions.length < 5) {
        const dynamicSuggestions = generateAddressSuggestions(value, currentCity, currentState);
        dynamicSuggestions.forEach(addr => {
          allSuggestions.push({
            address: addr,
            city: currentCity || 'Your City',
            state: currentState || 'VA',
            zipCode: '00000',
            isReal: false,
          });
        });
      }
      
      setSuggestions(allSuggestions.slice(0, 6));
      setShowSuggestions(allSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [value, country, currentCity, currentState]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    onChange(suggestion.address);
    setShowSuggestions(false);
    if (onAddressSelect) {
      onAddressSelect(suggestion);
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
          handleSuggestionClick(suggestions[selectedIndex]);
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
          autoComplete="street-address"
        />

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.address}-${suggestion.city}-${index}`}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                  index === selectedIndex ? 'bg-blue-50 text-blue-900' : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex-grow">
                    <div className="font-medium text-sm flex items-center space-x-2">
                      <span>{suggestion.address}</span>
                      {suggestion.isReal && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          📍 Real
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {suggestion.city}, {suggestion.state} {suggestion.zipCode !== '00000' ? suggestion.zipCode : ''}
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

export default AddressAutocomplete;
