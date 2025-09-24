'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, MessageCircle } from 'lucide-react';
import QuoteRequestModal from './QuoteRequestModal';
import { emitCrispEvent, CRISP_EVENTS } from '@/lib/crisp-events';

interface QuoteRequestButtonProps {
  category?: 'countertop' | 'cabinet' | 'combo';
  productIds?: string[];
  variant?:
    | 'default'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  children?: React.ReactNode;
}

export default function QuoteRequestButton({
  category = 'countertop',
  productIds = [],
  variant = 'default',
  size = 'default',
  className = '',
  children,
}: QuoteRequestButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const defaultText =
    category === 'combo'
      ? 'Get a Quote Now'
      : category === 'cabinet'
        ? 'Get a Quote Now'
        : 'Get a Quote Now';

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => {
          // Track quote builder opening with type-safe events
          emitCrispEvent({
            name: CRISP_EVENTS.Quote.OPENED,
            data: {
              source: 'product_page',
              productId: productIds?.[0], // Use first product ID if available
            },
          });

          setShowModal(true);
        }}
      >
        <Calculator className="mr-2 h-4 w-4" />
        {children || defaultText}
      </Button>

      <QuoteRequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        initialCategory={category}
        productIds={productIds}
      />
    </>
  );
}

// Export a chat-style button for use in various contexts
export function QuoteChatButton({
  category = 'countertop',
  productIds = [],
  className = '',
}: Omit<QuoteRequestButtonProps, 'variant' | 'size' | 'children'>) {
  return (
    <QuoteRequestButton
      category={category}
      productIds={productIds}
      variant="outline"
      size="sm"
      className={`border-blue-200 text-blue-700 hover:bg-blue-50 ${className}`}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Quick Quote
    </QuoteRequestButton>
  );
}
