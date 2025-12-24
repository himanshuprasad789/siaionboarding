export interface EssentialsData {
  fullName: string;
  jobTitle: string;
  salary: number;
  currency: string;
  yearsExperience: number;
  resumeFile: File | null;
}

export interface ActivityTicket {
  id: string;
  title: string;
  source: string;
  criteriaId: string;
}

export interface CriteriaItem {
  id: string;
  label: string;
  description: string;
  hasEvidence: boolean;
  evidenceDescription: string;
  tickets: ActivityTicket[];
}

export interface NicheData {
  specificNiche: string;
  uniquePosition: string;
  criticalChallenges: string;
}

export interface SIAIData {
  fieldsIndustries: string;
  endApplications: string;
  knowledgeAreas: string;
  passionAreas: string;
  workAspects: string;
  specializedSkills: string;
  skillVariations: string;
  industryGaps: string;
  fieldSizes: string;
  workingSolutions: string;
  notWorkingWell: string;
  expertDemonstration: string;
  uniqueSkills: string;
  impactfulProjects: string;
  biggestChallenges: string;
}

export interface GeneratedTitles {
  paperTitles: string[];
  pressReleaseTitles: string[];
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
  siai: SIAIData;
  generatedTitles: GeneratedTitles;
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
  { 
    id: 'authorship', 
    label: 'Authorship', 
    description: 'Published scholarly articles in professional journals', 
    hasEvidence: false, 
    evidenceDescription: '',
    tickets: [
      { id: 'auth-1', title: 'Technical blog posts on React architecture patterns', source: 'Resume', criteriaId: 'authorship' },
      { id: 'auth-2', title: 'Documentation for open-source component libraries', source: 'Profile', criteriaId: 'authorship' },
    ]
  },
  { 
    id: 'awards', 
    label: 'Awards', 
    description: 'Nationally or internationally recognized prizes or awards', 
    hasEvidence: false, 
    evidenceDescription: '',
    tickets: [
      { id: 'award-1', title: 'Best Innovation Award - Invesco Hackathon 2023', source: 'Resume', criteriaId: 'awards' },
    ]
  },
  { 
    id: 'membership', 
    label: 'Membership', 
    description: 'Membership in associations requiring outstanding achievements', 
    hasEvidence: false, 
    evidenceDescription: '',
    tickets: [
      { id: 'mem-1', title: 'IEEE Computer Society Professional Member', source: 'Profile', criteriaId: 'membership' },
    ]
  },
  { 
    id: 'judging', 
    label: 'Judging', 
    description: 'Participation as a judge of the work of others', 
    hasEvidence: false, 
    evidenceDescription: '',
    tickets: [
      { id: 'judge-1', title: 'Code review lead for 25-member development team', source: 'Resume', criteriaId: 'judging' },
      { id: 'judge-2', title: 'Technical interview panelist for senior developers', source: 'Profile', criteriaId: 'judging' },
    ]
  },
  { 
    id: 'original-contributions', 
    label: 'Original Contributions', 
    description: 'Original scientific, scholarly, or business contributions', 
    hasEvidence: false, 
    evidenceDescription: '',
    tickets: [
      { id: 'orig-1', title: 'Scalable frontend architecture for Vision app at Invesco', source: 'Resume', criteriaId: 'original-contributions' },
      { id: 'orig-2', title: 'Custom middleware solution for real-time inventory at Macy\'s', source: 'Resume', criteriaId: 'original-contributions' },
      { id: 'orig-3', title: 'Security patterns framework at Tenable', source: 'Resume', criteriaId: 'original-contributions' },
    ]
  },
  { 
    id: 'press', 
    label: 'Press/Media', 
    description: 'Published material in professional publications or major media', 
    hasEvidence: false, 
    evidenceDescription: '',
    tickets: []
  },
  { 
    id: 'exhibitions', 
    label: 'Exhibitions', 
    description: 'Display of work at artistic exhibitions or showcases', 
    hasEvidence: false, 
    evidenceDescription: '',
    tickets: []
  },
  { 
    id: 'leading-role', 
    label: 'Leading Role', 
    description: 'Leading or critical role in distinguished organizations', 
    hasEvidence: false, 
    evidenceDescription: '',
    tickets: [
      { id: 'lead-1', title: 'Tech Lead managing 25+ developers at Photon Infotech', source: 'Resume', criteriaId: 'leading-role' },
      { id: 'lead-2', title: 'Frontend Architecture Lead at Invesco', source: 'Resume', criteriaId: 'leading-role' },
      { id: 'lead-3', title: 'Senior Developer leading security initiatives at Tenable', source: 'Resume', criteriaId: 'leading-role' },
    ]
  },
  { 
    id: 'high-salary', 
    label: 'High Salary', 
    description: 'High salary or remuneration compared to others in the field', 
    hasEvidence: false, 
    evidenceDescription: '',
    tickets: [
      { id: 'sal-1', title: '16+ years experience commanding top-tier compensation', source: 'Profile', criteriaId: 'high-salary' },
    ]
  },
  { 
    id: 'commercial-success', 
    label: 'Commercial Success', 
    description: 'Commercial successes in the performing arts', 
    hasEvidence: false, 
    evidenceDescription: '',
    tickets: [
      { id: 'comm-1', title: '$120K annual savings through tool optimization at Tenable', source: 'Resume', criteriaId: 'commercial-success' },
      { id: 'comm-2', title: 'BOPIS feature driving increased sales at Macy\'s', source: 'Resume', criteriaId: 'commercial-success' },
    ]
  },
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
