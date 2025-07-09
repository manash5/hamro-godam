import { motion } from 'framer-motion'
import Logo from '../Logo'
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiInstagram, FiFacebook, FiLinkedin } from 'react-icons/fi'

function Footer() {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    { icon: <FiFacebook size={20} />, href: "#", label: "Facebook" },
    { icon: <FiTwitter size={20} />, href: "#", label: "Twitter" },
    { icon: <FiInstagram size={20} />, href: "#", label: "Instagram" },
    { icon: <FiLinkedin size={20} />, href: "#", label: "LinkedIn" }
  ]
  
  const footerLinks = [
    {
      title: "Company",
      links: [
        { text: "About Us", href: "#" },
        { text: "Careers", href: "#" },
        { text: "Our Team", href: "#" },
        { text: "Locations", href: "#" }
      ]
    },
    {
      title: "Products",
      links: [
        { text: "Inventory System", href: "#" },
        { text: "Employee Management", href: "#" },
        { text: "Analytics Dashboard", href: "#" },
        { text: "API Access", href: "#" }
      ]
    },
    {
      title: "Resources",
      links: [
        { text: "Documentation", href: "#" },
        { text: "Tutorials", href: "#" },
        { text: "Blog", href: "#" },
        { text: "Support Center", href: "#" }
      ]
    }
  ]

  return (
    <footer className="bg-primary-900 text-white pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-6 text-gray-300 max-w-xs">
              Simplifying inventory management for businesses across Nepal since 2020.
            </p>
            
            <div className="mt-8">
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <FiMail className="mr-3 text-primary-300" />
                  <span className="text-gray-300">info@hamrogodam.com</span>
                </div>
                <div className="flex items-center">
                  <FiPhone className="mr-3 text-primary-300" />
                  <span className="text-gray-300">+977 1 4123456</span>
                </div>
                <div className="flex items-start">
                  <FiMapPin className="mr-3 mt-1 text-primary-300" />
                  <span className="text-gray-300">Thamel, Kathmandu<br />Nepal</span>
                </div>
              </div>
            </div>
          </div>
          
          {footerLinks.map((column, i) => (
            <div key={i} className="lg:col-span-1">
              <h4 className="text-lg font-bold mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <a href={link.href} className="text-gray-300 hover:text-white transition-colors duration-300">
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div className="lg:col-span-1">
            <h4 className="text-lg font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  className="bg-primary-800 hover:bg-primary-700 p-2 rounded-full transition-colors duration-300"
                  whileHover={{ y: -3 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            
            
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Hamro Godam. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer