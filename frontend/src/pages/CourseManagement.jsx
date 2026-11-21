import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Users,
  Search,
  CheckCircle,
  XCircle,
  Layers,
  GraduationCap
} from 'lucide-react';
import CourseModal from '../components/CourseModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/courseService';

export default function CourseManagement() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await courseService.getCourses();
      if (res.success) {
        setCourses(res.data);
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to load courses.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenAddModal = () => {
    setEditingCourse(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setEditingCourse(course);
    setModalOpen(true);
  };

  const handleSaveCourse = async (formData) => {
    try {
      setIsSaving(true);
      if (editingCourse) {
        const res = await courseService.updateCourse(editingCourse.id, formData);
        if (res.success) {
          setToast({ message: 'Course updated successfully!', type: 'success' });
          setModalOpen(false);
          fetchCourses();
        }
      } else {
        const res = await courseService.createCourse(formData);
        if (res.success) {
          setToast({ message: 'Course created successfully!', type: 'success' });
          setModalOpen(false);
          fetchCourses();
        }
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to save course details.',
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDeleteModal = (course) => {
    setCourseToDelete(course);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    try {
      setIsDeleting(true);
      const res = await courseService.deleteCourse(courseToDelete.id);
      if (res.success) {
        setToast({ message: res.message || 'Course deleted successfully.', type: 'success' });
        setDeleteModalOpen(false);
        setCourseToDelete(null);
        fetchCourses();
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to delete course.',
        type: 'error'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.department.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      <CourseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveCourse}
        course={editingCourse}
        isSaving={isSaving}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Course Program"
        message={`Are you sure you want to remove "${courseToDelete?.name} (${courseToDelete?.code})"? Any currently enrolled students will have their course association set to unassigned.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setCourseToDelete(null);
        }}
        isDeleting={isDeleting}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Course Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {isAdmin
              ? 'Create, update, and manage academic curriculum degree offerings and student allocations.'
              : 'Browse active course curriculum offerings, credit hours, and duration (No login required).'}
          </p>
        </div>

        {isAdmin ? (
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all hover:scale-102 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Course</span>
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
              <GraduationCap className="w-4 h-4 text-brand-600" />
              <span>Public Catalog (Read-Only)</span>
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

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses by code, title or department..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      {loading ? (
        <LoadingSpinner size="md" text="Loading course catalogs..." />
      ) : filteredCourses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No courses matching search</h3>
          <p className="text-xs text-slate-400 mt-1">
            No courses found. Click &apos;Add New Course&apos; to register a curriculum.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Course Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-3 py-1 rounded-xl bg-brand-50 border border-brand-100 font-mono text-xs font-bold text-brand-700 tracking-wider uppercase">
                    {course.code}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                      course.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {course.status === 'active' ? (
                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-slate-400" />
                    )}
                    <span className="capitalize">{course.status}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                  {course.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Dept: {course.department}
                </p>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {course.description || 'No course syllabus description provided.'}
                </p>
              </div>

              {/* Course Meta & Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Duration</span>
                    <span className="font-semibold text-slate-700">{course.duration}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Credits</span>
                    <span className="font-semibold text-slate-700">{course.credits} Credits</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px] uppercase">Enrolled</span>
                    <span className="font-semibold text-brand-600 flex items-center gap-1 justify-end">
                      <Users className="w-3 h-3" />
                      {course.student_count || 0}
                    </span>
                  </div>
                </div>

                {isAdmin ? (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                    <button
                      onClick={() => handleOpenEditModal(course)}
                      className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-slate-500" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(course)}
                      className="py-2 px-3 rounded-xl border border-rose-100 hover:bg-rose-50 text-xs font-semibold text-rose-600 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      title="Delete Course"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-50 text-center">
                    <span className="text-[11px] font-medium text-slate-400">
                      Standard Curriculum Course (Read-Only)
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
