// Mock data for student group management system

export const groupLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

// Mock user accounts - 15 admin accounts (A-O) + 1 teacher
export const mockUsers = [
  // Teacher account
  {
    username: 'teacher',
    password: 'teacher123',
    name: 'Giáo viên Nguyễn Văn Giáo',
    role: 'teacher'
  },
  
  // Admin accounts for each group (A-O)
  ...groupLabels.map(label => ({
    username: `admin_${label.toLowerCase()}`,
    password: '123',
    name: `Nhóm trưởng ${label}`,
    role: 'group_leader',
    groupName: label
  }))
];

// Empty students array - system starts with no students
export const mockStudents = [];

// Sample class information
export const mockClassInfo = {
  className: 'Lớp Tin học Ứng dụng',
  classCode: 'THUD2021',
  semester: 'Học kỳ I - 2023-2024',
  instructor: 'TS. Nguyễn Văn Giáo',
  totalSessions: 15,
  currentSession: 12
};

// Grade calculation weights
export const gradeWeights = {
  attendance: 0.1,    // 10%
  participation: 0.2, // 20%
  groupWork: 0.3,     // 30%
  midterm: 0.4        // 40%
};

// Attendance scoring rules
export const attendanceScoring = {
  0: 10, // 0 absences = 10 points
  1: 8,  // 1 absence = 8 points
  2: 6,  // 2 absences = 6 points
  3: 0   // 3+ absences = 0 points
};

// Participation scoring rules
export const participationScoring = {
  pointsPerParticipation: 4,
  maxPoints: 10
};

// Helper function to calculate attendance score
export const calculateAttendanceScore = (absentCount) => {
  if (absentCount >= 3) return 0;
  return attendanceScoring[absentCount] || 0;
};

// Helper function to calculate participation score
export const calculateParticipationScore = (participationCount) => {
  return Math.min(participationCount * participationScoring.pointsPerParticipation, participationScoring.maxPoints);
};

// Helper function to calculate total process score
export const calculateProcessScore = (student) => {
  const attendanceScore = calculateAttendanceScore(student.attendance.absent);
  const participationScore = calculateParticipationScore(student.participation.count);
  
  return (
    (attendanceScore * gradeWeights.attendance) +
    (participationScore * gradeWeights.participation) +
    (student.groupWork * gradeWeights.groupWork) +
    (student.midterm * gradeWeights.midterm)
  );
};
