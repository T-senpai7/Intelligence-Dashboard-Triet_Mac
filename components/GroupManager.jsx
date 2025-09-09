import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, EyeOff, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GroupCard from './GroupCard';
import { groupLabels } from '../utils/mockData';

const GroupManager = () => {
  const { groups, user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const totalGroups = Object.values(groups).filter(group => group.length > 0).length;
  const totalStudents = Object.values(groups).reduce((sum, group) => sum + group.length, 0);
  const averagePerGroup = totalGroups > 0 ? (totalStudents / totalGroups).toFixed(1) : 0;

  const getVisibleGroups = () => {
    if (user?.role === 'group_leader') {
      // Group leaders only see their own group
      return [user.groupName];
    }
    // Teachers and admins see all groups
    return groupLabels;
  };

  const visibleGroups = getVisibleGroups();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-2 font-nunito">
          Quản lý nhóm sinh viên
        </h1>
        <p className="text-slate-600 font-source-sans">
          {user?.role === 'group_leader' 
            ? `Quản lý nhóm ${user.groupName} của bạn`
            : 'Xem và quản lý tất cả các nhóm từ A đến O'
          }
        </p>
      </motion.div>

      {/* Stats */}
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
              <p className="text-sm font-medium text-slate-600 font-source-sans">Số nhóm hoạt động</p>
              <p className="text-2xl font-bold text-slate-800 font-nunito">{totalGroups}</p>
            </div>
            <div className="p-3 bg-mint-100 rounded-lg">
              <Users className="h-6 w-6 text-mint-600" />
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
              <p className="text-sm font-medium text-slate-600 font-source-sans">Trung bình/nhóm</p>
              <p className="text-2xl font-bold text-slate-800 font-nunito">{averagePerGroup}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
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
              <p className="text-sm font-medium text-slate-600 font-source-sans">Nhóm trống</p>
              <p className="text-2xl font-bold text-slate-800 font-nunito">{15 - totalGroups}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-mint-600 text-white rounded-lg hover:from-teal-700 hover:to-mint-700 transition-all font-medium font-source-sans"
          >
            {showDetails ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            <span>{showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}</span>
          </motion.button>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleGroups.map((groupName, index) => {
          const groupMembers = groups[groupName] || [];
          
          return (
            <motion.div
              key={groupName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GroupCard
                groupName={groupName}
                members={groupMembers}
                showDetails={showDetails}
                canEdit={user && (user.role === 'teacher' || user.role === 'admin' || 
                  (user.role === 'group_leader' && user.groupName === groupName))}
                onClick={() => setSelectedGroup(groupName)}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {totalStudents === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-xl shadow-lg border border-slate-200 mt-8"
        >
          <Users className="h-20 w-20 text-slate-300 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-slate-600 mb-3 font-nunito">
            Chưa có sinh viên nào trong hệ thống
          </h3>
          <p className="text-slate-500 mb-6 font-source-sans">
            {user?.role === 'group_leader' 
              ? `Bắt đầu thêm sinh viên vào nhóm ${user.groupName} của bạn`
              : 'Các nhóm trưởng có thể bắt đầu thêm thành viên vào nhóm của mình'
            }
          </p>
          {user?.role === 'group_leader' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-mint-600 text-white rounded-lg hover:from-teal-700 hover:to-mint-700 transition-all font-medium font-source-sans"
            >
              <Plus className="h-5 w-5" />
              <span>Thêm sinh viên</span>
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default GroupManager;
