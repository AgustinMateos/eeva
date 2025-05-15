'use client'; // Si usa hooks como useState o useEffect

import Navbar from '@/components/Navbar'; // Ajusta la ruta según la ubicación real

export default function OrderLayout({ children }) {
  return (
    <div>
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80">
        <Navbar />
      </nav>
      <main>{children}</main> {/* Aquí se renderizan las páginas como Slider */}
    </div>
  );
}

