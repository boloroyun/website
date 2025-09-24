'use client';

import React from 'react';
import { ClientTopBar } from './client/ClientTopBar';
import { ClientCategoriesTopBar } from './client/ClientCategoriesTopBar';

// Simplified client component version of TopBarWrapper
export default function TopBarWrapperClient() {
  return (
    <div className="w-full">
      <ClientTopBar />
      <ClientCategoriesTopBar />
    </div>
  );
}
