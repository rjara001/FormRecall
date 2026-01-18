
import React, { useState, useEffect } from 'react';
import { FormField, FormEntry, AutofillSuggestion } from '../types';
import { getSmartAutofillSuggestions } from '../services/geminiService';

interface FormSimulatorProps {
  onSaveEntry: (entry: Omit<FormEntry, 'id' | 'date'>) => void;
  history: FormEntry[];
}

const FormSimulator: React.FC<FormSimulatorProps> = ({ onSaveEntry, history }) => {
  const [url, setUrl] = useState('https://servicios.online/registro');
  const [title, setTitle] = useState('Registro de Usuario');
  const [fields, setFields] = useState<FormField[]>([
    { name: 'nombre_completo', label: 'Nombre Completo', value: '', type: 'text' },
    { name: 'correo_electronico', label: 'Email', value: '', type: 'email' },
    { name: 'fecha_nacimiento', label: 'Fecha de Nacimiento', value: '', type: 'date' },
    { name: 'ciudad_residencia', label: 'Ciudad', value: '', type: 'text' },
    { name: 'codigo_postal', label: 'Código Postal', value: '', type: 'text' },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<AutofillSuggestion[]>([]);

  const handleInputChange = (name: string, value: string) => {
    setFields(prev => prev.map(f => f.name === name ? { ...f, value } : f));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filledFields = fields.filter(f => f.value.trim() !== '');
    if (filledFields.length === 0) {
      alert('Por favor, rellena al menos un campo.');
      return;
    }
    onSaveEntry({
      pageUrl: url,
      pageTitle: title,
      fields: filledFields
    });
    alert('¡Datos capturados con éxito por FormRecall!');
    setFields(prev => prev.map(f => ({ ...f, value: '' })));
    setSuggestions([]);
  };

  const handleSmartAutofill = async () => {
    if (history.length === 0) {
      alert("No hay historial guardado. Rellena algunos formularios manualmente primero.");
      return;
    }
    setIsAnalyzing(true);
    try {
      const results = await getSmartAutofillSuggestions(
        fields.map(f => ({ name: f.name, label: f.label, type: f.type })),
        history
      );
      setSuggestions(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (s: AutofillSuggestion) => {
    setFields(prev => prev.map(f => f.name === s.fieldName ? { ...f, value: s.suggestedValue } : f));
    setSuggestions(prev => prev.filter(item => item.fieldName !== s.fieldName));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Mock Browser UI */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-100 p-4 flex items-center space-x-4 border-b border-slate-200">
          <div className="flex space-x-2 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
          <div className="flex-1 bg-white rounded-xl border border-slate-200 px-4 py-2 flex items-center space-x-2 text-sm text-slate-400">
            <span className="text-emerald-500">🔒</span>
            <input 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-600 font-medium"
            />
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-200 cursor-pointer hover:rotate-12 transition-transform">
            FR
          </div>
        </div>

        <div className="p-10 grid lg:grid-cols-5 gap-12 bg-white">
          <div className="lg:col-span-3">
            <header className="mb-10">
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl font-black text-slate-900 w-full outline-none focus:text-indigo-600 transition-colors"
              />
              <p className="text-slate-400 mt-2">Este es un formulario de prueba para simular la captura de datos.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              {fields.map((field) => {
                const suggestion = suggestions.find(s => s.fieldName === field.name);
                return (
                  <div key={field.name} className="relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">
                      {field.label}
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        className={`w-full px-5 py-4 bg-slate-50 border ${suggestion ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200'} rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-500 transition-all outline-none font-medium text-slate-700`}
                        placeholder={`Ingresa tu ${field.label.toLowerCase()}...`}
                      />
                      {suggestion && (
                        <button
                          type="button"
                          onClick={() => applySuggestion(suggestion)}
                          className="absolute right-4 bg-indigo-600 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-700 animate-bounce"
                        >
                          LLENAR IA
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button 
                  type="submit"
                  className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black hover:bg-slate-800 transition-all transform active:scale-[0.98] shadow-xl shadow-slate-200 uppercase tracking-widest"
                >
                  Enviar y Guardar
                </button>
                <button 
                  type="button"
                  onClick={handleSmartAutofill}
                  disabled={isAnalyzing}
                  className={`px-8 py-4 rounded-2xl font-bold transition-all border-2 ${
                    isAnalyzing 
                    ? 'bg-slate-100 border-slate-100 text-slate-400 cursor-not-allowed'
                    : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  {isAnalyzing ? '✨ Analizando...' : '✨ Sugerir con IA'}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🤖</div>
              <h4 className="font-black text-xl mb-4 flex items-center">
                Asistente FormRecall
              </h4>
              
              {suggestions.length > 0 ? (
                <div className="space-y-4 relative z-10">
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    Hemos encontrado coincidencias en tu historial para estos campos:
                  </p>
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                    {suggestions.map((s, idx) => (
                      <div key={idx} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-white text-xs uppercase tracking-tighter">{s.fieldName}</span>
                          <span className="text-[9px] bg-indigo-400/50 text-white px-2 py-0.5 rounded-full font-bold">
                            {Math.round(s.confidence * 100)}% Match
                          </span>
                        </div>
                        <p className="text-white font-medium mb-3 text-sm">"{s.suggestedValue}"</p>
                        <button 
                          onClick={() => applySuggestion(s)}
                          className="w-full py-2 bg-white text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-50 transition-colors uppercase"
                        >
                          Aplicar este dato
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-indigo-100 text-sm leading-relaxed">
                    FormRecall está escuchando... rellena cualquier formulario y lo recordaré por ti.
                  </p>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 italic text-xs text-indigo-200">
                    "La próxima vez que veas un campo similar, Gemini mapeará tus datos automáticamente sin importar cómo se llame el input."
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                Estado de la Extensión
              </h4>
              <div className="space-y-3 font-mono text-[10px] text-slate-500">
                <div className="flex justify-between">
                  <span>Modo:</span>
                  <span className="text-indigo-600 font-bold">Simulación Activa</span>
                </div>
                <div className="flex justify-between">
                  <span>IA Engine:</span>
                  <span className="text-indigo-600 font-bold">Gemini 3 Flash</span>
                </div>
                <div className="flex justify-between">
                  <span>Memoria:</span>
                  <span className="text-indigo-600 font-bold">{history.length} sesiones</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSimulator;
