
import React, { useState } from 'react';
import { SavedValue } from '../types';

interface VaultManagerProps {
  vault: SavedValue[];
  onUpdate: (id: string, val: string) => void;
  onDelete: (id: string) => void;
}

const VaultManager: React.FC<VaultManagerProps> = ({ vault, onUpdate, onDelete }) => {
  const [search, setSearch] = useState('');

  const filtered = vault.filter(v => v.value.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="h-full flex flex-col p-8 space-y-6 overflow-hidden">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Tus Datos Guardados</h2>
          <p className="text-sm text-slate-400 font-medium">Gestiona los valores que FormRecall ha aprendido de ti.</p>
        </div>
        <div className="relative">
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-violet-500 w-48 shadow-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 pb-8">
        {filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
            <span className="text-6xl mb-4 opacity-50">🛡️</span>
            <p className="font-bold tracking-widest text-xs uppercase text-slate-400">La bóveda está vacía</p>
            <p className="text-[10px] mt-2 text-slate-300">Ve a la pestaña "Captura" y escribe algo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filtered.map(item => (
              <div 
                key={item.id} 
                className={`group p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  item.isSystem 
                    ? 'bg-violet-50 border-violet-100' 
                    : 'bg-white border-slate-200 hover:border-violet-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex-1 flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${
                    item.isSystem ? 'bg-violet-200 text-violet-700' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {item.isSystem ? 'SYS' : item.usageCount}
                  </div>
                  <input 
                    value={item.value}
                    onChange={(e) => onUpdate(item.id, e.target.value)}
                    disabled={item.isSystem}
                    className={`flex-1 bg-transparent border-none outline-none font-semibold transition-colors ${
                      item.isSystem ? 'text-violet-700' : 'text-slate-700 focus:text-violet-600'
                    }`}
                  />
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[9px] text-slate-300 font-bold mr-2">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!item.isSystem && (
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultManager;
