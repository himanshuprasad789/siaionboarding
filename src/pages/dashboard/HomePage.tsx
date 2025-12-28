import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProfileHeader } from '@/components/dashboard/ProfileHeader';
import { EvidenceChart } from '@/components/dashboard/EvidenceChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useActivityLog } from '@/hooks/useActivityLog';
import { useEvidence } from '@/hooks/useEvidence';
import { formatDistanceToNow } from 'date-fns';

export default function HomePage() {
  const { data: activityLog, isLoading: activityLoading } = useActivityLog(10);
  const { data: evidence, isLoading: evidenceLoading } = useEvidence();

  // Calculate gap analysis based on evidence types
  const getGapAnalysis = () => {
    if (!evidence) return [];
    
    const categories = [
      { criteria: 'Authorship', types: ['publication', 'citation'] },
      { criteria: 'Press', types: ['media_coverage'] },
      { criteria: 'Awards', types: ['award'] },
      { criteria: 'Critical Role', types: ['leadership'] },
    ];

    return categories.map(cat => {
      const count = evidence.filter(e => cat.types.includes(e.evidence_type)).length;
      const approvedCount = evidence.filter(e => cat.types.includes(e.evidence_type) && e.status === 'approved').length;
      
      let strength: 'strong' | 'moderate' | 'weak';
      let score: number;
      
      if (approvedCount >= 3) {
        strength = 'strong';
        score = 8;
      } else if (approvedCount >= 1) {
        strength = 'moderate';
        score = 5;
      } else {
        strength = 'weak';
        score = count > 0 ? 2 : 1;
      }

      return { criteria: cat.criteria, strength, score };
    });
  };

  const gapAnalysis = getGapAnalysis();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <ProfileHeader />
        
        {/* Question Banner */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Am I ready to file my EB1 case yet?</h2>
                <p className="text-muted-foreground text-sm">
                  You have evidence in {gapAnalysis.filter(g => g.score > 1).length} out of {gapAnalysis.length} categories. 
                  You need at least 3 strong ones.
                </p>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                {gapAnalysis.filter(g => g.strength === 'strong').length >= 3 ? 'Ready' : 'Almost Ready'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <EvidenceChart />

        {/* Gap Analysis & Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Gap Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Gap Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {evidenceLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-3">
                  {gapAnalysis.map((item) => (
                    <div key={item.criteria} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{item.criteria}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.strength === 'strong' ? 'bg-success' :
                              item.strength === 'moderate' ? 'bg-warning' : 'bg-destructive'
                            }`}
                            style={{ width: `${item.score * 10}%` }}
                          />
                        </div>
                        <Badge variant={
                          item.strength === 'strong' ? 'default' :
                          item.strength === 'moderate' ? 'secondary' : 'destructive'
                        }>
                          {item.strength}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/dashboard/marketplace">
                  Fix Weak Areas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : activityLog && activityLog.length > 0 ? (
                <div className="space-y-3">
                  {activityLog.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      {activity.action === 'approved' ? (
                        <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                      ) : activity.action === 'created' ? (
                        <Clock className="w-5 h-5 text-warning mt-0.5" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{activity.action} {activity.entity_type}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent activity</p>
                </div>
              )}
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/dashboard/plan">
                  View All Activity
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
