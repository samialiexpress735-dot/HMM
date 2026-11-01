import React, { useState } from 'react';
import {
  GraduationCap,
  Calendar,
  MessageSquare,
  Award,
  BookOpen,
  Building,
  Globe,
  Menu,
  X,
  Bell,
  FileSpreadsheet,
  Shield,
  LogIn,
  LogOut,
  ShieldCheck,
  Layers,
  UserPlus
} from 'lucide-react';
import { AdminUser } from './AdminSignupPage';
import { Teacher } from '../data/schoolData';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: 'en' | 'am';
  setLang: (l: 'en' | 'am') => void;
  adminUser: AdminUser | null;
  onSignOut: () => void;
  onOpenAdminSignup: () => void;
  teacherUser?: Teacher | null;
  onSignOutTeacher?: () => void;
  onOpenTeacherLogin?: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  adminUser,
  onSignOut,
  onOpenAdminSignup,
  teacherUser,
  onSignOutTeacher,
  onOpenTeacherLogin,
  unreadCount = 2
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      id: 'admin',
      labelEn: 'Admin Desk',
      labelAm: 'አድሚን ዴስክ',
      icon: Shield,
      highlight: true
    },
    {
      id: 'registrar',
      labelEn: 'Registrar (2019 E.C.)',
      labelAm: 'ምዝገባ (2019 ዓ.ም.)',
      icon: UserPlus,
      highlight: true
    },
    {
      id: 'grades',
      labelEn: 'Grades of This Year',
      labelAm: 'የዘንድሮ ክፍሎች',
      icon: Layers,
      highlight: true
    },
    {
      id: 'teacher',
      labelEn: 'Teacher (9A)',
      labelAm: 'ማርክ/አቴንዳንስ 9A',
      icon: FileSpreadsheet,
      highlight: true
    },
    {
      id: 'home',
      labelEn: 'School Home',
      labelAm: 'መነሻ ገጽ',
      icon: Building
    },
    {
      id: 'portal',
      labelEn: 'Student Grades',
      labelAm: 'ውጤት ፖርታል',
      icon: Award
    },
    {
      id: 'calendar',
      labelEn: 'Calendar',
      labelAm: 'ካላንደር',
      icon: Calendar
    },
    {
      id: 'messaging',
      labelEn: 'Discussions',
      labelAm: 'የመምህራን ውይይት',
      icon: MessageSquare,
      badge: unreadCount
    },
    {
      id: 'esslce',
      labelEn: 'ESSLCE Prep',
      labelAm: 'ብሔራዊ ፈተና',
      icon: BookOpen
    },
    {
      id: 'about',
      labelEn: 'Campus & Info',
      labelAm: 'ስለ ት/ቤቱ',
      icon: GraduationCap
    }
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/98 backdrop-blur-md border-b border-slate-800 text-white transition-all shadow-md w-full max-w-full overflow-x-clip">
      {/* Official Ethiopian Ministry of Education Tri-Color Ribbon */}
      <div className="moe-gradient-bar" />

      {/* Top emergency announcement bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 font-medium flex items-center justify-between border-b border-emerald-800">
        <div className="flex items-center space-x-2 truncate max-w-4xl mx-auto">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase flex-shrink-0">
            MoE Notice
          </span>
          <span className="truncate">
            {lang === 'am'
              ? 'ደብረ ብርሃን ኃይለማሪያም ማሞ ሁለተኛ እና መሰናዶ ት/ቤት • የ2017 ዓ.ም የ1ኛ መንፈቀ-ዓመት ማጠቃለያ ፈተና የካቲት 10 ይጀመራል'
              : 'Hailemariam Mamo Secondary & Prep School (Debre Berhan, Amhara) • Grade 12 ESSLCE Model Exam Series 1 scheduled for Feb 17'}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-emerald-200 flex-shrink-0">
          <span>Debre Berhan • Alt: 2,840m</span>
          <span>•</span>
          <span>Grades 9 - 12</span>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6 min-w-0">
        <div className="flex items-center justify-between min-h-16 py-2 sm:py-2.5 gap-2">
          {/* School Emblem & Brand Identity */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-700 to-amber-500 p-0.5 shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center border border-amber-400/40">
                <span className="font-black text-xs sm:text-sm tracking-tighter text-amber-400 font-serif">HMM</span>
              </div>
            </div>
            <div className="max-w-[200px] sm:max-w-xs">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-amber-300 transition-colors truncate">
                  Hailemariam Mamo
                </h1>
                <span className="text-[9px] sm:text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded flex-shrink-0">
                  9-12
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate leading-tight mt-0.5">
                {lang === 'am'
                  ? 'ደብረ ብርሃን ኃይለማሪያም ማሞ ት/ቤት'
                  : 'Secondary & Prep • Debre Berhan'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 flex-shrink-0" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{lang === 'am' ? item.labelAm : item.labelEn}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-slate-900"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language, Admin Badge, Sign Out & Mobile Hamburger */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            {/* Bilingual Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="flex items-center space-x-1 px-2 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer flex-shrink-0"
              title={lang === 'en' ? 'Switch to Amharic' : 'Switch to English'}
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold">{lang === 'en' ? 'አማርኛ' : 'EN'}</span>
            </button>

            {/* Teacher Session Status or Quick Teacher Login */}
            {teacherUser ? (
              <div className="flex items-center space-x-1.5 flex-shrink-0">
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-900/90 border border-emerald-600 text-emerald-100 shadow-sm flex-shrink-0">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                  <span className="font-bold text-xs truncate max-w-[90px] sm:max-w-[130px]">
                    {teacherUser.name.split(' ')[0]} ({teacherUser.subject.slice(0, 4)})
                  </span>
                </div>
                {onSignOutTeacher && (
                  <button
                    onClick={onSignOutTeacher}
                    className="p-1.5 rounded-lg text-xs bg-slate-800 hover:bg-rose-900 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Sign out from teacher suite"
                  >
                    <LogOut className="w-3 h-3 text-rose-400" />
                  </button>
                )}
              </div>
            ) : (
              onOpenTeacherLogin && (
                <button
                  onClick={onOpenTeacherLogin}
                  className="btn-animated flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-700/60 transition-all cursor-pointer flex-shrink-0"
                  title="Sign In as Teacher to enter marks and view section suite"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{lang === 'am' ? 'መምህራን መግቢያ' : 'Teacher Login'}</span>
                  <span className="sm:hidden">{lang === 'am' ? 'መምህር' : 'Teacher'}</span>
                </button>
              )
            )}

            {/* Authenticated Admin Badge & Sign Out / Setup */}
            {adminUser ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
                <div className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-950 border border-emerald-700/70 text-emerald-200 shadow-sm flex-shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="text-white font-bold text-xs truncate max-w-[90px] sm:max-w-[130px]">
                    {adminUser.fullName.split(' ')[0]}
                  </span>
                </div>

                <button
                  onClick={onSignOut}
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-rose-950/80 hover:text-rose-200 hover:border-rose-700/80 text-slate-300 border border-slate-700 transition-colors cursor-pointer flex-shrink-0"
                  title={lang === 'am' ? 'ከአስተዳዳሪ ዴስክ ውጣ' : 'Sign out from admin session'}
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                  <span className="inline text-xs">{lang === 'am' ? 'ውጣ' : 'Sign Out'}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminSignup}
                className="btn-animated flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-sm cursor-pointer flex-shrink-0"
                title={lang === 'am' ? 'የአስተዳዳሪ ምዝገባ' : 'Admin Registration & Sign In'}
              >
                <Shield className="w-3.5 h-3.5 text-slate-950" />
                <span>{lang === 'am' ? 'አስተዳዳሪ ምዝገባ' : 'Admin Signup'}</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer flex-shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-slate-200" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900/98 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{lang === 'am' ? item.labelAm : item.labelEn}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800">
            {adminUser ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut();
                }}
                className="w-full py-2.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-200 font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>{lang === 'am' ? 'ከአስተዳዳሪ ዴስክ ውጣ' : `Sign Out (${adminUser.fullName})`}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminSignup();
                }}
                className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span>{lang === 'am' ? 'የት/ቤት አስተዳዳሪ ምዝገባ' : 'Admin Registration & Sign In'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
