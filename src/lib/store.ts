import { useState, useEffect } from 'react';
import {
  UserProfile,
  UserRoadmapProgress,
  InterviewSession,
  InterviewAnswer,
  CounselingThread,
  CounselingMessage,
  EarnedCertificate,
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'collexa_user_profile',
  ROADMAP_PROGRESS: 'collexa_roadmap_progress',
  INTERVIEW_SESSIONS: 'collexa_interview_sessions',
  INTERVIEW_ANSWERS: 'collexa_interview_answers',
  COUNSELING_THREADS: 'collexa_counseling_threads',
  COUNSELING_MESSAGES: 'collexa_counseling_messages',
  EARNED_CERTS: 'collexa_earned_certs',
};

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_7f8a92b',
  email: 'alex.rivera@collexa.dev',
  full_name: 'Alex Rivera',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
  role_target: 'Senior Full-Stack Engineer',
  welcome_email_sent_at: '2026-09-01T12:00:00Z',
  media_consent_recording: false, // Default strictly OFF per system instructions
  notifications_enabled: true,
  created_at: '2026-09-01T10:00:00Z',
  updated_at: '2026-09-15T08:30:00Z',
};

const INITIAL_PROGRESS: Record<string, UserRoadmapProgress> = {
  'fullstack-architecture': {
    id: 'prog_fs_1',
    user_id: 'usr_7f8a92b',
    roadmap_slug: 'fullstack-architecture',
    completed_stages: [1, 2],
    proof_of_work: {
      1: 'Created GitHub repo with strict Zod parsing schema and discriminated unions for websocket actions.',
      2: 'Deployed responsive Next.js 14 App Router dashboard with TanStack Query v5 cache invalidation.',
    },
    updated_at: new Date().toISOString(),
  },
  'generative-ai-llm': {
    id: 'prog_ai_1',
    user_id: 'usr_7f8a92b',
    roadmap_slug: 'generative-ai-llm',
    completed_stages: [1],
    proof_of_work: {
      1: 'Implemented structured JSON extraction using Gemini 3.8 Flash SDK and Pydantic schemas.',
    },
    updated_at: new Date().toISOString(),
  },
};

const INITIAL_SESSIONS: InterviewSession[] = [
  {
    id: 'session_past_01',
    user_id: 'usr_7f8a92b',
    track: 'Software Engineering',
    difficulty: 'medium',
    questions_count: 5,
    status: 'completed',
    eye_contact_score: 88,
    posture_score: 92,
    avg_pace_wpm: 134,
    filler_word_count: 3,
    save_recording: false,
    overall_score: 87,
    technical_score: 89,
    communication_score: 86,
    presence_score: 90,
    feedback_summary: 'Impressive command of distributed caching and microservice resiliency. Pace was natural with confident camera eye contact.',
    strengths: [
      'Crisp explanation of optimistic concurrency vs. pessimistic database locking',
      'Controlled vocal delivery at 134 WPM with only 3 filler words',
      'Solid architectural breakdown of cache invalidation bottlenecks',
    ],
    areas_for_improvement: [
      'Include quantitative SLA benchmarks (e.g. p99 latency targets)',
      'Detail failover scenarios when primary Redis replica crashes',
    ],
    next_actions: [
      'Review stage 4 in Full-Stack Architecture roadmap',
      'Practice 60-second summary formulation',
    ],
    created_at: '2026-09-12T14:30:00Z',
  },
  {
    id: 'session_past_02',
    user_id: 'usr_7f8a92b',
    track: 'Data & AI',
    difficulty: 'hard',
    questions_count: 4,
    status: 'completed',
    eye_contact_score: 82,
    posture_score: 85,
    avg_pace_wpm: 142,
    filler_word_count: 6,
    save_recording: false,
    overall_score: 81,
    technical_score: 84,
    communication_score: 79,
    presence_score: 83,
    feedback_summary: 'Solid theoretical knowledge of Transformer multi-head attention. Slight tendency to speed up when discussing gradient descent.',
    strengths: [
      'Accurate mathematical formulation of attention matrix operations',
      'Clear comparison between HNSW and IVF vector indexes',
    ],
    areas_for_improvement: [
      'Pace accelerated to 155 WPM during complex mathematical proofs',
      'Take a deliberate 2-second pause before answering hard architectural prompts',
    ],
    next_actions: [
      'Practice slow cadence diaphragmatic breathing',
      'Revisit stage 3 in Generative AI roadmap',
    ],
    created_at: '2026-09-08T11:15:00Z',
  },
];

