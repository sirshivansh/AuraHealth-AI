import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, 
  ChevronRight, 
  RotateCcw, 
  Activity, 
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle,
  PlusCircle,
  ArrowRight,
  Info,
  Apple,
  XOctagon,
  Droplet,
  Flame,
  UserCheck
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard.jsx';
import { analyzeSymptoms } from '../../lib/api.js';

const SYMPTOM_DATA = {
  General: ['Fatigue', 'Fever', 'Chills', 'Body Aches', 'Night Sweats', 'Loss of Appetite'],
  Digestive: ['Nausea', 'Vomiting', 'Stomach Ache', 'Bloating', 'Acid Reflux', 'Diarrhea'],
  Respiratory: ['Cough', 'Sore Throat', 'Runny Nose', 'Shortness of Breath', 'Congestion', 'Sneezing'],
  Musculoskeletal: ['Joint Pain', 'Muscle Stiffness', 'Back Pain', 'Swelling', 'Neck Stiffness'],
  Nervous: ['Headache', 'Dizziness', 'Numbness', 'Brain Fog', 'Insomnia']
};

const SymptomChecker = () => {
  const [step, setStep] = useState(1); // 1: Selector, 2: Parameters, 3: Loading, 4: Report
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState('Moderate');
  const [duration, setDuration] = useState('1-3 days');
  
  // Results from AI
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loadingStepText, setLoadingStepText] = useState('Initializing diagnostics...');

  const handleToggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleClearSymptoms = () => {
    setSelectedSymptoms([]);
  };

  const handleNextStep = () => {
    if (selectedSymptoms.length === 0) return;
    setStep(2);
  };

  const runAnalysisTextAnimations = () => {
    const textSequence = [
      'Sending details to secure backend...',
      'Initiating Groq AI Llama model...',
      'Analyzing symptom triggers...',
      'Formulating clinical precautions...',
      'Compiling diet and hydration plans...'
    ];
    let counter = 0;
    setLoadingStepText(textSequence[0]);
    const interval = setInterval(() => {
      counter++;
      if (counter < textSequence.length) {
        setLoadingStepText(textSequence[counter]);
      } else {
        clearInterval(interval);
      }
    }, 1200);
    return interval;
  };

  const handleAnalyze = async () => {
    setStep(3);
    setError('');
    const animInterval = runAnalysisTextAnimations();

    try {
      const results = await analyzeSymptoms({
        symptoms: selectedSymptoms,
        category: selectedCategory,
        severity,
        duration
      });
      setReport(results);
      setStep(4);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to complete diagnosis. Check your server connection.');
      setStep(1);
    } finally {
      clearInterval(animInterval);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setSeverity('Moderate');
    setDuration('1-3 days');
    setReport(null);
    setError('');
    setStep(1);
  };

  // Urgency style helpers
  const getUrgencyStyles = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400',
          indicator: 'bg-red-500',
          title: 'High Urgency',
          badge: '🔴 Immediate Emergency Medical Evaluation Recommended'
        };
      case 'medium':
        return {
          bg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
          indicator: 'bg-amber-500',
          title: 'Medium Urgency',
          badge: '🟡 Clinical Evaluation / Monitoring Recommended'
        };
      default:
        return {
          bg: 'bg-success-500/10 border-success-500/20 text-success-600 dark:text-success-400',
          indicator: 'bg-success-500',
          title: 'Low Urgency',
          badge: '🟢 Self-Care & Monitoring at Home'
        };
    }
  };

  const urgencyStyles = getUrgencyStyles(report?.urgency);

  // Helper to render string or array metrics uniformly
  const renderItemOrArray = (item, iconColor = 'text-primary-500') => {
    if (!item) return <p className="text-xs text-slate-500">No specific advice provided.</p>;
    if (Array.isArray(item)) {
      return (
        <ul className="space-y-2">
          {item.map((val, idx) => (
            <li key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-slate-300 items-start leading-relaxed animate-fadeIn">
              <ChevronRight className={`h-4 w-4 shrink-0 ${iconColor} mt-0.5`} />
              <span>{val}</span>
            </li>
          ))}
        </ul>
      );
    }
    return <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item}</p>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="inline-flex p-2 bg-accent-500/10 text-accent-500 rounded-2xl mb-2">
          <Stethoscope className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-display font-extrabold tracking-tight">
          Interactive <span className="text-gradient">Symptom Checker</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Select symptoms and parameters to receive secure, backend AI diagnostic guidance and wellness guidelines.
        </p>
      </div>

      <AnimatePresence mode="wait">
        
        {/* STEP 1: Symptom Selector */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-500 text-center flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Category list panel */}
              <div className="md:col-span-4 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block mb-1">Body Area / Category</label>
                {Object.keys(SYMPTOM_DATA).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold border transition-all flex items-center justify-between ${
                      selectedCategory === cat 
                        ? 'bg-primary-500 border-primary-600 text-white shadow-md shadow-primary-500/25' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-primary-300'
                    }`}
                  >
                    <span>{cat}</span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                  </button>
                ))}
              </div>

              {/* Symptom chips selector */}
              <div className="md:col-span-8 space-y-4">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Choose Symptoms</label>
                  {selectedSymptoms.length > 0 && (
                    <button 
                      onClick={handleClearSymptoms}
                      className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>

                <GlassCard hover={false} className="min-h-[200px] flex flex-wrap gap-2.5 items-start">
                  {SYMPTOM_DATA[selectedCategory].map(symptom => {
                    const isSelected = selectedSymptoms.includes(symptom);
                    return (
                      <button
                        key={symptom}
                        onClick={() => handleToggleSymptom(symptom)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-primary-50 dark:bg-primary-950/20 border-primary-500 text-primary-600 dark:text-primary-400'
                            : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100/50'
                        }`}
                      >
                        {isSelected ? <CheckCircle className="h-3.5 w-3.5 text-primary-500" /> : <PlusCircle className="h-3.5 w-3.5 text-slate-400" />}
                        {symptom}
                      </button>
                    );
                  })}
                </GlassCard>

                {/* Selected summary */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected ({selectedSymptoms.length})</span>
                    <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-0.5">
                      {selectedSymptoms.length === 0 
                        ? 'Select symptoms above to proceed.' 
                        : selectedSymptoms.join(', ')}
                    </p>
                  </div>

                  <button
                    disabled={selectedSymptoms.length === 0}
                    onClick={handleNextStep}
                    className="glass-button-primary disabled:opacity-40 disabled:hover:scale-100 whitespace-nowrap self-end md:self-center py-2.5"
                  >
                    Configure Details
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* STEP 2: Parameters Form */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md mx-auto"
          >
            <GlassCard hover={false} className="space-y-6">
              <h3 className="font-bold text-base border-b border-slate-100 dark:border-slate-800 pb-3">Analyze Details</h3>
              
              <div className="space-y-4">
                {/* Severity Toggle */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Severity Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Mild', 'Moderate', 'Severe'].map(sev => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setSeverity(sev)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                          severity === sev
                            ? 'bg-primary-500 border-primary-600 text-white shadow-md shadow-primary-500/25'
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-primary-300'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration select drop down */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Duration of Symptoms</label>
                  <select
                    className="glass-input bg-white dark:bg-slate-950 text-xs py-2.5 font-medium"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <option value="Less than 24 hours">Less than 24 hours</option>
                    <option value="1-3 days">1 to 3 days</option>
                    <option value="4-7 days">4 to 7 days</option>
                    <option value="Over a week">Over a week</option>
                  </select>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center text-xs text-slate-500 leading-normal flex gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-amber-500" />
                  <span>Specifying parameters helps the AI build precise wellness advice.</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="flex-1 glass-button-secondary py-2.5"
                >
                  Back
                </button>
                <button 
                  type="button" 
                  onClick={handleAnalyze}
                  className="flex-1 glass-button-primary py-2.5"
                >
                  Analyze Symptoms
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* STEP 3: Loading Page */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 text-center space-y-4"
          >
            <div className="relative h-20 w-20 flex items-center justify-center">
              {/* Spinning primary ring */}
              <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-900"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin"></div>
              <Sparkles className="h-6 w-6 text-primary-500 animate-pulse" />
            </div>

            <h3 className="font-bold text-base mt-4 text-gradient">Analyzing Symptoms</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 animate-pulse">
              {loadingStepText}
            </p>
          </motion.div>
        )}

        {/* STEP 4: DIAGNOSTIC REPORT */}
        {step === 4 && report && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            
            {/* Urgent / Safe Notification Ribbon */}
            <div className={`p-4 rounded-3xl border ${urgencyStyles.bg} flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm`}>
              <div className="flex gap-3 items-start">
                <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">{urgencyStyles.badge}</h4>
                  <p className="text-xs mt-1 leading-normal opacity-90">{report.urgencyReason}</p>
                </div>
              </div>
              
              <button 
                onClick={handleReset}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center gap-1.5 shrink-0 self-end md:self-center hover:scale-105 transition-all text-slate-700 dark:text-slate-300 shadow-sm"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Start Over
              </button>
            </div>

            {/* Diagnostic Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Causes Card */}
              <GlassCard hover={false} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="h-2 w-2 rounded-full bg-primary-500 animate-pulse"></div>
                  <h3 className="font-bold text-sm">Possible Explanations</h3>
                </div>
                {renderItemOrArray(report.causes, 'text-primary-500')}
              </GlassCard>

              {/* Precautions Card */}
              <GlassCard hover={false} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                  <h3 className="font-bold text-sm">General Precautions</h3>
                </div>
                {renderItemOrArray(report.precautions, 'text-red-500')}
              </GlassCard>

              {/* Foods to Eat / Avoid Card */}
              <GlassCard hover={false} className="space-y-4 md:col-span-2">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <Apple className="h-5 w-5 text-success-500" />
                  <h3 className="font-bold text-sm">Dietary Recommendations</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-success-600 dark:text-success-400 flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 text-success-500" />
                      Foods to Prioritize
                    </h4>
                    {renderItemOrArray(report.foodsEat, 'text-success-500')}
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-red-500 flex items-center gap-1.5">
                      <XOctagon className="h-4 w-4 text-red-500" />
                      Foods to Avoid
                    </h4>
                    {renderItemOrArray(report.foodsAvoid, 'text-red-500')}
                  </div>
                </div>
              </GlassCard>

              {/* Hydration / Activity Guidance Card */}
              <GlassCard hover={false} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <Droplet className="h-4.5 w-4.5 text-blue-500 fill-blue-500" />
                  <h3 className="font-bold text-sm">Hydration & Activity Guidance</h3>
                </div>
                <div className="space-y-4 pt-1">
                  <div>
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-2">
                      <Droplet className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />
                      Hydration Guidance
                    </h4>
                    {renderItemOrArray(report.hydration, 'text-blue-500')}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-accent-600 dark:text-accent-400 flex items-center gap-1 mb-2">
                      <Flame className="h-3.5 w-3.5 text-accent-500 fill-accent-500" />
                      Activity Suggestions
                    </h4>
                    {renderItemOrArray(report.activity, 'text-accent-500')}
                  </div>
                </div>
              </GlassCard>

              {/* Consult Doctor Guidance Card */}
              <GlassCard hover={false} className="space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <UserCheck className="h-5 w-5 text-indigo-500" />
                    <h3 className="font-bold text-sm">Clinical Consult Threshold</h3>
                  </div>
                  <div className="pt-2">
                    {renderItemOrArray(report.consultDoctor, 'text-indigo-500')}
                  </div>
                </div>
                
                <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-[10px] text-indigo-500/80 leading-normal flex items-start gap-1.5 mt-4">
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-indigo-500" />
                  <span>These consult instructions help establish threshold boundaries on monitoring at home versus visiting a clinician.</span>
                </div>
              </GlassCard>

            </div>

            {/* Medical Disclaimer Reminder Card */}
            <div className="p-4 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 text-[10px] text-slate-500 dark:text-slate-400 text-center leading-relaxed font-semibold">
              ⚠️ General Wellness Notice: This report was compiled by an AI model (Groq AI Llama 3.3) for general lifestyle assessment. It is not an official clinical diagnostic statement. For severe complaints, high fever, chest pressure, sudden numbness, or worsening discomforts, seek emergency clinical care immediately.
            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default SymptomChecker;
