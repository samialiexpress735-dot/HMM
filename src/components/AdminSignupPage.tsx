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
  ExternalLink,
  RefreshCw,
  Shield,
  Fingerprint
} from 'lucide-react';
import { validateAdminSignup, verifyAdminCredentials, AdminRegistrationInput } from '../utils/authUtils';

export interface AdminUser {
  fullName: string;
  fullNameAmharic?: string;
  email: string;
  phone: string;
  roleTitle: string;
  adminId: string;
  dateRegistered: string;
  password?: string;
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
  const [activeMode, setActiveMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
  const [loginIdentifier, setLoginIdentifier] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('debberhan2017');

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

    setIsSubmitting(true);

    const newAdmin: AdminUser = {
      fullName: input.fullName.trim(),
      fullNameAmharic: input.fullNameAmharic?.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      roleTitle: input.roleTitle,
      adminId: `DIR-HMM-${Math.floor(100 + Math.random() * 900)}`,
      dateRegistered: new Date().toISOString().split('T')[0],
      password: input.password
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
      setIsSubmitting(false);
      onAdminAuthenticated(newAdmin);
    }, 450);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const id = loginIdentifier.trim().toLowerCase();
    const pass = loginPassword.trim();

    if (!id || !pass) {
      setErrorMsg(lang === 'am' ? 'እባክዎ ኢሜይል/መለያ እና የይለፍ ቃል ያስገቡ።' : 'Please provide both email/username and password.');
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

    const verification = verifyAdminCredentials(loginIdentifier, loginPassword, storedAdmin);

    // Security Gate Enforcement: reject if wrong password or unauthorized user
    if (!verification.success || !verification.admin) {
      setIsSubmitting(false);
      setErrorMsg(
        lang === 'am'
          ? 'የተሳሳተ መለያ ወይም የይለፍ ቃል! መዳረሻ ተከልክሏል። እባክዎ በትክክል ያስገቡ።'
          : verification.error || 'Invalid administrator credentials. Access denied.'
      );
      return;
    }

    const authenticatedAdmin = verification.admin;

    setIsSubmitting(true);

    try {
      localStorage.setItem('hmm_admin_logged_in', 'true');
      localStorage.setItem('hmm_school_admin', JSON.stringify(authenticatedAdmin));
    } catch {
      // fallback
    }

    setSuccessMsg(
      lang === 'am'
        ? `እንኳን ደህና መጡ ${authenticatedAdmin.fullName}! የትምህርት ቤት አስተዳዳሪ ዴስክ በመከፈት ላይ...`
        : `Authenticated successfully as ${authenticatedAdmin.fullName}. Launching secured Admin Desk...`
    );

    setTimeout(() => {
      setIsSubmitting(false);
      onAdminAuthenticated(authenticatedAdmin);
    }, 450);
  };

