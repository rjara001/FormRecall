
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import VaultManager from './components/VaultManager';
import BrowserSimulator from './components/BrowserSimulator';
import { SavedValue, AppTab } from './types';

const STORAGE_KEY = 'form_recall_v3_vault';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.VAULT);
  const [vault, setVault] = useState<SavedValue[]>([]);

  // Persistencia
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setVault(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
  }, [vault]);

  // Captura de valor único
  const handleCapture = (text: string) => {
    const val = text.trim();
    if (!val || val.length < 2) return;

    // Verificar unicidad (case insensitive)
    const exists = vault.find(v => v.value.toLowerCase() === val.toLowerCase());
    
    if (exists) {
      // Si existe, aumentamos el contador de uso
      setVault(prev => prev.map(v => v.id === exists.id ? { ...v, usageCount: v.usageCount + 1 } : v));
    } else {
      // Si es nuevo, lo guardamos
      const newVal: SavedValue = {
        id: crypto.randomUUID(),
        value: val,
        timestamp: new Date().toISOString(),
        usageCount: 1
      };
      setVault(prev => [newVal, ...prev]);
    }
  };

  const handleUpdate = (id: string, newValue: string) => {
    setVault(prev => prev.map(v => v.id === id ? { ...v, value: newValue } : v));
  };

  const handleDelete = (id: string) => {
    setVault(prev => prev.filter(v => v.id !== id));
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === AppTab.VAULT && (
        <VaultManager 
          vault={vault} 
          onUpdate={handleUpdate} 
          onDelete={handleDelete} 
        />
      )}
      {activeTab === AppTab.CAPTURE_DEMO && (
        <BrowserSimulator 
          onCapture={handleCapture} 
          vault={vault} 
          onGoToVault={() => setActiveTab(AppTab.VAULT)}
        />
      )}
      {activeTab === AppTab.SETTINGS && (
        <div className="p-12 text-center">
          <h2 className="text-xl font-bold mb-6">Configuración de Privacidad</h2>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-left max-w-md mx-auto">
            <p className="text-sm text-slate-500 mb-6">Al activar esta opción, FormRecall ignorará automáticamente cualquier campo que detecte como sensible.</p>
            <button 
              onClick={() => { if(confirm('¿Seguro?')) setVault([]); }}
              className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
            >
              Borrar todos mis datos
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
