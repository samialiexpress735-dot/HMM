/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ArchiveStudent {
  id: string;
  studentId: string;
  fullName: string;
  fullNameAmharic: string;
  gender: 'M' | 'F';
  previousGrade: number; // e.g. 8 (feeder school), 9, 10, 11
  previousSection: string; // e.g. '8B', '9A', '10C'
  previousSchool: string; // e.g. 'Debre Berhan Primary School'
  previousAverageScore: number; // e.g. 88.5
  eligibleForGrade: number; // e.g. 9, 10, 11, 12
  recommendedStream?: 'Natural Science' | 'Social Science';
  guardianName: string;
  guardianPhone: string;
  conduct: 'A' | 'B' | 'C' | 'D';
}

export interface RegisteredStudent2019 {
  id: string;
  studentId: string;
  fullName: string;
  fullNameAmharic: string;
  gender: 'M' | 'F';
  targetGrade: number; // 9, 10, 11, 12
  stream?: 'Natural Science' | 'Social Science';
  cteSpecialization?: 'Web Design and Development' | 'Marketing' | 'Accounting' | 'Construction' | string;
  academicYear: string; // '2019 E.C.'
  previousSchool: string;
  previousGrade: number;
  previousSection?: string;
  previousAverageScore?: number;
  guardianName: string;
  guardianPhone: string;
  conduct: 'A' | 'B' | 'C' | 'D';
  registrationDate: string;
  allocatedSection?: string; // e.g. '9A', '9B' or undefined if pending
  avatar: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: number; // 1 to 7
  sectionCode: string; // e.g. '9A', '9B'
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflictingSlot?: TimetableSlot;
  errorMessage?: string;
  errorMessageAmharic?: string;
}

export const DAYS_OF_WEEK: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday'
];

export const PERIOD_TIMES: { period: number; time: string; labelAmharic: string }[] = [
  { period: 1, time: '8:30 AM - 9:15 AM', labelAmharic: '1ኛ ክፍለ-ጊዜ (ጧት)' },
  { period: 2, time: '9:20 AM - 10:05 AM', labelAmharic: '2ኛ ክፍለ-ጊዜ' },
  { period: 3, time: '10:20 AM - 11:05 AM', labelAmharic: '3ኛ ክፍለ-ጊዜ' },
  { period: 4, time: '11:10 AM - 11:55 AM', labelAmharic: '4ኛ ክፍለ-ጊዜ' },
  { period: 5, time: '1:30 PM - 2:15 PM', labelAmharic: '5ኛ ክፍለ-ጊዜ (ከሰዓት)' },
  { period: 6, time: '2:20 PM - 3:05 PM', labelAmharic: '6ኛ ክፍለ-ጊዜ' },
  { period: 7, time: '3:10 PM - 3:55 PM', labelAmharic: '7ኛ ክፍለ-ጊዜ' }
];

/**
 * Searches and recommends last year's students based on target grade and query string.
 * Supports partial matching in English, Amharic, or Student ID.
 */
export function recommendPreviousYearStudents(
  archive: ArchiveStudent[],
  targetGrade: number,
  query: string
): ArchiveStudent[] {
  if (!query || query.trim().length === 0) {
    return archive.filter((s) => s.eligibleForGrade === targetGrade).slice(0, 8);
  }

  const cleanQuery = query.trim().toLowerCase();
  return archive
    .filter((s) => s.eligibleForGrade === targetGrade)
    .filter((s) => {
      return (
        s.fullName.toLowerCase().includes(cleanQuery) ||
        s.fullNameAmharic.includes(cleanQuery) ||
        s.studentId.toLowerCase().includes(cleanQuery) ||
        s.previousSchool.toLowerCase().includes(cleanQuery)
      );
    })
    .slice(0, 10);
}

/**
 * Distributes registered students into sections.
 * Options allow specifying studentsPerSection or fixed numberOfSections,
 * with distribution modes: 'random', 'gender-balanced', or 'merit-balanced'.
 */
