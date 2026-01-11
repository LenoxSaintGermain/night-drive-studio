import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Film, Save, X, Command } from 'lucide-react';
import { MOCK_MOMENTS } from '../constants';
import { Moment } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMoment: (moment: Moment) => void;
  onGenerate: () => void;
  onSave: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ 
  isOpen, onClose, onAddMoment, onGenerate, onSave 
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredMoments = MOCK_MOMENTS.filter(m => 
    m.title.toLowerCase().includes(query.toLowerCase()) || 
    m.description.toLowerCase().includes(query.toLowerCase())
  );

  const actions = [
    { label: 'Generate Video', icon: Film, action: onGenerate },
    { label: 'Save Project', icon: Save, action: onSave },
  ].filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  const allItems = [...actions.map(a => ({ type: 'action', ...a })), ...filteredMoments.map(m => ({ type: 'moment', ...m }))];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % allItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = allItems[selectedIndex];
        if (item) {
          if (item.type === 'action') {
            // @ts-ignore
            item.action();
          } else {
            // @ts-ignore
            onAddMoment(item);
          }
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allItems, selectedIndex, onClose, onAddMoment]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            className="w-full max-w-xl bg-zinc-900/90 border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center px-4 py-3 border-b border-white/5">
              <Search className="w-5 h-5 text-zinc-400 mr-3" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search moments..."
                className="bg-transparent border-none outline-none text-white placeholder-zinc-500 w-full text-lg"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-1 text-xs text-zinc-500 bg-white/5 px-2 py-1 rounded">
                <span className="text-[10px]">ESC</span>
              </div>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto">
              {allItems.length === 0 ? (
                <div className="px-4 py-8 text-center text-zinc-500">No results found</div>
              ) : (
                <ul className="py-2">
                  {allItems.map((item, index) => (
                    <li
                      key={index}
                      className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${
                        index === selectedIndex ? 'bg-cyan-500/10 border-l-2 border-cyan-400' : 'hover:bg-white/5 border-l-2 border-transparent'
                      }`}
                      onClick={() => {
                        if (item.type === 'action') {
                          // @ts-ignore
                          item.action();
                        } else {
                          // @ts-ignore
                          onAddMoment(item);
                        }
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="flex items-center gap-3">
                         {/* @ts-ignore */}
                        {item.type === 'action' ? (
                            // @ts-ignore
                           <item.icon className="w-4 h-4 text-cyan-400" />
                        ) : (
                           <Plus className="w-4 h-4 text-purple-400" />
                        )}
                         {/* @ts-ignore */}
                        <span className={index === selectedIndex ? 'text-white' : 'text-zinc-300'}>{item.label || item.title}</span>
                      </div>
                      {/* @ts-ignore */}
                      {item.type === 'moment' && (
                        <span className="text-xs text-zinc-600 uppercase tracking-wider">Add Moment</span>
                      )}
                       {/* @ts-ignore */}
                       {item.type === 'action' && (
                        <span className="text-xs text-zinc-600 uppercase tracking-wider">Command</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="px-4 py-2 bg-black/20 text-[10px] text-zinc-500 flex justify-between">
              <span>Use arrows to navigate</span>
              <span>Enter to select</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
