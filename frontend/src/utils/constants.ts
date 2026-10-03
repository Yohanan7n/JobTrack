export type ApplicationStatus = 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFER' | 'REJECTED';

export interface StatusConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  columnBg: string;
  borderHover: string;
}

export const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  APPLIED: {
    label: 'Applied',
    badgeBg: 'bg-indigo-500/10',
    badgeText: 'text-indigo-400',
    badgeBorder: 'border-indigo-500/20',
    dotColor: 'bg-indigo-400',
    columnBg: 'border-indigo-500/10',
    borderHover: 'hover:border-indigo-500/40',
  },
  SCREENING: {
    label: 'Screening',
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
    badgeBorder: 'border-amber-500/20',
    dotColor: 'bg-amber-400',
    columnBg: 'border-amber-500/10',
    borderHover: 'hover:border-amber-500/40',
  },
  INTERVIEW: {
    label: 'Interview',
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-400',
    badgeBorder: 'border-sky-500/20',
    dotColor: 'bg-sky-400',
    columnBg: 'border-sky-500/10',
    borderHover: 'hover:border-sky-500/40',
  },
  OFFER: {
    label: 'Offer',
    badgeBg: 'bg-emerald-500/10',
    badgeText: 'text-emerald-400',
    badgeBorder: 'border-emerald-500/20',
    dotColor: 'bg-emerald-400',
    columnBg: 'border-emerald-500/10',
    borderHover: 'hover:border-emerald-500/40',
  },
  REJECTED: {
    label: 'Rejected',
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-400',
    badgeBorder: 'border-rose-500/20',
    dotColor: 'bg-rose-400',
    columnBg: 'border-rose-500/10',
    borderHover: 'hover:border-rose-500/40',
  },
};

export const KANBAN_STAGES: ApplicationStatus[] = [
  'APPLIED',
  'SCREENING',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
];

export const LOCATION_TYPES = [
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'ONSITE', label: 'On-site' },
];

export const EMPLOYMENT_TYPES = [
  { value: 'FULL_TIME', label: 'Full-time' },
  { value: 'PART_TIME', label: 'Part-time' },
  { value: 'CONTRACT', label: 'Contract' },
  { value: 'INTERNSHIP', label: 'Internship' },
];

export const INTERVIEW_TYPES = [
  { value: 'HR', label: 'Recruiter / HR Screen' },
  { value: 'TECHNICAL', label: 'Technical / Live Coding' },
  { value: 'BEHAVIORAL', label: 'Behavioral / Leadership' },
  { value: 'SYSTEM_DESIGN', label: 'System Design / Architecture' },
  { value: 'FINAL', label: 'Final Round / Executive' },
  { value: 'OTHER', label: 'Other' },
];

export const DOCUMENT_TYPES = [
  { value: 'RESUME', label: 'Resume / CV' },
  { value: 'COVER_LETTER', label: 'Cover Letter' },
  { value: 'PORTFOLIO', label: 'Portfolio / Deck' },
  { value: 'CERTIFICATE', label: 'Certificate' },
  { value: 'OTHER', label: 'Other Document' },
];
