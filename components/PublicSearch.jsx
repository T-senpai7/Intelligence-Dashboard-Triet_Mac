import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, User, Users, Award, Calendar, MessageSquare, BookOpen, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PublicSearch = () => {
  const { students, groups } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  const getGradeColor = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 8.5) return 'text-green-600 bg-green-100';
    if (numScore >= 7.0) return 'text-blue-600 bg-blue-100';
    if (numScore >= 5.5) return 'text-yellow-600 bg-yellow-100';
    if (numScore >= 4.0) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getGradeLabel = (score) => {
    const numScore = parseFloat(score);
    if (numScore >= 8.5) return 'Xuất sắc';
    if (numScore >= 7.0) return 'Giỏi';
    if (numScore >= 5.5) return 'Khá';
    if (numScore >= 4.0) return 'Trung bình';
    return 'Yếu';
  };

  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      setIsSearching(true);
      
      // Simulate search delay for better UX
      const searchTimeout = setTimeout(() => {
        const results = students.filter(student =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(searchTimeout);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchTerm, students]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-3 font-nunito">
          Tra cứu thông tin sinh viên
        </h1>
        <p className="text-slate-600 font-source-sans max-w-2xl mx-auto">
          Nhập tên hoặc mã số sinh viên để tra cứu thông tin điểm quá trình. 
          Không cần đăng nhập để xem thông tin cơ bản.
        </p>
      </motion.div>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 mb-8"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Nhập tên sinh viên hoặc mã số sinh viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg font-source-sans"
          />
        </div>
        
        {searchTerm.trim().length > 0 && searchTerm.trim().length < 2 && (
          <p className="text-sm text-slate-500 mt-2 font-source-sans">
            Vui lòng nhập ít nhất 2 ký tự để tìm kiếm
          </p>
        )}
      </motion.div>

      {/* Search Results */}
      {isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center space-x-2 text-slate-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
            <span className="font-source-sans">Đang tìm kiếm...</span>
          </div>
        </motion.div>
      )}

      {!isSearching && searchTerm.trim().length >= 2 && searchResults.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white rounded-xl shadow-lg border border-slate-200"
        >
          <User className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2 font-nunito">
            Không tìm thấy sinh viên
          </h3>
          <p className="text-slate-500 font-source-sans">
            Không có sinh viên nào phù hợp với từ khóa "{searchTerm}"
          </p>
        </motion.div>
      )}

      {!isSearching && searchResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-4 font-nunito">
            Kết quả tìm kiếm ({searchResults.length} sinh viên)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.map((student, index) => {
              const processScore = calculateProcessScore(student);
              const gradeColor = getGradeColor(processScore);
              const gradeLabel = getGradeLabel(processScore);
              
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-800 font-nunito">
                        {student.name}
                      </h3>
                      <p className="text-slate-600 font-source-sans">{student.studentId}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Users className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-600 font-source-sans">
                          Nhóm {student.groupName}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${gradeColor}`}>
                        {processScore}/10
                      </div>
                      <p className="text-xs text-slate-500 mt-1 font-source-sans">{gradeLabel}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600 font-source-sans">
                        Vắng: {student.attendance.absent} buổi
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600 font-source-sans">
                        Phát biểu: {student.participation.count} lần
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600 font-source-sans">
                        Nhóm: {student.groupWork}/10
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600 font-source-sans">
                        Giữa kỳ: {student.midterm}/10
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 font-source-sans">
                        Điểm quá trình
                      </span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-teal-600 font-nunito">
                          {processScore}/10
                        </span>
                        <Eye className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedStudent(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 font-nunito">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-slate-600 font-source-sans">{selectedStudent.studentId}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600 font-source-sans">
                      Nhóm {selectedStudent.groupName}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Process Score */}
                <div className="bg-gradient-to-r from-teal-50 to-mint-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 font-nunito">
                        Điểm quá trình
                      </h3>
                      <p className="text-sm text-slate-600 font-source-sans">
                        {getGradeLabel(calculateProcessScore(selectedStudent))}
                      </p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg text-xl font-bold ${getGradeColor(calculateProcessScore(selectedStudent))}`}>
                      {calculateProcessScore(selectedStudent)}/10
                    </div>
                  </div>
                </div>
                
                {/* Detailed Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-5 w-5 text-slate-500" />
                      <h4 className="font-semibold text-slate-700 font-nunito">Chuyên cần (10%)</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-2 font-source-sans">
                      Vắng: {selectedStudent.attendance.absent} buổi
                    </p>
                    <div className="text-lg font-bold text-slate-800 font-nunito">
                      {selectedStudent.attendance.absent === 0 ? 10 :
                       selectedStudent.attendance.absent === 1 ? 8 :
                       selectedStudent.attendance.absent === 2 ? 6 : 0}/10
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <MessageSquare className="h-5 w-5 text-slate-500" />
                      <h4 className="font-semibold text-slate-700 font-nunito">Phát biểu (20%)</h4>
                    </div>
                    <p className="text-sm text-slate-600 mb-2 font-source-sans">
                      Số lần: {selectedStudent.participation.count} lần
                    </p>
                    <div className="text-lg font-bold text-slate-800 font-nunito">
                      {Math.min(selectedStudent.participation.count * 4, 10)}/10
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-5 w-5 text-slate-500" />
                      <h4 className="font-semibold text-slate-700 font-nunito">Bài tập nhóm (30%)</h4>
                    </div>
                    <div className="text-lg font-bold text-slate-800 font-nunito">
                      {selectedStudent.groupWork}/10
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="h-5 w-5 text-slate-500" />
                      <h4 className="font-semibold text-slate-700 font-nunito">Giữa kỳ (40%)</h4>
                    </div>
                    <div className="text-lg font-bold text-slate-800 font-nunito">
                      {selectedStudent.midterm}/10
                    </div>
                  </div>
                </div>
                
                {/* Calculation Formula */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-700 mb-2 font-nunito">Công thức tính điểm</h4>
                  <p className="text-sm text-slate-600 font-source-sans">
                    Điểm quá trình = (Chuyên cần × 10%) + (Phát biểu × 20%) + (Bài tập nhóm × 30%) + (Giữa kỳ × 40%)
                  </p>
                  <p className="text-sm text-slate-600 mt-2 font-source-sans">
                    = ({selectedStudent.attendance.absent === 0 ? 10 :
                        selectedStudent.attendance.absent === 1 ? 8 :
                        selectedStudent.attendance.absent === 2 ? 6 : 0} × 0.1) + 
                    ({Math.min(selectedStudent.participation.count * 4, 10)} × 0.2) + 
                    ({selectedStudent.groupWork} × 0.3) + 
                    ({selectedStudent.midterm} × 0.4) = {calculateProcessScore(selectedStudent)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Empty State */}
      {searchTerm.trim().length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-xl shadow-lg border border-slate-200"
        >
          <Search className="h-20 w-20 text-slate-300 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-slate-600 mb-3 font-nunito">
            Bắt đầu tìm kiếm
          </h3>
          <p className="text-slate-500 max-w-md mx-auto font-source-sans">
            Nhập tên hoặc mã số sinh viên vào ô tìm kiếm phía trên để xem thông tin điểm quá trình
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PublicSearch;