const INITIAL_CERTS: EarnedCertificate[] = [
  {
    id: 'cert_e_1',
    user_id: 'usr_7f8a92b',
    provider_name: 'Amazon Web Services',
    cert_title: 'AWS Cloud Quest: Cloud Practitioner',
    date_claimed: '2026-09-04T09:00:00Z',
    credential_url: 'https://aws.amazon.com/training/digital/aws-cloud-quest/',
  },
];

const INITIAL_THREADS: CounselingThread[] = [
  {
    id: 'thread_01',
    user_id: 'usr_7f8a92b',
    title: 'Transitioning to Staff Full-Stack Engineer',
    created_at: '2026-09-14T10:00:00Z',
    messages_count: 3,
  },
];

const INITIAL_MESSAGES: Record<string, CounselingMessage[]> = {
  thread_01: [
    {
      id: 'msg_1',
      thread_id: 'thread_01',
      role: 'user',
      content: 'What are the main architectural competencies expected when interviewing for a Staff / Lead Engineer role versus a Senior Engineer?',
      created_at: '2026-09-14T10:00:00Z',
    },
    {
      id: 'msg_2',
      thread_id: 'thread_01',
      role: 'assistant',
      content: `### Transitioning from Senior to Staff Engineer

At the **Staff level**, interviewers shift their focus from *individual execution speed* to **organizational leverage, cross-boundary architecture, and long-term risk mitigation**.

Here are the 4 core dimensions assessed:

1. **Strategic Architecture & Technical Vision**
   - Seniors design isolated features or services well. Staff engineers anticipate how systems evolve across 2–4 years, designing extensible primitives and establishing boundary contracts.

2. **Cross-Team Influence & Technical Alignment**
   - You must demonstrate how you write lightweight RFCs, resolve technical deadlock between product and infrastructure squads, and align multiple teams around common standards.

3. **Organizational Telemetry & Operational Health**
   - Defining SLIs/SLOs, managing tech debt payback cycles, and mentoring senior engineers to raise the baseline talent density of the team.

4. **Business Context & Tradeoff Framing**
   - Framing decisions in terms of operational spend, time-to-market, compliance, and developer velocity rather than pure engineering purity.

*Would you like to review sample Staff-level system design interview prompts or practice drafting an RFC framework?*`,
      created_at: '2026-09-14T10:00:30Z',
    },
  ],
};

