import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Clock, X, Play, Copy } from 'lucide-react';
import { TimelineItem } from '../types';
import { getIcon } from '../constants';

interface TimelineDockProps {
  timeline: TimelineItem[];
  onRemoveItem: (id: string) => void;
  onCopyPack: () => void;
}

export const TimelineDock: React.FC<TimelineDockProps> = ({ timeline, onRemoveItem, onCopyPack }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const totalDuration = timeline.reduce((acc, item) => acc + item.duration, 0);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: 0 }} // Always docked at bottom
      className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
    >
      <div className="pointer-events-auto w-full max-w-5xl mx-auto px-4">
        {/* Handle */}
        <div className="flex justify-center">
            <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-zinc-900/90 border-t border-x border-white/10 rounded-t-xl px-6 py-1 text-zinc-400 hover:text-white transition-colors flex items-center gap-2 backdrop-blur-md"
            >
            <span className="text-xs font-mono tracking-widest uppercase">Timeline</span>
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
        </div>

        {/* Dock Content */}
        <motion.div
          initial={{ height: 180 }}
          animate={{ height: isExpanded ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-zinc-900/90 border-t border-x border-white/10 rounded-t-lg backdrop-blur-xl overflow-hidden shadow-2xl relative"
        >
          <div className="h-full flex flex-col">
            {/* Header/Stats */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-black/20">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <Clock className="w-3 h-3" />
                  <span>{totalDuration}s TOTAL</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                  <span>{timeline.length} CLIPS</span>
                </div>
              </div>
              
              <button 
                onClick={onCopyPack}
                className="flex items-center gap-2 text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-950/30 px-3 py-1.5 rounded-full border border-cyan-500/20"
              >
                <Copy className="w-3 h-3" />
                <span>COPY PACK</span>
              </button>
            </div>

            {/* Timeline Visualizer */}
            <div className="flex-1 overflow-x-auto p-4 flex items-center gap-1 scrollbar-hide">
              {timeline.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-sm italic">
                  Drag moments here or use ⌘K to add
                </div>
              ) : (
                timeline.map((item, index) => (
                  <motion.div
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    key={item.instanceId}
                    className="relative group shrink-0"
                    style={{ width: `${Math.max(item.duration * 10, 60)}px` }} // Dynamic width based on duration
                  >
                    <div className={`h-20 rounded-md border border-white/10 bg-gradient-to-br ${
                      index % 2 === 0 ? 'from-zinc-800 to-zinc-900' : 'from-zinc-800 to-zinc-800'
                    } p-2 flex flex-col justify-between overflow-hidden relative group-hover:border-cyan-500/50 transition-colors cursor-pointer`}>
                      <div className="flex items-center justify-between text-zinc-400 group-hover:text-cyan-400">
                        {getIcon(item.icon)}
                        <span className="text-[9px] font-mono opacity-50">{item.duration}s</span>
                      </div>
                      <span className="text-[10px] font-medium leading-tight text-zinc-300 line-clamp-2">
                        {item.title}
                      </span>
                      
                      {/* Hover Remove */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemoveItem(item.instanceId); }}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500 text-red-200 hover:text-white p-1 rounded transition-all"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    
                    {/* Connector Line */}
                    {index < timeline.length - 1 && (
                      <div className="absolute top-1/2 -right-1 w-2 h-0.5 bg-white/10 z-10"></div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Time Ticks */}
            <div className="h-6 border-t border-white/5 flex items-center px-4 overflow-hidden">
                <div className="flex gap-[40px] text-[9px] font-mono text-zinc-600">
                   {Array.from({length: 20}).map((_, i) => (
                       <span key={i}>00:{String(i * 5).padStart(2, '0')}</span>
                   ))}
                </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
