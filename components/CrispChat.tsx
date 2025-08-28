'use client';
import { useEffect } from 'react';

export default function CrispChat() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const w = window as any;
    if (w.$crisp && w.CRISP_WEBSITE_ID) return;

    w.$crisp = [];
    w.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

    const s = document.createElement('script');
    s.src = 'https://client.crisp.chat/l.js';
    s.async = true;
    document.head.appendChild(s);
  }, []);

  return null;
}
