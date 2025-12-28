import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-seed-secret",
};

interface UserData {
  email: string;
  password: string;
  full_name: string;
  role?: 'admin' | 'press' | 'research' | 'paper';
  team_id?: string;
  is_client?: boolean;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Simple secret check for seed operations
  const authHeader = req.headers.get("x-seed-secret");
  if (authHeader !== "seed-admin-secret-2024") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { users } = await req.json() as { users: UserData[] };
    const results: { email: string; success: boolean; error?: string; userId?: string }[] = [];

    for (const userData of users) {
      try {
        // Create auth user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: { full_name: userData.full_name },
        });

        if (authError) {
          results.push({ email: userData.email, success: false, error: authError.message });
          continue;
        }

        const userId = authData.user.id;

        // Update profile with team_id if provided
        if (userData.team_id) {
          await supabaseAdmin
            .from("profiles")
            .update({ team_id: userData.team_id, full_name: userData.full_name })
            .eq("id", userId);
        }

        // Assign role if staff
        if (userData.role) {
          await supabaseAdmin
            .from("user_roles")
            .insert({ user_id: userId, role: userData.role });
        }

        // Create client profile if client
        if (userData.is_client) {
          const clientStatuses = ['active', 'onboarding', 'active', 'active', 'paused'];
          const expertiseAreas = ['AI/ML', 'Biotechnology', 'Finance', 'Healthcare', 'Engineering', 'Data Science', 'Physics', 'Chemistry'];
          const niches = ['Deep Learning', 'CRISPR', 'Quantitative Trading', 'Medical Devices', 'Robotics', 'NLP', 'Quantum Computing', 'Materials Science'];
          const titles = ['Research Scientist', 'Senior Engineer', 'Principal Investigator', 'Director', 'Lead Researcher', 'Staff Scientist'];
          const employers = ['MIT', 'Stanford', 'Google', 'Meta', 'OpenAI', 'DeepMind', 'Genentech', 'Tesla', 'SpaceX', 'Apple'];
          const teamIds = ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333'];

          const randomStatus = clientStatuses[Math.floor(Math.random() * clientStatuses.length)];
          const randomExpertise = expertiseAreas[Math.floor(Math.random() * expertiseAreas.length)];
          const randomNiche = niches[Math.floor(Math.random() * niches.length)];
          const randomTitle = titles[Math.floor(Math.random() * titles.length)];
          const randomEmployer = employers[Math.floor(Math.random() * employers.length)];
          const randomTeam = teamIds[Math.floor(Math.random() * teamIds.length)];
          const randomYears = Math.floor(Math.random() * 15) + 3;

          await supabaseAdmin.from("client_profiles").insert({
            user_id: userId,
            status: randomStatus,
            field_of_expertise: randomExpertise,
            niche: randomNiche,
            current_title: randomTitle,
            current_employer: randomEmployer,
            years_experience: randomYears,
            onboarding_completed: randomStatus === 'active',
            assigned_team_id: randomTeam,
          });

          // Add client role
          await supabaseAdmin
            .from("user_roles")
            .insert({ user_id: userId, role: 'client' });
        }

        results.push({ email: userData.email, success: true, userId });
      } catch (err) {
        results.push({ email: userData.email, success: false, error: String(err) });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});