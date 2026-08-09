import React from 'react';
import { motion } from 'framer-motion';
import { certifications } from '../data/config';
import type { Certification } from '../types';

/**
 * Certifications section.
 *
 * Wrapper, container and header block are taken verbatim from Skills, with two
 * deliberate departures documented in the plan:
 *   - `bg-primary` rather than Skills' `bg-secondary/30`, so this section contrasts with
 *     Skills above instead of merging into it.
 *   - the Projects grid shape rather than Skills' 5-column one, because credential cards
 *     carry a long name, an issuer and a year.
 *
 * `tier` is deliberately not rendered: both expert credentials already say "Expert" in
 * their own names, so a visual emphasis would restate what the visitor is reading — and
 * one of them is also in progress, so the two cues would contradict each other.
 *
 * Every class here already exists elsewhere in components/. Nothing new was introduced.
 */

// Two full literals rather than composed fragments, so both stay greppable.
//
// `block` on the linked card is load-bearing, not cosmetic: an anchor is display:inline by
// default, and block-level children fragment an inline box — the border and background
// render around the near-empty inline content while the text lays out outside it. That is
// what collapsed the five linked cards into slivers.
//
// `h-full` on both keeps a linked and a non-linked card occupying identical box space. It
// resolves against the grid item, which stretches to row height by default.
const CARD_LINKED =
  'block h-full bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-accent/50 transition-all group';
const CARD_PLAIN = 'h-full bg-slate-900 border border-slate-800 p-6 rounded-xl transition-all';

const CardBody: React.FC<{ cert: Certification }> = ({ cert }) => (
  <>
    <h4 className="text-slate-200 font-medium font-display mb-2">{cert.name}</h4>
    {/* Separator only when there is a year to separate. A credential with no meaningful
        date — CKA, whose exam is unscheduled — carries the chip instead, and the issuer
        must stand alone rather than trailing a dot into nothing. */}
    <p className="text-slate-400 text-sm font-light">
      {cert.year ? `${cert.issuer} · ${cert.year}` : cert.issuer}
    </p>

    {/* Marks the minority. Completed cards show nothing here — their affordance is that
        they are links. Neutral rather than accent: an accent chip on an unfinished
        credential would read as more important than the finished ones. */}
    {cert.status === 'in-progress' && (
      <div className="mt-4">
        <span className="text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          In progress
        </span>
      </div>
    )}
  </>
);

const Certifications: React.FC = () => {
  return (
    <section id="certifications" className="py-24 bg-primary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-accent font-mono text-xl mb-2">Certifications</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white font-display">Verified Expertise</h3>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Cloud and Kubernetes credentials, including two currently in progress.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Array order, deliberately — no sorting by status, tier or year. */}
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {/* Keys off the link's presence, not off status. They partition the data
                  identically today, but they are independent rules. A credential without
                  a link renders as plain content — no anchor, no hover affordance. */}
              {cert.credentialUrl ? (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={CARD_LINKED}
                >
                  <CardBody cert={cert} />
                </a>
              ) : (
                <div className={CARD_PLAIN}>
                  <CardBody cert={cert} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
