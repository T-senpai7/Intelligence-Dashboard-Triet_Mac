import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import GroupManager from './components/GroupManager';
import GroupLeaderDashboard from './components/GroupLeaderDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import PublicSearch from './components/PublicSearch';
import { useAuth } from './contexts/AuthContext';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/groups" element={<GroupManager />} />
      <Route path="/search" element={<PublicSearch />} />
      <Route
        path="/group-leader"
        element={
          user?.role === 'group_leader' ?
          <GroupLeaderDashboard /> :
          <Navigate to="/" />
        }
      />
      <Route
        path="/teacher"
        element={
          user?.role === 'teacher' ?
          <TeacherDashboard /> :
          <Navigate to="/" />
        }
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <LoginForm />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <Navbar />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="pt-16"
          >
            <AppRoutes />
          </motion.main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
