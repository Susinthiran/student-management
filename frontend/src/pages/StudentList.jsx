import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  Users,
  ChevronDown,
  RotateCcw,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Eye,
  X,
  MapPin,
  ShieldAlert
} from 'lucide-react';
import Pagination from '../components/Pagination';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { studentService } from '../services/studentService';
import { courseService } from '../services/courseService';

export default function StudentList() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Filters
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('DESC');

  // Deletion Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Student Details Modal (for both students & admins)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Toast feedback
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const fetchCourses = async () => {
    try {
      const res = await courseService.getCourses();
      if (res.success) {
        setCourses(res.data);
      }
    } catch (err) {
      console.warn('Failed to load courses filter:', err.message);
    }
  };

  const fetchStudents = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await studentService.getStudents({
        page,
        limit: 10,
        search,
        courseId: courseFilter,
        status: statusFilter,
        sortBy,
        order
      });

      if (res.success) {
        setStudents(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Error fetching student records.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [search, courseFilter, statusFilter, sortBy, order]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(1);
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleResetFilters = () => {
    setSearch('');
    setCourseFilter('');
    setStatusFilter('');
    setSortBy('created_at');
    setOrder('DESC');
  };

  const openDeleteModal = (student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const openDetailsModal = (student) => {
    setSelectedStudent(student);
    setDetailsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      setIsDeleting(true);
      const res = await studentService.deleteStudent(studentToDelete.id);
      if (res.success) {
        setToast({ message: res.message || 'Student removed successfully.', type: 'success' });
        setDeleteModalOpen(false);
        setStudentToDelete(null);
        fetchStudents(pagination.page);
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to delete student record.',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Inactive':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Suspended':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Student Record"
        message={`Are you sure you want to delete ${studentToDelete?.full_name} (${studentToDelete?.student_id})? This will permanently remove all associated academic records.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        isDeleting={isDeleting}
      />

      {/* Student Details View Modal */}
      {detailsModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-brand-600 to-indigo-600 p-6 text-white relative">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-2xl text-white border border-white/30">
                  {selectedStudent.full_name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold leading-tight">{selectedStudent.full_name}</h3>
                  <p className="text-brand-100 text-xs font-mono mt-0.5 font-semibold">
                    ID: {selectedStudent.student_id}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Academic & Dates Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Admission Date
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    <span>
                      {selectedStudent.admission_date
                        ? new Date(selectedStudent.admission_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Date of Birth (DOB)
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span>
                      {selectedStudent.dob
                        ? new Date(selectedStudent.dob).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Gender
                  </span>
                  <span className="text-xs font-semibold text-slate-700 mt-0.5 block">
                    {selectedStudent.gender || 'Not specified'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/60">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Enrollment Status
                  </span>
                  <span
                    className={`inline-block mt-0.5 px-2.5 py-0.5 text-[11px] font-bold rounded-full border ${getStatusBadge(
                      selectedStudent.status
                    )}`}
                  >
                    {selectedStudent.status}
                  </span>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Enrolled Course Program
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <BookOpen className="w-4 h-4 text-brand-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900 leading-snug">
                      {selectedStudent.course_name || 'Unassigned'}
                    </p>
                    {selectedStudent.course_code && (
                      <p className="text-xs text-slate-500 font-mono">
                        Course Code: {selectedStudent.course_code}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 bg-slate-50/70 p-2.5 rounded-xl">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium">{selectedStudent.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 bg-slate-50/70 p-2.5 rounded-xl">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium">{selectedStudent.phone}</span>
                </div>
                {selectedStudent.address && (
                  <div className="flex items-start gap-2 text-slate-700 bg-slate-50/70 p-2.5 rounded-xl">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="font-medium leading-relaxed">{selectedStudent.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium">
                {isAdmin ? 'Admin View Mode' : 'Student Read-Only Portal'}
              </span>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAdmin
              ? 'Browse, filter, edit, and organize all registered student records.'
              : 'Public Student Directory • View admission dates, DOB, courses & schedules (No login needed).'}
          </p>
        </div>

        {isAdmin ? (
          <Link
            to="/students/add"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all hover:scale-102 cursor-pointer self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Student</span>
          </Link>
        ) : (
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
              <Users className="w-4 h-4 text-brand-600" />
              <span>Public View (Read-Only)</span>
            </div>
            {!user && (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 shadow-xs transition-colors"
              >
                <span>Admin Sign In</span>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, ID or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
            />
          </div>

          {/* Filter by Course */}
          <div className="md:col-span-3">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
            >
              <option value="">All Degree Programs</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Filter by Status */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="md:col-span-2">
            <button
              onClick={handleResetFilters}
              className="w-full h-full py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <LoadingSpinner size="md" text="Loading student database..." />
        ) : students.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No student records found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No matching records for your search parameters. Try clearing the filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Student Information</th>
                  <th className="py-4 px-4">Student ID</th>
                  <th className="py-4 px-4">Contact Info</th>
                  <th className="py-4 px-4">Enrolled Course</th>
                  <th className="py-4 px-4">Admission Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Student Avatar & Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                          {student.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">
                            {student.full_name}
                          </p>
                          <span className="text-xs text-slate-400">{student.gender}</span>
                        </div>
                      </div>
                    </td>

                    {/* Student ID */}
                    <td className="py-4 px-4 font-mono text-xs font-semibold text-slate-700">
                      {student.student_id}
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="truncate max-w-[170px]">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{student.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold">
                        <BookOpen className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                        <span className="truncate max-w-[160px]" title={student.course_name}>
                          {student.course_name || 'Unassigned'}
                        </span>
                      </div>
                      {student.course_code && (
                        <span className="text-[10px] text-slate-400 block ml-5">
                          Code: {student.course_code}
                        </span>
                      )}
                    </td>

                    {/* Admission Date */}
                    <td className="py-4 px-4 text-xs text-slate-600 whitespace-nowrap">
                      {student.admission_date
                        ? new Date(student.admission_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : '-'}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${getStatusBadge(
                          student.status
                        )}`}
                      >
                        {student.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Details Button (Available to both student and admin) */}
                        <button
                          onClick={() => openDetailsModal(student)}
                          className="p-2 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
                          title="View Full Student Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Admin Only: Edit and Delete */}
                        {isAdmin && (
                          <>
                            <Link
                              to={`/students/edit/${student.id}`}
                              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Student Information"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => openDeleteModal(student)}
                              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {!loading && students.length > 0 && (
          <div className="border-t border-slate-100 px-6 py-2 bg-slate-50/50">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              limit={pagination.limit}
              onPageChange={(p) => fetchStudents(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
