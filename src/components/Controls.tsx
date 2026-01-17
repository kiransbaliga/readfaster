import { Play, Pause, SkipBack, RotateCcw, MonitorPlay } from 'lucide-react';
import { motion } from 'framer-motion';

interface ControlsProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    onSkipBack: () => void;
    onReset: () => void;
    wpm: number;
    onWpmChange: (wpm: number) => void;
    progress: number;
    onSeek: (value: number) => void;
}

export function Controls({ isPlaying, onPlayPause, onSkipBack, onReset, wpm, onWpmChange, progress, onSeek }: ControlsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-3xl mx-auto mt-12 px-6"
        >
            {/* Progress Bar */}
            <div className="mb-8 group">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.0001"
                    value={progress}
                    onChange={(e) => onSeek(parseFloat(e.target.value))}
                    className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-neutral-800/50 backdrop-blur-md p-6 rounded-3xl border border-neutral-700/50 shadow-2xl">

                {/* Playback Controls */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onSkipBack}
                        className="p-3 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white transition-colors"
                        title="Back a sentence"
                    >
                        <SkipBack size={20} />
                    </button>

                    <button
                        onClick={onPlayPause}
                        className="p-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-white transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                    </button>

                    <button
                        onClick={onReset}
                        className="p-3 rounded-xl bg-neutral-700 hover:bg-neutral-600 text-white transition-colors"
                        title="Reset"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>

                {/* Speed Control */}
                <div className="flex items-center gap-4 w-full md:w-auto bg-neutral-900/50 p-2 rounded-xl border border-neutral-700/50">
                    <MonitorPlay size={18} className="text-neutral-400 ml-2" />
                    <div className="flex flex-col w-full md:w-32">
                        <input
                            type="range"
                            min="100"
                            max="800"
                            step="10"
                            value={wpm}
                            onChange={(e) => onWpmChange(parseInt(e.target.value))}
                            className="w-full h-1 bg-neutral-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                    <span className="text-sm font-mono text-blue-400 min-w-[4rem] text-right mr-2">
                        {wpm} <span className="text-xs text-neutral-500">WPM</span>
                    </span>
                </div>

            </div>
        </motion.div>
    );
}
