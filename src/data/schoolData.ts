export interface Student {
  id: string;
  studentId: string; // e.g. HMM-2024-0901
  fullName: string;
  fullNameAmharic: string;
  gender: 'M' | 'F';
  grade: number; // 9, 10, 11, 12
  section: string; // 'A', 'B', 'C', 'D'
  stream?: 'Natural Science' | 'Social Science';
  streamAmharic?: string;
  academicYear: string;
  avatar: string;
  rank: number;
  totalStudentsInSection: number;
  attendanceRate: number; // e.g. 96.4%
  conduct: 'A' | 'B' | 'C' | 'D'; // Ethiopian Secondary Conduct rating (ስነ-ምግባር)
  homeroomTeacher: string;
  guardianName: string;
  guardianPhone: string;
  attendanceStatus?: 'Present' | 'Absent' | 'Late' | 'Permission'; // Today's status in 9A
  semesters: {
    semester: 1 | 2;
    subjects: {
      subjectId: string;
      subjectName: string;
      subjectAmharic: string;
      teacherName: string;
      continuousAssessment: number; // /30
      midExam: number;              // /20
      finalExam: number;            // /50
    }[];
  }[];
}

export interface Teacher {
  id: string;
  name: string;
  nameAmharic: string;
  department: string;
  subject: string;
  gradesTeaching: number[];
  sectionsTeaching: string[]; // e.g. ['9A', '9B', '10A', '12A']
  email: string;
  phone: string;
  qualification: string;
  avatar: string;
  isOnline: boolean;
  officeHours: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  titleAmharic: string;
  date: string;
  ethiopianDate: string;
  time: string;
  location: string;
  category: 'Exam' | 'Holiday' | 'Sports' | 'PTA' | 'Academic' | 'Club';
  targetGrades: number[];
  description: string;
  descriptionAmharic: string;
  isImportant?: boolean;
}

export interface MessageThread {
  id: string;
  subject: string;
  category: 'Physics' | 'Mathematics' | 'Chemistry' | 'Biology' | 'English' | 'General' | 'PTA' | 'Exam Prep';
  gradeLevel: number;
  authorName: string;
  authorRole: 'Student' | 'Teacher' | 'Parent' | 'Admin';
  authorAvatar: string;
  datePosted: string;
  content: string;
  replies: {
    id: string;
    authorName: string;
    authorRole: 'Student' | 'Teacher' | 'Parent' | 'Admin';
    authorAvatar: string;
    datePosted: string;
    content: string;
    isVerifiedTeacher?: boolean;
  }[];
  resolved?: boolean;
}

