'use client';

import Navbar from './Navbar';

// Import the client component directly
import TopBarWrapperClient from './TopBarWrapperClient';

const DefaultHeader = () => {
  return (
    <header>
      <TopBarWrapperClient />
      <Navbar />
    </header>
  );
};

export default DefaultHeader;
