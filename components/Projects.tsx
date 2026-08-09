import React from 'react';
import { motion } from 'framer-motion';
import { config } from '../data/config';
import { Folder, ExternalLink, Github } from 'lucide-react';
import type { Project } from '../types';

/**
 * Two display tiers for the same card.
 *
 * `secondary` borrows its density from the Skills section — p-6, gap-6, w-8 h-8,
 * text-slate-200 — so labs read as lighter without introducing a new visual language.
 * Every class here already appears elsewhere in the codebase.
 *
 * Class strings are written out in full rather than composed from fragments, so they
 * stay greppable and so the Tailwind CDN always sees complete class names.
 */
const TIERS = {
  primary: {
    grid: 'grid md:grid-cols-2 lg:grid-cols-3 gap-8',
    card: 'bg-secondary/40 rounded-xl p-8 border border-slate-800 hover:border-accent/40 transition-all duration-300 group flex flex-col',
    icon: 'w-10 h-10 text-accent',
    title: 'text-xl font-bold text-white mb-4 group-hover:text-accent transition-colors font-display',
    body: 'text-slate-400 leading-relaxed mb-6 flex-grow font-light',
  },
  secondary: {
    grid: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6',
    card: 'bg-secondary/40 rounded-xl p-6 border border-slate-800 hover:border-accent/40 transition-all duration-300 group flex flex-col',
    icon: 'w-8 h-8 text-accent',
    title: 'text-lg font-bold text-slate-200 mb-4 group-hover:text-accent transition-colors font-display',
    body: 'text-sm text-slate-400 leading-relaxed mb-6 flex-grow font-light',
  },
} as const;

type Tier = keyof typeof TIERS;

const ProjectCard: React.FC<{ project: Project; index: number; tier: Tier }> = ({
  project,
  index,
  tier,
}) => {
  const styles = TIERS[tier];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className={styles.card}
    >
      <div className="flex justify-between items-start mb-6">
        <Folder className={styles.icon} />
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

      <h5 className={styles.title}>
        {project.title}
      </h5>

      {/*
        Lab count, secondary tier only. The explicit `> 0` test matters: `labCount &&`
        would render a bare "0" for a zero count, and gating on tier keeps the count off
        project cards even if one ever acquired the field.
      */}
      {tier === 'secondary' && typeof project.labCount === 'number' && project.labCount > 0 ? (
        <p className="text-xs font-mono text-accent mb-4">
          {project.labCount} hands-on labs
        </p>
      ) : null}

      <p className={styles.body}>
        {project.summary}
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
  );
};

/**
 * A labelled group of cards. Renders nothing at all when the group is empty, so an
 * orphaned sub-heading can never sit above empty space.
 */
const ProjectGroup: React.FC<{ heading: string; items: Project[]; tier: Tier }> = ({
  heading,
  items,
  tier,
}) => {
  if (items.length === 0) return null;

  return (
    <div>
      <h4 className="text-2xl font-bold text-white font-display mb-8">{heading}</h4>
      <div className={TIERS[tier].grid}>
        {items.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} tier={tier} />
        ))}
      </div>
    </div>
  );
};

const Projects: React.FC = () => {
  // Derived, not mutated — content order is preserved within each group.
  const featured = config.projects.filter((p) => p.kind === 'project');
  const labs = config.projects.filter((p) => p.kind === 'lab');

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
          <h3 className="text-3xl md:text-5xl font-bold text-white font-display">Projects</h3>
        </motion.div>

        <div className="space-y-12">
          <ProjectGroup heading="Featured Projects" items={featured} tier="primary" />
          <ProjectGroup heading="Labs & Practice" items={labs} tier="secondary" />
        </div>
      </div>
    </section>
  );
};

export default Projects;