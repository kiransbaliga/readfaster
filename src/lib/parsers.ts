import * as pdfjsLib from 'pdfjs-dist';
// import epub from 'epubjs'; // We might need to import it differently or use dynamic import

// Set worker source for pdfjs
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export type ParsedBook = {
    content: string[]; // Array of words
    title?: string;
    originalText: string;
};

import { Readability } from '@mozilla/readability';

export async function parseFile(file: File | string): Promise<ParsedBook> {
    // If it's a string, treat as URL
    if (typeof file === 'string') {
        return parseURL(file);
    }

    const extension = file.name.split('.').pop()?.toLowerCase();

    switch (extension) {
        case 'pdf':
            return parsePDF(file);
        case 'epub':
            return parseEPUB(file);
        case 'txt':
            return parseTXT(file);
        default:
            throw new Error(`Unsupported file type: ${extension}`);
    }
}

async function parseURL(url: string): Promise<ParsedBook> {
    // Use a CORS proxy
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const reader = new Readability(doc);
        const article = reader.parse();

        if (!article) {
            throw new Error("Failed to parse article content");
        }

        return {
            content: processText(article.textContent),
            title: article.title || "Web Article",
            originalText: article.textContent,
        };
    } catch (error) {
        console.error("URL parsing error:", error);
        throw error;
    }
}

async function parseTXT(file: File): Promise<ParsedBook> {
    const text = await file.text();
    return {
        content: processText(text),
        title: file.name.replace('.txt', ''),
        originalText: text,
    };
}

async function parsePDF(file: File): Promise<ParsedBook> {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1 });
        const height = viewport.height;

        // Define margins for headers and footers (e.g., 5% from top/bottom)
        const headerThreshold = height * 0.95;
        const footerThreshold = height * 0.05;

        const textContent = await page.getTextContent();

        // Filter items
        const strings = textContent.items
            .filter((item: any) => {
                // Check if item has transform data
                if (!item.transform || item.transform.length < 6) return true;

                const y = item.transform[5]; // transform[5] is ty (vertical translation)

                // Exclude headers (high Y) and footers (low Y)
                // Note: PDF coordinates origin is usually bottom-left.
                if (y > headerThreshold || y < footerThreshold) {
                    return false;
                }

                // Simple check for standalone numbers (likely page numbers if they slipped through)
                if (/^\d+$/.test(item.str.trim())) {
                    return false;
                }

                return true;
            })
            .map((item: any) => item.str);

        fullText += strings.join(' ') + ' ';
    }

    return {
        content: processText(fullText),
        title: file.name.replace('.pdf', ''),
        originalText: fullText,
    };
}

async function parseEPUB(file: File): Promise<ParsedBook> {
    // For EPUB, we might need a more complex approach as epubjs is usually for rendering.
    // However, we can use it to get text.
    // Since epubjs is often client-side rendering focused, extracting raw text might be tricky without rendering.
    // Let's try to use the Book object.

    // Note: This is a simplified implementation. Validating ePub parsing might require more adjustment.

    // Dynamic import to avoid SSR/build issues if any, though we are SPA.
    // const ePub = (await import('epubjs')).default;
    // Actually standard import should work if we have types.

    // For now, let's keep EPUB simple or use a library that extracts text.
    // epubjs can take an ArrayBuffer.

    // Using a different approach for EPUB might be safer if epubjs is too heavy/dom-dependent.
    // But let's try basic epubjs usage.

    // Warning: epubjs usually works by rendering to a div. 
    // We might need to rely on the 'spine' to get text.

    // Placeholder for EPUB - implementing later or finding a better text-only parser.
    // For prototype, let's notify user if EPUB is tricky, or try to implement.

    // Let's try basic implementation
    try {
        const ePub = (await import('epubjs')).default;
        const book = ePub(await file.arrayBuffer());

        // Load the book
        await book.ready;

        // This is complex because we need to iterate over spine items and get text.
        // It's async.

        const spine = book.spine;
        // let fullText = '';

        // We need to iterate over spine items
        // spine.each() is synchronous but the callback might need to load.
        // spine.get(index) returns a section. section.load() returns text/dom.

        for (const item of (spine as any).items) { // Accessing items directly or via iteration
            book.spine.get(item.href);
            // section.load methods usually need a render target or hooks. 
            // However, generic 'load' might fetch content.
            // If this fails, we might mock EPUB support or ask for advice.
        }

        // SIMPLIFICATION for prototype:
        // We'll throw for now until we refine the EPUB strategy or just support PDF/TXT fully first.
        throw new Error("EPUB parsing is experimental and not fully implemented yet.");

    } catch (e) {
        console.error("EPUB parsing failed", e);
        throw e;
    }
}

function processText(text: string): string[] {
    // Split by spaces, newlines, etc.
    // Also handle punctuation attached to words.
    // We want "Hello," to stay "Hello," or maybe split?
    // RSVP usually shows the word with punctuation.
    return text.split(/\s+/).filter(w => w.length > 0);
}
