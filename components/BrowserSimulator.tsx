
import React, { useState, useRef, useEffect } from 'react';
import { SavedValue } from '../types';

interface BrowserSimulatorProps {
  onCapture: (val: string) => void;
  vault: SavedValue[];
  onGoToVault: () => void;
}

const BrowserSimulator: React.FC<BrowserSimulatorProps> = ({ onCapture, vault, onGoToVault }) => {
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [logs, setLogs] = useState<{msg: string, time: string}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const addLog = (msg: string) => {
      setLogs(prev => [{ msg, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 5));
    };

    const handleGlobalInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const value = target.value;
      const name = target.getAttribute('name') || target.id;

      addLog(`Evento 'input' detectado en [${name}]: "${value}"`);

      if (value.trim().length >= 3) {
        onCapture(value);
        setLastSaved(value);
        setTimeout(() => setLastSaved(null), 1500);
      }
    };

    const handleGlobalFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement;
      const name = target.getAttribute('name') || target.id;
      setActiveFieldId(target.id);
      addLog(`Campo [${name}] enfocado. Inyectando UI de FormRecall...`);
    };

    const handleGlobalBlur = (e: FocusEvent) => {
      setTimeout(() => setActiveFieldId(null), 200);
    };

    container.addEventListener('input', handleGlobalInput);
    container.addEventListener('focusin', handleGlobalFocus as EventListener);
    container.addEventListener('focusout', handleGlobalBlur as EventListener);

    addLog("Content Script v3.2 inyectado con éxito.");

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
    <div className="h-full p-6 flex gap-6 bg-slate-100 overflow-hidden">
      <div className="flex-1 flex flex-col items-center overflow-y-auto custom-scrollbar">
        <div 
          ref={containerRef}
          className="w-full max-w-md bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-200 relative mt-4"
        >
          {lastSaved && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white px-3 py-1 rounded-full text-[9px] font-black shadow-lg animate-bounce">
              MEMORIZADO ✨
            </div>
          )}

          <header className="mb-8 border-b pb-6 border-slate-50">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-[10px] text-slate-300 font-mono ml-2">https://secure.checkout.sample</span>
            </div>
            <h3 className="text-xl font-black text-slate-800">Finalizar Compra</h3>
          </header>

          <div className="space-y-6">
            {[
              { id: 'full_name', label: 'Nombre en Tarjeta', icon: '👤' },
              { id: 'shipping_address', label: 'Dirección de Envío', icon: '🏠' },
              { id: 'user_phone', label: 'Teléfono Móvil', icon: '📱' }
            ].map(field => (
              <div key={field.id} className="relative">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                  {field.label}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{field.icon}</span>
                  <input 
                    id={field.id}
                    name={field.id}
                    type="text"
                    className="w-full bg-slate-50 border-2 border-slate-50 px-10 py-3.5 rounded-2xl outline-none focus:border-violet-400 focus:bg-white transition-all font-semibold text-slate-700"
                    placeholder="Esperando entrada..."
                    autoComplete="off"
                  />
                  
                  {activeFieldId === field.id && vault.length > 0 && (
                    <div className="elegant-dropdown border-2 border-violet-100 shadow-2xl">
                      <div className="px-4 py-2 border-b border-slate-50 flex justify-between items-center bg-slate-50/40">
                        <span className="text-[8px] font-black text-violet-400 uppercase tracking-widest italic">FormRecall Injected v3.2</span>
                      </div>
                      {vault.map(v => (
                        <div 
                          key={v.id} 
                          className="dropdown-option"
                          onMouseDown={() => fillValue(field.id, v.value)}
                        >
                          <span className="truncate pr-4">{v.value}</span>
                          <span className="text-[10px] opacity-40 italic">historial</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-colors">
            Pagar Ahora
          </button>
        </div>
      </div>

      <div className="w-64 bg-slate-900 rounded-[2rem] p-6 flex flex-col shadow-2xl">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Monitor de Script v3.2</h4>
        </div>
        
        <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
          {logs.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic">Esperando interacción en el DOM...</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="animate-in slide-in-from-right-2 duration-300">
                <p className="text-[8px] text-slate-500 font-mono">{log.time}</p>
                <p className="text-[10px] text-slate-300 font-medium leading-relaxed">{log.msg}</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
            <p className="text-[9px] text-slate-400 font-bold mb-2">MÉTODO DE ESCUCHA:</p>
            <code className="text-[8px] text-violet-300 block bg-black/30 p-2 rounded">
              document.addEventListener('input', (e) =&gt; ...)
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserSimulator;