export interface ESSLCEQuestion {
  id: string;
  subject: 'Physics' | 'Mathematics' | 'Chemistry' | 'Biology' | 'English';
  stream: 'Natural' | 'Social' | 'Common';
  year: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// -------------------------------------------------------------------------------------------------
// GRADE 9 SECTION A (9A) ROSTER & OTHER SEEDED STUDENTS
// -------------------------------------------------------------------------------------------------

const grade9SubjectsTemplate = (marks: {
  math: [number, number, number];
  phys: [number, number, number];
  chem: [number, number, number];
  bio: [number, number, number];
  eng: [number, number, number];
  amh: [number, number, number];
  geo: [number, number, number];
  hist: [number, number, number];
  civ: [number, number, number];
  ict?: [number, number, number];
  pe?: [number, number, number];
  econ?: [number, number, number];
}) => [
  { subjectId: 'eng', subjectName: 'English Language', subjectAmharic: 'እንግሊዝኛ', teacherName: 'Ato Tesfaye Mengistu', continuousAssessment: marks.eng[0], midExam: marks.eng[1], finalExam: marks.eng[2] },
  { subjectId: 'math', subjectName: 'Mathematics', subjectAmharic: 'ሒሳብ', teacherName: 'Ato Daniel Girma', continuousAssessment: marks.math[0], midExam: marks.math[1], finalExam: marks.math[2] },
  { subjectId: 'phys', subjectName: 'Physics', subjectAmharic: 'ፊዚክስ', teacherName: 'W/ro Almaz Kebede', continuousAssessment: marks.phys[0], midExam: marks.phys[1], finalExam: marks.phys[2] },
  { subjectId: 'chem', subjectName: 'Chemistry', subjectAmharic: 'ኬሚስትሪ', teacherName: 'Ato Birhanu Ayele', continuousAssessment: marks.chem[0], midExam: marks.chem[1], finalExam: marks.chem[2] },
  { subjectId: 'bio', subjectName: 'Biology', subjectAmharic: 'ባዮሎጂ', teacherName: 'W/ro Tigist Hailu', continuousAssessment: marks.bio[0], midExam: marks.bio[1], finalExam: marks.bio[2] },
  { subjectId: 'geo', subjectName: 'Geography', subjectAmharic: 'ጂኦግራፊ', teacherName: 'W/ro Genet Abebe', continuousAssessment: marks.geo[0], midExam: marks.geo[1], finalExam: marks.geo[2] },
  { subjectId: 'hist', subjectName: 'History', subjectAmharic: 'ታሪክ', teacherName: 'Ato Solomon Kassa', continuousAssessment: marks.hist[0], midExam: marks.hist[1], finalExam: marks.hist[2] },
  { subjectId: 'pe', subjectName: 'Physical Education (P.E.)', subjectAmharic: 'ስፖርት', teacherName: 'Ato Yared Kassahun', continuousAssessment: marks.pe?.[0] ?? 28, midExam: marks.pe?.[1] ?? 18, finalExam: marks.pe?.[2] ?? 46 },
  { subjectId: 'civ', subjectName: 'Citizenship Education', subjectAmharic: 'ስነ-ዜጋ', teacherName: 'Ato Solomon Kassa', continuousAssessment: marks.civ[0], midExam: marks.civ[1], finalExam: marks.civ[2] },
  { subjectId: 'amh', subjectName: 'Amharic Language', subjectAmharic: 'አማርኛ', teacherName: 'W/ro Aster Molla', continuousAssessment: marks.amh[0], midExam: marks.amh[1], finalExam: marks.amh[2] },
  { subjectId: 'econ', subjectName: 'Economics', subjectAmharic: 'ኢኮኖሚክስ', teacherName: 'Ato Muluneh Desta', continuousAssessment: marks.econ?.[0] ?? 27, midExam: marks.econ?.[1] ?? 17, finalExam: marks.econ?.[2] ?? 44 },
];

export const SEED_STUDENTS: Student[] = [
  // --- GRADE 9 SECTION A (9A) FULL ROSTER ---
  {
    id: 's-9a-01',
    studentId: 'HMM-2024-0901',
    fullName: 'Abebe Bikila Desta',
    fullNameAmharic: 'አበበ ቢቂላ ደስታ',
    gender: 'M',
    grade: 9,
    section: 'A',
    academicYear: '2017 E.C. (2024/2025)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    rank: 1,
    totalStudentsInSection: 10,
    attendanceRate: 98.5,
    conduct: 'A',
    homeroomTeacher: 'Ato Daniel Girma (Mathematics)',
    guardianName: 'Ato Bikila Desta',
    guardianPhone: '+251 91 142 1100',
    attendanceStatus: 'Present',
    semesters: [
      {
        semester: 1,
        subjects: grade9SubjectsTemplate({
          math: [29, 19, 48], // 96
          phys: [28, 18, 47], // 93
          chem: [29, 19, 46], // 94
          bio: [28, 18, 47],  // 93
          eng: [27, 18, 45],  // 90
          amh: [29, 19, 48],  // 96
          geo: [28, 18, 46],  // 92
          hist: [29, 19, 47], // 95
          civ: [30, 20, 48],  // 98
          ict: [29, 19, 49],  // 97
        })
      }
    ]
  },
  {
    id: 's-9a-02',
    studentId: 'HMM-2024-0902',
    fullName: 'Selamawit Alemu Wolde',
    fullNameAmharic: 'ሰላማዊት አለሙ ወልዴ',
    gender: 'F',
    grade: 9,
    section: 'A',
    academicYear: '2017 E.C. (2024/2025)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rank: 2,
    totalStudentsInSection: 10,
    attendanceRate: 99.0,
    conduct: 'A',
    homeroomTeacher: 'Ato Daniel Girma (Mathematics)',
    guardianName: 'W/ro Mulu Wolde',
    guardianPhone: '+251 92 110 4455',
    attendanceStatus: 'Present',
    semesters: [
      {
        semester: 1,
        subjects: grade9SubjectsTemplate({
          math: [28, 18, 46], // 92
          phys: [27, 18, 46], // 91
          chem: [28, 18, 45], // 91
          bio: [29, 19, 47],  // 95
          eng: [28, 19, 46],  // 93
          amh: [29, 19, 47],  // 95
          geo: [27, 18, 45],  // 90
          hist: [28, 18, 46], // 92
          civ: [29, 19, 48],  // 96
          ict: [28, 19, 47],  // 94
        })
      }
    ]
  },
  {
    id: 's-9a-03',
    studentId: 'HMM-2024-0903',
    fullName: 'Yohannes Tesfaye Mengistu',
    fullNameAmharic: 'ዮሐንስ ተስፋዬ መንግስቱ',
    gender: 'M',
    grade: 9,
    section: 'A',
    academicYear: '2017 E.C. (2024/2025)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rank: 3,
    totalStudentsInSection: 10,
    attendanceRate: 96.0,
    conduct: 'A',
    homeroomTeacher: 'Ato Daniel Girma (Mathematics)',
    guardianName: 'Ato Tesfaye Mengistu',
    guardianPhone: '+251 91 322 8844',
    attendanceStatus: 'Present',
    semesters: [
      {
        semester: 1,
        subjects: grade9SubjectsTemplate({
          math: [27, 18, 44], // 89
          phys: [26, 17, 43], // 86
          chem: [26, 17, 44], // 87
          bio: [27, 18, 45],  // 90
          eng: [27, 17, 44],  // 88
          amh: [28, 18, 46],  // 92
          geo: [26, 17, 43],  // 86
          hist: [27, 18, 45], // 90
          civ: [28, 18, 46],  // 92
          ict: [29, 19, 47],  // 95
        })
      }
    ]
  },
  {
    id: 's-9a-04',
    studentId: 'HMM-2024-0904',
    fullName: 'Bethlehem Desta Gebre',
    fullNameAmharic: 'ቤተልሔም ደስታ ገብሬ',
    gender: 'F',
    grade: 9,
    section: 'A',
    academicYear: '2017 E.C. (2024/2025)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rank: 4,
    totalStudentsInSection: 10,
    attendanceRate: 94.5,
    conduct: 'A',
    homeroomTeacher: 'Ato Daniel Girma (Mathematics)',
    guardianName: 'W/ro Aster Gebre',
    guardianPhone: '+251 94 455 6677',
    attendanceStatus: 'Late',
    semesters: [
      {
        semester: 1,
        subjects: grade9SubjectsTemplate({
          math: [25, 17, 42], // 84
          phys: [25, 16, 41], // 82
          chem: [26, 17, 42], // 85
          bio: [26, 17, 43],  // 86
          eng: [28, 18, 45],  // 91
          amh: [27, 18, 45],  // 90
          geo: [25, 16, 42],  // 83
          hist: [26, 17, 44], // 87
          civ: [27, 18, 45],  // 90
          ict: [28, 18, 45],  // 91
        })
      }
    ]
  },
  {
    id: 's-9a-05',
    studentId: 'HMM-2024-0905',
    fullName: 'Eyob Girma Tilahun',
    fullNameAmharic: 'እዮብ ግርማ ጥላሁን',
    gender: 'M',
    grade: 9,
    section: 'A',
    academicYear: '2017 E.C. (2024/2025)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rank: 5,
    totalStudentsInSection: 10,
    attendanceRate: 91.0,
    conduct: 'B',
    homeroomTeacher: 'Ato Daniel Girma (Mathematics)',
    guardianName: 'Ato Girma Tilahun',
    guardianPhone: '+251 91 190 3322',
    attendanceStatus: 'Absent',
    semesters: [
      {
        semester: 1,
        subjects: grade9SubjectsTemplate({
          math: [24, 15, 38], // 77
          phys: [23, 15, 37], // 75
          chem: [24, 16, 39], // 79
          bio: [25, 16, 40],  // 81
          eng: [24, 16, 39],  // 79
          amh: [26, 17, 42],  // 85
          geo: [23, 15, 38],  // 76
          hist: [25, 16, 40], // 81
          civ: [26, 17, 42],  // 85
          ict: [27, 18, 43],  // 88
        })
      }
    ]
  },
  {
    id: 's-9a-06',
    studentId: 'HMM-2024-0906',
    fullName: 'Hanna Berhanu Kassa',
    fullNameAmharic: 'ሃና ብርሃኑ ካሳ',
    gender: 'F',
    grade: 9,
    section: 'A',
    academicYear: '2017 E.C. (2024/2025)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    rank: 6,
    totalStudentsInSection: 10,
    attendanceRate: 95.0,
    conduct: 'A',
    homeroomTeacher: 'Ato Daniel Girma (Mathematics)',
    guardianName: 'Ato Berhanu Kassa',
    guardianPhone: '+251 92 888 7711',
    attendanceStatus: 'Present',
    semesters: [
      {
        semester: 1,
        subjects: grade9SubjectsTemplate({
          math: [23, 15, 36], // 74
          phys: [22, 14, 35], // 71
          chem: [23, 15, 37], // 75
          bio: [24, 16, 38],  // 78
          eng: [26, 17, 41],  // 84
          amh: [27, 18, 43],  // 88
          geo: [24, 16, 39],  // 79
          hist: [25, 16, 40], // 81
          civ: [26, 17, 42],  // 85
          ict: [25, 17, 40],  // 82
        })
      }
    ]
  },
  {
    id: 's-9a-07',
    studentId: 'HMM-2024-0907',
    fullName: 'Dawit Mekonnen Hailu',
    fullNameAmharic: 'ዳዊት መኮንን ኃይሉ',
    gender: 'M',
    grade: 9,
    section: 'A',
    academicYear: '2017 E.C. (2024/2025)',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    rank: 7,
    totalStudentsInSection: 10,
    attendanceRate: 92.5,
    conduct: 'B',
    homeroomTeacher: 'Ato Daniel Girma (Mathematics)',
    guardianName: 'W/ro Tigist Hailu',
    guardianPhone: '+251 93 400 9988',
    attendanceStatus: 'Permission',
    semesters: [
      {
        semester: 1,
        subjects: grade9SubjectsTemplate({
          math: [20, 13, 34], // 67
          phys: [21, 14, 33], // 68
          chem: [22, 14, 35], // 71
          bio: [23, 15, 36],  // 74
          eng: [23, 15, 35],  // 73
          amh: [25, 16, 39],  // 80
          geo: [22, 14, 34],  // 70
          hist: [23, 15, 36], // 74
          civ: [25, 16, 38],  // 79
          ict: [24, 16, 37],  // 77
        })
      }
    ]
  },
  {
    id: 's-9a-08',
    studentId: 'HMM-2024-0908',
    fullName: 'Tsion Kassa Abebe',
    fullNameAmharic: 'ጽዮን ካሳ አበበ',
    gender: 'F',
    grade: 9,
    section: 'A',
    academicYear: '2017 E.C. (2024/2025)',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    rank: 8,
    totalStudentsInSection: 10,
    attendanceRate: 89.0,
    conduct: 'B',
    homeroomTeacher: 'Ato Daniel Girma (Mathematics)',
    guardianName: 'Ato Kassa Abebe',
    guardianPhone: '+251 91 700 1122',
    attendanceStatus: 'Present',
    semesters: [
      {
        semester: 1,
        subjects: grade9SubjectsTemplate({
          math: [18, 12, 30], // 60
          phys: [19, 13, 31], // 63
          chem: [20, 13, 32], // 65
          bio: [21, 14, 33],  // 68
          eng: [22, 14, 34],  // 70
          amh: [24, 15, 37],  // 76
          geo: [21, 13, 33],  // 67
          hist: [22, 14, 34], // 70
          civ: [24, 15, 36],  // 75
          ict: [23, 14, 35],  // 72
        })
      }
    ]
  },
  {
    id: 's-9a-09',
    studentId: 'HMM-2024-0909',
    fullName: 'Natnael Solomon Zeleke',
    fullNameAmharic: 'ናትናኤል ሰለሞን ዘለቀ',
    gender: 'M',
    grade: 9,
    section: 'A',
    academicYear: '2017 E.C. (2024/2025)',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    rank: 9,
    totalStudentsInSection: 10,
    attendanceRate: 85.0,
    conduct: 'C',
    homeroomTeacher: 'Ato Daniel Girma (Mathematics)',
    guardianName: 'Ato Solomon Zeleke',
    guardianPhone: '+251 94 333 2211',
    attendanceStatus: 'Present',
    semesters: [
      {
        semester: 1,
        subjects: grade9SubjectsTemplate({
          math: [16, 10, 26], // 52
          phys: [17, 11, 27], // 55
          chem: [18, 11, 28], // 57
          bio: [19, 12, 29],  // 60
          eng: [20, 13, 30],  // 63
          amh: [22, 14, 33],  // 69
          geo: [18, 11, 28],  // 57
          hist: [20, 12, 30], // 62
          civ: [22, 13, 32],  // 67
          ict: [21, 13, 31],  // 65
        })
      }
    ]
  },
  {
    id: 's-9a-10',
    studentId: 'HMM-2024-0910',
    fullName: 'Kidist Hailemariam Worku',
    fullNameAmharic: 'ቅድስት ኃይለማሪያም ወርቁ',
    gender: 'F',
    grade: 9,
    section: 'A',
    academicYear: '2017 E.C. (2024/2025)',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    rank: 10,
    totalStudentsInSection: 10,
    attendanceRate: 82.0,
    conduct: 'C',
    homeroomTeacher: 'Ato Daniel Girma (Mathematics)',
    guardianName: 'W/ro Worku Tadesse',
    guardianPhone: '+251 92 600 4433',
    attendanceStatus: 'Absent',
    semesters: [
      {
        semester: 1,
        subjects: grade9SubjectsTemplate({
          math: [14, 8, 22],  // 44 (Conditional / Remedial)
          phys: [15, 9, 23],  // 47 (Conditional)
          chem: [17, 10, 25], // 52
          bio: [18, 11, 26],  // 55
          eng: [18, 11, 27],  // 56
          amh: [21, 13, 30],  // 64
          geo: [17, 10, 25],  // 52
          hist: [19, 11, 27], // 57
          civ: [20, 12, 29],  // 61
          ict: [19, 11, 28],  // 58
        })
      }
    ]
  },

  // --- SENIOR STUDENTS (GRADES 10, 11, 12) ---
  {
    id: 's1',
    studentId: 'HMM-2024-0182',
    fullName: 'Selamawit Tadesse Bekele',
    fullNameAmharic: 'ሰላማዊት ታደሰ በቀለ',
    gender: 'F',
    grade: 12,
    section: 'A',
    stream: 'Natural Science',
    streamAmharic: 'የተፈጥሮ ሳይንስ',
    academicYear: '2017 E.C. (2024/2025)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rank: 2,
    totalStudentsInSection: 48,
    attendanceRate: 98.2,
    conduct: 'A',
    homeroomTeacher: 'W/ro Almaz Kebede (Physics Dept Head)',
    guardianName: 'Ato Tadesse Bekele',
    guardianPhone: '+251 91 142 8891',
    attendanceStatus: 'Present',
    semesters: [
      {
        semester: 1,
        subjects: [
          { subjectId: 'math', subjectName: 'Mathematics', subjectAmharic: 'ሒሳብ', teacherName: 'Ato Daniel Girma', continuousAssessment: 28, midExam: 19, finalExam: 47 },
          { subjectId: 'phys', subjectName: 'Physics', subjectAmharic: 'ፊዚክስ', teacherName: 'W/ro Almaz Kebede', continuousAssessment: 27, midExam: 18, finalExam: 46 },
          { subjectId: 'chem', subjectName: 'Chemistry', subjectAmharic: 'ኬሚስትሪ', teacherName: 'Ato Birhanu Ayele', continuousAssessment: 29, midExam: 18, finalExam: 45 },
          { subjectId: 'bio', subjectName: 'Biology', subjectAmharic: 'ባዮሎጂ', teacherName: 'W/ro Tigist Hailu', continuousAssessment: 28, midExam: 19, finalExam: 48 },
          { subjectId: 'eng', subjectName: 'English Language', subjectAmharic: 'እንግሊዝኛ', teacherName: 'Ato Tesfaye Mengistu', continuousAssessment: 26, midExam: 17, finalExam: 44 },
          { subjectId: 'civ', subjectName: 'Civics & Ethical Studies', subjectAmharic: 'ስነ-ዜጋና ስነ-ምግባር', teacherName: 'Ato Solomon Kassa', continuousAssessment: 29, midExam: 19, finalExam: 48 },
          { subjectId: 'ict', subjectName: 'ICT & Computing', subjectAmharic: 'የኮምፒውተር ሳይንስ', teacherName: 'Ato Robel Tilahun', continuousAssessment: 30, midExam: 20, finalExam: 49 },
        ]
      }
    ]
  },
  {
    id: 's2',
    studentId: 'HMM-2024-0305',
    fullName: 'Dawit Bekele Haile',
    fullNameAmharic: 'ዳዊት በቀለ ኃይሌ',
    gender: 'M',
    grade: 11,
    section: 'B',
    stream: 'Social Science',
    streamAmharic: 'የማህበራዊ ሳይንስ',
    academicYear: '2017 E.C. (2024/2025)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    rank: 5,
    totalStudentsInSection: 52,
    attendanceRate: 95.8,
    conduct: 'A',
    homeroomTeacher: 'Ato Solomon Kassa (History Dept)',
    guardianName: 'W/ro Mulugeta Worku',
    guardianPhone: '+251 92 311 0944',
    attendanceStatus: 'Present',
    semesters: [
      {
        semester: 1,
        subjects: [
          { subjectId: 'hist', subjectName: 'History', subjectAmharic: 'ታሪክ', teacherName: 'Ato Solomon Kassa', continuousAssessment: 27, midExam: 18, finalExam: 45 },
          { subjectId: 'geo', subjectName: 'Geography', subjectAmharic: 'ጂኦግራፊ', teacherName: 'W/ro Genet Abebe', continuousAssessment: 26, midExam: 17, finalExam: 43 },
          { subjectId: 'econ', subjectName: 'Economics', subjectAmharic: 'ኢኮኖሚክስ', teacherName: 'Ato Muluneh Desta', continuousAssessment: 25, midExam: 16, finalExam: 42 },
          { subjectId: 'eng', subjectName: 'English Language', subjectAmharic: 'እንግሊዝኛ', teacherName: 'Ato Tesfaye Mengistu', continuousAssessment: 28, midExam: 18, finalExam: 44 },
          { subjectId: 'amharic', subjectName: 'Amharic Literature', subjectAmharic: 'አማርኛ ቋንቋና ስነ-ጽሁፍ', teacherName: 'W/ro Aster Molla', continuousAssessment: 29, midExam: 19, finalExam: 47 },
          { subjectId: 'math_soc', subjectName: 'General Mathematics', subjectAmharic: 'ጠቅላላ ሒሳብ', teacherName: 'Ato Daniel Girma', continuousAssessment: 24, midExam: 15, finalExam: 39 },
          { subjectId: 'civ', subjectName: 'Civics', subjectAmharic: 'ስነ-ዜጋ', teacherName: 'Ato Solomon Kassa', continuousAssessment: 27, midExam: 17, finalExam: 45 }
        ]
      }
    ]
  },
  {
    id: 's3',
    studentId: 'HMM-2024-0711',
    fullName: 'Meron Hailu Gebre',
    fullNameAmharic: 'ሜሮን ኃይሉ ገብሬ',
    gender: 'F',
    grade: 10,
    section: 'C',
    academicYear: '2017 E.C. (2024/2025)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    rank: 3,
    totalStudentsInSection: 50,
    attendanceRate: 99.0,
    conduct: 'A',
    homeroomTeacher: 'Ato Birhanu Ayele',
    guardianName: 'Ato Hailu Gebre',
    guardianPhone: '+251 91 388 7720',
    attendanceStatus: 'Present',
    semesters: [
      {
        semester: 1,
        subjects: [
          { subjectId: 'math', subjectName: 'Mathematics', subjectAmharic: 'ሒሳብ', teacherName: 'Ato Daniel Girma', continuousAssessment: 29, midExam: 19, finalExam: 48 },
          { subjectId: 'phys', subjectName: 'Physics', subjectAmharic: 'ፊዚክስ', teacherName: 'W/ro Almaz Kebede', continuousAssessment: 28, midExam: 18, finalExam: 45 },
          { subjectId: 'chem', subjectName: 'Chemistry', subjectAmharic: 'ኬሚስትሪ', teacherName: 'Ato Birhanu Ayele', continuousAssessment: 27, midExam: 17, finalExam: 43 },
          { subjectId: 'bio', subjectName: 'Biology', subjectAmharic: 'ባዮሎጂ', teacherName: 'W/ro Tigist Hailu', continuousAssessment: 29, midExam: 19, finalExam: 46 },
          { subjectId: 'eng', subjectName: 'English', subjectAmharic: 'እንግሊዝኛ', teacherName: 'Ato Tesfaye Mengistu', continuousAssessment: 26, midExam: 16, finalExam: 42 },
          { subjectId: 'amharic', subjectName: 'Amharic', subjectAmharic: 'አማርኛ', teacherName: 'W/ro Aster Molla', continuousAssessment: 28, midExam: 18, finalExam: 46 },
          { subjectId: 'geo', subjectName: 'Geography', subjectAmharic: 'ጂኦግራፊ', teacherName: 'W/ro Genet Abebe', continuousAssessment: 27, midExam: 17, finalExam: 44 },
          { subjectId: 'hist', subjectName: 'History', subjectAmharic: 'ታሪክ', teacherName: 'Ato Solomon Kassa', continuousAssessment: 28, midExam: 18, finalExam: 45 }
        ]
      }
    ]
  }
];

export const TEACHERS: Teacher[] = [
  {
    id: 't2',
    name: 'Ato Daniel Girma',
    nameAmharic: 'አቶ ዳንኤል ግርማ',
    department: 'Mathematics & Statistics',
    subject: 'Mathematics',
    gradesTeaching: [9, 10, 12],
    sectionsTeaching: ['9A', '9B', '10A', '12A'],
    email: 'daniel.girma@hailemariammamo.edu.et',
    phone: '+251 91 245 7789',
    qualification: 'B.Ed. in Mathematics (Addis Ababa University)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    officeHours: 'Every morning: 10:30 AM - 11:30 AM (Math Block)'
  },
  {
    id: 't1',
    name: 'W/ro Almaz Kebede',
    nameAmharic: 'ወ/ሮ አልማዝ ከበደ',
    department: 'Natural Sciences',
    subject: 'Physics',
    gradesTeaching: [9, 10, 11, 12],
    sectionsTeaching: ['9A', '10C', '11A', '12A'],
    email: 'almaz.kebede@hailemariammamo.edu.et',
    phone: '+251 91 190 2314',
    qualification: 'M.Sc. in Applied Physics (Debre Berhan University)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    officeHours: 'Mon - Thu: 2:00 PM - 4:00 PM (Science Lab 2)'
  },
  {
    id: 't3',
    name: 'Ato Birhanu Ayele',
    nameAmharic: 'አቶ ብርሃኑ አየለ',
    department: 'Natural Sciences',
    subject: 'Chemistry',
    gradesTeaching: [9, 10, 11, 12],
    sectionsTeaching: ['9A', '10A', '11A', '12A'],
    email: 'birhanu.ayele@hailemariammamo.edu.et',
    phone: '+251 91 300 4455',
    qualification: 'B.Sc. in Chemistry (Bahir Dar University)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isOnline: false,
    officeHours: 'Tue & Fri: 3:00 PM - 4:30 PM (Chemistry Lab)'
  },
  {
    id: 't-bio',
    name: 'W/ro Tigist Hailu',
    nameAmharic: 'ወ/ሮ ትዕግስት ኃይሉ',
    department: 'Natural Sciences',
    subject: 'Biology',
    gradesTeaching: [9, 10, 11, 12],
    sectionsTeaching: ['9A', '9B', '10B', '11A'],
    email: 'tigist.hailu@hailemariammamo.edu.et',
    phone: '+251 91 550 8822',
    qualification: 'B.Sc. in Biology (Haramaya University)',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    officeHours: 'Mon & Wed: 10:00 AM - 12:00 PM (Biology Lab)'
  },
  {
    id: 't4',
    name: 'Ato Tesfaye Mengistu',
    nameAmharic: 'አቶ ተስፋዬ መንግስቱ',
    department: 'Languages & Literature',
    subject: 'English Language',
    gradesTeaching: [9, 11, 12],
    sectionsTeaching: ['9A', '9C', '11B', '12A'],
    email: 'tesfaye.m@hailemariammamo.edu.et',
    phone: '+251 92 411 9901',
    qualification: 'M.A. in TEFL (Kotebe Metropolitan University)',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    officeHours: 'Wed & Fri: 1:30 PM - 3:30 PM (Main Library)'
  },
  {
    id: 't-amh',
    name: 'W/ro Aster Molla',
    nameAmharic: 'ወ/ሮ አስቴር ሞላ',
    department: 'Languages & Literature',
    subject: 'Amharic Literature',
    gradesTeaching: [9, 10, 11, 12],
    sectionsTeaching: ['9A', '9D', '11B', '12B'],
    email: 'aster.molla@hailemariammamo.edu.et',
    phone: '+251 91 766 3311',
    qualification: 'B.A. in Ethiopian Languages & Literature',
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    officeHours: 'Tue & Thu: 9:00 AM - 11:00 AM'
  },
  {
    id: 't-geo',
    name: 'W/ro Genet Abebe',
    nameAmharic: 'ወ/ሮ ገነት አበበ',
    department: 'Social Sciences',
    subject: 'Geography',
    gradesTeaching: [9, 10, 11],
    sectionsTeaching: ['9A', '10A', '11B'],
    email: 'genet.abebe@hailemariammamo.edu.et',
    phone: '+251 91 990 7711',
    qualification: 'B.A. in Geography & Environmental Studies',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=200&q=80',
    isOnline: false,
    officeHours: 'Wednesday: 2:00 PM - 4:00 PM'
  },
  {
    id: 't5',
    name: 'Ato Solomon Kassa',
    nameAmharic: 'አቶ ሰለሞን ካሳ',
    department: 'Social Sciences',
    subject: 'History & Civics',
    gradesTeaching: [9, 10, 11],
    sectionsTeaching: ['9A', '10B', '11B'],
    email: 'solomon.kassa@hailemariammamo.edu.et',
    phone: '+251 91 822 3411',
    qualification: 'B.A. in History & Heritage Studies',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    officeHours: 'Monday: 3:00 PM - 5:00 PM'
  },
  {
    id: 't-ict',
    name: 'Ato Robel Tilahun',
    nameAmharic: 'አቶ ሮቤል ጥላሁን',
    department: 'Information Technology',
    subject: 'Information Technology',
    gradesTeaching: [9, 10, 11, 12],
    sectionsTeaching: ['9A', '10D', '11A', '12A'],
    email: 'robel.t@hailemariammamo.edu.et',
    phone: '+251 92 888 1234',
    qualification: 'B.Sc. in Computer Science',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    officeHours: 'Mon - Fri: Computer Lab 1'
  },
  {
    id: 't-econ',
    name: 'Ato Muluneh Desta',
    nameAmharic: 'አቶ ሙሉነህ ደስታ',
    department: 'Social Sciences',
    subject: 'Economics',
    gradesTeaching: [9, 10, 11, 12],
    sectionsTeaching: ['9A', '10A', '11B', '12B'],
    email: 'muluneh.desta@hailemariammamo.edu.et',
    phone: '+251 91 433 9922',
    qualification: 'M.Sc. in Development Economics',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    officeHours: 'Thursday: 10:00 AM - 12:00 PM'
  },
  {
    id: 't-pe',
    name: 'Ato Yared Kassahun',
    nameAmharic: 'አቶ ያሬድ ካሳሁን',
    department: 'Health & Physical Education',
    subject: 'Physical Education (P.E.)',
    gradesTeaching: [9, 10],
    sectionsTeaching: ['9A', '9B', '10A'],
    email: 'yared.k@hailemariammamo.edu.et',
    phone: '+251 91 199 4433',
    qualification: 'B.Sc. in Sports Science & Physical Education',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    officeHours: 'Mon & Wed: 4:00 PM - 5:30 PM (School Sports Ground)'
  },
  {
    id: 't-agri',
    name: 'W/ro Selamawit Bekele',
    nameAmharic: 'ወ/ሮ ሰላማዊት በቀለ',
    department: 'Agricultural Sciences',
    subject: 'Agriculture',
    gradesTeaching: [11, 12],
    sectionsTeaching: ['11-Nat-A', '12-Nat-A'],
    email: 'selamawit.b@hailemariammamo.edu.et',
    phone: '+251 91 222 8899',
    qualification: 'M.Sc. in Agronomy & Crop Science (Haramaya University)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    officeHours: 'Tue & Thu: 2:00 PM - 4:00 PM (Agriculture Field Station)'
  },
  {
    id: 't-cte',
    name: 'Ato Ermias Haile',
    nameAmharic: 'አቶ ኤርሚያስ ኃይሌ',
    department: 'Career & Technical Education (CTE)',
    subject: 'Career & Technical Education (CTE)',
    gradesTeaching: [11, 12],
    sectionsTeaching: ['11-Nat-A', '11-Soc-A', '12-Nat-A'],
    email: 'ermias.h@hailemariammamo.edu.et',
    phone: '+251 91 333 7711',
    qualification: 'B.Tech in Technical & Vocational Education (CTE)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isOnline: true,
    officeHours: 'Mon - Fri: CTE Workshop & Computing Studio'
  }
];

export const SCHOOL_EVENTS: SchoolEvent[] = [
  {
    id: 'ev1',
    title: 'Semester 1 Final Examination Week',
    titleAmharic: 'የ1ኛው ወሰነ-ትምህርት የመጨረሻ ፈተና ሳምንት',
    date: '2025-01-13',
    ethiopianDate: 'ጥር 5 - ጥር 10, 2017',
    time: '8:30 AM - 12:30 PM',
    location: 'All Secondary Classrooms & Main Hall',
    category: 'Exam',
    targetGrades: [9, 10, 11, 12],
    description: 'First semester comprehensive examinations for all subjects across Grades 9 to 12. Students must bring school ID and uniform.',
    descriptionAmharic: 'ለሁሉም የ9ኛ - 12ኛ ክፍል ተማሪዎች የ1ኛው መንፈቀ-ትምህርት ማጠቃለያ ፈተና ይካሄዳል።',
    isImportant: true
  },
  {
    id: 'ev2',
    title: 'Ethiopian Christmas (Genna) Break',
    titleAmharic: 'የገና በዓል እረፍት',
    date: '2025-01-07',
    ethiopianDate: 'ታህሳስ 29, 2017',
    time: 'All Day',
    location: 'National Holiday',
    category: 'Holiday',
    targetGrades: [9, 10, 11, 12],
    description: 'School closed in observance of Ethiopian Christmas (Genna). Classes resume on Tir 1.',
    descriptionAmharic: 'በትምህርት ሚኒስቴር የቀን መቁጠሪያ መሰረት ትምህርት ቤት ዝግ ይሆናል።'
  },
  {
    id: 'ev3',
    title: 'Grade 12 ESSLCE Model Exam Series 1',
    titleAmharic: 'የ12ኛ ክፍል የመጀመሪያ ዙር የዩኒቨርሲቲ መግቢያ ሞዴል ፈተና',
    date: '2025-02-17',
    ethiopianDate: 'የካቲት 10, 2017',
    time: '8:00 AM - 3:30 PM',
    location: 'Preparatory Block & Hall A',
    category: 'Exam',
    targetGrades: [12],
    description: 'First regional model exam in partnership with North Shewa Education Department to prepare Grade 12 students for National Entrance.',
    descriptionAmharic: 'የሰሜን ሸዋ ዞን ትምህርት መምሪያ የሚያዘጋጀው የ12ኛ ክፍል ብሄራዊ ፈተና ቅድመ-ዝግጅት ሞዴል ፈተና።',
    isImportant: true
  },
  {
    id: 'ev4',
    title: 'Annual North Shewa Secondary Athletics & Soccer Championship',
    titleAmharic: 'የሰሜን ሸዋ ዞን ሁለተኛ ደረጃ ትምህርት ቤቶች የስፖርት ውድድር',
    date: '2025-02-28',
    ethiopianDate: 'የካቲት 21, 2017',
    time: '9:00 AM - 5:00 PM',
    location: 'Debre Berhan Stadium & School Sports Grounds',
    category: 'Sports',
    targetGrades: [9, 10, 11, 12],
    description: 'Hailemariam Mamo Secondary athletic and soccer teams compete against Tebassie and Chacha secondary schools.',
    descriptionAmharic: 'የትምህርት ቤታችን የስፖርት ቡድኖች በደብረ ብርሃን ስታዲየም ከሌሎች ትምህርት ቤቶች ጋር ይወዳደራሉ።'
  },
  {
    id: 'ev5',
    title: 'Adwa Victory Commemoration & History Symposium',
    titleAmharic: 'የአድዋ ድል 129ኛ ዓመት መታሰቢያና የታሪክ ሲምፖዚየም',
    date: '2025-03-02',
    ethiopianDate: 'የካቲት 23, 2017',
    time: '10:00 AM - 1:00 PM',
    location: 'School Assembly Auditorium',
    category: 'Academic',
    targetGrades: [9, 10, 11, 12],
    description: 'Special school-wide commemoration featuring keynote by Debre Berhan University historians on Dejazmach Hailemariam Mamo and patriot heritage.',
    descriptionAmharic: 'የጀግናው ደጃዝማች ኃይለማሪያም ማሞን ገድልና የአድዋ ድልን በማስታወስ የሚዘጋጅ የጥናት ውይይት።'
  },
  {
    id: 'ev6',
    title: 'PTA & Parents Academic Progress Conference',
    titleAmharic: 'የወላጅ-መምህራን ህብረት (PTA) ጠቅላላ ጉባዔ',
    date: '2025-03-22',
    ethiopianDate: 'መጋቢት 13, 2017',
    time: '9:00 AM - 12:30 PM',
    location: 'Main Auditorium',
    category: 'PTA',
    targetGrades: [9, 10, 11, 12],
    description: 'Parent-Teacher conference to distribute Semester 1 report cards and review academic intervention programs for Grade 10 & 12 students.',
    descriptionAmharic: 'የ1ኛው ወሰነ ትምህርት የውጤት ካርድ ማሰራጫና የትምህርት አሰጣጥ ግምገማ ጉባዔ።',
    isImportant: true
  }
];

export const INITIAL_MESSAGES: MessageThread[] = [
  {
    id: 'msg-1',
    subject: 'Grade 9A Mathematics: Quadratic Equations & Factoring Tutorial',
    category: 'Mathematics',
    gradeLevel: 9,
    authorName: 'Ato Daniel Girma',
    authorRole: 'Teacher',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    datePosted: 'Today at 10:45 AM',
    content: 'Dear Grade 9 Section A students: I have reviewed the results of your Chapter 3 algebra test. Tutorial session for completing the square method will be held tomorrow at 3:30 PM in Room 12.',
    resolved: false,
    replies: [
      {
        id: 'rep-9a-1',
        authorName: 'Abebe Bikila Desta',
        authorRole: 'Student',
        authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
        datePosted: 'Today at 11:15 AM',
        content: 'Thank you Ato Daniel! Should we bring the Ethiopian Grade 9 student textbook or the supplementary worksheet?'
      },
      {
        id: 'rep-9a-2',
        authorName: 'Ato Daniel Girma',
        authorRole: 'Teacher',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        datePosted: 'Today at 11:30 AM',
        content: 'Please bring both your textbook and graph notebook.',
        isVerifiedTeacher: true
      }
    ]
  },
  {
    id: 'msg-2',
    subject: 'Grade 9A Physics: Kinematics Lab Demonstration Sign-up',
    category: 'Physics',
    gradeLevel: 9,
    authorName: 'W/ro Almaz Kebede',
    authorRole: 'Teacher',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    datePosted: 'Yesterday at 3:00 PM',
    content: 'Grade 9 Section A: Our ticker-tape timer and uniform acceleration lab will take place on Wednesday during Periods 3 & 4 in Physics Lab 1. Groups of 5 have been assigned on the lab door.',
    resolved: true,
    replies: [
      {
        id: 'rep-9a-3',
        authorName: 'Selamawit Alemu',
        authorRole: 'Student',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        datePosted: 'Yesterday at 4:10 PM',
        content: 'We are ready with our lab coats and notebooks teacher!'
      }
    ]
  }
];

export const ESSLCE_QUESTIONS: ESSLCEQuestion[] = [
  {
    id: 'q1',
    subject: 'Physics',
    stream: 'Natural',
    year: '2016 E.C. / 2024 Model',
    question: 'A car of mass 1200 kg travelling at 20 m/s is brought to rest over a distance of 50 meters by a constant braking force. What is the magnitude of the braking force applied?',
    options: ['4,800 N', '2,400 N', '6,000 N', '1,200 N'],
    correctIndex: 0,
    explanation: 'Using kinematic equation v² = u² + 2as: 0 = (20)² + 2*a*50 => 100a = -400 => a = -4 m/s². The braking force F = m*|a| = 1200 kg * 4 m/s² = 4,800 N.'
  },
  {
    id: 'q2',
    subject: 'Mathematics',
    stream: 'Natural',
    year: '2015 E.C. National Exam',
    question: 'What is the limit of (sin 3x) / (2x) as x approaches 0?',
    options: ['3/2', '2/3', '0', 'Does not exist'],
    correctIndex: 0,
    explanation: 'Recall the fundamental trigonometric limit lim(x->0) [sin(kx)/x] = k. Therefore lim(x->0) [(sin 3x)/(2x)] = (1/2) * lim(x->0) [(sin 3x)/x] = (1/2) * 3 = 3/2.'
  },
  {
    id: 'q3',
    subject: 'Chemistry',
    stream: 'Natural',
    year: '2016 E.C. National Exam',
    question: 'Which of the following organic compounds will produce a silver mirror precipitate when reacted with Tollens’ reagent?',
    options: ['Propanone (Ketone)', 'Ethanal (Acetaldehyde)', 'Ethanol (Alcohol)', 'Ethanoic acid (Carboxylic acid)'],
    correctIndex: 1,
    explanation: 'Tollens’ reagent [Ag(NH3)2]+ oxidizes aldehydes to carboxylate ions while reducing silver ions to metallic silver (silver mirror). Ethanal is an aldehyde, whereas ketones and alcohols do not react.'
  },
  {
    id: 'q4',
    subject: 'English',
    stream: 'Common',
    year: '2015 E.C. National Exam',
    question: 'Choose the correct grammatical completion: "If Selamawit had studied the historical context of the Battle of Debre Berhan, she _______ the essay with distinction."',
    options: ['would write', 'will write', 'would have written', 'wrote'],
    correctIndex: 2,
    explanation: 'This is a Type 3 (unreal past) conditional sentence. Structure: If + Past Perfect (had studied), main clause uses would have + past participle (would have written).'
  },
  {
    id: 'q5',
    subject: 'Biology',
    stream: 'Natural',
    year: '2016 E.C. Model',
    question: 'In cellular respiration, where does the Krebs citric acid cycle take place within eukaryotic cells?',
    options: ['Cytoplasm', 'Mitochondrial matrix', 'Inner mitochondrial cristae', 'Ribosome'],
    correctIndex: 1,
    explanation: 'Glycolysis occurs in the cytoplasm, the Krebs cycle takes place in the mitochondrial matrix, and oxidative phosphorylation / electron transport chain occurs along the inner mitochondrial membrane (cristae).'
  }
];

export const SCHOOL_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'Grade 9 Section A: Mid-term Assessment Roster Verification Open',
    titleAmharic: 'የ9ኛ ክፍል "ሀ" የማጠቃለያ ማርክ ማረጋገጫ ተጀመረ',
    date: 'October 31, 2024',
    badge: 'Academics',
    badgeColor: 'emerald',
    summary: 'Subject teachers for Grade 9A (Math, Physics, English, Chemistry) can now register continuous assessment (30%) and mid-term marks online.'
  },
  {
    id: 'ann-2',
    title: 'Debre Berhan University (DBU) Pre-College Mentorship Announced',
    titleAmharic: 'ከደብረ ብርሃን ዩኒቨርሲቲ ጋር የትምህርት አጋርነት ተመሰረተ',
    date: 'October 25, 2024',
    badge: 'Academic',
    badgeColor: 'blue',
    summary: 'Selected Grade 11 & 12 Natural Science students will have weekend access to DBU advanced science laboratories.'
  },
  {
    id: 'ann-3',
    title: 'Notice Regarding Debre Berhan Highland Winter Uniform Regulations',
    titleAmharic: 'የደብረ ብርሃን ቅዝቃዜ ወቅት የትምህርት ቤት ዩኒፎርም ደንብ',
    date: 'October 20, 2024',
    badge: 'Administration',
    badgeColor: 'amber',
    summary: 'Due to Debre Berhan’s frosty highland morning climate (elevation 2,840m), students are permitted navy blue wool sweaters and thermal jackets.'
  }
];

