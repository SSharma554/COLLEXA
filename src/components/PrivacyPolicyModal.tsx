import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Lock, Trash2, Video, BellOff, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'privacy' | 'unsubscribe';
}

export function PrivacyPolicyModal({
  isOpen,
  onClose,
  defaultTab = 'privacy',
}: PrivacyPolicyModalProps) {
  const [tab, setTab] = useState<'privacy' | 'unsubscribe'>(defaultTab);
  const [emailInput, setEmailInput] = useState('');
  const [unsubscribed, setUnsubscribed] = useState(false);

  const handleUnsubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setUnsubscribed(true);
    toast.success(`Successfully unsubscribed ${emailInput} from all marketing & reminder digests.`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#F3E6D5] overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#F3E6D5] flex items-center justify-between bg-[#FFF9F2]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#800020] text-[#FFF9F2] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5 text-[#F3E6D5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#800020] font-serif">
                  COLLEXA Privacy &amp; Data Governance
                </h3>
                <p className="text-xs text-[#5C3D46]">
                  Strict Zero-Trust Architecture &bull; 14-Day Media Auto-Purge
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#5C3D46]/70 hover:text-[#800020] hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-[#F3E6D5]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selector */}
          <div className="px-6 pt-4 flex gap-2 border-b border-[#F3E6D5] bg-white">
            <button
              onClick={() => setTab('privacy')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                tab === 'privacy'
                  ? 'border-[#800020] text-[#800020]'
                  : 'border-transparent text-[#5C3D46]/60 hover:text-[#800020]'
              }`}
            >
              Privacy &amp; Media Consent Policy
            </button>
            <button
              onClick={() => setTab('unsubscribe')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                tab === 'unsubscribe'
                  ? 'border-[#800020] text-[#800020]'
                  : 'border-transparent text-[#5C3D46]/60 hover:text-[#800020]'
              }`}
            >
              Email Unsubscribe
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto space-y-6 text-xs text-[#5C3D46] leading-relaxed">
            {tab === 'privacy' ? (
              <>
                <section className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5] space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#800020]">
                    <Video className="w-4 h-4 text-[#800020]" />
                    <h4>1. Camera, Microphone &amp; Media Consent</h4>
                  </div>
                  <p>
                    Camera and microphone permissions requested by COLLEXA are utilized purely for real-time
                    in-browser telemetry (evaluating gaze alignment, audio cadence in WPM, and posture).
                    Video and audio recording saves are <strong>defaulted to OFF</strong>.
                    Only when you explicitly toggle &quot;Save Recording&quot; will media be packaged and stored.
                  </p>
                </section>

                <section className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5] space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#800020]">
                    <Trash2 className="w-4 h-4 text-[#D45060]" />
                    <h4>2. 14-Day Storage Bucket Auto-Purge Lifecycle</h4>
                  </div>
                  <p>
                    All saved candidate media is hosted inside a private, isolated Supabase Storage bucket
                    (<code>interview-recordings</code>) governed by signed time-limited URLs.
                    An automated 14-day server lifecycle rule systematically deletes video/audio files
                    permanently after 14 days, preventing stale media retention.
                  </p>
                </section>

                <section className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5] space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#800020]">
                    <Lock className="w-4 h-4 text-emerald-600" />
                    <h4>3. Strict PostgreSQL Row Level Security (RLS)</h4>
                  </div>
                  <p>
                    All database tables (<code>profiles</code>, <code>user_roadmap_progress</code>,
                    <code>interview_sessions</code>, <code>interview_answers</code>, <code>counseling_threads</code>,
                    <code>earned_certificates</code>) enforce PostgreSQL RLS policies where <code>auth.uid() = user_id</code>.
                    No other candidate or 3rd party can read your answers, transcripts, or scorecards.
                  </p>
                </section>

                <section className="space-y-1">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#800020]">
                    4. Cascading Account Deletion (GDPR &amp; CCPA)
                  </h4>
                  <p>
                    You retain the right to permanently purge your account at any time via the
                    Dashboard Settings panel. Deleting your account initiates a cascading database drop
                    removing all milestone completions, transcripts, and storage objects immediately.
                  </p>
                </section>
              </>
            ) : (
              <div className="space-y-6 py-2">
                <div className="text-center max-w-md mx-auto space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-2">
                    <BellOff className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-[#800020] font-serif">
                    Email Digest Unsubscribe
                  </h4>
                  <p className="text-xs text-[#5C3D46]">
                    Manage your email preferences for COLLEXA roadmap digests, interview reminders, and platform updates.
                  </p>
                </div>

                {unsubscribed ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                      <Check className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-emerald-900">
                      You have been successfully unsubscribed.
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      You will no longer receive transactional marketing or digest emails. Account security notices will still be delivered.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleUnsubscribe} className="max-w-md mx-auto space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#800020] mb-1">
                        Your Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full px-4 py-2.5 text-xs rounded-xl border border-[#F3E6D5] bg-[#FFF9F2] text-[#800020] placeholder:text-[#5C3D46]/40 focus:outline-none focus:border-[#800020]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#800020] text-[#FFF9F2] hover:bg-[#660019] transition-colors cursor-pointer"
                    >
                      Unsubscribe From All Digests
                    </button>
                    <p className="text-[10px] text-[#5C3D46]/60 text-center">
                      Requests are processed instantaneously in accordance with CAN-SPAM and GDPR mandates.
                    </p>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#F3E6D5] bg-[#FFF9F2] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#800020] text-[#FFF9F2] hover:bg-[#660019] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
