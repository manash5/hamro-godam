import { motion } from 'framer-motion'

function Logo() {
  return (
    <motion.div 
      className="flex items-center space-x-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-5 h-5 text-white"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 360 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "loop", repeatDelay: 5 }}
        >
          <rect width="16" height="16" x="4" y="4" rx="2" />
          <path d="M9 9h6v6H9z" />
          <path d="M15 4v2" />
          <path d="M9 4v2" />
          <path d="M15 18v2" />
          <path d="M9 18v2" />
          <path d="M20 9h-2" />
          <path d="M20 15h-2" />
          <path d="M4 9h2" />
          <path d="M4 15h2" />
        </motion.svg>
      </div>
      <h1 className="text-xl font-bold text-primary-500">Hamro Godam</h1>
    </motion.div>
  )
}

export default Logo