import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Film, Share2, Menu, Command, AlertCircle, Play, Loader2 } from 'lucide-react';

import { CommandPalette } from './components/CommandPalette';
import { TimelineDock } from './components/TimelineDock';
import { INITIAL_SCENE, MOCK_MOMENTS, VIBE_COLORS, getIcon } from './constants';
import { Scene, TimelineItem, Moment, Tab } from './types';
import { generateSceneDescription, generateVeoVideo } from './services/geminiService';

// -- Subcomponents (Inline for single file requirement structure, but kept clean) --

const SceneDNA = ({ scene, setScene }: { scene: Scene; setScene: (s: Scene) => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleMagicUpdate = async () => {
    setIsGenerating(true);
    const desc = await generateSceneDescription(scene);
    setScene({ ...scene, description: desc });
    setIsGenerating(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Route Type</label>
            <div className="grid grid-cols-2 gap-2">
              {['city', 'coastal', 'mountain', 'tunnel'].map((r) => (
                <button
                  key={r}
                  onClick={() => setScene({ ...scene, route: r as any })}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                    scene.route === r 
                      ? 'bg-white/10 border-cyan-500/50 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                      : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/20'
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Atmosphere</label>
             <div className="flex gap-2">
              {['noir', 'cyberpunk', 'retro'].map((v) => (
                <button
                  key={v}
                  onClick={() => setScene({ ...scene, vibe: v as any })}
                  className={`flex-1 p-2 rounded-md text-xs border transition-all ${
                    scene.vibe === v ? 'bg-purple-500/20 border-purple-500/50 text-purple-200' : 'bg-black/20 border-white/5 text-zinc-500'
                  }`}
                >
                  {v.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative h-full bg-zinc-900/50 border border-white/10 rounded-xl p-6 flex flex-col backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono text-zinc-400">SCENE DESCRIPTION</span>
                    <button 
                        onClick={handleMagicUpdate}
                        disabled={isGenerating}
                        className="text-cyan-400 hover:text-cyan-300 disabled:opacity-50"
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    </button>
                </div>
                <textarea
                    value={scene.description}
                    onChange={(e) => setScene({...scene, description: e.target.value})}
                    className="w-full h-full bg-transparent resize-none outline-none text-zinc-200 text-sm leading-relaxed placeholder-zinc-700"
                    placeholder="Describe your scene..."
                />
            </div>
        </div>
      </div>
    </div>
  );
};

const MomentLibrary = ({ onAdd }: { onAdd: (m: Moment) => void }) => {
  const [filter, setFilter] = useState('');
  
  const filtered = MOCK_MOMENTS.filter(m => m.title.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
       <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input 
                    type="text" 
                    placeholder="Search moments..." 
                    className="w-full bg-zinc-900/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                />
            </div>
            <div className="text-xs text-zinc-500 font-mono">
                {filtered.length} ITEMS
            </div>
       </div>
       
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pb-32">
            {filtered.map((moment) => (
                <motion.div
                    key={moment.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAdd(moment)}
                    className="bg-zinc-900/30 border border-white/5 hover:border-cyan-500/30 rounded-lg p-4 cursor-pointer group transition-all"
                >
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-cyan-400 transition-colors">
                            {getIcon(moment.icon)}
                        </div>
                        <span className="text-[10px] font-mono text-zinc-600 bg-white/5 px-2 py-0.5 rounded-full">{moment.duration}s</span>
                    </div>
                    <h3 className="text-sm font-medium text-zinc-200 group-hover:text-white mb-1">{moment.title}</h3>
                    <p className="text-xs text-zinc-500 line-clamp-2">{moment.description}</p>
                </motion.div>
            ))}
       </div>
    </div>
  );
};

const PreviewHUD = ({ videoUri, isLoading, prompt }: { videoUri: string | null, isLoading: boolean, prompt: string }) => {
    return (
        <div className="flex-1 flex flex-col relative bg-black">
            {/* Main Viewport */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                        <span className="text-sm text-cyan-400 font-mono tracking-widest animate-pulse">RENDERING NEURAL SCENE...</span>
                    </div>
                ) : videoUri ? (
                    <video 
                        src={videoUri} 
                        className="w-full h-full object-cover" 
                        controls 
                        autoPlay 
                        loop
                    />
                ) : (
                    <div className="text-zinc-600 text-sm font-mono flex flex-col items-center">
                        <Film className="w-12 h-12 mb-4 opacity-20" />
                        <span>NO SIGNAL</span>
                        <span className="text-xs opacity-50 mt-2">Generate a preview to see results</span>
                    </div>
                )}
                
                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] font-mono text-cyan-500/50">REC ●</span>
                             <span className="text-xl font-mono text-white/80">00:04:21:09</span>
                         </div>
                         <div className="flex gap-4">
                             <div className="w-24 h-8 border border-white/10 rounded-sm bg-black/20 backdrop-blur flex items-center justify-center">
                                 <span className="text-[10px] font-mono text-zinc-400">ISO 800</span>
                             </div>
                             <div className="w-24 h-8 border border-white/10 rounded-sm bg-black/20 backdrop-blur flex items-center justify-center">
                                 <span className="text-[10px] font-mono text-zinc-400">4K RAW</span>
                             </div>
                         </div>
                    </div>
                    
                    <div className="flex justify-between items-end">
                        <div className="w-64">
                            <div className="h-1 bg-white/10 w-full mb-1 overflow-hidden">
                                <div className="h-full bg-cyan-500 w-[60%] animate-pulse"></div>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-500">AUDIO LEVELS</span>
                        </div>
                        {prompt && (
                             <div className="max-w-md text-right">
                                 <span className="text-[9px] font-mono text-cyan-900/80 bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20 block truncate">
                                     {prompt}
                                 </span>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// -- Main App Component --

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dna');
  const [scene, setScene] = useState<Scene>(INITIAL_SCENE);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Video State
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  // Command Palette Toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addMoment = (moment: Moment) => {
    const newItem: TimelineItem = {
      ...moment,
      instanceId: Math.random().toString(36).substr(2, 9),
      startTime: timeline.reduce((acc, curr) => acc + curr.duration, 0)
    };
    setTimeline([...timeline, newItem]);
    showToast(`Added "${moment.title}" to timeline`);
  };

  const removeMoment = (id: string) => {
    setTimeline(timeline.filter(t => t.instanceId !== id));
  };
  
  const handleCopyPack = () => {
      const pack = JSON.stringify({ scene, timeline }, null, 2);
      navigator.clipboard.writeText(pack);
      showToast("Full Production Pack copied to clipboard");
  };

  const handleGenerateVideo = async () => {
    setActiveTab('preview');
    setIsRendering(true);
    setGeneratedVideo(null);
    try {
        const apiKey = await window.aistudio?.openSelectKey?.();
        // Race condition mitigation: Proceed optimistically if openSelectKey was called, 
        // relying on geminiService to check validity or throw specific error if it fails later.
        
        // Note: The geminiService.ts handles the key check and generation.
        // We just trigger it.
        const uri = await generateVeoVideo(scene, timeline);
        setGeneratedVideo(uri);
        showToast("Render complete!");
    } catch (e: any) {
        console.error(e);
        if (e.message.includes("Requested entity was not found")) {
             showToast("API Key invalid. Please select again.");
             // Simple retry prompt
             await window.aistudio?.openSelectKey?.();
        } else {
             showToast(e.message || "Rendering failed");
        }
    } finally {
        setIsRendering(false);
    }
  };

  return (
    <div className={`w-screen h-screen bg-black overflow-hidden flex flex-col relative bg-gradient-to-br ${VIBE_COLORS[scene.vibe]}`}>
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      {/* -- Header / Nav -- */}
      <header className="z-20 pt-6 pb-2 px-6 flex items-center justify-between">
         <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                 <Film className="w-5 h-5 text-black" />
             </div>
             <span className="font-bold text-lg tracking-tight">NightDrive<span className="font-light text-cyan-400">Studio</span></span>
         </div>
         
         <nav className="bg-zinc-900/80 backdrop-blur-md border border-white/10 p-1 rounded-full flex gap-1">
             {['dna', 'moments', 'preview'].map((tab) => (
                 <button
                    key={tab}
                    onClick={() => setActiveTab(tab as Tab)}
                    className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeTab === tab ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                 >
                    {activeTab === tab && (
                        <motion.div 
                            layoutId="activeTab"
                            className="absolute inset-0 bg-white/10 rounded-full"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    {tab.toUpperCase()}
                 </button>
             ))}
         </nav>
         
         <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsCmdOpen(true)}
                className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-md border border-white/5 hover:border-white/20"
             >
                 <Command className="w-3 h-3" />
                 <span>K</span>
             </button>
             <button 
                onClick={handleGenerateVideo}
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-cyan-400 transition-colors shadow-lg flex items-center gap-2"
             >
                 <span>RENDER</span>
                 <Sparkles className="w-3 h-3" />
             </button>
         </div>
      </header>

      {/* -- Main Content Area -- */}
      <main className="flex-1 overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
             <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
             >
                 {activeTab === 'dna' && <SceneDNA scene={scene} setScene={setScene} />}
                 {activeTab === 'moments' && <MomentLibrary onAdd={addMoment} />}
                 {activeTab === 'preview' && <PreviewHUD videoUri={generatedVideo} isLoading={isRendering} prompt={scene.description} />}
             </motion.div>
        </AnimatePresence>
      </main>

      {/* -- Timeline Dock -- */}
      <TimelineDock timeline={timeline} onRemoveItem={removeMoment} onCopyPack={handleCopyPack} />

      {/* -- Command Palette -- */}
      <CommandPalette 
        isOpen={isCmdOpen} 
        onClose={() => setIsCmdOpen(false)} 
        onAddMoment={addMoment}
        onGenerate={handleGenerateVideo}
        onSave={handleCopyPack}
      />

      {/* -- Toast Notification -- */}
      <AnimatePresence>
        {toastMessage && (
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-cyan-500/30 text-white px-6 py-3 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] flex items-center gap-3 backdrop-blur-xl"
            >
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-sm font-medium">{toastMessage}</span>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

export default App;
