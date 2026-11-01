/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Mail,
  Phone,
  Lock,
  Building,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { validateAdminSignup, AdminRegistrationInput } from '../utils/authUtils';

export interface AdminUser {
  fullName: string;
  fullNameAmharic?: string;
  email: string;
  phone: string;
  roleTitle: string;
  adminId: string;
  dateRegistered: string;
}

interface AdminSignupPageProps {
  onAdminAuthenticated: (admin: AdminUser) => void;
  onPreviewPublicSite: () => void;
  lang: 'en' | 'am';
  setLang: (lang: 'en' | 'am') => void;
}

export const AdminSignupPage: React.FC<AdminSignupPageProps> = ({
  onAdminAuthenticated,
  onPreviewPublicSite,
  lang,
  setLang,
}) => {
  const [activeMode, setActiveMode] = useState<'signup' | 'login'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Signup fields
  const [fullName, setFullName] = useState('');
  const [fullNameAmharic, setFullNameAmharic] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+251 91 ');
  const [roleTitle, setRoleTitle] = useState('Principal & School Director');
  const [moeCode, setMoeCode] = useState('HMM-MOE-2017');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Login fields
  const [loginIdentifier, setLoginIdentifier] = useState('admin@hailemariammamo.edu.et');
  const [loginPassword, setLoginPassword] = useState('debberhan2017');

  const handleDemoFill = () => {
    setFullName('Berhanu Wolde Mengesha');
    setFullNameAmharic('ብርሃኑ ወልደ መንገሻ');
    setEmail('director@hailemariammamo.edu.et');
    setPhone('+251 91 142 5566');
    setRoleTitle('Principal & School Director');
    setMoeCode('HMM-MOE-2017');
    setPassword('debberhan2017');
    setConfirmPassword('debberhan2017');
    setErrorMsg(null);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const input: AdminRegistrationInput = {
      fullName,
      fullNameAmharic,
      email,
      phone,
      roleTitle,
      moeCode,
      password,
      confirmPassword,
    };

    const validation = validateAdminSignup(input);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Please check the registration details.');
      return;
    }

    const newAdmin: AdminUser = {
      fullName: input.fullName.trim(),
      fullNameAmharic: input.fullNameAmharic?.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      roleTitle: input.roleTitle,
      adminId: `DIR-HMM-${Math.floor(100 + Math.random() * 900)}`,
      dateRegistered: new Date().toISOString().split('T')[0],
    };

    try {
      localStorage.setItem('hmm_school_admin', JSON.stringify(newAdmin));
      localStorage.setItem('hmm_admin_logged_in', 'true');
    } catch {
      // Local storage fallback
    }

    setSuccessMsg(
      lang === 'am'
        ? `አስተዳዳሪ ${newAdmin.fullName} በተሳካ ሁኔታ ተመዝግቧል! ወደ ፖርታል በመግባት ላይ...`
        : `Administrator ${newAdmin.fullName} successfully registered! Launching school portal...`
    );

    setTimeout(() => {
      onAdminAuthenticated(newAdmin);
    }, 600);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!loginIdentifier || !loginPassword) {
      setErrorMsg(lang === 'am' ? 'እባክዎ ኢሜይል እና የይለፍ ቃል ያስገቡ።' : 'Please provide both email/username and password.');
      return;
    }

    // Check if an admin was previously registered in localStorage
    let storedAdmin: AdminUser | null = null;
    try {
      const data = localStorage.getItem('hmm_school_admin');
      if (data) storedAdmin = JSON.parse(data);
    } catch {
      storedAdmin = null;
    }

    // Default or stored admin
    const activeAdmin: AdminUser = storedAdmin || {
      fullName: 'Berhanu Wolde Mengesha, M.Ed.',
      fullNameAmharic: 'ብርሃኑ ወልደ መንገሻ',
      email: 'director@hailemariammamo.edu.et',
      phone: '+251 91 142 5566',
      roleTitle: 'Principal & School Director',
      adminId: 'DIR-HMM-001',
      dateRegistered: '2024-09-01',
    };

    try {
      localStorage.setItem('hmm_admin_logged_in', 'true');
    } catch {
      // fallback
    }

    setSuccessMsg(lang === 'am' ? 'እንኳን ደህና መጡ! ወደ ፖርታል በመግባት ላይ...' : 'Welcome back! Launching school portal...');
    setTimeout(() => {
      onAdminAuthenticated(activeAdmin);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white flex flex-col justify-between py-6 px-3 sm:px-6 w-full max-w-full overflow-x-hidden">
      {/* Top Ministry Ribbon */}
      <div className="w-full max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between py-2 border-b border-emerald-900/50">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#075E38] inline-block ring-2 ring-emerald-400"></span>
            <span className="w-3 h-3 rounded-full bg-[#EAB308] inline-block ring-2 ring-amber-400"></span>
            <span className="w-3 h-3 rounded-full bg-[#DC2626] inline-block ring-2 ring-rose-400"></span>
            <span className="text-[11px] sm:text-xs text-slate-300 font-medium pl-1">
              Federal Democratic Republic of Ethiopia • Ministry of Education (MoE)
            </span>
          </div>

          <button
            onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
            className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer transition-colors"
          >
            {lang === 'en' ? 'አማርኛ' : 'English'}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-xl w-full mx-auto bg-slate-900/95 border border-emerald-800/60 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Card Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-emerald-950/80 to-slate-900 border-b border-emerald-800/40 text-center relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-900/90 border-2 border-amber-400 shadow-lg mb-3">
            <div className="text-center font-black tracking-tighter text-amber-300">
              <span className="text-xl block leading-none">HMM</span>
              <span className="text-[9px] block text-emerald-300">1958 E.C.</span>
            </div>
          </div>

          <div className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full text-[11px] font-bold mb-2">
            ደብረ ብርሃን • Amhara Region • Alt. 2,840m
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            ደብረ ብርሃን ኃይለማሪያም ማሞ
          </h1>
          <p className="text-sm sm:text-base font-semibold text-emerald-400">
            Hailemariam Mamo Secondary & Preparatory School
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'am'
              ? 'የትምህርት ቤት አስተዳዳሪ ምዝገባ እና የተጠቃሚ መመዝገቢያ ፖርታል'
              : 'Official School Administrator Registration & Provisioning Portal'}
          </p>

          {/* Mode Switcher */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-slate-950/90 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveMode('signup');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                activeMode === 'signup'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'am' ? 'አዲስ አስተዳዳሪ መመዝገቢያ' : '1. Register School Admin'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMode('login');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                activeMode === 'login'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'am' ? 'የአስተዳዳሪ መግቢያ' : '2. Admin Sign In'}
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-950/80 border border-rose-700/60 rounded-xl flex items-start space-x-2 text-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-emerald-950/80 border border-emerald-600/80 rounded-xl flex items-start space-x-2 text-emerald-200 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeMode === 'signup' ? (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  {lang === 'am' ? 'የአስተዳዳሪ መረጃ' : 'Director Credentials'}
                </span>
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="flex items-center space-x-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 cursor-pointer bg-amber-950/50 hover:bg-amber-900/60 px-2 py-0.5 rounded border border-amber-600/40"
                  title="Auto fill sample administrator details"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{lang === 'am' ? 'ናሙና መረጃ ሙላ' : 'Auto-Fill Principal Sample'}</span>
                </button>
              </div>

              {/* Full Name English & Amharic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'ሙሉ ስም (እንግሊዝኛ)' : 'Full Name (English)'} *
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Berhanu Wolde Mengesha"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'ሙሉ ስም (አማርኛ)' : 'Full Name (አማርኛ)'}
                  </label>
                  <input
                    type="text"
                    value={fullNameAmharic}
                    onChange={(e) => setFullNameAmharic(e.target.value)}
                    placeholder="ለምሳሌ፡ ብርሃኑ ወልደ መንገሻ"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'ኦፊሴላዊ የትምህርት ቤት ኢሜይል' : 'Official Admin Email'} *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="director@hailemariammamo.edu.et"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'ስልክ ቁጥር' : 'Contact Phone'} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+251 91 142 5566"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Admin Role Designation & MoE Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'የትምህርት ቤት የኃላፊነት ደረጃ' : 'Administrative Role'} *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <select
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Principal & School Director">Principal & School Director</option>
                      <option value="Vice Principal - Academics">Vice Principal (Academic Affairs)</option>
                      <option value="Head of Administration & SIS">Head of Administration & SIS</option>
                      <option value="Senior Registrar Officer">Senior Registrar Officer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'የሚኒስቴር ኮድ (MoE Code)' : 'MoE School Code'} *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={moeCode}
                      onChange={(e) => setMoeCode(e.target.value)}
                      placeholder="HMM-MOE-2017"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-amber-300 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'የይለፍ ቃል ፍጠር' : 'Create Admin Password'} *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'የይለፍ ቃል አረጋግጥ' : 'Confirm Password'} *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center space-x-2 text-sm cursor-pointer transition-all transform active:scale-[0.99]"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <span>
                    {lang === 'am'
                      ? 'አስተዳዳሪውን መዝግብ እና ፖርታሉን ክፈት'
                      : 'Register School Admin & Launch Portal'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-emerald-200" />
                </button>
              </div>

              <p className="text-[11px] text-center text-slate-400">
                {lang === 'am'
                  ? 'ይህ ምዝገባ በደብረ ብርሃን ትምህርት መምሪያ እና የትምህርት ሚኒስቴር ደንብ መሰረት የተረጋገጠ ነው።'
                  : 'Empowered under Debre Berhan Education Office & Federal Ministry of Education guidelines.'}
              </p>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {lang === 'am' ? 'የአስተዳዳሪ ኢሜይል ወይም መለያ' : 'Admin Email or Username'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="director@hailemariammamo.edu.et or admin"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {lang === 'am' ? 'የይለፍ ቃል' : 'Admin Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-9 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center space-x-2 text-sm cursor-pointer transition-all"
                >
                  <ShieldCheck className="w-5 h-5 text-amber-300" />
                  <span>{lang === 'am' ? 'ወደ አስተዳዳሪ ዴስክ ግባ' : 'Sign In as Administrator'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick default credential info */}
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-400">
                <div className="font-semibold text-amber-300 mb-1">Default Pre-configured Admin:</div>
                <div className="flex justify-between">
                  <span>Username:</span> <code className="text-emerald-300">admin</code>
                </div>
                <div className="flex justify-between">
                  <span>Password:</span> <code className="text-emerald-300">debberhan2017</code>
                </div>
              </div>
            </form>
          )}

          {/* Public Preview Alternative */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <button
              type="button"
              onClick={onPreviewPublicSite}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <span>{lang === 'am' ? 'ወይም የትምህርት ቤቱን ድረ-ገጽ ያለመግቢያ ተመልከት' : 'Or Preview Public School Website as Visitor'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer attribution */}
      <div className="w-full max-w-xl mx-auto mt-6 text-center text-slate-500 text-[11px]">
        Hailemariam Mamo Secondary & Preparatory School • Debre Berhan, Amhara, Ethiopia
      </div>
    </div>
  );
};
