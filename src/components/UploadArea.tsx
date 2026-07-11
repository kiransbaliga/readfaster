import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

interface UploadAreaProps {
    onFileLoaded: (file: File | string) => void;
}

export function UploadArea({ onFileLoaded }: UploadAreaProps) {
    const [urlInput, setUrlInput] = useState('');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileLoaded(acceptedFiles[0]);
        }
    }, [onFileLoaded]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
        },
        maxFiles: 1,
    });

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            onFileLoaded(urlInput.trim());
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[85vh] w-full max-w-4xl mx-auto px-6 py-12 relative">
            
            {/* Header / Intro */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10 max-w-2xl"
            >
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warm-accent-light border border-warm-accent/20 text-warm-accent text-xs font-semibold uppercase tracking-wider mb-4">
                    <Sparkles size={12} />
                    Speed Reading Studio
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-semibold text-warm-text mb-4 tracking-tight leading-tight">
                    Read faster. Absorb deeper.
                </h1>
                <p className="text-base md:text-lg text-warm-muted leading-relaxed font-sans max-w-xl mx-auto">
                    Train your focus and double your reading speed using Rapid Serial Visual Presentation. Just upload your text and dive in.
                </p>
            </motion.div>

            {/* Central Dashboard Layout (Upload Card + Samples Panel) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-stretch">
                
                {/* File Dropzone Card */}
                <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="md:col-span-7 flex flex-col"
                >
                    <div
                        {...getRootProps() as any}
                        className={`group relative flex-1 min-h-[260px] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 p-8 bg-warm-card shadow-sm hover:shadow-md
                            ${isDragActive 
                                ? 'border-warm-accent bg-warm-accent-light/30' 
                                : 'border-warm-border hover:border-warm-accent/50'
                            }
                        `}
                    >
                        {/* Dot pattern on background */}
                        <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity rounded-3xl" />

                        <input {...getInputProps()} />
                        <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
                            <div className={`p-4 rounded-2xl bg-warm-surface border border-warm-border text-warm-muted transition-all group-hover:border-warm-accent/30 group-hover:text-warm-accent group-hover:scale-105 duration-300
                                ${isDragActive ? 'border-warm-accent bg-warm-accent-light text-warm-accent' : ''}
                            `}>
                                <Upload size={28} />
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-base font-semibold text-warm-text">
                                    {isDragActive ? "Drop the file here" : "Drag and drop your file"}
                                </p>
                                <p className="text-xs text-warm-muted">
                                    Select a PDF or TXT e-book chapter
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Try & URL sidecard */}
                <motion.div
                    initial={{ scale: 0.98, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="md:col-span-5 flex flex-col gap-6"
                >
                    {/* URL Card */}
                    <div className="p-6 rounded-3xl bg-warm-card border border-warm-border shadow-sm flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                        <h3 className="text-sm font-semibold text-warm-text mb-3 flex items-center gap-2">
                            <FileText size={16} className="text-warm-accent" />
                            Read Web Article
                        </h3>
                        <div className="flex gap-2 relative z-10">
                            <input
                                type="text"
                                placeholder="Paste article URL..."
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                className="flex-1 bg-warm-surface border border-warm-border rounded-xl px-4 py-2.5 text-sm text-warm-text placeholder-warm-muted focus:outline-none focus:border-warm-accent/50 focus:ring-1 focus:ring-warm-accent/30 transition-all font-sans"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleUrlSubmit();
                                }}
                            />
                            <button
                                onClick={handleUrlSubmit}
                                className="p-2.5 bg-warm-accent hover:bg-warm-accent-hover text-white rounded-xl transition-colors active:scale-95 flex items-center justify-center"
                            >
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Preloaded Samples Card */}
                    <div className="p-6 rounded-3xl bg-warm-card border border-warm-border shadow-sm flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-warm-text mb-3 flex items-center gap-2">
                                <BookOpen size={16} className="text-warm-accent" />
                                Try a Quick Sample
                            </h3>
                            <div className="flex flex-col gap-2">
                                {[
                                    { key: 'sample:rsvp', label: 'The Magic of RSVP', desc: 'Understanding speed reading mechanics' },
                                    { key: 'sample:focus', label: 'Focus in the Digital Age', desc: 'An essay on mindfulness & flow' },
                                    { key: 'sample:poem', label: 'A Dream Within a Dream', desc: 'Classic poetry by Edgar Allan Poe' }
                                ].map((sample) => (
                                    <button
                                        key={sample.key}
                                        onClick={() => onFileLoaded(sample.key)}
                                        className="text-left p-3 rounded-xl border border-warm-border/60 bg-warm-surface/50 hover:bg-warm-surface hover:border-warm-accent/40 hover:shadow-sm transition-all group flex items-center justify-between"
                                    >
                                        <div className="space-y-0.5">
                                            <div className="text-xs font-semibold text-warm-text group-hover:text-warm-accent transition-colors">{sample.label}</div>
                                            <div className="text-[10px] text-warm-muted">{sample.desc}</div>
                                        </div>
                                        <ArrowRight size={12} className="text-warm-muted group-hover:text-warm-accent group-hover:translate-x-0.5 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Editorial Features Section */}
            <div className="mt-16 border-t border-warm-border/60 pt-10 grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                {[
                    { number: "01", title: "Instant Visual Intake", desc: "Words display sequentially in place, removing the need for eye movement (saccades) and letting you digest text rapidly." },
                    { number: "02", title: "Optical Centering", desc: "Every word aligns precisely on its Optimal Recognition Point, helping your brain recognize syllables instantly." },
                    { number: "03", title: "Complete Context", desc: "Toggle our embedded context reader to review paragraphs, seek backwards, or adjust speeds on the fly." }
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                        className="space-y-2 group"
                    >
                        <div className="font-serif italic text-3xl font-light text-warm-accent/40 group-hover:text-warm-accent transition-colors duration-300">
                            {item.number}
                        </div>
                        <h4 className="text-sm font-semibold text-warm-text font-serif">{item.title}</h4>
                        <p className="text-xs text-warm-muted leading-relaxed font-sans">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
            
        </div>
    );
}
