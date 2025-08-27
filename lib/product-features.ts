import {
  ShieldCheck,
  Award,
  Wrench,
  MapPin,
  Truck,
  Calendar,
  Home,
  Sparkles,
  CheckCircle,
  Timer,
  Star,
  Hammer,
} from 'lucide-react';

// Define feature type
export interface ProductFeature {
  icon: any;
  text: string;
}

// Get features based on product category
export function getProductFeatures(categoryName: string): ProductFeature[] {
  const category = categoryName.toLowerCase();

  // Cabinet-specific features
  if (category.includes('cabinet')) {
    return [
      { icon: ShieldCheck, text: 'DURABLE & LONG-LASTING' },
      { icon: Award, text: 'CERTIFIED QUALITY' },
      { icon: Wrench, text: 'PROFESSIONAL INSTALLATION' },
      { icon: MapPin, text: 'LOCAL FABRICATION' },
    ];
  }

  // Stone/Countertop-specific features
  if (category.includes('stone') || category.includes('countertop')) {
    return [
      { icon: ShieldCheck, text: 'SCRATCH & HEAT RESISTANT' },
      { icon: Award, text: 'PREMIUM GRADE MATERIAL' },
      { icon: Hammer, text: 'EXPERT FABRICATION' },
      { icon: MapPin, text: 'LOCAL SHOWROOM' },
    ];
  }

  // Beauty product features (fallback for beauty categories)
  if (
    category.includes('beauty') ||
    category.includes('cosmetic') ||
    category.includes('fragrance')
  ) {
    return [
      { icon: Sparkles, text: 'PREMIUM QUALITY' },
      { icon: Award, text: 'DERMATOLOGIST TESTED' },
      { icon: CheckCircle, text: 'CRUELTY-FREE' },
      { icon: MapPin, text: 'TRUSTED BRAND' },
    ];
  }

  // Default features for any other products
  return [
    { icon: ShieldCheck, text: 'DURABLE & LONG-LASTING' },
    { icon: Award, text: 'CERTIFIED QUALITY' },
    { icon: Truck, text: 'FAST DELIVERY' },
    { icon: MapPin, text: 'LOCAL SERVICE' },
  ];
}

// Alternative feature sets for different business contexts
export const CABINET_FEATURES: ProductFeature[] = [
  { icon: ShieldCheck, text: 'LIFETIME WARRANTY' },
  { icon: Home, text: 'CUSTOM DESIGN' },
  { icon: Wrench, text: 'PROFESSIONAL INSTALLATION' },
  { icon: Calendar, text: 'QUICK TURNAROUND' },
];

export const COUNTERTOP_FEATURES: ProductFeature[] = [
  { icon: ShieldCheck, text: 'SCRATCH RESISTANT' },
  { icon: Award, text: 'PREMIUM GRADE' },
  { icon: Hammer, text: 'PRECISION CUT' },
  { icon: Timer, text: 'FAST INSTALLATION' },
];

export const STONE_FEATURES: ProductFeature[] = [
  { icon: Award, text: 'NATURAL BEAUTY' },
  { icon: ShieldCheck, text: 'HEAT RESISTANT' },
  { icon: Star, text: 'UNIQUE PATTERNS' },
  { icon: Wrench, text: 'EXPERT INSTALLATION' },
];

// Business value propositions for home improvement
export const HOME_IMPROVEMENT_FEATURES: ProductFeature[] = [
  { icon: Home, text: 'INCREASES HOME VALUE' },
  { icon: Award, text: 'INDUSTRY CERTIFIED' },
  { icon: Calendar, text: 'FREE CONSULTATION' },
  { icon: MapPin, text: 'LOCAL PROFESSIONALS' },
];
