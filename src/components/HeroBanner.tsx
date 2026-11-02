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
      {/* High-Impact Hero Card - Luxury White & Brown Palette */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#20130d] via-[#352016] to-[#1a0e08] text-white border border-[#5d3b2c]/50 shadow-2xl">
        {/* Decorative background ambient glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#c68a4c]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#8d5b3d]/15 blur-3xl pointer-events-none" />

        <div className="relative px-6 py-10 md:px-12 md:py-14 max-w-5xl">
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#c68a4c] text-[#1f140e] shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grades 9 - 12 Secondary & Prep</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#4a2e22]/90 text-[#ebd3c4] border border-[#754c39]/70">
              <MapPin className="w-3.5 h-3.5 text-[#c68a4c]" />
              <span>Debre Berhan, Amhara Region • Alt 2,840m</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#2e1c14] text-[#d4ab94] border border-[#5d3b2c]">
              Est. 1958 E.C.
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {lang === 'am' ? (
              <>
                ደብረ ብርሃን ኃይለማሪያም ማሞ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8b982] via-[#f7d6a5] to-[#ffffff]">
                  አጠቃላይ ሁለተኛ እና መሰናዶ ትምህርት ቤት
                </span>
              </>
            ) : (
              <>
                Hailemariam Mamo <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8b982] via-[#f7d6a5] to-[#ffffff]">
                  Secondary & Preparatory School
                </span>
              </>
            )}
          </h1>

          <p className="mt-4 text-sm md:text-base text-[#ebd3c4] max-w-2xl leading-relaxed">
            {lang === 'am'
              ? 'በሰሜን ሸዋ ዞን ደብረ ብርሃን ከተማ የሚገኝ ታሪካዊ ሁለተኛ ደረጃ ትምህርት ቤት። የተማሪዎች ውጤት ክትትል፣ የመምህራን ማርክ ማስገቢያ፣ የትምህርት ካላንደር፣ እና የብሄራዊ ፈተና (ESSLCE) ዝግጅት'
              : 'Official digital learning and academic management portal for Debre Berhan’s historic secondary institution. Empowering educators with transparent continuous assessments, automated section distribution, and Grade 12 ESSLCE prep.'}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('portal')}
              className="btn-animated px-6 py-3 rounded-xl bg-[#c68a4c] hover:bg-[#d69858] text-[#1f140e] font-black text-xs md:text-sm shadow-lg shadow-black/40 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#1f140e]" />
              <span>{lang === 'am' ? 'የተማሪ ውጤት ተመልከት' : 'Student & Parent Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className="btn-animated px-6 py-3 rounded-xl bg-[#3b241a] hover:bg-[#4a2e22] text-[#fbf9f6] font-bold text-xs md:text-sm border border-[#754c39] shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4 text-[#c68a4c]" />
              <span>{lang === 'am' ? 'አድሚንና መምህራን ዴስክ' : 'Staff & Admin Portal'}</span>
            </button>

            <button
              onClick={() => onNavigate('calendar')}
              className="btn-animated px-5 py-3 rounded-xl bg-[#2e1c14]/90 hover:bg-[#3b241a] text-[#ebd3c4] font-semibold text-xs md:text-sm border border-[#5d3b2c] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#c68a4c]" />
              <span>{lang === 'am' ? 'የትምህርት ካላንደር' : 'School Calendar'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="border-t border-[#4a2e22] bg-[#1a0e08]/85 px-6 py-4 md:px-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
            <div>
              <span className="text-xl md:text-2xl font-black text-[#e8b982] font-mono">2,450+</span>
              <p className="text-[11px] text-[#ebd3c4] uppercase font-semibold">Enrolled Students (9-12)</p>
            </div>
            <div>
              <span className="text-xl md:text-2xl font-black text-[#c68a4c] font-mono">Grade 9-12</span>
              <p className="text-[11px] text-[#ebd3c4] uppercase font-semibold">MoE Curriculum Streams</p>
            </div>
            <div>
              <span className="text-xl md:text-2xl font-black text-[#e8b982] font-mono">98.4%</span>
              <p className="text-[11px] text-[#ebd3c4] uppercase font-semibold">University Entrance Rate</p>
            </div>
            <div>
              <span className="text-xl md:text-2xl font-black text-[#c68a4c] font-mono">6 Labs</span>
              <p className="text-[11px] text-[#ebd3c4] uppercase font-semibold">STEM, ICT & Science</p>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements & Official Leadership Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Latest Announcements (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#ebd3c4] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f5e8e0]">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#f5e8e0] text-[#4a2e22] rounded-xl">
                <Bell className="w-4 h-4 text-[#c68a4c]" />
              </span>
              <h3 className="font-extrabold text-[#2e1c14] text-base">
                {lang === 'am' ? 'የትምህርት ቤት ወቅታዊ ማስታወቂያዎች' : 'School Notices & Verified Updates'}
              </h3>
            </div>
            <span className="text-[11px] font-bold text-[#4a2e22] bg-[#f5e8e0] px-3 py-1 rounded-full border border-[#ebd3c4]">
              Active Notices
            </span>
          </div>

          <div className="space-y-3">
            {SCHOOL_ANNOUNCEMENTS.map((ann) => (
              <div
                key={ann.id}
                className="p-4 rounded-2xl border border-[#ebd3c4]/70 bg-[#faf5f1]/60 hover:bg-[#faf5f1] transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#ebd3c4] text-[#3b241a]">
                    {ann.badge}
                  </span>
                  <span className="text-[11px] text-[#754c39] font-semibold">{ann.date}</span>
                </div>
                <h4 className="font-bold text-[#2e1c14] text-sm">
                  {lang === 'am' ? ann.titleAmharic : ann.title}
                </h4>
                <p className="text-xs text-[#5d3b2c] mt-1 leading-relaxed">
                  {ann.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Leadership Message & Heritage Box (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#ebd3c4] shadow-sm space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-[#f5e8e0]">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#3b241a] to-[#754c39] flex items-center justify-center text-white border-2 border-[#c68a4c] shadow-sm font-serif font-black text-sm">
              HMM
            </div>
            <div>
              <h4 className="font-extrabold text-[#2e1c14] text-sm">School Administration</h4>
              <p className="text-xs text-[#754c39] font-bold">Academic Directorship & Registry</p>
              <p className="text-[10px] text-[#93634b]">Debre Berhan Secondary Education Bureau</p>
            </div>
          </div>

          <div className="text-xs text-[#5d3b2c] leading-relaxed space-y-2 italic border-l-3 border-[#c68a4c] pl-3.5">
            <p>
              &quot;Welcome to Hailemariam Mamo Secondary & Preparatory School. Carrying the noble heritage of our patriot namesake, we remain steadfast in instilling disciplined intellectual rigor, academic ethics, and civic responsibility in every student.
            </p>
            <p>
              Through this portal, all verified information, course grading, and student admissions are managed with absolute transparency.&quot;
            </p>
          </div>

          <div className="pt-2 border-t border-[#f5e8e0] flex items-center justify-between text-xs">
            <span className="text-[#754c39] font-medium">North Shewa Zone Excellence Award</span>
            <span className="font-extrabold text-[#2e1c14] bg-[#f5e8e0] px-2.5 py-0.5 rounded-full">Official Portal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
