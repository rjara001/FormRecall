
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import VaultManager from './components/VaultManager';
import BrowserSimulator from './components/BrowserSimulator';
import { SavedValue, AppTab } from './types';

const STORAGE_KEY = 'form_recall_v4_vault';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.VAULT);
  const [vault, setVault] = useState<SavedValue[]>([]);

  // Carga inicial
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setVault(parsed);
          console.log("Vault cargado:", parsed.length, "ítems");
        }
      } catch (e) {
        console.error("Error al cargar bóveda:", e);
      }
    } else {
      const welcomeEntry: SavedValue = {
        id: 'system-init-' + Date.now(),
        value: 'FormRecall v3.1 - Motor Listo 🚀',
        timestamp: new Date().toISOString(),
        usageCount: 1,
        isSystem: true
      };
      setVault([welcomeEntry]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([welcomeEntry]));
    }
  }, []);

  // Sincronización constante con LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
  }, [vault]);

  const handleCapture = useCallback((text: string) => {
    const val = text.trim();
    if (!val || val.length < 2) return;

    setVault(prev => {
      const exists = prev.find(v => v.value.toLowerCase() === val.toLowerCase());
      
      if (exists) {
        return prev.map(v => v.id === exists.id 
          ? { ...v, usageCount: v.usageCount + 1, timestamp: new Date().toISOString() } 
          : v
        );
      } else {
        const newVal: SavedValue = {
          id: Math.random().toString(36).substr(2, 9),
          value: val,
          timestamp: new Date().toISOString(),
          usageCount: 1
        };
        console.log("Nuevo valor capturado:", val);
        return [newVal, ...prev];
      }
    });
  }, []);

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
          <div className="max-w-md mx-auto bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black text-slate-800 mb-2">Configuración</h2>
            <p className="text-xs text-slate-400 mb-8 font-medium">Versión actual: 3.1.2</p>
            <button 
              onClick={() => { if(confirm('¿Vaciar la bóveda?')) setVault([]); }}
              className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all"
            >
              Resetear Bóveda
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
