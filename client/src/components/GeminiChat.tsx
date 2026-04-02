import React from 'react';
import { Sparkles } from 'lucide-react';

const GeminiChat: React.FC = () => {
    const openGemini = () => {
        // More reliable window.open for mobile browsers
        const win = window.open("https://gemini.google.com/app", "_blank", "noopener,noreferrer");
        if (win) {
            win.focus();
        } else {
            // Fallback for some pop-up blockers
            window.location.href = "https://gemini.google.com/app";
        }
    };

    return (
        <div className="fixed bottom-10 right-8 z-[9999] pointer-events-auto">
            {/* Direct Link to Google Gemini - Optimized Hitbox */}
            <button
                onClick={openGemini}
                className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-white shadow-[0_20px_50px_rgba(30,58,138,0.5)] bg-gradient-to-tr from-blue-700 via-primary to-blue-500 border-2 border-white/30 transform transition-all active:scale-90 hover:scale-110 cursor-pointer"
                aria-label="Open Google Gemini"
            >
                <div className="bg-white/20 p-2.5 rounded-full mb-1">
                    <Sparkles size={32} className="text-yellow-300 animate-pulse" />
                </div>
                <span className="bg-secondary text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/10 uppercase tracking-tighter">
                     GEMINI
                </span>
            </button>
        </div>
    );
};

export default GeminiChat;
