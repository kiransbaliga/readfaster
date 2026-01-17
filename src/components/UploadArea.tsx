import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, BookOpen } from 'lucide-react';

interface UploadAreaProps {
    onFileLoaded: (file: File) => void;
}

export function UploadArea({ onFileLoaded }: UploadAreaProps) {
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
            // 'application/epub+zip': ['.epub'], // Temporarily disabled or verify support
        },
        maxFiles: 1,
    });

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                    ReadFaster
                </h1>
                <p className="text-xl text-neutral-400">
                    Upload your book and read at superhuman speeds.
                </p>
            </motion.div>

            <motion.div
                {...getRootProps()}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                className={`w-full aspect-[2/1] rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors duration-300 backdrop-blur-sm bg-white/5
          ${isDragActive ? 'border-blue-500 bg-blue-500/10' : 'border-neutral-700 hover:border-neutral-500'}
        `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-4 text-neutral-400">
                    <div className={`p-4 rounded-full bg-neutral-800 transition-colors ${isDragActive ? 'bg-blue-500/20 text-blue-400' : ''}`}>
                        <Upload size={32} />
                    </div>
                    <p className="text-lg font-medium">
                        {isDragActive ? "Drop the book here..." : "Drag & drop your file here"}
                    </p>
                    <p className="text-sm text-neutral-500">
                        Supports PDF, TXT
                    </p>
                </div>
            </motion.div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-center">
                {[
                    { icon: Upload, title: "Upload", desc: "Drag and drop your file" },
                    { icon: BookOpen, title: "Read", desc: "Focus on one word at a time" },
                    { icon: FileText, title: "Learn", desc: "Absorb knowledge faster" },
                ].map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className="p-6 rounded-2xl bg-neutral-800/50 border border-neutral-700/50"
                    >
                        <item.icon className="mx-auto mb-3 text-blue-400" size={24} />
                        <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-neutral-400">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
