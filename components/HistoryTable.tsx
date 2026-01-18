
import React, { useState } from 'react';
import { FormEntry } from '../types';

interface HistoryTableProps {
  entries: FormEntry[];
  onDelete: (id: string) => void;
}

const HistoryTable: React.FC<HistoryTableProps> = ({ entries, onDelete }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
        <div className="text-6xl mb-6">📂</div>
        <h3 className="text-2xl font-bold text-slate-800">Tu historial está vacío</h3>
        <p className="text-slate-500 mt-2 max-w-sm mx-auto">
          Usa el simulador para capturar datos de formularios. FormRecall los guardará aquí automáticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Fecha / Origen</th>
              <th className="px-8 py-5 font-bold text-xs text-slate-400 uppercase tracking-wider">Campos</th>
              <th className="px-8 py-5 font-bold text-xs text-slate-400 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {entries.map((entry) => (
              <React.Fragment key={entry.id}>
                <tr 
                  className={`group transition-all cursor-pointer ${expandedId === entry.id ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}
                  onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                        🌐
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{entry.pageTitle}</div>
                        <div className="text-xs text-slate-400 mt-0.5 truncate max-w-[240px] font-mono italic">{entry.pageUrl}</div>
                        <div className="text-[10px] text-indigo-500 font-bold mt-1 uppercase tracking-tighter">
                          {new Date(entry.date).toLocaleDateString()} @ {new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
                        {entry.fields.length} datos guardados
                      </span>
                      <span className="ml-3 text-slate-300 group-hover:translate-x-1 transition-transform">
                        {expandedId === entry.id ? '▲' : '▼'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(entry.id); }}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Eliminar registro"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
                {expandedId === entry.id && (
                  <tr>
                    <td colSpan={3} className="px-8 py-6 bg-slate-50/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in slide-in-from-top-2 duration-300">
                        {entry.fields.map((field, idx) => (
                          <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{field.label}</label>
                            <p className="text-sm font-semibold text-slate-800 break-all">{field.value}</p>
                            <p className="text-[9px] text-slate-300 mt-1 font-mono">Input: {field.name}</p>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
