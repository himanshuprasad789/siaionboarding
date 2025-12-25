import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProfileHeader } from '@/components/dashboard/ProfileHeader';
import { EvidenceChart } from '@/components/dashboard/EvidenceChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const recentActivity = [
  { id: 1, action: 'Press Draft submitted', time: '2 hours ago', status: 'pending' },
  { id: 2, action: 'Salary documentation uploaded', time: '1 day ago', status: 'approved' },
  { id: 3, action: 'Award application started', time: '2 days ago', status: 'in_progress' },
  { id: 4, action: 'Letter of recommendation received', time: '3 days ago', status: 'approved' },
];

const gapAnalysis = [
  { criteria: 'Authorship', strength: 'strong', score: 8 },
  { criteria: 'Press', strength: 'weak', score: 2 },
  { criteria: 'Awards', strength: 'moderate', score: 5 },
  { criteria: 'Critical Role', strength: 'weak', score: 1 },
];

export default function HomePage() {
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
                <p className="text-muted-foreground text-sm">You have evidence in 4 out of 10 categories. You need at least 3 strong ones.</p>
              </div>
              <Badge variant="outline" className="text-primary border-primary">
                Almost Ready
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
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    {activity.status === 'approved' ? (
                      <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                    ) : activity.status === 'pending' ? (
                      <Clock className="w-5 h-5 text-warning mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
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
