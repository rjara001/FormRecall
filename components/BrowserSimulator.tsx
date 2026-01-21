
import React, { useState, useRef } from 'react';
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
  const typingTimer = useRef<number | null>(null);

  const handleTyping = (field: string, text: string) => {
    setValues(prev => ({ ...prev, [field]: text }));
    setIsTyping(true);
    
    if (typingTimer.current) clearTimeout(typingTimer.current);
    
    typingTimer.current = window.setTimeout(() => {
      setIsTyping(false);
    }, 1500);
  };

  const handleBlur = (field: string) => {
    const val = values[field];
    if (val && val.length > 2) {
      onCapture(val);
    }
    // Retrasar el cierre del dropdown para permitir clics
    setTimeout(() => setActiveField(null), 200);
  };

  const fillValue = (field: string, text: string) => {
    setValues(prev => ({ ...prev, [field]: text }));
    onCapture(text);
    setActiveField(null);
  };

  const inputs = [
    { id: 'name', label: 'Nombre Completo', icon: '👤' },
    { id: 'city', label: 'Ciudad / Dirección', icon: '📍' },
    { id: 'job', label: 'Cargo o Profesión', icon: '💼' }
  ];

  return (
    <div className="h-full p-8 flex flex-col items-center">
      <div className="w-full max-w-lg bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 relative">
        <header className="mb-8">
          <h3 className="text-xl font-black text-slate-800 flex items-center">
            <span className="mr-3">🌐</span> Modo Captura Activa
          </h3>
          <p className="text-xs text-slate-400 mt-2 font-medium">Cualquier valor único que escribas aquí se guardará automáticamente en tu bóveda.</p>
        </header>

        <div className="space-y-6">
          {inputs.map(input => (
            <div key={input.id} className="relative">
              <div className="flex justify-between items-end mb-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{input.label}</label>
                {activeField === input.id && isTyping && (
                  <div className="capture-indicator cursor-help" title="Guardando nuevo valor único..." onClick={onGoToVault}></div>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{input.icon}</span>
                <input 
                  value={values[input.id]}
                  onChange={(e) => handleTyping(input.id, e.target.value)}
                  onFocus={() => setActiveField(input.id)}
                  onBlur={() => handleBlur(input.id)}
                  className="input-minimal pl-11"
                  placeholder={`Escribe ${input.label.toLowerCase()}...`}
                />

                {activeField === input.id && vault.length > 0 && (
                  <div className="elegant-dropdown custom-scrollbar">
                    <p className="text-[9px] font-bold text-slate-300 uppercase px-3 py-2 border-b border-slate-50">Sugerencias guardadas</p>
                    {vault.map(v => (
                      <div 
                        key={v.id} 
                        className="dropdown-option"
                        onMouseDown={() => fillValue(input.id, v.value)}
                      >
                        <span className="truncate">{v.value}</span>
                        <span className="text-[10px] opacity-30">#{v.usageCount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-4 bg-violet-50 rounded-2xl border border-violet-100">
          <p className="text-[11px] text-violet-700 leading-relaxed font-medium">
            💡 <b>Tip:</b> Si escribes un nombre que no está en la base de datos, el orbe violeta parpadeará indicando que se ha registrado una nueva entrada en tu bóveda.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrowserSimulator;