// -------------------------------------------------------------------------------------------------
// GRADES OF THIS YEAR (2017 E.C. / 2024-2025) - GRADE LEVELS & SECTIONS
// -------------------------------------------------------------------------------------------------

export interface SectionSubjectAssignment {
  subjectId: string;
  subjectName: string;
  subjectAmharic: string;
  teacherId: string;
  teacherName: string;
  periodsPerWeek: number;
}

export interface GradeSection {
  id: string;
  grade: number; // 9, 10, 11, 12
  section: string; // '9A', '9B', '10A', '11-Nat-A', etc.
  sectionLetter: string; // 'A', 'B', 'C', 'D'
  stream: 'General Secondary' | 'Natural Science' | 'Social Science';
  streamAmharic: string;
  totalStudents: number;
  maleStudents: number;
  femaleStudents: number;
  homeroomTeacher: {
    id: string;
    name: string;
    nameAmharic: string;
    subject: string;
    phone: string;
    avatar: string;
  };
  studentMonitors: {
    classMonitor: string;
    deputyMonitor: string;
  };
  subjectAssignments: SectionSubjectAssignment[];
  roomNumber: string;
  buildingBlock: string;
  shift: 'Morning Shift (ጧት)' | 'Afternoon Shift (ከሰዓት)';
  attendanceToday: number;
  isDemoAvailable?: boolean;
}


