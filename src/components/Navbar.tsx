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
  UserPlus,
  Lock,
  ArrowRight,
  ExternalLink
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
  portalMode?: 'public' | 'admin';
  onTogglePortalMode?: () => void;
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
  portalMode = 'public',
  onTogglePortalMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tabs for the Public & Student/Parent Portal Site
  const publicNavItems = [
    {
      id: 'home',
      labelEn: 'School Home',
      labelAm: 'መነሻ ገጽ',
      icon: Building
    },
    {
      id: 'portal',
      labelEn: 'Student & Parent Grades',
      labelAm: 'የተማሪ ውጤት',
      icon: Award,
      badgeHighlight: true
    },
    {
      id: 'calendar',
      labelEn: 'Calendar',
      labelAm: 'ካላንደር',
      icon: Calendar
    },
    {
      id: 'about',
      labelEn: 'Campus & Legacy',
      labelAm: 'ስለ ት/ቤቱ',
      icon: GraduationCap
    }
  ];

  // Tabs for the Administrative & Faculty Portal Site
  const adminNavItems = [
    {
      id: 'admin',
      labelEn: adminUser ? 'Admin Desk' : 'Admin Login 🔒',
      labelAm: adminUser ? 'አድሚን ዴስክ' : 'አድሚን መግቢያ 🔒',
      icon: adminUser ? ShieldCheck : Lock,
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
      labelEn: 'Grades & Sections',
      labelAm: 'የዘንድሮ ክፍሎች',
      icon: Layers,
      highlight: true
    },
    {
      id: 'teacher',
      labelEn: 'Teacher Suite',
      labelAm: 'የመምህራን ዴስክ',
      icon: FileSpreadsheet,
      highlight: true
    }
  ];

  const currentNavItems = portalMode === 'admin' ? adminNavItems : publicNavItems;

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#20130d]/98 backdrop-blur-md border-b border-[#4a2e22] text-[#fbf9f6] transition-all shadow-md w-full max-w-full overflow-x-clip">
      {/* Warm Brown & Gold Ribbon */}
      <div className="brown-ribbon-bar" />

      {/* Top Banner: Mode Indicator & Vercel Multi-Site Switcher */}
      <div className="bg-[#170d08] text-[#ebd3c4] text-xs py-1 px-4 font-medium flex items-center justify-between border-b border-[#3b241a]">
        <div className="flex items-center space-x-2 truncate max-w-4xl">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-[#c68a4c] text-[#1f140e] uppercase flex-shrink-0">
            {portalMode === 'admin' ? 'Administrative Suite' : 'Student & Parent Portal'}
          </span>
          <span className="truncate text-[11px] text-[#d4ab94]">
            {portalMode === 'admin'
              ? (lang === 'am' ? 'የትምህርት ቤቱ አስተዳደር፣ ሬጅስትራር እና የመምህራን ማርክ ማስገቢያ ዴስክ' : 'Official Administration, Registrar Intake & Faculty Mark Registering Desk')
              : (lang === 'am' ? 'ደብረ ብርሃን ኃይለማሪያም ማሞ ሁለተኛ እና መሰናዶ ት/ቤት • የተማሪዎች ውጤት እና መረጃ' : 'Hailemariam Mamo Secondary & Prep • Student Assessment, Result Slips & Information')}
          </span>
        </div>

        {/* Site Switcher for Multi-Site Setup in Vercel */}
        {onTogglePortalMode && (
          <button
            onClick={onTogglePortalMode}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#352016] hover:bg-[#4a2e22] text-[#f7d6a5] border border-[#754c39] transition-all cursor-pointer flex-shrink-0"
            title="Switch between Public/Student Portal and Administrative Portal"
          >
            {portalMode === 'public' ? (
              <>
                <Lock className="w-3 h-3 text-[#c68a4c]" />
                <span>Switch to Admin Portal →</span>
              </>
            ) : (
              <>
                <span>← Back to Student/Public Site</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Navigation Row */}
      <div className="w-full max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6 min-w-0">
        <div className="flex items-center justify-between min-h-16 py-2 sm:py-2.5 gap-2">
          {/* School Emblem & Brand Identity */}
          <div
            onClick={() => handleNavClick(portalMode === 'admin' ? 'admin' : 'home')}
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#3b241a] via-[#5d3b2c] to-[#c68a4c] p-0.5 shadow-lg group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="w-full h-full bg-[#20130d] rounded-[10px] flex items-center justify-center border border-[#c68a4c]/40 font-serif">
                <span className="font-black text-xs sm:text-sm tracking-tighter text-[#e8b982]">HMM</span>
              </div>
            </div>
            <div className="max-w-[200px] sm:max-w-xs">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-[#e8b982] transition-colors truncate">
                  Hailemariam Mamo
                </h1>
                <span className="text-[9px] sm:text-[10px] font-bold bg-[#3b241a] text-[#e8b982] border border-[#754c39] px-1.5 py-0.2 rounded flex-shrink-0">
                  {portalMode === 'admin' ? 'Admin Site' : 'Portal'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#d4ab94] truncate leading-tight mt-0.5">
                {lang === 'am'
                  ? 'ደብረ ብርሃን ኃይለማሪያም ማሞ'
                  : 'Secondary & Prep • Debre Berhan'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1.5 flex-shrink-0" aria-label="Main Navigation">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                    isActive
                      ? 'bg-[#3b241a] text-[#f7d6a5] border border-[#c68a4c]/60 shadow-sm'
                      : 'text-[#ebd3c4] hover:text-white hover:bg-[#352016]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#c68a4c]' : 'text-[#b5846b]'}`} />
                  <span>{lang === 'am' ? item.labelAm : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language Switcher, User Status & Mobile Hamburger */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Bilingual Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#352016] hover:bg-[#4a2e22] text-[#ebd3c4] border border-[#5d3b2c] transition-colors cursor-pointer flex-shrink-0"
              title={lang === 'en' ? 'Switch to Amharic' : 'Switch to English'}
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-[#c68a4c]" />
              <span className="text-[11px] font-bold">{lang === 'en' ? 'አማርኛ' : 'EN'}</span>
            </button>

            {/* Admin Session Status */}
            {adminUser ? (
              <div className="flex items-center space-x-1.5 bg-[#3b241a] border border-[#754c39] px-2.5 py-1.5 rounded-xl text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c68a4c]" />
                <span className="font-bold text-[#e8b982] hidden md:inline truncate max-w-[110px]">
                  {adminUser.fullName.split(' ')[0]}
                </span>
                <button
                  onClick={onSignOut}
                  title="Sign out of Administrator Desk"
                  className="text-[#d4ab94] hover:text-white ml-1 p-0.5 rounded cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#ebd3c4] hover:text-white hover:bg-[#352016] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-[#4a2e22] space-y-1 animate-in fade-in">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-[#3b241a] text-[#f7d6a5] border border-[#c68a4c]/50'
                      : 'text-[#ebd3c4] hover:bg-[#352016]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#c68a4c]' : 'text-[#b5846b]'}`} />
                  <span>{lang === 'am' ? item.labelAm : item.labelEn}</span>
                </button>
              );
            })}

            {onTogglePortalMode && (
              <div className="pt-2 border-t border-[#4a2e22]">
                <button
                  onClick={() => {
                    onTogglePortalMode();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-[#3b241a] text-[#e8b982]"
                >
                  <span>{portalMode === 'public' ? 'Open Admin Suite' : 'Open Public Site'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#c68a4c]" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
