
import React from 'react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const tabs = [
    { id: AppTab.BROWSER, label: 'Navegador', icon: '🌐' },
    { id: AppTab.VAULT, label: 'Mi Bóveda', icon: '🛡️' },
    { id: AppTab.SETTINGS, label: 'Ajustes', icon: '⚙️' },
  ];

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">FR</div>
          <h1 className="font-black text-slate-800 tracking-tight">FormRecall <span className="text-indigo-600 text-[10px] ml-1 uppercase">v2.0</span></h1>
        </div>
        <nav className="flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:bg-slate-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="flex-1 overflow-hidden relative">
        {children}
      </main>
    </div>
  );
};

export default Layout;
