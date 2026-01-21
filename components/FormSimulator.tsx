
import React, { useState } from 'react';
import { FormField, FormEntry, AutofillSuggestion } from '../types';
import { getSmartAutofillSuggestions } from '../services/geminiService';

interface FormSimulatorProps {
  onSaveEntry: (entry: Omit<FormEntry, 'id' | 'date'>) => void;
  history: FormEntry[];
}

// Added export default and completed the component structure
const FormSimulator: React.FC<FormSimulatorProps> = ({ onSaveEntry, history }) => {
  const [url, setUrl] = useState('https://mi-banco.online/solicitud');
  const [title, setTitle] = useState('Solicitud de Crédito');
  const [fields, setFields] = useState<FormField[]>([
    { name: 'nombre_completo', label: 'Nombre Completo', value: '', type: 'text' },
    { name: 'correo_electronico', label: 'Email Personal', value: '', type: 'email' },
    { name: 'fecha_nacimiento', label: 'Fecha de Nacimiento', value: '', type: 'date' },
    { name: 'ciudad_residencia', label: 'Ciudad Actual', value: '', type: 'text' },
    { name: 'codigo_postal', label: 'Código Postal', value: '', type: 'text' },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<AutofillSuggestion[]>([]);

  const handleInputChange = (name: string, value: string) => {
    setFields(prev => prev.map(f => f.name === name ? { ...f, value } : f));
  };

  const fillRandomData = () => {
    const mocks = [
      { name: 'nombre_completo', value: 'Juan Pérez García' },
      { name: 'correo_electronico', value: 'juan.perez@ejemplo.com' },
      { name: 'fecha_nacimiento', value: '1992-05-15' },
      { name: 'ciudad_residencia', value: 'Madrid' },
      { name: 'codigo_postal', value: '28001' },
    ];
    setFields(prev => prev.map(f => {
      const mock = mocks.find(m => m.name === f.name);
      return mock ? { ...f, value: mock.value } : f;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filledFields = fields.filter(f => f.value.trim() !== '');
    if (filledFields.length === 0) {
      alert('Por favor, rellena al menos un campo antes de guardar.');
      return;
    }
    onSaveEntry({
      pageUrl: url,
      pageTitle: title,
      fields: filledFields
    });
    alert('¡Datos guardados con éxito!');
    setFields(prev => prev.map(f => ({ ...f, value: '' })));
    setSuggestions([]);
  };

  const handleSmartAutofill = async () => {
    if (history.length === 0) {
      alert("No hay datos en el historial. Guarda algo primero.");
      return;
    }

    setIsAnalyzing(true);
    setSuggestions([]);

    try {
      const results = await getSmartAutofillSuggestions(
        fields.map(f => ({ name: f.name, label: f.label, type: f.type })),
        history
      );
      
      if (!results || results.length === 0) {
        alert("Gemini no encontró sugerencias basadas en tu historial actual.");
      } else {
        setSuggestions(results);
      }
    } catch (err: any) {
      if (err.message === "AUTH_ERROR") {
        // @ts-ignore - window.aistudio es inyectado externamente
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
           alert("Se requiere una API Key válida para usar la IA de Gemini en esta tarea. Por favor, selecciona una.");
           await window.aistudio.openSelectKey();
        } else {
           alert("Error de autenticación: No se pudo validar la API Key de Gemini.");
        }
      } else {
        console.error("Error al sugerir:", err);
        alert("Ocurrió un error al intentar conectar con la IA.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (s: AutofillSuggestion) => {
    setFields(prev => prev.map(f => f.name === s.fieldName ? { ...f, value: s.suggestedValue } : f));
    setSuggestions(prev => prev.filter(item => item.fieldName !== s.fieldName));
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-100 p-4 flex items-center space-x-4 border-b border-slate-200">
          <div className="flex space-x-2 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
          <div className="flex-1 bg-white rounded-xl border border-slate-200 px-4 py-2 flex items-center space-x-2 text-sm text-slate-400">
            <span className="text-emerald-500 font-bold">https://</span>
            <input 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-transparent outline-none text-slate-600 font-medium"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-black text-slate-800 bg-transparent border-none outline-none focus:ring-0 w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    placeholder={`Ingresa ${field.label.toLowerCase()}...`}
                  />
                  {suggestions.find(s => s.fieldName === field.name) && (
                    <div className="absolute top-0 right-0 h-full flex items-center pr-2">
                      <button
                        type="button"
                        onClick={() => applySuggestion(suggestions.find(s => s.fieldName === field.name)!)}
                        className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                        title={suggestions.find(s => s.fieldName === field.name)?.reason}
                      >
                        Sugerir ✨
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 pt-6">
            <button
              type="submit"
              className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg"
            >
              Enviar y Memorizar 💾
            </button>
            <button
              type="button"
              onClick={handleSmartAutofill}
              disabled={isAnalyzing}
              className={`px-8 py-3 ${isAnalyzing ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'} font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 flex items-center space-x-2`}
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></span>
                  <span>Analizando...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Autocompletado Inteligente</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={fillRandomData}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all"
            >
              Rellenar al azar 🎲
            </button>
          </div>
        </form>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-2xl">🤖</span>
            <h4 className="text-lg font-black text-indigo-900">Sugerencias de Gemini</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((s, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-indigo-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{s.fieldName}</span>
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                      {Math.round(s.confidence * 100)}% Match
                    </span>
                  </div>
                  <p className="text-slate-800 font-bold mb-1 truncate">{s.suggestedValue}</p>
                  <p className="text-[10px] text-slate-400 italic leading-tight">{s.reason}</p>
                </div>
                <button
                  onClick={() => applySuggestion(s)}
                  className="mt-4 w-full py-2 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                >
                  Aplicar este valor
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormSimulator;
