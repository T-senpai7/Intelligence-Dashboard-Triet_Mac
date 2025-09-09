import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../App';
import { X, Plus, User } from 'lucide-react';

const AddStudentForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: ''
  });
  const [error, setError] = useState('');
  const { addStudent, students } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên sinh viên');
      return;
    }
    if (!formData.studentId.trim()) {
      setError('Vui lòng nhập mã số sinh viên');
      return;
    }

    // Check for duplicate student ID
    if (students.some(student => student.studentId === formData.studentId)) {
      setError('Mã số sinh viên đã tồn tại');
      return;
    }

    addStudent({
      name: formData.name.trim(),
      studentId: formData.studentId.trim()
    });

    onClose();
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
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
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Thêm sinh viên mới</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-slate-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tên sinh viên *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                placeholder="Nhập tên sinh viên"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mã số sinh viên *
            </label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              placeholder="Ví dụ: 2021001"
              required
            />
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-medium text-slate-800 mb-2">Thông tin mặc định</h3>
            <div className="text-sm text-slate-600 space-y-1">
              <p>• Số buổi vắng: 0</p>
              <p>• Số lần phát biểu: 0</p>
              <p>• Điểm bài tập nhóm: 0</p>
              <p>• Điểm kiểm tra giữa kỳ: 0</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Bạn có thể cập nhật các điểm số sau khi thêm sinh viên
            </p>
          </div>

          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all font-medium"
            >
              <Plus className="h-4 w-4" />
              <span>Thêm sinh viên</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
            >
              Hủy
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddStudentForm;
