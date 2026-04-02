import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, GraduationCap, Loader, PlusCircle, Search } from 'lucide-react';
import api from '../services/api';
import NoteCard from '../components/NoteCard';
import { motion } from 'framer-motion';

const MyNotes: React.FC = () => {
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await api.get('/notes');
                setNotes(response.data);
            } catch (err) {
                console.error('Fetch notes error:', err);
                alert('Failed to load notes');
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 py-4 px-6 mb-8 flex items-center justify-between shadow-md sticky top-0 z-10">
                <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-primary flex items-center gap-1 font-bold">
                    <ChevronLeft size={20} /> Dashboard
                </button>
                <div className="flex items-center gap-2">
                    <GraduationCap className="text-primary w-6 h-6" />
                    <h1 className="text-xl font-bold text-primary">MY DIGITAL NOTES</h1>
                </div>
                <button 
                  onClick={() => navigate('/capture')}
                  className="bg-primary text-white p-2 rounded-xl hover:bg-accent transition-all transform hover:scale-110"
                >
                    <PlusCircle size={24} />
                </button>
            </header>

            <main className="max-w-5xl mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                     <h2 className="text-3xl font-extrabold text-primary tracking-tight">Your DIU Collection</h2>
                     <button onClick={() => navigate('/search')} className="text-slate-500 hover:text-primary flex gap-1 items-center font-semibold">
                         <Search size={18} /> Search Tools
                     </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-20 text-primary">
                        <Loader className="animate-spin mr-2" size={32} /> Loading your library...
                    </div>
                ) : notes.length === 0 ? (
                    <div className="card text-center p-20 bg-white border-dashed border-2 border-slate-300">
                        <h3 className="text-2xl font-bold text-slate-400 mb-4 italic">"No digital notes found yet."</h3>
                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Start by scanning some classroom board notes and they will appear here in your digital library!</p>
                        <button onClick={() => navigate('/capture')} className="btn-primary px-8 h-12 rounded-2xl mx-auto">
                           <PlusCircle size={20}/> Capture First Note
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {notes.map(note => (
                            <NoteCard key={note._id} note={note} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyNotes;
