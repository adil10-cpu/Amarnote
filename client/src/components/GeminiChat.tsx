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
        <div className="fixed bottom-6 right-6 z-50">
            {/* Direct Link to Google Gemini App */}
            <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="https://gemini.google.com/app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 bg-gradient-to-tr from-primary to-blue-600 border-2 border-white/20 relative"
            >
                <div className="bg-white/10 p-2 rounded-full">
                    <Sparkles size={32} className="text-yellow-300 animate-pulse" />
                </div>
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg border border-white/20">
                     GEMINI
                </span>
            </motion.a>
        </div>
    );
};


export default GeminiChat;
