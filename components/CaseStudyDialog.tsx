import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Project } from '../types';

/**
 * Case-study dialog.
 *
 * `project` doubles as the open state: null means closed. A single nullable value
 * cannot disagree with itself, so stale content can never flash when reopening for a
 * different item.
 *
 * Rendered through a portal to document.body — this is required, not stylistic. Cards
 * are motion.div elements with whileHover, and that transform creates a stacking
 * context and containing block. Nested inside one, this dialog's `fixed inset-0` would
 * cover only the card and `z-50` would not lift it above the fixed navbar.
 *
 * Every class here already exists elsewhere in components/, except `max-h-full` and
 * `overflow-y-auto` — two behavioural utilities approved specifically so a long case
 * study stays reachable on a phone.
 */
interface CaseStudyDialogProps {
  project: Project | null;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const CaseStudyDialog: React.FC<CaseStudyDialogProps> = ({ project, onClose }) => {
  const isOpen = project !== null;
  const panelRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocused = React.useRef<HTMLElement | null>(null);

  // Held in a ref so the effects below depend only on `isOpen`. A caller passing an
  // inline arrow would otherwise produce a new `onClose` every render, re-running the
  // effect, re-binding the listener, and yanking focus back to the first element.
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Escape to close, plus a focus trap. Bound on open and torn down on close, so no
  // listener is ever live while closed and none can stack across reopens.
  React.useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const focusables = (): HTMLElement[] =>
      panelRef.current ? Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];

    (focusables()[0] ?? panelRef.current)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [isOpen]);

  // Body scroll lock. The cleanup also runs on unmount — a leaked lock would leave the
  // whole page permanently unscrollable, far worse than the problem it solves.
  React.useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-primary/80 backdrop-blur-md flex items-center justify-center p-6"
          /* Closes only when the click landed on the backdrop itself. Comparing target
             to currentTarget is deliberate: relying on the panel to stopPropagation
             breaks as soon as the panel gains interactive children or padding is hit. */
          onClick={(event) => {
            if (event.target === event.currentTarget) onCloseRef.current();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
            tabIndex={-1}
            className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative max-h-full overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 id="case-study-title" className="text-2xl font-bold text-white font-display">
                {project.title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                className="text-slate-400 hover:text-white transition-colors p-1 bg-white/5 rounded-md hover:bg-accent/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-accent font-mono text-sm mb-2">Problem</h3>
                <p className="text-slate-400 leading-relaxed font-light">{project.problem}</p>
              </div>
              <div>
                <h3 className="text-accent font-mono text-sm mb-2">Approach</h3>
                <p className="text-slate-400 leading-relaxed font-light">{project.approach}</p>
              </div>
              <div>
                <h3 className="text-accent font-mono text-sm mb-2">Impact</h3>
                <p className="text-slate-400 leading-relaxed font-light">{project.impact}</p>
              </div>

              {/* Length test, not mere presence: an absent array and an empty one must
                  behave identically — no heading, no empty list. */}
              {project.links && project.links.length > 0 && (
                <div>
                  <h3 className="text-accent font-mono text-sm mb-2">Repositories</h3>
                  <div className="flex flex-col gap-2">
                    {project.links.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-accent transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CaseStudyDialog;
