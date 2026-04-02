import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, MessageSquare, Loader, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GeminiChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: 'Hello! I am your Gemini-powered Note Assistant. How can I help you with your DIU study notes today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        // Simulate Gemini Response
        setTimeout(() => {
            let botResponse = "That's an interesting question about your notes! I recommend organizing it by Subject and Topic using the Amar Note capture tool.";
            
            if (userMsg.toLowerCase().includes('subject')) {
                botResponse = "Categorizing by Subject helps you find study materials faster during midterms. Would you like me to show you how to search by subject?";
            } else if (userMsg.toLowerCase().includes('exam') || userMsg.toLowerCase().includes('midterm')) {
                botResponse = "For exams, I suggest exporting your most important board notes as PDF and reviewing them regularly. Preparation is key!";
            } else if (userMsg.toLowerCase().includes('ocr') || userMsg.toLowerCase().includes('scan')) {
                botResponse = "Our OCR engine uses Tesseract.js to accurately extract text from classroom boards. Make sure your photos are sharp and well-lit!";
            }

            setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999]">
            {/* Direct Link to Google Gemini App - Optimized for Mobile Touch */}
            <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href="https://gemini.google.com/app"
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => console.log('Opening Google Gemini')}
                className="w-18 h-18 lg:w-20 lg:h-20 rounded-full flex flex-col items-center justify-center text-white shadow-[0_20px_50px_rgba(30,58,138,0.3)] transition-all duration-300 bg-gradient-to-tr from-blue-700 via-primary to-blue-500 border-2 border-white/30 relative active:scale-95 touch-manipulation cursor-pointer"
            >
                <div className="bg-white/20 p-2 rounded-full mb-1">
                    <Sparkles size={36} className="text-yellow-300 animate-pulse" />
                </div>
                <span className="bg-secondary text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg border border-white/20 absolute -top-1 -right-1">
                     GEMINI
                </span>
            </motion.a>
        </div>

    );
};


export default GeminiChat;
