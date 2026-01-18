
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HistoryTable from './components/HistoryTable';
import FormSimulator from './components/FormSimulator';
import { FormEntry, AppTab, FormField } from './types';

const STORAGE_KEY = 'form_recall_data';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [history, setHistory] = useState<FormEntry[]>([]);

  // Initialize data from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
  }, []);

  // Save to local storage whenever history changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleSaveEntry = (newEntry: Omit<FormEntry, 'id' | 'date'>) => {
    const entry: FormEntry = {
      ...newEntry,
      id: Math.random().toString(36).substring(2, 11),
      date: new Date().toISOString(),
    };
    setHistory(prev => [entry, ...prev]);
  };

  const handleDeleteEntry = (id: string) => {
    setHistory(prev => prev.filter(e => e.id !== id));
  };

  // Stats for dashboard
  const totalEntries = history.length;
  const uniqueSites = new Set(history.map(h => h.pageUrl)).size;
  const totalFields = history.reduce((acc, curr) => acc + curr.fields.length, 0);

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Bienvenido</h2>
          <p className="text-slate-500">Tu panel de control de FormRecall está listo.</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Última Actividad</p>
          <p className="text-sm font-medium text-slate-700">{history.length > 0 ? new Date(history[0].date).toLocaleDateString() : 'Sin registros'}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Capturas Totales', value: totalEntries, icon: '💾', color: 'bg-blue-500' },
          { label: 'Sitios Guardados', value: uniqueSites, icon: '🌐', color: 'bg-emerald-500' },
          { label: 'Datos Recordados', value: totalFields, icon: '📍', color: 'bg-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Guía de Inicio</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">1</div>
              <div>
                <p className="font-semibold text-slate-700">Abre el Simulador</p>
                <p className="text-sm text-slate-500">Ve a la pestaña de Simulador para actuar como si estuvieras en una web real.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">2</div>
              <div>
                <p className="font-semibold text-slate-700">Rellena y Guarda</p>
                <p className="text-sm text-slate-500">La extensión captura tus datos automáticamente al enviar el formulario.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">3</div>
              <div>
                <p className="font-semibold text-slate-700">Usa el Autocompletado</p>
                <p className="text-sm text-slate-500">En el próximo formulario, usa el botón "Smart AI" para que FormRecall haga el trabajo.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab(AppTab.SIMULATOR)}
              className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
            >
              Ir al Simulador
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-800">Capturas Recientes</h3>
          <div className="space-y-4">
            {history.length > 0 ? history.slice(0, 3).map((entry, i) => (
              <div key={i} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">🌐</div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-slate-700 truncate">{entry.pageTitle}</p>
                    <p className="text-xs text-slate-400 truncate">{entry.pageUrl}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xs font-bold text-indigo-500">{entry.fields.length} Campos</p>
                  <p className="text-[10px] text-slate-400">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
              </div>
            )) : (
              <p className="text-slate-400 italic text-sm py-8 text-center">Sin capturas recientes</p>
            )}
            {history.length > 3 && (
              <button 
                onClick={() => setActiveTab(AppTab.HISTORY)}
                className="w-full text-center text-sm font-semibold text-slate-500 hover:text-indigo-600 py-2 border-t border-slate-50"
              >
                Ver todo el historial
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === AppTab.DASHBOARD && renderDashboard()}
      {activeTab === AppTab.HISTORY && (
        <div className="space-y-6">
          <header>
            <h2 className="text-2xl font-bold text-slate-900">Historial de Formularios</h2>
            <p className="text-slate-500">Todos los datos que has ingresado capturados por FormRecall.</p>
          </header>
          <HistoryTable entries={history} onDelete={handleDeleteEntry} />
        </div>
      )}
      {activeTab === AppTab.SIMULATOR && (
        <div className="space-y-6">
          <header>
            <h2 className="text-2xl font-bold text-slate-900">Simulador de Extensión</h2>
            <p className="text-slate-500">Prueba cómo FormRecall captura y rellena datos en tiempo real.</p>
          </header>
          <FormSimulator onSaveEntry={handleSaveEntry} history={history} />
        </div>
      )}
      {activeTab === AppTab.SETTINGS && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Ajustes y Privacidad</h2>
          <p className="text-slate-500 max-w-lg mx-auto mb-8">
            Gestiona cómo tus datos se sincronizan y cómo FormRecall analiza los formularios. Actualmente todos los datos son locales.
          </p>
          <div className="grid gap-4 max-w-md mx-auto">
            <button className="flex justify-between items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50">
              <span className="font-semibold text-slate-700">Sincronizar con Cuenta Google</span>
              <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Beta</span>
            </button>
            <button 
              onClick={() => { if(confirm('¿Seguro?')) { setHistory([]); localStorage.removeItem(STORAGE_KEY); } }}
              className="flex justify-between items-center p-4 border border-slate-200 rounded-xl hover:bg-red-50 text-red-600"
            >
              <span className="font-semibold">Borrar Todos los Datos</span>
              <span className="text-xs bg-red-50 px-2 py-1 rounded">Acción Crítica</span>
            </button>
            <button className="flex justify-between items-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50">
              <span className="font-semibold text-slate-700">Exportar Historial (.json)</span>
              <span className="text-xs text-slate-500">Descargar</span>
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
