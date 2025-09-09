import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Calculator, Calendar, MessageSquare, Users, BookOpen } from 'lucide-react';
import { calculateProcessScore, getAttendanceScore, getParticipationScore } from '../utils/gradeCalculations';

const GradeCalculator = ({ student, onClose, onUpdate, canEdit }) => {
  const [formData, setFormData] = useState({
    attendance: { absent: student.attendance.absent },
    participation: { count: student.participation.count },
    groupWork: student.groupWork,
    midterm: student.midterm
  });

  const attendanceScore = getAttendanceScore(formData.attendance.absent);
  const participationScore = getParticipationScore(formData.participation.count);
  const processScore = calculateProcessScore({
    attendance: formData.attendance,
    participation: formData.participation,
    groupWork: formData.groupWork,
    midterm: formData.midterm
  });

  const handleSave = () => {
    onUpdate(student.id, formData);
    onClose();
  };

  const handleChange = (field, value) => {
    if (field === 'absent') {
      setFormData(prev => ({
        ...prev,
        attendance: { absent: Math.max(0, parseInt(value) || 0) }
      }));
    } else if (field === 'participation') {
      setFormData(prev => ({
        ...prev,
        participation: { count: Math.max(0, parseInt(value) || 0) }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: Math.max(0, Math.min(10, parseFloat(value) || 0))
      }));
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6.5) return 'text-blue-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{student.name}</h2>
                <p className="text-slate-600">MSSV: {student.studentId}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-slate-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Attendance Section */}
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="h-5 w-5 text-slate-600" />
              <h3 className="font-semibold text-slate-800">Chuyên cần (10%)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Số buổi vắng
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.attendance.absent}
                  onChange={(e) => handleChange('absent', e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Điểm chuyên cần
                </label>
                <div className={`px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium ${getScoreColor(attendanceScore)}`}>
                  {attendanceScore}/10
                </div>
              </div>
            </div>
          </div>

          {/* Participation Section */}
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <MessageSquare className="h-5 w-5 text-slate-600" />
              <h3 className="font-semibold text-slate-800">Phát biểu (20%)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Số lần phát biểu
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.participation.count}
                  onChange={(e) => handleChange('participation', e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Điểm phát biểu
                </label>
                <div className={`px-3 py-2 bg-white border border-slate-300 rounded-lg font-medium ${getScoreColor(participationScore)}`}>
                  {participationScore}/10
                </div>
              </div>
            </div>
          </div>

          {/* Group Work Section */}
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-5 w-5 text-slate-600" />
              <h3 className="font-semibold text-slate-800">Bài tập nhóm (30%)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Điểm bài tập nhóm (0-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.groupWork}
                  onChange={(e) => handleChange('groupWork', e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Midterm Section */}
          <div className="bg-slate-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="h-5 w-5 text-slate-600" />
              <h3 className="font-semibold text-slate-800">Kiểm tra giữa kỳ (40%)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Điểm giữa kỳ (0-10)
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={formData.midterm}
                  onChange={(e) => handleChange('midterm', e.target.value)}
                  disabled={!canEdit}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Final Score */}
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Kết quả tính điểm</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Chuyên cần (10%):</span>
                <span className="font-medium">{attendanceScore} × 0.1 = {(attendanceScore * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Phát biểu (20%):</span>
                <span className="font-medium">{participationScore} × 0.2 = {(participationScore * 0.2).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Bài tập nhóm (30%):</span>
                <span className="font-medium">{formData.groupWork} × 0.3 = {(formData.groupWork * 0.3).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Giữa kỳ (40%):</span>
                <span className="font-medium">{formData.midterm} × 0.4 = {(formData.midterm * 0.4).toFixed(2)}</span>
              </div>
              <div className="border-t border-teal-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Điểm quá trình:</span>
                  <span className={`font-bold text-2xl ${getScoreColor(processScore)}`}>
                    {processScore.toFixed(2)}/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="p-6 border-t border-slate-200">
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all font-medium"
              >
                <Save className="h-4 w-4" />
                <span>Lưu thay đổi</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
              >
                Hủy
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GradeCalculator;