export const CTE_SPECIALIZATION_OPTIONS = [
  { id: 'web-dev', labelEn: 'Web Design and Development', labelAm: 'ድረ-ገጽ ንድፍና ልማት', code: 'WD' },
  { id: 'marketing', labelEn: 'Marketing', labelAm: 'ማርኬቲንግ', code: 'MKT' },
  { id: 'accounting', labelEn: 'Accounting', labelAm: 'አካውንቲንግ', code: 'ACC' },
  { id: 'construction', labelEn: 'Construction', labelAm: 'ኮንስትራክሽን', code: 'CST' }
] as const;

export type CTESpecialization = typeof CTE_SPECIALIZATION_OPTIONS[number]['labelEn'];

// Grade 9 & 10 (11 Subjects): English, Math, Physics, Chemistry, Biology, Geography, History, PE, Citizenship, Amharic, Economics
export const STANDARD_GRADE_9_10_SUBJECTS: SectionSubjectAssignment[] = [
  { subjectId: 'eng', subjectName: 'English Language', subjectAmharic: 'እንግሊዝኛ', teacherId: 't4', teacherName: 'Ato Tesfaye Mengistu', periodsPerWeek: 4 },
  { subjectId: 'math', subjectName: 'Mathematics', subjectAmharic: 'ሒሳብ', teacherId: 't2', teacherName: 'Ato Daniel Girma', periodsPerWeek: 4 },
  { subjectId: 'phys', subjectName: 'Physics', subjectAmharic: 'ፊዚክስ', teacherId: 't1', teacherName: 'W/ro Almaz Kebede', periodsPerWeek: 3 },
  { subjectId: 'chem', subjectName: 'Chemistry', subjectAmharic: 'ኬሚስትሪ', teacherId: 't3', teacherName: 'Ato Birhanu Ayele', periodsPerWeek: 3 },
  { subjectId: 'bio', subjectName: 'Biology', subjectAmharic: 'ባዮሎጂ', teacherId: 't-bio', teacherName: 'W/ro Tigist Hailu', periodsPerWeek: 3 },
  { subjectId: 'geo', subjectName: 'Geography', subjectAmharic: 'ጂኦግራፊ', teacherId: 't-geo', teacherName: 'W/ro Genet Abebe', periodsPerWeek: 3 },
  { subjectId: 'hist', subjectName: 'History', subjectAmharic: 'ታሪክ', teacherId: 't5', teacherName: 'Ato Solomon Kassa', periodsPerWeek: 3 },
  { subjectId: 'pe', subjectName: 'Physical Education (P.E.)', subjectAmharic: 'ስፖርት', teacherId: 't-pe', teacherName: 'Ato Yared Kassahun', periodsPerWeek: 2 },
  { subjectId: 'civ', subjectName: 'Citizenship Education', subjectAmharic: 'ስነ-ዜጋ', teacherId: 't5', teacherName: 'Ato Solomon Kassa', periodsPerWeek: 2 },
  { subjectId: 'amh', subjectName: 'Amharic Language', subjectAmharic: 'አማርኛ', teacherId: 't-amh', teacherName: 'W/ro Aster Molla', periodsPerWeek: 3 },
  { subjectId: 'econ', subjectName: 'Economics', subjectAmharic: 'ኢኮኖሚክስ', teacherId: 't-econ', teacherName: 'Ato Muluneh Desta', periodsPerWeek: 2 }
];

