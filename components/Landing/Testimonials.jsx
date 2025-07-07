"use client" 
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiStar } from 'react-icons/fi'

function TestimonialCard({ name, position, company, content, rating, image, index }) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white  p-6 rounded-xl shadow-lg"
    >
      <div className="flex space-x-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <FiStar 
            key={i} 
            size={18} 
            className={i < rating ? "text-yellow-400 fill-current" : "text-gray-300"} 
          />
        ))}
      </div>
      
      <p className="text-gray-600 dark:text-black mb-6">{content}</p>
      
      <div className="flex items-center">
        <div 
          className="w-12 h-12 rounded-full mr-4 bg-gray-200"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div>
          <h4 className="font-bold text-blue-900">{name}</h4>
          <p className="text-sm text-gray-500 ">{position}, {company}</p>
        </div>
      </div>
    </motion.div>
  )
}

function Testimonials() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  
  const [titleRef, titleInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const testimonials = [
    {
      name: "Rohan Thapa",
      position: "Operations Manager",
      company: "Kathmandu Foods",
      content: "Hamro Godam transformed our warehouse operations. We've cut inventory management time by 45% and eliminated manual errors completely.",
      rating: 5,
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100"
    },
    {
      name: "Maya Shrestha",
      position: "CEO",
      company: "Everest Suppliers",
      content: "The employee management system is a game-changer. Our staff coordination has improved dramatically and training new employees is now much easier.",
      rating: 5,
      image: "https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100"
    },
    {
      name: "Anish KC",
      position: "Logistics Director",
      company: "Mountain Traders",
      content: "The analytics dashboard gives us insights we never had before. We can now forecast inventory needs with surprising accuracy.",
      rating: 4,
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=100"
    }
  ]

  return (
    <section id="testimonials" ref={containerRef} className="section-padding @apply py-24 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-primary-800 to-primary-900 overflow-hidden bg-blue-50">
      <div className="container mx-auto px-10">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 20 }}
          animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-blue-800">What Our Clients Say</h2>
          <p className="section-subheading text-slate-700 mx-auto">
            Trusted by businesses across Nepal to streamline their inventory operations
          </p>
        </motion.div>

        <motion.div style={{ y }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              position={testimonial.position}
              company={testimonial.company}
              content={testimonial.content}
              rating={testimonial.rating}
              image={testimonial.image}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials