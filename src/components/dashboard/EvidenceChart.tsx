import { useOnboarding } from '@/contexts/OnboardingContext';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { Lightbulb, TrendingUp, AlertCircle } from 'lucide-react';

export function EvidenceChart() {
  const { data } = useOnboarding();

  // Transform criteria data for the radar chart
  const chartData = data.criteria.map((criterion) => ({
    subject: criterion.label,
    value: criterion.hasEvidence ? (criterion.evidenceDescription ? 80 : 50) : 10,
    fullMark: 100,
  }));

  // Generate recommendations based on weak areas
  const weakAreas = data.criteria.filter((c) => !c.hasEvidence);
  const strongAreas = data.criteria.filter((c) => c.hasEvidence);

  const recommendations = [
    strongAreas.length > 0 && {
      icon: TrendingUp,
      type: 'strength',
      text: `Your ${strongAreas[0]?.label} evidence is solid. Focus on strengthening documentation.`,
    },
    weakAreas.find((w) => w.id === 'press') && {
      icon: AlertCircle,
      type: 'opportunity',
      text: 'You lack Press coverage. Focus on Press tickets to build media presence.',
    },
    weakAreas.find((w) => w.id === 'judging') && {
      icon: Lightbulb,
      type: 'suggestion',
      text: 'Consider applying to review panels or competition judging roles.',
    },
    {
      icon: Lightbulb,
      type: 'general',
      text: 'Aim to have evidence in at least 3 categories for a strong EB1A case.',
    },
  ].filter(Boolean);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Radar Chart */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-medium">
        <h3 className="font-display text-xl font-bold text-foreground mb-4">
          Evidence Strength Analysis
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              />
              <Radar
                name="Evidence"
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-medium">
        <h3 className="font-display text-xl font-bold text-foreground mb-4">
          Recommendations
        </h3>
        <div className="space-y-4">
          {recommendations.slice(0, 4).map((rec, index) => {
            if (!rec) return null;
            const Icon = rec.icon;
            return (
              <div
                key={index}
                className={`flex items-start gap-3 p-4 rounded-xl ${
                  rec.type === 'strength'
                    ? 'bg-success-light'
                    : rec.type === 'opportunity'
                    ? 'bg-warning-light'
                    : 'bg-muted'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                    rec.type === 'strength'
                      ? 'text-success'
                      : rec.type === 'opportunity'
                      ? 'text-warning'
                      : 'text-primary'
                  }`}
                />
                <p className="text-sm text-foreground">{rec.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
