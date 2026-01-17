import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface ReaderDisplayProps {
    word: string;
}

export function ReaderDisplay({ word }: ReaderDisplayProps) {
    // Logic to find the Optimal Recognition Point (ORP)
    // Typically slightly left of center.
    // For a word length L, ORP is around ceil(L/4) or center.
    // A simple heuristic: index = Math.ceil((word.length - 1) / 2) is center.
    // Spritz suggests putting the ORP at a fixed position.

    const { left, pivot, right } = useMemo(() => {
        if (!word) return { left: '', pivot: '', right: '' };

        // Simple heuristic for pivot index
        let pivotIdx = 0;
        const len = word.length;
        if (len === 1) pivotIdx = 0;
        else if (len >= 2 && len <= 5) pivotIdx = 1;
        else if (len >= 6 && len <= 9) pivotIdx = 2;
        else if (len >= 10 && len <= 13) pivotIdx = 3;
        else pivotIdx = 4;

        // Adjust if word is shorter than expected pivot
        pivotIdx = Math.min(pivotIdx, len - 1);

        return {
            left: word.slice(0, pivotIdx),
            pivot: word[pivotIdx],
            right: word.slice(pivotIdx + 1),
        };
    }, [word]);

    return (
        <div className="flex items-center justify-center h-64 w-full max-w-3xl mx-auto my-8 relative">
            {/* Guides for focus */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-neutral-800/50 -translate-x-1/2"></div>
            <div className="absolute top-8 bottom-8 left-1/2 w-px bg-red-500/20 -translate-x-1/2"></div>

            <div className="relative z-10 font-mono text-6xl md:text-8xl font-bold flex items-baseline w-full">
                {/* Left part aligned to right */}
                <span className="flex-1 text-right text-neutral-400">
                    {left}
                </span>

                {/* Pivot character centered and highlighted */}
                <span className="text-red-500 mx-0.5">
                    {pivot}
                </span>

                {/* Right part aligned to left */}
                <span className="flex-1 text-left text-neutral-400">
                    {right}
                </span>
            </div>
        </div>
    );
}
