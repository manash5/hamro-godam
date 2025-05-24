"use client" 
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiPackage, FiSearch, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi'

function ProductManagement() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [200, -200])
  
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
      icon: <FiPackage size={24} />,
      title: "Product Tracking",
      description: "Track product details, quantities, locations, and movement history."
    },
    {
      icon: <FiSearch size={24} />,
      title: "Inventory Search",
      description: "Quickly find products with advanced search and filtering options."
    },
    {
      icon: <FiRefreshCw size={24} />,
      title: "Automatic Reordering",
      description: "Set up auto reordering when inventory falls below specified thresholds."
    },
    {
      icon: <FiAlertTriangle size={24} />,
      title: "Low Stock Alerts",
      description: "Get notifications when inventory levels are running low."
    }
  ]

  return (
    <section id="products" ref={containerRef} className="section-padding@apply  px-4 md:px-8 lg:px-16  bg-white dark:bg-[#020618] overflow-hidden py-16">
      <div className="container mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-[primary-800] dark:text-primary-300">Streamlined Product Management</h2>
          <p className="section-subheading mx-auto">
            Take control of your inventory with powerful product management tools
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, x: -50 }}
            animate={contentInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 p-3 bg-[#CCDCF5] text-[#0041A3] rounded-lg self-start">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div style={{ y }} className="relative">
            {/* Mockup of product management interface */}
            <div className="relative p-2 bg-white rounded-xl shadow-2xl dark:bg-gray-800 overflow-hidden">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Inventory Dashboard</h3>
                  <div className="bg-[#001029] text-white p-2 rounded-md text-sm font-medium">
                    428 Products
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Search bar mockup */}
                  <div className="bg-white dark:bg-gray-600 rounded-md p-2 flex items-center shadow-sm">
                    <FiSearch className="text-gray-400 mr-2" />
                    <span className="text-gray-400 text-sm">Search products...</span>
                  </div>
                  
                  {/* Product list mockup */}
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div 
                      key={index} 
                      className="bg-white dark:bg-gray-600 rounded-md p-3 flex justify-between items-center shadow-sm"
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-md ${['bg-[#99BAEB]', 'bg-[#FDA4AF]', 'bg-[#86EFAC]', 'bg-purple-100'][index]} flex items-center justify-center`}>
                          <span className={`text-xs font-bold ${['text-[#00317A]', 'text-[#BE123C]', 'text-[#15803D]', 'text-purple-600'][index]}`}>
                            {['P', 'S', 'M', 'E'][index]}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-sm">
                            {['Premium Widgets', 'Standard Parts', 'Metal Components', 'Electronics'][index]}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SKU: {['PW-100', 'SP-200', 'MC-300', 'EL-400'][index]}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">
                          {[124, 345, 67, 89][index]} units
                        </p>
                        <p className={`text-xs ${index === 2 ? 'text-red-500' : 'text-green-500'}`}>
                          {index === 2 ? 'Low Stock' : 'In Stock'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Small floating cards */}
            <motion.div 
              className="absolute -top-6 -right-6 bg-[#E11D48] text-white p-4 rounded-lg shadow-lg z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
            >
              <p className="text-sm font-bold">Low Stock Alert</p>
              <p className="text-xs">3 products below threshold</p>
            </motion.div>
            
            <motion.div 
              className="absolute -bottom-4 -left-4 bg-[#16A34A] text-white p-4 rounded-lg shadow-lg z-10"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, delay: 1, repeat: Infinity, repeatType: "mirror" }}
            >
              <p className="text-sm font-bold">Auto-Reorder</p>
              <p className="text-xs">2 orders placed today</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ProductManagement