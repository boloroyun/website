export interface Supplier {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  website: string;
  location: {
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  products: string[];
}

export const suppliers: Supplier[] = [
  {
    id: 'sup-001',
    name: 'MSI',
    description:
      'Leading supplier of premium countertops, flooring, wall tile, and hardscaping products.',
    logoUrl: '/images/suppliers/msi.svg',
    website: 'https://www.msisurfaces.com/',
    location: {
      city: 'Sterling',
      state: 'VA',
      country: 'USA',
      latitude: 39.0062,
      longitude: -77.4286,
    },
    products: ['Granite', 'Marble', 'Quartz', 'Porcelain'],
  },
  {
    id: 'sup-002',
    name: 'Marble Express',
    description:
      'Specializing in natural stone products with one of the largest selections in the DC metro area.',
    logoUrl: '/images/suppliers/marble-express.svg',
    website: 'https://marbleexpress.com/',
    location: {
      city: 'Fairfax',
      state: 'VA',
      country: 'USA',
      latitude: 38.8462,
      longitude: -77.3064,
    },
    products: ['Marble', 'Granite', 'Quartz', 'Limestone'],
  },
  {
    id: 'sup-003',
    name: 'Marble Systems',
    description:
      'Premium natural stone, porcelain and ceramic tiles for residential and commercial projects.',
    logoUrl: '/images/suppliers/marble-systems.svg',
    website: 'https://www.marblesystems.com/',
    location: {
      city: 'Fairfax',
      state: 'VA',
      country: 'USA',
      latitude: 38.8462,
      longitude: -77.3064,
    },
    products: ['Marble Tile', 'Stone Mosaics', 'Porcelain Tile'],
  },
  {
    id: 'sup-004',
    name: 'Next Day Cabinetry',
    description:
      'High-quality kitchen and bath cabinets with quick delivery and installation options.',
    logoUrl: '/images/suppliers/next-day-cabinetry.svg',
    website: 'https://www.nextdaycabinets.com/',
    location: {
      city: 'Chantilly',
      state: 'VA',
      country: 'USA',
      latitude: 38.8943,
      longitude: -77.4311,
    },
    products: ['Kitchen Cabinets', 'Bathroom Vanities', 'Cabinet Hardware'],
  },
  {
    id: 'sup-005',
    name: '21st Century Cabinetry',
    description:
      'Custom cabinetry solutions with innovative designs and superior craftsmanship.',
    logoUrl: '/images/suppliers/21st-century.svg',
    website: 'https://www.21stcenturycabinetry.com/',
    location: {
      city: 'Alexandria',
      state: 'VA',
      country: 'USA',
      latitude: 38.8048,
      longitude: -77.0469,
    },
    products: ['Custom Cabinets', 'Kitchen Islands', 'Built-in Storage'],
  },
  {
    id: 'sup-006',
    name: 'Home Depot',
    description:
      'Complete home improvement retailer offering building materials, appliances, and installation services.',
    logoUrl: '/images/suppliers/home-depot.svg',
    website: 'https://www.homedepot.com/',
    location: {
      city: 'Fairfax',
      state: 'VA',
      country: 'USA',
      latitude: 38.8462,
      longitude: -77.3064,
    },
    products: ['Building Materials', 'Appliances', 'Home Improvement'],
  },
];

/**
 * Find suppliers near a given location
 * @param lat User's latitude
 * @param lng User's longitude
 * @param limit Maximum number of suppliers to return
 * @returns Array of suppliers sorted by distance
 */
export function findNearestSuppliers(
  lat: number,
  lng: number,
  limit: number = 3
): Supplier[] {
  // Calculate distance for each supplier
  const suppliersWithDistance = suppliers.map((supplier) => {
    const distance = calculateDistance(
      lat,
      lng,
      supplier.location.latitude,
      supplier.location.longitude
    );

    return {
      ...supplier,
      distance,
    };
  });

  // Sort by distance and return the closest ones
  return suppliersWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

/**
 * Calculate the distance between two points using the Haversine formula
 * @param lat1 First latitude
 * @param lng1 First longitude
 * @param lat2 Second latitude
 * @param lng2 Second longitude
 * @returns Distance in miles
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8; // Earth's radius in miles

  // Convert latitude and longitude from degrees to radians
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

/**
 * Get all suppliers
 * @returns Array of all suppliers
 */
export function getAllSuppliers(): Supplier[] {
  return suppliers;
}
