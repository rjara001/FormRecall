
import React, { useState, useRef, useEffect } from 'react';
import { SavedValue } from '../types';

interface BrowserSimulatorProps {
  onCapture: (val: string) => void;
  vault: SavedValue[];
  onGoToVault: () => void;
}

const BrowserSimulator: React.FC<BrowserSimulatorProps> = ({ onCapture, vault, onGoToVault }) => {
  const [activeField, setActiveField] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({ name: '', city: '', job: '' });
  const [isTyping, setIsTyping] = useState(false);
  const [showIndicator, setShowIndicator] = useState(false);
  
  const typingTimer = useRef<number | null>(null);
  const captureTimer = useRef<number | null>(null);

  // Efecto para manejar el feedback visual (parpadeo)
  const handleTyping = (field: string, text: string) => {
    setValues(prev => ({ ...prev, [field]: text }));
    setIsTyping(true);
    setShowIndicator(true);
    
    // Limpiar timers previos
    if (typingTimer.current) window.clearTimeout(typingTimer.current);
    if (captureTimer.current) window.clearTimeout(captureTimer.current);
    
    // Timer para el feedback visual (deja de parpadear 1s después de escribir)
    typingTimer.current = window.setTimeout(() => {
      setIsTyping(false);
      setShowIndicator(false);
    }, 1000);

    // Requisito: Captura automática mientras escribe (Debounce de 700ms)
    captureTimer.current = window.setTimeout(() => {
      if (text.trim().length >= 2) {
        onCapture(text);
      }
    }, 700);
  };

  const handleBlur = () => {
    // Retrasar el cierre para permitir clics en el dropdown
    setTimeout(() => setActiveField(null), 200);
  };

  const fillValue = (field: string, text: string) => {
    setValues(prev => ({ ...prev, [field]: text }));
    onCapture(text); // Reforzar captura al seleccionar de la lista
    setActiveField(null);
  };

  const inputs = [
    { id: 'name', label: 'Nombre Completo', icon: '👤' },
    { id: 'city', label: 'Ciudad o Dirección', icon: '📍' },
    { id: 'job', label: 'Cargo o Profesión', icon: '💼' }
  ];

  return (
    <div className="h-full p-8 flex flex-col items-center bg-slate-50 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-lg bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 relative animate-in zoom-in-95 duration-300">
        <header className="mb-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-violet-50 text-violet-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            Test de Captura Activa
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">Página de Prueba</h3>
          <p className="text-xs text-slate-400 font-medium px-4">
            Escribe cualquier dato. FormRecall detectará el valor único y lo enviará a tu bóveda automáticamente.
          </p>
        </header>

        <div className="space-y-8">
          {inputs.map(input => (
            <div key={input.id} className="relative">
              <div className="flex justify-between items-center mb-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                  {input.label}
                </label>
                {activeField === input.id && showIndicator && (
                  <div 
                    className="pulse-icon cursor-pointer scale-125" 
                    title="¡Guardando en Bóveda! Haz clic para ver." 
                    onClick={onGoToVault}
                  ></div>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                  {input.icon}
                </span>
                <input 
                  value={values[input.id]}
                  onChange={(e) => handleTyping(input.id, e.target.value)}
                  onFocus={() => setActiveField(input.id)}
                  onBlur={handleBlur}
                  className="w-full bg-slate-50 border-2 border-slate-50 px-12 py-4 rounded-2xl outline-none focus:border-violet-400 focus:bg-white transition-all font-semibold text-slate-700"
                  placeholder={`Escribe algo...`}
                />

                {/* Dropdown de Autocompletado Elegante */}
                {activeField === input.id && vault.length > 0 && (
                  <div className="elegant-dropdown custom-scrollbar border-2 border-violet-100 shadow-2xl">
                    <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Memoria FormRecall</span>
                      <span className="text-[9px] font-bold text-violet-400">{vault.length} valores</span>
                    </div>
                    {vault.map(v => (
                      <div 
                        key={v.id} 
                        className="dropdown-option group"
                        onMouseDown={() => fillValue(input.id, v.value)}
                      >
                        <span className="truncate pr-4">{v.value}</span>
                        <div className="flex items-center space-x-2">
                           <span className="text-[9px] opacity-0 group-hover:opacity-40 transition-opacity font-mono">ID: {v.id.slice(0,4)}</span>
                           <span className="bg-white/50 px-2 py-0.5 rounded-md text-[10px] shadow-sm">⚡ {v.usageCount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl shadow-slate-200">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-violet-900/40 font-bold">
              ?
            </div>
            <div>
              <p className="text-xs font-bold mb-1">¿Cómo funciona?</p>
              <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                Al detectar una cadena de texto nueva, el sistema parpadea y la indexa. Si el valor ya existe, simplemente actualiza su relevancia en tu historial para sugerírtelo primero.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowserSimulator;
