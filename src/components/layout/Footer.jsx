import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Mail, Heart, Send } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300 pt-16 pb-8 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand section */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-1.5 bg-primary-500 rounded-lg text-white">
                <Activity className="h-4 w-4" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight bg-gradient-to-r from-primary-600 to-accent-500 dark:from-primary-400 dark:to-accent-400 bg-clip-text text-transparent">
                AuraHealth AI
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Your intelligent wellness companion. Empowering you with data-driven lifestyle insights and safe health guidelines.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">
                  Home Landing
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">
                  Health Dashboard
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-sm text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">
                  AI Wellness Chat
                </Link>
              </li>
              <li>
                <Link to="/symptoms" className="text-sm text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">
                  Symptom Checker
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              Developer Info
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="https://console.groq.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">
                  Groq API Documentation
                </a>
              </li>
              <li>
                <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">
                  Vite + React Setup
                </a>
              </li>
              <li>
                <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-primary-400 transition-colors">
                  Tailwind CSS Theme
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              Stay Updated
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Subscribe to receive weekly wellness tips and feature releases.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center">
              <input
                type="email"
                required
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary-500 dark:focus:border-primary-500 transition-all pr-12 text-slate-800 dark:text-slate-200"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                disabled={subscribed}
                className="absolute right-1.5 p-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white transition-colors"
                aria-label="Subscribe"
              >
                {subscribed ? <Send className="h-4 w-4 animate-bounce" /> : <Mail className="h-4 w-4" />}
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-success-500 font-semibold animate-pulse">
                Successfully subscribed to AuraHealth newsletters!
              </p>
            )}
          </div>

        </div>

        {/* Global Medical Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center mb-8 text-xs text-amber-600/80 dark:text-amber-400/70 leading-relaxed max-w-4xl mx-auto">
          <strong>Medical Disclaimer:</strong> AuraHealth AI is an interactive chatbot and lifestyle monitoring dashboard. All insights, analysis results, and chat conversations provided are strictly for general educational and informational purposes. They are not intended as clinical diagnoses, treatment prescriptions, or a substitute for expert consulting with a certified physician or healthcare professional.
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-8 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p>© {new Date().getFullYear()} AuraHealth AI. All rights reserved.</p>
            <p className="opacity-60 text-[10px]">Developed by Shivansh Mishra</p>
          </div>
          <p className="flex items-center gap-1 mt-4 sm:mt-0">
            Made with <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" /> for optimal wellness.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
