// Real address data for intelligent autocomplete and ZIP code lookup

export interface CityData {
  city: string;
  state: string;
  stateCode: string;
  zipCodes: string[];
  county?: string;
}

export interface StreetPattern {
  pattern: string;
  city: string;
  state: string;
  zipCode: string;
}

// Real Virginia cities and ZIP codes (focusing on LUX Cabinets & Stones service area)
export const VIRGINIA_CITIES: CityData[] = [
  {
    city: 'Chantilly',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['20151', '20152'],
    county: 'Fairfax County',
  },
  {
    city: 'Fairfax',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['22030', '22031', '22032', '22033', '22035'],
    county: 'Fairfax County',
  },
  {
    city: 'Herndon',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['20170', '20171'],
    county: 'Fairfax County',
  },
  {
    city: 'Reston',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['20190', '20191', '20194'],
    county: 'Fairfax County',
  },
  {
    city: 'Sterling',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['20164', '20165', '20166'],
    county: 'Loudoun County',
  },
  {
    city: 'Ashburn',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['20147', '20148', '20149'],
    county: 'Loudoun County',
  },
  {
    city: 'Leesburg',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['20175', '20176', '20177'],
    county: 'Loudoun County',
  },
  {
    city: 'Vienna',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['22180', '22181', '22182', '22183'],
    county: 'Fairfax County',
  },
  {
    city: 'McLean',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['22101', '22102', '22103', '22106'],
    county: 'Fairfax County',
  },
  {
    city: 'Great Falls',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['22066'],
    county: 'Fairfax County',
  },
  {
    city: 'Oakton',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['22124'],
    county: 'Fairfax County',
  },
  {
    city: 'Burke',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['22015'],
    county: 'Fairfax County',
  },
  {
    city: 'Springfield',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['22150', '22151', '22152', '22153'],
    county: 'Fairfax County',
  },
  {
    city: 'Annandale',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['22003'],
    county: 'Fairfax County',
  },
  {
    city: 'Falls Church',
    state: 'Virginia',
    stateCode: 'VA',
    zipCodes: ['22041', '22042', '22043', '22044', '22046'],
    county: 'Fairfax County',
  },
];

// Maryland cities (nearby service area)
export const MARYLAND_CITIES: CityData[] = [
  {
    city: 'Bethesda',
    state: 'Maryland',
    stateCode: 'MD',
    zipCodes: ['20814', '20815', '20816', '20817'],
    county: 'Montgomery County',
  },
  {
    city: 'Rockville',
    state: 'Maryland',
    stateCode: 'MD',
    zipCodes: ['20850', '20851', '20852', '20853'],
    county: 'Montgomery County',
  },
  {
    city: 'Gaithersburg',
    state: 'Maryland',
    stateCode: 'MD',
    zipCodes: ['20877', '20878', '20879', '20882'],
    county: 'Montgomery County',
  },
  {
    city: 'Silver Spring',
    state: 'Maryland',
    stateCode: 'MD',
    zipCodes: ['20901', '20902', '20903', '20904', '20905'],
    county: 'Montgomery County',
  },
  {
    city: 'Potomac',
    state: 'Maryland',
    stateCode: 'MD',
    zipCodes: ['20854'],
    county: 'Montgomery County',
  },
];

// DC areas
export const DC_AREAS: CityData[] = [
  {
    city: 'Washington',
    state: 'District of Columbia',
    stateCode: 'DC',
    zipCodes: [
      '20001',
      '20002',
      '20003',
      '20004',
      '20005',
      '20006',
      '20007',
      '20008',
      '20009',
      '20010',
    ],
  },
];

// Combine all cities
export const ALL_CITIES: CityData[] = [
  ...VIRGINIA_CITIES,
  ...MARYLAND_CITIES,
  ...DC_AREAS,
];

