import { useState } from 'react';
import {
  UserProfile,
  UserRoadmapProgress,
  InterviewSession,
  EarnedCertificate,
} from '../types';
import { ROADMAPS, CATEGORY_THEMES } from '../lib/data';
import { SvgProgressRing } from '../components/SvgProgressRing';
import {
  User,
  Settings,
  Award,
  Video,
  Compass,
  CheckCircle2,
  Trash2,
  Bell,
  Shield,
  ExternalLink,
  Calendar,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

interface DashboardPageProps {
  currentUser: UserProfile | null;
  roadmapProgress: Record<string, UserRoadmapProgress>;
  interviewSessions: InterviewSession[];
  earnedCerts: EarnedCertificate[];
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onDeleteAccount: () => void;
  onNavigate: (path: string) => void;
  onOpenAuth: () => void;
}

export function DashboardPage({
  currentUser,
  roadmapProgress,
  interviewSessions,
  earnedCerts,
  onUpdateProfile,
  onDeleteAccount,
  onNavigate,
  onOpenAuth,
}: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Settings form state
  const [roleTarget, setRoleTarget] = useState(currentUser?.role_target || 'Senior Full-Stack Engineer');
  const [notifications, setNotifications] = useState(currentUser?.notifications_enabled ?? true);
  const [mediaConsent, setMediaConsent] = useState(currentUser?.media_consent_recording ?? false);
  const [saveNote, setSaveNote] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#800020] text-[#FFF9F2] font-serif font-black text-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
          C
        </div>
        <h2
          className="text-2xl font-bold text-black font-serif-heading mb-2"
          style={{ color: '#000000' }}
        >
          Sign In to Access Your Dashboard
        </h2>
        <p className="text-xs text-[#5C3D46] mb-6">
          Connect your Google account to track roadmap milestones, view mock interview scorecards, and manage your certificates.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-3 rounded-2xl text-xs font-bold text-[#FFF9F2] bg-[#800020] hover:bg-[#660019] transition-all shadow-sm cursor-pointer"
        >
          Sign In with Google / Email
        </button>
      </div>
    );
  }

  // Calculate total completed stages across all roadmaps
  let totalStagesCompleted = 0;
  let totalStagesAvailable = 0;

  ROADMAPS.forEach((r) => {
    totalStagesAvailable += r.stages.length;
    const prog = roadmapProgress[r.slug];
    if (prog?.completed_stages) {
      totalStagesCompleted += prog.completed_stages.length;
    }
  });

  const overallProgressPct = Math.round((totalStagesCompleted / totalStagesAvailable) * 100) || 0;

  const handleSaveSettings = () => {
    onUpdateProfile({
      role_target: roleTarget,
      notifications_enabled: notifications,
      media_consent_recording: mediaConsent,
    });
    setSaveNote(true);
    setTimeout(() => setSaveNote(false), 2000);
  };

  const handleConfirmDelete = () => {
    onDeleteAccount();
    setShowDeleteConfirm(false);
    onNavigate('/');
  };

  return (
    <div id="dashboard-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Profile Bar */}
      <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar_url}
            alt={currentUser.full_name}
            className="w-16 h-16 rounded-2xl border-2 border-[#F3E6D5] object-cover bg-white"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1
                className="text-2xl font-bold text-black font-serif-heading"
                style={{ color: '#000000' }}
              >
                {currentUser.full_name}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#F3E6D5]/60 text-[#800020] border border-[#F3E6D5] px-2 py-0.5 rounded-full">
                Active Member
              </span>
            </div>
            <p className="text-xs text-[#5C3D46] mt-0.5">{currentUser.email}</p>
            <p className="text-xs font-semibold text-[#D45060] mt-1">
              Target: {currentUser.role_target}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="inline-flex p-1 bg-[#F3E6D5]/40 rounded-2xl border border-[#F3E6D5] shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-[#800020] shadow-xs'
                : 'text-[#5C3D46] hover:text-[#800020]'
            }`}
          >
            <User className="w-3.5 h-3.5 text-[#800020]" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-white text-[#800020] shadow-xs'
                : 'text-[#5C3D46] hover:text-[#800020]'
            }`}
          >
            <Settings className="w-3.5 h-3.5 text-[#D45060]" />
            Settings
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Roadmaps Progress Ring */}
            <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C3D46]/70 block mb-1">
                  Roadmap Completion
                </span>
                <span className="text-2xl font-black text-[#800020] block">
                  {totalStagesCompleted} / {totalStagesAvailable}
                </span>
                <span className="text-xs text-[#5C3D46] mt-1 block">Stages Verified</span>
              </div>
              <SvgProgressRing
                percentage={overallProgressPct}
                size={85}
                strokeWidth={7}
                categoryColor="#800020"
              />
            </div>

            {/* Interviews Taken */}
            <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C3D46]/70 block mb-1">
                  AI Mock Interviews
                </span>
                <span className="text-2xl font-black text-[#800020] block">
                  {interviewSessions.length}
                </span>
                <span className="text-xs text-[#5C3D46] mt-1 block">
                  Avg Score:{' '}
                  {interviewSessions.length > 0
                    ? Math.round(
                        interviewSessions.reduce((acc, s) => acc + (s.overall_score || 80), 0) /
                          interviewSessions.length
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#F3E6D5] text-[#800020] flex items-center justify-center">
                <Video className="w-7 h-7" />
              </div>
            </div>

            {/* Claimed Certificates */}
            <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C3D46]/70 block mb-1">
                  Verified Credentials
                </span>
                <span className="text-2xl font-black text-[#800020] block">
                  {earnedCerts.length}
                </span>
                <span className="text-xs text-[#5C3D46] mt-1 block">Claimed &amp; Logged</span>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-[#F3E6D5] text-[#800020] flex items-center justify-center">
                <Award className="w-7 h-7" />
              </div>
            </div>
          </div>

          {/* Roadmaps Active Progress Cards */}
          <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-[#800020] font-serif-heading flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#800020]" />
                Enrolled Career Roadmaps
              </h2>
              <button
                onClick={() => onNavigate('/hub?tab=roadmaps')}
                className="text-xs font-semibold text-[#800020] hover:text-[#D45060] cursor-pointer"
              >
                Browse All 6 Roadmaps &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ROADMAPS.map((r) => {
                const prog = roadmapProgress[r.slug];
                const doneCount = prog?.completed_stages?.length || 0;
                const pct = Math.round((doneCount / r.stages.length) * 100);
                const theme = CATEGORY_THEMES[r.category];

                return (
                  <div
                    key={r.id}
                    onClick={() => onNavigate(`/roadmap/${r.slug}`)}
                    className="p-4 rounded-2xl border border-black bg-[#FFF9F2] hover:border-black transition-all cursor-pointer flex flex-col justify-between"
                    style={{ borderColor: '#000000' }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: theme.badgeBg, color: theme.color }}
                        >
                          {r.category}
                        </span>
                        <span className="text-xs font-bold text-[#800020]">{pct}%</span>
                      </div>
                      <h3 className="text-sm font-bold text-black mb-1" style={{ color: '#000000' }}>{r.title}</h3>
                      <p className="text-xs text-[#5C3D46] line-clamp-1">{r.description}</p>
                    </div>

                    <div className="mt-4">
                      <div className="w-full h-1.5 bg-[#F3E6D5]/60 rounded-full overflow-hidden border border-[#F3E6D5] mb-1.5">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%`, backgroundColor: theme.color }}
                        />
                      </div>
                      <span className="text-[10px] text-[#5C3D46]/70">
                        {doneCount} of {r.stages.length} milestones complete
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historical Interview Score Trend Chart & Sessions */}
          <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-[#800020] font-serif-heading flex items-center gap-2">
                <Video className="w-4 h-4 text-[#800020]" />
                Mock Interview History &amp; Telemetry Trend
              </h2>
              <button
                onClick={() => onNavigate('/interview-prep')}
                className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#800020] text-[#FFF9F2] hover:bg-[#660019] transition-colors cursor-pointer"
              >
                + New Interview
              </button>
            </div>

            {interviewSessions.length === 0 ? (
              <p className="text-xs text-[#5C3D46]/70 text-center py-6">
                No interview sessions recorded yet. Launch your first mock interview!
              </p>
            ) : (
              <div className="space-y-4">
                {/* SVG Visual Score Trend Bar Chart */}
                <div className="p-4 bg-[#FFF9F2] rounded-2xl border border-[#F3E6D5]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#800020] block mb-3">
                    Recent Performance Trajectory
                  </span>
                  <div className="h-28 flex items-end justify-between gap-3 pt-4 px-2">
                    {interviewSessions.slice(0, 7).reverse().map((s, i) => {
                      const score = s.overall_score || 80;
                      return (
                        <div key={s.id} className="flex-1 flex flex-col items-center gap-1 group">
                          <span className="text-[10px] font-bold text-[#800020] opacity-0 group-hover:opacity-100 transition-opacity">
                            {score}%
                          </span>
                          <div
                            className="w-full rounded-t-lg bg-[#800020] transition-all duration-300 group-hover:opacity-90"
                            style={{ height: `${(score / 100) * 80}px` }}
                          />
                          <span className="text-[10px] text-[#5C3D46]/70 truncate max-w-[60px]">
                            #{i + 1}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Session Row items */}
                <div className="space-y-2">
                  {interviewSessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => onNavigate(`/interview/results?session=${session.id}`)}
                      className="p-4 rounded-2xl bg-white border border-[#F3E6D5] hover:border-[#800020] transition-all cursor-pointer flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <span className="text-xs font-bold text-[#800020] block">
                          {session.track}
                        </span>
                        <span className="text-[11px] text-[#5C3D46]/70 capitalize">
                          {session.difficulty} difficulty &bull; {session.questions_count} questions &bull;{' '}
                          {new Date(session.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        {session.avg_pace_wpm && (
                          <div className="text-right hidden sm:block">
                            <span className="text-xs font-semibold text-[#800020]">
                              {session.avg_pace_wpm} WPM
                            </span>
                            <span className="text-[10px] text-[#5C3D46]/70 block">
                              Gaze: {session.eye_contact_score}%
                            </span>
                          </div>
                        )}

                        <span className="text-sm font-black px-3 py-1 rounded-full bg-[#F3E6D5] text-[#800020]">
                          {session.overall_score || 85}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Claimed Certificates Gallery */}
          <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-[#800020] font-serif-heading flex items-center gap-2">
                <Award className="w-4 h-4 text-[#800020]" />
                Claimed &amp; Verified Certificates ({earnedCerts.length})
              </h2>
              <button
                onClick={() => onNavigate('/free-certificates')}
                className="text-xs font-semibold text-[#800020] hover:text-[#D45060] cursor-pointer"
              >
                Browse Free Directory &rarr;
              </button>
            </div>

            {earnedCerts.length === 0 ? (
              <p className="text-xs text-[#5C3D46]/70 text-center py-6">
                You have not marked any certificates as claimed yet. Check out the Free Certificates directory!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {earnedCerts.map((cert) => (
                  <div
                    key={cert.id}
                    className="p-4 rounded-2xl bg-[#FFF9F2] border border-black flex flex-col justify-between"
                    style={{ borderColor: '#000000' }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase text-[#5C3D46]/70">
                          {cert.provider_name}
                        </span>
                        <span className="text-[10px] text-[#800020] font-semibold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#D45060]" />
                          Claimed
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-black mb-2" style={{ color: '#000000' }}>{cert.cert_title}</h4>
                    </div>

                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#800020] hover:text-[#D45060] mt-3"
                    >
                      <span>Verification Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* SETTINGS SUB-PAGE */
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#800020] font-serif-heading">
              Account Preferences &amp; Storage Privacy
            </h2>

            {/* Target Role */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#800020] mb-1.5">
                Target Role / Career Focus
              </label>
              <input
                type="text"
                value={roleTarget}
                onChange={(e) => setRoleTarget(e.target.value)}
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-[#F3E6D5] bg-[#FFF9F2] text-[#800020] focus:outline-none focus:border-[#800020]"
              />
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5]">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-[#800020]" />
                <div>
                  <span className="text-xs font-bold text-[#800020] block">Email Notifications</span>
                  <span className="text-[11px] text-[#5C3D46]">
                    Receive weekly milestone reminders and interview preparation advice.
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="h-4 w-4 rounded border-[#F3E6D5] text-[#800020] focus:ring-[#800020]"
              />
            </div>

            {/* Media Consent Storage Settings */}
            <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#800020]" />
                  <div>
                    <span className="text-xs font-bold text-[#800020] block">
                      Private Media Storage Consent
                    </span>
                    <span className="text-[11px] text-[#5C3D46]">
                      Save mock interview video recordings to your private Supabase Storage bucket.
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={mediaConsent}
                  onChange={(e) => setMediaConsent(e.target.checked)}
                  className="h-4 w-4 rounded border-[#F3E6D5] text-[#800020] focus:ring-[#800020]"
                />
              </div>

              <p className="text-[10px] text-[#5C3D46]/70 pt-2 border-t border-[#F3E6D5]">
                * Recordings are protected by strict Row Level Security (auth.uid() = user_id) and automatically purged after 14 days by lifecycle policy. Default is OFF.
              </p>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F3E6D5]">
              {saveNote ? (
                <span className="text-xs font-bold text-[#800020] animate-in fade-in">
                  &check; Preferences updated successfully!
                </span>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#800020] text-[#FFF9F2] hover:bg-[#660019] transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>

          {/* Danger Zone: Account Deletion with Cascading DB cleanup */}
          <div className="rounded-3xl bg-rose-50/50 border border-rose-200 p-6 sm:p-8 shadow-xs">
            <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Danger Zone: Cascading Account Deletion
            </h3>
            <p className="text-xs text-rose-700 leading-relaxed mb-4">
              Permanently delete your profile and all associated data including roadmap progress,
              interview transcripts, scorecards, and claimed certificates. This action is irreversible.
            </p>

            {showDeleteConfirm ? (
              <div className="p-4 rounded-2xl bg-white border border-rose-300 space-y-3">
                <p className="text-xs font-bold text-rose-900">
                  Are you absolutely sure? All database records for {currentUser.email} will be purged.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                  >
                    Yes, Permanently Delete My Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#475569] hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 border border-rose-300 bg-white hover:bg-rose-50 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Account & Purge Data
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
