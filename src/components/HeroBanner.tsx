import React from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  GraduationCap,
  MessageSquare,
  Shield,
  Sparkles,
  Users,
  ArrowRight,
  TrendingUp,
  MapPin,
  Bell,
  FileSpreadsheet
} from 'lucide-react';
import { SCHOOL_ANNOUNCEMENTS } from '../data/schoolData';

interface HeroBannerProps {
  onNavigate: (tab: string) => void;
  lang: 'en' | 'am';
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onNavigate, lang }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* High-Impact Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-white border border-emerald-800/40 shadow-xl">
        {/* Decorative background ambient circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-600/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative px-6 py-10 md:px-12 md:py-14 max-w-5xl">
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grades 9 - 12 Secondary & Prep</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/80 text-emerald-300 border border-emerald-700/60">
              <MapPin className="w-3.5 h-3.5" />
              <span>Debre Berhan, Amhara Region • Alt 2,840m</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              Est. 1958 E.C.
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {lang === 'am' ? (
              <>
                ደብረ ብርሃን ኃይለማሪያም ማሞ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-300">
                  አጠቃላይ ሁለተኛ እና መሰናዶ ትምህርት ቤት
                </span>
              </>
            ) : (
              <>
                Hailemariam Mamo <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">
                  Secondary & Preparatory School
                </span>
              </>
            )}
          </h1>

          <p className="mt-4 text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
            {lang === 'am'
              ? 'በሰሜን ሸዋ ዞን ደብረ ብርሃን ከተማ የሚገኝ ታሪካዊ ሁለተኛ ደረጃ ትምህርት ቤት። የተማሪዎች ውጤት ክትትል፣ የመምህራን ማርክ ማስገቢያና አቴንዳንስ መዝገብ (የ9ኛ "ሀ" ተማሪዎች)፣ የትምህርት ካላንደር፣ እና የብሄራዊ ፈተና (ESSLCE) ዝግጅት'
              : 'Official digital learning and academic management portal for Debre Berhan’s historic secondary institution. Empowering teachers with direct mark registering and daily attendance, students with transparent continuous assessments, and Grade 12 ESSLCE candidates.'}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('teacher')}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs md:text-sm shadow-lg shadow-amber-950/40 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <FileSpreadsheet className="w-4 h-4 text-slate-950" />
              <span>{lang === 'am' ? 'መምህራን: ማርክ ማስገቢያና አቴንዳንስ (9A)' : 'Teacher Marks & Attendance (9A)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('portal')}
              className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>{lang === 'am' ? 'የተማሪ ውጤት ተመልከት' : 'Student Grades & Report Cards'}</span>
            </button>

            <button
              onClick={() => onNavigate('messaging')}
              className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-xs md:text-sm border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'am' ? 'ከመምህራን ጋር ተወያይ' : 'Teacher Discussion Board'}</span>
            </button>

            <button
              onClick={() => onNavigate('calendar')}
              className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-xs md:text-sm border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>{lang === 'am' ? 'የትምህርት ካላንደር' : 'Event Calendar'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="border-t border-slate-800/80 bg-slate-950/70 px-6 py-4 md:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
            <div>
              <span className="text-xl md:text-2xl font-black text-amber-400 font-mono">2,450+</span>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Enrolled Students (9-12)</p>
            </div>
            <div>
              <span className="text-xl md:text-2xl font-black text-emerald-400 font-mono">85+</span>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">Specialized Faculty</p>
            </div>
            <div>
              <span className="text-xl md:text-2xl font-black text-blue-400 font-mono">98.4%</span>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">University Entrance Rate</p>
            </div>
            <div>
              <span className="text-xl md:text-2xl font-black text-purple-400 font-mono">6 Labs</span>
              <p className="text-[11px] text-slate-400 uppercase font-semibold">STEM, ICT & Science</p>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements & Principal's Message Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Latest Announcements (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                <Bell className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-slate-900 text-base">
                {lang === 'am' ? 'የትምህርት ቤት ወቅታዊ ማስታወቂያዎች' : 'School Notices & Urgent Updates'}
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Active Updates
            </span>
          </div>

          <div className="space-y-3">
            {SCHOOL_ANNOUNCEMENTS.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {ann.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{ann.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {lang === 'am' ? ann.titleAmharic : ann.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {ann.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Principal's Message & Heritage Box (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80"
              alt="Principal Berhanu Wolde"
              className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-700 shadow-sm"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Berhanu Wolde, M.Ed.</h4>
              <p className="text-xs text-emerald-800 font-medium">Principal & Academic Director</p>
              <p className="text-[10px] text-slate-400">Debre Berhan Secondary Education Bureau</p>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed space-y-2 italic border-l-2 border-emerald-600 pl-3">
            <p>
              &quot;Welcome to Hailemariam Mamo Secondary & Preparatory School. Carrying the name of our heroic patriot, we remain steadfast in instilling disciplined intellectual rigor and moral integrity in every student from Grade 9 to 12.
            </p>
            <p>
              Through this portal, parents, teachers, and students have transparent real-time access to assessments, grade transcripts, and direct teacher dialogue.&quot;
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">North Shewa Zone Excellence Award</span>
            <span className="font-bold text-emerald-800">2024 Gold Standard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
