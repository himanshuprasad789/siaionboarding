
-- Insert workflows for each team
INSERT INTO public.workflows (id, name, description, team, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Press Release Workflow', 'Standard workflow for press release submissions', 'press', true),
  ('22222222-2222-2222-2222-222222222222', 'Media Outreach Workflow', 'Workflow for media coverage and outreach', 'press', true),
  ('33333333-3333-3333-3333-333333333333', 'Salary Analysis Workflow', 'Workflow for salary comparison research', 'research', true),
  ('44444444-4444-4444-4444-444444444444', 'Opportunity Research Workflow', 'Workflow for researching new opportunities', 'research', true),
  ('55555555-5555-5555-5555-555555555555', 'Journal Publication Workflow', 'Workflow for journal article submissions', 'paper', true),
  ('66666666-6666-6666-6666-666666666666', 'Book Publication Workflow', 'Workflow for book manuscript submissions', 'paper', true);

-- Insert workflow stages for Press Release Workflow
INSERT INTO public.workflow_stages (id, workflow_id, name, description, order_index, required_role, estimated_hours) VALUES
  ('a1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Draft Review', 'Initial review of press release draft', 1, 'press', 4),
  ('a2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Content Editing', 'Edit and refine content', 2, 'press', 6),
  ('a3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Media List Preparation', 'Prepare target media list', 3, 'press', 3),
  ('a4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Distribution', 'Send to media outlets', 4, 'press', 2),
  ('a5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', 'Follow-up', 'Follow up with media contacts', 5, 'press', 4);

-- Insert workflow stages for Media Outreach Workflow
INSERT INTO public.workflow_stages (id, workflow_id, name, description, order_index, required_role, estimated_hours) VALUES
  ('b1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'Media Research', 'Research target media outlets', 1, 'press', 5),
  ('b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Pitch Development', 'Develop media pitch', 2, 'press', 4),
  ('b3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'Outreach', 'Contact media outlets', 3, 'press', 6),
  ('b4444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Coverage Tracking', 'Track media coverage', 4, 'press', 3);

-- Insert workflow stages for Salary Analysis Workflow
INSERT INTO public.workflow_stages (id, workflow_id, name, description, order_index, required_role, estimated_hours) VALUES
  ('c1111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', 'Data Collection', 'Collect salary data from sources', 1, 'research', 8),
  ('c2222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Analysis', 'Analyze salary comparisons', 2, 'research', 6),
  ('c3333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'Report Generation', 'Generate salary report', 3, 'research', 4),
  ('c4444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', 'Client Review', 'Review with client', 4, 'research', 2);

-- Insert workflow stages for Opportunity Research Workflow
INSERT INTO public.workflow_stages (id, workflow_id, name, description, order_index, required_role, estimated_hours) VALUES
  ('d1111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', 'Opportunity Identification', 'Identify potential opportunities', 1, 'research', 6),
  ('d2222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Eligibility Assessment', 'Assess client eligibility', 2, 'research', 4),
  ('d3333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'Recommendation', 'Prepare recommendations', 3, 'research', 3);

-- Insert workflow stages for Journal Publication Workflow
INSERT INTO public.workflow_stages (id, workflow_id, name, description, order_index, required_role, estimated_hours) VALUES
  ('e1111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'Manuscript Review', 'Review manuscript quality', 1, 'paper', 8),
  ('e2222222-2222-2222-2222-222222222222', '55555555-5555-5555-5555-555555555555', 'Journal Selection', 'Select target journals', 2, 'paper', 4),
  ('e3333333-3333-3333-3333-333333333333', '55555555-5555-5555-5555-555555555555', 'Formatting', 'Format for journal requirements', 3, 'paper', 6),
  ('e4444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'Submission', 'Submit to journal', 4, 'paper', 2),
  ('e5555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555555', 'Revision Support', 'Support revision requests', 5, 'paper', 8);

-- Insert workflow stages for Book Publication Workflow
INSERT INTO public.workflow_stages (id, workflow_id, name, description, order_index, required_role, estimated_hours) VALUES
  ('f1111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', 'Proposal Review', 'Review book proposal', 1, 'paper', 6),
  ('f2222222-2222-2222-2222-222222222222', '66666666-6666-6666-6666-666666666666', 'Publisher Research', 'Research suitable publishers', 2, 'paper', 8),
  ('f3333333-3333-3333-3333-333333333333', '66666666-6666-6666-6666-666666666666', 'Submission Preparation', 'Prepare submission package', 3, 'paper', 10),
  ('f4444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666666', 'Publisher Outreach', 'Contact publishers', 4, 'paper', 4);

-- Insert opportunities (EB-1A criteria categories)
INSERT INTO public.opportunities (id, title, description, category, status, difficulty_level, estimated_time_weeks, evidence_types) VALUES
  ('01111111-1111-1111-1111-111111111111', 'Academic Journal Publication', 'Publish research in a peer-reviewed academic journal', 'Scholarly Articles', 'published', 3, 12, ARRAY['publication']),
  ('02222222-2222-2222-2222-222222222222', 'Industry Award Nomination', 'Get nominated for a prestigious industry award', 'Awards', 'published', 4, 8, ARRAY['award']),
  ('03333333-3333-3333-3333-333333333333', 'Patent Filing', 'File a patent for an original invention', 'Original Contributions', 'published', 5, 24, ARRAY['patent']),
  ('04444444-4444-4444-4444-444444444444', 'Conference Speaking Engagement', 'Speak at a major industry conference', 'Speaking Engagements', 'published', 2, 4, ARRAY['speaking_engagement']),
  ('05555555-5555-5555-5555-555555555555', 'Media Feature Article', 'Get featured in major media publication', 'Media Coverage', 'published', 3, 6, ARRAY['media_coverage']),
  ('06666666-6666-6666-6666-666666666666', 'Professional Association Leadership', 'Take leadership role in professional association', 'Leadership', 'published', 3, 8, ARRAY['leadership', 'membership']),
  ('07777777-7777-7777-7777-777777777777', 'Research Grant Award', 'Secure a competitive research grant', 'Grants', 'published', 4, 16, ARRAY['grant']),
  ('08888888-8888-8888-8888-888888888888', 'Peer Review Panel Membership', 'Join peer review panel for journals or grants', 'Review Work', 'published', 2, 4, ARRAY['review_work']),
  ('09999999-9999-9999-9999-999999999999', 'High Salary Documentation', 'Document salary significantly above industry average', 'Salary Evidence', 'published', 1, 2, ARRAY['salary_evidence']),
  ('0aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Citation Milestone', 'Achieve significant citation count for published work', 'Citations', 'published', 3, 12, ARRAY['citation']);

-- Insert workflow permissions for each role
INSERT INTO public.workflow_permissions (workflow_id, stage_id, role, permission_level) 
SELECT 
  w.id as workflow_id,
  ws.id as stage_id,
  'admin'::app_role as role,
  'edit'::permission_level as permission_level
FROM public.workflows w
JOIN public.workflow_stages ws ON ws.workflow_id = w.id;

INSERT INTO public.workflow_permissions (workflow_id, stage_id, role, permission_level) 
SELECT 
  w.id as workflow_id,
  ws.id as stage_id,
  'press'::app_role as role,
  CASE WHEN w.team = 'press' THEN 'edit'::permission_level ELSE 'read'::permission_level END as permission_level
FROM public.workflows w
JOIN public.workflow_stages ws ON ws.workflow_id = w.id;

INSERT INTO public.workflow_permissions (workflow_id, stage_id, role, permission_level) 
SELECT 
  w.id as workflow_id,
  ws.id as stage_id,
  'research'::app_role as role,
  CASE WHEN w.team = 'research' THEN 'edit'::permission_level ELSE 'read'::permission_level END as permission_level
FROM public.workflows w
JOIN public.workflow_stages ws ON ws.workflow_id = w.id;

INSERT INTO public.workflow_permissions (workflow_id, stage_id, role, permission_level) 
SELECT 
  w.id as workflow_id,
  ws.id as stage_id,
  'paper'::app_role as role,
  CASE WHEN w.team = 'paper' THEN 'edit'::permission_level ELSE 'read'::permission_level END as permission_level
FROM public.workflows w
JOIN public.workflow_stages ws ON ws.workflow_id = w.id;

INSERT INTO public.workflow_permissions (workflow_id, stage_id, role, permission_level) 
SELECT 
  w.id as workflow_id,
  ws.id as stage_id,
  'client'::app_role as role,
  'masked'::permission_level as permission_level
FROM public.workflows w
JOIN public.workflow_stages ws ON ws.workflow_id = w.id;
