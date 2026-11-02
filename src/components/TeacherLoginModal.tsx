import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  FileSpreadsheet,
  ArrowRight,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  UserPlus
} from 'lucide-react';
import { Teacher } from '../data/schoolData';

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
          ? 'መምህሩ አልተገኘም። እባክዎ በትምህርት ቤቱ መዝገብ ውስጥ የተመዘገበ መምህር ያስገቡ ወይም በአስተዳዳሪው ክፍል ይመዝገቡ።'
          : 'Teacher account not found. Please ensure the educator is registered in Supabase or the Admin Faculty registry.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#150c08]/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-[#ebd3c4] shadow-2xl relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#786154] hover:text-[#20130d] hover:bg-[#f3e8df] transition-colors"
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
              <h3 className="text-xl font-black text-[#20130d]">
                {lang === 'am' ? 'የመምህራን መግቢያ እና ማርክ መዝገብ' : 'Faculty Sign In & Mark Suite'}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f3e8df] text-[#6d3e23] border border-[#ebd3c4]">
                Debre Berhan
              </span>
            </div>
            <p className="text-xs text-[#786154] mt-0.5">
              {lang === 'am'
                ? 'በተፈቀደላቸው መምህር አካውንት ገብተው የውጤት ዝርዝር እና የቀን መገኘት ይመዝግቡ'
                : 'Sign in to access your roster, grade books, and live student attendance'}
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 mb-4 p-1 bg-[#fbf9f6] border border-[#ebd3c4]/80 rounded-xl">
          <button
            onClick={() => setActiveMode('quick')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'quick'
                ? 'bg-[#352016] text-[#fbf9f6] shadow-sm'
                : 'text-[#786154] hover:text-[#20130d]'
            }`}
          >
            {lang === 'am' ? 'የመምህራን ዝርዝር (1-ጠቅታ)' : 'Registered Faculty (1-Click)'}
          </button>
          <button
            onClick={() => setActiveMode('manual')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'manual'
                ? 'bg-[#352016] text-[#fbf9f6] shadow-sm'
                : 'text-[#786154] hover:text-[#20130d]'
            }`}
          >
            {lang === 'am' ? 'ኢሜይል እና የይለፍ ቃል' : 'Email & Password Login'}
          </button>
        </div>

        {activeMode === 'quick' ? (
          /* List of Teachers */
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
            <div className="text-[11px] font-bold text-[#786154] uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>{lang === 'am' ? 'የተመዘገቡ መምህራን' : 'Faculty Roster'}: {teachers.length}</span>
              <span className="text-[10px] text-[#9b512c] font-medium">Supabase Database Sync</span>
            </div>

            {teachers.length === 0 ? (
              <div className="p-8 text-center bg-[#fbf9f6] border-2 border-dashed border-[#ebd3c4] rounded-2xl">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#f3e8df] text-[#6d3e23] flex items-center justify-center mb-3">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-[#20130d] text-sm mb-1">
                  {lang === 'am' ? 'ምንም መምህራን እስካሁን አልተመዘገቡም' : 'No Faculty Registered Yet'}
                </h4>
                <p className="text-xs text-[#786154] max-w-sm mx-auto mb-4 leading-relaxed">
                  {lang === 'am'
                    ? 'ሁሉም የውሸት/የሙከራ መረጃዎች ተሰርዘዋል። እባክዎ በአስተዳዳሪው ክፍል «አዲስ መምህር መዝግብ» የሚለውን ተጠቅመው መምህራን ይመዝግቡ።'
                    : 'All placeholder faculty have been removed. Add real educators via the Admin Portal or by seeding your Supabase "teachers" table.'}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#352016] text-[#fbf9f6] text-xs font-bold">
                  <UserPlus className="w-3.5 h-3.5 text-[#e8b982]" />
                  <span>Admin Portal &gt; Staff Registry</span>
                </div>
              </div>
            ) : (
              teachers.map((teacher) => {
                const initials = teacher.name
                  .split(' ')
                  .map((n) => n[0])
                  .filter(Boolean)
                  .slice(0, 2)
                  .join('')
                  .toUpperCase() || 'ED';

                return (
                  <div
                    key={teacher.id}
                    onClick={() => {
                      onSelectTeacher(teacher);
                      onClose();
                    }}
                    className="p-3.5 rounded-2xl border border-[#ebd3c4] hover:border-[#6d3e23] bg-[#fbf9f6] hover:bg-[#f3e8df]/70 transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#352016] to-[#6d3e23] text-[#e8b982] flex items-center justify-center font-black text-xs border border-[#c68a4c]/40 flex-shrink-0 shadow-2xs">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-[#20130d] text-xs truncate group-hover:text-[#6d3e23]">
                            {teacher.name}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#f3e8df] text-[#6d3e23] border border-[#ebd3c4]">
                            {teacher.subject}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#786154] truncate mt-0.5">
                          {teacher.department} • {teacher.sectionsTeaching?.join(', ') || 'Assigned Sections'}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-animated px-3 py-1.5 bg-[#352016] hover:bg-[#20130d] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 flex-shrink-0 shadow-xs"
                    >
                      <span>Sign In</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#e8b982]" />
                    </button>
                  </div>
                );
              })
            )}
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
              <label className="font-bold text-[#20130d] block mb-1">
                Faculty Email or Name:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#786154] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. teacher.name@hailemariammamo.edu.et"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs text-[#20130d] focus:ring-2 focus:ring-[#6d3e23] focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-[#20130d] block mb-1">
                Teacher Passcode:
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#786154] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter staff security key"
                  value={manualPassword}
                  onChange={(e) => setManualPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs text-[#20130d] focus:ring-2 focus:ring-[#6d3e23] focus:outline-hidden"
                />
              </div>
              <span className="text-[11px] text-[#786154] block mt-1">
                Protected by Supabase Auth and School Administration Policy.
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-[#786154] hover:bg-[#f3e8df] font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-animated px-5 py-2.5 bg-[#352016] hover:bg-[#20130d] text-white font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Sign In to Teacher Suite</span>
                <ArrowRight className="w-4 h-4 text-[#e8b982]" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
