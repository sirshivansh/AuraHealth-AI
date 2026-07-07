import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRight, User, Scale, Ruler, Calendar, Droplets, Moon, Mail, Lock } from 'lucide-react';
import { useProfile } from '../../app/providers.jsx';
import GlassCard from '../../components/ui/GlassCard.jsx';
import { auth, db } from '../../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, user, authLoading } = useProfile();
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Local state initialized with current profile
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: profile.name || '',
    age: profile.age || '',
    gender: profile.gender || '',
    weight: profile.weight || '',
    height: profile.height || '',
    waterTarget: profile.waterTarget || 2500,
    sleepTarget: profile.sleepTarget || 8,
  });

  // Redirect if already logged in and not loading
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'name' || name === 'gender' || name === 'email' || name === 'password') ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // Login flow
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
        // The onAuthStateChanged listener in providers.jsx will fetch the profile and redirect
      } else {
        // Sign up flow
        if (!formData.name) throw new Error("Name is required");
        
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const newUser = userCredential.user;
        
        const newProfile = {
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          weight: formData.weight,
          height: formData.height,
          waterTarget: formData.waterTarget,
          sleepTarget: formData.sleepTarget,
        };

        // Create user document in Firestore
        await setDoc(doc(db, 'users', newUser.uid), newProfile);
        
        // Context will update automatically via onAuthStateChanged
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <Activity className="h-8 w-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-500/10 text-primary-500 mb-6">
            <Activity className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-3">
            Welcome to AuraHealth
          </h1>
          <p className="text-slate-600 dark:text-zinc-400">
            {isLogin ? "Sign in to continue your wellness journey." : "Let's personalize your AI wellness experience."}
          </p>
        </div>

        <GlassCard hover={false} className="p-8 border-slate-200 dark:border-white/[0.08]">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-zinc-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="glass-input pl-12"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-zinc-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="glass-input pl-12"
                />
              </div>
            </div>

            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5 overflow-hidden"
                >
                  {/* Name */}
                  <div className="pt-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-zinc-500" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Sarah Connor"
                        required={!isLogin}
                        className="glass-input pl-12"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {/* Age */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                        Age
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-zinc-500" />
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          required={!isLogin}
                          min="1"
                          className="glass-input pl-12"
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                        Gender
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="glass-input appearance-none"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    {/* Weight */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                        Weight <span className="text-xs font-normal text-slate-400">(kg)</span>
                      </label>
                      <div className="relative">
                        <Scale className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-zinc-500" />
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          required={!isLogin}
                          min="1"
                          className="glass-input pl-12"
                        />
                      </div>
                    </div>

                    {/* Height */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                        Height <span className="text-xs font-normal text-slate-400">(cm)</span>
                      </label>
                      <div className="relative">
                        <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-zinc-500" />
                        <input
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          required={!isLogin}
                          min="1"
                          className="glass-input pl-12"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Optional Targets block */}
                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-white/5 space-y-5">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Targets</h3>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                          Water <span className="text-xs font-normal text-slate-400">(ml)</span>
                        </label>
                        <div className="relative">
                          <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary-400" />
                          <input
                            type="number"
                            name="waterTarget"
                            value={formData.waterTarget}
                            onChange={handleChange}
                            required={!isLogin}
                            className="glass-input pl-9 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-zinc-300 mb-2">
                          Sleep <span className="text-xs font-normal text-slate-400">(hrs)</span>
                        </label>
                        <div className="relative">
                          <Moon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent-400" />
                          <input
                            type="number"
                            name="sleepTarget"
                            value={formData.sleepTarget}
                            onChange={handleChange}
                            required={!isLogin}
                            step="0.5"
                            className="glass-input pl-9 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full glass-button-primary flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Activity className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary-500 hover:text-primary-400 font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </GlassCard>
        
        <div className="mt-6 text-center">
          <p className="text-[10px] text-slate-400 dark:text-zinc-600 font-mono tracking-wider opacity-60">
            Made by Shivansh Mishra
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