// Grade 11 & 12 Natural Science (9 Subjects): English, Biology, Chemistry, Physics, Math, Amharic, Agriculture, IT, CTE
export const STANDARD_GRADE_11_12_NATURAL_SUBJECTS: SectionSubjectAssignment[] = [
  { subjectId: 'eng', subjectName: 'English Language', subjectAmharic: 'እንግሊዝኛ', teacherId: 't4', teacherName: 'Ato Tesfaye Mengistu', periodsPerWeek: 4 },
  { subjectId: 'bio', subjectName: 'Biology', subjectAmharic: 'ባዮሎጂ', teacherId: 't-bio', teacherName: 'W/ro Tigist Hailu', periodsPerWeek: 4 },
  { subjectId: 'chem', subjectName: 'Chemistry', subjectAmharic: 'ኬሚስትሪ', teacherId: 't3', teacherName: 'Ato Birhanu Ayele', periodsPerWeek: 4 },
  { subjectId: 'phys', subjectName: 'Physics', subjectAmharic: 'ፊዚክስ', teacherId: 't1', teacherName: 'W/ro Almaz Kebede', periodsPerWeek: 4 },
  { subjectId: 'math', subjectName: 'Mathematics', subjectAmharic: 'ሒሳብ', teacherId: 't2', teacherName: 'Ato Daniel Girma', periodsPerWeek: 5 },
  { subjectId: 'amh', subjectName: 'Amharic Language', subjectAmharic: 'አማርኛ', teacherId: 't-amh', teacherName: 'W/ro Aster Molla', periodsPerWeek: 3 },
  { subjectId: 'agri', subjectName: 'Agriculture', subjectAmharic: 'ግብርና', teacherId: 't-agri', teacherName: 'W/ro Selamawit Bekele', periodsPerWeek: 3 },
  { subjectId: 'it', subjectName: 'Information Technology (IT)', subjectAmharic: 'ኢንፎርሜሽን ቴክኖሎጂ', teacherId: 't-ict', teacherName: 'Ato Robel Tilahun', periodsPerWeek: 3 },
  { subjectId: 'cte', subjectName: 'Career & Technical Education (CTE)', subjectAmharic: 'የስራና ቴክኒክ (CTE)', teacherId: 't-cte', teacherName: 'Ato Ermias Haile', periodsPerWeek: 3 }
];

