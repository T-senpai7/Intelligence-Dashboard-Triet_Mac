import React from 'react';
import { motion } from 'framer-motion';
import { Users, User, ChevronDown, ChevronUp, Plus } from 'lucide-react';

const GroupCard = ({ groupName, members, showDetails, canEdit, onClick }) => {
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

  const averageScore = members.length > 0 
    ? (members.reduce((sum, member) => sum + parseFloat(calculateProcessScore(member)), 0) / members.length).toFixed(1)
    : '0.0';

  const getGroupColor = (name) => {
    const colors = {
      'A': 'from-red-500 to-pink-500',
      'B': 'from-orange-500 to-yellow-500',
      'C': 'from-yellow-500 to-green-500',
      'D': 'from-green-500 to-teal-500',
      'E': 'from-teal-500 to-cyan-500',
      'F': 'from-cyan-500 to-blue-500',
      'G': 'from-blue-500 to-indigo-500',
      'H': 'from-indigo-500 to-purple-500',
      'I': 'from-purple-500 to-pink-500',
      'J': 'from-pink-500 to-red-500',
      'K': 'from-emerald-500 to-teal-500',
      'L': 'from-amber-500 to-orange-500',
      'M': 'from-violet-500 to-purple-500',
      'N': 'from-rose-500 to-pink-500',
      'O': 'from-slate-500 to-gray-500'
    };
    return colors[name] || 'from-gray-500 to-slate-500';
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${getGroupColor(groupName)} p-4`}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold font-nunito">{groupName}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold font-nunito">Nhóm {groupName}</h3>
              <p className="text-sm opacity-90 font-source-sans">{members.length} thành viên</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90 font-source-sans">Điểm TB</p>
            <p className="text-xl font-bold font-nunito">{averageScore}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-slate-600">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium font-source-sans">Danh sách thành viên</span>
          </div>
          <div className="flex items-center space-x-2">
            {canEdit && (
              <button className="p-1 text-slate-400 hover:text-teal-600 transition-colors">
                <Plus className="h-4 w-4" />
              </button>
            )}
            {showDetails ? (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            )}
          </div>
        </div>

        {showDetails && members.length > 0 ? (
          <div className="space-y-3">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-mint-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 font-source-sans">{member.name}</p>
                    <p className="text-sm text-slate-500 font-source-sans">{member.studentId}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800 font-nunito">
                    {calculateProcessScore(member)}
                  </p>
                  <p className="text-xs text-slate-500 font-source-sans">điểm</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : !showDetails && members.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {members.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-full"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-mint-500 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-slate-700 font-source-sans">{member.name}</span>
              </div>
            ))}
            {members.length > 3 && (
              <div className="flex items-center px-3 py-1 bg-slate-200 rounded-full">
                <span className="text-sm text-slate-600 font-source-sans">+{members.length - 3} khác</span>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4">
            <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500 font-source-sans">Chưa có thành viên</p>
            {canEdit && (
              <p className="text-xs text-slate-400 mt-1 font-source-sans">Nhấn để thêm thành viên</p>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-slate-800 font-nunito">{members.length}</p>
              <p className="text-xs text-slate-500 font-source-sans">Thành viên</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-800 font-nunito">{averageScore}</p>
              <p className="text-xs text-slate-500 font-source-sans">Điểm TB</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GroupCard;
