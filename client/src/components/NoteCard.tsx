import React from 'react';
import { Calendar, User, BookOpen, Download, FileText, ChevronDown, ChevronUp, Image as ImageIcon, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';
import { BASE_URL } from '../services/api';
import api from '../services/api';

interface Note {
    _id: string;
    subject: string;
    topic: string;
    teacher: string;
    date: string;
    extractedText: string;
    imageUrl?: string;
    createdAt: string;
}

interface NoteCardProps {
    note: Note;
    onDelete: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
    const [expanded, setExpanded] = React.useState(false);
    const [isDownloading, setIsDownloading] = React.useState(false);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this note forever?')) {
            try {
                await api.delete(`/notes/${note._id}`);
                onDelete();
            } catch (error) {
                console.error('Delete error:', error);
                alert('Failed to delete note.');
            }
        }
    };

    const downloadPDF = async () => {
        setIsDownloading(true);
        const doc = new jsPDF();
        
        // Add PDF content (Existing logic)
        doc.setFillColor(30, 58, 138);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.text('DIU Digital Notes', 105, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Subject: ${note.subject} | Topic: ${note.topic}`, 105, 30, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.text(`Teacher: ${note.teacher}`, 20, 55);
        doc.text(`Date: ${new Date(note.date).toLocaleDateString()}`, 150, 55);

        if (note.imageUrl) {
            try {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = `${BASE_URL}${note.imageUrl}`;
                await new Promise((resolve) => { img.onload = resolve; });
                const canvas = document.createElement('canvas');
                canvas.width = img.width; canvas.height = img.height;
                canvas.getContext('2d')?.drawImage(img, 0, 0);
                doc.addImage(canvas.toDataURL('image/jpeg', 0.8), 'JPEG', 20, 65, 170, 90);
            } catch (e) {
                 doc.text('[Image could not be loaded]', 20, 80);
            }
        }

        doc.setFontSize(12);
        const splitContent = doc.splitTextToSize(note.extractedText, 170);
        doc.text(splitContent, 20, note.imageUrl ? 165 : 70);
        
        doc.save(`${note.subject.replace(/\s+/g, '_')}_Note.pdf`);
        setIsDownloading(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col bg-white rounded-3xl shadow-[0_15px_40px_rgba(30,58,138,0.08)] border border-slate-100 overflow-hidden group"
        >
            <div className="p-6 flex flex-col gap-5">
                <div className="flex justify-between items-start">
                    <div className="bg-primary/5 p-3 rounded-2xl text-primary mb-2">
                        <BookOpen size={24} />
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
                        {note.subject}
                    </span>
                </div>

                <div>
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-1 mb-1">{note.topic}</h3>
                    <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-xl">
                            <User size={14} className="text-secondary" /> {note.teacher}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-xl">
                            <Calendar size={14} className="text-primary" /> {new Date(note.date).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
                    <p className={`text-slate-600 text-sm leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
                        {note.extractedText}
                    </p>
                </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center gap-3">
               <div className="flex gap-2">
                    <button 
                        onClick={downloadPDF}
                        disabled={isDownloading}
                        className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-800 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                    >
                        <Download size={18} /> {isDownloading ? '...' : 'PDF'}
                    </button>
                    <button 
                        onClick={() => setExpanded(!expanded)}
                        className="bg-white text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-100 border border-slate-200 transition-all shadow-sm"
                    >
                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />} {expanded ? 'Hide' : 'Text'}
                    </button>
               </div>
               
               <button 
                    onClick={handleDelete}
                    className="bg-red-50 text-red-500 p-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-100"
                    title="Delete Note"
                >
                    <Trash2 size={20} />
                </button>
            </div>
            
            <div className="bg-white px-6 py-3 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-widest">
                <span>Digitized {new Date(note.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 text-primary"><FileText size={10} /> AMAR NOTE</span>
            </div>
        </motion.div>
    );
};

export default NoteCard;
