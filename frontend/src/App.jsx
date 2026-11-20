import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentList from './pages/StudentList';
import AddStudent from './pages/AddStudent';
import EditStudent from './pages/EditStudent';
import CourseManagement from './pages/CourseManagement';
import ProfileSettings from './pages/ProfileSettings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Console Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<StudentList />} />
            <Route path="students/add" element={<AddStudent />} />
            <Route path="students/edit/:id" element={<EditStudent />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="profile" element={<ProfileSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
