import React from 'react';
import { UserPlus, BookOpen, Clock, Activity, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ActivityFeed({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400 text-sm">
        No recent activities recorded.
      </div>
    );
  }

  const getActionBadge = (action) => {
    switch (action) {
      case 'STUDENT_CREATED':
      case 'STUDENT_ENROLLED':
        return {
          icon: <UserPlus className="w-4 h-4 text-emerald-600" />,
          bg: 'bg-emerald-50 border-emerald-100'
        };
      case 'COURSE_CREATED':
      case 'COURSE_UPDATED':
        return {
          icon: <BookOpen className="w-4 h-4 text-brand-600" />,
          bg: 'bg-brand-50 border-brand-100'
        };
      case 'ADMIN_LOGIN':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />,
          bg: 'bg-indigo-50 border-indigo-100'
        };
      default:
        return {
          icon: <Activity className="w-4 h-4 text-slate-600" />,
          bg: 'bg-slate-50 border-slate-200'
        };
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-4">
      {activities.map((act) => {
        const badge = getActionBadge(act.action);
        return (
          <div
            key={act.id}
            className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className={`p-2 rounded-xl border ${badge.bg} shrink-0 mt-0.5`}>
              {badge.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 leading-snug truncate">
                {act.details}
              </p>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(act.created_at)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
