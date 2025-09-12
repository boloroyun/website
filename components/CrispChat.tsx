'use client';
import { useEffect } from 'react';

export default function CrispChat() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const w = window as any;

    // Initialize Crisp if not already done
    if (!w.$crisp) {
      w.$crisp = [];
    }

    // Set website ID
    if (!w.CRISP_WEBSITE_ID) {
      w.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    }

    // Only load script if not already loaded
    if (!document.querySelector('script[src*="client.crisp.chat"]')) {
      const s = document.createElement('script');
      s.src = 'https://client.crisp.chat/l.js';
      s.async = true;
      document.head.appendChild(s);

      // Debug log
      console.log(
        'Crisp chat script loaded with ID:',
        process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID
      );
    }
  }, []);

  return null;
}
