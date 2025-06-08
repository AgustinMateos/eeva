'use client'; // Agrego esto si Initiation usa hooks o es un componente cliente

import React from 'react';
import Initiation from '@/components/Initiation';

const Page = () => {
  return (
    <div className="h-screen w-full bg-gradient-to-r from-[#303F48] to-[#6D7276] ">
      <div className="min-h-[100vh] w-full  bg-gradient-to-r from-[#303F48] to-[#6D7276]">
        <Initiation />
      </div>
    </div>
  );
};

export default Page;