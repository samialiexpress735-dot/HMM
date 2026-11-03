import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  Clock,
  Printer,
  Save,
  Search,
  Filter,
  Sparkles,
  BookOpen,
  AlertTriangle,
  Award,
  ChevronDown,
  UserCheck,
  TrendingUp,
  Percent,
  FileSpreadsheet,
  Calendar
} from 'lucide-react';
import { Student, Teacher } from '../data/schoolData';
import { calculateTotalScore, getEthiopianLetterGrade } from '../utils/gradeCalculations';

interface TeacherPortalProps {
  students: Student[];
  onUpdateStudents: (updated: Student[]) => void;
  teachers: Teacher[];
  lang: 'en' | 'am';
  initialSection?: string;
  initialSubjectId?: string;
  activeTeacherUser?: Teacher | null;
  onSignOutTeacher?: () => void;
}

export const TeacherPortal: React.FC<TeacherPortalProps> = ({
  students,
  onUpdateStudents,
  teachers,
  lang,
  initialSection = '9A',
  initialSubjectId = 'math',
  activeTeacherUser,
  onSignOutTeacher
}) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(activeTeacherUser?.id || teachers[0]?.id || 't2');
  const [selectedSection, setSelectedSection] = useState<string>(initialSection);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubjectId);
  const [activeTab, setActiveTab] = useState<'marks' | 'attendance'>('marks');
  const [searchQuery, setSearchQuery] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Sync state when props change
  React.useEffect(() => {
    if (initialSection) setSelectedSection(initialSection);
  }, [initialSection]);

  React.useEffect(() => {
    if (initialSubjectId) setSelectedSubjectId(initialSubjectId);
  }, [initialSubjectId]);

  React.useEffect(() => {
    if (activeTeacherUser) {
      setSelectedTeacherId(activeTeacherUser.id);
      // match subject if possible
      const subj = activeTeacherUser.subject.toLowerCase();
      if (subj.includes('math')) setSelectedSubjectId('math');
      else if (subj.includes('phys')) setSelectedSubjectId('phys');
      else if (subj.includes('chem')) setSelectedSubjectId('chem');
      else if (subj.includes('bio')) setSelectedSubjectId('bio');
      else if (subj.includes('eng')) setSelectedSubjectId('eng');
      else if (subj.includes('amh')) setSelectedSubjectId('amh');
      else if (subj.includes('geo')) setSelectedSubjectId('geo');
      else if (subj.includes('hist')) setSelectedSubjectId('hist');
      else if (subj.includes('civ')) setSelectedSubjectId('civ');
      else if (subj.includes('ict') || subj.includes('inf') || subj.includes('it')) setSelectedSubjectId('it');
      else if (subj.includes('pe') || subj.includes('sport') || subj.includes('physical')) setSelectedSubjectId('pe');
      else if (subj.includes('econ')) setSelectedSubjectId('econ');
      else if (subj.includes('agri')) setSelectedSubjectId('agri');
      else if (subj.includes('cte') || subj.includes('career') || subj.includes('tech')) setSelectedSubjectId('cte');
    }
  }, [activeTeacherUser]);

  // Active Teacher
  const activeTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  // Filter students by selected section (e.g. 9A)
  const currentGradeNum = parseInt(selectedSection.replace(/\D/g, ''), 10) || 9;
  const currentSectionLetter = selectedSection.replace(/\d/g, '') || 'A';

  const sectionStudents = students.filter(
    (s) => s.grade === currentGradeNum && s.section.toUpperCase() === currentSectionLetter.toUpperCase()
  );

  const filteredStudents = sectionStudents.filter(
    (s) =>
      s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fullNameAmharic.includes(searchQuery)
  );

  // Subject display dictionary
  const SUBJECT_DICTIONARY: Record<string, { en: string; am: string }> = {
    math: { en: 'Mathematics', am: 'ሒሳብ' },
    phys: { en: 'Physics', am: 'ፊዚክስ' },
    chem: { en: 'Chemistry', am: 'ኬሚስትሪ' },
    bio: { en: 'Biology', am: 'ባዮሎጂ' },
    eng: { en: 'English Language', am: 'እንግሊዝኛ' },
    amh: { en: 'Amharic Language', am: 'አማርኛ' },
    geo: { en: 'Geography', am: 'ጂኦግራፊ' },
    hist: { en: 'History', am: 'ታሪክ' },
    civ: { en: 'Citizenship Education', am: 'ስነ-ዜጋ' },
    it: { en: 'Information Technology (IT)', am: 'ኢንፎርሜሽን ቴክኖሎጂ' },
    ict: { en: 'Information Technology (IT)', am: 'ኢንፎርሜሽን ቴክኖሎጂ' },
    pe: { en: 'Physical Education (P.E.)', am: 'ስፖርት' },
    econ: { en: 'Economics', am: 'ኢኮኖሚክስ' },
    agri: { en: 'Agriculture', am: 'ግብርና' },
    cte: { en: 'Career & Technical Education (CTE)', am: 'የስራና ቴክኒክ' }
  };

  // Mark edit handler
  const handleMarkChange = (
    studentId: string,
    field: 'continuousAssessment' | 'midExam' | 'finalExam',
    value: number
  ) => {
    const updated = students.map((s) => {
      if (s.id !== studentId) return s;
      const semesters = s.semesters.map((sem) => {
        if (sem.semester !== 1) return sem;
        const exists = sem.subjects.some(
          (sub) =>
            sub.subjectId === selectedSubjectId ||
            (selectedSubjectId === 'it' && sub.subjectId === 'ict') ||
            (selectedSubjectId === 'ict' && sub.subjectId === 'it')
        );

        let subjects;
        if (exists) {
          subjects = sem.subjects.map((subj) => {
            if (
              subj.subjectId !== selectedSubjectId &&
              !(selectedSubjectId === 'it' && subj.subjectId === 'ict') &&
              !(selectedSubjectId === 'ict' && subj.subjectId === 'it')
            ) {
              return subj;
            }
            return {
              ...subj,
              [field]: value
            };
          });
        } else {
          const dict = SUBJECT_DICTIONARY[selectedSubjectId] || {
            en: selectedSubjectId.toUpperCase(),
            am: selectedSubjectId.toUpperCase()
          };
          const newSubjectEntry = {
            subjectId: selectedSubjectId,
            subjectName: dict.en,
            subjectAmharic: dict.am,
            teacherName: activeTeacher?.name || 'Assigned Teacher',
            continuousAssessment: field === 'continuousAssessment' ? value : 22,
            midExam: field === 'midExam' ? value : 16,
            finalExam: field === 'finalExam' ? value : 40
          };
          subjects = [...sem.subjects, newSubjectEntry];
        }
        return { ...sem, subjects };
      });
      return { ...s, semesters };
    });
    onUpdateStudents(updated);
  };

  // Attendance status handler
  const handleAttendanceChange = (
    studentId: string,
    status: 'Present' | 'Absent' | 'Late' | 'Permission'
  ) => {
    const updated = students.map((s) => {
      if (s.id !== studentId) return s;
      return {
        ...s,
        attendanceStatus: status
      };
    });
    onUpdateStudents(updated);
  };

  // Mark all present helper
  const handleMarkAllPresent = () => {
    const updated = students.map((s) => {
      if (s.grade === currentGradeNum && s.section === currentSectionLetter) {
        return {
          ...s,
          attendanceStatus: 'Present' as const
        };
      }
      return s;
    });
    onUpdateStudents(updated);
    setSaveSuccessMsg('All students in Section ' + selectedSection + ' marked Present!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleSaveMarks = () => {
    setSaveSuccessMsg(`Marks successfully saved and synced for Section ${selectedSection} (${selectedSubjectId.toUpperCase()})!`);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Analytics for the selected section & subject
  const marksList = sectionStudents.map((s) => {
    const sem1 = s.semesters[0];
    const subj = sem1?.subjects.find(
      (sub) =>
        sub.subjectId === selectedSubjectId ||
        (selectedSubjectId === 'it' && sub.subjectId === 'ict') ||
        (selectedSubjectId === 'ict' && sub.subjectId === 'it')
    );
    return subj
      ? calculateTotalScore(subj.continuousAssessment, subj.midExam, subj.finalExam)
      : 0;
  });

  const classAvg = marksList.length
    ? Math.round((marksList.reduce((a, b) => a + b, 0) / marksList.length) * 10) / 10
    : 0;
  const passCount = marksList.filter((m) => m >= 50).length;
  const passRate = marksList.length ? Math.round((passCount / marksList.length) * 100) : 0;
  const highestMark = marksList.length ? Math.max(...marksList) : 0;
  const lowestMark = marksList.length ? Math.min(...marksList) : 0;

  // Attendance counts
  const presentCount = sectionStudents.filter((s) => s.attendanceStatus === 'Present').length;
  const absentCount = sectionStudents.filter((s) => s.attendanceStatus === 'Absent').length;
  const lateCount = sectionStudents.filter((s) => s.attendanceStatus === 'Late').length;
  const excusedCount = sectionStudents.filter((s) => s.attendanceStatus === 'Permission').length;
  const attendanceRate = sectionStudents.length
    ? Math.round((presentCount / sectionStudents.length) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <FileSpreadsheet className="w-5 h-5" />
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {lang === 'am'
                  ? 'የመምህራን ማርክ ማስገቢያ እና አቴንዳንስ መዝገብ'
                  : 'Teacher Mark Registering & Attendance Suite'}
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {lang === 'am'
                ? 'የተማሪዎች ውጤት ማስገቢያ፣ የቀን አቴንዳንስ እና የክፍል ማርክ ሊስት ማውረጃ'
                : 'Directly record continuous assessments (30%), mid-exam (20%), final exam (50%) and daily attendance'}
            </p>
          </div>

          {/* Action Tabs & Print */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                onClick={() => setActiveTab('marks')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'marks'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'am' ? 'ማርክ ማስገቢያ' : 'Mark Registering'}
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'attendance'
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'am' ? 'የቀን አቴንዳንስ' : 'Daily Attendance'}
              </button>
            </div>

            <button
              onClick={() => {
                setIsExporting(true);
                setTimeout(() => window.print(), 200);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>{lang === 'am' ? 'ማርክ ሊስት አትም' : 'Print Official Mark List'}</span>
            </button>
          </div>
        </div>

        {/* Teacher, Section & Subject Selector Controls */}
        <div className="pt-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 items-center">
          {/* Authenticated Teacher Profile Badge */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-black text-xs flex-shrink-0">
                {activeTeacher.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div className="min-w-0">
                <div className="font-extrabold text-slate-900 text-xs truncate">
                  {activeTeacher.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {activeTeacher.subject} • {activeTeacher.email}
                </div>
              </div>
            </div>
            {onSignOutTeacher && (
              <button
                onClick={onSignOutTeacher}
                className="text-[10px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg border border-rose-200 cursor-pointer flex-shrink-0"
              >
                Sign Out
              </button>
            )}
          </div>

          {/* Section Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Class & Section:
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="9A">Grade 9 - Section &quot;A&quot;</option>
              <option value="9B">Grade 9 - Section &quot;B&quot;</option>
              <option value="10A">Grade 10 - Section &quot;A&quot;</option>
              <option value="11A">Grade 11 - Natural Science A</option>
              <option value="12A">Grade 12 - Natural Science A</option>
            </select>
          </div>

          {/* Subject Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Teaching Subject:
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="math">Mathematics (ሒሳብ)</option>
              <option value="phys">Physics (ፊዚክስ)</option>
              <option value="chem">Chemistry (ኬሚስትሪ)</option>
              <option value="bio">Biology (ባዮሎጂ)</option>
              <option value="eng">English Language (እንግሊዝኛ)</option>
              <option value="amh">Amharic Language (አማርኛ)</option>
              <option value="geo">Geography (ጂኦግራፊ)</option>
              <option value="hist">History (ታሪክ)</option>
              <option value="civ">Citizenship Education (ስነ-ዜጋ)</option>
              <option value="it">Information Tech / IT (ኢንፎርሜሽን ቴክኖሎጂ)</option>
              <option value="pe">Physical Education (P.E. / ስፖርት)</option>
              <option value="econ">Economics (ኢኮኖሚክስ)</option>
              <option value="agri">Agriculture (ግብርና)</option>
              <option value="cte">Career & Technical Education (CTE / የስራና ቴክኒክ)</option>
            </select>
          </div>

          {/* Search box */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Search Roster:
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter student name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Save confirmation message */}
        {saveSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              {saveSuccessMsg}
            </span>
          </div>
        )}
      </div>

      {/* Summary KPI Cards for the Teacher */}
      {activeTab === 'marks' ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Section {selectedSection} Average
            </span>
            <div className="text-2xl md:text-3xl font-black text-slate-900 font-mono mt-1">
              {classAvg}%
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Out of 100% scale</span>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Pass Rate (≥ 50%)
            </span>
            <div className="text-2xl md:text-3xl font-black text-emerald-700 font-mono mt-1">
              {passRate}%
            </div>
            <span className="text-[10px] text-slate-500">{passCount} of {sectionStudents.length} Students Passing</span>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Highest Score in {selectedSection}
            </span>
            <div className="text-2xl md:text-3xl font-black text-amber-600 font-mono mt-1">
              {highestMark}
            </div>
            <span className="text-[10px] text-slate-500">Top performer in section</span>
          </div>

          <div className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Lowest Mark
            </span>
            <div className="text-2xl md:text-3xl font-black text-rose-600 font-mono mt-1">
              {lowestMark}
            </div>
            <span className="text-[10px] text-rose-700 font-medium">Needs tutorial support</span>
          </div>
        </div>
      ) : (
        /* Attendance KPI Cards */
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-500 block">Attendance Rate</span>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-1">{attendanceRate}%</div>
            <span className="text-[10px] text-slate-400">Section {selectedSection} Today</span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-emerald-950">
            <span className="text-[10px] font-bold uppercase block text-emerald-800">Present (P)</span>
            <div className="text-2xl font-black text-emerald-800 font-mono mt-1">{presentCount}</div>
            <span className="text-[10px] text-emerald-700">In class</span>
          </div>
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-rose-950">
            <span className="text-[10px] font-bold uppercase block text-rose-800">Absent (A)</span>
            <div className="text-2xl font-black text-rose-700 font-mono mt-1">{absentCount}</div>
            <span className="text-[10px] text-rose-600">Unexcused</span>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-950">
            <span className="text-[10px] font-bold uppercase block text-amber-800">Late (T)</span>
            <div className="text-2xl font-black text-amber-700 font-mono mt-1">{lateCount}</div>
            <span className="text-[10px] text-amber-600">Morning late</span>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 text-blue-950">
            <span className="text-[10px] font-bold uppercase block text-blue-800">Permission (E)</span>
            <div className="text-2xl font-black text-blue-700 font-mono mt-1">{excusedCount}</div>
            <span className="text-[10px] text-blue-600">Official leave</span>
          </div>
        </div>
      )}

      {/* Main Table: Either Mark Registering or Attendance */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Table Title and Controls */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 text-sm md:text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <span>
                {activeTab === 'marks'
                  ? `Grade ${selectedSection} Roster • Mark Registering for ${selectedSubjectId.toUpperCase()}`
                  : `Grade ${selectedSection} Daily Attendance Sheet • ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {activeTab === 'marks'
                ? 'Editable marks: Continuous (Max 30) + Midterm (Max 20) + Final (Max 50) = Total 100%'
                : 'Click attendance buttons (Present / Absent / Late / Permission) to update student status in real-time'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'attendance' && (
              <button
                onClick={handleMarkAllPresent}
                className="px-3.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Mark All Present
              </button>
            )}

            {activeTab === 'marks' && (
              <button
                onClick={handleSaveMarks}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All Marks</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Subject Switcher Ribbon for Mark Registering */}
        {activeTab === 'marks' && (
          <div className="flex flex-wrap items-center gap-1.5 py-2.5 px-6 bg-slate-100/90 border-b border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 mr-1 uppercase tracking-wider">
              {lang === 'am' ? 'የትምህርት አይነት ምረጥ:' : 'Active Grading Subject:'}
            </span>
            {[
              { id: 'math', label: 'Math (ሒሳብ)' },
              { id: 'phys', label: 'Physics (ፊዚክስ)' },
              { id: 'chem', label: 'Chemistry (ኬሚስትሪ)' },
              { id: 'bio', label: 'Biology (ባዮሎጂ)' },
              { id: 'eng', label: 'English (እንግሊዝኛ)' },
              { id: 'amh', label: 'Amharic (አማርኛ)' },
              { id: 'geo', label: 'Geography (ጂኦግራፊ)' },
              { id: 'hist', label: 'History (ታሪክ)' },
              { id: 'civ', label: 'Civics (ስነ-ዜጋ)' },
              { id: 'ict', label: 'ICT (ቴክኖሎጂ)' }
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSubjectId(s.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedSubjectId === s.id
                    ? 'bg-emerald-800 text-amber-300 shadow-sm border border-emerald-700'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* The Interactive Table */}
        <div className="overflow-x-auto">
          {activeTab === 'marks' ? (
            /* --- MARKS REGISTER TABLE --- */
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-3 px-3 text-center">#</th>
                  <th className="py-3 px-4">Student ID & Full Name</th>
                  <th className="py-3 px-3 text-center w-32">
                    Continuous (30%)
                    <span className="block text-[10px] font-normal text-slate-500">Tests & Labs</span>
                  </th>
                  <th className="py-3 px-3 text-center w-28">
                    Mid Exam (20%)
                    <span className="block text-[10px] font-normal text-slate-500">Midterm</span>
                  </th>
                  <th className="py-3 px-3 text-center w-28">
                    Final Exam (50%)
                    <span className="block text-[10px] font-normal text-slate-500">Semester Final</span>
                  </th>
                  <th className="py-3 px-3 text-center font-bold text-slate-900 w-24">
                    Total (100)
                  </th>
                  <th className="py-3 px-3 text-center">Letter</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4">Teacher Remark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-500">
                      <div className="w-12 h-12 mx-auto rounded-full bg-[#ebd3c4] text-[#4a2e22] flex items-center justify-center font-bold mb-3">
                        <Users className="w-6 h-6 text-[#4a2e22]" />
                      </div>
                      <div className="font-extrabold text-[#2e1c14] text-sm">No Students Registered in Section {selectedSection} Yet</div>
                      <p className="text-xs text-[#754c39] mt-1">
                        Enroll students or allocate sections in the Registrar Portal to populate this roster.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => {
                    const sem1 = student.semesters?.[0];
                    const subj = sem1?.subjects?.find(
                      (s) =>
                        s.subjectId === selectedSubjectId ||
                        (selectedSubjectId === 'it' && s.subjectId === 'ict') ||
                        (selectedSubjectId === 'ict' && s.subjectId === 'it')
                    ) || {
                      continuousAssessment: 20,
                      midExam: 15,
                      finalExam: 35
                    };

                    const total = calculateTotalScore(
                      subj.continuousAssessment,
                      subj.midExam,
                      subj.finalExam
                    );
                    const { letter, remarks } = getEthiopianLetterGrade(total);
                    const isPassing = total >= 50;
                    const initials = student.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('');

                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="avatar-monogram w-8 h-8 rounded-lg flex-shrink-0 text-[11px] font-black">
                              {initials || 'ST'}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block leading-tight">
                                {student.fullName}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {student.studentId} • {student.fullNameAmharic}
                              </span>
                            </div>
                        </div>
                      </td>

                      {/* Continuous Assessment Input (30) */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={subj.continuousAssessment}
                          onChange={(e) =>
                            handleMarkChange(
                              student.id,
                              'continuousAssessment',
                              Math.max(0, Math.min(30, Number(e.target.value)))
                            )
                          }
                          className="w-20 px-2 py-1 text-center font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </td>

                      {/* Mid Exam Input (20) */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={subj.midExam}
                          onChange={(e) =>
                            handleMarkChange(
                              student.id,
                              'midExam',
                              Math.max(0, Math.min(20, Number(e.target.value)))
                            )
                          }
                          className="w-20 px-2 py-1 text-center font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </td>

                      {/* Final Exam Input (50) */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min="0"
                          max="50"
                          value={subj.finalExam}
                          onChange={(e) =>
                            handleMarkChange(
                              student.id,
                              'finalExam',
                              Math.max(0, Math.min(50, Number(e.target.value)))
                            )
                          }
                          className="w-20 px-2 py-1 text-center font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </td>

                      {/* Total Score */}
                      <td className="py-3 px-3 text-center font-mono font-black text-slate-950 text-sm">
                        {total}
                      </td>

                      {/* Ethiopian Letter Grade */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                            letter.startsWith('A')
                              ? 'bg-emerald-100 text-emerald-800'
                              : letter.startsWith('B')
                              ? 'bg-blue-100 text-blue-800'
                              : letter.startsWith('C')
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {letter}
                        </span>
                      </td>

                      {/* Passing Status */}
                      <td className="py-3 px-3 text-center">
                        {isPassing ? (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Passed
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Remedial
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-500">
                        {remarks}
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          ) : (
            /* --- DAILY ATTENDANCE TABLE --- */
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-3 px-3 text-center">#</th>
                  <th className="py-3 px-4">Student ID & Name</th>
                  <th className="py-3 px-3 text-center">Overall %</th>
                  <th className="py-3 px-3 text-center">Conduct</th>
                  <th className="py-3 px-6 text-center">Today&apos;s Status (Click to Toggle)</th>
                  <th className="py-3 px-4">Guardian Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <div className="w-12 h-12 mx-auto rounded-full bg-[#ebd3c4] text-[#4a2e22] flex items-center justify-center font-bold mb-3">
                        <Users className="w-6 h-6 text-[#4a2e22]" />
                      </div>
                      <div className="font-extrabold text-[#2e1c14] text-sm">No Students Registered in Section {selectedSection} Yet</div>
                      <p className="text-xs text-[#754c39] mt-1">
                        Use the Registrar Section Allocator to distribute enrolled students into sections.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, idx) => {
                    const currentStatus = student.attendanceStatus || 'Present';
                    const initials = student.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('');
                    return (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="avatar-monogram w-8 h-8 rounded-lg flex-shrink-0 text-[11px] font-black">
                              {initials || 'ST'}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 block leading-tight">
                                {student.fullName}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {student.studentId} • {student.fullNameAmharic}
                              </span>
                            </div>
                          </div>
                        </td>

                      <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700">
                        {student.attendanceRate}%
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-xs">
                          {student.conduct || 'A'}
                        </span>
                      </td>

                      {/* Interactive Attendance Pill Switchers */}
                      <td className="py-3 px-6 text-center">
                        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 space-x-1">
                          <button
                            onClick={() => handleAttendanceChange(student.id, 'Present')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'Present'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="Present / ተገኝቷል"
                          >
                            P (Present)
                          </button>

                          <button
                            onClick={() => handleAttendanceChange(student.id, 'Absent')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'Absent'
                                ? 'bg-rose-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="Absent / ቀርቷል"
                          >
                            A (Absent)
                          </button>

                          <button
                            onClick={() => handleAttendanceChange(student.id, 'Late')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'Late'
                                ? 'bg-amber-500 text-slate-950 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="Late / ዘግይቷል"
                          >
                            T (Late)
                          </button>

                          <button
                            onClick={() => handleAttendanceChange(student.id, 'Permission')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              currentStatus === 'Permission'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="Permission / Excused / ፈቃድ"
                          >
                            E (Leave)
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-600">
                        <div>{student.guardianName}</div>
                        <div className="font-mono text-emerald-800 text-[11px]">{student.guardianPhone}</div>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Official Mark Sheet Print Template (Displayed during print) */}
      <div className="hidden print:block p-8 bg-white text-black font-sans">
        <div className="text-center border-b-2 border-black pb-4 mb-4">
          <h2 className="text-xl font-bold uppercase">
            Hailemariam Mamo Secondary & Preparatory School
          </h2>
          <p className="text-xs">
            North Shewa Zone, Debre Berhan, Amhara Region • Academic Year 2017 E.C.
          </p>
          <h3 className="text-base font-bold mt-2 underline">
            OFFICIAL SUBJECT MARK LIST (የክፍል ማርክ ሊስት) • Grade {selectedSection} - {selectedSubjectId.toUpperCase()}
          </h3>
          <p className="text-xs text-slate-700 mt-1">
            Instructor: {activeTeacher.name} • Total Students: {sectionStudents.length} • Class Average: {classAvg}%
          </p>
        </div>

        <table className="w-full text-xs border border-black border-collapse">
          <thead>
            <tr className="border-b border-black bg-slate-100">
              <th className="border-r border-black p-1 text-center">#</th>
              <th className="border-r border-black p-1">Student ID</th>
              <th className="border-r border-black p-1">Student Full Name</th>
              <th className="border-r border-black p-1 text-center">Continuous (30)</th>
              <th className="border-r border-black p-1 text-center">Mid (20)</th>
              <th className="border-r border-black p-1 text-center">Final (50)</th>
              <th className="border-r border-black p-1 text-center">Total (100)</th>
              <th className="border-r border-black p-1 text-center">Grade</th>
              <th className="p-1">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {sectionStudents.map((st, i) => {
              const sem1 = st.semesters[0];
              const s = sem1?.subjects.find((sub) => sub.subjectId === selectedSubjectId) || {
                continuousAssessment: 0,
                midExam: 0,
                finalExam: 0
              };
              const tot = calculateTotalScore(s.continuousAssessment, s.midExam, s.finalExam);
              const { letter, remarks } = getEthiopianLetterGrade(tot);
              return (
                <tr key={st.id} className="border-b border-black">
                  <td className="border-r border-black p-1 text-center">{i + 1}</td>
                  <td className="border-r border-black p-1 font-mono">{st.studentId}</td>
                  <td className="border-r border-black p-1 font-semibold">{st.fullName}</td>
                  <td className="border-r border-black p-1 text-center">{s.continuousAssessment}</td>
                  <td className="border-r border-black p-1 text-center">{s.midExam}</td>
                  <td className="border-r border-black p-1 text-center">{s.finalExam}</td>
                  <td className="border-r border-black p-1 text-center font-bold">{tot}</td>
                  <td className="border-r border-black p-1 text-center font-bold">{letter}</td>
                  <td className="p-1">{remarks}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-8 grid grid-cols-2 gap-8 text-xs pt-4 border-t border-black">
          <div>
            <p>Subject Teacher Signature: ______________________</p>
            <p className="mt-1">Date: __________________</p>
          </div>
          <div>
            <p>Department Head Approval: ______________________</p>
            <p className="mt-1">Registrar Seal: __________________</p>
          </div>
        </div>
      </div>
    </div>
  );
};
