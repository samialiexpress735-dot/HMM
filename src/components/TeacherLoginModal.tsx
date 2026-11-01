import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Lock,
  Mail,
  FileSpreadsheet,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldAlert
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
  const [activeMode, setActiveMode] = useState<'quick' | 'manual'>('quick');
  const [manualEmail, setManualEmail] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedEmail = manualEmail.trim().toLowerCase();
    const matched = teachers.find(
      (t) =>
        t.email.toLowerCase() === trimmedEmail ||
        t.name.toLowerCase().includes(trimmedEmail)
    );

    if (matched) {
      onSelectTeacher(matched);
      onClose();
    } else {
      setErrorMsg(
        lang === 'am'
          ? 'መምህሩ አልተገኘም። እባክዎ ከታች ከተዘረዘሩት መምህራን አንዱን ይምረጡ ወይም ትክክለኛ ኢሜይል ያስገቡ።'
          : 'Teacher account not found. Please choose from the registered faculty list below or verify email.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-slate-200 shadow-2xl relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-800 to-slate-900 text-amber-400 flex items-center justify-center shadow-md border border-amber-400/30 flex-shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-slate-900">
                {lang === 'am' ? 'የመምህራን መግቢያ እና ማርክ መዝገብ' : 'Faculty Sign In & Mark Suite'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Debre Berhan
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'am'
                ? 'በማንኛውም መምህር አካውንት በ1-ጠቅታ ገብተው ማርክና አቴንዳንስ ይመዝግቡ'
                : '1-click sign in as any educator to enter marks and take live attendance'}
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 mb-4 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveMode('quick')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'quick'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'am' ? 'ፈጣን 1-ጠቅታ መምረጫ (ተመራጭ)' : '1-Click Faculty Switcher (Recommended)'}
          </button>
          <button
            onClick={() => setActiveMode('manual')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'manual'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'am' ? 'ኢሜይል እና የይለፍ ቃል' : 'Email & Password Login'}
          </button>
        </div>

        {activeMode === 'quick' ? (
          /* Quick List of Teachers */
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Select Educator Account ({teachers.length} Faculty Members):
            </div>

            {teachers.map((teacher) => {
              const pass = generateStaffPassword('Teacher', teacher.name.split(' ')[0]);
              return (
                <div
                  key={teacher.id}
                  onClick={() => {
                    onSelectTeacher(teacher);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-emerald-500 bg-slate-50/60 hover:bg-emerald-50/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={teacher.avatar}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-slate-300 flex-shrink-0 group-hover:border-emerald-500"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-xs truncate group-hover:text-emerald-900">
                          {teacher.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {teacher.subject}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {teacher.department} • {teacher.sectionsTeaching?.join(', ') || '9A'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-animated px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1 flex-shrink-0 shadow-2xs"
                  >
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* Manual Form */
          <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Faculty Email or Name:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. daniel.girma@hailemariammamo.edu.et"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Teacher Passcode:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="e.g. ato2017!"
                  value={manualPassword}
                  onChange={(e) => setManualPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                Default preview passcode: <code>ato2017!</code> (or click 1-Click Faculty Switcher)
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-animated px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-sm cursor-pointer"
              >
                Sign In to Teacher Suite
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
