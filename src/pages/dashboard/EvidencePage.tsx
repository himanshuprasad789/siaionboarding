import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle2, ExternalLink, FileText, Download, Shield } from 'lucide-react';

interface EvidenceAsset {
  id: string;
  title: string;
  type: 'url' | 'pdf' | 'document';
  url?: string;
  metrics?: string;
  verified: boolean;
  uploadedAt: string;
}

interface EvidenceCategory {
  id: string;
  name: string;
  description: string;
  assets: EvidenceAsset[];
}

const mockEvidence: EvidenceCategory[] = [
  {
    id: 'awards',
    name: 'Awards',
    description: 'Nationally or internationally recognized prizes',
    assets: [
      { id: '1', title: 'AI Innovation Award 2023', type: 'pdf', metrics: 'Top 100 Global', verified: true, uploadedAt: '2024-01-15' },
      { id: '2', title: 'TechStars Winner Certificate', type: 'pdf', verified: true, uploadedAt: '2023-11-20' },
    ],
  },
  {
    id: 'press',
    name: 'Press',
    description: 'Published material about you in professional publications',
    assets: [
      { id: '3', title: 'TechCrunch Feature Article', type: 'url', url: 'https://techcrunch.com/example', metrics: 'Top 1% Outlet', verified: true, uploadedAt: '2024-02-10' },
      { id: '4', title: 'Forbes Interview', type: 'url', url: 'https://forbes.com/example', metrics: 'Top 1% Outlet', verified: true, uploadedAt: '2024-01-25' },
      { id: '5', title: 'MIT Technology Review', type: 'url', url: 'https://technologyreview.com/example', verified: false, uploadedAt: '2024-03-01' },
    ],
  },
  {
    id: 'authorship',
    name: 'Authorship',
    description: 'Published scholarly articles in professional journals',
    assets: [
      { id: '6', title: 'Nature ML Paper - Transformer Optimization', type: 'pdf', metrics: '150+ Citations', verified: true, uploadedAt: '2023-06-15' },
    ],
  },
  {
    id: 'membership',
    name: 'Membership',
    description: 'Membership in associations requiring outstanding achievements',
    assets: [],
  },
  {
    id: 'judging',
    name: 'Judging',
    description: 'Participation as a judge of the work of others',
    assets: [
      { id: '7', title: 'NeurIPS 2023 Reviewer Certificate', type: 'pdf', verified: true, uploadedAt: '2023-12-01' },
    ],
  },
  {
    id: 'original_contribution',
    name: 'Original Contribution',
    description: 'Evidence of original contributions of major significance',
    assets: [
      { id: '8', title: 'Patent: AI-Driven Data Processing', type: 'document', metrics: 'USPTO Approved', verified: true, uploadedAt: '2023-09-10' },
    ],
  },
  {
    id: 'scholarly_articles',
    name: 'Scholarly Articles',
    description: 'Authorship of scholarly articles in the field',
    assets: [],
  },
  {
    id: 'critical_role',
    name: 'Critical Role',
    description: 'Performance in a critical or essential capacity',
    assets: [],
  },
  {
    id: 'high_salary',
    name: 'High Salary',
    description: 'Commanding a high salary or remuneration',
    assets: [
      { id: '9', title: 'Employment Verification Letter', type: 'pdf', metrics: 'Top 10% in Field', verified: true, uploadedAt: '2024-01-05' },
      { id: '10', title: 'Salary Slips 2022-2024', type: 'pdf', verified: false, uploadedAt: '2024-03-15' },
    ],
  },
  {
    id: 'exhibitions',
    name: 'Exhibitions',
    description: 'Display of work at artistic exhibitions or showcases',
    assets: [],
  },
];

function AssetCard({ asset }: { asset: EvidenceAsset }) {
  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-foreground">{asset.title}</h4>
                {asset.verified && (
                  <div className="flex items-center gap-1 text-success">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs">Verified</span>
                  </div>
                )}
              </div>
              {asset.metrics && (
                <Badge variant="outline" className="mt-1 text-xs">{asset.metrics}</Badge>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Added {new Date(asset.uploadedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {asset.type === 'url' && asset.url && (
              <Button size="sm" variant="outline" asChild>
                <a href={asset.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function EvidencePage() {
  const totalAssets = mockEvidence.reduce((acc, cat) => acc + cat.assets.length, 0);
  const verifiedAssets = mockEvidence.reduce(
    (acc, cat) => acc + cat.assets.filter(a => a.verified).length, 0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Evidence Vault</h1>
            <p className="text-muted-foreground">Your permanent record of achievements</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{totalAssets}</p>
              <p className="text-sm text-muted-foreground">Total Assets</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-success">{verifiedAssets}</p>
              <p className="text-sm text-muted-foreground">Verified</p>
            </div>
          </div>
        </div>

        {/* Category Accordions */}
        <Accordion type="multiple" className="space-y-2">
          {mockEvidence.map((category) => (
            <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{category.name}</span>
                    <Badge variant={category.assets.length > 0 ? 'default' : 'secondary'}>
                      {category.assets.length}
                    </Badge>
                  </div>
                  {category.assets.some(a => a.verified) && (
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                {category.assets.length > 0 ? (
                  <div className="space-y-3">
                    {category.assets.map(asset => (
                      <AssetCard key={asset.id} asset={asset} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">No evidence uploaded yet</p>
                    <Button variant="outline" className="mt-2" size="sm">
                      Add Evidence
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </DashboardLayout>
  );
}
