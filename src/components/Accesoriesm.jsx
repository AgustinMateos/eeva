
'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Footer from './Footer';

const cardData1 = [
    { id: 1, title: 'Native Iron Tunk', image: '/NativeIronTunk.svg' },
    { id: 2, title: 'Century Dashe', image: '/CenturyDashe.svg' },
    { id: 3, title: 'Native Dark Jean', image: '/NativeDarkJean.svg' },
    { id: 4, title: 'Paola Wood Shirt', image: '/PaolaWoodShirt.svg' },
    { id: 5, title: 'Native Iron Tunk', image: '/NativeIronTunk2.svg' },
    { id: 6, title: 'Century Dashe', image: '/CenturyDashe2.svg' },
    { id: 7, title: 'Native Dark Jean', image: '/NativeDarkJean2.svg' },
    { id: 8, title: 'Paola Wood Shirt', image: '/PaolaWoodShirt2.svg' },
];

const cardData2 = [...cardData1];



export default function Accesoriesm() {


    return (
        <div className="min-h-[100vh] w-full flex flex-col justify-center items-center pt-[150px]">

            <p className="text-white text-lg w-full max-w-[75rem] border-b border-[#AEAEAE] uppercase">
                ACCESORIES - MEN
            </p>



            <div className="w-full max-w-[90%] mx-auto mt-[60px]">
                {/* Primer grid de cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {cardData1.map((card) => (
                        <Link
                            key={card.id}
                            href={`/products/${card.id}`}
                            className="group w-full max-w-[289px] mx-auto h-auto relative flex flex-col"
                        >
                            <Image
                                src={card.image}
                                alt={card.title}
                                width={289}
                                height={415}
                                className="object-cover w-full h-auto"
                            />
                            <div className="absolute inset-0 flex justify-center items-center bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none">
                                    SEE PRODUCT
                                </span>
                            </div>
                            <h3 className="text-[#FFFFFF] text-center mt-2">{card.title}</h3>
                        </Link>
                    ))}
                </div>



                {/* Tercer grid de cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                    {cardData2.map((card) => (
                        <Link
                            key={card.id}
                            href={`/products/${card.id}`}
                            className="group w-full max-w-[289px] mx-auto h-auto relative flex flex-col"
                        >
                            <Image
                                src={card.image}
                                alt={card.title}
                                width={289}
                                height={415}
                                className="object-cover w-full h-auto"
                            />
                            <div className="absolute inset-0 flex justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-sm backdrop-blur-[6px] pl-[20px] pr-[20px] flex justify-center items-center h-[36px] text-center rounded-[2px] border-[0.5px] bg-[#A8A8A81A] focus:outline-none">
                                    SEE PRODUCT
                                </span>
                            </div>
                            <h3 className="text-[#FFFFFF] text-center mt-2">{card.title}</h3>
                        </Link>
                    ))}
                </div>
            </div>



            <div className="h-[315px] flex min-w-[1315px]">
                <Footer />
            </div>
        </div>
    );
};

