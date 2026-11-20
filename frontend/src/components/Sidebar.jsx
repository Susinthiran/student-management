import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  BookOpen,
  Settings,
  LogOut,
  GraduationCap,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Student List', path: '/students', icon: Users },
    { name: 'Add Student', path: '/students/add', icon: UserPlus },
    { name: 'Course Management', path: '/courses', icon: BookOpen },
    { name: 'Profile Settings', path: '/profile', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 tracking-tight text-lg leading-tight">
                EduTrack <span className="text-brand-600">Pro</span>
              </h1>
              <p className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                Student Management
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-50 text-brand-600 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 ${
                        isActive ? 'text-brand-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-5 rounded-full bg-brand-600" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* User Quick Info & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 m-3 rounded-2xl border border-slate-200/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
