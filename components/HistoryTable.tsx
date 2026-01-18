
import React from 'react';
import { FormEntry } from '../types';

interface HistoryTableProps {
  entries: FormEntry[];
  onDelete: (id: string) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ entries, onDelete }) => {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
        <div className="text-4xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-slate-700">No entries yet</h3>
        <p className="text-slate-500 mt-2">Start filling forms in the Simulator to see data here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-sm text-slate-600">Date</th>
              <th className="px-6 py-4 font-semibold text-sm text-slate-600">Page / Website</th>
              <th className="px-6 py-4 font-semibold text-sm text-slate-600">Data Summary</th>
              <th className="px-6 py-4 font-semibold text-sm text-slate-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(entry.date).toLocaleDateString()}
                  <br />
                  <span className="text-xs opacity-60">{new Date(entry.date).toLocaleTimeString()}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{entry.pageTitle}</div>
                  <div className="text-xs text-indigo-500 truncate max-w-[200px]">{entry.pageUrl}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {entry.fields.slice(0, 3).map((f, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600 border border-slate-200">
                        {f.label}: {f.value.length > 15 ? f.value.substring(0, 15) + '...' : f.value}
                      </span>
                    ))}
                    {entry.fields.length > 3 && (
                      <span className="text-[10px] text-slate-400">+{entry.fields.length - 3} more</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onDelete(entry.id)}
                    className="text-red-400 hover:text-red-600 text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
