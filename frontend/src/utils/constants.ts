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
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    badgeBorder: 'border-indigo-200',
    dotColor: 'bg-indigo-600',
    columnBg: 'border-indigo-100',
    borderHover: 'hover:border-indigo-400',
  },
  SCREENING: {
    label: 'Screening',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-200',
    dotColor: 'bg-amber-500',
    columnBg: 'border-amber-100',
    borderHover: 'hover:border-amber-400',
  },
  INTERVIEW: {
    label: 'Interview',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-700',
    badgeBorder: 'border-sky-200',
    dotColor: 'bg-sky-500',
    columnBg: 'border-sky-100',
    borderHover: 'hover:border-sky-400',
  },
  OFFER: {
    label: 'Offer',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
    columnBg: 'border-emerald-100',
    borderHover: 'hover:border-emerald-400',
  },
  REJECTED: {
    label: 'Rejected',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    badgeBorder: 'border-rose-200',
    dotColor: 'bg-rose-500',
    columnBg: 'border-rose-100',
    borderHover: 'hover:border-rose-400',
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
