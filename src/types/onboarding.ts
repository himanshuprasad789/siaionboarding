export interface EssentialsData {
  fullName: string;
  jobTitle: string;
  salary: number;
  currency: string;
  yearsExperience: number;
  resumeFile: File | null;
}

export interface CriteriaItem {
  id: string;
  label: string;
  description: string;
  hasEvidence: boolean;
  evidenceDescription: string;
}

export interface NicheData {
  specificNiche: string;
  uniquePosition: string;
  criticalChallenges: string;
}

export interface FieldOfEndeavor {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}

export interface OnboardingData {
  essentials: EssentialsData;
  criteria: CriteriaItem[];
  niche: NicheData;
  selectedFields: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  isPremium: boolean;
  imageUrl?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const INITIAL_CRITERIA: CriteriaItem[] = [
  { id: 'authorship', label: 'Authorship', description: 'Published scholarly articles in professional journals', hasEvidence: false, evidenceDescription: '' },
  { id: 'awards', label: 'Awards', description: 'Nationally or internationally recognized prizes or awards', hasEvidence: false, evidenceDescription: '' },
  { id: 'membership', label: 'Membership', description: 'Membership in associations requiring outstanding achievements', hasEvidence: false, evidenceDescription: '' },
  { id: 'judging', label: 'Judging', description: 'Participation as a judge of the work of others', hasEvidence: false, evidenceDescription: '' },
  { id: 'original-contributions', label: 'Original Contributions', description: 'Original scientific, scholarly, or business contributions', hasEvidence: false, evidenceDescription: '' },
  { id: 'press', label: 'Press/Media', description: 'Published material in professional publications or major media', hasEvidence: false, evidenceDescription: '' },
  { id: 'exhibitions', label: 'Exhibitions', description: 'Display of work at artistic exhibitions or showcases', hasEvidence: false, evidenceDescription: '' },
  { id: 'leading-role', label: 'Leading Role', description: 'Leading or critical role in distinguished organizations', hasEvidence: false, evidenceDescription: '' },
  { id: 'high-salary', label: 'High Salary', description: 'High salary or remuneration compared to others in the field', hasEvidence: false, evidenceDescription: '' },
  { id: 'commercial-success', label: 'Commercial Success', description: 'Commercial successes in the performing arts', hasEvidence: false, evidenceDescription: '' },
];

export const MOCK_FIELDS: FieldOfEndeavor[] = [
  { id: '1', name: 'Neuromorphic Engineering', category: 'AI/ML', selected: false },
  { id: '2', name: 'AI Ethics in Fintech', category: 'Ethics', selected: false },
  { id: '3', name: 'Sustainable Urban Planning', category: 'Urban Dev', selected: false },
  { id: '4', name: 'Quantum Machine Learning', category: 'AI/ML', selected: false },
  { id: '5', name: 'Biomedical Signal Processing', category: 'Healthcare', selected: false },
  { id: '6', name: 'Natural Language Understanding', category: 'AI/ML', selected: false },
  { id: '7', name: 'Autonomous Systems Design', category: 'Robotics', selected: false },
  { id: '8', name: 'Climate Tech Innovation', category: 'Sustainability', selected: false },
  { id: '9', name: 'Digital Health Informatics', category: 'Healthcare', selected: false },
  { id: '10', name: 'Cybersecurity Architecture', category: 'Security', selected: false },
];

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  { id: '1', title: 'Top Tier Tech Podcast Interview', description: 'Get featured on leading technology podcasts reaching 500K+ listeners', category: 'Press', isPremium: false, difficulty: 'medium' },
  { id: '2', title: 'IEEE Journal Peer Review', description: 'Serve as a reviewer for prestigious IEEE publications', category: 'Judging', isPremium: false, difficulty: 'hard' },
  { id: '3', title: 'Forbes Technology Council', description: 'Apply for membership in this exclusive community', category: 'Membership', isPremium: false, difficulty: 'medium' },
  { id: '4', title: 'TED Talk Application', description: 'Submit your idea for a TED or TEDx presentation', category: 'Press', isPremium: true, difficulty: 'hard' },
  { id: '5', title: 'Harvard Business Review Op-Ed', description: 'Pitch an opinion piece to HBR editors', category: 'Authorship', isPremium: true, difficulty: 'hard' },
  { id: '6', title: 'Industry Conference Speaking', description: 'Apply to speak at major industry conferences', category: 'Press', isPremium: true, difficulty: 'medium' },
  { id: '7', title: 'Patent Filing Assistance', description: 'File for patents on your original contributions', category: 'Original Contributions', isPremium: true, difficulty: 'hard' },
  { id: '8', title: 'Startup Advisory Board', description: 'Join advisory boards of emerging startups', category: 'Leading Role', isPremium: true, difficulty: 'easy' },
  { id: '9', title: 'Academic Journal Publication', description: 'Submit research to top academic journals', category: 'Authorship', isPremium: true, difficulty: 'hard' },
];
