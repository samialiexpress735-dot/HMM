/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Database,
  KeyRound,
  Check,
  Settings
} from 'lucide-react';
import {
  authenticateAdminFromCloud,
  isSupabaseConfigured,
  getSupabaseStatus,
  setSupabaseCredentials,
  getSupabaseCredentials
} from '../lib/supabase';

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
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login credentials fields
  const [loginIdentifier, setLoginIdentifier] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('debberhan2017');

  // Supabase Credentials Settings Modal / Accordion
  const [showConfigModal, setShowConfigModal] = useState(false);
  const currentCredentials = getSupabaseCredentials();
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(currentCredentials.url);
  const [supabaseKeyInput, setSupabaseKeyInput] = useState(currentCredentials.key);
  const [configSaved, setConfigSaved] = useState(false);

  const supabaseStatus = getSupabaseStatus();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const id = loginIdentifier.trim();
    const pass = loginPassword.trim();

    if (!id || !pass) {
      setErrorMsg(
        lang === 'am'
          ? 'እባክዎ ኢሜይል ወይም መለያ እና የይለፍ ቃል ያስገቡ።'
          : 'Please enter both administrator username/email and password.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Authenticate against Supabase "profiles" table (or Supabase Auth / default director)
      const res = await authenticateAdminFromCloud(id, pass);

      if (!res.success || !res.admin) {
        setIsSubmitting(false);
        setErrorMsg(
          res.error ||
            (lang === 'am'
              ? 'የተሳሳተ የአስተዳዳሪ መለያ ወይም የይለፍ ቃል! እባክዎ በሱፓቤዝ (Supabase) የተመዘገበውን ያስገቡ።'
              : 'Invalid credentials. Please verify your administrator email and password in your Supabase "profiles" table.')
        );
        return;
      }

      const authenticatedAdmin = res.admin;

      try {
        localStorage.setItem('hmm_admin_logged_in', 'true');
        localStorage.setItem('hmm_school_admin', JSON.stringify(authenticatedAdmin));
      } catch {
        // fallback
      }

      setSuccessMsg(
        lang === 'am'
          ? `እንኳን ደህና መጡ ${authenticatedAdmin.fullName}! ወደ አስተዳዳሪ ዴስክ በመግባት ላይ...`
          : `Authenticated as ${authenticatedAdmin.fullName}! Opening School Administration Desk...`
      );

      setTimeout(() => {
        setIsSubmitting(false);
        onAdminAuthenticated(authenticatedAdmin);
      }, 400);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err?.message || 'Authentication error occurred.');
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrlInput.trim() || !supabaseKeyInput.trim()) return;

    setSupabaseCredentials(supabaseUrlInput.trim(), supabaseKeyInput.trim());
    setConfigSaved(true);
    setTimeout(() => {
      setConfigSaved(false);
      setShowConfigModal(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f7f2ed] text-[#20130d] flex flex-col justify-between py-6 px-3 sm:px-6 w-full max-w-full overflow-x-hidden font-sans">
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
      <div className="max-w-md w-full mx-auto bg-white border border-[#ebd3c4] rounded-3xl shadow-xl overflow-hidden">
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
          <p className="text-sm font-semibold text-[#e8b982]">
            Hailemariam Mamo Secondary & Preparatory School
          </p>
          <p className="text-xs text-[#ebd3c4] mt-1">
            {lang === 'am'
              ? 'የትምህርት ቤት አስተዳዳሪና ዳይሬክተር መግቢያ'
              : 'School Director & Administration Sign In'}
          </p>

          {/* Supabase Status Pill */}
          <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#1a0f0a] border border-[#4a2e22] text-[#d4ab94]">
            <Database className="w-3.5 h-3.5 text-[#c68a4c]" />
            <span>
              {supabaseStatus.isConfigured ? 'Supabase Database Connected' : 'Supabase Configurable'}
            </span>
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              className="text-[#e8b982] hover:underline ml-1 cursor-pointer font-bold"
              title="Configure or inspect Supabase URL & Key"
            >
              [Settings]
            </button>
          </div>
        </div>

        {/* Card Body: Pure Sign In Form */}
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

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#20130d] mb-1">
                {lang === 'am' ? 'የአስተዳዳሪ ኢሜይል ወይም መለያ' : 'Administrator Email or Username'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#786154] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. director@hailemariammamo.edu.et or admin"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs sm:text-sm text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#20130d] mb-1">
                {lang === 'am' ? 'የይለፍ ቃል' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#786154] absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter administrator passcode"
                  className="w-full pl-9 pr-9 py-2.5 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs sm:text-sm text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#786154] hover:text-[#20130d] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
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
                    ? (lang === 'am' ? 'ማረጋገጫ በመፈተሽ ላይ...' : 'Verifying with Supabase...')
                    : (lang === 'am' ? 'ወደ አስተዳዳሪ ዴስክ ግባ' : 'Sign In as Administrator')}
                </span>
                {!isSubmitting && <ArrowRight className="w-4 h-4 text-[#e8b982]" />}
              </button>
            </div>
          </form>

          {/* Instructions for Manual User Creation in Supabase */}
          <div className="mt-5 p-3.5 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-[11px] text-[#786154] space-y-1.5">
            <div className="font-bold text-[#352016] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[#c68a4c]" />
              <span>{lang === 'am' ? 'አዲስ አስተዳዳሪ በሱፓቤዝ ለመመዝገብ' : 'How to Add Administrators in Supabase:'}</span>
            </div>
            <p className="leading-relaxed">
              Open your <strong>Supabase Table Editor &gt; profiles</strong> and add a row with your admin’s <code>email</code>, <code>password</code>, <code>full_name</code>, and <code>role = &apos;Admin&apos;</code>. Once added, log in directly using that email and password.
            </p>
            <div className="pt-1 border-t border-[#ebd3c4]/60 flex items-center justify-between text-[10px]">
              <span>Default Director account:</span>
              <code className="text-[#352016] font-bold bg-[#f3e8df] px-1 py-0.5 rounded">admin / debberhan2017</code>
            </div>
          </div>

          {/* Public Preview Alternative */}
          <div className="mt-5 pt-4 border-t border-[#ebd3c4] text-center">
            <button
              type="button"
              onClick={onPreviewPublicSite}
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#6d3e23] hover:text-[#20130d] transition-colors cursor-pointer"
            >
              <span>{lang === 'am' ? 'የትምህርት ቤቱን ድረ-ገጽ ያለመግቢያ ተመልከት' : 'Preview Public School Website as Visitor'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Connection Settings Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-[#150c08]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#ebd3c4] shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ebd3c4]">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#6d3e23]" />
                <h3 className="font-extrabold text-[#20130d] text-base">Supabase Connection Settings</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-[#786154] hover:text-[#20130d] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#786154] mb-4 leading-relaxed">
              If deploying on Vercel, set these in <strong>Project Settings &gt; Environment Variables</strong> as <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>. You can also paste them directly below:
            </p>

            <form onSubmit={handleSaveSupabaseConfig} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#20130d] mb-1">Project URL (VITE_SUPABASE_URL):</label>
                <input
                  type="url"
                  required
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#20130d] mb-1">Anon Public Key (VITE_SUPABASE_ANON_KEY):</label>
                <input
                  type="text"
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKeyInput}
                  onChange={(e) => setSupabaseKeyInput(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs font-mono text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                />
              </div>

              {configSaved && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 font-bold flex items-center gap-1.5 text-xs">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Supabase credentials saved and initialized successfully!</span>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-xl text-[#786154] hover:bg-[#f3e8df] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#352016] hover:bg-[#20130d] text-white font-bold rounded-xl shadow-xs"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer attribution */}
      <div className="max-w-4xl mx-auto text-center mt-6 text-xs text-[#786154]">
        <p>Hailemariam Mamo Secondary & Preparatory School • Established 1958 E.C. (1965 G.C.) • Debre Berhan, Ethiopia</p>
      </div>
    </div>
  );
};
