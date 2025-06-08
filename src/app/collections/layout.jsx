'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar'; // Ajusta la ruta según la ubicación real

import Loader from '@/components/Loader';

export default function CollectionsLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  // Simula un tiempo de carga o puedes integrarlo con una lógica real
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Cambia el estado a false después de 2 segundos
    }, 3000); // Ajusta el tiempo según tus necesidades

    return () => clearTimeout(timer); // Limpieza del temporizador
  }, []);

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80">
        <Navbar />
      </nav>
      <main>
        {
          children
        }
      </main>
    </div>
  );
}