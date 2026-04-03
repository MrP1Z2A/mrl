import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { X, Mail, Lock, User, Loader2, Github, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const tempPass = Math.random().toString(36).slice(-10);
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password: tempPass,
        });
        
        if (signUpError) throw signUpError;
        
        if (signUpData.user) {
          // Store the temp_pass in the profiles table
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ temp_pass: tempPass })
            .eq('id', signUpData.user.id);
            
          // If the profile update fails, it means the trigger hasn't created the profile yet
          // or there's an RLS issue. We'll log it but proceed with signup.
          if (profileError) console.error('Error saving temp_pass:', profileError);
          else console.log('Temporary password saved successfully:', tempPass);
        }

        alert(`Account created! Check your email for the confirmation link.\n\nYour temporary profile password is: ${tempPass}\n(This has been saved to your profile)`);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'github' | 'google' | 'apple') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || `${provider} login failed`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              {isLogin ? 'Welcome Back' : 'Join the Lab'}
            </h2>
            <p className="text-slate-500 mt-2">
              {isLogin
                ? 'Sign in to access your projects and profile'
                : 'Create an account to start sharing your innovations'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5c98ff] focus:border-transparent transition-all outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#5c98ff] focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#5c98ff] text-white font-bold rounded-xl hover:bg-[#4a86ee] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                isLogin ? 'Sign In' : 'Sign Up'
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => handleOAuthLogin('github')}
              className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-3"
            >
              <Github size={20} />
              Continue with GitHub
            </button>

            <button
              onClick={() => handleOAuthLogin('google')}
              className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuthLogin('apple')}
              className="w-full py-3 bg-black text-white font-bold rounded-xl hover:bg-zinc-900 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.057 10.78c.045 1.825 1.583 2.435 1.604 2.445-.015.053-.252.873-.84 1.728-.507.732-1.033 1.465-1.848 1.48-1.791.03-2.262-1.12-4.04-1.12-1.776 0-2.323 1.104-3.983 1.15-.8.025-1.4-.784-1.914-1.523-1.053-1.515-1.857-4.283-.78-6.143.535-.923 1.483-1.51 2.52-1.524 1.713-.024 2.253 1.1 3.308 1.1 1.053 0 1.731-1.144 3.636-1.1.794.025 1.503.31 1.983.84-.04.024-.813.474-.81 1.467zM14.965 3.3c.773-.935 1.291-2.235 1.15-3.535-1.116.046-2.463.743-3.262 1.678-.716.83-1.344 2.152-1.176 3.424 1.243.096 2.513-.632 3.288-1.567z"/>
              </svg>
              Continue with Apple
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-slate-500">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-[#5c98ff] font-bold hover:underline"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-[#5c98ff] font-bold hover:underline"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
