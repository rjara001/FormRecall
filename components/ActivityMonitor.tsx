
import React from 'react';
import { ActivityLog } from '../types';

interface ActivityMonitorProps {
  logs: ActivityLog[];
}

const ActivityMonitor: React.FC<ActivityMonitorProps> = ({ logs }) => {
  return (
    <div className="h-full bg-slate-900 flex flex-col p-8 font-mono">
      <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-white text-xl font-black flex items-center space-x-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Terminal de Escucha</span>
          </h2>
          <p className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest font-bold">Monitorizando eventos del DOM en tiempo real</p>
        </div>
        <div className="flex space-x-2">
          <div className="px-3 py-1 bg-slate-800 rounded text-emerald-400 text-[9px] font-bold border border-slate-700">HTTPS_SCANNER: OK</div>
          <div className="px-3 py-1 bg-slate-800 rounded text-indigo-400 text-[9px] font-bold border border-slate-700">GEMINI_READY: OK</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-4">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-700">
            <p className="text-xs mb-2">SISTEMA INICIADO...</p>
            <p className="text-[10px] text-center max-w-xs">Escribe en cualquier campo de texto de esta aplicación para ver cómo el motor intercepta y procesa los datos.</p>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="group animate-in slide-in-from-left-2 duration-300">
              <div className="flex items-start space-x-4">
                <span className="text-slate-600 text-[9px] pt-1 shrink-0">{log.timestamp}</span>
                <div className={`p-3 rounded-xl border flex-1 ${
                  log.type === 'learn' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300' :
                  log.type === 'intercept' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  log.type === 'sync' ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
                  'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[8px] font-black uppercase opacity-60 tracking-tighter">[{log.type}]</span>
                  </div>
                  <p className="text-[11px] leading-relaxed font-semibold">{log.msg}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800">
        <div className="bg-black/40 p-4 rounded-2xl border border-slate-800 text-[10px] text-slate-500 leading-relaxed">
          <p className="mb-2"><span className="text-indigo-400">INFO:</span> FormRecall Engine utiliza Listeners Pasivos para no afectar el rendimiento de la página.</p>
          <p><span className="text-indigo-400">INFO:</span> Los datos sensibles son analizados localmente antes de ser sincronizados con Gemini AI para mapeo semántico.</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityMonitor;
