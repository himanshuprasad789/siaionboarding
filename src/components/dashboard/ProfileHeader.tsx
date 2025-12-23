import { useOnboarding } from '@/contexts/OnboardingContext';
import { MOCK_FIELDS } from '@/types/onboarding';

export function ProfileHeader() {
  const { data } = useOnboarding();

  // Get the top selected field name
  const topField = data.selectedFields[0]
    ? MOCK_FIELDS.find((f) => f.id === data.selectedFields[0])?.name
    : 'Your Field';

  // Calculate profile strength based on evidence
  const evidenceCount = data.criteria.filter((c) => c.hasEvidence).length;
  const strengthPercentage = (evidenceCount / 10) * 100;
  const strengthLabel =
    strengthPercentage >= 70
      ? 'Strong'
      : strengthPercentage >= 40
      ? 'Moderate'
      : 'Building';

  return (
    <div className="bg-gradient-hero rounded-2xl p-8 text-primary-foreground">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-primary-foreground/70 text-sm uppercase tracking-wide mb-1">
            Your Field of Endeavor
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-bold">{topField}</h1>
          <p className="text-primary-foreground/80 mt-2">
            {data.essentials.fullName} • {data.essentials.jobTitle}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
            <p className="text-sm text-primary-foreground/70 mb-1">Profile Strength</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{evidenceCount}/10</span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  strengthLabel === 'Strong'
                    ? 'bg-accent/20 text-accent'
                    : strengthLabel === 'Moderate'
                    ? 'bg-gold/20 text-gold'
                    : 'bg-primary-foreground/20'
                }`}
              >
                {strengthLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
