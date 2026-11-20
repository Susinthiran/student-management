import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, title, message, onConfirm, onCancel, isDeleting }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform transition-all">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-rose-600">
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{title || 'Confirm Deletion'}</h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            {message || 'Are you sure you want to permanently delete this item? This action cannot be undone.'}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Record
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
