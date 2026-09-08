export type Role = 'student' | 'teacher' | 'admin';

export type LanguageCode = 'en' | 'te' | 'hi' | 'ta' | 'mr' | 'bn';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  preferred_language: LanguageCode;
  low_bandwidth_mode?: boolean;
  school_id?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SubtitleCue {
  start: number; // in seconds
  end: number;
  text: string;
}

export interface TranscriptChunk {
  id: string;
  start_time: number;
  end_time: number;
  text_en: string;
  text_te?: string;
  text_hi?: string;
  technical_terms?: Array<{
    term: string;
    translation: string;
    definition: string;
  }>;
}

export interface ConceptCard {
  id: string;
  name: string;
  name_te?: string;
  name_hi?: string;
  definition: string;
  formula?: string;
  misconceptions?: string[];
}

export interface QuestionOption {
  id: string;
  text: string;
  text_te?: string;
  text_hi?: string;
}

export interface Question {
  id: string;
  text: string;
  text_te?: string;
  text_hi?: string;
  options: QuestionOption[];
  correct_option_id: string;
  explanation: string;
  source_citation?: {
    chunk_id?: string;
    timestamp?: number;
    quote?: string;
  };
  competency_id: string;
}

export interface LearningPackage {
  id: string;
  asset_id: string;
  title: string;
  title_te?: string;
  title_hi?: string;
  subject: string;
  grade_level: string;
  duration_seconds: number;
  media_url: string; // audio or compressed video
  video_url?: string;
  audio_dub_te_url?: string;
  audio_dub_hi_url?: string;
  transcript_chunks: TranscriptChunk[];
  subtitles: {
    en: SubtitleCue[];
    te: SubtitleCue[];
    hi: SubtitleCue[];
  };
  concepts: ConceptCard[];
  questions: Question[];
  downloaded_at?: string;
  size_bytes: number;
}

export interface AttemptSubmission {
  id?: string;
  idempotency_key: string;
  student_id: string;
  asset_id: string;
  question_id: string;
  selected_option_id: string;
  is_correct: boolean;
  time_spent_seconds: number;
  confidence_rating?: number; // 1-5
  timestamp: string;
  synced: boolean;
}

export interface CompetencyScore {
  competency_id: string;
  name: string;
  mastery_percentage: number;
  tier: 'mastered' | 'developing' | 'needs_support';
  evidence_count: number;
  last_evaluated: string;
}

export interface MisconceptionCluster {
  id: string;
  concept_name: string;
  error_rate: number;
  student_count: number;
  root_cause: string;
  recommended_micro_lesson: {
    title: string;
    duration_minutes: number;
    language: string;
    asset_id: string;
  };
}

export interface InterventionPlan {
  id: string;
  title: string;
  target_concept: string;
  assigned_student_ids: string[];
  assigned_resource_id: string;
  expected_improvement_pct: number;
  status: 'active' | 'completed';
  created_at: string;
}

export interface SyncStatus {
  state: 'online' | 'offline' | 'syncing' | 'synced' | 'error';
  pending_count: number;
  last_synced?: string;
  error_message?: string;
}
