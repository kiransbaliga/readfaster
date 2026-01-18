import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { UploadArea } from './components/UploadArea';
import { ReaderDisplay } from './components/ReaderDisplay';
import { Controls } from './components/Controls';
import { parseFile, type ParsedBook } from './lib/parsers';
import { useRSVP } from './hooks/useRSVP';
import { X, Book } from 'lucide-react';

function App() {
  const [book, setBook] = useState<ParsedBook | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize hook with empty array if no book
  const { state, controls } = useRSVP(book ? book.content : [], 300);

  const handleFileLoaded = useCallback(async (file: File | string) => {
    setLoading(true);
    setError(null);
    try {
      const parsed = await parseFile(file);
      setBook(parsed);
    } catch (err: any) {
      console.error(err);
      setError("Failed to parse file. Please try another one.");
    } finally {
      setLoading(false);
    }
  }, []);

  const closeBook = useCallback(() => {
    controls.reset();
    setBook(null);
  }, [controls]);

  return (
    <div className="relative min-h-screen bg-neutral-900 text-white overflow-hidden font-sans selection:bg-blue-500/30">

      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-[10s]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-[15s]" />

      <AnimatePresence mode="wait">
        {!book ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center min-h-screen relative z-10"
          >
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-blue-400 font-medium">Analyzing text...</p>
              </div>
            ) : (
              <div className="w-full">
                <UploadArea onFileLoaded={handleFileLoaded} />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-center mt-6"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="reader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col h-screen relative z-10"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-6">
              <div className="flex items-center gap-3 text-neutral-400">
                <Book size={20} />
                <h2 className="text-lg font-medium truncate max-w-md">{book.title || "Untitled Book"}</h2>
              </div>
              <button
                onClick={closeBook}
                className="p-2 rounded-full hover:bg-neutral-800 text-neutral-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </header>

            {/* Main Reader Area */}
            <main className="flex-1 flex flex-col items-center justify-center py-10 w-full max-w-5xl mx-auto">
              <ReaderDisplay word={state.currentWord} />

              <Controls
                isPlaying={state.isPlaying}
                onPlayPause={controls.togglePlay}
                onSkipBack={controls.skipBack}
                onReset={controls.reset}
                wpm={state.wpm}
                onWpmChange={controls.setWPM}
                progress={state.progress}
                onSeek={controls.seek}
              />
            </main>

            {/* Footer Stats */}
            <footer className="px-8 py-6 text-center text-neutral-500 text-sm">
              Word {state.index + 1} of {book.content.length} • {Math.round(state.progress * 100)}% Complete
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
