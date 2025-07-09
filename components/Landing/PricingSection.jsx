import { Check } from "lucide-react";
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'


const PricingSection = () => {
  const plans = [
    {
      title: "Starter",
      price: 49,
      features: [
        "Up to 1,000 stock items",
        "Basic analytics",
        "2 user accounts",
        "Email support"
      ],
      popular: false
    },
    {
      title: "Business",
      price: 99,
      features: [
        "Up to 10,000 stock items",
        "Advanced analytics",
        "10 user accounts",
        "Priority support",
        "API access"
      ],
      popular: true
    },
    {
      title: "Enterprise",
      price: 199,
      features: [
        "Unlimited stock items",
        "Custom analytics",
        "Unlimited users",
        "24/7 dedicated support",
        "Advanced integrations",
        "Custom features"
      ],
      popular: false
    }
  ];

  const PricingCard = ({ title, price, features, popular, index }) => {
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
        className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${popular ? 'border-2 border-[#002052] scale-105' : 'border border-gray-200'}`}
      >
        {popular && (
          <div className="bg-[#0052CC] text-white py-2 text-center font-medium">
            Most Popular
          </div>
        )}
        <div className="p-8">
          <h3 className="text-2xl font-bold text-blue-900 mb-4">{title}</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold text-blue-900">${price}</span>
            <span className="text-gray-500">/month</span>
          </div>
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check size={18} className="text-green-500 mr-2" />
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
          <button className={`w-full py-3 rounded-lg font-medium ${popular ? 'bg-[#0052CC] hover:bg-[#002052] text-white' : 'bg-[#E6F1FF] hover:bg-[#CCDCF5] text-blue-600'}`}>
            Get Started
          </button>
        </div>
      </motion.div>
    );
  };

  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })
  
  return (
    <div className="py-20 section-padding bg-gradient-to-b from-[#001029] to-[#021b45]  overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Simple, Transparent Pricing
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PricingCard key={index} {...plan} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;