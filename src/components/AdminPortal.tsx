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
  LogIn
} from 'lucide-react';
import { Teacher, Student } from '../data/schoolData';
import { UserAccount, generateStaffPassword, generateStudentPasscode } from '../utils/authUtils';

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
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  teachers,
  onAddTeacher,
  students,
  lang,
  adminUser,
  onNavigateToGrades,
  onNavigateToRegistrar,
  onQuickTeacherLogin
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

  // Sub-admins list state
  const [subAdmins, setSubAdmins] = useState([
    {
      id: 'sub-1',
      name: 'Ato Mengistu Haile',
      role: 'Registrar & Records Officer',
      roleAmharic: 'ዋና ሬጅስትራር',
      phone: '+251 91 188 4400',
      email: 'registrar@hailemariammamo.edu.et',
      passcode: 'reg2017!',
      status: 'Active'
    },
    {
      id: 'sub-2',
      name: 'W/ro Genet Zeleke',
      role: 'Vice Principal (Academics)',
      roleAmharic: 'ምክትል ርዕሰ-መምህር',
      phone: '+251 92 344 1122',
      email: 'academics@hailemariammamo.edu.et',
      passcode: 'vp2017!',
      status: 'Active'
    }
  ]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Add Teacher Handler
  const handleCreateTeacher = (e: React.FormEvent) => {
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
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      isOnline: true,
      officeHours: 'Mon & Thu: 2:00 PM - 4:00 PM'
    };

    onAddTeacher(newTeacher);
    setSuccessBanner(`Teacher "${teacherName}" registered successfully! Initial password: ${generatedPass}. You can assign their homeroom and sections in "Grades of This Year".`);
    setTeacherName('');
    setTeacherNameAmharic('');
    setTeacherEmail('');
    setTimeout(() => setSuccessBanner(''), 6000);
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

            {/* Quick Director Card */}
            <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-center space-x-3 text-xs">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
                alt="School Administrator"
                className="w-10 h-10 rounded-xl object-cover border border-emerald-300"
              />
              <div>
                <div className="font-bold text-slate-900">
                  {adminUser?.fullName || 'Principal Berhanu Wolde, M.Ed.'}
                </div>
                <span className="text-[11px] text-emerald-800 font-semibold">
                  {adminUser?.roleTitle || 'Chief School Administrator'}
                </span>
                <div className="text-[10px] text-slate-400">
                  ID: {adminUser?.adminId || 'DIR-HMM-001'} • Active Admin Session
                </div>
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
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Debre Berhan Campus
                </span>
              </div>

              {/* Teachers List */}
              <div className="space-y-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Subject Teachers ({teachers.length})
                </div>

                {teachers.map((t) => {
                  const demoPass = generateStaffPassword('Teacher', t.name.split(' ')[0]);
                  return (
                    <div
                      key={t.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={t.avatar}
                          alt=""
                          className="w-10 h-10 rounded-xl object-cover border border-slate-300 flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{t.name}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                              {t.subject}
                            </span>
                          </div>
                          <span className="text-slate-500 block text-[11px]">{t.email}</span>
                          <span className="text-slate-600 font-mono text-[11px]">
                            Classes: <strong className="text-slate-900">{t.sectionsTeaching?.join(', ') || '9A'}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                        <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
                          Pass: <strong className="text-emerald-900">{demoPass}</strong>
                        </div>
                        <button
                          onClick={() => handleCopy(`${t.email} / ${demoPass}`, t.id)}
                          className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 transition-colors cursor-pointer"
                          title="Copy login credentials"
                        >
                          {copiedId === t.id ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        {onQuickTeacherLogin && (
                          <button
                            onClick={() => onQuickTeacherLogin(t)}
                            className="btn-animated px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-2xs"
                            title="Directly switch to Teacher Suite logged in as this educator"
                          >
                            <LogIn className="w-3 h-3 text-amber-300" />
                            <span>Sign in</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Sub-Admins List */}
                <div className="pt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Sub-Administrators ({subAdmins.length})
                </div>

                {subAdmins.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{sub.name}</span>
                        <span className="text-[10px] bg-amber-200 text-slate-950 font-bold px-2 py-0.5 rounded">
                          {sub.role}
                        </span>
                      </div>
                      <span className="text-slate-500 block text-[11px]">{sub.email} • {sub.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700">
                        Pass: <strong className="text-slate-900">{sub.passcode}</strong>
                      </div>
                      <button
                        onClick={() => handleCopy(`${sub.email} / ${sub.passcode}`, sub.id)}
                        className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 transition-colors cursor-pointer"
                        title="Copy login credentials"
                      >
                        {copiedId === sub.id ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
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
    </div>
  );
};
