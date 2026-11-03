import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  GraduationCap,
  Shield,
  Sparkles,
  Users,
  ArrowRight,
  MapPin,
  Bell,
  FileSpreadsheet,
  Building2,
  Clock,
  Compass,
  Landmark,
  Microscope,
  Cpu,
  Trophy,
  History,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { SchoolAnnouncement, SchoolEvent } from '../data/schoolData';

interface HeroBannerProps {
  onNavigate: (tab: string) => void;
  lang: 'en' | 'am';
  announcements?: SchoolAnnouncement[];
  events?: SchoolEvent[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onNavigate,
  lang,
  announcements = [],
  events = []
}) => {
  const [activeHeritageTab, setActiveHeritageTab] = useState<'patriot' | 'history' | 'campus' | 'notices'>('patriot');

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* 1. TOP OFFICIAL HEADER & PRESTIGIOUS HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0f0a] via-[#2a170e] to-[#120804] text-white border border-[#5d3b2c]/60 shadow-2xl">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[#c68a4c]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-[#8d5b3d]/20 blur-3xl pointer-events-none" />

        <div className="relative px-6 py-10 md:px-12 md:py-14 max-w-5xl">
          {/* Official Accreditation Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#c68a4c] text-[#1a0f0a] shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Federal MoE Certified Center</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#3b241a] text-[#ebd3c4] border border-[#754c39]">
              <MapPin className="w-3.5 h-3.5 text-[#c68a4c]" />
              <span>Debre Berhan, Amhara Region • Alt 2,840m</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#26150d] text-[#e8b982] border border-[#5d3b2c]">
              Est. 1958 E.C. (1965 G.C.)
            </span>
          </div>

          {/* School Dignified Title */}
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
              ? 'በሰሜን ሸዋ ዞን ደብረ ብርሃን ከተማ የሚገኝ ታሪካዊ ሁለተኛና መሰናዶ ትምህርት ቤት። ለተማሪዎች፣ ወላጆች፣ መምህራን እና ጎብኚዎች የተዘጋጀ የተቀናጀ የትምህርት ቤት መረጃ መረብ።'
              : 'Historic general secondary and preparatory institution in Debre Berhan, North Shewa. Dedicated portal for academic records, continuous assessment, transparent student grades, and historical campus heritage.'}
          </p>

          {/* Key Campus Quick Indicators */}
          <div className="mt-8 pt-6 border-t border-[#4a2e22]/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-black text-[#e8b982] font-mono">2,450+</div>
              <div className="text-[11px] text-[#ebd3c4] font-semibold uppercase tracking-wider">Enrolled Students</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#c68a4c] font-mono">85+</div>
              <div className="text-[11px] text-[#ebd3c4] font-semibold uppercase tracking-wider">Certified Faculty</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#e8b982] font-mono">Grades 9-12</div>
              <div className="text-[11px] text-[#ebd3c4] font-semibold uppercase tracking-wider">General & Prep</div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#c68a4c] font-mono">60 Years</div>
              <div className="text-[11px] text-[#ebd3c4] font-semibold uppercase tracking-wider">Academic Legacy</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE PORTAL SELECTOR: 3 MAIN DOORS FOR USERS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#20130d] tracking-tight">
              {lang === 'am' ? 'የትምህርት ቤቱ መግቢያ በሮች (ፖርታል ይምረጡ)' : 'Select Your School Portal'}
            </h2>
            <p className="text-xs md:text-sm text-[#786154]">
              {lang === 'am'
                ? 'ለአስተዳዳሪ፣ ለተማሪና ወላጅ ወይም ለመምህራን የተዘጋጀውን ፖርታል ይክፈቱ'
                : 'Direct digital gateways tailored for school administrators, students & parents, and faculty educators'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PORTAL DOOR 1: SCHOOL ADMINISTRATION DESK */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#ebd3c4] hover:border-[#6d3e23] transition-all shadow-sm hover:shadow-md flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-[#352016] text-[#e8b982] flex items-center justify-center font-bold shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-[#c68a4c]" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#f3e8df] text-[#6d3e23] border border-[#ebd3c4]">
                  Director & Staff
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#20130d] group-hover:text-[#6d3e23] transition-colors">
                  {lang === 'am' ? 'የአስተዳደር ዴስክ' : 'School Administration'}
                </h3>
                <p className="text-xs text-[#786154] mt-1 leading-relaxed">
                  {lang === 'am'
                    ? 'የርዕሰ-መምህር፣ የሬጅስትራር፣ እና የፈተና ሃላፊዎች መቆጣጠሪያ። መምህራንን መመዝገብ፣ ክፍሎችን ማደራጀትና ማስታወቂያዎችን መለጠፍ።'
                    : 'Director, registrar, and administrative suite. Register teachers, configure sections, issue credential slips, and post official notices.'}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#523d32] border-t border-[#f3e8df] pt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Teacher & Sub-Admin Registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>2019 E.C. Student Admissions Registry</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Announcement & Calendar Posting</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('admin')}
                className="btn-animated w-full py-3 bg-[#352016] hover:bg-[#20130d] text-[#f7d6a5] font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>{lang === 'am' ? 'ወደ አስተዳደር ፖርታል ግባ →' : 'Open Admin Portal →'}</span>
              </button>
            </div>
          </div>

          {/* PORTAL DOOR 2: STUDENT & PARENT GRADE PORTAL */}
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 hover:border-emerald-600 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-emerald-900 text-amber-300 flex items-center justify-center font-bold shadow-sm">
                  <Award className="w-6 h-6 text-amber-400" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200">
                  Students & Parents
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {lang === 'am' ? 'የተማሪና ወላጅ ፖርታል' : 'Student & Parent Portal'}
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {lang === 'am'
                    ? 'ተማሪዎችና ወላጆች የትምህርት ውጤታቸውን፣ የሴሚስተር ሪፖርት ካርዳቸውን እና የቀን አቴንዳንሳቸውን በፒን ቁጥር የሚመለከቱበት።'
                    : 'Direct access to semester scorecards, continuous assessment marks (30%), mid-exams (20%), and final exams (50%).'}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Official Term Report Cards & Transcripts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Subject Performance & Rank in Section</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Daily Attendance & Conduct Record</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('portal')}
                className="btn-animated w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>{lang === 'am' ? 'የተማሪ ውጤት ተመልከት →' : 'Enter Student & Parent Portal →'}</span>
              </button>
            </div>
          </div>

          {/* PORTAL DOOR 3: TEACHER & FACULTY SUITE */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 hover:border-amber-600 transition-all shadow-sm hover:shadow-md flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-12 h-12 rounded-2xl bg-[#6d3e23] text-amber-300 flex items-center justify-center font-bold shadow-sm">
                  <FileSpreadsheet className="w-6 h-6 text-amber-300" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                  Subject Educators
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#20130d] group-hover:text-[#6d3e23] transition-colors">
                  {lang === 'am' ? 'የመምህራን ማርክ ማስገቢያ' : 'Teacher & Faculty Suite'}
                </h3>
                <p className="text-xs text-[#786154] mt-1 leading-relaxed">
                  {lang === 'am'
                    ? 'ለመምህራን የተለየ ማርክ መመዝገቢያ። ተከታታይ ምዘና (30%)፣ አጋማሽ ፈተና (20%) እና ማጠቃለያ ፈተና (50%) ማስገቢያ።'
                    : 'Dedicated workbench for subject teachers to record continuous assessments, mid-exams, final exams, and mark daily attendance.'}
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#523d32] border-t border-[#f3e8df] pt-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>CA (30) + Mid (20) + Final (50) Entry</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Daily Class Attendance (P/A/L/Permission)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Official Mark List Printouts</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate('teacher')}
                className="btn-animated w-full py-3 bg-[#6d3e23] hover:bg-[#542f1a] text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>{lang === 'am' ? 'ወደ መምህራን ፖርታል ግባ →' : 'Access Teacher Suite →'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. VISITOR SECTION: HISTORICAL HERITAGE, CAMPUS & PHOTOS */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#ebd3c4] shadow-sm space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6d3e23] mb-1">
            <Landmark className="w-4 h-4" />
            <span>Visitor Heritage & Campus Information (ለጎብኚዎች ታሪካዊ መረጃ)</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#20130d]">
            {lang === 'am'
              ? 'ደብረ ብርሃን ኃይለማሪያም ማሞ ት/ቤት ታሪክና ቅርሶች'
              : 'Our Historic Heritage & Campus Life'}
          </h2>
          <p className="text-xs md:text-sm text-[#786154] mt-1">
            {lang === 'am'
              ? 'መግቢያ የሌላቸው ጎብኚዎች፣ የቀድሞ ተማሪዎች እና እንግዶች ስለ ትምህርት ቤቱ ታሪክ፣ ስለ ጀግናው ደጃዝማች ኃይለማሪያም ማሞ እና ስለ ግቢው መረጃዎችን እዚህ ያገኛሉ።'
              : 'For guests, prospective parents, and alumni: explore the legacy of anti-fascist patriot Dejazmach Hailemariam Mamo and our Debre Berhan academic campus.'}
          </p>
        </div>

        {/* Heritage Sub-Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#ebd3c4] pb-3">
          <button
            onClick={() => setActiveHeritageTab('patriot')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeHeritageTab === 'patriot'
                ? 'bg-[#352016] text-[#f7d6a5] shadow-sm'
                : 'bg-[#faf5f1] text-[#786154] hover:bg-[#f3e8df]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Patriot Dejazmach Hailemariam Mamo</span>
          </button>

          <button
            onClick={() => setActiveHeritageTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeHeritageTab === 'history'
                ? 'bg-[#352016] text-[#f7d6a5] shadow-sm'
                : 'bg-[#faf5f1] text-[#786154] hover:bg-[#f3e8df]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>School Establishment (1958 E.C.)</span>
          </button>

          <button
            onClick={() => setActiveHeritageTab('campus')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeHeritageTab === 'campus'
                ? 'bg-[#352016] text-[#f7d6a5] shadow-sm'
                : 'bg-[#faf5f1] text-[#786154] hover:bg-[#f3e8df]'
            }`}
          >
            <Microscope className="w-3.5 h-3.5" />
            <span>Campus Facilities & Laboratories</span>
          </button>

          <button
            onClick={() => setActiveHeritageTab('notices')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeHeritageTab === 'notices'
                ? 'bg-[#352016] text-[#f7d6a5] shadow-sm'
                : 'bg-[#faf5f1] text-[#786154] hover:bg-[#f3e8df]'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Official Notices ({announcements.length})</span>
          </button>
        </div>

        {/* TAB CONTENT: 1. PATRIOT DEJAZMACH HAILEMARIAM MAMO */}
        {activeHeritageTab === 'patriot' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Tribute Memorial Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#2a170e] via-[#3d2315] to-[#1a0e08] rounded-3xl p-6 text-white border border-[#c68a4c]/40 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#c68a4c]/20 blur-2xl" />
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-[#5d3b2c]">
                <div className="w-12 h-12 rounded-2xl bg-[#c68a4c] text-[#1a0f0a] font-black flex items-center justify-center text-lg shadow-md">
                  HM
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#e8b982]">Ethiopian Resistance Hero</span>
                  <h4 className="font-black text-white text-base">Dejazmach Hailemariam Mamo</h4>
                  <span className="text-[11px] text-[#ebd3c4] block">ደጃዝማች ኃይለማሪያም ማሞ (1900 - 1940)</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1a0e08]/70 border border-[#5d3b2c] space-y-2 text-xs text-[#ebd3c4] leading-relaxed">
                <p>
                  <strong>Role:</strong> Supreme Commander of North Shewa Patriotic Resistance (Arbegnoch) forces during the 1936–1941 defense of Ethiopia.
                </p>
                <p>
                  <strong>Key Battlegrounds:</strong> Debre Berhan, Tegulet, Menz, Ankober, and Termaber gorge passes.
                </p>
                <p>
                  <strong>Immortal Legacy:</strong> Known for courage, tactical discipline, and unyielding refusal to bow to occupying armies. In 1958 E.C., this institution was formally inaugurated and dedicated in his honor.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#4a2e22] flex items-center justify-between text-[11px] text-[#e8b982]">
                <span>Honored by Federal Ministry of Education</span>
                <span className="font-mono">Est. 1958 E.C.</span>
              </div>
            </div>

            {/* Narrative Context */}
            <div className="lg:col-span-7 space-y-4 text-xs md:text-sm text-[#523d32] leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#faf5f1] border border-[#ebd3c4] space-y-2">
                <h4 className="font-extrabold text-[#20130d] text-base">
                  {lang === 'am' ? 'የደጃዝማች ኃይለማሪያም ማሞ ታሪክ በአጭሩ' : 'The Legacy of Patriot Hailemariam Mamo'}
                </h4>
                <p>
                  Dejazmach Hailemariam Mamo was one of Ethiopia&apos;s most celebrated patriots during the five-year patriotic resistance against fascist Italian invasion (1936–1941). Operating across the rugged high-altitude plateau of North Shewa, his forces defended Ethiopian independence with monumental bravery.
                </p>
                <p>
                  His steadfast dedication to liberty and national sovereignty became a guiding torch for Debre Berhan. When the school was established by the Imperial Government of Ethiopia and the Ministry of Education in 1958 E.C. (1965 G.C.), it was given his name to remind every student that intellectual discipline, moral courage, and service to society are sacred obligations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white border border-[#ebd3c4] space-y-1">
                  <span className="font-bold text-[#20130d] block">Academic Philosophy</span>
                  <p className="text-[#786154]">Combining patriotic discipline with scientific rigor and modern secondary learning.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[#ebd3c4] space-y-1">
                  <span className="font-bold text-[#20130d] block">Alumni Impact</span>
                  <p className="text-[#786154]">Over 60 years, alumni have served as university professors, surgeons, engineers, and public leaders.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 2. SCHOOL ESTABLISHMENT & HISTORY */}
        {activeHeritageTab === 'history' && (
          <div className="space-y-6 text-xs md:text-sm text-[#523d32] leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-[#faf5f1] border border-[#ebd3c4] space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#6d3e23] text-white flex items-center justify-center font-bold text-xs">
                  1958
                </div>
                <h4 className="font-black text-[#20130d] text-sm">Foundation (1958 E.C. / 1965 G.C.)</h4>
                <p className="text-xs text-[#786154]">
                  Inaugurated as the premier secondary educational institution for Debre Berhan and the broader North Shewa region by the Ministry of Education.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#faf5f1] border border-[#ebd3c4] space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#6d3e23] text-white flex items-center justify-center font-bold text-xs">
                  1995
                </div>
                <h4 className="font-black text-[#20130d] text-sm">Preparatory Elevation (Grades 11-12)</h4>
                <p className="text-xs text-[#786154]">
                  Expanded to full preparatory academy status, sending students to Addis Ababa University, Gondar University, and Jimma University annually.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#faf5f1] border border-[#ebd3c4] space-y-2">
                <div className="w-8 h-8 rounded-xl bg-[#6d3e23] text-white flex items-center justify-center font-bold text-xs">
                  2017
                </div>
                <h4 className="font-black text-[#20130d] text-sm">Digital Portal & Modern SIS</h4>
                <p className="text-xs text-[#786154]">
                  Deployment of the unified School Information System (SIS), connecting cloud databases for real-time grading, attendance, and registration.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                <span>North Shewa Educational Heritage Benchmark</span>
              </div>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                Hailemariam Mamo Secondary & Preparatory School occupies a historic 8-hectare campus in central Debre Berhan. The campus architecture preserves classic Ethiopian mid-century stone masonry classrooms integrated with modern science laboratories, an ICT computer laboratory, and an athletic football stadium.
              </p>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 3. CAMPUS FACILITIES & HIGH-ALTITUDE LIFE */}
        {activeHeritageTab === 'campus' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-[#ebd3c4] hover:border-[#6d3e23] transition-all shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Microscope className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#20130d] text-sm">Natural Science Laboratories</h4>
              <p className="text-xs text-[#786154] leading-relaxed">
                Fully equipped Chemistry, Physics, and Biology laboratory halls accommodating 60 students per practical session.
              </p>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full inline-block">
                3 Dedicated Lab Halls
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#ebd3c4] hover:border-[#6d3e23] transition-all shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#20130d] text-sm">ICT Computer Center</h4>
              <p className="text-xs text-[#786154] leading-relaxed">
                Modern computer laboratory for Information Technology (IT) classes, programming instruction, and digital resource research.
              </p>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                High-Speed Networked
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#ebd3c4] hover:border-[#6d3e23] transition-all shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#20130d] text-sm">Central Academic Library</h4>
              <p className="text-xs text-[#786154] leading-relaxed">
                Over 25,000 reference books, national exam preparation volumes, curriculum guides, and quiet study halls seating 250 students.
              </p>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full inline-block">
                250-Seat Capacity
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#ebd3c4] hover:border-[#6d3e23] transition-all shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#20130d] text-sm">Athletics & Sports Stadium</h4>
              <p className="text-xs text-[#786154] leading-relaxed">
                High-altitude athletic field at 2,840m elevation. Home to the school football team, volleyball courts, and annual sports days.
              </p>
              <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full inline-block">
                Regional Tournament Venue
              </span>
            </div>
          </div>
        )}

        {/* TAB CONTENT: 4. OFFICIAL NOTICES POSTED BY ADMIN */}
        {activeHeritageTab === 'notices' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-[#20130d] text-sm">
                Latest Announcements Posted by School Administration ({announcements.length})
              </h4>
              <span className="text-xs text-[#786154]">Live Updates</span>
            </div>

            {announcements.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-[#ebd3c4] text-xs text-[#786154]">
                No public notices currently active. The School Director posts announcements from the Administration Desk.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-5 rounded-2xl border transition-all text-xs space-y-2 ${
                      ann.isUrgent
                        ? 'bg-rose-50/70 border-rose-200'
                        : 'bg-[#faf5f1] border-[#ebd3c4]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ebd3c4] text-[#3b241a]">
                        {ann.category}
                      </span>
                      {ann.isUrgent && (
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">
                          URGENT
                        </span>
                      )}
                    </div>
                    <h5 className="font-bold text-[#20130d] text-sm">
                      {lang === 'am' && ann.titleAmharic ? ann.titleAmharic : ann.title}
                    </h5>
                    <p className="text-[#523d32] leading-relaxed">{ann.summary}</p>
                    <div className="pt-2 border-t border-[#ebd3c4]/60 flex items-center justify-between text-[10px] text-[#786154]">
                      <span>Posted by: <strong>{ann.postedBy}</strong></span>
                      <span>{ann.datePosted}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
