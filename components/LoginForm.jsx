import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const success = login(formData);
      if (success) {
        navigate('/');
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto h-16 w-16 bg-gradient-to-r from-teal-600 to-mint-600 rounded-full flex items-center justify-center mb-4"
          >
            <User className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2 font-nunito">Đăng nhập</h2>
          <p className="text-slate-600 font-source-sans">Truy cập hệ thống quản lý nhóm sinh viên</p>
        </div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-slate-200"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2"
            >
              <AlertCircle className="h-4 w-4" />
              <span className="font-source-sans">{error}</span>
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 font-source-sans">
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-source-sans"
                  placeholder="Nhập tên đăng nhập"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2 font-source-sans">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all font-source-sans"
                  placeholder="Nhập mật khẩu"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-600 to-mint-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-mint-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-source-sans"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </motion.button>

          <div className="text-center text-sm text-slate-600 mt-6">
            <p className="mb-3 font-source-sans">Tài khoản demo:</p>
            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-lg">
              <div className="font-semibold text-slate-700 mb-2 font-nunito">Admin (A-O):</div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {['admin_a', 'admin_b', 'admin_c', 'admin_d', 'admin_e'].map(admin => (
                  <p key={admin} className="font-source-sans">
                    <strong>{admin}:</strong> 123
                  </p>
                ))}
              </div>
              <div className="font-semibold text-slate-700 mb-2 font-nunito">Giáo viên:</div>
              <p className="font-source-sans"><strong>teacher:</strong> teacher123</p>
            </div>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
