'use client'
import Link from "next/link";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Spinner } from "../components/Spinner";

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [is_evaluator, setis_evaluator] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    // Basic validation
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
  
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
  
    try {
      
      const lowerCaseEmail = email.toLowerCase();
  
      const { data, error } = await supabase.auth.signUp({
        email: lowerCaseEmail,
        password,
        options: {
          data: { full_name: fullName, phone: phoneNumber, is_evaluator: is_evaluator },
          emailRedirectTo: `${location.origin}/`,
        },
      });
  
      const { dataEntry, error: insertError } = await supabase
        .from('users')
        .insert([{
          full_name: fullName,
          phone: phoneNumber,
          email: lowerCaseEmail,
          is_evaluator: is_evaluator,
        }]);
  
      if (error) {
        setLoading(false);
        throw error;
      }
  
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
      setSuccess(true);
    }
  };
  

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
        <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg px-8 py-6 w-full max-w-md text-white border border-white/10">
          <h2 className="text-2xl font-semibold mb-4">Check Your Email</h2>
          <p className="mb-4">
            We've sent a verification link to <span className="font-semibold">{email}</span>.
            Please click the link to verify your account.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
            >
              Return to Login
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm text-center mt-4">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 shadow-xl text-white">
        <h2 className="text-2xl font-semibold mb-6 text-center text-slate-100">
          Create Your Account
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">
              Password (min 6 characters)
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-slate-300 mb-1">
              Confirm Password
            </label>
            <input
              id="passwordConfirmation"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 text-white rounded-md border border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div className="flex items-center">
            <input
              id="is_evaluator"
              type="checkbox"
              checked={is_evaluator}
              onChange={(e) => setis_evaluator(e.target.checked)}
              className="h-4 w-4 text-cyan-500 focus:ring-cyan-400 border-slate-600 rounded"
            />
            <label htmlFor="is_evaluator" className="ml-2 block text-sm text-slate-300">
              I am an evaluator
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 rounded-lg transition-all duration-300 flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <Spinner />
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link
            href="/"
            className="underline text-cyan-400 hover:text-cyan-300 transition duration-200"
          >
            Log in
          </Link>
        </div>
      </div>
    </main>
  );
}