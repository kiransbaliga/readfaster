import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadArea } from './components/UploadArea';
import { ReaderDisplay } from './components/ReaderDisplay';
import { Controls } from './components/Controls';
import { parseFile, type ParsedBook } from './lib/parsers';
import { useRSVP } from './hooks/useRSVP';
import { X, Book, Sun, Moon, Globe } from 'lucide-react';

const SAMPLES = {
    "sample:rsvp": {
        title: "The Magic of RSVP Speed Reading",
        content: "Rapid Serial Visual Presentation (RSVP) is a reading technique where words are displayed one by one in a single fixed location on the screen. By flashing words sequentially, RSVP eliminates the time-consuming process of moving your eyes from left to right (known as saccades) and jumping back to reread sections (regressions). The human brain is capable of processing visual symbols extremely fast. When the eye is parked at a single focus point, the cognitive load is reduced, letting you absorb content at speeds ranging from 400 to over 800 words per minute. This app centers each word around its Optimal Recognition Point (ORP), typically the second or third letter. The ORP is highlighted in warm terracotta red. By keeping your gaze locked onto this red character, you can bypass the subvocalization barrier and experience true speed reading. Try uploading your own PDF chapters, articles, or technical guides, and discover how fast you can process ideas!",
    },
    "sample:focus": {
        title: "Focus in the Digital Age",
        content: "In an era of endless notifications and infinite scroll, deep focus has become a rare superpower. Our attention is constantly fragmented by updates, alerts, and shifting layouts. Speed reading is not just about moving through texts faster; it is about cultivating intense visual mindfulness. When using RSVP, there is no room for distraction. The steady tempo of words forces your working memory to engage completely with the present. It creates a state of flow similar to meditation. If you blink or wander, the stream continues, making you aware of your own cognitive drifts. Paradoxically, by reading faster, you can train your brain to concentrate better. The key is finding your optimal speed—a pace that challenges your comprehension without causing frustration. As you practice, you will notice that your focus window expands, allowing you to immerse yourself in complex texts with newfound clarity and ease.",
    },
    "sample:poem": {
        title: "A Dream Within a Dream — Edgar Allan Poe",
        content: "Take this kiss upon the brow! And, in parting from you now, Thus much let me avow — You are not wrong, who deem That my days have been a dream; Yet if hope has flown away In a night, or in a day, In a vision, or in none, Is it therefore the less gone? All that we see or seem Is but a dream within a dream. I stand amid the roar Of a surf-tormented shore, And I hold within my hand Grains of the golden sand — How few! yet how they creep Through my fingers to the deep, While I weep — while I weep! O God! can I not grasp Them with a tighter clasp? O God! can I not save One from the pitiless wave? Is all that we see or seem But a dream within a dream?",
    }
};

