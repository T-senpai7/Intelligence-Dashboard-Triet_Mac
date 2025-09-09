// Grade calculation utilities for Vietnamese academic system

// Calculate attendance score based on absent days
export const getAttendanceScore = (absentDays) => {
  if (absentDays === 0) return 10;
  if (absentDays === 1) return 8;
  if (absentDays === 2) return 6;
  return 0; // 3 or more absent days
};

// Calculate participation score based on speaking count
export const getParticipationScore = (speakingCount) => {
  const score = speakingCount * 4;
  return Math.min(score, 10); // Maximum 10 points
};

// Calculate final process score with weighted components
export const calculateProcessScore = (student) => {
  const attendanceScore = getAttendanceScore(student.attendance.absent);
  const participationScore = getParticipationScore(student.participation.count);
  const groupWorkScore = student.groupWork || 0;
  const midtermScore = student.midterm || 0;

  // Weighted calculation: Attendance(10%) + Participation(20%) + GroupWork(30%) + Midterm(40%)
  const processScore = (
    (attendanceScore * 0.1) +
    (participationScore * 0.2) +
    (groupWorkScore * 0.3) +
    (midtermScore * 0.4)
  );

  return Math.min(processScore, 10); // Ensure maximum is 10
};

// Get grade classification based on score
export const getGradeClassification = (score) => {
  if (score >= 8.5) return { label: 'Xuất sắc', color: 'green' };
  if (score >= 8.0) return { label: 'Giỏi', color: 'green' };
  if (score >= 6.5) return { label: 'Khá', color: 'blue' };
  if (score >= 5.0) return { label: 'Trung bình', color: 'yellow' };
  if (score >= 4.0) return { label: 'Yếu', color: 'orange' };
  return { label: 'Kém', color: 'red' };
};

// Validate score input
export const validateScore = (score, min = 0, max = 10) => {
  const numScore = parseFloat(score);
  if (isNaN(numScore)) return min;
  return Math.max(min, Math.min(max, numScore));
};

// Calculate class statistics
export const calculateClassStats = (students) => {
  if (students.length === 0) {
    return {
      totalStudents: 0,
      averageScore: 0,
      passedStudents: 0,
      passRate: 0,
      gradeDistribution: {
        excellent: 0,
        good: 0,
        fair: 0,
        average: 0,
        weak: 0,
        poor: 0
      }
    };
  }

  const scores = students.map(student => calculateProcessScore(student));
  const totalScore = scores.reduce((sum, score) => sum + score, 0);
  const passedCount = scores.filter(score => score >= 5.0).length;

  const gradeDistribution = {
    excellent: scores.filter(score => score >= 8.5).length,
    good: scores.filter(score => score >= 8.0 && score < 8.5).length,
    fair: scores.filter(score => score >= 6.5 && score < 8.0).length,
    average: scores.filter(score => score >= 5.0 && score < 6.5).length,
    weak: scores.filter(score => score >= 4.0 && score < 5.0).length,
    poor: scores.filter(score => score < 4.0).length
  };

  return {
    totalStudents: students.length,
    averageScore: totalScore / students.length,
    passedStudents: passedCount,
    passRate: (passedCount / students.length) * 100,
    gradeDistribution
  };
};
