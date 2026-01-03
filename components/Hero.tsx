import React from 'react';
import { motion, Variants } from 'framer-motion';
import { config } from '../data/config';

const Hero: React.FC = () => {
  // Variant for sentence/word container
  const sentence: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.08,
      },
    },
  };

  // Variant for individual letters - More dramatic entrance
  const letter: Variants = {
    hidden: { opacity: 0, y: 100, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
         type: "spring",
         damping: 12,
         stiffness: 150
      }
    },
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20 bg-primary">
      {/* Background glow effects - Deep and Rich */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/10 blur-[130px] -z-10 rounded-full mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/5 blur-[120px] -z-10 rounded-full" />

      <div className="container mx-auto px-6 z-10">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-950/30 border border-blue-900/50 backdrop-blur-md hover:border-accent/30 transition-colors cursor-default">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
              </span>
              <span className="text-accent text-sm font-semibold tracking-wide uppercase">Available for new projects</span>
            </div>
          </motion.div>

          {/* Animated Name with Hover Effects */}
          <motion.div
            variants={sentence}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-bold text-white tracking-tighter font-display leading-[1.1] flex flex-wrap justify-center gap-x-4 md:gap-x-6 cursor-default">
              {config.name.split(" ").map((word, wordIndex) => (
                <div key={wordIndex} className="flex">
                  {word.split("").map((char, charIndex) => (
                    <motion.span 
                      key={wordIndex + "-" + charIndex} 
                      variants={letter}
                      whileHover={{ 
                        scale: 1.15, 
                        y: -15, 
                        color: "#3B82F6", // Accent color on hover
                        transition: { type: "spring", stiffness: 300 } 
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              ))}
            </h1>
          </motion.div>

          {/* Role Title with Gradient and Glow */}
          <motion.div
             initial={{ opacity: 0, scale: 0.9, y: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 1.2, type: "spring" }}
             className="relative inline-block mb-10"
          >
            {/* Glow effect behind text */}
            <div className="absolute -inset-4 bg-accent/20 blur-xl rounded-full opacity-50"></div>
            <h2 className="relative text-3xl md:text-5xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-blue-500 drop-shadow-sm">
              {config.title}
            </h2>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.6 }}
            className="text-lg md:text-2xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-light"
          >
            {config.tagline}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <a 
              href="#projects" 
              className="w-full sm:w-auto px-10 py-5 bg-accent text-white text-lg rounded-xl hover:bg-accentHover transition-all duration-300 font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)] font-display hover:-translate-y-1"
            >
              View Projects
            </a>
            <a 
              href="#contact" 
              className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white text-lg rounded-xl hover:border-accent hover:bg-accent/5 transition-all duration-300 font-medium font-sans backdrop-blur-sm hover:-translate-y-1"
            >
              Contact Me
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;