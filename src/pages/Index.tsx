import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, FileText, Shield, Zap, Target, CheckCircle2 } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-gradient-hero text-primary-foreground">
        <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-lg font-display font-bold">EB1 Strategy</span>
          </div>
          <Link to="/onboarding">
            <Button variant="accent" size="lg">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </nav>

        <div className="container mx-auto px-4 py-24 text-center">
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight">
              Your Path to
              <span className="block text-accent">EB1A Excellence</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
              Strategic evidence building and opportunity matching for extraordinary ability visa applicants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/onboarding">
                <Button variant="accent" size="xl">
                  Start Your Assessment
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/dashboard/strategy">
                <Button
                  variant="secondary"
                  size="xl"
                  className="bg-primary-foreground/10 border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20"
                >
                  View Demo Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              A Smarter Approach to EB1A
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We analyze your profile and match you with the best opportunities to strengthen your case.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Niche Identification',
                description:
                  'AI-powered analysis to define your unique field of endeavor and position.',
              },
              {
                icon: Shield,
                title: 'Evidence Strategy',
                description:
                  'Visual mapping of your evidence strength across all 10 EB1A criteria.',
              },
              {
                icon: Zap,
                title: 'Opportunity Matching',
                description:
                  'Curated opportunities to build press, judging, and authorship evidence.',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card rounded-2xl border border-border p-8 shadow-medium hover:shadow-large transition-all duration-300 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How It Works
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              { step: 1, title: 'Complete Your Profile', desc: 'Share your background, experience, and existing evidence.' },
              { step: 2, title: 'Define Your Niche', desc: 'We help you articulate your unique field of endeavor.' },
              { step: 3, title: 'Select Target Fields', desc: 'Choose 5 fields that align with your expertise.' },
              { step: 4, title: 'Access Opportunities', desc: 'Get matched with press, speaking, and judging opportunities.' },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-start gap-6 bg-card rounded-xl p-6 border border-border shadow-soft"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary-foreground">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <CheckCircle2 className="w-16 h-16 mx-auto text-accent" />
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Ready to Build Your Case?
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Start your free assessment and see how we can help you achieve EB1A approval.
            </p>
            <Link to="/onboarding">
              <Button variant="accent" size="xl">
                Begin Your Journey
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-12 text-primary-foreground/60">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 EB1 Strategy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