// Real street patterns for address suggestions
export const STREET_PATTERNS: StreetPattern[] = [
  // Chantilly area
  {
    pattern: '25557 Donegal Dr',
    city: 'Chantilly',
    state: 'VA',
    zipCode: '20151',
  },
  {
    pattern: '4350 Chantilly Shopping Center',
    city: 'Chantilly',
    state: 'VA',
    zipCode: '20151',
  },
  { pattern: '14500 Lee Rd', city: 'Chantilly', state: 'VA', zipCode: '20151' },
  {
    pattern: '13873 Park Center Rd',
    city: 'Chantilly',
    state: 'VA',
    zipCode: '20151',
  },
  {
    pattern: '4230 Lafayette Center Dr',
    city: 'Chantilly',
    state: 'VA',
    zipCode: '20151',
  },

  // Fairfax area
  {
    pattern: '12001 Government Center Pkwy',
    city: 'Fairfax',
    state: 'VA',
    zipCode: '22035',
  },
  {
    pattern: '4100 Chain Bridge Rd',
    city: 'Fairfax',
    state: 'VA',
    zipCode: '22030',
  },
  { pattern: '10721 Main St', city: 'Fairfax', state: 'VA', zipCode: '22030' },
  {
    pattern: '3950 University Dr',
    city: 'Fairfax',
    state: 'VA',
    zipCode: '22030',
  },

  // Herndon area
  { pattern: '777 Lynn St', city: 'Herndon', state: 'VA', zipCode: '20170' },
  {
    pattern: '2200 Centreville Rd',
    city: 'Herndon',
    state: 'VA',
    zipCode: '20170',
  },
  { pattern: '1050 Elden St', city: 'Herndon', state: 'VA', zipCode: '20170' },

  // Reston area
  { pattern: '11900 Market St', city: 'Reston', state: 'VA', zipCode: '20190' },
  { pattern: '1818 Library St', city: 'Reston', state: 'VA', zipCode: '20190' },
  {
    pattern: '12001 Sunrise Valley Dr',
    city: 'Reston',
    state: 'VA',
    zipCode: '20191',
  },

  // Sterling area
  {
    pattern: '46301 Potomac Run Plaza',
    city: 'Sterling',
    state: 'VA',
    zipCode: '20164',
  },
  {
    pattern: '21100 Dulles Town Cir',
    city: 'Sterling',
    state: 'VA',
    zipCode: '20166',
  },
  {
    pattern: '45425 Dulles Crossing Plaza',
    city: 'Sterling',
    state: 'VA',
    zipCode: '20166',
  },

  // Ashburn area
  {
    pattern: '20147 Ashbrook Commons Plaza',
    city: 'Ashburn',
    state: 'VA',
    zipCode: '20147',
  },
  {
    pattern: '44050 Ashburn Shopping Plaza',
    city: 'Ashburn',
    state: 'VA',
    zipCode: '20147',
  },
  {
    pattern: '43330 Junction Plaza',
    city: 'Ashburn',
    state: 'VA',
    zipCode: '20147',
  },

  // Vienna area
  { pattern: '180 Maple Ave E', city: 'Vienna', state: 'VA', zipCode: '22180' },
  { pattern: '515 Maple Ave W', city: 'Vienna', state: 'VA', zipCode: '22180' },
  { pattern: '8100 Boone Blvd', city: 'Vienna', state: 'VA', zipCode: '22182' },

  // McLean area
  {
    pattern: '1445 Laughlin Ave',
    city: 'McLean',
    state: 'VA',
    zipCode: '22101',
  },
  { pattern: '6729 Curran St', city: 'McLean', state: 'VA', zipCode: '22101' },
  {
    pattern: '8100 Old Dominion Dr',
    city: 'McLean',
    state: 'VA',
    zipCode: '22102',
  },
];

// ZIP code to city/state lookup
export const ZIP_CODE_DATABASE: Record<
  string,
  { city: string; state: string; stateCode: string }
> = {};

// Populate ZIP code database
ALL_CITIES.forEach((cityData) => {
  cityData.zipCodes.forEach((zipCode) => {
    ZIP_CODE_DATABASE[zipCode] = {
      city: cityData.city,
      state: cityData.state,
      stateCode: cityData.stateCode,
    };
  });
});

// Helper functions
export const getCityByZipCode = (zipCode: string) => {
  const cleanZip = zipCode.replace(/\D/g, '').slice(0, 5); // Clean and get first 5 digits
  return ZIP_CODE_DATABASE[cleanZip] || null;
};

export const searchCities = (query: string, limit: number = 10): CityData[] => {
  if (query.length < 2) return [];

  const lowerQuery = query.toLowerCase();
  return ALL_CITIES.filter(
    (city) =>
      city.city.toLowerCase().includes(lowerQuery) ||
      city.county?.toLowerCase().includes(lowerQuery)
  ).slice(0, limit);
};

export const searchAddresses = (
  query: string,
  limit: number = 8
): StreetPattern[] => {
  if (query.length < 3) return [];

  const lowerQuery = query.toLowerCase();
  return STREET_PATTERNS.filter(
    (pattern) =>
      pattern.pattern.toLowerCase().includes(lowerQuery) ||
      pattern.city.toLowerCase().includes(lowerQuery)
  ).slice(0, limit);
};

export const getZipCodesForCity = (
  cityName: string,
  stateCode: string
): string[] => {
  const city = ALL_CITIES.find(
    (c) =>
      c.city.toLowerCase() === cityName.toLowerCase() &&
      c.stateCode === stateCode
  );
  return city ? city.zipCodes : [];
};

// Common street types for address suggestions
export const STREET_TYPES = [
  'St',
  'Street',
  'Ave',
  'Avenue',
  'Rd',
  'Road',
  'Dr',
  'Drive',
  'Ln',
  'Lane',
  'Ct',
  'Court',
  'Pl',
  'Place',
  'Blvd',
  'Boulevard',
  'Pkwy',
  'Parkway',
  'Cir',
  'Circle',
  'Way',
  'Plaza',
  'Commons',
];

// Generate dynamic address suggestions based on partial input
export const generateAddressSuggestions = (
  input: string,
  city?: string,
  state?: string
): string[] => {
  if (input.length < 2) return [];

  const suggestions: string[] = [];
  const numbers = ['100', '200', '300', '500', '1000', '1500', '2000', '2500'];

  // If input starts with a number, suggest street names
  if (/^\d/.test(input)) {
    const inputNumber = input.match(/^\d+/)?.[0] || '';
    const streetName = input.replace(/^\d+\s*/, '');

    if (streetName.length >= 2) {
      STREET_TYPES.forEach((type) => {
        suggestions.push(`${inputNumber} ${streetName} ${type}`);
      });
    }
  } else {
    // If input is text, suggest with common numbers
    numbers.forEach((num) => {
      STREET_TYPES.forEach((type) => {
        if (
          type.toLowerCase().includes(input.toLowerCase()) ||
          input.toLowerCase().includes(type.toLowerCase().slice(0, 2))
        ) {
          suggestions.push(`${num} ${input} ${type}`);
        }
      });
    });
  }

  return suggestions.slice(0, 5);
};