function App() {
    const [book, setBook] = useState<ParsedBook | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // UI controls sizing scale (ranges from 0.6 to 1.8)
    const [readerScale, setReaderScale] = useState(1.0);

    // Warm Theme handling
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') return saved;
        return 'dark'; // Default to dark mode
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    }, []);

    // Initialize RSVP hook with words array
    const { state, controls } = useRSVP(book ? book.content : [], 300);

    const handleFileLoaded = useCallback(async (file: File | string) => {
        setLoading(true);
        setError(null);
        try {
            if (typeof file === 'string' && file.startsWith('sample:')) {
                const sampleKey = file as keyof typeof SAMPLES;
                const sample = SAMPLES[sampleKey];
                if (sample) {
                    setBook({
                        title: sample.title,
                        originalText: sample.content,
                        content: sample.content.split(/\s+/).filter(w => w.length > 0)
                    });
                    return;
                }
            }
            
            const parsed = await parseFile(file);
            setBook(parsed);
        } catch (err: any) {
            console.error(err);
            setError("Failed to parse file. Please check file format and try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    const closeBook = useCallback(() => {
        controls.reset();
        setBook(null);
    }, [controls]);

    // Listen to spacebar to play/pause the speed reader
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (book && e.code === 'Space') {
                // Prevent scrolling when pressing spacebar
                e.preventDefault();
                controls.togglePlay();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [book, controls]);

    return (
        <div className="relative min-h-screen bg-warm-bg text-warm-text overflow-x-hidden font-sans selection:bg-warm-accent/25 transition-colors duration-250">

            {/* Subtle background grids & dots */}
            <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0" />
            <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none z-0" />

            <AnimatePresence mode="wait">
                {!book ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02, filter: 'blur(8px)' }}
                        transition={{ duration: 0.4 }}
                        className="min-h-screen flex flex-col justify-between relative z-10"
                    >
                        {/* Header bar on home screen */}
                        <header className="flex items-center justify-between px-8 py-5 border-b border-warm-border/30 backdrop-blur-md bg-warm-bg/60">
                            <div className="flex items-center gap-2.5 font-serif font-bold text-xl tracking-tight text-warm-text">
                                <Book className="text-warm-accent" size={22} />
                                <span>ReadFaster</span>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className="p-2.5 rounded-xl border border-warm-border bg-warm-surface hover:bg-warm-border text-warm-muted hover:text-warm-text transition-colors active:scale-95"
                                title="Toggle color theme"
                            >
                                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            </button>
                        </header>

                        {/* Content main block */}
                        <main className="flex-1 flex items-center justify-center">
                            {loading ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-10 h-10 border-2 border-warm-accent/30 border-t-warm-accent rounded-full animate-spin" />
                                    <p className="text-warm-accent font-serif italic text-sm">Parsing text content...</p>
                                </div>
                            ) : (
                                <div className="w-full">
                                    <UploadArea onFileLoaded={handleFileLoaded} />
                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-warm-accent text-center mt-4 text-sm font-medium"
                                        >
                                            {error}
                                        </motion.p>
                                    )}
                                </div>
                            )}
                        </main>

                        {/* Minimal Footer */}
                        <footer className="py-6 border-t border-warm-border/30 text-center text-xs text-warm-muted flex flex-col items-center justify-center gap-2">
                            <div>
                                &copy; {new Date().getFullYear()} ReadFaster. Built with warm editorial aesthetics.
                            </div>
                            <a 
                                href="https://baliga.dev" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-warm-accent hover:text-warm-accent-hover transition-colors font-medium"
                            >
                                <Globe size={12} />
                                <span>baliga.dev</span>
                            </a>
                        </footer>
                    </motion.div>
                ) : (
                    <motion.div
                        key="reader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col h-screen relative z-10"
                    >
                        {/* Reader Header */}
                        <header className="flex items-center justify-between px-8 py-5 border-b border-warm-border/30 backdrop-blur-md bg-warm-bg/75 relative z-30">
                            <div className="flex items-center gap-3 text-warm-muted min-w-0 max-w-[70%]">
                                <Book size={18} className="text-warm-accent flex-shrink-0" />
                                <h2 className="text-base font-serif italic font-medium truncate text-warm-text">{book.title || "Untitled Book"}</h2>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleTheme}
                                    className="p-2.5 rounded-xl border border-warm-border bg-warm-surface hover:bg-warm-border text-warm-muted hover:text-warm-text transition-colors active:scale-95"
                                    title="Toggle color theme"
                                >
                                    {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                                </button>
                                <button
                                    onClick={closeBook}
                                    className="p-2.5 rounded-xl border border-warm-border bg-warm-surface hover:bg-warm-accent hover:border-warm-accent hover:text-white text-warm-muted transition-colors active:scale-95"
                                    title="Exit reader"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </header>

                        {/* Main Reader Stage */}
                        <main className="flex-1 flex flex-col items-center justify-center py-6 w-full max-w-5xl mx-auto overflow-y-auto relative z-20">
                            
                            {/* Display RSVP word container */}
                            <ReaderDisplay word={state.currentWord} scale={readerScale} />

                            {/* Redesigned bottom controls panel */}
                            <Controls
                                isPlaying={state.isPlaying}
                                onPlayPause={controls.togglePlay}
                                onSkipBack={controls.skipBack}
                                onReset={controls.reset}
                                wpm={state.wpm}
                                onWpmChange={controls.setWPM}
                                progress={state.progress}
                                onSeek={controls.seek}
                                
                                words={book.content}
                                index={state.index}
                                onSeekIndex={controls.seekIndex}
                                scale={readerScale}
                                onScaleChange={setReaderScale}
                            />
                        </main>

                        {/* Footer Stat Details */}
                        <footer className="px-8 py-4 border-t border-warm-border/30 text-xs text-warm-muted relative z-30 bg-warm-bg/75 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                            <div className="text-xs">
                                Press <kbd className="mx-1 px-1.5 py-0.5 rounded border border-warm-border bg-warm-surface font-mono text-[10px]">Spacebar</kbd> to toggle playback
                            </div>
                            <div className="text-xs">
                                Reading Session active
                            </div>
                            <a 
                                href="https://baliga.dev" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-warm-accent hover:text-warm-accent-hover transition-colors font-medium text-xs"
                            >
                                <Globe size={12} />
                                <span>baliga.dev</span>
                            </a>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
