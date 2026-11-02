/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { StudentGradePortal } from './components/StudentGradePortal';
import { TeacherPortal } from './components/TeacherPortal';
import { AdminPortal } from './components/AdminPortal';
import { AcademicCalendar } from './components/AcademicCalendar';
import { MessagingBoard } from './components/MessagingBoard';
import { ESSLCEHub } from './components/ESSLCEHub';
import { AboutAndCampus } from './components/AboutAndCampus';
import { GradesOfYearPage } from './components/GradesOfYearPage';
import { RegistrarAdminPage } from './components/RegistrarAdminPage';
import { AdminSignupPage, AdminUser } from './components/AdminSignupPage';
import { TeacherLoginModal } from './components/TeacherLoginModal';
import { Footer } from './components/Footer';
import {
  SEED_STUDENTS,
  SCHOOL_EVENTS,
  INITIAL_MESSAGES,
  TEACHERS,
  INITIAL_GRADE_SECTIONS,
  Student,
  SchoolEvent,
  MessageThread,
  Teacher,
  GradeSection
} from './data/schoolData';

export default function App() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [teacherUser, setTeacherUser] = useState<Teacher | null>(null);
  const [isVisitorPreview, setIsVisitorPreview] = useState<boolean>(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('admin');
  const [lang, setLang] = useState<'en' | 'am'>('en');

  // Active section & subject for teacher suite navigation
  const [activeTeacherSection, setActiveTeacherSection] = useState<string>('9A');
  const [activeTeacherSubject, setActiveTeacherSubject] = useState<string>('math');

  // Application Data States
  const [students, setStudents] = useState<Student[]>(SEED_STUDENTS);
  const [teachers, setTeachers] = useState<Teacher[]>(TEACHERS);
  const [sections, setSections] = useState<GradeSection[]>(INITIAL_GRADE_SECTIONS);
  const [events, setEvents] = useState<SchoolEvent[]>(SCHOOL_EVENTS);
  const [threads, setThreads] = useState<MessageThread[]>(INITIAL_MESSAGES);

  // Check stored admin/teacher session or URL tab parameter on initial load
  useEffect(() => {
    try {
      const isLoggedIn = localStorage.getItem('hmm_admin_logged_in');
      const savedAdmin = localStorage.getItem('hmm_school_admin');
      if (isLoggedIn === 'true' && savedAdmin) {
        setAdminUser(JSON.parse(savedAdmin));
      }

      const savedTeacher = localStorage.getItem('hmm_teacher_user');
      if (savedTeacher) {
        setTeacherUser(JSON.parse(savedTeacher));
      }
    } catch {
      // LocalStorage access fallback
    }

    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['home', 'teacher', 'admin', 'grades', 'registrar', 'portal', 'calendar', 'messaging', 'esslce', 'about'].includes(tabParam)) {
      setCurrentTab(tabParam);
      setIsVisitorPreview(true);
    }
  }, []);

  const handleAdminAuthenticated = (admin: AdminUser) => {
    setAdminUser(admin);
    setIsVisitorPreview(true);
    setCurrentTab('admin');
  };

  const handleSignOutAdmin = () => {
    try {
      localStorage.removeItem('hmm_admin_logged_in');
    } catch {
      // ignore
    }
    setAdminUser(null);
    setIsVisitorPreview(true);
    setCurrentTab('home');
  };

  // 1-Click Teacher Login Handler
  const handleSelectTeacher = (teacher: Teacher) => {
    setTeacherUser(teacher);
    setIsVisitorPreview(true); // Allow teacher to view the application without admin modal blocking
    setCurrentTab('teacher');

    // Auto-select their subject if recognized
    const s = teacher.subject.toLowerCase();
    if (s.includes('math')) setActiveTeacherSubject('math');
    else if (s.includes('phys')) setActiveTeacherSubject('phys');
    else if (s.includes('chem')) setActiveTeacherSubject('chem');
    else if (s.includes('bio')) setActiveTeacherSubject('bio');
    else if (s.includes('eng')) setActiveTeacherSubject('eng');
    else if (s.includes('amh')) setActiveTeacherSubject('amh');
    else if (s.includes('geo')) setActiveTeacherSubject('geo');
    else if (s.includes('hist')) setActiveTeacherSubject('hist');
    else if (s.includes('civ')) setActiveTeacherSubject('civ');
    else if (s.includes('ict') || s.includes('inf')) setActiveTeacherSubject('ict');

    try {
      localStorage.setItem('hmm_teacher_user', JSON.stringify(teacher));
    } catch {
      // ignore
    }
  };

  const handleSignOutTeacher = () => {
    try {
      localStorage.removeItem('hmm_teacher_user');
    } catch {
      // ignore
    }
    setTeacherUser(null);
  };

  const handleAddTeacher = (newTeacher: Teacher) => {
    setTeachers((prev) => [newTeacher, ...prev]);
  };

  const handleUpdateSection = (updated: GradeSection) => {
    setSections((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleAddSections = (newSections: GradeSection[]) => {
    setSections((prev) => [...newSections, ...prev]);
  };

  const handleNavigateToTeacherPortal = (sectionCode?: string, subjectId?: string) => {
    if (sectionCode) setActiveTeacherSection(sectionCode);
    if (subjectId) setActiveTeacherSubject(subjectId);
    setCurrentTab('teacher');
  };

  // If user is not logged in as Admin, not logged in as Teacher, and hasn't explicitly entered preview mode,
  // display the Admin Signup / Onboarding page as the primary entrance.
  if (!adminUser && !teacherUser && !isVisitorPreview) {
    return (
      <AdminSignupPage
        onAdminAuthenticated={handleAdminAuthenticated}
        onPreviewPublicSite={() => {
          setIsVisitorPreview(true);
          setCurrentTab('home');
        }}
        lang={lang}
        setLang={setLang}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Navigation Bar with Ethiopian MoE Brand, Language Switcher, Admin & Teacher Status */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        adminUser={adminUser}
        onSignOut={handleSignOutAdmin}
        onOpenAdminSignup={() => {
          setCurrentTab('admin');
        }}
        teacherUser={teacherUser}
        onSignOutTeacher={handleSignOutTeacher}
        onOpenTeacherLogin={() => setIsTeacherModalOpen(true)}
        unreadCount={threads.filter((t) => !t.resolved).length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0">
        {currentTab === 'admin' && (
          adminUser ? (
            <AdminPortal
              teachers={teachers}
              onAddTeacher={handleAddTeacher}
              students={students}
              lang={lang}
              adminUser={adminUser}
              onNavigateToGrades={() => setCurrentTab('grades')}
              onNavigateToRegistrar={() => setCurrentTab('registrar')}
              onQuickTeacherLogin={handleSelectTeacher}
              onSignOut={handleSignOutAdmin}
            />
          ) : (
            <AdminSignupPage
              onAdminAuthenticated={handleAdminAuthenticated}
              onPreviewPublicSite={() => setCurrentTab('home')}
              lang={lang}
              setLang={setLang}
            />
          )
        )}

        {currentTab === 'registrar' && (
          <RegistrarAdminPage
            teachers={teachers}
            sections={sections}
            onAddSections={handleAddSections}
            lang={lang}
            onNavigateToGrades={() => setCurrentTab('grades')}
            onNavigateToTeacher={handleNavigateToTeacherPortal}
          />
        )}

        {currentTab === 'grades' && (
          <GradesOfYearPage
            sections={sections}
            onUpdateSection={handleUpdateSection}
            teachers={teachers}
            students={students}
            onUpdateStudents={setStudents}
            lang={lang}
            onNavigateToTeacherPortal={handleNavigateToTeacherPortal}
            onNavigateToGradePortal={() => setCurrentTab('portal')}
            onQuickTeacherLogin={handleSelectTeacher}
          />
        )}

        {currentTab === 'teacher' && (
          <TeacherPortal
            students={students}
            onUpdateStudents={setStudents}
            teachers={teachers}
            lang={lang}
            initialSection={activeTeacherSection}
            initialSubjectId={activeTeacherSubject}
            activeTeacherUser={teacherUser}
            onSignOutTeacher={handleSignOutTeacher}
          />
        )}

        {currentTab === 'home' && (
          <HeroBanner onNavigate={setCurrentTab} lang={lang} />
        )}

        {currentTab === 'portal' && (
          <StudentGradePortal students={students} lang={lang} />
        )}

        {currentTab === 'calendar' && (
          <AcademicCalendar events={events} lang={lang} />
        )}

        {currentTab === 'messaging' && (
          <MessagingBoard
            initialThreads={threads}
            teachers={teachers}
            userRole={teacherUser ? 'Teacher' : 'Admin'}
            lang={lang}
          />
        )}

        {currentTab === 'esslce' && (
          <ESSLCEHub lang={lang} />
        )}

        {currentTab === 'about' && (
          <AboutAndCampus lang={lang} />
        )}
      </main>

      {/* Teacher 1-Click Login / Role Switch Modal */}
      <TeacherLoginModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        teachers={teachers}
        onSelectTeacher={handleSelectTeacher}
        lang={lang}
      />

      {/* Footer */}
      <Footer onNavigate={setCurrentTab} lang={lang} />
    </div>
  );
}
