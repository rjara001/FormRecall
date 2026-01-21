
import React, { useState } from 'react';
import { SavedValue } from '../types';

interface VaultManagerProps {
  vault: SavedValue[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updated: Partial<SavedValue>) => void;
}

const VaultManager: React.FC<VaultManagerProps> = ({ vault, onDelete, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVault = vault.filter(v => 
    v.value.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-8 space-y-6 overflow-hidden">
      <header className="flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Mi Bóveda de Datos</h2>
          <p className="text-xs text-slate-400">Gestiona tus valores únicos capturados.</p>
        </div>
        <div className="flex bg-slate-100 rounded-xl px-4 py-2 border border-slate-200">
          <span className="mr-2">🔍</span>
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar en la bóveda..."
            className="bg-transparent border-none outline-none text-xs font-bold w-48"
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {filteredVault.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-300">
            <span className="text-5xl mb-4">📭</span>
            <p className="font-bold uppercase tracking-widest text-[10px]">Sin coincidencias en la bóveda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredVault.map(item => (
              <div key={item.id} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all group flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest px-2 py-0.5 bg-indigo-50 rounded-full">{item.category}</span>
                    <span className="text-[9px] text-slate-300 italic">{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                  <input 
                    value={item.value}
                    onChange={(e) => onUpdate(item.id, { value: e.target.value })}
                    className="text-sm font-bold text-slate-700 bg-transparent border-none outline-none focus:text-indigo-600 w-full"
                  />
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    🗑️
                  </button>
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
