import React, { useState, useRef, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { CounselingThread, CounselingMessage, UserProfile } from '../types';
import {
  Sparkles,
  Send,
  Plus,
  MessageSquare,
  Compass,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Trash2,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  FileText,
  Download,
  Copy,
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  Briefcase,
  RotateCcw,
  Check,
  Zap,
} from 'lucide-react';

interface CounselingPageProps {
  currentUser: UserProfile | null;
  threads: CounselingThread[];
  messages: Record<string, CounselingMessage[]>;
  onSendMessage?: (threadId: string, content: string) => Promise<void>;
  onCreateThread?: (title: string) => string;
  onOpenAuth: () => void;
  onNavigate?: (path: string) => void;
}

type CounselingTab = 'chat' | 'resume' | 'action-plan' | 'compensation';

interface ResumeCritiqueResult {
  ats_score: number;
  impact_score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  bullet_rewrites: Array<{
    original: string;
    improved: string;
    reason: string;
  }>;
  recommended_action_verbs: string[];
  keyword_suggestions: string[];
}

interface ActionPlanResult {
  planTitle: string;
  targetRole: string;
  currentLevel: string;
  phases: Array<{
    phase: string;
    focus: string;
    milestones: string[];
    recommendedRoadmap: string;
    weeklyHours: number;
  }>;
  successMetrics: string[];
}

export function CounselingPage({
  currentUser,
  threads,
  messages,
  onOpenAuth,
  onNavigate,
}: CounselingPageProps) {
  const [activeTab, setActiveTab] = useState<CounselingTab>('chat');
  const [localThreads, setLocalThreads] = useState<CounselingThread[]>(() => {
    try {
      const saved = localStorage.getItem('collexa_counseling_threads');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return threads.length > 0 ? threads : [
      {
        id: 'thread_01',
        user_id: currentUser?.id || 'guest',
        title: 'Executive Placement & Trajectory Strategy',
        created_at: new Date().toISOString(),
        messages_count: 2,
      },
    ];
  });

  const [activeThreadId, setActiveThreadId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('collexa_active_thread_id');
      if (saved) return saved;
    } catch {
      // fallback
    }
    return threads[0]?.id || 'thread_01';
  });

  const [localMessages, setLocalMessages] = useState<Record<string, CounselingMessage[]>>(() => {
    try {
      const saved = localStorage.getItem('collexa_counseling_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch {
      // fallback
    }
    return messages;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('collexa_counseling_threads', JSON.stringify(localThreads));
    } catch {}
  }, [localThreads]);

  useEffect(() => {
    try {
      localStorage.setItem('collexa_active_thread_id', activeThreadId);
    } catch {}
  }, [activeThreadId]);

  useEffect(() => {
    try {
      localStorage.setItem('collexa_counseling_messages', JSON.stringify(localMessages));
    } catch {}
  }, [localMessages]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Audio / Speech State
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Resume Auditor State
  const [resumeText, setResumeText] = useState(
    `Led the engineering team in developing full-stack web applications.
Assisted with database migration and writing backend API endpoints.
Built React frontends and integrated with third-party payment gateways.
Worked on code reviews and improved unit test coverage across the repository.`
  );
  const [targetAuditRole, setTargetAuditRole] = useState(currentUser?.role_target || 'Senior Full-Stack Engineer');
  const [resumeCritique, setResumeCritique] = useState<ResumeCritiqueResult | null>(null);
  const [isAuditingResume, setIsAuditingResume] = useState(false);

  // Action Plan State
  const [planTargetRole, setPlanTargetRole] = useState(currentUser?.role_target || 'Senior Full-Stack Engineer');
  const [candidateLevel, setCandidateLevel] = useState<'Associate' | 'Mid-Level' | 'Senior' | 'Staff/Lead'>('Mid-Level');
  const [actionPlan, setActionPlan] = useState<ActionPlanResult | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Compensation Explorer State
  const [compRole, setCompRole] = useState('Software Engineering');
  const [compLevel, setCompLevel] = useState('Senior');
  const [compLocation, setCompLocation] = useState<'India' | 'US / Remote'>('India');

  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [localMessages, activeThreadId, activeTab]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Guarantee that every active session has messages or a structured welcome prompt
  const activeMessageList = useMemo(() => {
    const list = localMessages[activeThreadId];
    if (list && list.length > 0) return list;
    return [
      {
        id: 'welcome_' + activeThreadId,
        thread_id: activeThreadId,
        role: 'assistant' as const,
        content: `Hello ${
          currentUser?.full_name ? currentUser.full_name.split(' ')[0] : 'there'
        }! I am your **COLLEXA Principal Career Counselor & Executive Placement Strategist**.\n\nI provide high-conviction, personalized guidance on:\n- **Leveling & Trajectory:** Fast-tracking promotions from Senior to Staff/Principal\n- **Comp & Offers:** Tactical negotiation frameworks for INR (₹18L–₹65L+) and Global USD equity bands\n- **Resume Architecture:** Applying Google's XYZ formula to pass Tier-1 hiring bars\n- **Milestone Sprints:** 30-60-90 day execution plans integrated with COLLEXA roadmaps\n\nWhat career goal or crossroad would you like to explore today?`,
        created_at: new Date().toISOString(),
      },
    ];
  }, [localMessages, activeThreadId, currentUser]);

  const handleCreateNewThread = () => {
    const newId = 'thread_' + Math.random().toString(36).substring(2, 9);
    const newThread: CounselingThread = {
      id: newId,
      user_id: currentUser?.id || 'guest',
      title: 'New Advisory Session',
      created_at: new Date().toISOString(),
      messages_count: 1,
    };

    setLocalThreads((prev) => [newThread, ...prev]);
    setLocalMessages((prev) => ({
      ...prev,
      [newId]: [
        {
          id: 'welcome_' + Math.random().toString(36).substring(2, 9),
          thread_id: newId,
          role: 'assistant',
          content:
            `Hello ${currentUser?.full_name ? currentUser.full_name.split(' ')[0] : 'there'}! I am your **COLLEXA Principal Career Counselor & Executive Placement Strategist**.\n\nI provide high-conviction, personalized guidance on:\n- **Leveling & Trajectory:** Fast-tracking promotions from Senior to Staff/Principal\n- **Comp & Offers:** Tactical negotiation frameworks for INR (₹18L–₹65L+) and Global USD equity bands\n- **Resume Architecture:** Applying Google's XYZ formula to pass Tier-1 hiring bars\n- **Milestone Sprints:** 30-60-90 day execution plans integrated with COLLEXA roadmaps\n\nWhat career goal or crossroad would you like to explore today?`,
          created_at: new Date().toISOString(),
        },
      ],
    }));
    setActiveThreadId(newId);
    setActiveTab('chat');
    toast.success('Started new advisory session');
  };

  const handleDeleteThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (localThreads.length <= 1) {
      toast.error('Cannot delete the last remaining thread');
      return;
    }
    const remaining = localThreads.filter((t) => t.id !== threadId);
    setLocalThreads(remaining);
    const updatedMessages = { ...localMessages };
    delete updatedMessages[threadId];
    setLocalMessages(updatedMessages);

    if (activeThreadId === threadId) {
      setActiveThreadId(remaining[0].id);
    }
    toast.success('Session removed');
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputPrompt).trim();
    if (!textToSend || isGenerating) return;

    setInputPrompt('');
    setIsGenerating(true);

    const userMsg: CounselingMessage = {
      id: 'msg_u_' + Math.random().toString(36).substring(2, 9),
      thread_id: activeThreadId,
      role: 'user',
      content: textToSend,
      created_at: new Date().toISOString(),
    };

    const currentList = localMessages[activeThreadId] || activeMessageList;
    const updatedUserList = [...currentList, userMsg];

    setLocalMessages((prev) => ({
      ...prev,
      [activeThreadId]: updatedUserList,
    }));

    // Update thread title and count
    setLocalThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? {
              ...t,
              title:
                t.title === 'New Advisory Session' || updatedUserList.length <= 3
                  ? textToSend.slice(0, 36) + (textToSend.length > 36 ? '...' : '')
                  : t.title,
              messages_count: updatedUserList.length,
            }
          : t
      )
    );

    try {
      // Call Express server-side route
      const resp = await fetch('/api/counseling/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedUserList.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userContext: {
            fullName: currentUser?.full_name || 'Guest Engineer',
            roleTarget: currentUser?.role_target || 'Software Engineer',
            currentLevel: candidateLevel,
          },
        }),
      });

      let assistantText = '';
      if (resp.ok) {
        const data = await resp.json();
        assistantText = data.content || data.text || '';
      }

      if (!assistantText) {
        assistantText = `### Executive Placement Strategic Advisory\n\nRegarding **"${textToSend}"**:\n\n1. **High-Leverage Execution:**\n   - Focus on quantifiable business outcomes (e.g. 40% reduction in query latency, \$50k cloud cost optimization).\n   - Author system architecture documents (RFCs) that align cross-functional product and infrastructure teams.\n\n2. **Immediate Tactical Sprints:**\n   - Run an ATS benchmark in our **Resume Auditor** tab to pass tier-1 hiring filters.\n   - Structure your upcoming quarter using the **Action Plan** roadmap tab.`;
      }

      const assistantMsg: CounselingMessage = {
        id: 'msg_a_' + Math.random().toString(36).substring(2, 9),
        thread_id: activeThreadId,
        role: 'assistant',
        content: assistantText,
        created_at: new Date().toISOString(),
      };

      setLocalMessages((prev) => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || updatedUserList), assistantMsg],
      }));

      setLocalThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId
            ? { ...t, messages_count: (t.messages_count || updatedUserList.length) + 1 }
            : t
        )
      );
    } catch (err) {
      console.warn('Counseling chat error:', err);
      const fallbackMsg: CounselingMessage = {
        id: 'msg_a_' + Math.random().toString(36).substring(2, 9),
        thread_id: activeThreadId,
        role: 'assistant',
        content:
          "To optimize your trajectory, focus on high-visibility organizational leverage: writing architectural RFCs, establishing reliable telemetry SLIs/SLOs, and contributing to open-source or cross-team platform foundations. Would you like to practice negotiating compensation or reviewing your roadmap milestones?",
        created_at: new Date().toISOString(),
      };
      setLocalMessages((prev) => ({
        ...prev,
        [activeThreadId]: [...(prev[activeThreadId] || updatedUserList), fallbackMsg],
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  // Text-to-Speech Handler
  const handleToggleSpeak = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast.error('Voice readout not supported in this browser');
      return;
    }

    if (speakingMsgId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown symbols for natural speaking
    const cleanText = text
      .replace(/[*#_`>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .slice(0, 1200);

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);

    setSpeakingMsgId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Speech-to-Text Input Dictation
  const handleToggleDictation = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast.info('Listening to your query...', { duration: 2500 });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition start error:', err);
      setIsListening(false);
    }
  };

  // Export Session as Markdown
  const handleExportSession = () => {
    const currentList = localMessages[activeThreadId] || [];
    if (currentList.length === 0) {
      toast.error('No messages to export');
      return;
    }

    const title = localThreads.find((t) => t.id === activeThreadId)?.title || 'Counseling Session';
    let md = `# COLLEXA Career Advisory Session: ${title}\n`;
    md += `*Exported on: ${new Date().toLocaleString()}*\n\n---\n\n`;

    currentList.forEach((m) => {
      const author = m.role === 'user' ? 'Candidate' : 'COLLEXA Principal Counselor';
      md += `### ${author} (${new Date(m.created_at).toLocaleTimeString()}):\n\n${m.content}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `collexa-advisory-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Session exported to Markdown!');
  };

  // Copy Full Session
  const handleCopySession = () => {
    const currentList = localMessages[activeThreadId] || [];
    const text = currentList
      .map((m) => `${m.role === 'user' ? 'You' : 'Advisor'}: ${m.content}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    toast.success('Conversation copied to clipboard!');
  };

  // Run Resume Audit
  const handleRunResumeAudit = async () => {
    if (!resumeText.trim()) {
      toast.error('Please enter resume text or experience bullet points');
      return;
    }

    setIsAuditingResume(true);
    try {
      const resp = await fetch('/api/counseling/resume-critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          targetRole: targetAuditRole,
        }),
      });

      const data = await resp.json();
      setResumeCritique(data);
      toast.success('Resume audit completed with Google XYZ metrics!');
    } catch (err) {
      toast.error('Audit failed. Please try again.');
    } finally {
      setIsAuditingResume(false);
    }
  };

  // Run Action Plan Generator
  const handleRunActionPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const resp = await fetch('/api/counseling/action-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole: planTargetRole,
          currentLevel: candidateLevel,
          timelineWeeks: 12,
        }),
      });

      const data = await resp.json();
      setActionPlan(data);
      toast.success('30-60-90 Day Action Plan generated!');
    } catch (err) {
      toast.error('Plan generation failed. Please try again.');
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const quickPills = [
    'How do I bridge the gap from Senior to Staff Engineer?',
    'What compensation range should I negotiate for a 6-year Full-Stack role in Bangalore / Remote?',
    'How should I position my GitHub portfolio for GenAI & LLM engineering positions?',
    'Review my system design interview preparation strategy.',
    'Write a counter-offer email template for a lowball base salary.',
  ];

  // Compensation Data Matrix
  const compensationTiers = {
    'Software Engineering': {
      Junior: { india: '₹8L – ₹14L', us: '$95K – $130K', rsu: '5% - 10%', focus: 'Clean code, testing, async patterns' },
      Mid: { india: '₹15L – ₹28L', us: '$135K – $175K', rsu: '10% - 20%', focus: 'System architecture, API performance, database indexing' },
      Senior: { india: '₹28L – ₹48L', us: '$180K – $240K', rsu: '20% - 35%', focus: 'Distributed consensus, high throughput, mentoring, reliability' },
      'Staff/Lead': { india: '₹48L – ₹80L+', us: '$250K – $360K+', rsu: '35% - 50%', focus: 'Org-wide tech strategy, cross-service RFCs, cost optimizations' },
    },
    'Data & AI': {
      Junior: { india: '₹9L – ₹16L', us: '$105K – $140K', rsu: '5% - 15%', focus: 'SQL, Python, PyTorch baselines, data pipelines' },
      Mid: { india: '₹18L – ₹32L', us: '$145K – $190K', rsu: '15% - 25%', focus: 'Vector DBs, RAG evaluation, fine-tuning, telemetry' },
      Senior: { india: '₹32L – ₹55L', us: '$200K – $275K', rsu: '25% - 40%', focus: 'Production LLM latency, distributed training, covariate drift' },
      'Staff/Lead': { india: '₹55L – ₹95L+', us: '$280K – $420K+', rsu: '40% - 60%', focus: 'Enterprise AI architecture, safety evaluation, GPU economics' },
    },
    'Product Management': {
      Junior: { india: '₹10L – ₹16L', us: '$100K – $135K', rsu: '5% - 10%', focus: 'PRD writing, user stories, metric dashboards' },
      Mid: { india: '₹18L – ₹30L', us: '$140K – $180K', rsu: '15% - 25%', focus: 'Product-market fit diagnostics, roadmapping, AB testing' },
      Senior: { india: '₹30L – ₹52L', us: '$190K – $250K', rsu: '25% - 40%', focus: 'P&L ownership, multi-product strategy, stakeholder alignment' },
      'Staff/Lead': { india: '₹52L – ₹85L+', us: '$260K – $380K+', rsu: '40% - 55%', focus: 'Portfolio vision, executive defense, market expansion' },
    },
    'Product Design (UI/UX)': {
      Junior: { india: '₹6L – ₹12L', us: '$85K – $115K', rsu: '5% - 10%', focus: 'Figma components, wireframing, design tokens' },
      Mid: { india: '₹14L – ₹24L', us: '$120K – $160K', rsu: '10% - 20%', focus: 'Design systems, usability testing, micro-interactions' },
      Senior: { india: '₹24L – ₹42L', us: '$165K – $220K', rsu: '20% - 35%', focus: 'Information architecture, accessibility (WCAG), business ROI' },
      'Staff/Lead': { india: '₹42L – ₹70L+', us: '$230K – $320K+', rsu: '30% - 45%', focus: 'Unified product ecosystem, design ops, cross-platform paradigms' },
    },
  };

  const currentCompData =
    (compensationTiers as any)[compRole]?.[compLevel] ||
    compensationTiers['Software Engineering']['Senior'];

  return (
    <div id="counseling-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-4.5rem)] flex flex-col">
      {/* Header Container */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#800020] bg-[#F3E6D5] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#800020]" />
              Executive AI Counseling
            </span>
            <span className="text-xs text-[#5C3D46] hidden sm:inline">&bull; Powered by Gemini 3.8 Flash</span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold font-serif text-black"
            style={{ color: '#000000' }}
          >
            Career Advisory &amp; Placement Strategy
          </h1>
        </div>

        {/* Tab Controls & New Thread Button */}
        <div className="flex items-center gap-2">
          <div className="bg-[#FFF9F2] p-1 rounded-2xl border border-[#F3E6D5] flex items-center gap-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-[#800020] text-[#FFF9F2] shadow-xs'
                  : 'text-[#5C3D46] hover:text-[#800020]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Strategy Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'resume'
                  ? 'bg-[#800020] text-[#FFF9F2] shadow-xs'
                  : 'text-[#5C3D46] hover:text-[#800020]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume Auditor</span>
            </button>
            <button
              onClick={() => setActiveTab('action-plan')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'action-plan'
                  ? 'bg-[#800020] text-[#FFF9F2] shadow-xs'
                  : 'text-[#5C3D46] hover:text-[#800020]'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Action Plan</span>
            </button>
            <button
              onClick={() => setActiveTab('compensation')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'compensation'
                  ? 'bg-[#800020] text-[#FFF9F2] shadow-xs'
                  : 'text-[#5C3D46] hover:text-[#800020]'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Comp Intel</span>
            </button>
          </div>

          <button
            onClick={handleCreateNewThread}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#800020] text-[#FFF9F2] hover:bg-[#660019] transition-all shadow-xs cursor-pointer active:scale-95"
            title="Start fresh advisory session"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">New Session</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Sidebar + Right Workspace Area */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-5 bg-white rounded-3xl border border-[#F3E6D5] shadow-sm overflow-hidden p-0">
        {/* Left Sidebar: Threads, Persona, Quick Tools (3 Cols) */}
        <div className="lg:col-span-3 border-r border-[#F3E6D5] bg-[#FFF9F2]/70 flex flex-col p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#800020]">
              Advisory Sessions ({localThreads.length})
            </span>
            <button
              onClick={handleCreateNewThread}
              className="p-1 rounded-lg hover:bg-white text-[#800020] transition-colors cursor-pointer"
              title="Add thread"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[260px] lg:max-h-none">
            {localThreads.map((thread) => {
              const isActive = thread.id === activeThreadId && activeTab === 'chat';
              const msgCount =
                thread.messages_count ||
                (localMessages[thread.id] ? localMessages[thread.id].length : 1);

              return (
                <div
                  key={thread.id}
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    setActiveTab('chat');
                  }}
                  className={`group w-full text-left p-3 rounded-xl text-xs transition-all flex items-start justify-between gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-white font-bold text-[#800020] shadow-xs border border-[#F3E6D5] border-l-[3px] border-l-[#800020]'
                      : 'text-[#5C3D46] hover:bg-white/70 hover:text-[#800020]'
                  }`}
                >
                  <div className="flex items-start gap-2.5 truncate min-w-0 flex-1">
                    <MessageSquare
                      className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                        isActive ? 'text-[#800020]' : 'text-[#5C3D46]/40'
                      }`}
                    />
                    <div className="truncate min-w-0 flex-1">
                      <p className="truncate font-semibold text-xs leading-snug">{thread.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[#5C3D46]/60 font-normal">
                          {new Date(thread.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#FFF9F2] text-[#800020] border border-[#F3E6D5]/80 font-medium">
                          {msgCount} {msgCount === 1 ? 'msg' : 'msgs'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {localThreads.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteThread(thread.id, e)}
                      className="opacity-40 sm:opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-50 text-[#5C3D46]/50 hover:text-rose-600 transition-all cursor-pointer shrink-0"
                      title="Delete session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Navigator Hub Links */}
          <div className="mt-4 pt-4 border-t border-[#F3E6D5] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C3D46]/70 block px-1">
              Integrated Accelerators
            </span>

            <button
              onClick={() => onNavigate && onNavigate('/roadmaps')}
              className="w-full p-2.5 rounded-xl bg-white border border-[#F3E6D5] hover:border-[#800020] text-left text-xs text-[#5C3D46] hover:text-[#800020] flex items-center justify-between transition-all group cursor-pointer"
            >
              <span className="inline-flex items-center gap-2 font-medium">
                <Compass className="w-3.5 h-3.5 text-[#800020]" />
                Explore Roadmaps
              </span>
              <ArrowRight className="w-3 h-3 text-[#5C3D46]/40 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate && onNavigate('/free-certificates')}
              className="w-full p-2.5 rounded-xl bg-white border border-[#F3E6D5] hover:border-[#800020] text-left text-xs text-[#5C3D46] hover:text-[#800020] flex items-center justify-between transition-all group cursor-pointer"
            >
              <span className="inline-flex items-center gap-2 font-medium">
                <Award className="w-3.5 h-3.5 text-[#800020]" />
                Free Certificates
              </span>
              <ArrowRight className="w-3 h-3 text-[#5C3D46]/40 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate && onNavigate('/interview-prep')}
              className="w-full p-2.5 rounded-xl bg-white border border-[#F3E6D5] hover:border-[#800020] text-left text-xs text-[#5C3D46] hover:text-[#800020] flex items-center justify-between transition-all group cursor-pointer"
            >
              <span className="inline-flex items-center gap-2 font-medium">
                <Zap className="w-3.5 h-3.5 text-[#800020]" />
                Live Mock Interview
              </span>
              <ArrowRight className="w-3 h-3 text-[#5C3D46]/40 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Counselor Persona Badge */}
          <div className="mt-4 p-3 bg-white rounded-2xl border border-[#F3E6D5]">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-[#800020] text-[#FFF9F2] flex items-center justify-center text-xs font-serif font-black">
                C
              </div>
              <div>
                <span className="text-xs font-bold text-[#800020] block leading-none">
                  COLLEXA Mentor AI
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Active &bull; Live Telemetry</span>
              </div>
            </div>
            <p className="text-[10px] text-[#5C3D46] leading-relaxed">
              Trained on executive tech hiring bars, Google XYZ resume standards, and verified compensation bands.
            </p>
          </div>
        </div>

        {/* Right Workspace Area (9 Cols) */}
        <div className="lg:col-span-9 flex flex-col h-full bg-white overflow-hidden">
          {/* CRITICAL ELEMENT: Preserving exact focus-mode selector:
              div#counseling-page > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(1)
              must have border-width: 1px; border-color: #000000; */}
          <div
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 border border-black"
            style={{ borderWidth: '1px', borderColor: '#000000' }}
          >
            {/* TAB 1: Strategy Chat */}
            {activeTab === 'chat' && (
              <div className="space-y-6">
                {/* Session Action Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-[#F3E6D5]/80 text-xs text-[#5C3D46]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#800020]">Active Session:</span>
                    <span className="truncate max-w-[200px] sm:max-w-xs font-medium">
                      {localThreads.find((t) => t.id === activeThreadId)?.title || 'Advisory'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySession}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFF9F2] hover:bg-[#F3E6D5] border border-[#F3E6D5] text-[11px] font-semibold text-[#800020] transition-colors cursor-pointer"
                      title="Copy conversation text"
                    >
                      <Copy className="w-3 h-3" />
                      <span className="hidden sm:inline">Copy</span>
                    </button>

                    <button
                      onClick={handleExportSession}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#FFF9F2] hover:bg-[#F3E6D5] border border-[#F3E6D5] text-[11px] font-semibold text-[#800020] transition-colors cursor-pointer"
                      title="Download as Markdown file"
                    >
                      <Download className="w-3 h-3" />
                      <span className="hidden sm:inline">Export</span>
                    </button>
                  </div>
                </div>

                {activeMessageList.map((msg) => {
                  const isUser = msg.role === 'user';
                  const isSpeaking = speakingMsgId === msg.id;

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-xl bg-[#800020] text-[#FFF9F2] font-serif font-black text-xs flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                          C
                        </div>
                      )}

                      <div
                        className={`group relative max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                          isUser
                            ? 'bg-[#800020] text-[#FFF9F2] font-medium'
                            : 'bg-[#FFF9F2] border border-[#F3E6D5] text-[#5C3D46] shadow-2xs'
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <div className="space-y-3">
                            <div className="markdown-body space-y-3 text-[#5C3D46]">
                              <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>

                            {/* Message Controls (Speak, Copy) */}
                            <div className="pt-2 border-t border-[#F3E6D5]/60 flex items-center justify-between text-[10px] text-[#5C3D46]/70">
                              <span>COLLEXA Advisory &bull; {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                              <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleToggleSpeak(msg.id, msg.content)}
                                  className={`p-1.5 rounded-md hover:bg-white transition-colors cursor-pointer ${
                                    isSpeaking ? 'text-[#800020] bg-white font-bold' : 'text-[#5C3D46]'
                                  }`}
                                  title={isSpeaking ? 'Stop speaking' : 'Read aloud with AI voice'}
                                >
                                  {isSpeaking ? (
                                    <VolumeX className="w-3.5 h-3.5 text-[#800020] animate-pulse" />
                                  ) : (
                                    <Volume2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(msg.content);
                                    toast.success('Message copied!');
                                  }}
                                  className="p-1.5 rounded-md hover:bg-white text-[#5C3D46] transition-colors cursor-pointer"
                                  title="Copy message"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {isUser && currentUser && (
                        <img
                          src={currentUser.avatar_url}
                          alt={currentUser.full_name}
                          className="w-8 h-8 rounded-full border border-[#F3E6D5] object-cover shrink-0 mt-1"
                        />
                      )}
                    </div>
                  );
                })}

                {isGenerating && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#800020] text-[#FFF9F2] font-serif font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      C
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5] text-xs text-[#5C3D46] flex items-center gap-2.5">
                      <div className="w-4 h-4 border-2 border-[#800020] border-t-transparent rounded-full animate-spin" />
                      <span>Synthesizing placement strategy and compensation benchmark with Gemini...</span>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>
            )}

            {/* TAB 2: Resume & LinkedIn Auditor (Google XYZ Formula) */}
            {activeTab === 'resume' && (
              <div className="space-y-6">
                <div className="bg-[#FFF9F2] p-5 rounded-2xl border border-[#F3E6D5]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-base font-bold text-[#800020] font-serif">
                        Google XYZ Resume Bullet Auditor
                      </h2>
                      <p className="text-xs text-[#5C3D46]">
                        Audit experience points using the industry benchmark: <em>"Accomplished [X] as measured by [Y], by doing [Z]"</em>.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#5C3D46] whitespace-nowrap">Target Role:</span>
                      <select
                        value={targetAuditRole}
                        onChange={(e) => setTargetAuditRole(e.target.value)}
                        className="text-xs px-3 py-1.5 rounded-xl border border-[#F3E6D5] bg-white text-[#800020] font-medium focus:outline-none focus:border-[#800020]"
                      >
                        <option value="Senior Full-Stack Engineer">Senior Full-Stack Engineer</option>
                        <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
                        <option value="Cloud Solutions Architect">Cloud Solutions Architect</option>
                        <option value="Lead Product Designer (UI/UX)">Lead Product Designer (UI/UX)</option>
                        <option value="Technical Product Manager">Technical Product Manager</option>
                      </select>
                    </div>
                  </div>

                  <textarea
                    rows={5}
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste 3-5 experience bullet points or your current resume profile summary..."
                    className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-[#F3E6D5] bg-white text-[#5C3D46] focus:outline-none focus:border-[#800020] font-mono leading-relaxed"
                  />

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] text-[#5C3D46]">
                      {resumeText.split('\n').filter((l) => l.trim()).length} bullet lines detected
                    </span>

                    <button
                      onClick={handleRunResumeAudit}
                      disabled={isAuditingResume}
                      className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-[#800020] text-[#FFF9F2] hover:bg-[#660019] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      {isAuditingResume ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Auditing with Gemini...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          Run ATS &amp; XYZ Impact Audit
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Audit Results */}
                {resumeCritique && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    {/* Score Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white border border-[#F3E6D5] flex items-center justify-between shadow-2xs">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C3D46]">
                            ATS Keyword Match
                          </span>
                          <p className="text-2xl font-bold font-serif text-[#800020] mt-0.5">
                            {resumeCritique.ats_score} / 100
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 flex items-center justify-center font-bold text-xs text-emerald-700 bg-emerald-50">
                          {resumeCritique.ats_score}%
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border border-[#F3E6D5] flex items-center justify-between shadow-2xs">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C3D46]">
                            Quantified XYZ Impact
                          </span>
                          <p className="text-2xl font-bold font-serif text-[#800020] mt-0.5">
                            {resumeCritique.impact_score} / 100
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-full border-4 border-amber-500 flex items-center justify-center font-bold text-xs text-amber-700 bg-amber-50">
                          {resumeCritique.impact_score}%
                        </div>
                      </div>
                    </div>

                    {/* Executive Summary */}
                    <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5]">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#800020] mb-1">
                        Executive Recruiter Assessment
                      </h3>
                      <p className="text-xs sm:text-sm text-[#5C3D46] leading-relaxed">
                        {resumeCritique.summary}
                      </p>
                    </div>

                    {/* Strengths & Gaps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Key Strengths
                        </h4>
                        <ul className="space-y-1.5 text-xs text-emerald-950">
                          {resumeCritique.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-emerald-500 font-bold">&bull;</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200">
                        <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-rose-600" />
                          Critical Improvement Areas
                        </h4>
                        <ul className="space-y-1.5 text-xs text-rose-950">
                          {resumeCritique.gaps.map((g, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-rose-500 font-bold">&bull;</span>
                              <span>{g}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Before & After Rewrites */}
                    <div className="p-5 rounded-2xl bg-white border border-[#F3E6D5] space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#800020]">
                        High-Impact Google XYZ Bullet Rewrites
                      </h4>

                      <div className="space-y-3">
                        {resumeCritique.bullet_rewrites.map((rw, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-[#FFF9F2] border border-[#F3E6D5] space-y-2">
                            <div>
                              <span className="text-[10px] font-bold text-rose-600 uppercase">Original:</span>
                              <p className="text-xs text-[#5C3D46] line-through decoration-rose-400 font-mono">
                                {rw.original}
                              </p>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-emerald-700 uppercase">
                                Recommended XYZ Rewrite:
                              </span>
                              <p className="text-xs text-emerald-900 font-semibold bg-emerald-50/70 p-2 rounded-lg border border-emerald-200">
                                {rw.improved}
                              </p>
                            </div>

                            <p className="text-[11px] text-[#5C3D46] italic">
                              <strong>Why it works:</strong> {rw.reason}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Keywords & Action Verbs */}
                    <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F3E6D5] flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase text-[#800020] mr-2">Power Verbs:</span>
                      {resumeCritique.recommended_action_verbs.map((verb, i) => (
                        <span key={i} className="text-[11px] font-semibold bg-white border border-[#F3E6D5] text-[#800020] px-2.5 py-1 rounded-md shadow-2xs">
                          {verb}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: 30-60-90 Day Placement Plan */}
            {activeTab === 'action-plan' && (
              <div className="space-y-6">
                <div className="bg-[#FFF9F2] p-5 rounded-2xl border border-[#F3E6D5]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-base font-bold text-[#800020] font-serif">
                        30-60-90 Day Career Placement Sprint
                      </h2>
                      <p className="text-xs text-[#5C3D46]">
                        Generate a customized progression roadmap mapped directly to COLLEXA milestones.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#5C3D46] block uppercase">Target Track</span>
                        <select
                          value={planTargetRole}
                          onChange={(e) => setPlanTargetRole(e.target.value)}
                          className="text-xs px-3 py-1.5 rounded-xl border border-[#F3E6D5] bg-white text-[#800020] font-medium"
                        >
                          <option value="Senior Full-Stack Engineer">Senior Full-Stack</option>
                          <option value="Data Science & AI Engineer">Data Science & AI</option>
                          <option value="Cloud DevOps / SRE">Cloud DevOps &amp; SRE</option>
                          <option value="UI/UX Product Designer">UI/UX Designer</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-[#5C3D46] block uppercase">Current Level</span>
                        <select
                          value={candidateLevel}
                          onChange={(e) => setCandidateLevel(e.target.value as any)}
                          className="text-xs px-3 py-1.5 rounded-xl border border-[#F3E6D5] bg-white text-[#800020] font-medium"
                        >
                          <option value="Associate">Associate (1-2 yrs)</option>
                          <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
                          <option value="Senior">Senior (6-8 yrs)</option>
                          <option value="Staff/Lead">Staff / Lead (9+ yrs)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleRunActionPlan}
                      disabled={isGeneratingPlan}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#800020] text-[#FFF9F2] hover:bg-[#660019] transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                    >
                      {isGeneratingPlan ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Formulating Sprint Plan...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3.5 h-3.5" />
                          Generate Tailored Sprint Plan
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {actionPlan && (
                  <div className="space-y-5 animate-in fade-in duration-300">
                    <div className="p-4 rounded-2xl bg-white border border-[#F3E6D5] flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-[#800020] font-serif">
                          {actionPlan.planTitle}
                        </h3>
                        <p className="text-xs text-[#5C3D46] mt-0.5">
                          Tailored for {actionPlan.currentLevel} transition into {actionPlan.targetRole}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(actionPlan, null, 2));
                          toast.success('Action plan copied!');
                        }}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#FFF9F2] border border-[#F3E6D5] text-[#800020] hover:bg-[#F3E6D5] transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy Plan
                      </button>
                    </div>

                    {/* Phases */}
                    <div className="space-y-4">
                      {actionPlan.phases.map((phase, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-white border border-[#F3E6D5] shadow-2xs relative overflow-hidden"
                          style={{
                            borderLeftWidth: '4px',
                            borderLeftColor: idx === 0 ? '#4F46E5' : idx === 1 ? '#D946EF' : '#F59E0B',
                          }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <h4 className="text-sm font-bold text-[#800020]">{phase.phase}</h4>
                            <span className="text-[11px] font-semibold bg-[#FFF9F2] px-2.5 py-0.5 rounded-full text-[#5C3D46] border border-[#F3E6D5]">
                              {phase.weeklyHours} hrs/week recommended
                            </span>
                          </div>

                          <p className="text-xs text-[#5C3D46] mb-3 italic">
                            <strong>Core Focus:</strong> {phase.focus}
                          </p>

                          <div className="space-y-2 mb-4">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#800020]">
                              Key Deliverables &amp; Milestones:
                            </span>
                            <ul className="space-y-1.5 text-xs text-[#5C3D46]">
                              {phase.milestones.map((m, mIdx) => (
                                <li key={mIdx} className="flex items-start gap-2">
                                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                  <span>{m}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-3 border-t border-[#F3E6D5] flex items-center justify-between text-xs">
                            <span className="text-[11px] text-[#5C3D46]">
                              <strong>Recommended Track:</strong> {phase.recommendedRoadmap}
                            </span>
                            <button
                              onClick={() => onNavigate && onNavigate('/roadmaps')}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#800020] hover:underline cursor-pointer"
                            >
                              Launch Track <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Success Metrics */}
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                      <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
                        Target Verification Outcomes
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {actionPlan.successMetrics.map((sm, i) => (
                          <div key={i} className="bg-white p-2.5 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{sm}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Compensation & Salary Negotiation Intelligence */}
            {activeTab === 'compensation' && (
              <div className="space-y-6">
                <div className="bg-[#FFF9F2] p-5 rounded-2xl border border-[#F3E6D5]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-base font-bold text-[#800020] font-serif">
                        Tech Compensation &amp; Offer Benchmarks
                      </h2>
                      <p className="text-xs text-[#5C3D46]">
                        Grounded data points across top tech hubs, equity grants, and negotiation scripts.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={compRole}
                        onChange={(e) => setCompRole(e.target.value)}
                        className="text-xs px-3 py-1.5 rounded-xl border border-[#F3E6D5] bg-white text-[#800020] font-medium"
                      >
                        <option value="Software Engineering">Software Engineering</option>
                        <option value="Data & AI">Data &amp; AI</option>
                        <option value="Product Management">Product Management</option>
                        <option value="Product Design (UI/UX)">Product Design (UI/UX)</option>
                      </select>

                      <select
                        value={compLevel}
                        onChange={(e) => setCompLevel(e.target.value)}
                        className="text-xs px-3 py-1.5 rounded-xl border border-[#F3E6D5] bg-white text-[#800020] font-medium"
                      >
                        <option value="Junior">Junior (1-2 yrs)</option>
                        <option value="Mid">Mid-Level (3-5 yrs)</option>
                        <option value="Senior">Senior (6-8 yrs)</option>
                        <option value="Staff/Lead">Staff / Lead (9+ yrs)</option>
                      </select>

                      <select
                        value={compLocation}
                        onChange={(e) => setCompLocation(e.target.value as any)}
                        className="text-xs px-3 py-1.5 rounded-xl border border-[#F3E6D5] bg-white text-[#800020] font-medium"
                      >
                        <option value="India">India (Bangalore/Hyd/Remote)</option>
                        <option value="US / Remote">US / Global Remote</option>
                      </select>
                    </div>
                  </div>

                  {/* Benchmark Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-white border border-[#F3E6D5]">
                      <span className="text-[11px] font-bold uppercase text-[#5C3D46]">
                        Estimated Base Salary Band
                      </span>
                      <p className="text-xl sm:text-2xl font-bold font-serif text-[#800020] mt-1">
                        {compLocation === 'India' ? currentCompData.india : currentCompData.us}
                      </p>
                      <span className="text-[10px] text-[#5C3D46]">Per annum &bull; Cash component</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-[#F3E6D5]">
                      <span className="text-[11px] font-bold uppercase text-[#5C3D46]">
                        Typical Equity / RSU Grant
                      </span>
                      <p className="text-xl sm:text-2xl font-bold font-serif text-[#800020] mt-1">
                        {currentCompData.rsu}
                      </p>
                      <span className="text-[10px] text-[#5C3D46]">Of total annual package (4-yr vest)</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-[#F3E6D5]">
                      <span className="text-[11px] font-bold uppercase text-[#5C3D46]">
                        Primary Hiring Criteria
                      </span>
                      <p className="text-xs font-semibold text-[#800020] mt-2 leading-relaxed">
                        {currentCompData.focus}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Negotiation Tactics */}
                <div className="p-5 rounded-2xl bg-white border border-[#F3E6D5] space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#800020]">
                    Executive Negotiation Rules &amp; Script
                  </h3>

                  <div className="space-y-2 text-xs text-[#5C3D46] leading-relaxed">
                    <div className="p-3 rounded-xl bg-[#FFF9F2] border border-[#F3E6D5]">
                      <strong className="text-[#800020] block mb-1">Rule 1: Never Anchor on Current Salary</strong>
                      <p>
                        Frame your expectation around the market market value for the role and your demonstrated scope:
                        <em> "Based on my current contributions to distributed systems scaling and current market benchmarks for Senior engineers in this tier, I am targeting ₹38L–₹45L total comp."</em>
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FFF9F2] border border-[#F3E6D5]">
                      <strong className="text-[#800020] block mb-1">Rule 2: Counter Lowballs with Specific Leverage</strong>
                      <p>
                        If the initial offer is below range, negotiate on joining bonuses or accelerated 6-month equity vesting schedules rather than giving up ground immediately.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        setActiveTab('chat');
                        handleSend('Help me draft a professional negotiation email for a Senior Engineer offer that came in 15% below my target range.');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#800020] text-[#FFF9F2] hover:bg-[#660019] transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Draft Counter-Offer in Strategy Chat
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Pills (Shown in chat tab) */}
          {activeTab === 'chat' && (
            <div className="px-4 sm:px-6 pt-2 pb-2 border-t border-[#F3E6D5] bg-[#FFF9F2]/70 flex items-center gap-2 overflow-x-auto shrink-0">
              <span className="text-[10px] uppercase font-bold text-[#800020]/70 shrink-0">Quick Prompts:</span>
              {quickPills.map((pill, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(pill)}
                  className="text-[11px] font-medium bg-white hover:bg-[#F3E6D5]/60 border border-[#F3E6D5] text-[#5C3D46] hover:text-[#800020] px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>
          )}

          {/* Input Box (Shown in chat tab) */}
          {activeTab === 'chat' && (
            <div className="p-4 sm:p-5 border-t border-[#F3E6D5] bg-white shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2 sm:gap-3"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputPrompt}
                    onChange={(e) => setInputPrompt(e.target.value)}
                    placeholder="Ask about promotions, resume metrics, interview strategy, or salary benchmarks..."
                    disabled={isGenerating}
                    className="w-full pl-4 pr-10 py-3 text-xs sm:text-sm rounded-2xl border border-[#F3E6D5] focus:outline-none focus:border-[#800020] bg-[#FFF9F2] text-[#800020] placeholder:text-[#5C3D46]/50 shadow-2xs"
                  />

                  {/* Speech Dictation Button */}
                  <button
                    type="button"
                    onClick={handleToggleDictation}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isListening ? 'text-rose-600 bg-rose-50 animate-pulse' : 'text-[#5C3D46]/60 hover:text-[#800020]'
                    }`}
                    title={isListening ? 'Stop listening' : 'Dictate with voice'}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!inputPrompt.trim() || isGenerating}
                  className="p-3 rounded-2xl bg-[#800020] text-[#FFF9F2] hover:bg-[#660019] transition-all disabled:opacity-50 cursor-pointer shadow-xs active:scale-95 shrink-0"
                  title="Send message"
                >
                  <Send className="w-4 h-4 text-[#F3E6D5]" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
