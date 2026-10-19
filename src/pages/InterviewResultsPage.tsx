import { InterviewSession } from '../types';
import { DemandGauge } from '../components/DemandGauge';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Share2,
  Download,
  RotateCcw,
  Compass,
  Gauge,
  Eye,
  Activity,
  Award,
} from 'lucide-react';

interface InterviewResultsPageProps {
  sessionId: string;
  sessions: InterviewSession[];
  onNavigate: (path: string) => void;
}

export function InterviewResultsPage({
  sessionId,
  sessions,
  onNavigate,
}: InterviewResultsPageProps) {
  const session = sessions.find((s) => s.id === sessionId) || sessions[0];

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2
          className="text-xl font-bold text-black mb-2 font-serif-heading"
          style={{ color: '#000000' }}
        >
          No Interview Session Found
        </h2>
        <button
          onClick={() => onNavigate('/interview-prep')}
          className="px-4 py-2 bg-[#800020] text-[#FFF9F2] hover:bg-[#660019] rounded-xl text-xs font-bold cursor-pointer"
        >
          Start New Interview
        </button>
      </div>
    );
  }

  const overall = session.overall_score || 86;
  const technical = session.technical_score || 88;
  const communication = session.communication_score || 84;
  const presence = session.presence_score || 89;

  return (
    <div id="interview-results-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/interview-prep')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#5C3D46] hover:text-[#800020] mb-6 py-1.5 px-3 rounded-xl hover:bg-white border border-transparent hover:border-[#F3E6D5] transition-all cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Interview Prep
      </button>

      {/* Primary Scorecard Header */}
      <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#F3E6D5]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D45060]">
                Official AI Scorecard
              </span>
              <span className="text-xs font-medium text-[#5C3D46]/70">&bull; {new Date(session.created_at).toLocaleDateString()}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#800020] mb-1">
              {session.track} Evaluation
            </h1>
            <p className="text-xs sm:text-sm text-[#5C3D46]">
              Rigor Level: <strong className="capitalize text-[#800020]">{session.difficulty}</strong> &bull; {session.questions_count} Evaluated Prompts
            </p>
          </div>

          {/* Overall Score Meter */}
          <div className="flex items-center gap-4 bg-[#FFF9F2] p-4 rounded-2xl border border-[#F3E6D5] shrink-0">
            <DemandGauge score={overall} trendText={overall >= 80 ? 'Top 10% Tier' : 'Proficient'} size={140} />
          </div>
        </div>

        {/* 3 Pillar Score Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5]">
            <span className="text-xs font-bold text-[#5C3D46] uppercase tracking-wider block mb-1">
              Technical Accuracy
            </span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-black text-[#800020]">{technical}%</span>
              <span className="text-xs font-semibold text-[#800020]">Strong Foundation</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden mt-2">
              <div className="h-full bg-[#800020]" style={{ width: `${technical}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5]">
            <span className="text-xs font-bold text-[#5C3D46] uppercase tracking-wider block mb-1">
              Communication &amp; Pace
            </span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-black text-[#800020]">{communication}%</span>
              <span className="text-xs font-semibold text-[#14B8A6]">Controlled Cadence</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden mt-2">
              <div className="h-full bg-[#14B8A6]" style={{ width: `${communication}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5]">
            <span className="text-xs font-bold text-[#5C3D46] uppercase tracking-wider block mb-1">
              Executive Presence
            </span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-black text-[#800020]">{presence}%</span>
              <span className="text-xs font-semibold text-[#D45060]">Engaged Demeanor</span>
            </div>
            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden mt-2">
              <div className="h-full bg-[#D45060]" style={{ width: `${presence}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Biometric Telemetry Summary Bar */}
      <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 shadow-sm mb-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#800020] mb-4 flex items-center justify-between">
          <span>Biometric &amp; Speech Telemetry Breakdown</span>
          <span className="text-xs font-normal text-[#5C3D46]/70">Captured live on-device</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5]">
            <div className="flex items-center gap-1.5 text-xs text-[#5C3D46] mb-1">
              <Eye className="w-3.5 h-3.5 text-[#800020]" />
              <span>Camera Contact</span>
            </div>
            <span className="text-xl font-bold text-[#800020]">{session.eye_contact_score || 88}%</span>
            <p className="text-[10px] text-[#5C3D46]/70 mt-0.5">High direct lens engagement</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5]">
            <div className="flex items-center gap-1.5 text-xs text-[#5C3D46] mb-1">
              <Activity className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>Posture Balance</span>
            </div>
            <span className="text-xl font-bold text-[#800020]">{session.posture_score || 91}%</span>
            <p className="text-[10px] text-[#5C3D46]/70 mt-0.5">Stable frame positioning</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5]">
            <div className="flex items-center gap-1.5 text-xs text-[#5C3D46] mb-1">
              <Gauge className="w-3.5 h-3.5 text-[#D45060]" />
              <span>Pacing</span>
            </div>
            <span className="text-xl font-bold text-[#800020]">{session.avg_pace_wpm || 134} WPM</span>
            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Optimal zone (120-150)</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5]">
            <div className="flex items-center gap-1.5 text-xs text-[#5C3D46] mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D45060]" />
              <span>Filler Words</span>
            </div>
            <span className="text-xl font-bold text-[#800020]">{session.filler_word_count ?? 2} total</span>
            <p className="text-[10px] text-[#5C3D46]/70 mt-0.5">Minimal verbal fillers</p>
          </div>
        </div>
      </div>

      {/* Strengths & Actionable Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Strengths */}
        <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#800020] mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Demonstrated Strengths
          </h3>
          <ul className="space-y-2.5">
            {(session.strengths || [
              'Clear explanation of microservices caching tradeoffs and race condition prevention',
              'Consistent camera eye contact with natural vocal inflections',
              'Solid grounding in distributed idempotency and transactional boundaries',
            ]).map((s, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#5C3D46] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Growth Areas & Recommendations */}
        <div className="rounded-3xl bg-white border border-[#F3E6D5] p-6 shadow-sm">
          <h3 className="text-sm font-bold text-[#800020] mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-[#D45060]" />
            Recommended High-Impact Refinements
          </h3>
          <ul className="space-y-2.5">
            {(session.areas_for_improvement || [
              'Incorporate specific numerical SLOs (e.g. p99 < 80ms under 50k RPS)',
              'Elaborate on disaster recovery failover steps when primary replicas crash',
            ]).map((a, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-[#5C3D46] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D45060] mt-1.5 shrink-0" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 rounded-3xl bg-white border border-[#F3E6D5] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/interview-prep')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#FFF9F2] bg-[#800020] hover:bg-[#660019] transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Practice Another Session
          </button>
          <button
            onClick={() => onNavigate('/counseling')}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-[#F3E6D5] text-[#800020] hover:border-[#800020] transition-all inline-flex items-center gap-2 bg-[#FFF9F2] cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#800020]" />
            Ask AI Counselor About These Results
          </button>
        </div>

        <button
          onClick={() => {
            window.print();
          }}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C3D46] hover:text-[#800020] cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Export PDF Scorecard
        </button>
      </div>
    </div>
  );
}
