import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { config } from '../data/config';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-primary/80 backdrop-blur-md border-white/5 py-4' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#" className="group">
           <span className="text-xl md:text-2xl font-bold text-white font-display tracking-tight hover:text-accent transition-colors">
            Hassan El Bahnasy
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {config.navItems.map((item, index) => (
            <a 
              key={index} 
              href={item.href}
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors relative group font-sans"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
          <a 
            href="/resume.pdf" 
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent text-accent rounded-lg transition-all duration-300 text-sm font-medium"
          >
            Resume
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-gray-300 hover:text-accent transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 w-full bg-[#030712]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl md:hidden flex flex-col py-8 px-6"
            >
               {config.navItems.map((item, index) => (
                <a 
                  key={index} 
                  href={item.href}
                  className="block py-4 text-lg text-gray-300 hover:text-accent font-display border-b border-white/5 last:border-0"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
               <a 
                  href="/resume.pdf" 
                  className="mt-6 text-center py-3 bg-accent/10 border border-accent/20 text-accent rounded-lg font-medium"
                >
                  Resume
                </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;