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
  AlertTriangle,
  Trash2,
  Calendar,
  Bell
} from 'lucide-react';
import { Teacher, Student, GradeSection, SchoolEvent, SchoolAnnouncement } from '../data/schoolData';
import { UserAccount, generateStaffPassword, generateStudentPasscode } from '../utils/authUtils';
import {
  syncTeacherToCloud,
  updateAdminProfileInCloud,
  syncSubAdminToCloud,
  fetchSubAdminsFromCloud
} from '../lib/supabase';

import { AdminUser } from './AdminSignupPage';

interface AdminPortalProps {
  teachers: Teacher[];
  onAddTeacher: (teacher: Teacher) => void;
  onDeleteTeacher?: (teacherId: string) => void;
  students: Student[];
  sections?: GradeSection[];
  events?: SchoolEvent[];
  onAddEvent?: (event: SchoolEvent) => void;
  announcements?: SchoolAnnouncement[];
  onAddAnnouncement?: (announcement: SchoolAnnouncement) => void;
  lang: 'en' | 'am';
  adminUser?: AdminUser | null;
  onNavigateToGrades?: () => void;
  onNavigateToRegistrar?: () => void;
  onSignOut?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  teachers,
  onAddTeacher,
  onDeleteTeacher,
  students,
  sections = [],
  events = [],
  onAddEvent,
  announcements = [],
  onAddAnnouncement,
  lang,
  adminUser,
  onNavigateToGrades,
  onNavigateToRegistrar,
  onSignOut
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'staff' | 'credentials' | 'notices' | 'school'>('staff');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string>('');

  // Available sections list (dynamic from sections data)
  const availableSections = sections.length > 0
    ? Array.from(new Set(sections.map((s) => s.section)))
    : ['9-A', '9-B', '10-A', '11-Nat-A', '12-Nat-A'];

  // Selected section for student credential slips
  const [selectedSection, setSelectedSection] = useState<string>(availableSections[0] || '9-A');
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
  const [subAdminEmail, setSubAdminEmail] = useState('');

  // New Announcement Form State
  const [annTitle, setAnnTitle] = useState('');
  const [annTitleAmharic, setAnnTitleAmharic] = useState('');
  const [annCategory, setAnnCategory] = useState<'Administrative' | 'Academic' | 'Parent Notice' | 'Examination' | 'General'>('Administrative');
  const [annSummary, setAnnSummary] = useState('');
  const [annIsUrgent, setAnnIsUrgent] = useState(false);

  // New Calendar Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventTitleAmharic, setEventTitleAmharic] = useState('');
  const [eventDate, setEventDate] = useState('2024-11-15');
  const [eventEthDate, setEventEthDate] = useState('ህዳር 6 ቀን 2017');
  const [eventTime, setEventTime] = useState('8:30 AM');
  const [eventLocation, setEventLocation] = useState('School Main Assembly Hall');
  const [eventCategory, setEventCategory] = useState<'Exam' | 'Holiday' | 'Sports' | 'PTA' | 'Academic' | 'Club'>('Academic');
  const [eventDesc, setEventDesc] = useState('');

