import React, { useState } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from '../firebase';
import { Mail, Lock, User, Sparkles, LogIn, Chrome, Check } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: (user: any) => void;
  onContinueOffline?: () => void;
}

export function AuthScreen({ onSuccess, onContinueOffline }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          throw new Error('Please enter your name');
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
        onSuccess(auth.currentUser);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onSuccess(userCredential.user);
      }
    } catch (err: any) {
      let friendlyMessage = err.message;
      if (err.code === 'auth/invalid-credential') {
        friendlyMessage = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyMessage = 'This email is already in use.';
      } else if (err.code === 'auth/weak-password') {
        friendlyMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyMessage = 'Invalid email address format.';
      }
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onSuccess(result.user);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google Sign-In failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden text-[#e4e4e7]">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">PenPicture Studio</h2>
          <p className="text-xs text-zinc-400 mt-2">
            Professional responsive design from markup & code
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#111113] border border-[#27272a] focus:border-indigo-500 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 bg-[#111113] border border-[#27272a] focus:border-indigo-500 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full pl-10 pr-4 py-2.5 bg-[#111113] border border-[#27272a] focus:border-indigo-500 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/30 border border-red-900/50 rounded-xl text-red-400 text-[11px] font-medium leading-normal animate-in fade-in slide-in-from-top-2 duration-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/10 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{isSignUp ? 'Create Account' : 'Sign In with Email'}</span>
              </>
            )}
          </button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-[#27272a]"></div>
          <span className="flex-shrink mx-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Or continue with</span>
          <div className="flex-grow border-t border-[#27272a]"></div>
        </div>

        {/* Social Buttons */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-2.5 bg-[#111113] hover:bg-[#18181b] border border-[#27272a] hover:border-zinc-700 text-zinc-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm mb-3"
        >
          <Chrome className="w-4 h-4 text-indigo-400" />
          <span>Sign In with Google</span>
        </button>

        {onContinueOffline && (
          <button
            onClick={onContinueOffline}
            type="button"
            className="w-full py-2.5 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-600 text-zinc-300 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 cursor-pointer shadow-sm"
          >
            <span>Continue as Guest (Offline Design Mode)</span>
          </button>
        )}

        {/* Toggle Mode */}
        <p className="text-center text-xs text-zinc-400 mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            disabled={loading}
            className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition focus:outline-none"
          >
            {isSignUp ? 'Sign In' : 'Sign Up Free'}
          </button>
        </p>
      </div>
    </div>
  );
}
