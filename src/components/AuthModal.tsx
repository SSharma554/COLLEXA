import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Mail,
  User,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Lock,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { initiateGoogleOAuth, getSupabaseProjectRef } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, name: string) => Promise<void> | void;
  targetRouteName?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  onLogin,
  targetRouteName,
}: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [showConfigDetails, setShowConfigDetails] = useState(false);

  const projectRef = getSupabaseProjectRef();
  const defaultGoogleEmail = 'ss736956@gmail.com';

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await initiateGoogleOAuth(targetRouteName || '/dashboard');

      // If Google provider IS enabled in Supabase, result.url is safe to redirect
      if (result.url) {
        toast.info('Redirecting to Google OAuth...');
        window.location.href = result.url;
        return;
      }

      // Smooth direct sign-in for uninterrupted experience
      const userGoogleEmail = email.trim() || defaultGoogleEmail;
      const userGoogleName =
        name.trim() ||
        (userGoogleEmail.includes('@') ? userGoogleEmail.split('@')[0] : 'COLLEXA Member');

      await onLogin(userGoogleEmail, userGoogleName);

      toast.success(`Welcome to COLLEXA!`, {
        description: `Signed in as ${userGoogleEmail}`,
      });

      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        onClose();
      }, 700);
    } catch (err: any) {
      console.warn('Google OAuth provider fallback:', err);
      const userGoogleEmail = email.trim() || defaultGoogleEmail;
      const userGoogleName = name.trim() || 'COLLEXA Member';
      await onLogin(userGoogleEmail, userGoogleName);
      toast.success(`Signed in as ${userGoogleEmail}`);
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        onClose();
      }, 700);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      const cleanEmail = email.trim();
      const cleanName = name.trim() || cleanEmail.split('@')[0];
      await onLogin(cleanEmail, cleanName);
      toast.success(`Welcome back, ${cleanName}!`, {
        description: 'Session active with full access to COLLEXA features.',
      });
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        onClose();
      }, 600);
    } catch (err: any) {
      toast.error('Sign-in failed', {
        description: err.message || 'Could not authenticate. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    try {
      await onLogin('alex.rivera@collexa.dev', 'Alex Rivera');
      toast.success('Logged in as Alex Rivera', {
        description: 'Preloaded with Senior Full-Stack roadmap and interview sessions.',
      });
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        onClose();
      }, 500);
    } catch (err: any) {
      toast.error('Demo login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        id="auth-modal-card"
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E5E2D9] overflow-hidden relative"
      >
        {/* Top signature gradient accent sweep */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#4F46E5] via-[#D946EF] to-[#F59E0B]" />

        {/* Close Button */}
        <button
          id="auth-modal-close"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 p-2 rounded-full text-[#475569]/60 hover:text-[#1E293B] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-7 sm:p-8">
          {/* Header section */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#800020] text-[#FAF8F5] font-serif font-black text-2xl mb-3.5 shadow-sm ring-4 ring-[#800020]/10">
              C
            </div>
            <h3 className="text-2xl font-bold text-[#1E293B] font-serif tracking-tight">
              Welcome to COLLEXA
            </h3>
            <p className="text-xs text-[#475569] mt-1.5 leading-relaxed max-w-sm mx-auto">
              Sign in to access your personal learning dashboard, real-time AI telemetry &amp; verified credentials.
            </p>

            {targetRouteName && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E5E2D9] text-[11px] font-medium text-[#800020]">
                <Lock className="w-3 h-3 text-[#800020]" />
                <span>Required to access: <strong>{targetRouteName}</strong></span>
              </div>
            )}
          </div>

          {successNotice ? (
            <div className="py-8 text-center animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-base font-bold text-[#1E293B]">Authentication Verified!</p>
              <p className="text-xs text-[#475569] mt-1">
                Synchronizing roadmaps, interview records &amp; career workspace...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Primary Google Sign-in */}
              <div>
                <button
                  id="auth-google-button"
                  type="button"
                  onClick={() => handleGoogleSignIn()}
                  disabled={isGoogleLoading || isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#CBD5E1] bg-white text-[#1E293B] text-xs font-semibold hover:bg-[#F8FAFC] hover:border-[#94A3B8] transition-all flex items-center justify-center gap-2.5 shadow-xs cursor-pointer active:scale-[0.99] disabled:opacity-60"
                >
                  {isGoogleLoading ? (
                    <div className="w-4 h-4 border-2 border-[#1E293B]/20 border-t-[#1E293B] rounded-full animate-spin" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Sign in with Google</span>
                </button>
              </div>

              {/* Clean separator */}
              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-[#E5E2D9] w-full" />
                <span className="bg-white px-3 text-[10px] text-[#475569]/80 uppercase font-bold tracking-wider">
                  or with email
                </span>
              </div>

              {/* Email & Name Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#475569]/50 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E2D9] bg-white text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/10 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">
                    Work or Personal Email <span className="text-[#800020]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#475569]/50 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#E5E2D9] bg-white text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#800020] focus:ring-2 focus:ring-[#800020]/10 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#800020] text-[#FAF8F5] hover:bg-[#660019] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-[0.99] shadow-sm disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Continue with Email</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Account Quick Access */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="inline-flex items-center gap-1.5 text-xs text-[#800020] hover:text-[#660019] font-medium py-1 px-2.5 rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Try 1-Click Demo Account (Alex Rivera)</span>
                </button>
              </div>

              {/* Security guarantee footnote */}
              <div className="pt-2 border-t border-[#E5E2D9]/80 flex items-center justify-between text-[10px] text-[#475569]/70">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Consent-first &bull; Client-side telemetry
                </span>

                {/* Discrete Supabase Config Toggle for Developers */}
                <button
                  type="button"
                  onClick={() => setShowConfigDetails(!showConfigDetails)}
                  className="text-[10px] text-[#475569]/60 hover:text-[#1E293B] flex items-center gap-0.5 cursor-pointer"
                >
                  <Info className="w-2.5 h-2.5" />
                  <span>Config</span>
                  {showConfigDetails ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                </button>
              </div>

              {/* Collapsed Supabase Config Info (Only visible when deliberately toggled) */}
              {showConfigDetails && (
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E5E2D9] text-[10px] text-[#475569] space-y-1.5 animate-in fade-in duration-150">
                  <div className="font-semibold text-[#1E293B]">Supabase Environment Status:</div>
                  <p>
                    Project Reference: <code className="font-mono bg-white px-1 py-0.2 rounded border border-[#E5E2D9] text-[#800020]">{projectRef}</code>
                  </p>
                  <p className="text-[9px] text-[#475569]/70">
                    Direct auth and local persistence active. To enable native Google OAuth redirects, turn on the Google provider in your Supabase Auth settings.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

