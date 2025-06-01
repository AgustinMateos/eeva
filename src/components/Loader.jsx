import React, { useState, useEffect } from 'react';

const Loader = ({ loading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      // Increment progress while loading
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 100; // Cap at 100%
          return prev + 1;
        });
      }, 20); // 2s animation: 2000ms / 100 = 20ms per step

      return () => clearInterval(interval);
    } else {
      // When loading is false, set progress to 100% immediately
      setProgress(100);
    }
  }, [loading]);

  // Hide loader when progress reaches 100%
  if (progress >= 100) {
    return null;
  }

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-50 bg-gradient-to-r from-[#303F48] to-[#6D7276]">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-[20ms] ease-linear"
        style={{
          backgroundImage: 'url(/lineasCodigo.svg)',
          clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)`,
        }}
      ></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-10">
        <span
          className="font-medium text-2xl leading-none tracking-[-0.02em] text-center uppercase text-[#F9F9F9]"
          style={{ fontFamily: 'IBM Plex Mono' }}
        >
          Initiating SYSTEM
        </span>
        <div
          className="w-[305px] md:w-[405px] h-7 rounded-[2px] border border-[#F2F2F2] p-2 bg-[#FFFFFF1A] overflow-hidden"
        >
          <div
            className="h-full bg-[#D9D9D9] transition-all duration-[20ms] ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <span
          className="font-light text-lg leading-none tracking-[-0.02em] text-center uppercase text-[#F9F9F9]"
          style={{ fontFamily: 'IBM Plex Mono' }}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default Loader;