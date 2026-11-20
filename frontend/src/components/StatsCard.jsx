import React from 'react';

export default function StatsCard({ title, value, icon: Icon, color = 'blue', change, subtitle }) {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50 text-blue-600 border-blue-100',
      gradient: 'from-blue-600 to-indigo-600'
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      gradient: 'from-emerald-600 to-teal-600'
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600 border-amber-100',
      gradient: 'from-amber-500 to-orange-500'
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600 border-purple-100',
      gradient: 'from-purple-600 to-indigo-600'
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600 border-rose-100',
      gradient: 'from-rose-500 to-pink-600'
    }
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 tracking-wide uppercase">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight group-hover:text-brand-600 transition-colors">
            {value}
          </h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-13 h-13 p-3.5 rounded-2xl border ${style.bg} flex items-center justify-center transition-transform group-hover:scale-105 duration-200 shadow-sm`}>
          <Icon className="w-6 h-6 stroke-[2.2]" />
        </div>
      </div>
      {change && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
          <span className="font-semibold text-emerald-600">{change}</span>
          <span>from previous semester</span>
        </div>
      )}
    </div>
  );
}
