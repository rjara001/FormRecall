
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
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-black text-slate-900 tracking-tight text-xl">FormRecall</h1>
              <span className="bg-emerald-100 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-200">ACTIVO</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Engine v4.0.0 Stable</p>
          </div>
        </div>
        <nav className="flex space-x-2 p-1 bg-slate-100 rounded-2xl">
          <button 
            onClick={() => onTabChange(AppTab.VAULT)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${activeTab === AppTab.VAULT ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <span>Bóveda</span>
          </button>
          <button 
            onClick={() => onTabChange(AppTab.MONITOR)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${activeTab === AppTab.MONITOR ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <span>Monitor</span>
          </button>
          <button 
            onClick={() => onTabChange(AppTab.SETTINGS)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${activeTab === AppTab.SETTINGS ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:bg-white/50'}`}
          >
            <span>Ajustes</span>
          </button>
        </nav>
      </header>
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
};

export default Layout;
