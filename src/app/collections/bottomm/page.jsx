'use client'; 

import React from 'react';

import BottomMens from '@/components/BottomMens';

const Page = () => {
  return (
    <div className="h-screen w-full  ">
      <div className="min-h-[80vh] w-full bg-gradient-to-r from-[#303F48] to-[#6D7276]">
        <BottomMens />
      </div>
    </div>
  );
};

export default Page;