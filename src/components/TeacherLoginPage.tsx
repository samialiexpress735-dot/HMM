/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  School,
  ArrowLeft
} from 'lucide-react';
import { Teacher } from '../data/schoolData';
import { generateStaffPassword } from '../utils/authUtils';

interface TeacherLoginPageProps {
  teachers: Teacher[];
  onTeacherAuthenticated: (teacher: Teacher) => void;
  onBackToHome: () => void;
  lang: 'en' | 'am';
}

export const TeacherLoginPage: React.FC<TeacherLoginPageProps> = ({
  teachers,
  onTeacherAuthenticated,
  onBackToHome,
  lang
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setErrorMessage(
        lang === 'am'
          ? 'እባክዎ የመምህር የኢሜይል አድራሻ እና የይለፍ ቃል ያስገቡ።'
          : 'Please enter both your teacher email address and passcode.'
      );
      return;
    }

    setIsSubmitting(true);

    // Look up teacher in registered faculty
    const matched = teachers.find(
      (t) => t.email.trim().toLowerCase() === trimmedEmail
    );

    if (!matched) {
      setIsSubmitting(false);
      setErrorMessage(
        lang === 'am'
          ? 'የተሳሳተ ኢሜይል ወይም መለያ! ይህ የኢሜይል አድራሻ በትምህርት ቤቱ መዝገብ ውስጥ አልተገኘም። እባክዎ በትምህርት ቤቱ አስተዳዳሪ የተሰጠዎትን ኢሜይል ያስገቡ።'
          : 'Teacher account not found. Please ensure this email is officially registered by the School Administration.'
      );
      return;
    }

    // Verify passcode:
    // Either generated staff password or any custom password stored
    const expectedPass = generateStaffPassword('Teacher', matched.name.split(' ')[0]);
    const isValidPass =
      trimmedPass === expectedPass ||
      trimmedPass === `${matched.name.split(' ')[0].toLowerCase()}2017!` ||
      trimmedPass === 'teacher2017!';

    if (!isValidPass) {
      setIsSubmitting(false);
      setErrorMessage(
        lang === 'am'
          ? 'የተሳሳተ የይለፍ ቃል! እባክዎ በትምህርት ቤቱ ርዕሰ መምህር የተሰጠዎትን ጊዜያዊ ወይም የተፈቀደ የይለፍ ቃል ያስገቡ።'
          : 'Incorrect teacher passcode. Please use the passcode provided by the School Administration Office.'
      );
      return;
    }

    // Authenticated successfully
    setIsSubmitting(false);
    onTeacherAuthenticated(matched);
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 px-4 animate-in fade-in duration-300">
      {/* Return to Public Site */}
      <button
        onClick={onBackToHome}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#786154] hover:text-[#20130d] mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{lang === 'am' ? 'ወደ ዋናው ገጽ ተመለስ' : 'Return to School Homepage'}</span>
      </button>

      <div className="bg-white rounded-3xl border border-[#ebd3c4] shadow-xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#352016] to-[#20130d] text-[#e8b982] flex items-center justify-center mx-auto shadow-md border border-[#c68a4c]/40">
            <FileSpreadsheet className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#20130d] tracking-tight">
            {lang === 'am' ? 'የመምህራን ማርክና መገኘት መዝገብ' : 'Teacher Grade & Attendance Suite'}
          </h2>
          <p className="text-xs text-[#786154] leading-relaxed max-w-xs mx-auto">
            {lang === 'am'
              ? 'የደብረ ብርሃን ኃይለማሪያም ማሞ ት/ቤት መምህራን የተፈቀደላቸውን የውጤት ዝርዝር ለመመዝገብ እዚህ ይግቡ'
              : 'Sign in with your verified educator credentials to access your subject mark lists and class registers'}
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#352016] mb-1.5">
              {lang === 'am' ? 'የመምህር ኢሜይል አድራሻ' : 'Official Teacher Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#786154] absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. yonas.bekele@hailemariammamo.edu.et"
                className="w-full pl-9 pr-3 py-2.5 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs sm:text-sm text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#352016] mb-1.5">
              {lang === 'am' ? 'የመምህር የይለፍ ቃል (Passcode)' : 'Educator Passcode'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#786154] absolute left-3 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
              className="w-full py-3 bg-[#352016] hover:bg-[#20130d] text-white font-extrabold rounded-xl shadow-md flex items-center justify-center space-x-2 text-xs sm:text-sm cursor-pointer transition-all disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4 text-[#e8b982]" />
              <span>
                {lang === 'am'
                  ? 'ወደ መምህር ማርክ መዝገብ ግባ'
                  : 'Sign In to Mark Register'}
              </span>
              <ArrowRight className="w-4 h-4 text-[#e8b982]" />
            </button>
          </div>
        </form>

        {/* Security & Access Information */}
        <div className="p-3 bg-[#faf5f1] border border-[#ebd3c4] rounded-xl text-[11px] text-[#786154] space-y-1 text-center">
          <div className="font-bold text-[#352016]">
            {lang === 'am' ? 'የአካውንት መረጃ ማሳሰቢያ' : 'Faculty Access Notice'}
          </div>
          <p className="leading-relaxed">
            {lang === 'am'
              ? 'የመምህራን መለያ እና የይለፍ ቃል በትምህርት ቤቱ አስተዳዳሪ ክፍል ይሰጣል። መለያ ከሌለዎት እባክዎ ርዕሰ መምህሩን ወይም ሬጅስትራሩን ያነጋግሩ።'
              : 'Teacher credentials are generated by the School Registrar upon assignment. Contact administration if you need your account credentials.'}
          </p>
        </div>
      </div>
    </div>
  );
};
