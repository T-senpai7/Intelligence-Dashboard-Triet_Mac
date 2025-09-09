import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Users, BookOpen, Award, TrendingUp, Edit, Trash2, Plus } from 'lucide-react';
import StudentForm from './StudentForm';
import ExcelExport from './ExcelExport';
import RealTimeUpdater from './RealTimeUpdater';
import { groupLabels } from '../utils/mockData';

const TeacherDashboard = () => {
  const { groups, students, updateStudentInGroup, deleteStudent, addStudentToGroup } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [realTimeData, setRealTimeData] = useState(null);

  const calculateProcessScore = (student) => {
    const attendanceScore = student.attendance.absent === 0 ? 10 :
                          student.attendance.absent === 1 ? 8 :
                          student.attendance.absent === 2 ? 6 : 0;

    const participationScore = Math.min(student.participation.count * 4, 10);

    return (
      (attendanceScore * 0.1) +
      (participationScore * 0.2) +
      (student.groupWork * 0.3) +
      (student.midterm * 0.4)
    ).toFixed(1);
  };

  const handleAddStudent = (studentData) => {
    addStudentToGroup(selectedGroup, studentData);
    setShowAddForm(false);
  };

  const handleUpdateStudent = (studentData) => {
    updateStudentInGroup(editingStudent.id, studentData);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      deleteStudent(studentId);
    }
  };

  const handleRealTimeUpdate = (data) => {
    setRealTimeData(data);
    // You can add additional logic here for handling real-time updates
    console.log('Real-time update received:', data);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.includes(searchTerm)
  );

  const totalStudents = students.length;
  const totalGroups = Object.values(groups).filter(group => group.length > 0).length;
  const averageScore = totalStudents > 0
    ? (students.reduce((sum, student) => sum + parseFloat(calculateProcessScore(student)), 0) / totalStudents).toFixed(1)
    : '0.0';
  const passedStudents = students.filter(student => parseFloat(calculateProcessScore(student)) >= 5).length;

  const selectedGroupStudents = groups[selectedGroup] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-2 font-nunito">
          Bảng điều khiển giáo viên
        </h1>
        <p className="text-slate-600 font-source-sans">
          Quản lý toàn bộ hệ thống và tất cả các nhóm sinh viên
        </p>
      </motion.div>

      {/* Real-time Status */}
      <div className="mb-8">
        <RealTimeUpdater onDataUpdate={handleRealTimeUpdate} />
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 font-source-sans">Tổng sinh viên</p>
              <p className="text-2xl font-bold text-slate-800 font-nunito">{totalStudents}</p>
            </div>
            <div className="p-3 bg-teal-100 rounded-lg">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 font-source-sans">Nhóm hoạt động</p>
              <p className="text-2xl font-bold text-slate-800 font-nunito">{totalGroups}</p>
            </div>
            <div className="p-3 bg-mint-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-mint-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 font-source-sans">Điểm TB chung</p>
              <p className="text-2xl font-bold text-slate-800 font-nunito">{averageScore}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg border border-slate-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 font-source-sans">Đạt yêu cầu</p>
              <p className="text-2xl font-bold text-slate-800 font-nunito">{passedStudents}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Group Selection and Controls */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 font-nunito mb-2">Quản lý theo nhóm</h2>
            <p className="text-slate-600 font-source-sans">Chọn nhóm để xem và chỉnh sửa thông tin sinh viên</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm sinh viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent font-source-sans"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-teal-600 to-mint-600 text-white rounded-lg hover:from-teal-700 hover:to-mint-700 transition-all font-medium font-source-sans"
            >
              <Plus className="h-5 w-5" />
              <span>Thêm sinh viên</span>
            </motion.button>
            <ExcelExport
              groups={groups}
              students={students}
              selectedGroup={selectedGroup}
            />
          </div>
        </div>

        {/* Group Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {groupLabels.map((groupName) => {
            const groupSize = groups[groupName]?.length || 0;
            return (
              <button
                key={groupName}
                onClick={() => setSelectedGroup(groupName)}
                className={`px-4 py-2 rounded-lg font-medium transition-all font-source-sans ${
                  selectedGroup === groupName
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Nhóm {groupName} ({groupSize})
              </button>
            );
          })}
        </div>

        {/* Selected Group Students */}
        <div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 font-nunito">
            Nhóm {selectedGroup} - {selectedGroupStudents.length} thành viên
          </h3>

          {selectedGroupStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedGroupStudents.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-50 p-4 rounded-lg border border-slate-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-800 font-nunito">{student.name}</h4>
                      <p className="text-sm text-slate-600 font-source-sans">{student.studentId}</p>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingStudent(student)}
                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-source-sans">Vắng:</span>
                      <span className="font-medium font-source-sans">{student.attendance.absent} buổi</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-source-sans">Phát biểu:</span>
                      <span className="font-medium font-source-sans">{student.participation.count} lần</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-source-sans">Nhóm:</span>
                      <span className="font-medium font-source-sans">{student.groupWork}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-source-sans">Giữa kỳ:</span>
                      <span className="font-medium font-source-sans">{student.midterm}/10</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700 font-source-sans">Quá trình:</span>
                        <span className="font-bold text-teal-600 font-nunito">
                          {calculateProcessScore(student)}/10
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-source-sans">Nhóm {selectedGroup} chưa có thành viên</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Student Form */}
      {(showAddForm || editingStudent) && (
        <StudentForm
          student={editingStudent}
          onSubmit={editingStudent ? handleUpdateStudent : handleAddStudent}
          onClose={() => {
            setShowAddForm(false);
            setEditingStudent(null);
          }}
          title={editingStudent ? 'Chỉnh sửa thông tin sinh viên' : 'Thêm sinh viên mới'}
          selectedGroup={selectedGroup}
          showGroupSelection={!editingStudent}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
