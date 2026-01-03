import React from 'react';
import { motion } from 'framer-motion';
import { config } from '../data/config';
import { Briefcase } from 'lucide-react';

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 bg-primary relative">
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
            <h2 className="text-accent font-mono text-xl">My Journey</h2>
          </div>
          <h3 className="text-3xl md:text-5xl font-bold text-white font-display">Work Experience</h3>
        </motion.div>

        <div className="relative border-l border-slate-800 ml-4 md:ml-6 space-y-12">
          {config.experience.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-900 border-2 border-accent shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h4 className="text-2xl font-bold text-white flex items-center gap-2 font-display">
                    {exp.role}
                  </h4>
                  <h5 className="text-lg text-accent font-medium mt-1">{exp.company}</h5>
                </div>
                <span className="text-sm font-mono text-slate-400 bg-slate-800/50 border border-slate-800 px-3 py-1 rounded mt-2 sm:mt-0 w-fit">
                  {exp.period}
                </span>
              </div>
              
              <ul className="space-y-2 text-slate-300">
                {exp.description.map((desc, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 min-w-[6px] h-[6px] rounded-full bg-slate-700"></span>
                    <span className="leading-relaxed font-light">{desc}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;