import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, FileText, Search, GraduationCap, ChevronRight, Code, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();


    const menuItems = [
        {
            title: 'Capture Note',
            desc: 'Scan classroom board or upload an image to digitize notes.',
            icon: Camera,
            path: '/capture',
            color: 'bg-primary'
        },
        {
            title: 'My Notes',
            desc: 'View, edit, and export your digital notes collection.',
            icon: FileText,
            path: '/notes',
            color: 'bg-secondary'
        },
        {
            title: 'Search Notes',
            desc: 'Search through your notes by subject, topic or teacher.',
            icon: Search,
            path: '/search',
            color: 'bg-accent'
        }
    ];

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-green-50">
            {/* Very Vibrant Background Glows for DIU Theme */}
            <div className="absolute top-0 -left-20 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 -right-20 w-[500px] h-[500px] bg-secondary/30 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] -z-20"></div>
            
            {/* Header */}
            <header className="bg-white/70 backdrop-blur-xl border-b border-white/20 py-4 px-6 fixed top-0 w-full z-30 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <GraduationCap className="text-primary w-8 h-8" />
                    <h1 className="text-2xl font-bold text-primary tracking-tight uppercase">AMAR NOTE</h1>
                </div>
                <div className="flex items-center gap-4">
                    <a 
                        href="https://github.com/adil10-cpu/Amar-note" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                    >
                        <Code size={18} /> GitHub Repo
                    </a>

                    <a 
                        href="https://studentportal.diu.edu.bd/connected" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-secondary font-bold flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-full text-sm hover:bg-secondary hover:text-white transition-all cursor-pointer border border-secondary/20"
                    >
                         DIU STUDENT HUB
                         <ExternalLink size={14} />
                    </a>
                </div>
            </header>


            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 mt-28">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <h2 className="text-4xl font-extrabold text-slate-800 mb-2">Welcome to Amar Note! 🚀</h2>
                    <p className="text-slate-500 text-lg">Your personal assistant for digitizing and managing DIU classroom notes.</p>
                </motion.div>


                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {menuItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link 
                                to={item.path} 
                                className="group card flex flex-col h-full bg-white hover:bg-slate-50 p-8"
                            >
                                <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-3">{item.title}</h3>
                                <p className="text-slate-500 mb-6 flex-grow">{item.desc}</p>
                                <div className="flex items-center text-primary font-bold gap-1 mt-auto">
                                    Get Started <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Welcome Card for Desktop */}
                <motion.div
                   initial={{ opacity: 0, y: 30 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.4 }}
                   className="mt-12 bg-gradient-to-r from-primary to-secondary rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden"
                >

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-4 italic">"Efficiency is the key to Success"</h3>
                        <p className="max-w-2xl text-blue-50 text-lg">
                            Amar Note is specifically designed for Daffodil International University students to simplify the process of digitizing and organizing handwritten or board notes.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-secondary opacity-20 rounded-full mr-20 -mb-10"></div>
                </motion.div>
            </main>
        </div>
    );
};

export default Dashboard;
