
import React, { useState, useRef, useEffect } from 'react';
import { SavedValue } from '../types';

interface BrowserSimulatorProps {
  onCapture: (val: string) => void;
  vault: SavedValue[];
  onGoToVault: () => void;
}

const BrowserSimulator: React.FC<BrowserSimulatorProps> = ({ onCapture, vault, onGoToVault }) => {
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [logs, setLogs] = useState<{msg: string, type: 'info' | 'success' | 'action', time: string}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // --- MOTOR DE LA EXTENSIÓN (CONTENT SCRIPT) ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const addLog = (msg: string, type: 'info' | 'success' | 'action' = 'info') => {
      setLogs(prev => [{ msg, type, time: new Date().toLocaleTimeString([], {second: '2-digit'}) }, ...prev].slice(0, 8));
    };

    const handleGlobalInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;
      const label = target.placeholder;

      addLog(`Leyendo datos en "${label}": ${value.slice(0, 5)}...`, 'action');

      if (value.trim().length >= 3) {
        onCapture(value);
        setLastSaved(value);
        addLog(`¡Dato memorizado! "${value}" guardado en la bóveda.`, 'success');
        setTimeout(() => setLastSaved(null), 2000);
      }
    };

    const handleGlobalFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement;
      setActiveFieldId(target.id);
      addLog(`Campo detectado. Inyectando menú de autocompletado...`, 'info');
    };

    const handleGlobalBlur = (e: FocusEvent) => {
      setTimeout(() => setActiveFieldId(null), 200);
    };

    // Estos listeners simulan el "Content Script" que corre en el navegador
    container.addEventListener('input', handleGlobalInput);
    container.addEventListener('focusin', handleGlobalFocus as EventListener);
    container.addEventListener('focusout', handleGlobalBlur as EventListener);

    addLog("Script FormRecall v3.3 iniciado. Vigilando el DOM...", 'info');

    return () => {
      container.removeEventListener('input', handleGlobalInput);
      container.removeEventListener('focusin', handleGlobalFocus as EventListener);
      container.removeEventListener('focusout', handleGlobalBlur as EventListener);
    };
  }, [onCapture]);

  const fillValue = (id: string, text: string) => {
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.value = text;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      setActiveFieldId(null);
    }
  };

  return (
    <div className="h-full flex bg-slate-100 overflow-hidden p-4 gap-4">
      
      {/* 1. Lado Izquierdo: La "Página Web" que visitas */}
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar p-2">
        
        {/* Guía de Usuario */}
        <div className="bg-violet-600 text-white p-6 rounded-[2rem] shadow-lg shadow-violet-200">
          <h4 className="font-black text-sm mb-2 flex items-center">
            <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center mr-2 text-[10px]">?</span>
            ¿Cómo probar la extensión?
          </h4>
          <ol className="text-xs space-y-2 opacity-90 font-medium list-decimal list-inside">
            <li>Haz clic en un campo (ej: "Nombre").</li>
            <li>Escribe algo (mira el panel negro a la derecha mientras lo haces).</li>
            <li>Al escribir 3 letras, la extensión lo **memoriza** automáticamente.</li>
            <li>Borra el campo y haz clic de nuevo: ¡verás tus datos guardados!</li>
          </ol>
        </div>

        {/* La Página Web Simulada */}
        <div 
          ref={containerRef}
          className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-200 relative min-h-[400px]"
        >
          {lastSaved && (
            <div className="absolute top-4 right-8 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black animate-bounce shadow-lg">
              MEMORIA ACTIVA ⚡
            </div>
          )}

          <div className="flex items-center space-x-2 mb-8 text-slate-300">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            </div>
            <span className="text-[10px] font-mono">browser://demo-page</span>
          </div>

          <h3 className="text-2xl font-black text-slate-800 mb-8 pl-1">Formulario de Registro</h3>

          <div className="space-y-8">
            {[
              { id: 'web_name', label: 'Tu Nombre', placeholder: 'Ej: Carlos Pérez' },
              { id: 'web_email', label: 'Email', placeholder: 'correo@ejemplo.com' },
              { id: 'web_city', label: 'Ciudad', placeholder: 'Ciudad de residencia' }
            ].map(field => (
              <div key={field.id} className="relative group">
                <div className="flex justify-between mb-1.5 px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {field.label}
                  </label>
                  <span className="text-[8px] font-black text-violet-400 opacity-0 group-focus-within:opacity-100 transition-opacity">
                    INYECTADO POR FORMRECALL
                  </span>
                </div>
                
                <div className="relative">
                  <input 
                    id={field.id}
                    type="text"
                    className="w-full bg-slate-50 border-2 border-slate-50 px-6 py-4 rounded-2xl outline-none focus:border-violet-400 focus:bg-white transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                    placeholder={field.placeholder}
                    autoComplete="off"
                  />
                  
                  {/* UI Inyectada: Aparece cuando el campo tiene foco */}
                  {activeFieldId === field.id && vault.length > 0 && (
                    <div className="elegant-dropdown border-2 border-violet-100 shadow-2xl">
                      <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center bg-violet-50/50">
                        <span className="text-[9px] font-black text-violet-600 uppercase">Sugerencias de tu Bóveda</span>
                        <button onClick={onGoToVault} className="text-[9px] font-bold text-slate-400 hover:text-violet-600 underline">Ver Todo</button>
                      </div>
                      {vault.slice(0, 5).map(v => (
                        <div 
                          key={v.id} 
                          className="dropdown-option group"
                          onMouseDown={() => fillValue(field.id, v.value)}
                        >
                          <span className="truncate pr-4">{v.value}</span>
                          <span className="text-[9px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100">USAR</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Lado Derecho: Lo que sucede "Detrás de Escena" */}
      <div className="w-72 bg-slate-900 rounded-[2.5rem] p-6 flex flex-col shadow-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Background Script</h4>
          </div>
          <span className="text-[9px] text-slate-500 font-mono">v3.3.0</span>
        </div>
        
        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 font-mono">
          {logs.map((log, i) => (
            <div key={i} className={`p-2 rounded-lg border-l-2 text-[10px] animate-in fade-in slide-in-from-right-2 ${
              log.type === 'success' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' :
              log.type === 'action' ? 'bg-violet-500/10 border-violet-500 text-violet-300' :
              'bg-slate-800/50 border-slate-600 text-slate-400'
            }`}>
              <div className="flex justify-between mb-1 opacity-50">
                <span>{log.type.toUpperCase()}</span>
                <span>{log.time}</span>
              </div>
              <p className="leading-relaxed">{log.msg}</p>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-[10px] italic">No hay actividad.<br/>Escribe algo en la izquierda.</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2">Estado del Motor</p>
          <div className="flex justify-center space-x-1">
            <div className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded text-[8px] font-black">DOM_WATCHER: ON</div>
            <div className="px-2 py-1 bg-violet-500/10 text-violet-500 rounded text-[8px] font-black">AI_MAPPING: ON</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserSimulator;
