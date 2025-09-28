'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[];
}

export default function JsonLd({ data }: JsonLdProps) {
  const [jsonString, setJsonString] = useState('' as string);

  useEffect(() => {
    setJsonString(JSON.stringify(data));
  }, [data]);

  return (
    <script
      id={`json-ld-${Math.random().toString(36).substring(2, 9)}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}

export function LocalBusinessJsonLd({
  name,
  description,
  url,
  telephone,
  address,
  geo,
  images,
  rating,
  priceRange,
  openingHours,
  sameAs,
}: {
  name: string;
  description: string;
  url: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  images?: string[];
  rating?: {
    ratingValue: number;
    ratingCount: number;
  };
  priceRange?: string;
  openingHours?: string[];
  sameAs?: string[];
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    '@id': `${url}#organization`,
    name,
    description,
    url,
    telephone,
    address: {
      '@type': 'PostalAddress',
      ...address,
    },
    ...(geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: geo.latitude,
        longitude: geo.longitude,
      },
    }),
    ...(images && { image: images }),
    ...(rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.ratingValue,
        ratingCount: rating.ratingCount,
      },
    }),
    ...(priceRange && { priceRange }),
    ...(openingHours && { openingHoursSpecification: openingHours }),
    ...(sameAs && { sameAs }),
  };

  return <JsonLd data={data} />;
}

export function ProductJsonLd({
  name,
  description,
  sku,
  image,
  brand,
  offers,
  aggregateRating,
  reviews,
}: {
  name: string;
  description: string;
  sku?: string;
  image: string | string[];
  brand?: {
    name: string;
  };
  offers: {
    price: number;
    priceCurrency: string;
    availability: string;
    url: string;
    priceValidUntil?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  reviews?: Array<{
    author: string;
    datePublished: string;
    reviewBody: string;
    name: string;
    ratingValue: number;
  }>;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    ...(sku && { sku }),
    image: Array.isArray(image) ? image : [image],
    ...(brand && {
      brand: {
        '@type': 'Brand',
        name: brand.name,
      },
    }),
    offers: {
      '@type': 'Offer',
      ...offers,
    },
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ...aggregateRating,
      },
    }),
    ...(reviews &&
      reviews.length > 0 && {
        review: reviews.map((review) => ({
          '@type': 'Review',
          author: {
            '@type': 'Person',
            name: review.author,
          },
          datePublished: review.datePublished,
          reviewBody: review.reviewBody,
          name: review.name,
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.ratingValue,
          },
        })),
      }),
  };

  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{
    name: string;
    item: string;
  }>;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };

  return <JsonLd data={data} />;
}

export function FAQJsonLd({
  questions,
}: {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

export function WebsiteJsonLd({
  name,
  url,
  description,
  publisher,
}: {
  name: string;
  url: string;
  description: string;
  publisher: {
    name: string;
    logo?: string;
  };
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    publisher: {
      '@type': 'Organization',
      name: publisher.name,
      ...(publisher.logo && {
        logo: {
          '@type': 'ImageObject',
          url: publisher.logo,
        },
      }),
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLd data={data} />;
}
