import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Droplet, 
  Moon, 
  Activity, 
  Sparkles, 
  Edit3, 
  User,
  Plus,
  Minus,
  Check,
  RefreshCw,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import GlassCard from '../../components/ui/GlassCard.jsx';
import { streamChat as chatWithAI } from '../../lib/api.js';
import { useProfile } from '../../app/providers.jsx';

const Dashboard = () => {
  const { profile, updateProfile } = useProfile();
  // Local tracking states
  const [currentWater, setCurrentWater] = useState(1250); // ml
  const [sleepLogged, setSleepLogged] = useState(6.5); // hours
  const [sleepQuality, setSleepQuality] = useState('Average');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, bmi, habits

  // Profile Form States
  const [editName, setEditName] = useState(profile.name);
  const [editAge, setEditAge] = useState(profile.age);
  const [editGender, setEditGender] = useState(profile.gender);
  const [editWeight, setEditWeight] = useState(profile.weight);
  const [editHeight, setEditHeight] = useState(profile.height);
  const [editWaterTarget, setEditWaterTarget] = useState(profile.waterTarget);
  const [editSleepTarget, setEditSleepTarget] = useState(profile.sleepTarget);

  // AI Tip state
  const [aiTip, setAiTip] = useState('');
  const [isTipLoading, setIsTipLoading] = useState(false);

  // BMI Interactive Calculator States
  const [bmiHeight, setBmiHeight] = useState(profile.height);
  const [bmiWeight, setBmiWeight] = useState(profile.weight);

  useEffect(() => {
    setBmiHeight(profile.height);
    setBmiWeight(profile.weight);
  }, [profile.height, profile.weight]);

  const handleCalculateBmi = (e) => {
    e.preventDefault();
    const h = parseFloat(bmiHeight);
    const w = parseFloat(bmiWeight);
    if (h > 0 && w > 0) {
      updateProfile({ height: h, weight: w });
      const calculatedBmi = w / ((h / 100) * (h / 100));
      if (calculatedBmi >= 18.5 && calculatedBmi < 25) {
        try {
          confetti({
            particleCount: 80,
            spread: 50,
            origin: { y: 0.8 }
          });
        } catch (e) {
          console.error("Confetti trigger error: ", e);
        }
      }
    }
  };

  // 1. BMI Calculation
  const heightInMeters = profile.height / 100;
  const bmi = (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  
  const getBmiCategory = (val) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' };
    if (val < 25) return { label: 'Normal', color: 'text-success-500 bg-success-500/10 border-success-500/20' };
    if (val < 30) return { label: 'Overweight', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' };
    return { label: 'Obese', color: 'text-red-500 bg-red-500/10 border-red-500/20' };
  };
  const bmiCategory = getBmiCategory(parseFloat(bmi));

  // Healthy weight range estimation (BMI 18.5 to 24.9)
  const minHealthyWeight = (18.5 * heightInMeters * heightInMeters).toFixed(0);
  const maxHealthyWeight = (24.9 * heightInMeters * heightInMeters).toFixed(0);

  // 2. Hydration percentage and controls
  const waterProgress = Math.min((currentWater / profile.waterTarget) * 100, 100).toFixed(0);
  const addWater = (amount) => {
    setCurrentWater(prev => {
      const next = prev + amount;
      // Confetti celebration if they just hit the target
      if (next >= profile.waterTarget && prev < profile.waterTarget) {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) {
          console.log("Confetti failed to trigger: ", e);
        }
      }
      return next;
    });
  };
  const subtractWater = (amount) => {
    setCurrentWater(prev => Math.max(prev - amount, 0));
  };

  // 3. Daily Health Score calculation
  // Base calculation out of 100
  const getDailyHealthScore = () => {
    let score = 0;
    
    // BMI score (max 30 pts)
    const val = parseFloat(bmi);
    if (val >= 18.5 && val < 25) score += 30;
    else if (val >= 25 && val < 30) score += 20;
    else if (val < 18.5) score += 15;
    else score += 10;

    // Water score (max 35 pts)
    const waterRatio = currentWater / profile.waterTarget;
    score += Math.min(waterRatio * 35, 35);

    // Sleep score (max 35 pts)
    const sleepRatio = sleepLogged / profile.sleepTarget;
    score += Math.min(sleepRatio * 30, 30);
    
    if (sleepQuality === 'Deep/Peaceful') score += 5;
    else if (sleepQuality === 'Average') score += 3;
    else score += 0;

    return Math.min(Math.round(score), 100);
  };
  const healthScore = getDailyHealthScore();

  // Color coding for score
  const getScoreColor = (score) => {
    if (score >= 80) return { stroke: 'stroke-success-500', text: 'text-success-500', glow: 'shadow-success-500/10' };
    if (score >= 60) return { stroke: 'stroke-amber-500', text: 'text-amber-500', glow: 'shadow-amber-500/10' };
    return { stroke: 'stroke-red-500', text: 'text-red-500', glow: 'shadow-red-500/10' };
  };
  const scoreColors = getScoreColor(healthScore);

  // SVG parameters for score ring
  const radius = 55;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  // 4. Fetch daily health tip from backend Groq Llama model
  const fetchDailyTip = async () => {
    setIsTipLoading(true);
    setAiTip('');
    const prompt = `
Generate a single, short (2-3 sentences max) personalized wellness advice for the user based on these exact health dashboard metrics:
- Name: ${profile.name}
- Age: ${profile.age} years old
- BMI: ${bmi} (${bmiCategory.label})
- Hydration: ${currentWater}ml logged out of a ${profile.waterTarget}ml target (${waterProgress}% complete)
- Sleep: ${sleepLogged} hours logged (${sleepQuality} quality) out of an ${profile.sleepTarget} hours goal
- Health Score: ${healthScore}% overall

Provide a highly actionable, encouraging tip referencing these stats. Do not prefix with labels, output a single paragraph. Make sure to append the standard medical disclaimer at the end of the text: "This AI provides general wellness information and is not a substitute for professional medical advice."
`;
    try {
      const responseText = await chatWithAI(prompt);
      setAiTip(responseText);
    } catch (err) {
      console.error(err);
      setAiTip(`Hydrating properly (${currentWater}ml) and sleeping ${sleepLogged} hours is key to boosting your overall health score of ${healthScore}%. Aim for a consistent sleep cycle tonight. *This AI provides general wellness information and is not a substitute for professional medical advice.*`);
    } finally {
      setIsTipLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyTip();
  }, [profile, currentWater, sleepLogged, sleepQuality]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      age: parseInt(editAge) || profile.age,
      gender: editGender,
      weight: parseFloat(editWeight) || profile.weight,
      height: parseFloat(editHeight) || profile.height,
      waterTarget: parseInt(editWaterTarget) || profile.waterTarget,
      sleepTarget: parseFloat(editSleepTarget) || profile.sleepTarget,
    });
    setIsEditingProfile(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-200/50 dark:border-slate-800/50 pb-6">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">
            Wellness <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track metrics, compute health score indices, and view customized daily AI recommendations.
          </p>
        </div>

        {/* User Quick Profile Info */}
        <div className="flex items-center gap-3 bg-white/50 dark:bg-slate-900/30 p-3 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
          <div className="p-2.5 bg-primary-500 text-white rounded-xl">
            <User className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm">{profile.name}</span>
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="text-slate-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                aria-label="Edit Profile"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="text-[11px] text-slate-500">
              {profile.gender} • {profile.age} yrs • {profile.weight}kg / {profile.height}cm
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Trackers & Calculators */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Quick Sub-tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mb-2 overflow-x-auto">
            {['overview', 'bmi', 'habits', 'breathe'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-display text-sm font-semibold border-b-2 capitalize transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* BMI Card Mini */}
                <GlassCard onClick={() => setActiveTab('bmi')} className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                          <Calculator className="h-4 w-4" />
                        </div>
                        <h3 className="font-bold text-sm">Body Mass Index</h3>
                      </div>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${bmiCategory.color}`}>
                        {bmiCategory.label}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 my-3">
                      <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{bmi}</span>
                      <span className="text-xs text-slate-500 font-medium">kg/m²</span>
                    </div>

                    <div className="text-xs text-slate-500 leading-normal">
                      Healthy range for your height is **{minHealthyWeight}kg - {maxHealthyWeight}kg**.
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-bold text-primary-500 flex items-center gap-1">
                    <span>Manage height & weight parameters</span>
                    <Plus className="h-3 w-3" />
                  </div>
                </GlassCard>

                {/* Hydration Card Mini */}
                <GlassCard onClick={() => setActiveTab('habits')} className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary-500/10 text-primary-500 rounded-xl">
                          <Droplet className="h-4 w-4 text-primary-500" />
                        </div>
                        <h3 className="font-bold text-sm">Hydration Goal</h3>
                      </div>
                      <span className="text-xs font-bold text-primary-500">
                        {waterProgress}%
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 my-3">
                      <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{currentWater}</span>
                      <span className="text-xs text-slate-500">/ {profile.waterTarget} ml</span>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                      <div 
                        className="bg-gradient-to-r from-primary-400 to-primary-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${waterProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button 
                      onClick={(e) => { e.stopPropagation(); addWater(250); }}
                      className="px-2.5 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-950/20 text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:scale-105 transition-transform"
                    >
                      <Plus className="h-3.5 w-3.5" /> +250ml
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); addWater(500); }}
                      className="px-2.5 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold flex items-center gap-1 hover:scale-105 transition-transform"
                    >
                      <Plus className="h-3.5 w-3.5" /> +500ml
                    </button>
                  </div>
                </GlassCard>

                {/* Sleep Card Mini */}
                <GlassCard onClick={() => setActiveTab('habits')} className="flex flex-col justify-between md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-accent-500/10 text-accent-500 rounded-xl">
                          <Moon className="h-4 w-4" />
                        </div>
                        <h3 className="font-bold text-sm">Sleep Tracker</h3>
                      </div>
                      <div className="flex items-baseline gap-1 my-3">
                        <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{sleepLogged}</span>
                        <span className="text-xs text-slate-500">/ {profile.sleepTarget} hrs</span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Goal of **{profile.sleepTarget} hours** configured. Sleep Quality: **{sleepQuality}**.
                      </p>
                    </div>

                    <div className="space-y-3 p-3 bg-slate-100/40 dark:bg-slate-900/30 rounded-2xl border border-slate-200/20 dark:border-slate-800/20 flex flex-col justify-center">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Log Last Night's Sleep</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="range" 
                          min="0" 
                          max="12" 
                          step="0.5" 
                          className="flex-grow accent-accent-500 cursor-pointer"
                          value={sleepLogged}
                          onChange={(e) => setSleepLogged(parseFloat(e.target.value))}
                        />
                        <span className="text-xs font-bold w-12 text-right">{sleepLogged} hrs</span>
                      </div>
                      <div className="flex justify-between items-center gap-2 mt-1">
                        <span className="text-[10px] text-slate-400">Quality:</span>
                        <div className="flex gap-1.5">
                          {['Restless', 'Average', 'Deep'].map(q => (
                            <button
                              key={q}
                              onClick={() => setSleepQuality(q)}
                              className={`px-2 py-0.5 rounded-md text-[9px] font-bold border transition-colors ${
                                sleepQuality === q 
                                  ? 'bg-accent-500 border-accent-600 text-white' 
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-accent-300'
                              }`}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'bmi' && (
              <motion.div
                key="bmi"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard hover={false} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl">
                      <Calculator className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Interactive BMI Calculator</h3>
                      <p className="text-xs text-slate-500">Enter your dimensions to calculate body mass index and log it locally.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    
                    {/* Calculator Form Inputs */}
                    <form onSubmit={handleCalculateBmi} className="space-y-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Dimensions Input</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Height (cm)</label>
                          <input
                            type="number"
                            min="50"
                            max="300"
                            required
                            className="glass-input py-2 text-sm"
                            value={bmiHeight}
                            onChange={(e) => setBmiHeight(e.target.value)}
                            placeholder="e.g. 175"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 mb-1.5">Weight (kg)</label>
                          <input
                            type="number"
                            min="10"
                            max="500"
                            step="0.1"
                            required
                            className="glass-input py-2 text-sm"
                            value={bmiWeight}
                            onChange={(e) => setBmiWeight(e.target.value)}
                            placeholder="e.g. 70"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full glass-button-primary py-2.5 text-xs font-bold"
                      >
                        Calculate & Save Parameters
                      </button>

                      <div className="flex gap-2.5 items-start p-3 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-500 leading-normal">
                          For height **{profile.height} cm**, your healthy body weight range is estimated between **{minHealthyWeight} kg** and **{maxHealthyWeight} kg**.
                        </p>
                      </div>
                    </form>

                    {/* Gauge & Results display */}
                    <div className="space-y-6">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Assessment Result</h4>

                      <div className="text-center p-5 bg-slate-100/40 dark:bg-slate-900/30 rounded-3xl border border-slate-200/20 dark:border-slate-800/20">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Current Index</div>
                        <div className="text-5xl font-extrabold text-gradient my-1.5">{bmi}</div>
                        <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-bold border ${bmiCategory.color}`}>
                          {bmiCategory.label}
                        </span>
                      </div>

                      {/* Spectrum range line gauge */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                          <span>Underweight (18.5)</span>
                          <span>Normal (24.9)</span>
                          <span>Obese (30.0)</span>
                        </div>
                        <div className="relative w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                          <div className="h-full bg-blue-400/70 w-[25%]"></div> {/* Underweight */}
                          <div className="h-full bg-success-500/70 w-[35%]"></div> {/* Normal */}
                          <div className="h-full bg-amber-400/70 w-[20%]"></div> {/* Overweight */}
                          <div className="h-full bg-red-500/70 w-[20%]"></div> {/* Obese */}
                          
                          {/* Indicator pin position calculated based on BMI */}
                          {(() => {
                            const numericBmi = parseFloat(bmi);
                            const positionPercent = Math.min(Math.max(((numericBmi - 15) / (35 - 15)) * 100, 0), 100);
                            return (
                              <div 
                                className="absolute top-0 bottom-0 w-1.5 bg-white dark:bg-slate-900 border-x border-slate-950 dark:border-slate-50 transition-all duration-1000 shadow"
                                style={{ left: `${positionPercent}%` }}
                              />
                            );
                          })()}
                        </div>
                      </div>
                    </div>

                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'habits' && (
              <motion.div
                key="habits"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Advanced Water Card */}
                <GlassCard hover={false} className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-primary-500/10 text-primary-500 rounded-xl">
                        <Droplet className="h-5 w-5 fill-primary-500" />
                      </div>
                      <h3 className="font-bold text-sm">Advanced Hydration Log</h3>
                    </div>
                    <span className="text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-950/20 px-2 py-0.5 border border-primary-200/50 dark:border-primary-800/30 rounded-full">
                      Target: {profile.waterTarget} ml
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center py-4">
                    {/* Animated Cup visualizer */}
                    <div className="relative w-28 h-40 border-4 border-slate-200 dark:border-slate-800 rounded-b-3xl overflow-hidden shadow-inner flex flex-col justify-end bg-slate-50/50 dark:bg-slate-900/10">
                      {/* Fill layer */}
                      <div 
                        className="bg-gradient-to-t from-primary-600/70 to-primary-400/90 w-full transition-all duration-700 ease-out"
                        style={{ height: `${waterProgress}%` }}
                      >
                        {/* Wave animation effect */}
                        <div className="absolute left-0 right-0 h-4 bg-white/20 -translate-y-2 rounded-full animate-pulse"></div>
                      </div>
                      
                      {/* Numeric overlay */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                        <span className="text-3xl font-extrabold drop-shadow">{currentWater}</span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest drop-shadow">Milliliters</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <button 
                      onClick={() => subtractWater(250)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-700 transition-colors"
                      aria-label="Subtract 250ml"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    
                    <div className="flex-grow flex gap-2">
                      <button 
                        onClick={() => addWater(250)}
                        className="flex-1 py-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-xs font-bold text-primary-600 dark:text-primary-400 hover:bg-primary-100/50 transition-colors border border-primary-200/20 dark:border-primary-800/20"
                      >
                        +250ml Cup
                      </button>
                      <button 
                        onClick={() => addWater(500)}
                        className="flex-1 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold transition-colors shadow-md shadow-primary-500/25"
                      >
                        +500ml Bottle
                      </button>
                    </div>

                    <button 
                      onClick={() => addWater(1000)}
                      className="p-3 rounded-xl border border-primary-500 bg-primary-500/10 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors"
                      aria-label="Add 1000ml"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </GlassCard>

                {/* Detailed Sleep Card */}
                <GlassCard hover={false} className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 bg-accent-500/10 text-accent-500 rounded-xl">
                        <Moon className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-sm">Sleep Tracker & Quality</h3>
                    </div>
                    <span className="text-xs font-bold text-accent-600 bg-accent-50 dark:bg-accent-950/20 px-2 py-0.5 border border-accent-200/50 dark:border-accent-800/30 rounded-full">
                      Target: {profile.sleepTarget} hrs
                    </span>
                  </div>

                  <div className="space-y-5 py-2">
                    <div className="flex items-baseline gap-1.5 justify-center py-2">
                      <span className="text-5xl font-extrabold text-slate-800 dark:text-slate-100">{sleepLogged}</span>
                      <span className="text-sm text-slate-400 font-semibold">Hours slept</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Log Hours:</span>
                        <span>{sleepLogged} hrs</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="12" 
                        step="0.5" 
                        className="w-full accent-accent-500 cursor-pointer"
                        value={sleepLogged}
                        onChange={(e) => setSleepLogged(parseFloat(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-500">Sleep Quality Level:</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['Restless', 'Average', 'Deep'].map(q => (
                          <button
                            key={q}
                            onClick={() => setSleepQuality(q)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                              sleepQuality === q 
                                ? 'bg-accent-500 border-accent-600 text-white shadow-lg shadow-accent-500/10' 
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-accent-300'
                            }`}
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-100/40 dark:bg-slate-900/30 border border-slate-200/20 dark:border-slate-800/20 rounded-2xl text-xs text-slate-500 leading-normal">
                    {sleepLogged >= profile.sleepTarget ? (
                      <span className="text-success-600 dark:text-success-400 font-semibold">✓ Awesome! You reached your sleep goal of {profile.sleepTarget} hours.</span>
                    ) : (
                      <span>💡 Sleep deficit of {(profile.sleepTarget - sleepLogged).toFixed(1)} hours detected. Wind down without screens to optimize sleep scores.</span>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'breathe' && (
              <motion.div
                key="breathe"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard hover={false} className="space-y-6 flex flex-col items-center py-12">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold">Guided Breathing</h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Follow the expanding and contracting circle to calm your nervous system and relieve stress.</p>
                  </div>
                  
                  <div className="relative flex items-center justify-center w-64 h-64 my-8">
                    <motion.div 
                      className="absolute rounded-full bg-accent-500/10 w-full h-full"
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="absolute rounded-full bg-accent-500/20 w-48 h-48"
                      animate={{ scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <div className="absolute rounded-full bg-accent-500 w-24 h-24 flex items-center justify-center shadow-lg shadow-accent-500/30">
                      <span className="text-white text-xs font-bold uppercase tracking-widest animate-pulse">Breathe</span>
                    </div>
                  </div>

                  <div className="text-center space-y-1">
                    <div className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                      4-Second Box Breathing
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      Inhale for 4s, Exhale for 4s.
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: Health Score & AI Tips */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Health Score Card */}
          <GlassCard hover={false} className="text-center relative overflow-hidden flex flex-col items-center justify-center py-8">
            <div className="absolute top-4 left-4 flex items-center gap-1 text-slate-400">
              <Activity className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Health Index</span>
            </div>

            {/* Circular Ring Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center my-4">
              <svg className="w-full h-full transform -rotate-90">
                {/* SVG linear gradient definitions */}
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0e91eb" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                {/* Background Ring */}
                <circle
                  className="circle-progress-bg"
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  r={radius}
                  cx="72"
                  cy="72"
                />
                {/* Progress Ring */}
                <circle
                  className={`circle-progress-bar ${scoreColors.stroke}`}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  r={radius}
                  cx="72"
                  cy="72"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              {/* Inner score overlay */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">{healthScore}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Points</span>
              </div>
            </div>

            <h3 className="font-bold text-lg mb-1">Daily Health Score</h3>
            <p className="text-xs text-slate-500 max-w-[220px] leading-relaxed mb-4">
              This score aggregates body mass index, hydration logged, and sleep parameters.
            </p>

            <div className="w-full flex justify-around items-center border-t border-slate-100 dark:border-slate-800 pt-4 text-xs font-semibold text-slate-500">
              <div className="flex flex-col items-center">
                <span className="text-slate-800 dark:text-slate-100">{waterProgress}%</span>
                <span className="text-[9px] text-slate-400 uppercase mt-0.5">Water</span>
              </div>
              <div className="h-6 w-px bg-slate-100 dark:bg-slate-800"></div>
              <div className="flex flex-col items-center">
                <span className="text-slate-800 dark:text-slate-100">{(sleepLogged / profile.sleepTarget * 100).toFixed(0)}%</span>
                <span className="text-[9px] text-slate-400 uppercase mt-0.5">Sleep</span>
              </div>
              <div className="h-6 w-px bg-slate-100 dark:bg-slate-800"></div>
              <div className="flex flex-col items-center">
                <span className="text-slate-800 dark:text-slate-100">{bmi}</span>
                <span className="text-[9px] text-slate-400 uppercase mt-0.5">BMI</span>
              </div>
            </div>
          </GlassCard>

          {/* Daily AI Tip Card */}
          <GlassCard hover={false} className="border border-primary-500/20 shadow-md shadow-primary-500/5 space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-primary-500" />
                <h3 className="font-bold text-sm">Daily AI Health Tip</h3>
              </div>
              <button 
                onClick={fetchDailyTip}
                disabled={isTipLoading}
                className="p-1 rounded-lg text-slate-400 hover:text-primary-500 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                aria-label="Refresh AI Tip"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isTipLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="min-h-[100px] flex items-center justify-center">
              {isTipLoading ? (
                <div className="w-full space-y-2.5">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-full"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-11/12"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse w-4/5"></div>
                </div>
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-left">
                  {aiTip || "Logging data adjusts your AI health tip instantly. Tap the refresh icon above if needed."}
                </p>
              )}
            </div>
          </GlassCard>

        </div>

      </div>

      {/* Profile Editor Modal Overlay */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditingProfile(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 z-10"
            >
              <h3 className="text-lg font-bold mb-4">Edit Health Profile</h3>
              
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="glass-input py-2" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)} 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Age (Years)</label>
                    <input 
                      type="number" 
                      className="glass-input py-2" 
                      value={editAge}
                      onChange={(e) => setEditAge(e.target.value)} 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
                    <select 
                      className="glass-input py-2 bg-white dark:bg-slate-950"
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Weight (kg)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      className="glass-input py-2" 
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)} 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Height (cm)</label>
                    <input 
                      type="number" 
                      className="glass-input py-2" 
                      value={editHeight}
                      onChange={(e) => setEditHeight(e.target.value)} 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Water Target (ml)</label>
                    <input 
                      type="number" 
                      step="250" 
                      className="glass-input py-2" 
                      value={editWaterTarget}
                      onChange={(e) => setEditWaterTarget(e.target.value)} 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Sleep Target (hrs)</label>
                    <input 
                      type="number" 
                      step="0.5" 
                      className="glass-input py-2" 
                      value={editSleepTarget}
                      onChange={(e) => setEditSleepTarget(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsEditingProfile(false)}
                    className="flex-1 glass-button-secondary py-2"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 glass-button-primary py-2"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="text-center mt-12 pb-4">
        <p className="text-[10px] text-slate-400 dark:text-zinc-600 font-mono tracking-wider opacity-60">
          Made by Shivansh Mishra
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
