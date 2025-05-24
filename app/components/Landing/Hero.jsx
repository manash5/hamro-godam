"use client" 
import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import ThreeScene from '../3d/Scene'

function Hero() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Text animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
      {/* Background grid effect */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="container mx-auto px-4 md:px-8 relative z-10 pt-18">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left: Text and Buttons */}
          <motion.div 
            className="max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-gray-100 drop-shadow-lg"
              variants={itemVariants}
            >
              <span>Streamline Your</span>
              <br />
              <span className="bg-gradient-to-r from-white to-[#E6F1FF] bg-clip-text text-transparent">Inventory Management</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-md"
              variants={itemVariants}
            >
              Hamro Godam simplifies inventory tracking, employee management, and business operations, all in one powerful platform.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <a href="#contact" className="btn-primary border-0 bg-blue-900 px-10 py-3 rounded-md hover:bg-primary-800 text-white font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                Get Started
              </a>
              <a href="#features" className="btn-secondary bg-white px-10 py-3 rounded-md text-blue-950 hover:bg-primary-800 font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                Explore Features
              </a>
            </motion.div>
          </motion.div>
          
          {/* Right: 3D Box */}
        <motion.div 
          className="hidden lg:flex justify-center items-center h-[500px] relative"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {isMounted && (
            <Suspense fallback={null}>
              <div className="w-[600px] h-[500px]">
                <ThreeScene />
              </div>
            </Suspense>
          )}
        </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <p className="text-gray-300 mb-2">Scroll to explore</p>
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-gray-300 flex justify-center p-1"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div className="w-1 h-2 bg-gray-300 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero