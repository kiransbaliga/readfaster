import { useState, useMemo, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, RotateCcw, Gauge, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ControlsProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    onSkipBack: () => void;
    onReset: () => void;
    wpm: number;
    onWpmChange: (wpm: number) => void;
    progress: number;
    onSeek: (value: number) => void;
    
    // Extended props for Claude features
    words: string[];
    index: number;
    onSeekIndex: (idx: number) => void;
    scale: number;
    onScaleChange: (scale: number) => void;
}

export function Controls({
    isPlaying,
    onPlayPause,
    onSkipBack,
    onReset,
    wpm,
    onWpmChange,
    progress,
    onSeek,
    words,
    index,
    onSeekIndex,
    scale,
    onScaleChange
}: ControlsProps) {
    const [showContext, setShowContext] = useState(false);
    const activeWordRef = useRef<HTMLSpanElement>(null);
    const contextContainerRef = useRef<HTMLDivElement>(null);

    // Speed presets
    const presets = [250, 350, 450, 600];

    // Compute window of surrounding words
    const surroundingWords = useMemo(() => {
        if (!words || words.length === 0) return [];
        const windowSize = 250;
        const start = Math.max(0, index - 100);
        const end = Math.min(words.length, index + windowSize - 100);
        
        return words.slice(start, end).map((word, i) => ({
            word,
            globalIndex: start + i
        }));
    }, [words, index]);

    // Keep active word scrolled into view within the drawer
    useEffect(() => {
        if (showContext && activeWordRef.current && contextContainerRef.current) {
            activeWordRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }, [index, showContext]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-3xl mx-auto mt-6 px-6 relative z-20"
        >
            {/* Progress Slider Bar */}
            <div className="mb-6 group relative">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.0001"
                    value={progress}
                    onChange={(e) => onSeek(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-warm-border/50 rounded-lg appearance-none cursor-pointer accent-warm-accent hover:accent-warm-accent-hover transition-all focus:outline-none"
                    style={{
                        background: `linear-gradient(to right, var(--accent) ${progress * 100}%, var(--border-color) ${progress * 100}%)`
                    }}
                />
            </div>

            {/* Main Controls Panel */}
            <div className="bg-warm-card border border-warm-border rounded-3xl p-6 shadow-xl transition-colors duration-250 flex flex-col gap-6">
                
                {/* Primary Action Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    {/* Playback Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onSkipBack}
                            className="p-2.5 rounded-xl border border-warm-border bg-warm-surface hover:bg-warm-border text-warm-muted hover:text-warm-text transition-all active:scale-95"
                            title="Back a sentence"
                        >
                            <SkipBack size={18} />
                        </button>

                        <button
                            onClick={onPlayPause}
                            className="p-3.5 rounded-2xl bg-warm-accent hover:bg-warm-accent-hover text-white transition-all shadow-md shadow-warm-accent/20 active:scale-95 flex items-center justify-center"
                        >
                            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="translate-x-[1px]" />}
                        </button>

                        <button
                            onClick={onReset}
                            className="p-2.5 rounded-xl border border-warm-border bg-warm-surface hover:bg-warm-border text-warm-muted hover:text-warm-text transition-all active:scale-95"
                            title="Reset to start"
                        >
                            <RotateCcw size={18} />
                        </button>
                    </div>

                    {/* Central Word Tracker Info */}
                    <div className="text-center font-sans text-sm text-warm-muted">
                        <span className="font-serif italic font-medium text-warm-text">Word {index + 1}</span> of {words.length} 
                        <span className="mx-2">•</span> 
                        <span className="font-mono text-xs bg-warm-surface px-2.5 py-1 rounded-full border border-warm-border/50 text-warm-text">
                            {Math.round(progress * 100)}% complete
                        </span>
                    </div>

                    {/* Sizing and Drawer Toggles */}
                    <div className="flex items-center gap-3">
                        {/* Font Size Adjusters */}
                        <div className="flex items-center border border-warm-border rounded-xl bg-warm-surface overflow-hidden">
                            <button
                                onClick={() => onScaleChange(Math.max(0.6, scale - 0.1))}
                                className="px-3 py-2 text-xs font-medium text-warm-muted hover:bg-warm-border hover:text-warm-text transition-colors"
                                title="Decrease font size"
                            >
                                A-
                            </button>
                            <div className="h-4 w-px bg-warm-border" />
                            <button
                                onClick={() => onScaleChange(Math.min(1.8, scale + 0.1))}
                                className="px-3 py-2 text-xs font-medium text-warm-muted hover:bg-warm-border hover:text-warm-text transition-colors"
                                title="Increase font size"
                            >
                                A+
                            </button>
                        </div>

                        {/* Toggle Context Button */}
                        <button
                            onClick={() => setShowContext(!showContext)}
                            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-sm font-medium ${
                                showContext 
                                    ? 'bg-warm-accent border-warm-accent text-white shadow-sm'
                                    : 'border-warm-border bg-warm-surface hover:bg-warm-border text-warm-muted hover:text-warm-text'
                            }`}
                        >
                            <BookOpen size={16} />
                            <span className="hidden md:inline">Text View</span>
                            {showContext ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                        </button>
                    </div>
                </div>

                {/* Speed Controls Section */}
                <div className="flex flex-col md:flex-row items-center gap-5 pt-4 border-t border-warm-border/40">
                    <div className="flex items-center gap-2 text-warm-muted text-sm font-medium">
                        <Gauge size={16} className="text-warm-accent" />
                        <span>Reading Speed:</span>
                    </div>

                    {/* Presets */}
                    <div className="flex items-center gap-1.5">
                        {presets.map((preset) => (
                            <button
                                key={preset}
                                onClick={() => onWpmChange(preset)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                                    wpm === preset
                                        ? 'bg-warm-accent/10 border-warm-accent text-warm-accent font-semibold'
                                        : 'border-warm-border bg-warm-surface hover:bg-warm-border text-warm-muted hover:text-warm-text'
                                }`}
                            >
                                {preset}
                            </button>
                        ))}
                    </div>

                    {/* Speed Slider */}
                    <div className="flex-1 flex items-center gap-3 w-full">
                        <input
                            type="range"
                            min="100"
                            max="800"
                            step="10"
                            value={wpm}
                            onChange={(e) => onWpmChange(parseInt(e.target.value))}
                            className="flex-1 h-1 bg-warm-border rounded-lg appearance-none cursor-pointer accent-warm-accent"
                        />
                        <span className="text-sm font-mono text-warm-accent font-semibold min-w-[4.5rem] text-right">
                            {wpm} <span className="text-[10px] text-warm-muted font-sans font-normal uppercase">WPM</span>
                        </span>
                    </div>
                </div>

                {/* Surroundings Context Drawer */}
                <AnimatePresence>
                    {showContext && words.length > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden border-t border-warm-border/40"
                        >
                            <div className="pt-4 flex flex-col gap-2">
                                <div className="text-xs text-warm-muted font-sans font-medium flex items-center justify-between px-1">
                                    <span>Click on any word to jump directly to it:</span>
                                    <span className="italic">Context View (auto-scrolling)</span>
                                </div>
                                <div 
                                    ref={contextContainerRef}
                                    className="flex flex-wrap gap-x-1.5 gap-y-2.5 text-sm md:text-base leading-relaxed max-h-52 overflow-y-auto p-5 bg-warm-surface/40 rounded-2xl border border-warm-border/50 font-serif text-warm-text/90 scroll-smooth"
                                >
                                    {surroundingWords.map(({ word, globalIndex }) => {
                                        const isActive = globalIndex === index;
                                        return (
                                            <span
                                                key={globalIndex}
                                                ref={isActive ? activeWordRef : null}
                                                onClick={() => {
                                                    onSeekIndex(globalIndex);
                                                    if (isPlaying) onPlayPause(); // Pause on click to let user find place
                                                }}
                                                className={`cursor-pointer px-1 rounded transition-all select-none ${
                                                    isActive
                                                        ? 'bg-warm-accent text-white font-sans font-medium shadow-sm scale-105 mx-0.5'
                                                        : 'hover:text-warm-accent hover:bg-warm-accent/5 rounded px-1'
                                                }`}
                                            >
                                                {word}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.div>
    );
}
