import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Users, BookOpen, UserCheck, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, students, groups } = useAuth();

  const totalStudents = students.length;
  const totalGroups = Object.values(groups).filter(group => group.length > 0).length;
  const studentsInGroups = Object.values(groups).reduce((sum, group) => sum + group.length, 0);
  
  const getDashboardContent = () => {
    if (!user) {
      return {
        title: 'Hệ thống quản lý nhóm sinh viên',
        subtitle: 'Xem thông tin các nhóm và sinh viên',
        showAddButton: false
      };
    }

    switch (user.role) {
      case 'teacher':
        return {
          title: `Chào mừng ${user.name}`,
          subtitle: 'Quản lý tất cả các nhóm và sinh viên',
          showAddButton: true
        };
      case 'group_leader':
        return {
          title: `Chào mừng ${user.name}`,
          subtitle: `Quản lý nhóm ${user.groupName}`,
          showAddButton: true
        };
      default:
        return {
          title: `Chào mừng ${user.name}`,
          subtitle: 'Quản lý hệ thống',
          showAddButton: true
        };
    }
  };

  const content = getDashboardContent();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800 mb-2 font-nunito">
          {content.title}
        </h1>
        <p className="text-slate-600 font-source-sans">
          {content.subtitle}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              <p className="text-sm font-medium text-slate-600 font-source-sans">Đã phân nhóm</p>
              <p className="text-2xl font-bold text-slate-800 font-nunito">{studentsInGroups}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
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
              <p className="text-sm font-medium text-slate-600 font-source-sans">Trung bình/nhóm</p>
              <p className="text-2xl font-bold text-slate-800 font-nunito">
                {totalGroups > 0 ? Math.round(studentsInGroups / totalGroups) : 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            to="/groups"
            className="block bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-teal-500 to-mint-500 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 font-nunito">Quản lý nhóm</h3>
                <p className="text-slate-600 font-source-sans">Xem và quản lý các nhóm sinh viên</p>
              </div>
            </div>
          </Link>
        </motion.div>

        {user?.role === 'group_leader' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/group-leader"
              className="block bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg group-hover:scale-110 transition-transform">
                  <UserCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 font-nunito">Nhóm của tôi</h3>
                  <p className="text-slate-600 font-source-sans">Quản lý nhóm {user.groupName}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {user?.role === 'teacher' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link
              to="/teacher"
              className="block bg-white p-6 rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition-all group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 font-nunito">Bảng điều khiển GV</h3>
                  <p className="text-slate-600 font-source-sans">Quản lý toàn bộ hệ thống</p>
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Empty State */}
      {totalStudents === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-white rounded-xl shadow-lg border border-slate-200"
        >
          <Users className="h-20 w-20 text-slate-300 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-slate-600 mb-3 font-nunito">
            Chưa có sinh viên nào
          </h3>
          <p className="text-slate-500 mb-6 font-source-sans">
            Hệ thống đang trống. {user ? 'Bắt đầu thêm sinh viên vào các nhóm.' : 'Đăng nhập để thêm sinh viên.'}
          </p>
          {!user && (
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-mint-600 text-white rounded-lg hover:from-teal-700 hover:to-mint-700 transition-all font-medium font-source-sans"
            >
              Đăng nhập
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
