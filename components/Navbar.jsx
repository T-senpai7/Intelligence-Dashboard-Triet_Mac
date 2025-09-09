import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Users, Home, BookOpen, User, LogOut, Menu, X, UserCheck, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/groups', label: 'Quản lý nhóm', icon: Users },
    { path: '/search', label: 'Tra cứu công khai', icon: Search }
  ];

  // Add role-specific navigation items
  if (user?.role === 'group_leader') {
    navItems.push({ path: '/group-leader', label: 'Nhóm của tôi', icon: UserCheck });
  }

  if (user?.role === 'teacher') {
    navItems.push({ path: '/teacher', label: 'Bảng điều khiển GV', icon: BookOpen });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-slate-200 fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-mint-600 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 font-nunito">GroupManager</h1>
              <p className="text-xs text-slate-600 font-source-sans">Quản lý nhóm sinh viên</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all font-medium font-source-sans ${
                    isActive(item.path)
                      ? 'bg-teal-100 text-teal-700'
                      : 'text-slate-600 hover:text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800 font-source-sans">{user.name}</p>
                  <p className="text-xs text-slate-600 font-source-sans">
                    {user.role === 'teacher' ? 'Giáo viên' :
                     user.role === 'group_leader' ? `Nhóm trưởng ${user.groupName}` :
                     'Quản trị viên'}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all font-medium font-source-sans"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </motion.button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-mint-600 text-white rounded-lg hover:from-teal-700 hover:to-mint-700 transition-all font-medium font-source-sans"
              >
                <User className="h-4 w-4" />
                <span>Đăng nhập</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white border-t border-slate-200 shadow-lg"
        >
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all font-medium font-source-sans ${
                    isActive(item.path)
                      ? 'bg-teal-100 text-teal-700'
                      : 'text-slate-600 hover:text-teal-600 hover:bg-teal-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="border-t border-slate-200 pt-3 mt-3">
              {user ? (
                <div className="space-y-3">
                  <div className="px-3 py-2">
                    <p className="font-medium text-slate-800 font-source-sans">{user.name}</p>
                    <p className="text-sm text-slate-600 font-source-sans">
                      {user.role === 'teacher' ? 'Giáo viên' :
                       user.role === 'group_leader' ? `Nhóm trưởng ${user.groupName}` :
                       'Quản trị viên'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-3 py-3 w-full text-left text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all font-medium font-source-sans"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 bg-gradient-to-r from-teal-600 to-mint-600 text-white rounded-lg hover:from-teal-700 hover:to-mint-700 transition-all font-medium font-source-sans"
                >
                  <User className="h-5 w-5" />
                  <span>Đăng nhập</span>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
