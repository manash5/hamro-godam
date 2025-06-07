"use client";
import React from 'react';
import Logo from '../Logo'; 

const Navbar = () => {
  return (
    <div className='bg-[#050b28e0] w-full px-10 h-20 flex items-center justify-between'>
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <Logo />
        <h1 className="text-xl font-bold text-primary-500">Hamro Godam</h1>
      </div>
      <a href="#contact" className="btn-primary bg-white px-8 py-3 rounded-md text-blue-950 hover:bg-primary-800 font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
            Register
          </a>
    </div>
  );
};

export default Navbar;