import React from 'react';
import { motion } from 'framer-motion';
import { config } from '../data/config';
import { User, Server, ShieldCheck } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-secondary/30 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-2">
            <span className="h-0.5 w-12 bg-accent"></span>
            <h2 className="text-accent font-mono text-xl">About Me</h2>
          </div>
          <h3 className="text-3xl md:text-5xl font-bold text-white font-display">Who am I?</h3>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg text-slate-300 leading-relaxed mb-6 font-light">
              {config.about.intro}
            </p>
            <p className="text-slate-400 leading-relaxed mb-8">
              {config.about.bio}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-900/50 rounded-xl border border-slate-800 flex items-start gap-3 hover:border-slate-700 transition-colors">
                <Server className="text-accent w-6 h-6 mt-1" />
                <div>
                  <h4 className="text-white font-semibold font-display">Cloud Native</h4>
                  <p className="text-sm text-slate-400 mt-1">AWS & Azure architectures</p>
                </div>
              </div>
              <div className="p-5 bg-slate-900/50 rounded-xl border border-slate-800 flex items-start gap-3 hover:border-slate-700 transition-colors">
                <ShieldCheck className="text-accent w-6 h-6 mt-1" />
                <div>
                  <h4 className="text-white font-semibold font-display">DevSecOps</h4>
                  <p className="text-sm text-slate-400 mt-1">Security-first automation</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full -z-10"></div>
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <User size={120} />
               </div>
               <h4 className="text-2xl font-bold text-white mb-2 font-display">Hassan El Bahnasy</h4>
               <p className="text-accent mb-6 font-mono">DevOps Engineer</p>
               <ul className="space-y-3 text-slate-300">
                 <li className="flex items-center gap-3">
                   <span className="w-2 h-2 bg-accent rounded-full"></span>
                   Based in Cairo, Egypt
                 </li>
                 <li className="flex items-center gap-3">
                   <span className="w-2 h-2 bg-accent rounded-full"></span>
                   Ain Shams University Graduate
                 </li>
                 <li className="flex items-center gap-3">
                   <span className="w-2 h-2 bg-accent rounded-full"></span>
                   Azure Fundamentals Certified
                 </li>
                 <li className="flex items-center gap-3">
                   <span className="w-2 h-2 bg-accent rounded-full"></span>
                   NTI DevSecOps Graduate
                 </li>
               </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;