import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageSquare, Loader, Sparkles, MessageCircleCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GeminiChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: 'Hello! I am your AI Study Assistant. How can I help you with your DIU notes?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isTyping, isOpen]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        // Simulation for local AI chat
        setTimeout(() => {
            let botResponse = "That's a great question! I can help you organize and review your notes. You can also use the official Google Gemini for deeper analysis.";
            
            if (userMsg.toLowerCase().includes('subject')) {
                botResponse = "Organizing by Subject is the best way at DIU! It ensures you find what you need during final exams.";
            } else if (userMsg.toLowerCase().includes('help') || userMsg.toLowerCase().includes('gemini')) {
                botResponse = "If you need advanced AI help, click the 'Open Advanced AI' button below to talk to Gemini directly!";
            }

            setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    const openGemini = () => {
        window.open("https://gemini.google.com/app", "_blank", "noopener,noreferrer");
    };

    return (
        <>
            {/* The Gemini Link Button (Small & Discrete) */}
            <div className="fixed bottom-28 right-8 z-[9999]">
                <button
                    onClick={openGemini}
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg bg-blue-500 border border-white/20 hover:scale-110 active:scale-95 transition-all"
                    title="Open Google Gemini"
                >
                    <Sparkles size={20} className="text-yellow-300" />
                </button>
            </div>

            {/* The AI Chat Box Button (New Logo: MessageCircleCode) */}
            <div className="fixed bottom-10 right-8 z-[9999]">
                {!isOpen ? (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-white shadow-[0_20px_50px_rgba(5,150,105,0.4)] bg-gradient-to-tr from-emerald-600 to-green-400 border-2 border-white/30 transform transition-all active:scale-90 hover:scale-110 cursor-pointer"
                        aria-label="Open AI Chat"
                    >
                        <div className="bg-white/20 p-2.5 rounded-full mb-1">
                            <Bot size={32} />
                        </div>
                        <span className="bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/10">
                             AI CHAT
                        </span>
                    </button>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="w-[350px] sm:w-[400px] h-[550px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
                    >
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-4 text-white flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Bot size={24} />
                                <div>
                                    <h4 className="font-bold text-sm">DIU Study Assistant</h4>
                                    <span className="text-[10px] opacity-80">AI Powered</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-lg">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-emerald-600 text-white rounded-tr-none' 
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl shadow-sm rounded-tl-none flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <form onSubmit={handleSend} className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask anything note related..."
                                    className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500"
                                />
                                <button 
                                    type="submit" 
                                    className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700 transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                            <button 
                                onClick={openGemini}
                                className="w-full bg-blue-50 text-blue-600 border border-blue-100 rounded-xl py-2 text-xs font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-all uppercase tracking-widest"
                            >
                                <Sparkles size={14} /> Open Advanced AI (Gemini)
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default GeminiChat;
