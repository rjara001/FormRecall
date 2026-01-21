
import React, { useState, useRef, useEffect } from 'react';
import { SavedValue } from '../types';

interface BrowserSimulatorProps {
  onCapture: (val: string) => void;
  vault: SavedValue[];
  onGoToVault: () => void;
}

const BrowserSimulator: React.FC<BrowserSimulatorProps> = ({ onCapture, vault, onGoToVault }) => {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [values, setValues] = useState({ name: '', email: '', note: '' });
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

  const handleInputChange = (field: string, val: string) => {
    setValues(prev => ({ ...prev, [field]: val }));
    setIsTyping(true);
    // Simular debounce para el indicador de guardado
    const timer = setTimeout(() => setIsTyping(false), 1000);
    return () => clearTimeout(timer);
  };

  const handleBlur = (field: string) => {
    const val = (values as any)[field];
    if (val) onCapture(val);
    setActiveInput(null);
    setTimeout(() => setShowDropdown(null), 200);
  };

  const selectValue = (field: string, val: string) => {
    setValues(prev => ({ ...prev, [field]: val }));
    setShowDropdown(null);
  };

  return (
    <div className="h-full bg-slate-100 p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-200">
          <h2 className="text-xl font-black mb-6 text-slate-800">🌐 Formulario de Prueba</h2>
          <p className="text-xs text-slate-400 mb-8 italic">Escribe en los campos para ver cómo el orbe violeta parpadea y guarda tus datos automáticamente.</p>
          
          <div className="space-y-6">
            {/* Campo 1 */}
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nombre Completo</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="text"
                  value={values.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onFocus={() => { setActiveInput('name'); setShowDropdown('name'); }}
                  onBlur={() => handleBlur('name')}
                  className="flex-1 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium"
                  placeholder="Ej: Alex Morgan"
                />
                {(activeInput === 'name' && isTyping) && (
                  <div className="pulse-icon" title="Capturando datos..." onClick={onGoToVault}></div>
                )}
              </div>
              {showDropdown === 'name' && vault.length > 0 && (
                <div className="autocomplete-dropdown custom-scrollbar">
                  {vault.map(v => (
                    <div key={v.id} className="dropdown-item" onClick={() => selectValue('name', v.value)}>
                      {v.value}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campo 2 */}
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
              <div className="flex items-center space-x-3">
                <input 
                  type="email"
                  value={values.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => { setActiveInput('email'); setShowDropdown('email'); }}
                  onBlur={() => handleBlur('email')}
                  className="flex-1 bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium"
                  placeholder="alex@example.com"
                />
                {(activeInput === 'email' && isTyping) && (
                  <div className="pulse-icon" title="Capturando datos..." onClick={onGoToVault}></div>
                )}
              </div>
              {showDropdown === 'email' && vault.filter(v => v.value.includes('@')).length > 0 && (
                <div className="autocomplete-dropdown custom-scrollbar">
                  {vault.filter(v => v.value.includes('@')).map(v => (
                    <div key={v.id} className="dropdown-item" onClick={() => selectValue('email', v.value)}>
                      {v.value}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campo Secreto (Ignorado) */}
            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Contraseña (Seguro)</label>
              <input 
                type="password"
                className="w-full bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl outline-none"
                placeholder="••••••••"
                onFocus={() => setActiveInput('pass')}
              />
              {activeInput === 'pass' && (
                <p className="text-[10px] text-emerald-500 font-bold mt-2">🛡️ FormRecall ignora campos de contraseña por defecto.</p>
              )}
            </div>
          </div>

          <button className="w-full mt-10 btn-primary py-4 uppercase tracking-widest text-xs">Simular Envío</button>
        </div>

        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-3xl">
          <p className="text-xs text-indigo-700 font-medium leading-relaxed">
            <b>Instrucciones:</b> Al escribir, el orbe violeta aparecerá. Significa que FormRecall está procesando el valor único. Si sales del campo y el valor es nuevo, se guardará en tu bóveda. Haz clic en el orbe para ir a la gestión.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BrowserSimulator;