// Grade 11 & 12 Social Science (8 Subjects): English, Math, Geography, History, Economics, IT, Citizenship, CTE
export const STANDARD_GRADE_11_12_SOCIAL_SUBJECTS: SectionSubjectAssignment[] = [
  { subjectId: 'eng', subjectName: 'English Language', subjectAmharic: 'እንግሊዝኛ', teacherId: 't4', teacherName: 'Ato Tesfaye Mengistu', periodsPerWeek: 4 },
  { subjectId: 'math', subjectName: 'Mathematics', subjectAmharic: 'ሒሳብ', teacherId: 't2', teacherName: 'Ato Daniel Girma', periodsPerWeek: 4 },
  { subjectId: 'geo', subjectName: 'Geography', subjectAmharic: 'ጂኦግራፊ', teacherId: 't-geo', teacherName: 'W/ro Genet Abebe', periodsPerWeek: 4 },
  { subjectId: 'hist', subjectName: 'History', subjectAmharic: 'ታሪክ', teacherId: 't5', teacherName: 'Ato Solomon Kassa', periodsPerWeek: 4 },
  { subjectId: 'econ', subjectName: 'Economics', subjectAmharic: 'ኢኮኖሚክስ', teacherId: 't-econ', teacherName: 'Ato Muluneh Desta', periodsPerWeek: 4 },
  { subjectId: 'it', subjectName: 'Information Technology (IT)', subjectAmharic: 'ኢንፎርሜሽን ቴክኖሎጂ', teacherId: 't-ict', teacherName: 'Ato Robel Tilahun', periodsPerWeek: 3 },
  { subjectId: 'civ', subjectName: 'Citizenship Education', subjectAmharic: 'ስነ-ዜጋ', teacherId: 't5', teacherName: 'Ato Solomon Kassa', periodsPerWeek: 3 },
  { subjectId: 'cte', subjectName: 'Career & Technical Education (CTE)', subjectAmharic: 'የስራና ቴክኒክ (CTE)', teacherId: 't-cte', teacherName: 'Ato Ermias Haile', periodsPerWeek: 3 }
];

