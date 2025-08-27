import React from 'react';
import { formatCurrency } from '@/lib/usa-utils';

interface CurrencyDisplayProps {
  amount: number;
  className?: string;
  showCents?: boolean;
}

export default function CurrencyDisplay({
  amount,
  className = '',
  showCents = true,
}: CurrencyDisplayProps) {
  const formattedAmount = showCents
    ? formatCurrency(amount)
    : formatCurrency(amount).replace(/\.\d{2}$/, '');

  return <span className={className}>{formattedAmount}</span>;
}

// Convenience components for common use cases
export function Price({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  return (
    <CurrencyDisplay amount={amount} className={className} showCents={true} />
  );
}

export function PriceWhole({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  return (
    <CurrencyDisplay amount={amount} className={className} showCents={false} />
  );
}
