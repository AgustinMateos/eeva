'use client';

import { useEffect, useState } from 'react';

const FINISH_MS = 300; // tiempo para que la barra llegue al 100%
const FADE_MS = 400; // duración del fundido de salida

/**
 * Loader de pantalla completa "Initiating SYSTEM".
 *
 * Se usa como overlay encima del contenido: <Loader loading={loading} />
 * - Si arranca con loading=false (datos que vienen del servidor), no se muestra nunca.
 * - Mientras loading=true, la barra avanza sola acercándose al 90%.
 * - Cuando loading pasa a false, completa al 100%, se desvanece y se desmonta.
 */
export default function Loader({ loading }) {
  const [visible, setVisible] = useState(loading);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      setVisible(true);
      setFading(false);
      const interval = setInterval(() => {
        // Avanza rápido al principio y cada vez más lento, sin pasar del 90%
        setProgress((p) => p + (90 - p) * 0.08);
      }, 100);
      return () => clearInterval(interval);
    }

    setProgress(100);
    const fadeTimer = setTimeout(() => setFading(true), FINISH_MS);
    const hideTimer = setTimeout(() => setVisible(false), FINISH_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [loading]);

  if (!visible) return null;

  const pct = Math.floor(progress);

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden z-50 bg-gradient-to-r from-[#303F48] to-[#6D7276] transition-opacity ease-out"
      style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
      role="progressbar"
      aria-label="Cargando"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-[clip-path] duration-300 ease-out"
        style={{
          backgroundImage: 'url(/lineasCodigo.svg)',
          clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`,
        }}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
        <span className="font-medium text-2xl leading-none tracking-[-0.02em] text-center uppercase text-[#F9F9F9]">
          Initiating SYSTEM
        </span>
        <div className="w-[305px] md:w-[405px] h-7 rounded-[2px] border border-[#F2F2F2] p-2 bg-[#FFFFFF1A] overflow-hidden">
          <div
            className="h-full bg-[#D9D9D9] transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-light text-lg leading-none tracking-[-0.02em] text-center uppercase text-[#F9F9F9]">
          {pct}%
        </span>
      </div>
    </div>
  );
}
