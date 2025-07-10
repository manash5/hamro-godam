"use client";
import React from 'react';
import Logo from '../Logo';
import { useRouter } from 'next/navigation'; 

const Navbar = ({ name }) => {
  const router = useRouter(); 

  const handleClick = () => {
    router.push(`/${name.toLowerCase()}`); 
  };

  return (
    <div className='bg-[#050b28e0] w-full px-10 h-20 flex items-center justify-between'>
      <div className="container mx-auto px-4 md:px-8 flex items-center">
        <Logo />
        <h1 className="text-xl font-bold text-primary-500 px-2">Hamro Godam</h1>
      </div>
      <button
        onClick={handleClick} 
        className="btn-primary bg-white px-8 py-3 rounded-md text-blue-950 hover:bg-primary-800 font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
      >
        {name}
      </button>
    </div>
  );
};

export default Navbar;