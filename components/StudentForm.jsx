import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../App';
import GradeCalculator from './GradeCalculator';
import { User, Edit, Eye, Calendar, MessageSquare, Users, BookOpen } from 'lucide-react';
import { calculateProcessScore, getAttendanceScore, getParticipationScore } from '../utils/gradeCalculations';

const StudentCard = ({ student, canEdit }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { updateStudent } = useAuth();

  const processScore = calculateProcessScore(student);
  const attendanceScore = getAttendanceScore(student.attendance.absent);
  const participationScore = getParticipationScore(student.participation.count);

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6.5) return 'text-blue-600 bg-blue-100';
    if (score >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Giỏi';
    if (score >= 6.5) return 'Khá';
    if (score >= 5) return 'Trung bình';
    return 'Yếu';
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 text-lg">{student.name}</h3>
                <p className="text-sm text-slate-500">MSSV: {student.studentId}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(processScore)}`}>
              {processScore.toFixed(1)} - {getScoreLabel(processScore)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600">Vắng: {student.attendance.absent} buổi</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <MessageSquare className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600">Phát biểu: {student.participation.count} lần</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Users className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600">Nhóm: {student.groupWork}/10</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <BookOpen className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600">Giữa kỳ: {student.midterm}/10</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDetails(true)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span className="text-sm font-medium">Chi tiết</span>
            </motion.button>
            
            {canEdit && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDetails(true)}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all"
              >
                <Edit className="h-4 w-4" />
                <span className="text-sm font-medium">Sửa</span>
              </motion.button>
            )}
          </div>
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-600">Điểm quá trình:</span>
            <span className={`font-bold ${getScoreColor(processScore).split(' ')[0]}`}>
              {processScore.toFixed(2)}/10
            </span>
          </div>
        </div>
      </motion.div>

      {showDetails && (
        <GradeCalculator
          student={student}
          onClose={() => setShowDetails(false)}
          onUpdate={updateStudent}
          canEdit={canEdit}
        />
      )}
    </>
  );
};

export default StudentCard;
