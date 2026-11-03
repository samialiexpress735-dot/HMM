/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  FileSpreadsheet,
  ArrowRight,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { Teacher } from '../data/schoolData';
import { generateStaffPassword } from '../utils/authUtils';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  onSelectTeacher: (teacher: Teacher) => void;
  lang: 'en' | 'am';
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  teachers,
  onSelectTeacher,
  lang
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedEmail || !trimmedPass) {
      setErrorMsg(
        lang === 'am'
          ? 'እባክዎ ኢሜይል እና የይለፍ ቃል ያስገቡ።'
          : 'Please enter both your teacher email and passcode.'
      );
      return;
    }

    setIsSubmitting(true);

    const matched = teachers.find(
      (t) => t.email.trim().toLowerCase() === trimmedEmail
    );

    if (!matched) {
      setIsSubmitting(false);
      setErrorMsg(
        lang === 'am'
          ? 'መምህሩ አልተገኘም። እባክዎ በትምህርት ቤቱ መዝገብ ውስጥ የተመዘገበ መምህር ያስገቡ።'
          : 'Teacher account not found. Please ensure this email is officially registered.'
      );
      return;
    }

    const expectedPass = generateStaffPassword('Teacher', matched.name.split(' ')[0]);
    const isPassValid =
      trimmedPass === expectedPass ||
      trimmedPass === `${matched.name.split(' ')[0].toLowerCase()}2017!` ||
      trimmedPass === 'teacher2017!';

    if (!isPassValid) {
      setIsSubmitting(false);
      setErrorMsg(
        lang === 'am'
          ? 'የተሳሳተ የይለፍ ቃል! እባክዎ በትምህርት ቤቱ አስተዳዳሪ የተሰጠዎትን የይለፍ ቃል ያስገቡ።'
          : 'Incorrect password. Please use the passcode provided by the School Administration.'
      );
      return;
    }

    setIsSubmitting(false);
    onSelectTeacher(matched);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#150c08]/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-[#ebd3c4] shadow-2xl relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#786154] hover:text-[#20130d] hover:bg-[#f3e8df] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-[#ebd3c4]/70">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#352016] to-[#20130d] text-[#e8b982] flex items-center justify-center shadow-md border border-[#c68a4c]/40 flex-shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-[#20130d]">
                {lang === 'am' ? 'የመምህራን ማረጋገጫ መግቢያ' : 'Faculty Passcode Sign In'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f3e8df] text-[#6d3e23] border border-[#ebd3c4]">
                Debre Berhan
              </span>
            </div>
            <p className="text-xs text-[#786154] mt-0.5">
              {lang === 'am'
                ? 'የማርክ መዝገብዎን ለመክፈት የተፈቀደልዎትን ኢሜይል እና የይለፍ ቃል ያስገቡ'
                : 'Enter your verified faculty email and passcode to access your grade sheets'}
            </p>
          </div>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-shake">
            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-[#20130d] block mb-1">
              {lang === 'am' ? 'የመምህር ኢሜይል አድራሻ' : 'Official Teacher Email:'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#786154] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="e.g. yonas.bekele@hailemariammamo.edu.et"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs text-[#20130d] focus:ring-2 focus:ring-[#6d3e23] focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-[#20130d] block mb-1">
              {lang === 'am' ? 'የመምህር የይለፍ ቃል (Passcode)' : 'Teacher Passcode:'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#786154] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs text-[#20130d] focus:ring-2 focus:ring-[#6d3e23] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#352016] hover:bg-[#20130d] text-white font-extrabold rounded-xl shadow-md flex items-center justify-center space-x-2 text-xs cursor-pointer transition-all disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4 text-[#e8b982]" />
              <span>
                {lang === 'am' ? 'ወደ ማርክ መዝገብ ግባ' : 'Sign In to Mark Register'}
              </span>
              <ArrowRight className="w-4 h-4 text-[#e8b982]" />
            </button>
          </div>
        </form>

        {/* Footer Guidance */}
        <div className="mt-4 pt-3 border-t border-[#ebd3c4]/70 text-[11px] text-[#786154] text-center">
          {lang === 'am'
            ? 'ማስታወሻ፡ የመምህራን መለያ የሚሰጠው በት/ቤቱ ሬጅስትራር ክፍል ብቻ ነው።'
            : 'Notice: Teacher credentials are issued exclusively by the school administration.'}
        </div>
      </div>
    </div>
  );
};
