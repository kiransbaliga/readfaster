import { useMemo } from 'react';

interface ReaderDisplayProps {
    word: string;
    scale?: number; // scale multiplier (default 1.0)
}

export function ReaderDisplay({ word, scale = 1.0 }: ReaderDisplayProps) {
    // Logic to find the Optimal Recognition Point (ORP)
    const { left, pivot, right, leftLen } = useMemo(() => {
        if (!word) return { left: '', pivot: '', right: '', leftLen: 0 };

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
            leftLen: pivotIdx,
        };
    }, [word]);

    if (!word) return (
        <div className="flex items-center justify-center h-48 w-full max-w-3xl mx-auto my-6 relative bg-warm-card border border-warm-border rounded-3xl p-6 shadow-md transition-colors duration-250">
            <span className="text-warm-muted italic font-serif text-lg">No text loaded</span>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto my-6 relative">
            
            {/* The Focus Frame (Spritz-style) 
                Note: We removed overflow-hidden so that extremely long words or large font scales 
                will overflow the card boundaries rather than getting cut off. */}
            <div className="w-full h-48 relative bg-warm-card border border-warm-border rounded-3xl shadow-sm flex items-center justify-center transition-colors duration-250">
                
                {/* Background dots/grid detail inside the frame (rounded to match the card boundaries) */}
                <div className="absolute inset-0 bg-dot-pattern opacity-60 pointer-events-none rounded-3xl" />

                {/* Focus Ticks (Anchor guides) offset slightly to the left (40%) to accommodate long right-side tails */}
                <div className="absolute top-0 left-[40%] w-[2px] h-3 bg-warm-accent -translate-x-1/2 rounded-b-full z-20" />
                <div className="absolute bottom-0 left-[40%] w-[2px] h-3 bg-warm-accent -translate-x-1/2 rounded-t-full z-20" />
                
                {/* Visual faint vertical guideline */}
                <div className="absolute top-3 bottom-3 left-[40%] w-px border-l border-dashed border-warm-border pointer-events-none z-0" />

                {/* RSVP Word Display Container */}
                <div className="relative w-full flex items-center justify-center z-10 h-full">
                    
                    {/* The Word Wrapper: we use font-mono (JetBrains Mono) and calculate the offset in ch units.
                        1ch is exactly the width of one character in monospace.
                        We shift left by (leftLen + 0.5) characters to align the center of the pivot letter to exactly 40% left of container. */}
                    <div 
                        className="absolute left-[40%] w-max font-mono font-bold whitespace-nowrap select-none"
                        style={{
                            fontSize: `${3.0 * scale}rem`,
                            transform: `translateX(calc(-${leftLen}ch - 0.5ch))`
                        }}
                    >
                        {/* Left Part (Muted Warm Grey) */}
                        <span className="text-warm-muted">
                            {left}
                        </span>

                        {/* Pivot Character (Vibrant Coral/Terracotta) */}
                        <span className="text-warm-accent">
                            {pivot}
                        </span>

                        {/* Right Part (Muted Warm Grey) */}
                        <span className="text-warm-muted">
                            {right}
                        </span>
                    </div>

                </div>
            </div>

            {/* Subtle help tag */}
            <div className="text-[10px] text-warm-muted uppercase tracking-wider mt-3 font-medium">
                Focus your eyes on the <span className="text-warm-accent font-semibold">coral</span> character
            </div>
        </div>
    );
}
