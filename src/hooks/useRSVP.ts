import { useState, useEffect, useRef, useCallback } from 'react';

export type RSVPState = {
    isPlaying: boolean;
    index: number;
    wpm: number;
    currentWord: string;
    progress: number; // 0 to 1
};

export type RSVPControls = {
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    setWPM: (wpm: number) => void;
    seek: (progress: number) => void; // 0 to 1
    skipBack: () => void;
    skipForward: () => void;
    reset: () => void;
};

export const useRSVP = (words: string[], initialWPM: number = 300) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [index, setIndex] = useState(0);
    const [wpm, setWPM] = useState(initialWPM);
    const timerRef = useRef<any>(null); // Use any for timer ID type safety across envs

    const currentWord = words[index] || "";
    const progress = words.length > 0 ? index / words.length : 0;

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startTimer = useCallback(() => {
        stopTimer();
        if (index >= words.length) {
            setIsPlaying(false);
            return;
        }

        const intervalMs = 60000 / wpm;
        timerRef.current = setInterval(() => {
            setIndex((prev) => {
                if (prev >= words.length - 1) {
                    stopTimer();
                    setIsPlaying(false);
                    return prev;
                }
                // Heuristic for long words or punctuation? 
                // Advanced RSVP slows down for long words/commas.
                // For now, constant speed.
                return prev + 1;
            });
        }, intervalMs);
    }, [wpm, index, words.length, stopTimer]);

    useEffect(() => {
        if (isPlaying) {
            startTimer();
        } else {
            stopTimer();
        }
        return () => stopTimer();
    }, [isPlaying, wpm, startTimer, stopTimer]);

    const play = useCallback(() => setIsPlaying(true), []);
    const pause = useCallback(() => setIsPlaying(false), []);
    const togglePlay = useCallback(() => setIsPlaying((p) => !p), []);

    const seek = useCallback((p: number) => {
        const newIndex = Math.floor(p * (words.length - 1));
        setIndex(Math.max(0, Math.min(newIndex, words.length - 1)));
    }, [words.length]);

    const skipBack = useCallback(() => {
        // Skip back a sentence or chunk (approx 10 words)
        setIndex((prev) => {
            let newIdx = prev - 1;
            let count = 0;
            // Search backwards for a period or start
            while (newIdx > 0 && count < 15) { // Fallback if no sentence
                if (words[newIdx].endsWith('.') || words[newIdx].endsWith('!') || words[newIdx].endsWith('?')) {
                    if (count > 2) break; // Don't stop at immediate previous sentence if it's too close
                }
                newIdx--;
                count++;
            }
            // If we didn't find a sentence break easily, just go back 10 words
            if (count >= 15) {
                return Math.max(0, prev - 10);
            }
            return Math.max(0, newIdx + 1); // Start after the period
        });
    }, [words]);

    const skipForward = useCallback(() => {
        setIndex((prev) => Math.min(words.length - 1, prev + 10));
    }, [words.length]);

    const reset = useCallback(() => {
        setIndex(0);
        setIsPlaying(false);
    }, []);

    return {
        state: { isPlaying, index, wpm, currentWord, progress },
        controls: { play, pause, togglePlay, setWPM, seek, skipBack, skipForward, reset },
    };
};