export const INITIAL_GRADE_SECTIONS: GradeSection[] = [
  // --- GRADE 9 (General Secondary) ---
  {
    id: 'sec-9a',
    grade: 9,
    section: '9A',
    sectionLetter: 'A',
    stream: 'General Secondary',
    streamAmharic: 'አጠቃላይ ሁለተኛ ደረጃ',
    totalStudents: 50,
    maleStudents: 26,
    femaleStudents: 24,
    homeroomTeacher: {
      id: 't2',
      name: 'Ato Daniel Girma',
      nameAmharic: 'አቶ ዳንኤል ግርማ',
      subject: 'Mathematics',
      phone: '+251 91 245 7789',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Ermias Bekele Tadesse (የክፍል አለቃ)',
      deputyMonitor: 'Bethselot Hailemariam (ምክትል አለቃ)'
    },
    subjectAssignments: STANDARD_GRADE_9_10_SUBJECTS,
    roomNumber: 'Room 101',
    buildingBlock: 'Block A (Main Secondary Block)',
    shift: 'Morning Shift (ጧት)',
    attendanceToday: 96.0
  },
  {
    id: 'sec-9b',
    grade: 9,
    section: '9B',
    sectionLetter: 'B',
    stream: 'General Secondary',
    streamAmharic: 'አጠቃላይ ሁለተኛ ደረጃ',
    totalStudents: 48,
    maleStudents: 24,
    femaleStudents: 24,
    homeroomTeacher: {
      id: 't-bio',
      name: 'W/ro Tigist Hailu',
      nameAmharic: 'ወ/ሮ ትዕግስት ኃይሉ',
      subject: 'Biology',
      phone: '+251 91 550 8822',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Abel Tadesse Mengistu',
      deputyMonitor: 'Rahel Girma Kebede'
    },
    subjectAssignments: STANDARD_GRADE_9_10_SUBJECTS,
    roomNumber: 'Room 102',
    buildingBlock: 'Block A (Main Secondary Block)',
    shift: 'Morning Shift (ጧት)',
    attendanceToday: 94.2
  },
  {
    id: 'sec-9c',
    grade: 9,
    section: '9C',
    sectionLetter: 'C',
    stream: 'General Secondary',
    streamAmharic: 'አጠቃላይ ሁለተኛ ደረጃ',
    totalStudents: 52,
    maleStudents: 27,
    femaleStudents: 25,
    homeroomTeacher: {
      id: 't4',
      name: 'Ato Tesfaye Mengistu',
      nameAmharic: 'አቶ ተስፋዬ መንግስቱ',
      subject: 'English Language',
      phone: '+251 92 411 9901',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Yonatan Mamo Worku',
      deputyMonitor: 'Senait Desta Tsegaye'
    },
    subjectAssignments: STANDARD_GRADE_9_10_SUBJECTS,
    roomNumber: 'Room 103',
    buildingBlock: 'Block A (Main Secondary Block)',
    shift: 'Afternoon Shift (ከሰዓት)',
    attendanceToday: 95.5
  },
  {
    id: 'sec-9d',
    grade: 9,
    section: '9D',
    sectionLetter: 'D',
    stream: 'General Secondary',
    streamAmharic: 'አጠቃላይ ሁለተኛ ደረጃ',
    totalStudents: 50,
    maleStudents: 25,
    femaleStudents: 25,
    homeroomTeacher: {
      id: 't-amh',
      name: 'W/ro Aster Molla',
      nameAmharic: 'ወ/ሮ አስቴር ሞላ',
      subject: 'Amharic Literature',
      phone: '+251 91 766 3311',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Eyob Berhanu Wolde',
      deputyMonitor: 'Martha Zewdu Fekadu'
    },
    subjectAssignments: STANDARD_GRADE_9_10_SUBJECTS,
    roomNumber: 'Room 104',
    buildingBlock: 'Block A (Main Secondary Block)',
    shift: 'Afternoon Shift (ከሰዓት)',
    attendanceToday: 93.8
  },

  // --- GRADE 10 (General Secondary) ---
  {
    id: 'sec-10a',
    grade: 10,
    section: '10A',
    sectionLetter: 'A',
    stream: 'General Secondary',
    streamAmharic: 'አጠቃላይ ሁለተኛ ደረጃ',
    totalStudents: 49,
    maleStudents: 25,
    femaleStudents: 24,
    homeroomTeacher: {
      id: 't3',
      name: 'Ato Birhanu Ayele',
      nameAmharic: 'አቶ ብርሃኑ አየለ',
      subject: 'Chemistry',
      phone: '+251 91 300 4455',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Leul Tadesse Bekele',
      deputyMonitor: 'Hiwot Sisay Mengistu'
    },
    subjectAssignments: STANDARD_GRADE_9_10_SUBJECTS,
    roomNumber: 'Room 201',
    buildingBlock: 'Block B (Science & Labs Block)',
    shift: 'Morning Shift (ጧት)',
    attendanceToday: 97.1
  },
  {
    id: 'sec-10b',
    grade: 10,
    section: '10B',
    sectionLetter: 'B',
    stream: 'General Secondary',
    streamAmharic: 'አጠቃላይ ሁለተኛ ደረጃ',
    totalStudents: 51,
    maleStudents: 26,
    femaleStudents: 25,
    homeroomTeacher: {
      id: 't5',
      name: 'Ato Solomon Kassa',
      nameAmharic: 'አቶ ሰለሞን ካሳ',
      subject: 'History & Civics',
      phone: '+251 91 822 3411',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Biruk Girma Tadesse',
      deputyMonitor: 'Mekdes Tamirat Zeleke'
    },
    subjectAssignments: STANDARD_GRADE_9_10_SUBJECTS,
    roomNumber: 'Room 202',
    buildingBlock: 'Block B (Science & Labs Block)',
    shift: 'Morning Shift (ጧት)',
    attendanceToday: 95.8
  },
  {
    id: 'sec-10c',
    grade: 10,
    section: '10C',
    sectionLetter: 'C',
    stream: 'General Secondary',
    streamAmharic: 'አጠቃላይ ሁለተኛ ደረጃ',
    totalStudents: 48,
    maleStudents: 24,
    femaleStudents: 24,
    homeroomTeacher: {
      id: 't-geo',
      name: 'W/ro Genet Abebe',
      nameAmharic: 'ወ/ሮ ገነት አበበ',
      subject: 'Geography',
      phone: '+251 91 990 7711',
      avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Fikadu Hailemariam',
      deputyMonitor: 'Tsion Workneh Assefa'
    },
    subjectAssignments: STANDARD_GRADE_9_10_SUBJECTS,
    roomNumber: 'Room 203',
    buildingBlock: 'Block B (Science & Labs Block)',
    shift: 'Afternoon Shift (ከሰዓት)',
    attendanceToday: 94.6
  },
  {
    id: 'sec-10d',
    grade: 10,
    section: '10D',
    sectionLetter: 'D',
    stream: 'General Secondary',
    streamAmharic: 'አጠቃላይ ሁለተኛ ደረጃ',
    totalStudents: 50,
    maleStudents: 26,
    femaleStudents: 24,
    homeroomTeacher: {
      id: 't-ict',
      name: 'Ato Yohannes Bekele',
      nameAmharic: 'አቶ ዮሐንስ በቀለ',
      subject: 'Information Technology',
      phone: '+251 92 888 1234',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Desta Wolde Michael',
      deputyMonitor: 'Bethlehem Kebede Fikru'
    },
    subjectAssignments: STANDARD_GRADE_9_10_SUBJECTS,
    roomNumber: 'Room 204',
    buildingBlock: 'Block B (Science & Labs Block)',
    shift: 'Afternoon Shift (ከሰዓት)',
    attendanceToday: 96.0
  },

  // --- GRADE 11 (Preparatory Streams) ---
  {
    id: 'sec-11-nat-a',
    grade: 11,
    section: '11-Nat-A',
    sectionLetter: 'A',
    stream: 'Natural Science',
    streamAmharic: 'የተፈጥሮ ሳይንስ',
    totalStudents: 46,
    maleStudents: 24,
    femaleStudents: 22,
    homeroomTeacher: {
      id: 't1',
      name: 'W/ro Almaz Kebede',
      nameAmharic: 'ወ/ሮ አልማዝ ከበደ',
      subject: 'Physics',
      phone: '+251 91 190 2314',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Mikias Assefa Tsegaye',
      deputyMonitor: 'Ruth Solomon Gebre'
    },
    subjectAssignments: STANDARD_GRADE_11_12_NATURAL_SUBJECTS,
    roomNumber: 'Room 301',
    buildingBlock: 'Block C (Preparatory & Pre-College Wing)',
    shift: 'Morning Shift (ጧት)',
    attendanceToday: 98.0
  },
  {
    id: 'sec-11-nat-b',
    grade: 11,
    section: '11-Nat-B',
    sectionLetter: 'B',
    stream: 'Natural Science',
    streamAmharic: 'የተፈጥሮ ሳይንስ',
    totalStudents: 45,
    maleStudents: 23,
    femaleStudents: 22,
    homeroomTeacher: {
      id: 't3',
      name: 'Ato Birhanu Ayele',
      nameAmharic: 'አቶ ብርሃኑ አየለ',
      subject: 'Chemistry',
      phone: '+251 91 300 4455',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Dawit Melaku Sisay',
      deputyMonitor: 'Kalkidan Tesfaye Wolde'
    },
    subjectAssignments: STANDARD_GRADE_11_12_NATURAL_SUBJECTS,
    roomNumber: 'Room 302',
    buildingBlock: 'Block C (Preparatory & Pre-College Wing)',
    shift: 'Morning Shift (ጧት)',
    attendanceToday: 96.8
  },
  {
    id: 'sec-11-soc-a',
    grade: 11,
    section: '11-Soc-A',
    sectionLetter: 'A',
    stream: 'Social Science',
    streamAmharic: 'የማህበራዊ ሳይንስ',
    totalStudents: 47,
    maleStudents: 23,
    femaleStudents: 24,
    homeroomTeacher: {
      id: 't5',
      name: 'Ato Solomon Kassa',
      nameAmharic: 'አቶ ሰለሞን ካሳ',
      subject: 'History & Civics',
      phone: '+251 91 822 3411',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Samuel Tefera Girma',
      deputyMonitor: 'Meron Asrat Kebede'
    },
    subjectAssignments: STANDARD_GRADE_11_12_SOCIAL_SUBJECTS,
    roomNumber: 'Room 101',
    buildingBlock: 'Block D (Humanities & Social Sciences)',
    shift: 'Morning Shift (ጧት)',
    attendanceToday: 95.4
  },
  {
    id: 'sec-11-soc-b',
    grade: 11,
    section: '11-Soc-B',
    sectionLetter: 'B',
    stream: 'Social Science',
    streamAmharic: 'የማህበራዊ ሳይንስ',
    totalStudents: 46,
    maleStudents: 22,
    femaleStudents: 24,
    homeroomTeacher: {
      id: 't-geo',
      name: 'W/ro Genet Abebe',
      nameAmharic: 'ወ/ሮ ገነት አበበ',
      subject: 'Geography & Economics',
      phone: '+251 91 990 7711',
      avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Natnael Degu Worku',
      deputyMonitor: 'Hilina Mengistu Hailu'
    },
    subjectAssignments: STANDARD_GRADE_11_12_SOCIAL_SUBJECTS,
    roomNumber: 'Room 102',
    buildingBlock: 'Block D (Humanities & Social Sciences)',
    shift: 'Afternoon Shift (ከሰዓት)',
    attendanceToday: 94.0
  },

  // --- GRADE 12 (ESSLCE National Exam Candidate Class) ---
  {
    id: 'sec-12-nat-a',
    grade: 12,
    section: '12-Nat-A',
    sectionLetter: 'A',
    stream: 'Natural Science',
    streamAmharic: 'የተፈጥሮ ሳይንስ',
    totalStudents: 44,
    maleStudents: 23,
    femaleStudents: 21,
    homeroomTeacher: {
      id: 't2',
      name: 'Ato Daniel Girma',
      nameAmharic: 'አቶ ዳንኤል ግርማ',
      subject: 'Advanced Mathematics',
      phone: '+251 91 245 7789',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Yohannes Tsegaye Mengistu',
      deputyMonitor: 'Selamawit Tadesse Bekele (School Student President)'
    },
    subjectAssignments: STANDARD_GRADE_11_12_NATURAL_SUBJECTS,
    roomNumber: 'Room 303 (Pre-College Center)',
    buildingBlock: 'Block C (Preparatory & Pre-College Wing)',
    shift: 'Morning Shift (ጧት)',
    attendanceToday: 99.1
  },
  {
    id: 'sec-12-nat-b',
    grade: 12,
    section: '12-Nat-B',
    sectionLetter: 'B',
    stream: 'Natural Science',
    streamAmharic: 'የተፈጥሮ ሳይንስ',
    totalStudents: 45,
    maleStudents: 22,
    femaleStudents: 23,
    homeroomTeacher: {
      id: 't1',
      name: 'W/ro Almaz Kebede',
      nameAmharic: 'ወ/ሮ አልማዝ ከበደ',
      subject: 'Advanced Physics',
      phone: '+251 91 190 2314',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Bereket Abebe Molla',
      deputyMonitor: 'Feven Solomon Desta'
    },
    subjectAssignments: STANDARD_GRADE_11_12_NATURAL_SUBJECTS,
    roomNumber: 'Room 304',
    buildingBlock: 'Block C (Preparatory & Pre-College Wing)',
    shift: 'Morning Shift (ጧት)',
    attendanceToday: 98.4
  },
  {
    id: 'sec-12-soc-a',
    grade: 12,
    section: '12-Soc-A',
    sectionLetter: 'A',
    stream: 'Social Science',
    streamAmharic: 'የማህበራዊ ሳይንስ',
    totalStudents: 46,
    maleStudents: 22,
    femaleStudents: 24,
    homeroomTeacher: {
      id: 't4',
      name: 'Ato Tesfaye Mengistu',
      nameAmharic: 'አቶ ተስፋዬ መንግስቱ',
      subject: 'Advanced English',
      phone: '+251 92 411 9901',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Hailemariam Bekele Girma',
      deputyMonitor: 'Hanna Worku Tadesse'
    },
    subjectAssignments: STANDARD_GRADE_11_12_SOCIAL_SUBJECTS,
    roomNumber: 'Room 201',
    buildingBlock: 'Block D (Humanities & Social Sciences)',
    shift: 'Morning Shift (ጧት)',
    attendanceToday: 97.2
  },
  {
    id: 'sec-12-soc-b',
    grade: 12,
    section: '12-Soc-B',
    sectionLetter: 'B',
    stream: 'Social Science',
    streamAmharic: 'የማህበራዊ ሳይንስ',
    totalStudents: 44,
    maleStudents: 21,
    femaleStudents: 23,
    homeroomTeacher: {
      id: 't-amh',
      name: 'W/ro Aster Molla',
      nameAmharic: 'ወ/ሮ አስቴር ሞላ',
      subject: 'Amharic & Literature',
      phone: '+251 91 766 3311',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80'
    },

    studentMonitors: {
      classMonitor: 'Million Girma Assefa',
      deputyMonitor: 'Tigist Assefa Sisay'
    },
    subjectAssignments: STANDARD_GRADE_11_12_SOCIAL_SUBJECTS,
    roomNumber: 'Room 202',
    buildingBlock: 'Block D (Humanities & Social Sciences)',
    shift: 'Afternoon Shift (ከሰዓት)',
    attendanceToday: 96.5
  }
];
