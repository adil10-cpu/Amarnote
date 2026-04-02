import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // DIU Email check
        if (!email.endsWith('@diu.edu.bd')) {
            setError('Only DIU students allowed (@diu.edu.bd)');
            return;
        }

        try {
            const response = await api.post('/auth/register', { name, email, password });
            login(response.data);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg card"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-primary mb-2 flex items-center justify-center gap-2">
                        <UserPlus className="text-primary w-8 h-8" /> JOIN AMAR NOTE
                    </h1>
                    <p className="text-slate-500">Create your account to start managing DIU notes</p>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                        <AlertCircle size={20} />
                        <p className="text-sm font-semibold">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-800">
                    <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            placeholder="DIU Student Name"
                            required
                        />
                    </div>
                    <div className="col-span-full md:col-span-1">
                        <label className="block text-sm font-medium mb-1">DIU Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input-field"
                            placeholder="id@diu.edu.bd"
                            required
                        />
                    </div>
                    <div className="col-span-full">
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="col-span-full btn-primary h-12 text-lg font-bold mt-4">
                        REGISTER
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary font-bold hover:underline flex items-center justify-center gap-1">
                        <LogIn size={18} /> Login Here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