// Custom Hook to manage local reactive storage with strict RLS simulation
export function useCollexaStore() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [roadmapProgress, setRoadmapProgress] = useState<Record<string, UserRoadmapProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROADMAP_PROGRESS);
      return saved ? JSON.parse(saved) : INITIAL_PROGRESS;
    } catch {
      return INITIAL_PROGRESS;
    }
  });

  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTERVIEW_SESSIONS);
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const [counselingThreads, setCounselingThreads] = useState<CounselingThread[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUNSELING_THREADS);
      return saved ? JSON.parse(saved) : INITIAL_THREADS;
    } catch {
      return INITIAL_THREADS;
    }
  });

  const [counselingMessages, setCounselingMessages] = useState<Record<string, CounselingMessage[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUNSELING_MESSAGES);
      return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  });

  const [earnedCerts, setEarnedCerts] = useState<EarnedCertificate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EARNED_CERTS);
      return saved ? JSON.parse(saved) : INITIAL_CERTS;
    } catch {
      return INITIAL_CERTS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROADMAP_PROGRESS, JSON.stringify(roadmapProgress));
  }, [roadmapProgress]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTERVIEW_SESSIONS, JSON.stringify(interviewSessions));
  }, [interviewSessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUNSELING_THREADS, JSON.stringify(counselingThreads));
  }, [counselingThreads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUNSELING_MESSAGES, JSON.stringify(counselingMessages));
  }, [counselingMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EARNED_CERTS, JSON.stringify(earnedCerts));
  }, [earnedCerts]);

  // Auth Operations
  const loginUser = async (email: string, fullName: string) => {
    const isNew = !currentUser || currentUser.email !== email;
    const newProfile: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email,
      full_name: fullName || email.split('@')[0],
      avatar_url: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(email)}`,
      role_target: 'Full-Stack Software Engineer',
      welcome_email_sent_at: null,
      media_consent_recording: false,
      notifications_enabled: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setCurrentUser(newProfile);

    // Trigger transactional welcome email webhook if not sent
    if (isNew) {
      try {
        const emailRes = await fetch('/api/email/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: newProfile.email,
            firstName: newProfile.full_name.split(' ')[0],
            profileId: newProfile.id,
          }),
        });
        const emailData = await emailRes.json();
        newProfile.welcome_email_sent_at = new Date().toISOString();
        if (emailData?.email) {
          newProfile.welcome_email = {
            subject: emailData.email.subject || "Welcome to COLLEXA — let's map out your career 🎓",
            from: emailData.email.from || "COLLEXA <hello@collexa.app>",
            sentAt: emailData.email.sentAt || new Date().toISOString(),
            html: emailData.email.html,
          };
        }
        setCurrentUser({ ...newProfile });
      } catch (err) {
        console.warn('Welcome email trigger note:', err);
      }
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      ...updates,
      updated_at: new Date().toISOString(),
    });
  };

  // Toggle stage completion
  const toggleStageCompletion = (roadmapSlug: string, stageId: number) => {
    if (!currentUser) return;
    const current = roadmapProgress[roadmapSlug] || {
      id: 'prog_' + Math.random().toString(36).substring(2, 9),
      user_id: currentUser.id,
      roadmap_slug: roadmapSlug,
      completed_stages: [],
      proof_of_work: {},
      updated_at: new Date().toISOString(),
    };

    const exists = current.completed_stages.includes(stageId);
    const newStages = exists
      ? current.completed_stages.filter((id) => id !== stageId)
      : [...current.completed_stages, stageId].sort((a, b) => a - b);

    const updated = {
      ...current,
      completed_stages: newStages,
      updated_at: new Date().toISOString(),
    };

    setRoadmapProgress((prev) => ({
      ...prev,
      [roadmapSlug]: updated,
    }));

    return !exists; // returns true if now completed (triggers confetti!)
  };

  const saveProofOfWork = (roadmapSlug: string, stageId: number, text: string) => {
    if (!currentUser) return;
    const current = roadmapProgress[roadmapSlug] || {
      id: 'prog_' + Math.random().toString(36).substring(2, 9),
      user_id: currentUser.id,
      roadmap_slug: roadmapSlug,
      completed_stages: [],
      proof_of_work: {},
      updated_at: new Date().toISOString(),
    };

    const updated = {
      ...current,
      proof_of_work: {
        ...current.proof_of_work,
        [stageId]: text,
      },
      updated_at: new Date().toISOString(),
    };

    setRoadmapProgress((prev) => ({
      ...prev,
      [roadmapSlug]: updated,
    }));
  };

  // Interview Sessions
  const createInterviewSession = (track: string, difficulty: 'easy' | 'medium' | 'hard', questionsCount: number, saveRecording: boolean): InterviewSession => {
    const session: InterviewSession = {
      id: 'session_' + Math.random().toString(36).substring(2, 10),
      user_id: currentUser ? currentUser.id : 'guest',
      track,
      difficulty,
      questions_count: questionsCount,
      status: 'in_progress',
      save_recording: saveRecording,
      created_at: new Date().toISOString(),
    };

    setInterviewSessions((prev) => [session, ...prev]);
    return session;
  };

  const completeInterviewSession = (sessionId: string, results: Partial<InterviewSession>) => {
    setInterviewSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, ...results, status: 'completed' } : s))
    );
  };

  // Certificates
  const toggleCertificateClaimed = (providerName: string, certTitle: string, claimUrl: string) => {
    if (!currentUser) return false;
    const existingIndex = earnedCerts.findIndex(
      (c) => c.provider_name === providerName && c.cert_title === certTitle
    );

    if (existingIndex >= 0) {
      setEarnedCerts((prev) => prev.filter((_, i) => i !== existingIndex));
      return false; // Unclaimed
    } else {
      const newCert: EarnedCertificate = {
        id: 'cert_' + Math.random().toString(36).substring(2, 9),
        user_id: currentUser.id,
        provider_name: providerName,
        cert_title: certTitle,
        date_claimed: new Date().toISOString(),
        credential_url: claimUrl,
      };
      setEarnedCerts((prev) => [newCert, ...prev]);
      return true; // Claimed!
    }
  };

  // Delete account with cascading cleanup
  const deleteAccountWithCascade = () => {
    localStorage.clear();
    setCurrentUser(null);
    setRoadmapProgress({});
    setInterviewSessions([]);
    setCounselingThreads([]);
    setCounselingMessages({});
    setEarnedCerts([]);
  };

  return {
    currentUser,
    loginUser,
    logoutUser,
    updateProfile,
    roadmapProgress,
    toggleStageCompletion,
    saveProofOfWork,
    interviewSessions,
    createInterviewSession,
    completeInterviewSession,
    counselingThreads,
    counselingMessages,
    setCounselingThreads,
    setCounselingMessages,
    earnedCerts,
    toggleCertificateClaimed,
    deleteAccountWithCascade,
  };
}
