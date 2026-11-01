/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RegisteredStudent2019, TimetableSlot } from '../utils/registrationAndTimetable';
import { GradeSection } from '../data/schoolData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseAnonKey.includes('your-anon-public-key')
  );
};

export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

export const getSupabaseStatus = () => {
  const configured = isSupabaseConfigured();
  return {
    isConfigured: configured,
    url: configured ? supabaseUrl : undefined,
    mode: configured ? 'Cloud PostgreSQL (Supabase Connected)' : 'Local Storage Fallback Mode'
  };
};

/**
 * Cloud persistence helper for 2019 E.C. Registered Students
 */
export async function syncStudentToCloud(student: RegisteredStudent2019): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('registrations_2019').upsert({
      id: student.id,
      student_id: student.studentId,
      full_name: student.fullName,
      full_name_amharic: student.fullNameAmharic,
      gender: student.gender,
      target_grade: student.targetGrade,
      stream: student.stream,
      academic_year: student.academicYear,
      previous_school: student.previousSchool,
      previous_grade: student.previousGrade,
      previous_score: student.previousAverageScore,
      guardian_name: student.guardianName,
      guardian_phone: student.guardianPhone,
      conduct: student.conduct,
      allocated_section: student.allocatedSection,
      registration_date: student.registrationDate,
      updated_at: new Date().toISOString()
    });
    return !error;
  } catch (err) {
    console.warn('Supabase sync warning:', err);
    return false;
  }
}

/**
 * Cloud persistence helper for Grade Sections
 */
export async function syncSectionToCloud(section: GradeSection): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('grade_sections').upsert({
      id: section.id,
      grade: section.grade,
      section_code: section.section,
      section_letter: section.sectionLetter,
      stream: section.stream,
      total_students: section.totalStudents,
      male_students: section.maleStudents,
      female_students: section.femaleStudents,
      homeroom_teacher_name: section.homeroomTeacher?.name,
      room_number: section.roomNumber,
      shift: section.shift,
      subject_assignments: section.subjectAssignments,
      updated_at: new Date().toISOString()
    });
    return !error;
  } catch (err) {
    console.warn('Supabase sync warning:', err);
    return false;
  }
}

/**
 * Cloud persistence helper for Timetable Slots
 */
export async function syncTimetableSlotToCloud(slot: TimetableSlot): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('timetable_slots').upsert({
      id: slot.id,
      day: slot.day,
      period: slot.period,
      section_code: slot.sectionCode,
      subject_id: slot.subjectId,
      subject_name: slot.subjectName,
      teacher_id: slot.teacherId,
      teacher_name: slot.teacherName,
      updated_at: new Date().toISOString()
    });
    return !error;
  } catch (err) {
    console.warn('Supabase sync warning:', err);
    return false;
  }
}
