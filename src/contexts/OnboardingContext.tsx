import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OnboardingData, EssentialsData, CriteriaItem, NicheData, INITIAL_CRITERIA } from '@/types/onboarding';

interface OnboardingContextType {
  data: OnboardingData;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  updateEssentials: (essentials: Partial<EssentialsData>) => void;
  updateCriteria: (criteria: CriteriaItem[]) => void;
  updateNiche: (niche: Partial<NicheData>) => void;
  updateSelectedFields: (fields: string[]) => void;
  isComplete: boolean;
  setIsComplete: (complete: boolean) => void;
}

const defaultEssentials: EssentialsData = {
  fullName: '',
  jobTitle: '',
  salary: 0,
  currency: 'USD',
  yearsExperience: 0,
  resumeFile: null,
};

const defaultNiche: NicheData = {
  specificNiche: '',
  uniquePosition: '',
  criticalChallenges: '',
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    essentials: defaultEssentials,
    criteria: INITIAL_CRITERIA,
    niche: defaultNiche,
    selectedFields: [],
  });

  const updateEssentials = (essentials: Partial<EssentialsData>) => {
    setData(prev => ({
      ...prev,
      essentials: { ...prev.essentials, ...essentials },
    }));
  };

  const updateCriteria = (criteria: CriteriaItem[]) => {
    setData(prev => ({ ...prev, criteria }));
  };

  const updateNiche = (niche: Partial<NicheData>) => {
    setData(prev => ({
      ...prev,
      niche: { ...prev.niche, ...niche },
    }));
  };

  const updateSelectedFields = (fields: string[]) => {
    setData(prev => ({ ...prev, selectedFields: fields }));
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        currentStep,
        setCurrentStep,
        updateEssentials,
        updateCriteria,
        updateNiche,
        updateSelectedFields,
        isComplete,
        setIsComplete,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
