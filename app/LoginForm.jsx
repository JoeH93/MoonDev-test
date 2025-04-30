'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Spinner } from './components/Spinner';

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
  
    try {
      setLoading(true)
      // 1. Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password,
      });
  
      if (error) throw error;
  
      
      if (!data.user.email_confirmed_at) {
        throw new Error('Please verify your email before logging in');
      }
  
      // 3. Get user role from your table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_evaluator')
        .eq('email', email)
        .single();
  
      if (userError) throw userError;
      if (!userData) throw new Error('User not found in database');
      const is_evaluator = userData.is_evaluator === true || userData.is_evaluator === 'true' || userData.is_evaluator === 1;
      // 4. Redirect based on role
      window.location.href = is_evaluator ? '/evaluator' : '/developer';
      
      
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl text-white">
      <h2 className="text-2xl font-semibold mb-6 text-center text-slate-100">
        Login to Your Account
      </h2>

      {error && (
        <p className="text-red-400 text-sm text-center mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="text"
            placeholder="your_email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <button
        type="submit"
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-md flex justify-center items-center"
      >
        {loading ? (
          <Spinner />
        ) : (
          'Sign in'
        )}
      </button>
      </form>
    </div>
  );
}
