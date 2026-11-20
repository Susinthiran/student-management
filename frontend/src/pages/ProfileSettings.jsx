import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Save,
  ShieldCheck,
  Server,
  Database,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

export default function ProfileSettings() {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Name and Email cannot be empty.');
      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        setError('Please enter your current password to set a new password.');
        return;
      }
      if (newPassword.length < 6) {
        setError('New password must be at least 6 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setError('New passwords do not match.');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const res = await updateUserProfile({
        name,
        email,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined
      });

      if (res.success) {
        setToast({ message: 'Profile updated successfully!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile settings.');
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile & Security Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your administrator credentials, email notifications, and system credentials.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Settings Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Details */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-600" />
                <span>Account Information</span>
              </h3>

              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Administrator Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-600" />
                <span>Security & Password (Optional)</span>
              </h3>

              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password to verify"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Security & Session Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Security Guard</h4>
                <p className="text-xs text-slate-400">Authenticated Session</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="font-bold text-slate-800 uppercase tracking-wide">
                  {user?.role || 'admin'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Auth Token:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active JWT
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Security Cipher:</span>
                <span className="font-mono text-slate-600">bcrypt 10 rounds</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Cookie Protection:</span>
                <span className="font-semibold text-slate-700">HTTP-Only / Lax</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2.5">
              <Database className="w-5 h-5 text-brand-400" />
              <h4 className="text-sm font-bold text-white">Database Integration</h4>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Connected to relational storage with schema foreign keys, cascading rules, and parameterized anti-SQL injection queries.
            </p>
            <div className="text-[11px] font-mono bg-white/10 rounded-xl p-2.5 text-brand-200">
              Host: localhost:3306<br />
              DB: student_management
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
