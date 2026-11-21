import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  UserX,
  BookOpen,
  UserPlus,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import StatsCard from '../components/StatsCard';
import ActivityFeed from '../components/ActivityFeed';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await dashboardService.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to fetch dashboard metrics.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading analytics and student database..." />;
  }

  // Bar Chart Configuration (Course Enrollments)
  const courseChartData = {
    labels: stats?.courseDistribution?.map((c) => c.name) || [],
    datasets: [
      {
        label: 'Enrolled Students',
        data: stats?.courseDistribution?.map((c) => c.students) || [],
        backgroundColor: 'rgba(12, 144, 232, 0.85)',
        borderColor: '#0273c7',
        borderWidth: 1.5,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(2, 115, 199, 1)'
      }
    ]
  };

  const courseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items) => {
            const index = items[0].dataIndex;
            return stats?.courseDistribution[index]?.fullName || items[0].label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0, font: { family: 'Plus Jakarta Sans', size: 11 } },
        grid: { color: 'rgba(226, 232, 240, 0.6)' }
      },
      x: {
        ticks: { font: { family: 'Plus Jakarta Sans', size: 11 } },
        grid: { display: false }
      }
    }
  };

  // Status Distribution Chart Configuration
  const statusChartData = {
    labels: ['Active', 'Inactive', 'Suspended'],
    datasets: [
      {
        data: [
          stats?.activeStudents || 0,
          stats?.inactiveStudents || 0,
          stats?.suspendedStudents || 0
        ],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        hoverOffset: 4,
        borderWidth: 0
      }
    ]
  };

  const statusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
          padding: 16
        }
      }
    },
    cutout: '70%'
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
    <div className="space-y-8">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-brand-500/15">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-semibold backdrop-blur-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {user?.role === 'admin' ? 'Admin Management Console' : 'Student Academic Directory'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Academic Performance & Records
          </h1>
          <p className="text-sm text-brand-100 mt-1 max-w-xl">
            {user?.role === 'admin'
              ? 'Real-time enrollment statistics, student health metrics, and academic course distributions.'
              : 'Browse active degree programs, admissions, and verified student directory records.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'admin' ? (
            <Link
              to="/students/add"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-brand-700 font-bold text-sm shadow-md hover:bg-brand-50 transition-all hover:scale-102"
            >
              <UserPlus className="w-4 h-4 text-brand-600" />
              <span>Add Student</span>
            </Link>
          ) : (
            <Link
              to="/students"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-brand-700 font-bold text-sm shadow-md hover:bg-brand-50 transition-all hover:scale-102"
            >
              <Users className="w-4 h-4 text-brand-600" />
              <span>View Student Directory</span>
            </Link>
          )}
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-500/30 hover:bg-brand-500/40 text-white font-semibold text-sm border border-white/20 backdrop-blur-xs transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Courses</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          color="blue"
          change="+12.5%"
          subtitle="All registered students"
        />
        <StatsCard
          title="Active Students"
          value={stats?.activeStudents || 0}
          icon={UserCheck}
          color="emerald"
          change="+8.3%"
          subtitle="Currently attending courses"
        />
        <StatsCard
          title="Inactive Students"
          value={stats?.inactiveStudents || 0}
          icon={UserX}
          color="amber"
          subtitle="Leave of absence / On hold"
        />
        <StatsCard
          title="Total Courses"
          value={stats?.totalCourses || 0}
          icon={BookOpen}
          color="purple"
          subtitle="Accredited degree programs"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Enrollment Distribution Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Enrollment by Course</h3>
              <p className="text-xs text-slate-400">Headcount distribution across registered degree programs</p>
            </div>
            <span className="p-2 bg-blue-50 text-brand-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="h-64 sm:h-72 w-full pt-4">
            <Bar data={courseChartData} options={courseChartOptions} />
          </div>
        </div>

        {/* Student Status Breakdown Doughnut Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Status Ratio</h3>
              <p className="text-xs text-slate-400">Active vs Inactive vs Suspended</p>
            </div>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="h-56 sm:h-64 relative flex items-center justify-center pt-2">
            <Doughnut data={statusChartData} options={statusChartOptions} />
          </div>
        </div>
      </div>

      {/* Bottom Section: Recently Added Students & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Added Students */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recently Enrolled Students</h3>
              <p className="text-xs text-slate-400">Latest students admitted into the system</p>
            </div>
            <Link
              to="/students"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-1">Student</th>
                  <th className="pb-3">ID Number</th>
                  <th className="pb-3">Course</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-1">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-sm">
                {stats?.recentStudents?.length > 0 ? (
                  stats.recentStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 pl-1">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 border border-brand-100 flex items-center justify-center font-bold text-xs shrink-0">
                            {student.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 leading-snug">
                              {student.full_name}
                            </p>
                            <p className="text-xs text-slate-400 truncate max-w-[150px]">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 font-mono text-xs font-medium text-slate-600">
                        {student.student_id}
                      </td>
                      <td className="py-3.5 text-xs text-slate-600 font-medium">
                        {student.course_name || 'Unassigned'}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${getStatusBadge(
                            student.status
                          )}`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-1">
                        <Link
                          to={`/students/edit/${student.id}`}
                          className="text-xs font-bold text-brand-600 hover:text-brand-800 hover:underline"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-xs text-slate-400">
                      No recent students registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">System Activity</h3>
              <p className="text-xs text-slate-400">Audit logs & recent admin operations</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[360px] pr-1">
            <ActivityFeed activities={stats?.recentActivities || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
