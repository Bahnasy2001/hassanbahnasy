import React from 'react';
import { motion } from 'framer-motion';
import { config } from '../data/config';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-primary to-[#050914] text-center relative overflow-hidden">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-accent/5 blur-[100px] -z-10 pointer-events-none" />
      
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-accent font-mono text-xl mb-4">What's Next?</h2>
          <h3 className="text-4xl md:text-6xl font-bold text-white mb-6 font-display">Get In Touch</h3>
          <p className="text-slate-400 text-lg mb-10 leading-relaxed font-light">
            I'm currently looking for new opportunities to contribute my skills in DevOps and Cloud Engineering. 
            Whether you have a question or just want to say hi, my inbox is always open!
          </p>
          
          <div className="flex justify-center gap-8 mb-12">
            {config.socials.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="p-5 bg-secondary rounded-full text-slate-300 hover:text-white hover:bg-accent hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all duration-300 transform hover:-translate-y-2 border border-white/5 hover:border-accent group"
                aria-label={social.platform}
              >
                <social.icon className="w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-110" />
              </a>
            ))}
          </div>

          <a 
            href={`mailto:${config.email}`}
            className="inline-block px-10 py-4 bg-transparent border border-accent text-accent rounded-lg hover:bg-accent/10 transition-all duration-300 font-bold font-display hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          >
            Say Hello
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;