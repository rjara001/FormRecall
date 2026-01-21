
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import VaultManager from './components/VaultManager';
import BrowserSimulator from './components/BrowserSimulator';
import { SavedValue, AppTab } from './types';

const STORAGE_KEY = 'form_recall_v3_vault';

const App: React.FC = () => {
  // Establecemos VAULT como pestaña principal por defecto
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.VAULT);
  const [vault, setVault] = useState<SavedValue[]>([]);

  // Persistencia Local
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setVault(JSON.parse(saved));
      } catch (e) {
        console.error("Error cargando la bóveda:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
  }, [vault]);

  // Captura de valor único con lógica de normalización
  const handleCapture = useCallback((text: string) => {
    const val = text.trim();
    // Requisito: Valores de al menos 2 caracteres y no secretos (implícito en el componente)
    if (!val || val.length < 2) return;

    setVault(prev => {
      // Requisito: Solo valores únicos (case insensitive)
      const exists = prev.find(v => v.value.toLowerCase() === val.toLowerCase());
      
      if (exists) {
        // Si existe, solo actualizamos el contador y el timestamp de último uso
        return prev.map(v => v.id === exists.id 
          ? { ...v, usageCount: v.usageCount + 1, timestamp: new Date().toISOString() } 
          : v
        );
      } else {
        // Si es nuevo, lo agregamos al principio
        const newVal: SavedValue = {
          id: crypto.randomUUID(),
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
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">
              ⚠️
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">Zona de Peligro</h2>
            <p className="text-sm text-slate-400 mb-8 font-medium">Esta acción eliminará permanentemente todos los datos únicos capturados en tu dispositivo.</p>
            <button 
              onClick={() => { if(confirm('¿Estás seguro de que deseas vaciar tu bóveda? Esta acción no se puede deshacer.')) setVault([]); }}
              className="w-full py-4 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-100 active:scale-95"
            >
              Borrar toda mi Bóveda
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
