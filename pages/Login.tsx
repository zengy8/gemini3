import React, { useState } from 'react';
import { login } from '../services/authService';
import { Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (login(password)) {
            onLogin();
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    }

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 pt-20">
            <div className="w-full max-w-md">
                <div className="bg-surface border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                    {/* Decorative gradients */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="relative z-10">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/10 shadow-inner">
                                <Lock size={32} />
                            </div>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-center mb-2 text-white">Admin Access</h2>
                        <p className="text-gray-400 text-center mb-8 text-sm">Enter your password to manage the nebula.</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError(false);
                                    }}
                                    placeholder="Password"
                                    className={`w-full bg-dark/50 border ${error ? 'border-red-500 text-red-200' : 'border-white/10 focus:border-primary text-white'} rounded-xl px-4 py-3 outline-none transition-all placeholder:text-gray-600`}
                                    autoFocus
                                />
                            </div>
                            
                            <button 
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/25 active:scale-95"
                            >
                                Login <ArrowRight size={18} />
                            </button>
                        </form>
                        
                        <p className="text-center mt-6 text-xs text-gray-600">
                           Hint: The password is <strong className="text-gray-500">admin</strong>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;