'use client'; // Ensure this is a Client Component in Next.js

import { useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import Footer from './Footer';

export default function ComingSoon() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    try {
      const response = await axios.post('https://eeva-api.vercel.app/api/v1/newsletters/create', {
        email,
      });
      setMessage('Successfully subscribed! You will be notified when we go live.');
      setEmail(''); // Clear the input
    } catch (error) {
      setIsError(true);
      if (error.response?.status === 400) {
        setMessage('This email is already subscribed.');
      } else {
        setMessage('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div
        className="w-full h-[100vh] bg-cover bg-no-repeat flex items-center bg-center md:bg-top"
        style={{ backgroundImage: "url('/bgHome.svg')" }}
      >
        <div className="flex flex-col items-center justify-between w-full h-full py-6 md:py-12">
          {/* Logo superior */}
          <div className="w-full flex justify-center h-16 md:h-20">
            <Image
              src="/LogoFullEEVA.svg"
              width={262}
              height={31}
              alt="logoEEva"
              className="w-64 h-auto"
            />
          </div>

          {/* Sección central (Coming Soon) */}
          <div className="flex items-center w-full max-w-md px-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl">
            <div className="w-full flex flex-col text-[#F9F9F9] justify-around items-center space-y-6 md:space-y-8">
              <h3 className="text-xl md:text-3xl font-bold">COMING SOON</h3>
              <p className="text-lg md:text-2xl">07 | 03 | 25</p>
              <p className="text-sm md:text-base text-center">
                BE THE FIRST TO KNOW WHEN WE GO LIVE
              </p>
              <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-l-md rounded-r-md sm:rounded-r-none w-full sm:w-4/5 bg-white bg-opacity-20 text-white placeholder-gray-300 backdrop-blur-md px-4 text-sm md:text-base focus:outline-none border border-[#DFDFDF]"
                  placeholder="Enter your email address"
                  required
                />
                <button
                  type="submit"
                  className="h-12 w-full sm:w-1/5 bg-[#DFDFDF] rounded-r-md rounded-l-md sm:rounded-l-none text-black text-sm md:text-base"
                >
                  Notify me
                </button>
              </form>
              {message && (
                <p className={`text-sm md:text-base text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </div>
    </div>
  );
}