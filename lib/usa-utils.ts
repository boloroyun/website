// USA localization utilities

// Currency formatting for USD
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Date formatting for USA (MM/DD/YYYY)
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
}

// Date and time formatting for USA
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(dateObj);
}

// Phone number formatting for USA
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');

  // Handle different phone number formats
  if (cleaned.length === 10) {
    // Format as (XXX) XXX-XXXX
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    // Format as +1 (XXX) XXX-XXXX
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  // Return original if format doesn't match
  return phone;
}

// Address formatting for USA
export function formatAddress(address: {
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}): string {
  const parts = [
    address.address1,
    address.address2,
    address.city && address.state
      ? `${address.city}, ${address.state}`
      : address.city || address.state,
    address.zipCode,
    address.country !== 'USA' ? address.country : undefined,
  ].filter(Boolean);

  return parts.join(', ');
}

// ZIP code validation for USA
export function isValidZipCode(zipCode: string): boolean {
  // Supports both 5-digit and 9-digit ZIP codes
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

// State abbreviation to full name mapping
export const US_STATES = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
  DC: 'District of Columbia',
} as const;

// Get state full name from abbreviation
export function getStateName(abbreviation: string): string {
  return US_STATES[abbreviation as keyof typeof US_STATES] || abbreviation;
}

// Get state abbreviation from full name
export function getStateAbbreviation(fullName: string): string {
  const entry = Object.entries(US_STATES).find(
    ([, name]) => name.toLowerCase() === fullName.toLowerCase()
  );
  return entry ? entry[0] : fullName;
}

// USA locale settings
export const USA_LOCALE = 'en-US';
export const USA_TIMEZONE = 'America/New_York'; // Eastern Time as default
export const USA_CURRENCY = 'USD';

// Common USA business patterns
export const BUSINESS_HOURS = {
  weekday: '9:00 AM - 6:00 PM EST',
  saturday: '10:00 AM - 4:00 PM EST',
  sunday: 'Closed',
};

// USA tax calculation (this should be updated based on actual tax rates)
export function calculateTax(amount: number, state: string = 'CA'): number {
  // This is a simplified example - real tax calculation would be more complex
  const taxRates: Record<string, number> = {
    CA: 0.0875, // California
    NY: 0.08, // New York
    TX: 0.0625, // Texas
    FL: 0.06, // Florida
    // Add more states as needed
  };

  const rate = taxRates[state] || 0.07; // Default 7%
  return amount * rate;
}

// Format shipping time for USA
export function formatShippingTime(days: number): string {
  if (days === 1) return '1 business day';
  if (days <= 5) return `${days} business days`;
  if (days <= 10) return `${days}-${days + 2} business days`;
  return `${days}+ business days`;
}
