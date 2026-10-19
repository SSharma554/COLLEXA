export type CategoryType = 'Career / Placement' | 'Data & AI' | 'Design & Product' | 'Engineering';

export interface CategoryTheme {
  name: CategoryType;
  color: string; // Hex color code
  bgLight: string;
  badgeBg: string;
  borderColor: string;
}

export interface RoadmapStage {
  id: number;
  stageNumber?: number;
  title: string;
  duration: string;
  description: string;
  skills: string[];
  resources: { title: string; url: string; type: 'doc' | 'video' | 'practice' }[];
  keyDeliverable: string;
  actionItems?: string[];
}

export interface RoadmapItem {
  id: string;
  slug: string;
  title: string;
  category: CategoryType;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedWeeks: number;
  stagesCount: number;
  description: string;
  tags: string[];
  stages: RoadmapStage[];
  prerequisites: string[];
  enrolledCount: number;
  averageRating: number;
}

export interface CareerItem {
  id: string;
  title: string;
  category: CategoryType;
  demandScore: number; // 0 - 100 for SVG meter
  demandTrend: 'Rapid Growth' | 'High Demand' | 'Stable' | 'Surging';
  salaryMinINR: string; // e.g. "₹8L"
  salaryMaxINR: string; // e.g. "₹42L"
  description: string;
  topSkills: string[];
  keyHiringCompanies: string[];
  openRolesEstimate: string;
  matchingRoadmapSlug: string;
}

export interface UserRoadmapProgress {
  id: string;
  user_id: string;
  roadmap_slug: string;
  completed_stages: number[];
  proof_of_work: Record<number, string>; // stageId -> notes/links
  updated_at: string;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  track: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions_count: number;
  status: 'in_progress' | 'completed';
  eye_contact_score?: number;
  posture_score?: number;
  avg_pace_wpm?: number;
  filler_word_count?: number;
  save_recording: boolean;
  overall_score?: number;
  technical_score?: number;
  communication_score?: number;
  presence_score?: number;
  feedback_summary?: string;
  strengths?: string[];
  areas_for_improvement?: string[];
  next_actions?: string[];
  created_at: string;
}

export interface InterviewAnswer {
  id: string;
  session_id: string;
  question_text: string;
  transcript: string;
  user_audio_url?: string;
  feedback_notes?: string;
  score?: number;
  answered_at: string;
}

export interface CounselingThread {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  messages_count?: number;
}

export interface CounselingMessage {
  id: string;
  thread_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface EarnedCertificate {
  id: string;
  user_id: string;
  provider_name: string;
  cert_title: string;
  date_claimed: string;
  credential_url?: string;
}

export interface CertificateDirectoryItem {
  id: string;
  provider_name: string;
  cert_title: string;
  category: CategoryType;
  durationHours: number;
  level: 'Foundational' | 'Associate' | 'Professional';
  badgeUrl: string;
  claimUrl: string;
  skillsGained: string[];
  learningFormat: 'Free Course & Exam' | 'Free Badge Track' | 'Free Audit Track';
  prerequisites: string;
  verificationMethod: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  role_target: string;
  welcome_email_sent_at?: string | null;
  welcome_email?: {
    subject: string;
    from: string;
    sentAt: string;
    html?: string;
  } | null;
  media_consent_recording: boolean;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}
