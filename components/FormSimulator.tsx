
import React, { useState, useEffect } from 'react';
import { FormField, FormEntry, AutofillSuggestion } from '../types';
import { getSmartAutofillSuggestions } from '../services/geminiService';

interface FormSimulatorProps {
  onSaveEntry: (entry: Omit<FormEntry, 'id' | 'date'>) => void;
  history: FormEntry[];
}

const FormSimulator: React.FC<FormSimulatorProps> = ({ onSaveEntry, history }) => {
  const [url, setUrl] = useState('https://shopping.example/checkout');
  const [title, setTitle] = useState('Secure Checkout - Example Store');
  const [fields, setFields] = useState<FormField[]>([
    { name: 'full_name', label: 'Full Name', value: '', type: 'text' },
    { name: 'user_email', label: 'Email Address', value: '', type: 'email' },
    { name: 'phone_num', label: 'Phone', value: '', type: 'tel' },
    { name: 'shipping_addr', label: 'Address', value: '', type: 'text' },
    { name: 'zip_code', label: 'Postal Code', value: '', type: 'text' },
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<AutofillSuggestion[]>([]);

  const handleInputChange = (name: string, value: string) => {
    setFields(prev => prev.map(f => f.name === name ? { ...f, value } : f));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEntry({
      pageUrl: url,
      pageTitle: title,
      fields: fields.filter(f => f.value.trim() !== '')
    });
    alert('Form data captured and stored in extension database!');
    // Clear form after submission
    setFields(prev => prev.map(f => ({ ...f, value: '' })));
  };

  const handleSmartAutofill = async () => {
    if (history.length === 0) {
      alert("No history found. Please fill some forms manually first.");
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

  const applyAllSuggestions = () => {
    setFields(prev => prev.map(f => {
      const suggestion = suggestions.find(s => s.fieldName === f.name);
      return suggestion ? { ...f, value: suggestion.suggestedValue } : f;
    }));
    setSuggestions([]);
  };

  return (
    <div className="space-y-6">
      <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100">
        <h2 className="text-xl font-bold mb-2">Browser Page Simulator</h2>
        <p className="text-indigo-100 text-sm mb-4">
          This simulates a real website where our extension would be active.
        </p>
        <div className="flex flex-col md:flex-row gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-md">
          <div className="flex-1">
            <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Current URL</label>
            <input 
              value={url} 
              onChange={(e) => setUrl(e.target.value)}
              className="bg-white/20 border-white/30 text-white w-full px-3 py-1.5 rounded outline-none placeholder-white/50 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="text-[10px] uppercase font-bold text-white/70 block mb-1">Page Title</label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white/20 border-white/30 text-white w-full px-3 py-1.5 rounded outline-none placeholder-white/50 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Form on Page</h3>
            <button 
              onClick={handleSmartAutofill}
              disabled={isAnalyzing || history.length === 0}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isAnalyzing 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 shadow-sm'
              }`}
            >
              {isAnalyzing ? '✨ Analyzing...' : '✨ Smart AI Autofill'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">{field.label}</label>
                <div className="relative">
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                  />
                  {suggestions.some(s => s.fieldName === field.name) && (
                    <div className="absolute top-1/2 -right-4 transform translate-x-full -translate-y-1/2">
                      <div className="animate-pulse w-3 h-3 bg-indigo-500 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button 
              type="submit"
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all transform active:scale-95 shadow-lg shadow-slate-200 mt-4"
            >
              Submit & Capture Data
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <h4 className="font-bold text-indigo-900 mb-3 flex items-center">
              <span className="mr-2">💡</span>
              AI Recommendations
            </h4>
            
            {suggestions.length > 0 ? (
              <div className="space-y-3">
                <button 
                  onClick={applyAllSuggestions}
                  className="w-full text-xs font-bold text-indigo-600 border border-indigo-200 bg-white py-2 rounded-lg hover:bg-indigo-100 mb-4"
                >
                  Apply All AI Suggestions
                </button>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {suggestions.map((s, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm text-xs">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-slate-700">{s.fieldName}</span>
                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded">{Math.round(s.confidence * 100)}% Match</span>
                      </div>
                      <p className="text-slate-500 italic mb-2">"{s.suggestedValue}"</p>
                      <button 
                        onClick={() => applySuggestion(s)}
                        className="w-full py-1.5 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-indigo-400 leading-relaxed">
                Fill a form and submit it to save data. Next time, use the Smart AI button to let Gemini map your saved data to this form's fields!
              </p>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-3">Extension Debugger</h4>
            <div className="text-[10px] font-mono bg-slate-900 text-emerald-400 p-3 rounded-lg overflow-x-auto">
              <p className="mb-1">{">"} EXT_READY: true</p>
              <p className="mb-1">{">"} DATABASE_CONNECTION: OK</p>
              <p className="mb-1">{">"} GEMINI_AI_SESSION: Active</p>
              <p className="text-slate-400">{">"} history_records: {history.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormSimulator;
