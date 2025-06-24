'use client'; 

import Navbar from '@/components/Navbar'; 

export default function OrderLayout({ children }) {
  return (
    <div>
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80">
        <Navbar />
      </nav>
      <main>{children}</main> 
    </div>
  );
}

