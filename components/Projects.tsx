import React from 'react';
import { motion } from 'framer-motion';
import { config } from '../data/config';
import { Folder, ExternalLink, Github } from 'lucide-react';

const Projects: React.FC = () => {
  return (
    <section id="projects" className="py-24 bg-primary">
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
            <h2 className="text-accent font-mono text-xl">Portfolio</h2>
          </div>
          <h3 className="text-3xl md:text-5xl font-bold text-white font-display">Featured Projects</h3>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {config.projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-secondary/40 rounded-xl p-8 border border-slate-800 hover:border-accent/40 transition-all duration-300 group flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <Folder className="w-10 h-10 text-accent" />
                <div className="flex gap-3">
                  {project.repoUrl && (
                    <a 
                      href={project.repoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-slate-400 hover:text-white transition-colors p-1 bg-white/5 rounded-md hover:bg-accent/20"
                      title="View Code"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-slate-400 hover:text-accent transition-colors p-1 bg-white/5 rounded-md hover:bg-accent/20"
                      title="Live Demo"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors font-display">
                {project.title}
              </h4>
              
              <p className="text-slate-400 leading-relaxed mb-6 flex-grow font-light">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="text-xs font-mono text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;