export function allocateStudentsToSections(
  students: RegisteredStudent2019[],
  options: {
    grade: number;
    stream?: 'Natural Science' | 'Social Science';
    studentsPerSection?: number;
    numSections?: number;
    mode: 'random' | 'gender-balanced' | 'merit-balanced';
  }
): {
  sectionLetter: string;
  sectionCode: string;
  students: RegisteredStudent2019[];
  maleCount: number;
  femaleCount: number;
  averageScore: number;
}[] {
  if (students.length === 0) return [];

  // Determine number of sections
  let sectionCount = 2;
  if (options.numSections && options.numSections > 0) {
    sectionCount = options.numSections;
  } else if (options.studentsPerSection && options.studentsPerSection > 0) {
    sectionCount = Math.max(1, Math.ceil(students.length / options.studentsPerSection));
  }

  // Cap section letters (A to Z)
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').slice(0, sectionCount);

  // Initialize buckets
  const buckets: {
    sectionLetter: string;
    sectionCode: string;
    students: RegisteredStudent2019[];
    maleCount: number;
    femaleCount: number;
    averageScore: number;
  }[] = letters.map((letter) => {
    const streamSuffix = options.stream
      ? options.stream === 'Natural Science'
        ? '-Nat'
        : '-Soc'
      : '';
    const sectionCode = `${options.grade}${streamSuffix}${letter}`;
    return {
      sectionLetter: letter,
      sectionCode,
      students: [],
      maleCount: 0,
      femaleCount: 0,
      averageScore: 0
    };
  });

  const studentPool = [...students];

  if (options.mode === 'random') {
    // Fisher-Yates shuffle
    for (let i = studentPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [studentPool[i], studentPool[j]] = [studentPool[j], studentPool[i]];
    }
    // Round-robin assignment
    studentPool.forEach((st, idx) => {
      const bucketIdx = idx % sectionCount;
      buckets[bucketIdx].students.push({
        ...st,
        allocatedSection: buckets[bucketIdx].sectionCode
      });
    });
  } else if (options.mode === 'gender-balanced') {
    // Separate males and females
    const males = studentPool.filter((s) => s.gender === 'M');
    const females = studentPool.filter((s) => s.gender === 'F');

    // Shuffle each gender
    for (let i = males.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [males[i], males[j]] = [males[j], males[i]];
    }
    for (let i = females.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [females[i], females[j]] = [females[j], females[i]];
    }

    // Distribute females evenly
    females.forEach((f, idx) => {
      const bucketIdx = idx % sectionCount;
      buckets[bucketIdx].students.push({
        ...f,
        allocatedSection: buckets[bucketIdx].sectionCode
      });
    });

    // Distribute males evenly (offset direction for balance)
    males.forEach((m, idx) => {
      const bucketIdx = (sectionCount - 1 - (idx % sectionCount)) % sectionCount;
      buckets[bucketIdx].students.push({
        ...m,
        allocatedSection: buckets[bucketIdx].sectionCode
      });
    });
  } else {
    // Merit-balanced: sort by previous average descending, then snake-draft across sections
    studentPool.sort((a, b) => (b.previousAverageScore || 75) - (a.previousAverageScore || 75));
    let forward = true;
    let bIdx = 0;
    studentPool.forEach((st) => {
      buckets[bIdx].students.push({
        ...st,
        allocatedSection: buckets[bIdx].sectionCode
      });
      if (forward) {
        if (bIdx === sectionCount - 1) {
          forward = false;
        } else {
          bIdx++;
        }
      } else {
        if (bIdx === 0) {
          forward = true;
        } else {
          bIdx--;
        }
      }
    });
  }

  // Calculate statistics for each section
  buckets.forEach((bucket) => {
    bucket.maleCount = bucket.students.filter((s) => s.gender === 'M').length;
    bucket.femaleCount = bucket.students.filter((s) => s.gender === 'F').length;
    const totalScore = bucket.students.reduce((acc, s) => acc + (s.previousAverageScore || 75), 0);
    bucket.averageScore = bucket.students.length > 0 ? Number((totalScore / bucket.students.length).toFixed(1)) : 0;
  });

  return buckets;
}

/**
 * Checks whether assigning a teacher to a period/day slot conflicts with any existing slot
 * for another section.
 * If conflict exists, returns detailed error in English and Amharic.
 */
export function checkTimetablePeriodConflict(
  existingSlots: TimetableSlot[],
  candidate: {
    slotId?: string; // If editing an existing slot
    teacherId: string;
    teacherName: string;
    day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
    period: number;
    sectionCode: string;
    subjectName?: string;
  }
): ConflictCheckResult {
  if (!candidate.teacherId || candidate.teacherId.trim() === '' || candidate.teacherId === 'unassigned') {
    return { hasConflict: false };
  }

  // Find any slot where the same teacher is scheduled on the same day and period for a DIFFERENT section
  const conflict = existingSlots.find((slot) => {
    if (candidate.slotId && slot.id === candidate.slotId) return false;
    return (
      slot.teacherId === candidate.teacherId &&
      slot.day === candidate.day &&
      slot.period === candidate.period &&
      slot.sectionCode !== candidate.sectionCode
    );
  });

  if (conflict) {
    const errorEng = `Period Conflict Error: ${candidate.teacherName} is already assigned to teach Section ${conflict.sectionCode} (${conflict.subjectName}) during ${candidate.day} Period ${candidate.period}! A teacher cannot teach two different sections at the same period.`;
    const errorAmh = `የክፍለ-ጊዜ ግጭት ስህተት፡ መምህር ${candidate.teacherName} በ${candidate.day} በ${candidate.period}ኛ ክፍለ-ጊዜ በክፍል ${conflict.sectionCode} (${conflict.subjectName}) ላይ ተመድበዋል! አንድ መምህር በአንድ ክፍለ-ጊዜ ሁለት የተለያዩ ክፍሎችን ማስተማር አይችልም።`;

    return {
      hasConflict: true,
      conflictingSlot: conflict,
      errorMessage: errorEng,
      errorMessageAmharic: errorAmh
    };
  }

  return { hasConflict: false };
}
