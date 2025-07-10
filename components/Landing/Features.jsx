import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiBox, FiUsers, FiBarChart2, FiShield } from 'react-icons/fi'

function FeatureCard({ icon, title, description, index }) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  const variants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.2
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
    >
      <div className="flex flex-col items-start">
        <div className="mb-6 p-4 bg-[#E6F1FF] text-[#0041A3] rounded-2xl">
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-800">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

function Features() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const features = [
    {
      icon: <FiBox size={32} />,
      title: "Product Management",
      description: "Track inventory levels, set reorder points, and manage product information in real-time."
    },
    {
      icon: <FiUsers size={32} />,
      title: "Employee Management",
      description: "Assign roles, track performance, and manage your warehouse staff efficiently."
    },
    {
      icon: <FiBarChart2 size={32} />,
      title: "Analytics Dashboard",
      description: "Gain insights with powerful analytics about your inventory, sales, and staff performance."
    },
    {
      icon: <FiShield size={32} />,
      title: "Secure Access",
      description: "Role-based permissions ensure your data is only accessible to authorized personnel."
    }
  ]

  return (
    <section id="features" className="py-24  bg-gradient-to-b from-white to-[#f9fafb]">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[#002052]">Powerful Features</h2>
          <p className="text-xl text-[#002052] max-w-3xl mx-auto">
            Everything you need to manage your inventory and staff in one integrated platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features