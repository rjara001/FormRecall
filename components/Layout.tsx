
import React from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <header className="px-8 py-5 flex items-center justify-between border-b border-slate-200 bg-white shadow-sm z-50">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
            <span className="text-lg font-black">F</span>
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 tracking-tight">FormRecall Vault</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Memoria Activa</p>
          </div>
        </div>
        <nav className="flex space-x-1 p-1 bg-slate-100 rounded-xl">
          <button 
            onClick={() => onTabChange(AppTab.VAULT)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === AppTab.VAULT ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            🛡️ Bóveda
          </button>
          <button 
            onClick={() => onTabChange(AppTab.CAPTURE_DEMO)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === AppTab.CAPTURE_DEMO ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            ⚡ Captura
          </button>
          <button 
            onClick={() => onTabChange(AppTab.SETTINGS)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === AppTab.SETTINGS ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            ⚙️ Ajustes
          </button>
        </nav>
      </header>
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default Layout;
