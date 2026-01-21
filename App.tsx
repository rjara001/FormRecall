
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import BrowserSimulator from './components/BrowserSimulator';
import VaultManager from './components/VaultManager';
import { SavedValue, AppTab } from './types';

const STORAGE_KEY = 'form_recall_vault_v2';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.BROWSER);
  const [vault, setVault] = useState<SavedValue[]>([]);

  // Cargar datos
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setVault(JSON.parse(saved));
    } else {
      // Datos iniciales de ejemplo
      setVault([
        { id: '1', value: 'Juan Pérez', category: 'Nombre', timestamp: new Date().toISOString() },
        { id: '2', value: 'juan@email.com', category: 'Email', timestamp: new Date().toISOString() }
      ]);
    }
  }, []);

  // Guardar datos
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
  }, [vault]);

  const handleCapture = (newValue: string) => {
    const normalized = newValue.trim();
    if (!normalized) return;

    // Solo guardar si es único
    const exists = vault.some(v => v.value.toLowerCase() === normalized.toLowerCase());
    if (!exists) {
      const entry: SavedValue = {
        id: Math.random().toString(36).substr(2, 9),
        value: normalized,
        category: 'Sin categorizar',
        timestamp: new Date().toISOString()
      };
      setVault(prev => [entry, ...prev]);
    }
  };

  const handleUpdateValue = (id: string, updated: Partial<SavedValue>) => {
    setVault(prev => prev.map(v => v.id === id ? { ...v, ...updated } : v));
  };

  const handleDeleteValue = (id: string) => {
    setVault(prev => prev.filter(v => v.id !== id));
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === AppTab.BROWSER && (
        <BrowserSimulator 
          onCapture={handleCapture} 
          vault={vault} 
          onGoToVault={() => setActiveTab(AppTab.VAULT)} 
        />
      )}
      {activeTab === AppTab.VAULT && (
        <VaultManager 
          vault={vault} 
          onDelete={handleDeleteValue} 
          onUpdate={handleUpdateValue} 
        />
      )}
      {activeTab === AppTab.SETTINGS && (
        <div className="p-10 text-center">
          <h2 className="text-2xl font-bold mb-4">Configuración</h2>
          <button 
            onClick={() => { if(confirm('¿Borrar todo?')) setVault([]); }}
            className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
          >
            Vaciar Bóveda Totalmente
          </button>
        </div>
      )}
    </Layout>
  );
};

export default App;
