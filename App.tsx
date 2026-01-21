
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import VaultManager from './components/VaultManager';
import BrowserSimulator from './components/BrowserSimulator';
import { SavedValue, AppTab } from './types';

// Cambiamos a v4 para forzar una limpieza de caché y asegurar la nueva lógica
const STORAGE_KEY = 'form_recall_v4_vault';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.VAULT);
  const [vault, setVault] = useState<SavedValue[]>([]);

  // Efecto de carga inicial
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setVault(parsed);
        }
      } catch (e) {
        console.error("Error al cargar bóveda:", e);
      }
    } else {
      // Valor por defecto para indicar que la versión cambió y el sistema funciona
      const welcomeEntry: SavedValue = {
        id: 'system-init',
        value: 'FormRecall v3.1 Activado 🚀',
        timestamp: new Date().toISOString(),
        usageCount: 1,
        isSystem: true
      };
      setVault([welcomeEntry]);
    }
  }, []);

  // Sincronización con LocalStorage
  useEffect(() => {
    if (vault.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
    }
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
          id: Math.random().toString(36).substr(2, 9), // Fallback simple para ID
          value: val,
          timestamp: new Date().toISOString(),
          usageCount: 1
        };
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
        <div className="p-12 text-center animate-in fade-in duration-500">
          <div className="max-w-md mx-auto bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h2 className="text-xl font-black text-slate-800 mb-2">Configuración</h2>
            <p className="text-xs text-slate-400 mb-8 font-medium italic">Versión del motor: 3.1.0-alpha</p>
            <button 
              onClick={() => { if(confirm('¿Vaciar la bóveda?')) setVault([]); }}
              className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
              Borrar Datos de Bóveda
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
