import React from 'react';
import { Calendar, User, BookOpen, Download, FileText, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';
import { BASE_URL } from '../services/api';

interface Note {
    _id: string;
    subject: string;
    topic: string;
    teacher: string;
    date: string;
    imageUrl?: string;
    extractedText: string;
    createdAt: string;
}



const NoteCard: React.FC<{ note: Note }> = ({ note }) => {
    const [expanded, setExpanded] = React.useState(false);

    const downloadPDF = async () => {
        const doc = new jsPDF();
        let yPos = 80;
        
        // Official PDF Branding
        doc.setFillColor(30, 58, 138); 
        doc.rect(0, 0, 210, 25, 'F');
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text("AMAR NOTE - DIU DIGITAL NOTES", 20, 17);
        
        // Subject & Topic info with bold styles
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text(`Subject: ${note.subject}`, 20, 40);
        doc.text(`Topic: ${note.topic}`, 20, 50);
        
        doc.setFontSize(12);
        doc.setTextColor(80, 80, 80);
        doc.setFont("helvetica", "normal");
        doc.text(`Teacher: ${note.teacher}`, 20, 60);
        doc.text(`Date Prepared: ${new Date(note.date).toLocaleDateString()}`, 20, 68);
        
        doc.setDrawColor(30, 58, 138);
        doc.line(20, 72, 190, 72);

        // Add Note Image with async pre-loading to ensure it's in the PDF
        if (note.imageUrl) {
            try {
                const fullUrl = `${BASE_URL}${note.imageUrl}`;
                const img = new Image();
                img.crossOrigin = 'Anonymous';
                
                // Promise to wait for image to load
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = fullUrl;
                });

                // Calculate image dimensions while maintaining aspect ratio
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0);
                const dataUrl = canvas.toDataURL('image/png');

                doc.addImage(dataUrl, 'PNG', 20, 80, 170, (170 * img.height) / img.width);
                yPos = 80 + (170 * img.height) / img.width + 15; 
            } catch (e) {
                console.error("Error embedding image in PDF:", e);
                yPos = 80;
            }
        }
        
        // Finalized Extracted Text
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        const splitText = doc.splitTextToSize(note.extractedText, 170);
        
        // Create new page if text is too long for the first page
        if (yPos + (splitText.length * 6) > 280) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.text(splitText, 20, yPos);
        
        // Metadata footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Digitized with Amar Note Student Hub - DIU`, 20, 285);

        const safeTitle = `${note.subject.replace(/\s+/g, '_')}_${note.topic.replace(/\s+/g, '_')}`.toLowerCase();
        doc.save(`${safeTitle}_note.pdf`);
    };


    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-0 overflow-hidden bg-white mb-6 border border-slate-200"
        >
            {note.imageUrl && (
                <div className="w-full h-48 overflow-hidden bg-slate-200 relative group">
                    <img
                        src={`${BASE_URL}${note.imageUrl}`}
                        alt={note.topic}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-bottom p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-bold flex items-center gap-1 self-end"><ImageIcon size={14} /> ORIGINAL BOARD PHOTO</span>
                    </div>
                </div>
            )}
            <div className="p-6">

                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 text-primary font-bold mb-1 uppercase tracking-wider text-xs">
                            <BookOpen size={16} /> {note.subject}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">{note.topic}</h3>
                    </div>
                    <button
                        onClick={downloadPDF}
                        className="bg-secondary/10 text-secondary p-2 rounded-xl hover:bg-secondary hover:text-white transition-all transform hover:scale-105"
                        title="Download PDF"
                    >
                        <Download size={20} />
                    </button>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4 border-b border-slate-100 pb-4">
                    <span className="flex items-center gap-1">
                        <User size={16} className="text-primary" /> {note.teacher}
                    </span>
                    <span className="flex items-center gap-1">
                        <Calendar size={16} className="text-primary" /> {new Date(note.date).toLocaleDateString()}
                    </span>
                </div>

                <div className="relative">
                    <p className={`text-slate-700 text-sm leading-relaxed ${!expanded ? 'line-clamp-3' : ''}`}>
                        {note.extractedText}
                    </p>
                    {note.extractedText.length > 200 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="mt-2 text-primary font-bold flex items-center gap-1 text-sm hover:underline"
                        >
                            {expanded ? (
                                <>Show Less <ChevronUp size={16} /></>
                            ) : (
                                <>View Full Note <ChevronDown size={16} /></>
                            )}
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-slate-50 p-4 flex justify-between items-center text-xs text-slate-400 font-medium">
                <span>Digitized on {new Date(note.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center gap-1 uppercase tracking-widest"><FileText size={12} /> AMAR NOTE</span>
            </div>
        </motion.div>
    );
};

export default NoteCard;
