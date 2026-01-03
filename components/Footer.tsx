import React from 'react';
import { config } from '../data/config';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary py-8 text-center text-slate-500 text-sm border-t border-slate-900">
      <p>
        &copy; {new Date().getFullYear()} {config.name}. All rights reserved.
      </p>
      <p className="mt-2">
        Built with React, TailwindCSS & Framer Motion.
      </p>
    </footer>
  );
};

export default Footer;