  // Sub-admins list state - initialized with stored or cloud data
  const [subAdmins, setSubAdmins] = useState<any[]>(() => {
    try {
      const s = localStorage.getItem('hmm_subadmins');
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  // Load sub-admins from Supabase profiles on mount
  React.useEffect(() => {
    async function loadCloudSubAdmins() {
      try {
        const cloudSubs = await fetchSubAdminsFromCloud();
        if (cloudSubs && cloudSubs.length > 0) {
          setSubAdmins(cloudSubs);
        }
      } catch (err) {
        console.warn('SubAdmin load error:', err);
      }
    }
    loadCloudSubAdmins();
  }, []);

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
    setSuccessBanner('Administrator profile updated successfully!');
    setTimeout(() => setSuccessBanner(''), 4000);
  };

  // Add Teacher Handler with real email requirement and instant background Supabase Cloud Sync
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherName.trim()) {
      setSuccessBanner('Please enter the teacher full name.');
      return;
    }
    if (!teacherEmail.trim()) {
      setSuccessBanner('Please enter the teacher actual email address.');
      return;
    }

    const newId = `t-${Date.now()}`;
    const generatedPass = generateStaffPassword('Teacher', teacherName.split(' ')[0]);

    const newTeacher: Teacher = {
      id: newId,
      name: teacherName.trim(),
      nameAmharic: teacherNameAmharic.trim() || teacherName.trim(),
      department: teacherDepartment,
      subject: teacherSubject,
      gradesTeaching: [9, 10, 11, 12],
      sectionsTeaching: ['To be assigned in Grades of This Year'],
      email: teacherEmail.trim().toLowerCase(),
      phone: teacherPhone.trim(),
      qualification: 'B.Ed. / B.Sc. (Ethiopian University)',
      avatar: '',
      isOnline: true,
      officeHours: 'Mon & Thu: 2:00 PM - 4:00 PM'
    };

    // 1. Optimistic instant UI update
    onAddTeacher(newTeacher);

    // 2. Silent background sync to Supabase database
    syncTeacherToCloud(newTeacher);

    setSuccessBanner(
      `✓ Teacher "${teacherName}" registered successfully with email ${teacherEmail}! Passcode: ${generatedPass}`
    );
    setTeacherName('');
    setTeacherNameAmharic('');
    setTeacherEmail('');
    setTimeout(() => setSuccessBanner(''), 8000);
  };

