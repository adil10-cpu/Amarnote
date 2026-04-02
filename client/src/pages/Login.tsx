import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const response = await api.post('/auth/login', { email, password });
      login(response.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md card"
      >
        <div className="text-center mb-8">
            <div className="bg-primary p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <LogIn className="text-white w-8 h-8" />
            </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Amar Note</h1>
          <p className="text-slate-500">Welcome back, DIU Student!</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-slate-800">
          <div>
            <label className="block text-sm font-medium mb-1">DIU Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="id@diu.edu.bd"
              required
            />
          </div>
          <div>
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
          <button type="submit" className="w-full btn-primary h-12 text-lg font-semibold">
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline flex items-center justify-center gap-1 mt-2">
            <UserPlus size={18} /> Join DIU Amar Note
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
