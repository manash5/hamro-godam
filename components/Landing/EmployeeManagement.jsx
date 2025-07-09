"use client" 

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiUserPlus, FiClock, FiClipboard, FiAward } from 'react-icons/fi'

function EmployeeCard({ name, position, performance, image, index }) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  const cardColors = [
    'bg-gradient-to-br from-[#002052] via-[#0041A3] to-[#1e40af]',
    'bg-gradient-to-br from-[#7c3aed] via-[#a855f7] to-[#c084fc]',
    'bg-gradient-to-br from-[#059669] via-[#10b981] to-[#34d399]',
    'bg-gradient-to-br from-[#dc2626] via-[#ef4444] to-[#f87171]'
  ]
  
  const performanceBars = [
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-emerald-500 to-emerald-600',
    'bg-gradient-to-r from-rose-500 to-rose-600'
  ]

  return (
    <motion.div 
      ref={ref}
      className="bg-white  rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className={`h-20 ${cardColors[index % cardColors.length]}`}></div>
      <div className="p-6 pt-0 relative bg-white">
        <div className="w-16 h-16 rounded-full bg-white p-1 absolute -top-20 left-6 shadow-lg">
          <div 
            className="w-full h-full rounded-full ring-2 ring-white ring-opacity-50"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
        </div>
        
        <div className="mt-10">
          <h3 className="font-bold text-lg bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">{name}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{position}</p>
          
          <div className="mt-4 flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
              <div 
                className={`${performanceBars[index % performanceBars.length]} h-2.5 rounded-full shadow-sm transition-all duration-700 ease-out`}
                style={{ width: `${performance}%` }}
              ></div>
            </div>
            <span className="ml-3 text-sm font-bold bg-gradient-to-r from-slate-700 to-slate-600 bg-clip-text text-transparent">{performance}%</span>
          </div>
          
          <p className="mt-2 text-xs text-gray-500 font-medium">Performance Rating</p>
        </div>
      </div>
    </motion.div>
  )
}

function EmployeeManagement() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50])
  
  const [titleRef, titleInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const [contentRef, contentInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const features = [
    {
      icon: <FiUserPlus size={24} />,
      title: "Role Management",
      description: "Assign specific roles and permissions to each staff member.",
      bgColor: "bg-gradient-to-r from-blue-100 to-indigo-100",
      iconColor: "text-blue-600"
    },
    {
      icon: <FiClock size={24} />,
      title: "Time Tracking",
      description: "Monitor attendance and working hours automatically.",
      bgColor: "bg-gradient-to-r from-purple-100 to-violet-100",
      iconColor: "text-purple-600"
    },
    {
      icon: <FiClipboard size={24} />,
      title: "Task Assignment",
      description: "Assign tasks and track their completion status.",
      bgColor: "bg-gradient-to-r from-emerald-100 to-teal-100",
      iconColor: "text-emerald-600"
    },
    {
      icon: <FiAward size={24} />,
      title: "Performance Metrics",
      description: "Evaluate employee performance with customizable metrics.",
      bgColor: "bg-gradient-to-r from-rose-100 to-pink-100",
      iconColor: "text-rose-600"
    }
  ]

  const employees = [
    {
      name: "Arun Sharma",
      position: "Warehouse Manager",
      performance: 92,
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100"
    },
    {
      name: "Priya Patel",
      position: "Inventory Specialist",
      performance: 88,
      image: "https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100"
    },
    {
      name: "Bikash Rai",
      position: "Logistics Coordinator",
      performance: 78,
      image: "https://images.pexels.com/photos/2380794/pexels-photo-2380794.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100"
    },
    {
      name: "Sunita Gurung",
      position: "Quality Controller",
      performance: 95,
      image: "https://images.pexels.com/photos/3726314/pexels-photo-3726314.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100"
    }
  ]

  return (
    <section id="employees" ref={containerRef} className="section-padding @apply py-24 px-4 md:px-8 lg:px-16; bg-slate-50 overflow-hidden">
      <div className="container mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight bg-gradient-to-r from-[#001029] to-[#0041A3] bg-clip-text text-transparent font-extrabold">Employee Management</h2>
          <p className="section-subheading mx-auto bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent font-semibold">
            Empower your team with tools designed for collaboration and efficiency
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <motion.div
            ref={contentRef}
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 50 }}
            animate={contentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex group cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`mr-4 p-3 ${feature.bgColor} ${feature.iconColor} rounded-xl self-start shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110 `}>
                    {feature.icon}
                  </div>
                  <div className="group-hover:translate-x-1 transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">{feature.title}</h3>
                    <p className="text-slate-700 dark:text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
              
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8"
              >
                <a href="#contact" className="btn-primary inline-block border-0 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 px-10 py-3 rounded-lg hover:from-blue-800 hover:via-blue-700 hover:to-indigo-800 text-white font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-lg hover:shadow-xl">
                  Start Managing Your Team
                </a>
              </motion.div>
            </div>
          </motion.div>

          <motion.div style={{ y }} className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {employees.map((employee, index) => (
              <EmployeeCard
                key={index}
                name={employee.name}
                position={employee.position}
                performance={employee.performance}
                image={employee.image}
                index={index}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default EmployeeManagement