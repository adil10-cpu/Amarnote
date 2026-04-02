import React, { useState, useRef } from 'react';
import { Camera, Upload, Check, Loader, FilePlus, ChevronLeft, Image as ImageIcon, GraduationCap } from 'lucide-react';
import Tesseract from 'tesseract.js';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CaptureNote: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [extractedText, setExtractedText] = useState('');
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [teacher, setTeacher] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isEditing, setIsEditing] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result as string);
                performOCR(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const performOCR = async (imageSrc: string) => {
        setLoading(true);
        setExtractedText('');
        setProgress(0);

        try {
            const { data: { text } } = await Tesseract.recognize(
                imageSrc,
                'eng',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            setProgress(Math.floor(m.progress * 100));
                        }
                    }
                }
            );
            setExtractedText(text);
            setIsEditing(true);
        } catch (error) {
            console.error("OCR Error:", error);
            alert("Failed to extract text from image.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNote = async () => {
        if (!subject || !topic || !extractedText) {
            alert('Please fill at least Subject, Topic and ensure text is extracted.');
            return;
        }

        try {
            await api.post('/notes', {
                subject,
                topic,
                teacher,
                date,
                extractedText,
                image // Send the base64 image
            });
            alert('Note saved successfully!');
            navigate('/notes');
        } catch (error) {

            console.error('Error saving note:', error);
            alert('Failed to save note.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
            {/* Nav Header */}
             <div className="bg-white border-b border-slate-200 py-4 px-6 mb-8 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <button onClick={() => navigate('/dashboard')} className="text-slate-500 hover:text-primary flex items-center gap-1 font-semibold">
                    <ChevronLeft size={20} /> Dashboard
                </button>
                <div className="flex items-center gap-2">
                    <GraduationCap className="text-primary w-6 h-6" />
                    <h1 className="text-xl font-bold text-primary">CAPTURE NOTE</h1>
                </div>
                <div className="w-20"></div>
            </div>

            <main className="max-w-4xl mx-auto px-6">
                {!image && (
                   <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card flex flex-col items-center justify-center p-20 text-center border-dashed border-4 border-slate-300"
                    >
                        <div className="bg-primary/10 p-6 rounded-full text-primary mb-6">
                            <ImageIcon size={64} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">No Image Selected</h2>
                        <p className="text-slate-500 mb-8 max-w-sm">Capture a clear photo of your classroom board or upload one from your gallery to start extraction.</p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-secondary py-4 px-8 text-lg rounded-2xl flex items-center justify-center gap-2"
                            >
                                <Camera size={24} /> Take Photo
                            </button>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="btn-primary py-4 px-8 text-lg rounded-2xl flex items-center justify-center gap-2"
                            >
                                <Upload size={24} /> Upload Note
                            </button>
                            <input 
                                type="file" 
                                accept="image/*" 
                                capture="environment" 
                                ref={fileInputRef} 
                                onChange={handleImageUpload} 
                                className="hidden" 
                            />
                        </div>

                    </motion.div>
                )}

                {image && (
                    <div className="space-y-8">
                       <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="card overflow-hidden p-0"
                        >
                            <img src={image} alt="Note Sample" className="w-full h-auto max-h-[500px] object-contain bg-black" />
                            <div className="p-4 bg-slate-100 flex justify-between items-center text-sm">
                                <span className="font-semibold text-slate-600">Selected Image Preview</span>
                                <button onClick={() => setImage(null)} className="text-red-500 font-bold hover:underline">Remove</button>
                            </div>
                        </motion.div>

                        {loading && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="card flex flex-col items-center justify-center p-12 text-blue-600"
                            >
                                <Loader className="animate-spin mb-4" size={48} />
                                <h3 className="text-xl font-bold mb-2 italic">Scanning Board Text...</h3>
                                <div className="w-full max-w-xs bg-slate-200 h-3 rounded-full overflow-hidden mt-4">
                                    <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                </div>
                                <span className="mt-2 text-primary font-bold">{progress}% Complete</span>
                            </motion.div>
                        )}

                        <AnimatePresence>
                        {isEditing && !loading && (
                           <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="card bg-white"
                            >
                                <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2 border-b-2 border-primary/20 pb-2">
                                    <FilePlus /> Finalize Your Note
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-slate-800">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-1 uppercase tracking-wider">Subject Name</label>
                                        <input 
                                            type="text" 
                                            value={subject} 
                                            onChange={(e) => setSubject(e.target.value)} 
                                            className="input-field" 
                                            placeholder="e.g. Data Structures"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-1 uppercase tracking-wider">Topic / Lesson</label>
                                        <input 
                                            type="text" 
                                            value={topic} 
                                            onChange={(e) => setTopic(e.target.value)} 
                                            className="input-field" 
                                            placeholder="e.g. Binary Search Tree"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-1 uppercase tracking-wider">Teacher Name</label>
                                        <input 
                                            type="text" 
                                            value={teacher} 
                                            onChange={(e) => setTeacher(e.target.value)} 
                                            className="input-field" 
                                            placeholder="e.g. Dr. Md. Mostafa Kamal"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-1 uppercase tracking-wider">Note Date</label>
                                        <input 
                                            type="date" 
                                            value={date} 
                                            onChange={(e) => setDate(e.target.value)} 
                                            className="input-field" 
                                        />
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <label className="block text-sm font-bold text-slate-600 mb-1 uppercase tracking-wider">Extracted Note Text</label>
                                    <textarea 
                                        value={extractedText} 
                                        onChange={(e) => setExtractedText(e.target.value)} 
                                        className="input-field h-64 resize-none leading-relaxed font-mono text-sm border-2 border-primary/20"
                                        placeholder="Note text here..."
                                    />
                                </div>

                                <div className="flex gap-4">
                                     <button 
                                        onClick={handleSaveNote}
                                        className="flex-1 btn-secondary py-4 text-xl font-bold uppercase rounded-2xl"
                                    >
                                        <Check size={28} /> SAVE DIGITAL NOTE
                                    </button>
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CaptureNote;
