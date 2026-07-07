import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  MessageSquare, 
  Stethoscope, 
  Activity, 
  Sparkles, 
  Shield, 
  Droplet, 
  Moon, 
  Heart,
  Play,
  TrendingUp
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard.jsx';
import ECGWave from '../../components/ui/ECGWave.jsx';
import HealthScoreRing from '../../components/ui/HealthScoreRing.jsx';




const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const floatVariants = (delay = 0, duration = 6) => ({
    animate: {
      y: [0, -12, 0],
      transition: {
        repeat: Infinity,
        duration: duration,
        ease: "easeInOut",
        delay: delay
      }
    }
  });

  return (
    <div className="relative overflow-hidden">
      
      {/* ═══════════════════════════════════════════════
          HERO SECTION — Full Dark, Helexia-Inspired
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen bg-slate-50 dark:bg-[#09090b] overflow-hidden flex flex-col items-center justify-center pt-28 pb-32 px-4 sm:px-6">

        {/* Background Radial Glows */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-30 blur-[120px] pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(250,85,67,0.35) 0%, transparent 70%)' }} />
        <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full opacity-25 blur-[120px] pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.3) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)' }} />

        {/* Subtle Grid Lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
             style={{ 
               backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
               backgroundSize: '60px 60px'
             }} />

        {/* ── Center Content ── */}
        <motion.div
          className="relative z-10 text-center max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Tagline Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200/50 dark:bg-white/[0.06] border border-slate-300 dark:border-white/[0.08] text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-8 backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary-400" />
            AI-Powered Health Monitoring Platform
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Keep Your Health{' '}
            <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary-400 via-primary-300 to-accent-400 bg-clip-text text-transparent">
              in Good Hands
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed mb-10"
          >
            Our commitment lies in making every heartbeat matter — through accessibility, accuracy, and empathetic AI-driven wellness guidance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/[0.12] text-zinc-300 hover:text-white hover:border-white/[0.25] hover:bg-white/[0.04] font-semibold text-sm transition-all duration-300"
            >
              <Play className="h-4 w-4 fill-current" />
              Talk to AI
            </Link>
          </motion.div>
        </motion.div>

        {/* ── Floating Widget: Heart Rate (Left) ── */}
        <motion.div
          className="absolute left-4 lg:left-[8%] xl:left-[12%] top-1/2 -translate-y-1/2 z-20 hidden md:block"
          initial={{ opacity: 0, x: -60, y: '-50%' }}
          animate={{ opacity: 1, x: 0, y: '-50%' }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <div className="w-56 rounded-2xl bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] p-5 shadow-2xl shadow-slate-200/50 dark:shadow-black/40">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.9 }}
                  >
                    <Heart className="h-4 w-4 text-primary-400 fill-primary-400" />
                  </motion.div>
                  <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Heart Rate</span>
                </div>
                <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              
              {/* BPM */}
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-4xl font-extrabold text-emerald-400 tabular-nums">72</span>
                <span className="text-xs font-bold text-zinc-500 uppercase">BPM</span>
              </div>

              {/* ECG Line */}
              <ECGWave />

              {/* Status */}
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-200 dark:border-white/[0.06]">
                <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-500">Status</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  Normal Sinus
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Floating Widget: Health Score (Right) ── */}
        <motion.div
          className="absolute right-4 lg:right-[8%] xl:right-[12%] top-1/2 -translate-y-1/2 z-20 hidden md:block"
          initial={{ opacity: 0, x: 60, y: '-50%' }}
          animate={{ opacity: 1, x: 0, y: '-50%' }}
          transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1 }}
          >
            <div className="w-52 rounded-2xl bg-white/80 dark:bg-zinc-900/50 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] p-5 shadow-2xl shadow-slate-200/50 dark:shadow-black/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">AI Health Score</span>
                <TrendingUp className="h-4 w-4 text-accent-400" />
              </div>

              <HealthScoreRing score={94} />

              <div className="text-center mt-3 pt-3 border-t border-slate-200 dark:border-white/[0.06]">
                <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-500">
                  Based on your daily metrics
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Floating Widget: Patient Consultation / Search (Bottom Center) ── */}
        <motion.div
          className="relative z-20 mt-16 w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="rounded-2xl bg-white/80 dark:bg-zinc-900/60 backdrop-blur-xl border border-slate-200 dark:border-white/[0.08] p-4 sm:p-5 shadow-2xl shadow-slate-200/50 dark:shadow-black/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20">
                  A
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">AuraHealth Assistant</h4>
                  <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block"></span>
                    Online — Ready to Help
                  </span>
                </div>
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Describe what you're feeling today..." 
                  className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-32 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-primary-500/50 transition-colors"
                  readOnly
                />
                <Link to="/login" className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400 text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors shadow-lg">
                  Find Care
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </section>

      {/* ═══════════════════════════════════════════════
          VALUES SECTION — 4 Dark Cards (Like Helexia)
      ═══════════════════════════════════════════════ */}
      <section className="relative bg-[#09090b] px-4 sm:px-6 lg:px-8 pb-24 -mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Shield className="h-6 w-6" />, title: "To Empower", desc: "Giving patients control and clarity over their own health data.", color: "from-primary-500 to-primary-600" },
              { icon: <Heart className="h-6 w-6" />, title: "To Protect", desc: "Ensure every piece of medical information remains private and secure.", color: "from-accent-500 to-accent-600" },
              { icon: <MessageSquare className="h-6 w-6" />, title: "To Connect", desc: "Bridge patients and healthcare providers through responsive AI.", color: "from-indigo-500 to-indigo-600" },
              { icon: <TrendingUp className="h-6 w-6" />, title: "To Advance", desc: "Drive continuous innovation to make healthcare more accurate and efficient.", color: "from-emerald-500 to-emerald-600" }
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group rounded-2xl bg-zinc-900/40 backdrop-blur-sm border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all duration-300"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color} text-white w-fit mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════
          FEATURE BENTO GRID — Light Section
      ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold">
            Explore Our <span className="text-gradient">Wellness Suite</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            A comprehensive set of AI-driven tools and calculators to help you understand your wellness footprint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: AI Chat */}
          <GlassCard className="flex flex-col justify-between min-h-[260px] border border-transparent" delay={0.1}>
            <div className="space-y-4">
              <div className="p-3 bg-primary-500/10 text-primary-500 rounded-2xl w-fit">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">AI Wellness Chat</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Connect with our advanced healthcare chatbot model for nutritional guidance, stress remedies, fitness suggestions, and general health queries.
              </p>
            </div>
            <Link to="/chat" className="flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mt-6 w-fit">
              Open AI Chat
              <ArrowRight className="h-4 w-4" />
            </Link>
          </GlassCard>

          {/* Card 2: Symptom Checker */}
          <GlassCard className="flex flex-col justify-between min-h-[260px] border border-transparent" delay={0.2}>
            <div className="space-y-4">
              <div className="p-3 bg-accent-500/10 text-accent-500 rounded-2xl w-fit">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Symptom Checker</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Interactively select physical discomforts, specify duration and severity, and get clean, non-alarmist potential triggers, precautions, and dietary recommendations.
              </p>
            </div>
            <Link to="/symptoms" className="flex items-center gap-1.5 text-sm font-semibold text-accent-500 hover:text-accent-600 dark:hover:text-accent-400 transition-colors mt-6 w-fit">
              Analyze Symptoms
              <ArrowRight className="h-4 w-4" />
            </Link>
          </GlassCard>

          {/* Card 3: Dashboard */}
          <GlassCard className="flex flex-col justify-between min-h-[260px] border border-transparent" delay={0.3}>
            <div className="space-y-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl w-fit">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Health Dashboard</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Log water cup progress, track sleep cycles, calculate BMI indices dynamically, and view your calculated comprehensive daily health score.
              </p>
            </div>
            <Link to="/dashboard" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mt-6 w-fit">
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          AI BENEFITS & SAFETY SECTION
      ═══════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 bg-slate-100/30 dark:bg-slate-900/10 rounded-3xl border border-slate-200/20 dark:border-slate-800/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8">
          
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold">
              Safety First. <br />
              <span className="text-gradient">Intelligent Assistance.</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              AuraHealth AI is built with rigid clinical boundaries and guardrails. It is designed to assist you in monitoring healthy routines, not to alarm you or replace critical medical diagnoses.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-4">
                <div className="p-2 bg-success-500/10 text-success-500 rounded-xl h-fit">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Strict Medical Guardrails</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Every analysis report contains immediate reminders to seek clinician care when symptoms indicate urgent attention.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="p-2 bg-primary-500/10 text-primary-500 rounded-xl h-fit">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Empathetic Context Awareness</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Groq AI structures suggestions clearly, avoiding alarmist language, explaining possible causes scientifically.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/40 dark:bg-slate-900/20 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-2">
              <span className="text-3xl font-extrabold text-primary-500">100%</span>
              <h5 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Local Storage</h5>
              <p className="text-[10px] text-slate-400">All data and API keys remain securely inside your local browser memory.</p>
            </div>

            <div className="p-6 bg-white/40 dark:bg-slate-900/20 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-2">
              <span className="text-3xl font-extrabold text-accent-500">24/7</span>
              <h5 className="font-bold text-xs uppercase text-slate-500 tracking-wider">AI Availability</h5>
              <p className="text-[10px] text-slate-400">Instantaneous guidance for nutrition, sleep quality, and physical movement.</p>
            </div>

            <div className="p-6 bg-white/40 dark:bg-slate-900/20 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-2 col-span-2">
              <span className="text-2xl font-extrabold text-emerald-500">Llama 3.3 70B</span>
              <h5 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Advanced AI Foundation</h5>
              <p className="text-[10px] text-slate-400">Powered by Groq for structured, reasoning-backed wellness advice.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          CTA SECTION
      ═══════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center z-10 relative">
        <GlassCard className="py-12 px-6 border-transparent" hover={false}>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold mb-4">
            Ready to Take Control of Your Wellness?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-8">
            Create your local health profile, calculate your BMI indicator, track daily habits, and get customized AI diagnostics.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/dashboard" className="glass-button-primary">
              Launch Dashboard
            </Link>
            <Link to="/chat" className="glass-button-secondary">
              Speak to AI
            </Link>
          </div>
        </GlassCard>
      </section>

    </div>
  );
};

export default LandingPage;
