import React from 'react';
import { motion } from 'framer-motion';
import { config } from '../data/config';

const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-accent font-mono text-xl mb-2">Technologies</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white font-display">Technical Arsenal</h3>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Tools and technologies I use to build secure and scalable infrastructure.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {config.skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-accent/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all group text-center flex flex-col items-center justify-center gap-4"
            >
              <div className="p-4 bg-slate-800 rounded-full group-hover:bg-accent/10 transition-colors">
                <skill.icon className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-slate-200 font-medium font-display">{skill.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;