
import React from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const tabs = [
    { id: AppTab.DASHBOARD, label: 'Panel', icon: '📊' },
    { id: AppTab.HISTORY, label: 'Historial', icon: '📜' },
    { id: AppTab.SIMULATOR, label: 'Simulador', icon: '🌐' },
    { id: AppTab.SETTINGS, label: 'Ajustes', icon: '⚙️' },
  ];

  return (
    <div className="h-full flex flex-row bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar - Ahora con h-full para ocupar todo el popup */}
      <nav className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 space-y-2 h-full">
        <div className="flex items-center space-x-2 px-2 py-4 mb-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-200">
            FR
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">FormRecall</h1>
            <p className="text-xs text-slate-400">Intelligent Autofill</p>
          </div>
        </div>

        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white text-xs shadow-md">
            <p className="font-medium">Estado Pro</p>
            <p className="opacity-80 mt-1">Llenado inteligente activo.</p>
          </div>
        </div>
      </nav>

      {/* Main Content - Con overflow-y-auto para permitir scroll interno */}
      <main className="flex-1 overflow-y-auto p-8 h-full custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
