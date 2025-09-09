import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, groupLabels } from '../utils/mockData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState(() => {
    // Initialize empty groups A-O
    const initialGroups = {};
    groupLabels.forEach(label => {
      initialGroups[label] = [];
    });
    return initialGroups;
  });

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (credentials) => {
    const foundUser = mockUsers.find(
      u => u.username === credentials.username && u.password === credentials.password
    );
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const addStudent = (studentData) => {
    const newStudent = {
      id: Date.now(),
      ...studentData,
      attendance: { absent: 0 },
      participation: { count: 0 },
      groupWork: 0,
      midterm: 0,
      createdBy: user?.username,
      createdAt: new Date().toISOString()
    };
    setStudents(prev => [...prev, newStudent]);
    return newStudent;
  };

  const updateStudent = (id, updates) => {
    setStudents(prev => prev.map(student =>
      student.id === id ? { ...student, ...updates } : student
    ));
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(student => student.id !== id));
    // Also remove from groups
    setGroups(prev => {
      const newGroups = { ...prev };
      Object.keys(newGroups).forEach(groupName => {
        newGroups[groupName] = newGroups[groupName].filter(student => student.id !== id);
      });
      return newGroups;
    });
  };

  const addStudentToGroup = (groupName, studentData) => {
    // Check if user has permission to add to this group
    if (user?.role === 'group_leader' && user?.groupName !== groupName) {
      throw new Error('Bạn chỉ có thể thêm sinh viên vào nhóm của mình');
    }

    const newStudent = addStudent({ ...studentData, groupName });
    
    setGroups(prev => ({
      ...prev,
      [groupName]: [...prev[groupName], newStudent]
    }));
    
    return newStudent;
  };

  const updateStudentInGroup = (studentId, updates) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // Check permissions
    if (user?.role === 'group_leader' && student.groupName !== user?.groupName) {
      throw new Error('Bạn chỉ có thể chỉnh sửa sinh viên trong nhóm của mình');
    }

    updateStudent(studentId, updates);
    
    // Update in groups
    setGroups(prev => {
      const newGroups = { ...prev };
      Object.keys(newGroups).forEach(groupName => {
        newGroups[groupName] = newGroups[groupName].map(s =>
          s.id === studentId ? { ...s, ...updates } : s
        );
      });
      return newGroups;
    });
  };

  const canEditStudent = (student) => {
    if (!user) return false;
    if (user.role === 'teacher') return true;
    if (user.role === 'admin') return true;
    if (user.role === 'group_leader' && student.groupName === user.groupName) return true;
    return false;
  };

  const canEditGroup = (groupName) => {
    if (!user) return false;
    if (user.role === 'teacher') return true;
    if (user.role === 'admin') return true;
    if (user.role === 'group_leader' && user.groupName === groupName) return true;
    return false;
  };

  const value = {
    user,
    students,
    groups,
    login,
    logout,
    addStudent,
    updateStudent,
    deleteStudent,
    addStudentToGroup,
    updateStudentInGroup,
    canEditStudent,
    canEditGroup,
    setGroups
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
