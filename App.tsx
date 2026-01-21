
import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import VaultManager from './components/VaultManager';
import ActivityMonitor from './components/ActivityMonitor';
import { SavedValue, AppTab, ActivityLog } from './types';

const STORAGE_KEY = 'form_recall_v4_vault';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.VAULT);
  const [vault, setVault] = useState<SavedValue[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  // Función para añadir logs al monitor
  const addLog = useCallback((msg: string, type: ActivityLog['type'] = 'intercept') => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      msg,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
  }, []);

  // MOTOR DE ESCUCHA GLOBAL (CONTENT SCRIPT SIMULATION)
  useEffect(() => {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const val = target.value;
        const name = target.name || target.id || target.placeholder || 'Campo desconocido';
        
        addLog(`Input detectado en "${name}": ${val.slice(0, 4)}***`, 'intercept');

        // Lógica de aprendizaje automático
        if (val.trim().length >= 4) {
          handleCapture(val);
        }
      }
    };

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLInputElement;
      if (target.tagName === 'INPUT') {
        const name = target.name || target.placeholder || target.id;
        addLog(`Campo enfocado: [${name}]. Analizando contexto...`, 'sync');
      }
    };

    window.addEventListener('input', handleInput, true);
    window.addEventListener('focus', handleFocus, true);

    addLog("Motor FormRecall v4.0.0 conectado satisfactoriamente.", "sync");

    return () => {
      window.removeEventListener('input', handleInput, true);
      window.removeEventListener('focus', handleFocus, true);
    };
  }, [addLog]);

  // Carga inicial de datos
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setVault(parsed);
          addLog(`Bóveda sincronizada: ${parsed.length} registros cargados.`, 'sync');
        }
      } catch (e) {
        addLog("Error al cargar la bóveda local.", "error");
      }
    } else {
      const init: SavedValue = {
        id: 'init',
        value: '¡Bienvenido a FormRecall!',
        timestamp: new Date().toISOString(),
        usageCount: 1,
        isSystem: true
      };
      setVault([init]);
    }
  }, [addLog]);

  // Guardado persistente
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
  }, [vault]);

  const handleCapture = useCallback((text: string) => {
    const val = text.trim();
    setVault(prev => {
      const exists = prev.find(v => v.value.toLowerCase() === val.toLowerCase());
      if (exists) return prev; // No duplicamos, ya se registra en el log

      const newVal: SavedValue = {
        id: Math.random().toString(36).substr(2, 9),
        value: val,
        timestamp: new Date().toISOString(),
        usageCount: 1
      };
      addLog(`Aprendido nuevo valor: "${val}"`, 'learn');
      return [newVal, ...prev];
    });
  }, [addLog]);

  const handleUpdate = (id: string, newValue: string) => {
    setVault(prev => prev.map(v => v.id === id ? { ...v, value: newValue } : v));
  };

  const handleDelete = (id: string) => {
    setVault(prev => prev.filter(v => v.id !== id));
    addLog(`Registro eliminado de la bóveda.`, 'sync');
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
      {activeTab === AppTab.MONITOR && (
        <ActivityMonitor logs={logs} />
      )}
      {activeTab === AppTab.SETTINGS && (
        <div className="p-12">
          <div className="max-w-md mx-auto bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl shadow-slate-200/50">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Configuración</h2>
            <p className="text-xs text-slate-400 mb-8 font-bold uppercase tracking-widest">Preferencia de la Extensión</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-slate-700">Autoguardado Inteligente</p>
                  <p className="text-[10px] text-slate-400 font-medium">Captura datos mientras escribes</p>
                </div>
                <div className="w-10 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-slate-700">Mapeo Gemini AI</p>
                  <p className="text-[10px] text-slate-400 font-medium">Analiza semánticamente los campos</p>
                </div>
                <div className="w-10 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-1 cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              <button 
                onClick={() => { if(confirm('¿Vaciar la bóveda permanentemente?')) setVault([]); }}
                className="w-full mt-6 py-4 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all text-sm"
              >
                Resetear Bóveda
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