  // Add Sub-Admin Handler with real email requirement and cloud sync
  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subAdminName.trim()) {
      setSuccessBanner('Please enter the staff member name.');
      return;
    }
    if (!subAdminEmail.trim()) {
      setSuccessBanner('Please enter the sub-administrator actual email address.');
      return;
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      name: subAdminName.trim(),
      role: subAdminRoleTitle,
      roleAmharic: 'ረዳት አስተዳዳሪ',
      phone: subAdminPhone.trim(),
      email: subAdminEmail.trim().toLowerCase(),
      passcode: `${subAdminName.trim().toLowerCase().split(' ')[0]}2017!`,
      status: 'Active'
    };

    setSubAdmins((prev) => [...prev, newSub]);
    try {
      localStorage.setItem('hmm_subadmins', JSON.stringify([...subAdmins, newSub]));
    } catch {
      // ignore
    }

    // Direct background sync to Supabase profiles table
    syncSubAdminToCloud(newSub);

    setSuccessBanner(`✓ Sub-Admin "${subAdminName}" registered with email ${newSub.email}! Passcode: ${newSub.passcode}`);
    setSubAdminName('');
    setSubAdminEmail('');
    setTimeout(() => setSuccessBanner(''), 8000);
  };

  // Add Official Announcement Handler
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annSummary.trim()) return;

    const newAnn: SchoolAnnouncement = {
      id: `ann-${Date.now()}`,
      title: annTitle.trim(),
      titleAmharic: annTitleAmharic.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
      datePosted: new Date().toISOString().split('T')[0],
      category: annCategory,
      postedBy: currentAdmin.fullName || 'School Director',
      summary: annSummary.trim(),
      isUrgent: annIsUrgent
    };

    if (onAddAnnouncement) {
      onAddAnnouncement(newAnn);
    }
    setSuccessBanner(`✓ Announcement "${annTitle}" posted to school portal!`);
    setAnnTitle('');
    setAnnTitleAmharic('');
    setAnnSummary('');
    setAnnIsUrgent(false);
    setTimeout(() => setSuccessBanner(''), 6000);
  };

  // Add Academic Calendar Event Handler
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEv: SchoolEvent = {
      id: `ev-${Date.now()}`,
      title: eventTitle.trim(),
      titleAmharic: eventTitleAmharic.trim() || eventTitle.trim(),
      date: eventDate,
      ethiopianDate: eventEthDate,
      time: eventTime,
      location: eventLocation,
      category: eventCategory,
      targetGrades: [9, 10, 11, 12],
      description: eventDesc.trim() || 'Official school event scheduled by administration.',
      descriptionAmharic: 'በት/ቤቱ አስተዳደር የተመዘገበ ኦፊሴላዊ የትምህርት ቤት ክንውን'
    };

    if (onAddEvent) {
      onAddEvent(newEv);
    }
    setSuccessBanner(`✓ Calendar Event "${eventTitle}" added for ${eventEthDate}!`);
    setEventTitle('');
    setEventTitleAmharic('');
    setEventDesc('');
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
                  Register faculty, create sub-administrators, post school notices, and issue student & parent access slips
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
            <span>{lang === 'am' ? 'የተማሪና ወላጅ መግቢያ ካርድ' : 'Student & Parent Login Slips'}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeAdminTab === 'credentials' ? 'bg-emerald-700 text-white' : 'bg-amber-100 text-amber-900'
              }`}
            >
              {sectionStudents.length} Active
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('notices')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeAdminTab === 'notices'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <span className="p-1 rounded bg-amber-100 text-amber-800">
              <BookOpen className="w-3.5 h-3.5" />
            </span>
            <span>{lang === 'am' ? 'ማስታወቂያና ካላንደር' : 'Announcements & Calendar'}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeAdminTab === 'notices' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-800'
              }`}
            >
              {announcements.length + events.length}
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
              <span>Print Section {selectedSection} Credential Slips</span>
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

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Teacher Real Email (የአስተማሪው እውነተኛ ኢሜይል):
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., yonas.bekele@gmail.com"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Actual email of the educator (no custom school domain generated)
                  </span>
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

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Staff Real Email Address (የሰራተኛው እውነተኛ ኢሜይል):
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., betty.tadesse@gmail.com"
                    value={subAdminEmail}
                    onChange={(e) => setSubAdminEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Saved directly to Supabase profiles database table
                  </span>
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
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                    Debre Berhan Campus
                  </span>
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
                          {onDeleteTeacher && (
                            <button
                              onClick={() => {
                                onDeleteTeacher(t.id);
                                setSuccessBanner(`Removed ${t.name} from faculty directory and database.`);
                                setTimeout(() => setSuccessBanner(''), 3000);
                              }}
                              className="p-2 bg-rose-50 hover:bg-rose-100 rounded-lg text-rose-700 transition-colors cursor-pointer border border-rose-200"
                              title={`Delete ${t.name} from faculty`}
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
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
                    {availableSections.map((sec) => (
                      <option key={sec} value={sec}>
                        Section &quot;{sec}&quot;
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Credential Cards Grid */}
            <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map((student, idx) => {
                const studentPasscode = generateStudentPasscode(student.grade, student.section, idx + 1);
                const parentPasscode = `PAR-${student.grade}${student.section}-${String(idx + 1).padStart(2, '0')}`;

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

      {/* TAB: NOTICES & ACADEMIC CALENDAR DESK (ADMIN POSTED) */}
      {activeAdminTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Post Announcement and Calendar Event Forms (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Form 1: Post Announcement */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
                <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base">
                    Post School Announcement (ማስታወቂያ ይለጥፉ)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Immediately appears on the portal home page for students, parents, and visitors
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Announcement Title (English):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., First Semester Mid-Exam Registration Period"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Announcement Title (አማርኛ):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., የአንደኛ መንፈቀ-ዓመት አጋማሽ ፈተና ምዝገባ ጊዜ"
                    value={annTitleAmharic}
                    onChange={(e) => setAnnTitleAmharic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Category:</label>
                    <select
                      value={annCategory}
                      onChange={(e) => setAnnCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Administrative">Administrative (አስተዳደራዊ)</option>
                      <option value="Academic">Academic (ትምህርታዊ)</option>
                      <option value="Parent Notice">Parent Notice (የወላጆች ማስታወቂያ)</option>
                      <option value="Examination">Examination (ፈተና)</option>
                      <option value="General">General (አጠቃላይ)</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={annIsUrgent}
                        onChange={(e) => setAnnIsUrgent(e.target.checked)}
                        className="rounded text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                      />
                      <span>Urgent Notice (አስቸኳይ)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Announcement Summary & Instructions:
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide full details, required documents, or instructions for students/parents..."
                    value={annSummary}
                    onChange={(e) => setAnnSummary(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-animated w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  + Post Official Announcement
                </button>
              </form>
            </div>

            {/* Form 2: Add Calendar Event */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Calendar className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm md:text-base">
                    Schedule Calendar Event (የካላንደር ክንውን መዝግብ)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Add official school dates to the Academic Calendar
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Event Title (English):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Parent-Teacher Association General Meeting"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Event Title (አማርኛ):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., የወላጅና መምህራን ማህበር ጠቅላላ ስብሰባ"
                    value={eventTitleAmharic}
                    onChange={(e) => setEventTitleAmharic(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      Ethiopian Date (የኢትዮጵያ ቀን):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., ጥቅምት 25 ቀን 2017"
                      value={eventEthDate}
                      onChange={(e) => setEventEthDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Category:</label>
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Academic">Academic (ትምህርታዊ)</option>
                      <option value="Exam">Exam (ፈተና)</option>
                      <option value="PTA">PTA / Parent Meeting (የወላጆች ስብሰባ)</option>
                      <option value="Holiday">Holiday (በዓል)</option>
                      <option value="Sports">Sports & Culture (ስፖርት)</option>
                      <option value="Club">Club (ክበባት)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Time:</label>
                    <input
                      type="text"
                      placeholder="e.g., 8:30 AM"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Location / Venue:</label>
                    <input
                      type="text"
                      placeholder="e.g., Main Assembly Hall"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Event Description:</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the event agenda..."
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-animated w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  + Add to Academic Calendar
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Live Feed of Announcements and Calendar (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Active Announcements */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  Active School Announcements ({announcements.length})
                </h3>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Admin Broadcast
                </span>
              </div>

              {announcements.length === 0 ? (
                <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No announcements posted yet. Use the form on the left to post notices.
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map((ann) => (
                    <div
                      key={ann.id}
                      className={`p-4 rounded-2xl border transition-all text-xs ${
                        ann.isUrgent
                          ? 'bg-rose-50/60 border-rose-200'
                          : 'bg-slate-50/70 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-black text-slate-900 text-sm">{ann.title}</span>
                        {ann.isUrgent && (
                          <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px]">
                            URGENT
                          </span>
                        )}
                      </div>
                      {ann.titleAmharic && (
                        <p className="text-[11px] text-slate-600 mb-1">{ann.titleAmharic}</p>
                      )}
                      <p className="text-slate-700 text-xs leading-relaxed">{ann.summary}</p>
                      <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Category: <strong>{ann.category}</strong></span>
                        <span>Posted on: {ann.datePosted}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Scheduled Calendar Events */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-900 text-sm md:text-base">
                  Scheduled Calendar Events ({events.length})
                </h3>
                <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                  Academic Timeline
                </span>
              </div>

              {events.length === 0 ? (
                <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
                  No events added yet. Use the calendar form on the left to schedule dates.
                </div>
              ) : (
                <div className="space-y-3">
                  {events.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all text-xs flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900">{ev.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                            {ev.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{ev.description}</p>
                        <div className="mt-2 text-[10px] text-emerald-800 font-mono">
                          📍 {ev.location} • {ev.time}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-black text-slate-900 text-xs">{ev.ethiopianDate}</div>
                        <div className="text-[10px] text-slate-400">{ev.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

      {/* PRINT-ONLY SECTION CREDENTIAL SLIPS */}
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
              <p className="text-[10px] text-slate-700"><strong>Parent Access Code:</strong> PAR-{st.grade}{st.section}-{String(i + 1).padStart(2, '0')}</p>
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
                  className="px-4 py-2 bg-[#352016] hover:bg-[#20130d] text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