  // Quick 1-click login for authorized testing
  const handleQuickDirectorLogin = () => {
    setLoginIdentifier('admin');
    setLoginPassword('debberhan2017');
    setIsSubmitting(true);
    setTimeout(() => {
      const director: AdminUser = {
        fullName: 'Berhanu Wolde Mengesha, M.Ed.',
        fullNameAmharic: 'ብርሃኑ ወልደ መንገሻ',
        email: 'director@hailemariammamo.edu.et',
        phone: '+251 91 142 5566',
        roleTitle: 'Principal & School Director',
        adminId: 'DIR-HMM-001',
        dateRegistered: '2024-09-01'
      };
      try {
        localStorage.setItem('hmm_admin_logged_in', 'true');
        localStorage.setItem('hmm_school_admin', JSON.stringify(director));
      } catch {
        // ignore
      }
      setIsSubmitting(false);
      onAdminAuthenticated(director);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#f7f2ed] text-[#20130d] flex flex-col justify-between py-6 px-3 sm:px-6 w-full max-w-full overflow-x-hidden">
      {/* Top Ministry Ribbon */}
      <div className="w-full max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between py-2 border-b border-[#ebd3c4]">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#075E38] inline-block ring-2 ring-emerald-300"></span>
            <span className="w-3 h-3 rounded-full bg-[#EAB308] inline-block ring-2 ring-amber-300"></span>
            <span className="w-3 h-3 rounded-full bg-[#DC2626] inline-block ring-2 ring-rose-300"></span>
            <span className="text-[11px] sm:text-xs text-[#786154] font-medium pl-1">
              Federal Democratic Republic of Ethiopia • Ministry of Education (MoE)
            </span>
          </div>

          <button
            onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
            className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#ffffff] hover:bg-[#ebd3c4] text-[#20130d] border border-[#ebd3c4] cursor-pointer transition-colors shadow-2xs"
          >
            {lang === 'en' ? 'አማርኛ' : 'English'}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-xl w-full mx-auto bg-white border border-[#ebd3c4] rounded-3xl shadow-xl overflow-hidden">
        {/* Card Header in Warm Brown */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-[#352016] to-[#20130d] border-b border-[#ebd3c4]/40 text-center relative text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#4a2e22] border-2 border-[#e8b982] shadow-lg mb-3">
            <div className="text-center font-black tracking-tighter text-[#e8b982]">
              <span className="text-xl block leading-none">HMM</span>
              <span className="text-[9px] block text-[#fbf9f6]/80">1958 E.C.</span>
            </div>
          </div>

          <div className="inline-block px-3 py-1 bg-[#ffffff]/10 text-[#e8b982] border border-[#c68a4c]/40 rounded-full text-[11px] font-bold mb-2">
            ደብረ ብርሃን • Amhara Region • Alt. 2,840m
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            ደብረ ብርሃን ኃይለማሪያም ማሞ
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#e8b982]">
            Hailemariam Mamo Secondary & Preparatory School
          </p>
          <p className="text-xs text-[#ebd3c4] mt-1">
            {lang === 'am'
              ? 'የትምህርት ቤት አስተዳዳሪ ደህንነቱ የተጠበቀ መግቢያ እና ምዝገባ'
              : 'Secured School Administrator Authentication & Provisioning Portal'}
          </p>

          {/* Mode Switcher */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-[#1a0f0a] rounded-xl border border-[#4a2e22] text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setActiveMode('login');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                activeMode === 'login'
                  ? 'bg-[#c68a4c] text-[#1a0f0a] shadow font-extrabold'
                  : 'text-[#d4ab94] hover:text-white'
              }`}
            >
              {lang === 'am' ? '1. የአስተዳዳሪ መግቢያ' : '1. Admin Sign In'}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveMode('signup');
                setErrorMsg(null);
              }}
              className={`py-2 rounded-lg transition-all cursor-pointer ${
                activeMode === 'signup'
                  ? 'bg-[#c68a4c] text-[#1a0f0a] shadow font-extrabold'
                  : 'text-[#d4ab94] hover:text-white'
              }`}
            >
              {lang === 'am' ? '2. አዲስ አስተዳዳሪ መዝግብ' : '2. Register New Admin'}
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 bg-[#ffffff]">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 bg-[#f3e8df] border border-[#c68a4c] rounded-xl flex items-start space-x-2 text-[#352016] text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#6d3e23] flex-shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#20130d] mb-1">
                  {lang === 'am' ? 'የአስተዳዳሪ ኢሜይል ወይም መለያ' : 'Admin Email or Username'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#786154] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="admin or director@hailemariammamo.edu.et"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs sm:text-sm text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#20130d] mb-1">
                  {lang === 'am' ? 'የይለፍ ቃል' : 'Admin Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#786154] absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-9 py-2.5 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs sm:text-sm text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#786154] hover:text-[#20130d] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#352016] hover:bg-[#20130d] disabled:opacity-60 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center space-x-2 text-sm cursor-pointer transition-all btn-animated"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-[#e8b982]" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-[#e8b982]" />
                  )}
                  <span>
                    {isSubmitting
                      ? (lang === 'am' ? 'ማረጋገጫ በመፈተሽ ላይ...' : 'Verifying Admin Credentials...')
                      : (lang === 'am' ? 'ወደ አስተዳዳሪ ዴስክ ግባ' : 'Sign In as Administrator')}
                  </span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4 text-[#e8b982]" />}
                </button>

                {/* 1-Click Fast Auth Button for Quick Verification */}
                <button
                  type="button"
                  onClick={handleQuickDirectorLogin}
                  className="w-full py-2 bg-[#f3e8df] hover:bg-[#ebd3c4] text-[#6d3e23] font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-[#ebd3c4] cursor-pointer transition-all"
                >
                  <Fingerprint className="w-4 h-4 text-[#6d3e23]" />
                  <span>
                    {lang === 'am' ? 'በ1-ጠቅታ የት/ቤት ዳይሬክተር ሆነህ ግባ (ቀጥታ መሞከሪያ)' : '1-Click Authenticate as School Director (Fast Access)'}
                  </span>
                </button>
              </div>

              {/* Security & Credentials info */}
              <div className="p-3.5 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-[11px] text-[#786154]">
                <div className="font-bold text-[#352016] mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#c68a4c]" />
                  <span>{lang === 'am' ? 'የተፈቀደላቸው የአስተዳዳሪ መለያዎች' : 'Default Director Credentials:'}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-[#ebd3c4]/70">
                  <span className="text-[#786154]">{lang === 'am' ? 'የተጠቃሚ ስም:' : 'Username:'}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <code className="text-[#352016] font-bold bg-[#f3e8df] px-1.5 py-0.5 rounded">admin</code>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#786154]">{lang === 'am' ? 'የይለፍ ቃል:' : 'Password:'}</span>
                  <code className="text-[#352016] font-mono font-bold bg-[#f3e8df] px-1.5 py-0.5 rounded">debberhan2017</code>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#786154] font-bold uppercase tracking-wider">
                  {lang === 'am' ? 'የአስተዳዳሪ መረጃ' : 'Director Credentials'}
                </span>
              </div>

              {/* Full Name English & Amharic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#20130d] mb-1">
                    {lang === 'am' ? 'ሙሉ ስም (እንግሊዝኛ)' : 'Full Name (English)'} *
                  </label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-[#786154] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Berhanu Wolde"
                      className="w-full pl-9 pr-3 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs sm:text-sm text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20130d] mb-1">
                    {lang === 'am' ? 'ሙሉ ስም (አማርኛ)' : 'Full Name (አማርኛ)'}
                  </label>
                  <input
                    type="text"
                    value={fullNameAmharic}
                    onChange={(e) => setFullNameAmharic(e.target.value)}
                    placeholder="ለምሳሌ፡ ብርሃኑ ወልደ"
                    className="w-full px-3 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs sm:text-sm text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#20130d] mb-1">
                    {lang === 'am' ? 'የአስተዳዳሪ ኢሜይል' : 'Admin Email'} *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#786154] absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@hailemariammamo.edu.et"
                      className="w-full pl-9 pr-3 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs sm:text-sm text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20130d] mb-1">
                    {lang === 'am' ? 'ስልክ ቁጥር' : 'Phone'} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#786154] absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+251 91 142 5566"
                      className="w-full pl-9 pr-3 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs sm:text-sm text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                    />
                  </div>
                </div>
              </div>

              {/* Role Title & MoE Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#20130d] mb-1">
                    {lang === 'am' ? 'የትምህርት ቤት ኃላፊነት' : 'Role Title'} *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#786154] absolute left-3 top-2.5" />
                    <select
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs sm:text-sm text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                    >
                      <option value="Principal & School Director">Principal & School Director</option>
                      <option value="Vice Principal - Academics">Vice Principal - Academics</option>
                      <option value="Senior Registrar Officer">Senior Registrar Officer</option>
                      <option value="IT & SIS Administrator">IT & SIS Administrator</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20130d] mb-1">
                    {lang === 'am' ? 'የትምህርት ሚኒስቴር ኮድ' : 'MoE School Code'} *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#786154] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={moeCode}
                      onChange={(e) => setMoeCode(e.target.value)}
                      placeholder="HMM-MOE-2017"
                      className="w-full pl-9 pr-3 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs sm:text-sm text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#20130d] mb-1">
                    {lang === 'am' ? 'የይለፍ ቃል' : 'Password'} *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#786154] absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-9 pr-8 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs sm:text-sm text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-[#786154] hover:text-[#20130d] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#20130d] mb-1">
                    {lang === 'am' ? 'የይለፍ ቃል አረጋግጥ' : 'Confirm Password'} *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#786154] absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-9 pr-3 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs sm:text-sm text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#352016] hover:bg-[#20130d] disabled:opacity-60 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center space-x-2 text-sm cursor-pointer transition-all btn-animated"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-5 h-5 animate-spin text-[#e8b982]" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-[#e8b982]" />
                  )}
                  <span>
                    {isSubmitting
                      ? (lang === 'am' ? 'በመመዝገብ ላይ...' : 'Registering Administrator...')
                      : (lang === 'am' ? 'አስተዳዳሪውን መዝግብ እና ፖርታሉን ክፈት' : 'Register School Admin & Launch Portal')}
                  </span>
                  {!isSubmitting && <ArrowRight className="w-4 h-4 text-[#e8b982]" />}
                </button>
              </div>
            </form>
          )}

          {/* Public Preview Alternative */}
          <div className="mt-6 pt-5 border-t border-[#ebd3c4] text-center">
            <button
              type="button"
              onClick={onPreviewPublicSite}
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#6d3e23] hover:text-[#20130d] transition-colors cursor-pointer"
            >
              <span>{lang === 'am' ? 'ወይም የትምህርት ቤቱን ድረ-ገጽ ያለመግቢያ ተመልከት' : 'Or Preview Public School Website as Visitor'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer attribution */}
      <div className="max-w-4xl mx-auto text-center mt-6 text-xs text-[#786154]">
        <p>Hailemariam Mamo Secondary & Preparatory School • Established 1958 E.C. (1965 G.C.) • Debre Berhan, Ethiopia</p>
      </div>
    </div>
  );
};
