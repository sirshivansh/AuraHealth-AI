import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Menu, 
  X, 
  Sun, 
  Moon
} from 'lucide-react';

const Navbar = ({ theme, toggleTheme }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'AI Chat', path: '/chat' },
    { name: 'Symptom Checker', path: '/symptoms' }
  ];

  const isActive = (path) => location.pathname === path;
  const isLanding = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4">
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl mx-auto"
      >
        <nav className={`flex items-center justify-between rounded-full px-4 sm:px-6 py-2.5 border transition-colors duration-300 ${
          isLanding
            ? 'bg-zinc-900/60 backdrop-blur-xl border-white/[0.08] shadow-2xl shadow-black/30'
            : 'bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border-slate-200/50 dark:border-white/[0.08] shadow-lg shadow-slate-100/40 dark:shadow-black/30'
        }`}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="p-1.5 bg-primary-500 rounded-lg text-white group-hover:scale-110 transition-transform duration-300 shadow-md shadow-primary-500/30">
              <Activity className="h-4 w-4" />
            </div>
            <span className="font-display font-extrabold text-lg tracking-tight">
              <span className={isLanding ? 'text-white' : 'bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent'}>
                Aura
              </span>
              <span className={isLanding ? 'text-zinc-400' : 'text-slate-500 dark:text-zinc-400'}>Health</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? isLanding
                      ? 'text-white bg-white/10'
                      : 'text-primary-600 dark:text-primary-400 bg-primary-500/10'
                    : isLanding
                      ? 'text-zinc-400 hover:text-white'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Trust Signal Pill */}
            <div className={`hidden lg:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
              isLanding
                ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10'
                : 'border-success-500/20 text-success-600 dark:text-emerald-400 bg-success-500/10'
            }`}>
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              HIPAA Secure
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                isLanding
                  ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden p-2 rounded-full transition-colors ${
                isLanding
                  ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                  : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`mt-2 rounded-2xl border p-2 space-y-1 md:hidden ${
                isLanding
                  ? 'bg-zinc-900/90 backdrop-blur-xl border-white/[0.08]'
                  : 'bg-white dark:bg-zinc-900/90 backdrop-blur-xl border-slate-200 dark:border-white/[0.08]'
              }`}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? isLanding
                        ? 'bg-white/10 text-white'
                        : 'bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400'
                      : isLanding
                        ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
};

export default Navbar;
