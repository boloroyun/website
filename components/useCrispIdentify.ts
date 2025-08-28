'use client';
import { useEffect } from 'react';
type User = { email?: string; name?: string; phone?: string };

export function useCrispIdentify(user?: User) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const c = (window as any).$crisp as any[] | undefined;
    if (!c || !user) return;
    if (user.email) c.push(['set', 'user:email', user.email]);
    if (user.name) c.push(['set', 'user:nickname', user.name]);
    if (user.phone) c.push(['set', 'user:phone', user.phone]);
  }, [user]);
}
