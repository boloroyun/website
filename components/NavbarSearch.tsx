'use client';

import { useState } from 'react';
import SearchModal from './SearchModal';

const NavbarSearch = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="hidden lg:block w-full max-w-xs">
      <div className="relative">
        <input
          type="search"
          placeholder="Search..."
          onClick={() => setOpen(true)}
          className="pl-10 pr-4 py-2 w-full border-b-2 border-black"
          readOnly
        />
        {open && <SearchModal setOpen={setOpen} />}
      </div>
    </div>
  );
};

export default NavbarSearch;
