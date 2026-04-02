import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageSquare, Loader, MessageCircleCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GeminiChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: 'Hello! I am your AI Study Assistant. How can I help you with your DIU study notes today?' }
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

        // Standard AI Response Simulation
        setTimeout(() => {
            let botResponse = "That's a helpful question! I suggest organizing your board notes by Subject and Topic using the Amar Note capture tool.";
            
            if (userMsg.toLowerCase().includes('subject')) {
                botResponse = "Organizing by Subject ensures you can quickly find study materials during midterm and final exams at DIU!";
            } else if (userMsg.toLowerCase().includes('exam') || userMsg.toLowerCase().includes('midterm')) {
                botResponse = "For exams, I suggest exporting your important board notes as PDF and reviewing them regularly. Preparation makes a perfect student!";
            } else if (userMsg.toLowerCase().includes('search') || userMsg.toLowerCase().includes('find')) {
                botResponse = "You can use our 'Search Notes' tool on the dashboard to immediately find any note by topic or teacher name.";
            }

            setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-10 right-8 z-[9999]">
            <AnimatePresence>
                {!isOpen ? (
                    <motion.button
                        layoutId="chat-button"
                        onClick={() => setIsOpen(true)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-20 h-20 rounded-full flex flex-col items-center justify-center text-white shadow-[0_20px_50px_rgba(5,150,105,0.4)] bg-gradient-to-tr from-emerald-600 to-green-400 border-2 border-white/30 cursor-pointer"
                    >
                        <div className="bg-white/20 p-2.5 rounded-full mb-1">
                            <Bot size={32} />
                        </div>
                        <span className="bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/10 uppercase tracking-tighter">
                             AI ASSISTANT
                        </span>
                    </motion.button>
                ) : (
                    <motion.div 
                        layoutId="chat-button"
                        initial={{ opacity: 0, y: 50, scale: 0.8, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 50, scale: 0.8, filter: "blur(10px)" }}
                        className="w-[350px] sm:w-[400px] h-[550px] bg-white rounded-3xl shadow-[0_25px_70px_rgba(30,58,138,0.2)] flex flex-col overflow-hidden border border-slate-200"
                    >
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-5 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="bg-white/20 p-2 rounded-xl">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-base leading-none">DIU Study Buddy</h4>
                                    <span className="text-[10px] opacity-80 uppercase tracking-widest font-black">Online Assistant</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-xl transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-grow overflow-y-auto p-5 space-y-5 bg-slate-50/50">
                            {messages.map((msg, idx) => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                        msg.role === 'user' 
                                        ? 'bg-emerald-600 text-white rounded-tr-none font-medium' 
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-4 rounded-2xl shadow-sm rounded-tl-none flex gap-1.5 px-6">
                                        <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-5 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                            <form onSubmit={handleSend} className="flex gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your study question..."
                                    className="flex-grow bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-white transition-all"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!input.trim()}
                                    className="bg-emerald-600 text-white p-3.5 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:shadow-none"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GeminiChat;
