'use client';

import Navbar from './Navbar';

// Import the client component directly
import TopBarWrapperClient from './TopBarWrapperClient';

const DefaultHeader = () => {
  return (
    <div className="sticky top-0 z-50 bg-white">
      <TopBarWrapperClient />
      <Navbar />
    </div>
  );
};

export default DefaultHeader;
