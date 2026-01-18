
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HistoryTable from './components/HistoryTable';
import FormSimulator from './components/FormSimulator';
import { FormEntry, AppTab } from './types';

const STORAGE_KEY = 'form_recall_vault';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [history, setHistory] = useState<FormEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Error al cargar la bóveda de FormRecall", e);
      }
    }
  }, []);

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
    if(confirm('¿Estás seguro de que quieres olvidar estos datos?')) {
      setHistory(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `form_recall_backup_${new Date().toISOString().slice(0,10)}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const totalEntries = history.length;
  const uniqueSites = new Set(history.map(h => h.pageUrl)).size;
  const totalFields = history.reduce((acc, curr) => acc + curr.fields.length, 0);

  const renderDashboard = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Tu Bóveda Inteligente</h2>
          <p className="text-slate-500 text-lg mt-1 font-medium">FormRecall está gestionando tu identidad digital.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-bold text-slate-700">Protección en tiempo real</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Formularios Recordados', value: totalEntries, icon: '📑', color: 'from-blue-500 to-indigo-600' },
          { label: 'Ecosistema de Sitios', value: uniqueSites, icon: '🌎', color: 'from-emerald-400 to-teal-600' },
          { label: 'Datos en Bóveda', value: totalFields, icon: '🛡️', color: 'from-amber-400 to-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-all">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 -mr-16 -mt-16 rounded-full group-hover:scale-110 transition-transform`}></div>
            <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg mb-6`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-4xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative">
          <div className="absolute top-10 right-10 text-4xl opacity-10">✨</div>
          <h3 className="text-2xl font-black mb-8 text-slate-800">Próximos pasos</h3>
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black shrink-0 shadow-sm">1</div>
              <div>
                <p className="font-bold text-slate-800 text-lg">Visita el Simulador</p>
                <p className="text-slate-500 mt-1 leading-relaxed">Prueba a llenar cualquier dato. FormRecall detectará el envío y guardará cada campo por ti.</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black shrink-0 shadow-sm">2</div>
              <div>
                <p className="font-bold text-slate-800 text-lg">Activa la Sugerencia IA</p>
                <p className="text-slate-500 mt-1 leading-relaxed">En un nuevo formulario, usa "Sugerir con IA". Gemini buscará en tu historia datos que encajen semánticamente.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab(AppTab.SIMULATOR)}
              className="mt-4 w-full bg-indigo-600 text-white py-5 rounded-3xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest"
            >
              Comenzar ahora
            </button>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 opacity-10 -mr-32 -mb-32 rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
          <h3 className="text-2xl font-black mb-8 text-white relative z-10">Últimas capturas</h3>
          <div className="space-y-4 relative z-10">
            {history.length > 0 ? history.slice(0, 4).map((entry, i) => (
              <div key={i} className="flex justify-between items-center p-5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 hover:border-white/10 group cursor-pointer">
                <div className="flex items-center space-x-4 overflow-hidden">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 text-xl">🌐</div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-white truncate">{entry.pageTitle}</p>
                    <p className="text-xs text-indigo-300 truncate font-mono">{entry.pageUrl}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-xs font-black text-indigo-400">{entry.fields.length} DATOS</p>
                  <p className="text-[10px] text-white/30 mt-0.5">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
              </div>
            )) : (
              <div className="py-20 text-center">
                <p className="text-white/20 italic text-lg">No hay registros aún</p>
                <p className="text-white/10 text-sm mt-2">Tus datos aparecerán aquí en cuanto empieces a navegar.</p>
              </div>
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
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <header className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-slate-900">Historial Detallado</h2>
              <p className="text-slate-500 mt-1">Explora, expande y gestiona cada dato que FormRecall ha memorizado.</p>
            </div>
            <button 
              onClick={handleExport}
              className="bg-white border-2 border-slate-200 px-6 py-2.5 rounded-2xl text-sm font-bold text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all flex items-center space-x-2"
            >
              <span>📥</span> <span>Exportar</span>
            </button>
          </header>
          <HistoryTable entries={history} onDelete={handleDeleteEntry} />
        </div>
      )}
      {activeTab === AppTab.SIMULATOR && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <header>
            <h2 className="text-3xl font-black text-slate-900 text-center">Laboratorio FormRecall</h2>
            <p className="text-slate-500 text-center mt-2 max-w-xl mx-auto">Esta página simula un sitio web externo para probar cómo la extensión captura y autocompleta formularios.</p>
          </header>
          <FormSimulator onSaveEntry={handleSaveEntry} history={history} />
        </div>
      )}
      {activeTab === AppTab.SETTINGS && (
        <div className="bg-white rounded-[3rem] p-20 text-center border border-slate-100 shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-4xl mx-auto mb-10 shadow-inner">⚙️</div>
          <h2 className="text-4xl font-black text-slate-900 mb-6">Configuración de Seguridad</h2>
          <p className="text-slate-500 max-w-lg mx-auto mb-12 text-lg leading-relaxed">
            FormRecall almacena tus datos localmente en este dispositivo. Tus secretos están seguros aquí.
          </p>
          <div className="grid gap-6 max-w-md mx-auto">
            <div className="p-6 bg-slate-50 rounded-3xl flex justify-between items-center">
              <div className="text-left">
                <p className="font-black text-slate-800 uppercase tracking-widest text-[10px]">Almacenamiento</p>
                <p className="text-sm text-slate-500">Local (Navegador)</p>
              </div>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black">ACTIVO</span>
            </div>
            <button 
              onClick={() => { if(confirm('¿BORRAR TODO EL HISTORIAL? Esta acción no se puede deshacer.')) { setHistory([]); localStorage.removeItem(STORAGE_KEY); } }}
              className="group w-full flex justify-between items-center p-6 bg-red-50 hover:bg-red-100 rounded-3xl border border-red-100 transition-all"
            >
              <div className="text-left">
                <p className="font-black text-red-600 uppercase tracking-widest text-[10px]">Zona de Peligro</p>
                <p className="text-sm text-red-500 font-bold group-hover:translate-x-1 transition-transform">Purgar Bóveda Completa</p>
              </div>
              <span className="text-xl">🔥</span>
            </button>
            <p className="text-[10px] text-slate-300 mt-6 font-mono uppercase tracking-widest">FormRecall v1.0.0 Stable Build</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
