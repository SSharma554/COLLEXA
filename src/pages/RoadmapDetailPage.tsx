import { useState } from 'react';
import { ROADMAPS, CATEGORY_THEMES } from '../lib/data';
import { SvgProgressRing } from '../components/SvgProgressRing';
import { UserProfile } from '../types';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  FileText,
  Clock,
  Sparkles,
  Share2,
  Check,
  Info,
} from 'lucide-react';

interface RoadmapDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  currentUser: UserProfile | null;
  roadmapProgress: Record<string, any>;
  onToggleStage: (roadmapSlug: string, stageId: number) => boolean | undefined;
  onSaveProof: (roadmapSlug: string, stageId: number, text: string) => void;
  onOpenAuth: () => void;
}

export function RoadmapDetailPage({
  slug,
  onNavigate,
  currentUser,
  roadmapProgress,
  onToggleStage,
  onSaveProof,
  onOpenAuth,
}: RoadmapDetailPageProps) {
  const roadmap = ROADMAPS.find((r) => r.slug === slug) || ROADMAPS[0];
  const theme = CATEGORY_THEMES[roadmap.category];

  const userProgress = roadmapProgress[roadmap.slug] || {
    completed_stages: [],
    proof_of_work: {},
  };

  const completedStages = userProgress.completed_stages || [];
  const proofOfWork = userProgress.proof_of_work || {};
  const progressPct = Math.round((completedStages.length / roadmap.stages.length) * 100);

  const [expandedStage, setExpandedStage] = useState<number | null>(1);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeProofInput, setActiveProofInput] = useState<Record<number, string>>({});
  const [saveStatus, setSaveStatus] = useState<Record<number, boolean>>({});

  const handleToggle = (stageId: number) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    onToggleStage(roadmap.slug, stageId);
  };

  const handleProofSave = (stageId: number) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    const text = activeProofInput[stageId] !== undefined ? activeProofInput[stageId] : (proofOfWork[stageId] || '');
    onSaveProof(roadmap.slug, stageId, text);
    setSaveStatus((prev) => ({ ...prev, [stageId]: true }));
    setTimeout(() => {
      setSaveStatus((prev) => ({ ...prev, [stageId]: false }));
    }, 1500);
  };

  return (
    <div id="roadmap-detail-page" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('/roadmaps')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#5C3D46] hover:text-[#800020] mb-6 py-1.5 px-3 rounded-xl hover:bg-white border border-transparent hover:border-[#F3E6D5] transition-all cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to All Roadmaps
      </button>

      {/* Header Container */}
      <div
        className="rounded-3xl bg-white border border-[#F3E6D5] p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden"
        style={{
          borderLeftColor: theme.color,
          borderLeftWidth: '4px',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            {/* Category & Status */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ backgroundColor: theme.badgeBg, color: theme.color }}
              >
                {roadmap.category}
              </span>
              <span className="text-xs text-[#5C3D46] font-medium inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#800020]/50" />
                {roadmap.estimatedWeeks} Weeks to Mastery
              </span>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-bold font-serif text-black mb-3"
              style={{ color: '#000000' }}
            >
              {roadmap.title}
            </h1>

            <p className="text-sm text-[#5C3D46] leading-relaxed mb-4">
              {roadmap.description}
            </p>

            {/* Quick Actions: Bookmark & Share */}
            <div className="flex items-center gap-3">
              <button
                id="roadmap-bookmark-btn"
                onClick={() => {
                  const next = !isBookmarked;
                  setIsBookmarked(next);
                  toast.success(next ? 'Roadmap saved to bookmarks!' : 'Roadmap removed from bookmarks');
                }}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  isBookmarked
                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                    : 'bg-[#FFF9F2] text-[#5C3D46] border-[#F3E6D5] hover:border-[#800020] hover:text-[#800020]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
                {isBookmarked ? 'Bookmarked' : 'Save Roadmap'}
              </button>

              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success('Roadmap link copied to clipboard!');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl border border-[#F3E6D5] text-[#5C3D46] bg-[#FFF9F2] hover:border-[#800020] hover:text-[#800020] transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
            </div>
          </div>

          {/* SVG Progress Ring */}
          <div className="flex flex-col items-center justify-center p-4 bg-[#FFF9F2] rounded-2xl border border-[#F3E6D5] shrink-0">
            <SvgProgressRing
              percentage={progressPct}
              categoryColor={theme.color}
              size={120}
              strokeWidth={10}
              label="Complete"
            />
            <span className="text-xs text-[#5C3D46] font-medium mt-2">
              {completedStages.length} of {roadmap.stages.length} Stages
            </span>
          </div>
        </div>
      </div>

      {/* 6-STAGE ACCORDION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <h2 className="text-lg font-bold font-serif text-[#800020] flex items-center gap-2">
            <span>Curriculum Stages &amp; Checkpoints</span>
            <span className="text-xs font-normal text-[#5C3D46]/70">
              ({roadmap.stages.length} Structured Modules)
            </span>
          </h2>
          <div className="inline-flex items-center gap-1.5 text-[11px] text-[#5C3D46] bg-[#FFF9F2] px-3 py-1 rounded-lg border border-[#F3E6D5]">
            <Info className="w-3.5 h-3.5 text-[#800020]" />
            <span>Click any stage to view competencies, resources &amp; submit notes</span>
          </div>
        </div>

        {roadmap.stages.map((stage) => {
          const isDone = completedStages.includes(stage.id);
          const isExpanded = expandedStage === stage.id;
          const currentProof =
            activeProofInput[stage.id] !== undefined
              ? activeProofInput[stage.id]
              : (proofOfWork[stage.id] || '');

          return (
            <div
              key={stage.id}
              id={`stage-accordion-${stage.id}`}
              className={`rounded-2xl bg-white border transition-all duration-200 overflow-hidden ${
                isDone ? 'border-emerald-500 bg-emerald-50/20' : 'border-black'
              }`}
              style={!isDone ? { borderColor: '#000000' } : undefined}
            >
              {/* Header bar of stage */}
              <div
                onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-[#FFF9F2]/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Toggle Checkbox Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(stage.id);
                    }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'border border-[#F3E6D5] hover:border-[#800020] text-[#5C3D46]/30'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-[#5C3D46]/60 uppercase tracking-wider">
                        Stage {stage.id} &bull; {stage.duration}
                      </span>
                      {isDone && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-black" style={{ color: '#000000' }}>{stage.title}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#5C3D46] hidden sm:inline-block">
                    {stage.skills.length} Competencies
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#800020]/60" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#800020]/60" />
                  )}
                </div>
              </div>

              {/* Expanded Stage Content */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-[#F3E6D5] space-y-6">
                  {/* Description & Deliverable */}
                  <div className="p-3.5 bg-[#FFF9F2] rounded-xl border border-[#F3E6D5]">
                    <p className="text-xs text-[#5C3D46] leading-relaxed mb-2">
                      {stage.description}
                    </p>
                    <div className="text-xs font-semibold text-[#800020] flex items-center gap-1.5">
                      <span className="text-[#D45060] font-bold">Key Capstone Deliverable:</span>
                      <span>{stage.keyDeliverable}</span>
                    </div>
                  </div>

                  {/* Skills / Milestones List */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#800020] mb-2">
                      Target Competencies &amp; Mastery Tasks
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {stage.skills.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[#F3E6D5]/60 text-[#800020] border border-[#F3E6D5]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Curated External Resources with ↗ icon */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#800020] mb-2">
                      Curated Documentation &amp; Exercises
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {stage.resources.map((res, idx) => (
                        <a
                          key={idx}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-[#FFF9F2] border border-[#F3E6D5] text-[#800020] hover:border-[#800020] hover:text-[#D45060] transition-all"
                        >
                          <span>{res.title}</span>
                          <span className="text-[10px] text-[#5C3D46]/60">({res.type})</span>
                          <ExternalLink className="w-3 h-3 text-[#5C3D46]/60" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Proof of Work Text Area */}
                  <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#800020]">
                        <FileText className="w-3.5 h-3.5 text-[#800020]" />
                        <span>Proof of Work &amp; Learning Log</span>
                      </div>
                      {saveStatus[stage.id] && (
                        <span className="text-[11px] font-semibold text-emerald-700 animate-in fade-in flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Note Saved to Your Profile
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#5C3D46] mb-2">
                      Use <strong>Save Note</strong> to log your GitHub pull request URL, live deployment link, architectural decisions, or personal takeaways for this stage.
                    </p>
                    <textarea
                      rows={3}
                      value={currentProof}
                      onChange={(e) =>
                        setActiveProofInput((prev) => ({
                          ...prev,
                          [stage.id]: e.target.value,
                        }))
                      }
                      placeholder="e.g. GitHub PR #14 merged: added TypeScript RPC client with Zod runtime parsing. Live demo: https://..."
                      className="w-full p-3 text-xs rounded-xl border border-[#F3E6D5] bg-white focus:outline-none focus:border-[#800020] text-[#800020]"
                    />
                    <div className="flex items-center justify-between mt-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          handleProofSave(stage.id);
                          if (currentUser) {
                            toast.success(`Milestone Note saved for Stage ${stage.id}!`);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-[#800020] text-[#FFF9F2] hover:bg-[#660019] transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Save Note
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggle(stage.id)}
                        className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-white text-[#800020] border-[#F3E6D5] hover:border-[#800020]'
                        }`}
                      >
                        {isDone ? 'Mark as Incomplete' : 'Mark Stage as Completed'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
