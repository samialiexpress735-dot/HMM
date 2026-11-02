import React, { useState } from 'react';
import {
  Shield,
  UserPlus,
  Key,
  Users,
  Printer,
  Copy,
  CheckCircle,
  Building2,
  Lock,
  Mail,
  Phone,
  BookOpen,
  Award,
  Sparkles,
  ChevronDown,
  RefreshCw,
  Search,
  Filter,
  Check,
  Layers,
  LogIn,
  LogOut,
  Edit3,
  Database,
  UploadCloud,
  AlertTriangle
} from 'lucide-react';
import { Teacher, Student } from '../data/schoolData';
import { UserAccount, generateStaffPassword, generateStudentPasscode } from '../utils/authUtils';
import {
  syncTeacherToCloud,
  updateAdminProfileInCloud,
  fetchTeachersFromCloud,
  syncAllTeachersToCloud,
  getSupabaseStatus,
  setSupabaseCredentials,
  getSupabaseCredentials
} from '../lib/supabase';

import { AdminUser } from './AdminSignupPage';

interface AdminPortalProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  students: Student[];
  lang: 'en' | 'am';
  adminUser?: AdminUser | null;
  onNavigateToGrades?: () => void;
  onNavigateToRegistrar?: () => void;
  onQuickTeacherLogin?: (teacher: Teacher) => void;
  onSignOut?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  teachers,
  onAddTeacher,
  students,
  lang,
  adminUser,
  onNavigateToGrades,
  onNavigateToRegistrar,
  onQuickTeacherLogin,
  onSignOut
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'staff' | 'credentials' | 'school'>('staff');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string>('');

  // Selected section for student credential slips
  const [selectedSection, setSelectedSection] = useState<string>('9A');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New Teacher Form State
  const [teacherName, setTeacherName] = useState('');
  const [teacherNameAmharic, setTeacherNameAmharic] = useState('');
  const [teacherSubject, setTeacherSubject] = useState('Mathematics');
  const [teacherDepartment, setTeacherDepartment] = useState('Natural Sciences');
  const [teacherPhone, setTeacherPhone] = useState('+251 91 ');
  const [teacherEmail, setTeacherEmail] = useState('');

  // New Sub-Admin Form State
  const [subAdminName, setSubAdminName] = useState('');
  const [subAdminRoleTitle, setSubAdminRoleTitle] = useState('Registrar Officer (የሬጅስትራር ሃላፊ)');
  const [subAdminPhone, setSubAdminPhone] = useState('+251 92 ');

  // Sub-admins list state - initialized empty as requested
  const [subAdmins, setSubAdmins] = useState<any[]>(() => {
    try {
      const s = localStorage.getItem('hmm_subadmins');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Admin Profile State & Edit Modal
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser>(() => {
    return adminUser || {
      fullName: 'Berhanu Wolde Mengesha',
      fullNameAmharic: 'ብርሃኑ ወልደ መንገሻ',
      email: 'director@hailemariammamo.edu.et',
      phone: '+251 91 142 5566',
      roleTitle: 'Principal & School Director',
      adminId: 'DIR-HMM-001',
      dateRegistered: '2024-09-01'
    };
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editFullName, setEditFullName] = useState(currentAdmin.fullName);
  const [editPhone, setEditPhone] = useState(currentAdmin.phone);
  const [editRoleTitle, setEditRoleTitle] = useState(currentAdmin.roleTitle);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdminUser = {
      ...currentAdmin,
      fullName: editFullName.trim(),
      phone: editPhone.trim(),
      roleTitle: editRoleTitle
    };
    setCurrentAdmin(updated);
    try {
      localStorage.setItem('hmm_school_admin', JSON.stringify(updated));
    } catch {
      // ignore
    }
    await updateAdminProfileInCloud(updated);
    setIsEditProfileOpen(false);
    setSuccessBanner('Administrator profile updated & saved to Supabase database!');
    setTimeout(() => setSuccessBanner(''), 5000);
  };

  // Supabase Modals and Diagnostics State
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [showSupabaseSettings, setShowSupabaseSettings] = useState(false);
  const [supabaseConfig, setSupabaseConfig] = useState(getSupabaseCredentials());
  const [supabaseStatus, setSupabaseStatus] = useState(getSupabaseStatus());
  const [isPushingAll, setIsPushingAll] = useState(false);
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseCredentials(supabaseConfig.url, supabaseConfig.key);
    setSupabaseStatus(getSupabaseStatus());
    setShowSupabaseSettings(false);
    setSuccessBanner('✓ Supabase credentials saved & client reconnected!');
    setTimeout(() => setSuccessBanner(''), 5000);
  };

  const handlePushAllToCloud = async () => {
    setIsPushingAll(true);
    setCloudSyncError(null);
    try {
      const result = await syncAllTeachersToCloud(teachers);
      if (result.successCount > 0 && result.failCount === 0) {
        setSuccessBanner(`✓ All ${result.successCount} teachers successfully synced to Supabase database!`);
        setTimeout(() => setSuccessBanner(''), 6000);
      } else if (result.successCount > 0 && result.failCount > 0) {
        setSuccessBanner(`✓ Synced ${result.successCount} teachers to Supabase. ${result.failCount} failed.`);
        setCloudSyncError(result.errors.join(' | '));
      } else {
        setCloudSyncError(result.errors[0] || 'Failed to sync teachers to Supabase.');
      }
    } catch (e: any) {
      setCloudSyncError(e.message || 'Error pushing teachers to Supabase');
    } finally {
      setIsPushingAll(false);
    }
  };

  // Add Teacher Handler with real Supabase Cloud Sync
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) return;

    const newId = `t-${Date.now()}`;
    const generatedPass = generateStaffPassword('Teacher', teacherName.split(' ')[0]);

    const newTeacher: Teacher = {
      id: newId,
      name: teacherName,
      nameAmharic: teacherNameAmharic || teacherName,
      department: teacherDepartment,
      subject: teacherSubject,
      gradesTeaching: [9, 10, 11, 12],
      sectionsTeaching: ['To be assigned in Grades of This Year'],
      email: teacherEmail || `${teacherName.toLowerCase().replace(/\s+/g, '.')}@hailemariammamo.edu.et`,
      phone: teacherPhone,
      qualification: 'B.Ed. / B.Sc. (Ethiopian University)',
      avatar: '', // Strict zero-stock-photo rule; monogram badge used
      isOnline: true,
      officeHours: 'Mon & Thu: 2:00 PM - 4:00 PM'
    };

    onAddTeacher(newTeacher);

    // Save to Supabase Cloud Database table "teachers"
    const savedToCloud = await syncTeacherToCloud(newTeacher);

    if (savedToCloud.success) {
      setCloudSyncError(null);
      setSuccessBanner(
        `✓ Teacher "${teacherName}" registered & saved to Supabase "teachers" table! Temporary password: ${generatedPass}`
      );
    } else {
      setCloudSyncError(savedToCloud.error || 'Failed to sync with Supabase');
      setSuccessBanner(
        `✓ Teacher "${teacherName}" added to faculty list. (Supabase cloud sync notice below)`
      );
    }
    setTeacherName('');
    setTeacherNameAmharic('');
    setTeacherEmail('');
    setTimeout(() => setSuccessBanner(''), 9000);
  };

  // Add Sub-Admin Handler
  const handleCreateSubAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subAdminName.trim()) return;

    const newSub = {
      id: `sub-${Date.now()}`,
      name: subAdminName,
      role: subAdminRoleTitle,
      roleAmharic: 'ረዳት አስተዳዳሪ',
      phone: subAdminPhone,
      email: `${subAdminName.toLowerCase().replace(/\s+/g, '.')}@hailemariammamo.edu.et`,
      passcode: `${subAdminName.toLowerCase().split(' ')[0]}2017!`,
      status: 'Active'
    };

    setSubAdmins([...subAdmins, newSub]);
    setSuccessBanner(`Sub-Admin "${subAdminName}" registered with login passcode: ${newSub.passcode}`);
    setSubAdminName('');
    setTimeout(() => setSuccessBanner(''), 6000);
  };

  // Filter students for the credential distribution desk
  const currentGradeNum = parseInt(selectedSection.replace(/\D/g, ''), 10) || 9;
  const currentSectionLetter = selectedSection.replace(/\d/g, '') || 'A';

  const sectionStudents = students.filter(
    (s) => s.grade === currentGradeNum && s.section.toUpperCase() === currentSectionLetter.toUpperCase()
  );

  const filteredStudents = sectionStudents.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* MoE Ethiopia Styled Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="moe-gradient-bar" />

        <div className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950 text-amber-400 p-0.5 border-2 border-amber-400 flex items-center justify-center font-bold text-xl flex-shrink-0 shadow-md">
                <span>HMM</span>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Federal MoE Certified
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Debre Berhan Secondary Bureau
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1">
                  {lang === 'am'
                    ? 'የትምህርት ቤት ዋና አስተዳዳሪና የተጠቃሚዎች መቆጣጠሪያ'
                    : 'School Director & User Provisioning Desk'}
                </h2>
                <p className="text-xs md:text-sm text-slate-500 mt-0.5">
                  Register teachers, create sub-admins, and issue official login credential slips for Grade 9A students & parents
                </p>
              </div>
            </div>

            {/* Verified Director Session Card */}
            <div className="p-3.5 bg-[#fbf9f6] rounded-2xl border border-[#ebd3c4] flex items-center justify-between gap-4 text-xs shadow-2xs">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#352016] to-[#6d3e23] text-[#e8b982] flex items-center justify-center font-black text-xs border border-[#c68a4c]/40 shadow-xs flex-shrink-0">
                  {(currentAdmin.fullName || 'BW').split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-[#20130d] flex items-center gap-1.5 truncate">
                    <span className="truncate">{currentAdmin.fullName}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" title="Active Admin Session"></span>
                  </div>
                  <span className="text-[11px] text-[#6d3e23] font-semibold block truncate">
                    {currentAdmin.roleTitle}
                  </span>
                  <div className="text-[10px] text-[#786154]">
                    ID: {currentAdmin.adminId} • <span className="text-emerald-700 font-medium">Verified Session</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setEditFullName(currentAdmin.fullName);
                    setEditPhone(currentAdmin.phone);
                    setEditRoleTitle(currentAdmin.roleTitle);
                    setIsEditProfileOpen(true);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-[#f3e8df] text-[#6d3e23] hover:bg-[#ebd3c4] border border-[#ebd3c4] transition-colors flex items-center gap-1 cursor-pointer"
                  title="Edit administrator name, phone, or title"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Profile</span>
                </button>

                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="p-1.5 rounded-lg text-[#786154] hover:text-rose-700 hover:bg-rose-50 border border-[#ebd3c4] hover:border-rose-300 transition-colors cursor-pointer"
                    title={lang === 'am' ? 'ከአስተዳዳሪ ዴስክ ውጣ' : 'Sign Out Administrator'}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED ADMIN SUB-NAVBAR (Clean, elevated, easy to manage) */}
      <nav className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-2 sm:p-2.5 sticky top-16 z-30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setActiveAdminTab('staff')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeAdminTab === 'staff'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Users className={`w-4 h-4 ${activeAdminTab === 'staff' ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>{lang === 'am' ? 'የመምህራንና ሰራተኞች ምዝገባ' : 'Staff Provisioning (Teachers & Sub-Admins)'}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeAdminTab === 'staff' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-800'
              }`}
            >
              {teachers.length + subAdmins.length}
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('credentials')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeAdminTab === 'credentials'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Key className={`w-4 h-4 ${activeAdminTab === 'credentials' ? 'text-amber-400' : 'text-amber-500'}`} />
            <span>{lang === 'am' ? 'የተማሪና ወላጅ መግቢያ ካርድ (9A)' : 'Student & Parent Login Slips (9A)'}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeAdminTab === 'credentials' ? 'bg-emerald-700 text-white' : 'bg-amber-100 text-amber-900'
              }`}
            >
              {sectionStudents.length} Active
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('school')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeAdminTab === 'school'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Building2 className={`w-4 h-4 ${activeAdminTab === 'school' ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>{lang === 'am' ? 'የትምህርት ቤት መረጃ' : 'School Profile & Accreditation'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeAdminTab === 'credentials' && (
            <button
              onClick={() => window.print()}
              className="btn-animated px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Section 9A Credential Slips</span>
            </button>
          )}

          {onNavigateToRegistrar && (
            <button
              onClick={onNavigateToRegistrar}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-emerald-950" />
              <span>{lang === 'am' ? 'ምዝገባ (2019 ዓ.ም.) →' : '2019 Registrar Desk →'}</span>
            </button>
          )}

          {onNavigateToGrades && (
            <button
              onClick={onNavigateToGrades}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>{lang === 'am' ? 'የዘንድሮ ክፍሎች →' : 'Grades of This Year →'}</span>
            </button>
          )}
        </div>
      </nav>

      {/* Feedback Success Notice */}
      {successBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            {successBanner}
          </span>
        </div>
      )}

      {/* Cloud Sync Alert Banner */}
      {cloudSyncError && (
        <div className="p-4 rounded-2xl bg-[#faf5f1] border-2 border-amber-400 text-[#3b241a] text-xs shadow-sm space-y-2.5 animate-in fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-extrabold text-[#2e1c14] text-sm flex items-center gap-2">
                  <span>Supabase Database Write Alert</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-200 text-amber-900 uppercase">
                    Action Required in Supabase
                  </span>
                </span>
                <span className="text-[11px] text-[#754c39]">
                  {supabaseStatus.isConfigured ? '🟢 Connected to Cloud' : '⚠️ Client offline'}
                </span>
              </div>
              <p className="text-[12px] text-[#5d3b2c] leading-relaxed">
                The teacher was added to your local session, but could not be saved to your remote Supabase <code className="bg-amber-100 px-1 py-0.5 rounded text-[#2e1c14] font-bold">teachers</code> table.
              </p>
              <div className="p-2.5 rounded-xl bg-white border border-amber-300 font-mono text-[11px] text-amber-950 overflow-x-auto">
                {cloudSyncError}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowSqlModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#4a2e22] hover:bg-[#352016] text-[#f7d6a5] font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-[#c68a4c]" />
                  <span>View & Copy SQL Fix Script (Run in Supabase)</span>
                </button>
                <button
                  type="button"
                  onClick={handlePushAllToCloud}
                  disabled={isPushingAll}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-400 text-[#4a2e22] font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isPushingAll ? 'Pushing All to Supabase...' : 'Retry Push All Teachers to Cloud'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSupabaseSettings(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Supabase URL & Key Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: STAFF PROVISIONING (TEACHERS & SUB-ADMINS) */}
      {activeAdminTab === 'staff' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Register New Teacher or Sub-Admin Forms (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Form 1: Add Teacher */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <UserPlus className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base">
                    Register New Subject Teacher
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Instantly generates faculty email and temporary login passcode
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateTeacher} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Teacher Full Name (English):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Ato Yonas Bekele"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Teacher Full Name (አማርኛ):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., አቶ ዮናስ በቀለ"
                    value={teacherNameAmharic}
                    onChange={(e) => setTeacherNameAmharic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Subject:</label>
                    <select
                      value={teacherSubject}
                      onChange={(e) => setTeacherSubject(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="English Language">English</option>
                      <option value="Amharic">Amharic</option>
                      <option value="Geography">Geography</option>
                      <option value="History">History</option>
                      <option value="Civics">Civics</option>
                      <option value="ICT">ICT</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Phone Number (+251):</label>
                    <input
                      type="tel"
                      required
                      placeholder="+251 91 123 4567"
                      value={teacherPhone}
                      onChange={(e) => setTeacherPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950">
                  <span className="p-1 bg-emerald-200/70 text-emerald-900 rounded-lg font-bold text-[11px] mt-0.5">
                    💡
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900">
                      {lang === 'am' ? 'የክፍል ምደባ (በቀላሉ በ1-ጠቅታ)' : 'Class & Section Assignments (No Manual Typing)'}
                    </p>
                    <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">
                      {lang === 'am'
                        ? 'የክፍል ኃላፊ መምህር እና ተወካይ መምህር ምደባዎች በ"የዘንድሮ ክፍሎች" ገጽ ላይ በምስል እና በ1-ጠቅታ ይከናወናሉ።'
                        : 'Homeroom teachers and class representative teachers are assigned effortlessly in the "Grades of This Year" page.'}
                    </p>
                    {onNavigateToGrades && (
                      <button
                        type="button"
                        onClick={onNavigateToGrades}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        {lang === 'am' ? 'ወደ ዘንድሮ ክፍሎች ገጽ ሂድ →' : 'Go to Grades of This Year →'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-animated w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    + Register & Issue Teacher Credentials
                  </button>
                </div>
              </form>
            </div>

            {/* Form 2: Add Sub-Admin */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
                <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Shield className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base">
                    Register Sub-Administrator
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Registrar, Vice Principal, Examination Officer
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateSubAdmin} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Staff Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., W/ro Bethlehem Tadesse"
                    value={subAdminName}
                    onChange={(e) => setSubAdminName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Administrative Role:
                  </label>
                  <select
                    value={subAdminRoleTitle}
                    onChange={(e) => setSubAdminRoleTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Registrar Officer (የሬጅስትራር ሃላፊ)">Registrar Officer (የሬጅስትራር ሃላፊ)</option>
                    <option value="Vice Principal - Academics (ምክትል ርዕሰ-መምህር)">Vice Principal - Academics (ምክትል ርዕሰ-መምህር)</option>
                    <option value="Examination Officer (የፈተና ሃላፊ)">Examination Officer (የፈተና ሃላፊ)</option>
                    <option value="Student Dean (የተማሪዎች ዲን)">Student Dean (የተማሪዎች ዲን)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number:</label>
                  <input
                    type="tel"
                    required
                    placeholder="+251 92 110 9988"
                    value={subAdminPhone}
                    onChange={(e) => setSubAdminPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="btn-animated w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    + Register Sub-Admin
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Active Staff Directory (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Active Faculty & Staff Directory ({teachers.length + subAdmins.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Credential status, assigned sections, and temporary passcodes
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={handlePushAllToCloud}
                    disabled={isPushingAll || teachers.length === 0}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#352016] hover:bg-[#20130d] text-[#f7d6a5] transition-colors cursor-pointer disabled:opacity-50"
                    title="Push all registered teachers in this browser to Supabase PostgreSQL"
                  >
                    <UploadCloud className="w-3 h-3 text-[#c68a4c]" />
                    <span>{isPushingAll ? 'Pushing...' : 'Push All to Supabase'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const live = await fetchTeachersFromCloud();
                        if (live && live.length > 0) {
                          live.forEach((t) => onAddTeacher(t));
                          setSuccessBanner(`✓ Retrieved ${live.length} live teachers from Supabase database!`);
                          setTimeout(() => setSuccessBanner(''), 5000);
                        } else {
                          setSuccessBanner('Supabase database currently has 0 teachers stored.');
                          setTimeout(() => setSuccessBanner(''), 4000);
                        }
                      } catch (e: any) {
                        setSuccessBanner(`Error fetching teachers: ${e.message}`);
                      }
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#f3e8df] hover:bg-[#ebd3c4] text-[#6d3e23] border border-[#ebd3c4] transition-colors cursor-pointer"
                    title="Fetch and sync all teachers from Supabase"
                  >
                    <RefreshCw className="w-3 h-3 text-[#6d3e23]" />
                    <span>Sync Supabase</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSqlModal(true)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#faf5f1] hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors cursor-pointer"
                    title="View and copy the SQL script to fix permissions in Supabase"
                  >
                    <Database className="w-3 h-3 text-amber-600" />
                    <span>SQL Fix</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowSupabaseSettings(true)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black cursor-pointer ${
                      supabaseStatus.isConfigured
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                    title="Click to check or update Supabase connection settings"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus.isConfigured ? 'bg-emerald-600' : 'bg-amber-600 animate-ping'}`} />
                    <span>{supabaseStatus.isConfigured ? 'DB Live' : 'Connect DB'}</span>
                  </button>
                </div>
              </div>

              {/* Teachers List */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Subject Teachers ({teachers.length})
                </div>

                {teachers.length === 0 ? (
                  <div className="p-6 text-center rounded-2xl border-2 border-dashed border-[#d4ab94]/60 bg-[#faf5f1]/60 space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-[#ebd3c4] text-[#4a2e22] flex items-center justify-center font-bold">
                      <UserPlus className="w-5 h-5 text-[#4a2e22]" />
                    </div>
                    <div className="font-extrabold text-[#2e1c14] text-xs">No Teachers Registered Yet</div>
                    <p className="text-[11px] text-[#754c39] max-w-sm mx-auto leading-relaxed">
                      Use the form on the left to register your faculty members. Each teacher will receive their verified login credentials here.
                    </p>
                  </div>
                ) : (
                  teachers.map((t) => {
                    const staffPass = generateStaffPassword('Teacher', t.name.split(' ')[0]);
                    const initials = t.name.split(' ').map((n) => n[0]).slice(0, 2).join('');
                    return (
                      <div
                        key={t.id}
                        className="p-4 rounded-2xl bg-white border border-[#ebd3c4] hover:bg-[#faf5f1] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="avatar-monogram w-10 h-10 rounded-xl flex-shrink-0 text-xs font-black">
                            {initials || 'TR'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#2e1c14]">{t.name}</span>
                              <span className="text-[10px] bg-[#ebd3c4] text-[#3b241a] font-bold px-2 py-0.5 rounded">
                                {t.subject}
                              </span>
                            </div>
                            <span className="text-[#754c39] block text-[11px]">{t.email}</span>
                            <span className="text-[#5d3b2c] font-mono text-[11px]">
                              Classes: <strong className="text-[#2e1c14]">{t.sectionsTeaching?.join(', ') || 'Unassigned'}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                          <div className="p-2 bg-[#faf5f1] rounded-lg border border-[#ebd3c4] font-mono text-[11px] text-[#4a2e22]">
                            Password: <strong className="text-[#2e1c14] font-black">{staffPass}</strong>
                          </div>
                          <button
                            onClick={() => handleCopy(`${t.email} / ${staffPass}`, t.id)}
                            className="p-2 bg-[#ebd3c4]/70 hover:bg-[#ebd3c4] rounded-lg text-[#3b241a] transition-colors cursor-pointer"
                            title="Copy login credentials"
                          >
                            {copiedId === t.id ? <Check className="w-3.5 h-3.5 text-[#2e1c14]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          {onQuickTeacherLogin && (
                            <button
                              onClick={() => onQuickTeacherLogin(t)}
                              className="btn-animated px-2.5 py-1.5 bg-[#4a2e22] hover:bg-[#352016] text-[#f7d6a5] font-bold rounded-lg text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                              title="Directly switch to Teacher Suite logged in as this educator"
                            >
                              <LogIn className="w-3 h-3 text-[#c68a4c]" />
                              <span>Sign in</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Sub-Admins List */}
                <div className="pt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Sub-Administrators ({subAdmins.length})
                </div>

                {subAdmins.length === 0 ? (
                  <div className="p-4 text-center rounded-2xl border border-dashed border-[#d4ab94]/60 bg-[#faf5f1]/40 text-[11px] text-[#754c39]">
                    No administrative officers registered yet. Use the sub-admin form on the left to assign registrar or dean roles.
                  </div>
                ) : (
                  subAdmins.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-2xl bg-[#faf5f1] border border-[#ebd3c4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#2e1c14]">{sub.name}</span>
                          <span className="text-[10px] bg-[#ebd3c4] text-[#3b241a] font-bold px-2 py-0.5 rounded">
                            {sub.role}
                          </span>
                        </div>
                        <span className="text-[#754c39] block text-[11px]">{sub.email} • {sub.phone}</span>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <div className="p-2 bg-white rounded-lg border border-[#ebd3c4] font-mono text-[11px] text-[#4a2e22]">
                          Pass: <strong className="text-[#2e1c14]">{sub.passcode}</strong>
                        </div>
                        <button
                          onClick={() => handleCopy(`${sub.email} / ${sub.passcode}`, sub.id)}
                          className="p-2 bg-[#ebd3c4]/70 hover:bg-[#ebd3c4] rounded-lg text-[#3b241a] transition-colors cursor-pointer"
                          title="Copy login credentials"
                        >
                          {copiedId === sub.id ? <Check className="w-3.5 h-3.5 text-[#2e1c14]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDENT & PARENT CREDENTIAL SLIPS */}
      {activeAdminTab === 'credentials' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-500" />
                  <span>Student & Parent Access Slips Generator (የተማሪና የወላጅ መግቢያ ፈቃድ)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Issue unique passcodes to students and parents for secure viewing of marks and report cards
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-600">Select Section:</span>
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="9A">Grade 9 - Section &quot;A&quot; (10 Students)</option>
                    <option value="9B">Grade 9 - Section &quot;B&quot;</option>
                    <option value="10A">Grade 10 - Section &quot;A&quot;</option>
                    <option value="12A">Grade 12 - Natural Science A</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Credential Cards Grid */}
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map((student, idx) => {
                const studentPasscode = generateStudentPasscode(student.grade, student.section, idx + 1);
                const parentPasscode = `PAR-9A-${String(idx + 1).padStart(2, '0')}`;

                return (
                  <div
                    key={student.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 relative overflow-hidden shadow-xs hover:border-emerald-300 transition-all text-xs"
                  >
                    {/* Ethiopian Header Strip */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
                      <div>
                        <span className="font-black text-slate-900 text-sm">{student.fullName}</span>
                        <span className="text-[11px] text-slate-500 block">{student.fullNameAmharic}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        Gr. {student.grade}-{student.section}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Student Credentials */}
                      <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80">
                        <span className="text-[10px] font-bold uppercase text-emerald-900 block mb-1">
                          Student Portal Access:
                        </span>
                        <div className="space-y-0.5 font-mono text-[11px]">
                          <div>ID: <strong className="text-slate-900">{student.studentId}</strong></div>
                          <div>PIN: <strong className="text-emerald-800">{studentPasscode}</strong></div>
                        </div>
                      </div>

                      {/* Parent Credentials */}
                      <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80">
                        <span className="text-[10px] font-bold uppercase text-amber-900 block mb-1">
                          Parent / Guardian Access:
                        </span>
                        <div className="space-y-0.5 text-[11px]">
                          <div className="truncate text-slate-700">{student.guardianName}</div>
                          <div className="font-mono">Tel: <strong className="text-slate-900">{student.guardianPhone}</strong></div>
                          <div className="font-mono">Code: <strong className="text-amber-900">{parentPasscode}</strong></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Hailemariam Mamo Secondary SIS</span>
                      <button
                        onClick={() => handleCopy(`${student.studentId} / PIN: ${studentPasscode}`, student.id)}
                        className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {copiedId === student.id ? 'Copied!' : 'Copy Slip'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SCHOOL PROFILE & MOE ACCREDITATION */}
      {activeAdminTab === 'school' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">
              Official School Registration & Accreditation Record
            </h3>
            <p className="text-xs text-slate-500">
              Verified by Amhara Regional Education Bureau & Federal Ministry of Education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">Institution Details</span>
              <p><strong>Official Name:</strong> Hailemariam Mamo Secondary and Preparatory School</p>
              <p><strong>Amharic Name:</strong> ደብረ ብርሃን ኃይለማሪያም ማሞ አጠቃላይ ሁለተኛ እና መሰናዶ ትምህርት ቤት</p>
              <p><strong>MoE Center Code:</strong> MOE-DB-HMM-0912</p>
              <p><strong>Grades Served:</strong> Grades 9 to 12 (General Secondary + Preparatory)</p>
              <p><strong>Region / Zone:</strong> Amhara Region • North Shewa Zone • Debre Berhan City Administration</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">Security & Privacy Protocol</span>
              <p>✓ All student continuous assessment marks & attendance are restricted to authorized faculty.</p>
              <p>✓ Grade 12 National University Entrance (ESSLCE) marks are encrypted and verified against EAES standards.</p>
              <p>✓ Parents receive access codes to monitor their student&apos;s daily attendance and semester report cards.</p>
            </div>
          </div>
        </div>
      )}

      {/* PRINT-ONLY SECTION 9A CREDENTIAL SLIPS */}
      <div className="hidden print:block p-4 bg-white text-black font-sans">
        <div className="text-center border-b-2 border-black pb-3 mb-6">
          <h2 className="text-lg font-bold uppercase">Hailemariam Mamo Secondary & Preparatory School</h2>
          <p className="text-xs">Debre Berhan, Ethiopia • Student & Parent SIS Portal Access Cards (Section {selectedSection})</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {sectionStudents.map((st, i) => (
            <div key={st.id} className="border-2 border-dashed border-black p-3 rounded-lg text-xs break-inside-avoid">
              <div className="font-bold text-sm border-b border-black pb-1 mb-2">
                {st.fullName} ({st.fullNameAmharic}) - Grade {st.grade}{st.section}
              </div>
              <p><strong>Student ID:</strong> {st.studentId}</p>
              <p><strong>Student Portal PIN:</strong> {generateStudentPasscode(st.grade, st.section, i + 1)}</p>
              <p className="mt-2 text-[10px] text-slate-700"><strong>Parent Guardian:</strong> {st.guardianName} ({st.guardianPhone})</p>
              <p className="text-[10px] text-slate-700"><strong>Parent Access Code:</strong> PAR-9A-{String(i + 1).padStart(2, '0')}</p>
              <div className="mt-2 text-[9px] text-slate-500 border-t border-slate-300 pt-1">
                Portal: https://hailemariammamo.et • Cut along dashed line to deliver to parent
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT ADMINISTRATOR PROFILE MODAL */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-[#150c08]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#ebd3c4] shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#ebd3c4]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#6d3e23]" />
                <h3 className="font-extrabold text-[#20130d] text-base">Edit Administrator Profile</h3>
              </div>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="text-[#786154] hover:text-[#20130d] font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#20130d] mb-1">Administrator Full Name:</label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#20130d] mb-1">Administrative Role Title:</label>
                <input
                  type="text"
                  required
                  value={editRoleTitle}
                  onChange={(e) => setEditRoleTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#20130d] mb-1">Official Phone Number:</label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#786154] hover:bg-[#f3e8df] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#352016] hover:bg-[#20130d] text-white font-bold rounded-xl shadow-xs"
                >
                  Save to Supabase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1-CLICK SQL FIX MODAL */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-[#150c08]/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 border border-[#ebd3c4] shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#ebd3c4] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#ebd3c4] rounded-xl text-[#3b241a]">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#20130d] text-base">Supabase Database Setup & Permissions SQL</h3>
                  <p className="text-[11px] text-[#786154]">Run this 1-minute query once in your Supabase SQL Editor</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="w-8 h-8 rounded-full bg-[#f3e8df] text-[#6d3e23] hover:bg-[#ebd3c4] flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 py-3 overflow-y-auto flex-1 text-xs">
              <div className="p-3 bg-[#fbf9f6] rounded-xl border border-[#ebd3c4] text-[#352016] space-y-1">
                <div className="font-bold text-[#20130d]">Quick 3-Step Guide:</div>
                <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-[#5d3b2c]">
                  <li>Open your Supabase Project dashboard (<code className="font-mono bg-white px-1 py-0.5 rounded border border-[#ebd3c4]">HMM</code>)</li>
                  <li>Click <strong className="text-[#20130d]">SQL Editor</strong> in the left sidebar → <strong className="text-[#20130d]">+ New Query</strong></li>
                  <li>Click the button below to copy the script, paste it into the editor, and click <strong className="text-[#20130d]">Run</strong></li>
                </ol>
              </div>

              <div className="relative">
                <pre className="p-3.5 bg-[#170d08] text-[#e8b982] rounded-xl text-[10.5px] font-mono leading-relaxed overflow-x-auto max-h-64 border border-[#3b241a]">
{`-- 1. Ensure Teachers Table exists with correct primary key and columns
CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_amharic TEXT,
  department TEXT NOT NULL DEFAULT 'Secondary Faculty',
  subject TEXT NOT NULL DEFAULT 'General',
  email TEXT,
  phone TEXT,
  qualification TEXT DEFAULT 'B.Ed. (Ethiopian University)',
  avatar TEXT DEFAULT '',
  office_hours TEXT DEFAULT 'Mon & Thu: 2:00 PM - 4:00 PM',
  is_online BOOLEAN DEFAULT false,
  sections_teaching TEXT[] DEFAULT ARRAY[]::TEXT[],
  grades_teaching INT[] DEFAULT ARRAY[9, 10, 11, 12]::INT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add columns if table already existed
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS name_amharic TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Secondary Faculty';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS subject TEXT DEFAULT 'General';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS qualification TEXT DEFAULT 'B.Ed. (Ethiopian University)';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS office_hours TEXT DEFAULT 'Mon & Thu: 2:00 PM - 4:00 PM';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS sections_teaching TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS grades_teaching INT[] DEFAULT ARRAY[9, 10, 11, 12]::INT[];

-- 3. Convert id column to TEXT if it was created as BIGINT or UUID
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'teachers' AND column_name = 'id' AND data_type != 'text'
  ) THEN
    ALTER TABLE teachers ALTER COLUMN id TYPE TEXT USING id::text;
  END IF;
END $$;

-- 4. Grant table privileges
GRANT ALL ON TABLE teachers TO anon, authenticated, service_role;

-- 5. Enable Row Level Security (RLS) & Write Policies
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read teachers" ON teachers;
CREATE POLICY "Public read teachers" ON teachers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow write teachers" ON teachers;
CREATE POLICY "Allow write teachers" ON teachers FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow insert teachers" ON teachers;
CREATE POLICY "Allow insert teachers" ON teachers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update teachers" ON teachers;
CREATE POLICY "Allow update teachers" ON teachers FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow delete teachers" ON teachers;
CREATE POLICY "Allow delete teachers" ON teachers FOR DELETE USING (true);

-- 6. Profiles Table Fixes (password column & RLS)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password TEXT;
GRANT ALL ON TABLE profiles TO anon, authenticated, service_role;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow write profiles" ON profiles;
CREATE POLICY "Allow write profiles" ON profiles FOR ALL USING (true);

-- 7. Reload Schema Cache
NOTIFY pgrst, 'reload schema';`}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-[#ebd3c4] flex items-center justify-between gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-xl text-[#786154] hover:bg-[#f3e8df] font-bold text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const sqlContent = `-- Hailemariam Mamo Secondary & Prep School - Fix Permissions & Schema
CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_amharic TEXT,
  department TEXT NOT NULL DEFAULT 'Secondary Faculty',
  subject TEXT NOT NULL DEFAULT 'General',
  email TEXT,
  phone TEXT,
  qualification TEXT DEFAULT 'B.Ed. (Ethiopian University)',
  avatar TEXT DEFAULT '',
  office_hours TEXT DEFAULT 'Mon & Thu: 2:00 PM - 4:00 PM',
  is_online BOOLEAN DEFAULT false,
  sections_teaching TEXT[] DEFAULT ARRAY[]::TEXT[],
  grades_teaching INT[] DEFAULT ARRAY[9, 10, 11, 12]::INT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE teachers ADD COLUMN IF NOT EXISTS name_amharic TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS department TEXT DEFAULT 'Secondary Faculty';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS subject TEXT DEFAULT 'General';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS qualification TEXT DEFAULT 'B.Ed. (Ethiopian University)';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS office_hours TEXT DEFAULT 'Mon & Thu: 2:00 PM - 4:00 PM';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false;
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS sections_teaching TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS grades_teaching INT[] DEFAULT ARRAY[9, 10, 11, 12]::INT[];

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'teachers' AND column_name = 'id' AND data_type != 'text'
  ) THEN
    ALTER TABLE teachers ALTER COLUMN id TYPE TEXT USING id::text;
  END IF;
END $$;

GRANT ALL ON TABLE teachers TO anon, authenticated, service_role;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read teachers" ON teachers;
CREATE POLICY "Public read teachers" ON teachers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow write teachers" ON teachers;
CREATE POLICY "Allow write teachers" ON teachers FOR ALL USING (true);
DROP POLICY IF EXISTS "Allow insert teachers" ON teachers;
CREATE POLICY "Allow insert teachers" ON teachers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow update teachers" ON teachers;
CREATE POLICY "Allow update teachers" ON teachers FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Allow delete teachers" ON teachers;
CREATE POLICY "Allow delete teachers" ON teachers FOR DELETE USING (true);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password TEXT;
GRANT ALL ON TABLE profiles TO anon, authenticated, service_role;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow write profiles" ON profiles;
CREATE POLICY "Allow write profiles" ON profiles FOR ALL USING (true);

NOTIFY pgrst, 'reload schema';`;
                  navigator.clipboard.writeText(sqlContent);
                  setSuccessBanner('✓ Complete SQL Fix Script copied to clipboard! Paste into Supabase SQL Editor.');
                  setTimeout(() => setSuccessBanner(''), 6000);
                  setShowSqlModal(false);
                }}
                className="px-5 py-2.5 bg-[#352016] hover:bg-[#20130d] text-[#f7d6a5] font-black rounded-xl text-xs flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Copy className="w-4 h-4 text-[#c68a4c]" />
                <span>Copy Entire SQL Script to Clipboard</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUPABASE CONNECTION SETTINGS MODAL */}
      {showSupabaseSettings && (
        <div className="fixed inset-0 z-50 bg-[#150c08]/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 border border-[#ebd3c4] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#ebd3c4] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#ebd3c4] rounded-xl text-[#3b241a]">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#20130d] text-base">Supabase Credentials</h3>
                  <p className="text-[11px] text-[#786154]">Connect your live PostgreSQL database</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSupabaseSettings(false)}
                className="w-8 h-8 rounded-full bg-[#f3e8df] text-[#6d3e23] hover:bg-[#ebd3c4] flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSupabaseConfig} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#20130d] mb-1">
                  Supabase Project URL (VITE_SUPABASE_URL):
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://your-project-id.supabase.co"
                  value={supabaseConfig.url}
                  onChange={(e) => setSupabaseConfig({ ...supabaseConfig, url: e.target.value })}
                  className="w-full px-3 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23] font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#20130d] mb-1">
                  Supabase Anon Public API Key (VITE_SUPABASE_ANON_KEY):
                </label>
                <input
                  type="text"
                  required
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseConfig.key}
                  onChange={(e) => setSupabaseConfig({ ...supabaseConfig, key: e.target.value })}
                  className="w-full px-3 py-2 bg-[#fbf9f6] border border-[#ebd3c4] rounded-xl text-xs text-[#20130d] focus:outline-hidden focus:ring-2 focus:ring-[#6d3e23] font-mono"
                />
              </div>

              <div className="p-2.5 rounded-xl bg-[#faf5f1] border border-[#ebd3c4] text-[11px] text-[#5d3b2c] space-y-1">
                <div className="font-bold text-[#20130d]">Where to find these in Supabase:</div>
                <p>1. Open your project on supabase.com → Click <strong>Settings (Gear icon)</strong> → <strong>API</strong></p>
                <p>2. Copy <strong>Project URL</strong> and <strong>Project API Keys (anon public)</strong></p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSupabaseSettings(false)}
                  className="px-4 py-2 rounded-xl text-[#786154] hover:bg-[#f3e8df] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#352016] hover:bg-[#20130d] text-[#f7d6a5] font-black rounded-xl shadow-xs"
                >
                  Save & Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
