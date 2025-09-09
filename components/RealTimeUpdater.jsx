import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RealTimeUpdater = ({ onDataUpdate }) => {
  const { students, groups } = useAuth();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateCount, setUpdateCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);
      
      // Simulate data processing time
      setTimeout(() => {
        setLastUpdate(new Date());
        setUpdateCount(prev => prev + 1);
        setIsUpdating(false);
        
        // Notify parent component of data update
        if (onDataUpdate) {
          onDataUpdate({
            students,
            groups,
            timestamp: new Date(),
            updateCount: updateCount + 1
          });
        }
      }, 500);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [students, groups, updateCount, onDataUpdate]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update when students or groups change
  useEffect(() => {
    setLastUpdate(new Date());
    setUpdateCount(prev => prev + 1);
  }, [students, groups]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTimeDifference = () => {
    const now = new Date();
    const diff = Math.floor((now - lastUpdate) / 1000);
    
    if (diff < 60) return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return `${Math.floor(diff / 86400)} ngày trước`;
  };

  const manualRefresh = () => {
    setIsUpdating(true);
    
    setTimeout(() => {
      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);
      setIsUpdating(false);
      
      if (onDataUpdate) {
        onDataUpdate({
          students,
          groups,
          timestamp: new Date(),
          updateCount: updateCount + 1,
          manual: true
        });
      }
    }, 1000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 ${
            isOnline ? 'text-green-600' : 'text-red-600'
          }`}>
            {isOnline ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
            <span className="text-sm font-medium font-source-sans">
              {isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}
            </span>
          </div>
          
          <div className="h-4 w-px bg-slate-300"></div>
          
          <div className="flex items-center space-x-2 text-slate-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-source-sans">
              Cập nhật: {getTimeDifference()}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-xs text-slate-500 font-source-sans">
              {formatDate(lastUpdate)}
            </div>
            <div className="text-sm font-medium text-slate-700 font-source-sans">
              {formatTime(lastUpdate)}
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={manualRefresh}
            disabled={isUpdating || !isOnline}
            className={`p-2 rounded-lg transition-all ${
              isUpdating || !isOnline
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-teal-100 text-teal-600 hover:bg-teal-200'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ${
              isUpdating ? 'animate-spin' : ''
            }`} />
          </motion.button>
        </div>
      </div>
      
      {/* Status Indicators */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-4">
          <span className="font-source-sans">
            Tổng sinh viên: {students.length}
          </span>
          <span className="font-source-sans">
            Nhóm hoạt động: {Object.values(groups).filter(group => group.length > 0).length}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${
            isUpdating ? 'bg-yellow-400 animate-pulse' :
            isOnline ? 'bg-green-400' : 'bg-red-400'
          }`}></div>
          <span className="font-source-sans">
            {isUpdating ? 'Đang cập nhật...' :
             isOnline ? 'Đồng bộ' : 'Mất kết nối'}
          </span>
        </div>
      </div>
      
      {/* Update Counter */}
      {updateCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-slate-400 text-center font-source-sans"
        >
          Đã cập nhật {updateCount} lần trong phiên này
        </motion.div>
      )}
      
      {/* Offline Warning */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600 font-source-sans"
        >
          Mất kết nối mạng. Dữ liệu có thể không được cập nhật real-time.
        </motion.div>
      )}
      
      {/* Auto-update Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-2 text-xs text-slate-400 text-center font-source-sans"
      >
        Tự động cập nhật mỗi 30 giây
      </motion.div>
    </div>
  );
};

export default RealTimeUpdater;
