import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, GraduationCap, Search, Loader, BookOpen, User, Hash, AlertCircle } from 'lucide-react';
import api from '../services/api';
import NoteCard from '../components/NoteCard';
import { motion, AnimatePresence } from 'framer-motion';

const SearchNotes: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim()) {
                handleSearch();
            } else {
                setResults([]);
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSearch = async () => {
        setLoading(true);
        setIsSearching(true);
        try {
            const response = await api.get(`/notes/search?query=${query}`);
            setResults(response.data);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
             {/* Header */}
             <header className="bg-white border-b border-slate-200 py-4 px-6 mb-8 flex items-center justify-between shadow-md sticky top-0 z-10">
                <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-primary flex items-center gap-1 font-bold">
                    <ChevronLeft size={20} /> Dashboard
                </button>
                <div className="flex items-center gap-2">
                    <GraduationCap className="text-primary w-6 h-6" />
                    <h1 className="text-xl font-bold text-primary">ADVANCED SEARCH</h1>
                </div>
                <div className="w-20"></div>
            </header>

            <main className="max-w-4xl mx-auto px-6">
                <div className="mb-12">
                   <h2 className="text-3xl font-extrabold text-slate-800 mb-6 italic">Find your DIU Study Materials</h2>
                   
                   <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                             <Search size={22} className="group-focus-within:text-primary transition-colors duration-300" />
                        </div>
                        <input 
                            type="text" 
                            value={query} 
                            onChange={(e) => setQuery(e.target.value)} 
                            className="w-full h-16 pl-12 pr-4 bg-white border-2 border-slate-200 rounded-2xl shadow-xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none text-lg transition-all duration-300 font-medium placeholder:text-slate-400 placeholder:italic" 
                            placeholder="e.g. Data Structures, Dr. Kamal, Binary Search..."
                        />
                   </div>

                   <div className="mt-4 flex flex-wrap gap-2">
                        <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                            <BookOpen size={12}/> Subject
                        </span>
                        <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                            <Hash size={12}/> Topic
                        </span>
                        <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1">
                            <User size={12}/> Teacher
                        </span>
                   </div>
                </div>

                <div className="space-y-6">
                    {loading ? (
                       <div className="flex flex-col items-center justify-center p-20 text-primary">
                           <Loader className="animate-spin mb-4" size={48} />
                           <span className="font-bold italic">Searching through your digital library...</span>
                       </div>
                    ) : isSearching && results.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card text-center p-16 bg-white flex flex-col items-center gap-6"
                        >
                            <AlertCircle size={64} className="text-slate-300" />
                            <h3 className="text-2xl font-bold text-slate-400 italic">"No notes found matching your query."</h3>
                            <p className="text-slate-500 max-w-sm">Try searching by different keywords or check your collection.</p>
                            <button onClick={() => setQuery('')} className="btn-primary px-8 rounded-xl h-12 uppercase font-bold">Clear Search</button>
                        </motion.div>
                    ) : (
                        <AnimatePresence>
                            {results.map((note, index) => (
                                 <motion.div
                                    key={note._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <NoteCard 
                                        note={note} 
                                        onDelete={() => setResults(results.filter(r => r._id !== note._id))}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>

                    )}
                    
                    {!isSearching && !loading && (
                        <div className="text-center p-12 text-slate-400 font-medium italic border-2 border-slate-200 border-dashed rounded-3xl">
                            "Start typing above to search across all your digital notes instantly."
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SearchNotes;
