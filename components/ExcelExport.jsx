import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ExcelExport = ({ groups, students, selectedGroup = null }) => {
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

  const exportToExcel = (groupName = null) => {
    let dataToExport = [];
    let filename = '';

    if (groupName) {
      // Export specific group
      const groupStudents = groups[groupName] || [];
      filename = `Nhom_${groupName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      dataToExport = groupStudents.map((student, index) => ({
        'STT': index + 1,
        'Mã SV': student.studentId,
        'Họ và tên': student.name,
        'Nhóm': groupName,
        'Vắng (buổi)': student.attendance.absent,
        'Điểm chuyên cần': student.attendance.absent === 0 ? 10 :
                          student.attendance.absent === 1 ? 8 :
                          student.attendance.absent === 2 ? 6 : 0,
        'Số lần phát biểu': student.participation.count,
        'Điểm phát biểu': Math.min(student.participation.count * 4, 10),
        'Điểm bài tập nhóm': student.groupWork,
        'Điểm giữa kỳ': student.midterm,
        'Điểm quá trình': calculateProcessScore(student),
        'Ghi chú': student.notes || ''
      }));
    } else {
      // Export all groups
      filename = `TatCaNhom_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      Object.keys(groups).forEach(groupName => {
        const groupStudents = groups[groupName] || [];
        groupStudents.forEach((student, index) => {
          dataToExport.push({
            'STT': dataToExport.length + 1,
            'Mã SV': student.studentId,
            'Họ và tên': student.name,
            'Nhóm': groupName,
            'Vắng (buổi)': student.attendance.absent,
            'Điểm chuyên cần': student.attendance.absent === 0 ? 10 :
                              student.attendance.absent === 1 ? 8 :
                              student.attendance.absent === 2 ? 6 : 0,
            'Số lần phát biểu': student.participation.count,
            'Điểm phát biểu': Math.min(student.participation.count * 4, 10),
            'Điểm bài tập nhóm': student.groupWork,
            'Điểm giữa kỳ': student.midterm,
            'Điểm quá trình': calculateProcessScore(student),
            'Ghi chú': student.notes || ''
          });
        });
      });
    }

    if (dataToExport.length === 0) {
      alert('Không có dữ liệu để xuất!');
      return;
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    if (groupName) {
      // Single group export
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      
      // Set column widths
      const colWidths = [
        { wch: 5 },   // STT
        { wch: 12 },  // Mã SV
        { wch: 25 },  // Họ và tên
        { wch: 8 },   // Nhóm
        { wch: 12 },  // Vắng
        { wch: 15 },  // Điểm chuyên cần
        { wch: 15 },  // Số lần phát biểu
        { wch: 15 },  // Điểm phát biểu
        { wch: 18 },  // Điểm bài tập nhóm
        { wch: 15 },  // Điểm giữa kỳ
        { wch: 15 },  // Điểm quá trình
        { wch: 20 }   // Ghi chú
      ];
      ws['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(wb, ws, `Nhóm ${groupName}`);
    } else {
      // All groups export - create separate sheets for each group
      Object.keys(groups).forEach(groupName => {
        const groupStudents = groups[groupName] || [];
        if (groupStudents.length > 0) {
          const groupData = groupStudents.map((student, index) => ({
            'STT': index + 1,
            'Mã SV': student.studentId,
            'Họ và tên': student.name,
            'Vắng (buổi)': student.attendance.absent,
            'Điểm chuyên cần': student.attendance.absent === 0 ? 10 :
                              student.attendance.absent === 1 ? 8 :
                              student.attendance.absent === 2 ? 6 : 0,
            'Số lần phát biểu': student.participation.count,
            'Điểm phát biểu': Math.min(student.participation.count * 4, 10),
            'Điểm bài tập nhóm': student.groupWork,
            'Điểm giữa kỳ': student.midterm,
            'Điểm quá trình': calculateProcessScore(student),
            'Ghi chú': student.notes || ''
          }));
          
          const ws = XLSX.utils.json_to_sheet(groupData);
          
          // Set column widths
          const colWidths = [
            { wch: 5 },   // STT
            { wch: 12 },  // Mã SV
            { wch: 25 },  // Họ và tên
            { wch: 12 },  // Vắng
            { wch: 15 },  // Điểm chuyên cần
            { wch: 15 },  // Số lần phát biểu
            { wch: 15 },  // Điểm phát biểu
            { wch: 18 },  // Điểm bài tập nhóm
            { wch: 15 },  // Điểm giữa kỳ
            { wch: 15 },  // Điểm quá trình
            { wch: 20 }   // Ghi chú
          ];
          ws['!cols'] = colWidths;
          
          XLSX.utils.book_append_sheet(wb, ws, `Nhóm ${groupName}`);
        }
      });
      
      // Add summary sheet
      const summaryData = Object.keys(groups).map(groupName => {
        const groupStudents = groups[groupName] || [];
        const avgScore = groupStudents.length > 0 
          ? (groupStudents.reduce((sum, student) => sum + parseFloat(calculateProcessScore(student)), 0) / groupStudents.length).toFixed(1)
          : '0.0';
        
        return {
          'Nhóm': groupName,
          'Số thành viên': groupStudents.length,
          'Điểm trung bình': avgScore,
          'Số SV đạt (≥5.0)': groupStudents.filter(s => parseFloat(calculateProcessScore(s)) >= 5).length
        };
      }).filter(group => group['Số thành viên'] > 0);
      
      const summaryWs = XLSX.utils.json_to_sheet(summaryData);
      summaryWs['!cols'] = [
        { wch: 8 },   // Nhóm
        { wch: 15 },  // Số thành viên
        { wch: 18 },  // Điểm trung bình
        { wch: 18 }   // Số SV đạt
      ];
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Tổng kết');
    }

    // Save file
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, filename);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {selectedGroup && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => exportToExcel(selectedGroup)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium font-source-sans"
        >
          <Download className="h-4 w-4" />
          <span>Xuất nhóm {selectedGroup}</span>
        </motion.button>
      )}
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => exportToExcel()}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium font-source-sans"
      >
        <FileSpreadsheet className="h-4 w-4" />
        <span>Xuất tất cả nhóm</span>
      </motion.button>
    </div>
  );
};

export default ExcelExport;
