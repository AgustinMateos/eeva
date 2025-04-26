'use client';
import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', '#303F48'); // o cualquier color que combine con el gradiente
    }
  }, []);

  return (
    <html lang="en">
      <body className="antialiased bg-gradient-to-r from-[#303F48] to-[#6D7276]">
        {children}
      </body>
    </html>
  );
}
