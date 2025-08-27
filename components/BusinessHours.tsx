import React from 'react';
import { Clock } from 'lucide-react';
import { BUSINESS_HOURS } from '@/lib/usa-utils';

export default function BusinessHours() {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      <Clock className="w-4 h-4" />
      <div>
        <p className="font-medium">Business Hours (EST):</p>
        <p>Mon-Fri: {BUSINESS_HOURS.weekday}</p>
        <p>Sat: {BUSINESS_HOURS.saturday}</p>
        <p>Sun: {BUSINESS_HOURS.sunday}</p>
      </div>
    </div>
  );
}
