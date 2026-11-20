import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserPlus,
  ArrowLeft,
  Save,
  Sparkles,
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import Toast from '../components/Toast';
import { studentService } from '../services/studentService';
import { courseService } from '../services/courseService';

export default function AddStudent() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const [formData, setFormData] = useState({
    student_id: `STU-2024-${Math.floor(100 + Math.random() * 900)}`,
    full_name: '',
    email: '',
    phone: '',
    gender: 'Male',
    dob: '',
    course_id: '',
    address: '',
    admission_date: new Date().toISOString().split('T')[0],
    status: 'Active'
  });

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await courseService.getCourses();
        if (res.success) {
          setCourses(res.data);
          if (res.data.length > 0) {
            setFormData((prev) => ({ ...prev, course_id: res.data[0].id }));
          }
        }
      } catch (err) {
        console.warn('Error loading courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    loadCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateId = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setFormData((prev) => ({
      ...prev,
      student_id: `STU-${new Date().getFullYear()}-${randomNum}`
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (
      !formData.student_id.trim() ||
      !formData.full_name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.dob ||
      !formData.admission_date
    ) {
      setError('Please fill in all mandatory student record fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await studentService.createStudent(formData);
      if (res.success) {
        setToast({ message: 'Student registered successfully! Redirecting...', type: 'success' });
        setTimeout(() => {
          navigate('/students');
        }, 1000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to enroll student. Please check input details.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/students"
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Enroll New Student
            </h1>
            <p className="text-xs text-slate-500">
              Create and register a new student record into the MySQL database
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Enrollment Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Academic Identity */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-brand-600" />
              <span>Academic Identification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Student ID <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    placeholder="e.g. STU-2024-007"
                    required
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateId}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                    title="Generate Random Student ID"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                    <span>Auto ID</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Degree Course / Program <span className="text-rose-500">*</span>
                </label>
                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                >
                  <option value="">Select Degree Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Personal Info */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-brand-600" />
              <span>Personal Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. John Alexander Doe"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@student.edu"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Gender <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Date of Birth <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Enrollment & Address */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
              <Save className="w-4 h-4 text-brand-600" />
              <span>Enrollment & Residential Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Admission Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  name="admission_date"
                  value={formData.admission_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Enrollment Status <span className="text-rose-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                >
                  <option value="Active">Active (Attending)</option>
                  <option value="Inactive">Inactive (On Leave)</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Permanent Residential Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Street, City, State, Zip Code"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              to="/students"
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Enrolling...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Student Record</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
