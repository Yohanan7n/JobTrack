export type PersonaType = 'JOB_SEEKER' | 'EMPLOYER' | 'FREELANCER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED';
  activePersona?: PersonaType;
  title?: string | null;
  bio?: string | null;
  skills?: string | null;
  hourlyRate?: number | null;
  companyName?: string | null;
  avatar?: string | null;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const STORAGE_KEY_TOKEN = 'jobtrack_token';
const STORAGE_KEY_USER = 'jobtrack_user';

export const getStoredAuth = (): { token: string | null; user: User | null } => {
  try {
    const token = localStorage.getItem(STORAGE_KEY_TOKEN);
    const userStr = localStorage.getItem(STORAGE_KEY_USER);
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
};

export const setStoredAuth = (token: string, user: User) => {
  localStorage.setItem(STORAGE_KEY_TOKEN, token);
  localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(STORAGE_KEY_TOKEN);
  localStorage.removeItem(STORAGE_KEY_USER);
};
