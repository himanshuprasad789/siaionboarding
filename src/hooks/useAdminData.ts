import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ClientProfileRow = Database["public"]["Tables"]["client_profiles"]["Row"];
type UserRoleRow = Database["public"]["Tables"]["user_roles"]["Row"];
type TeamRow = Database["public"]["Tables"]["teams"]["Row"];
type WorkflowRow = Database["public"]["Tables"]["workflows"]["Row"];

export interface ClientWithDetails extends ClientProfileRow {
  profile: ProfileRow | null;
  team: TeamRow | null;
  activeWorkflows: WorkflowRow[];
}

export interface StaffMemberWithDetails extends ProfileRow {
  roles: UserRoleRow[];
  team: TeamRow | null;
  workflowAccess: WorkflowRow[];
}

export function useClientsWithDetails() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["clients-with-details"],
    queryFn: async (): Promise<ClientWithDetails[]> => {
      // Fetch client profiles with their user profiles
      const { data: clientProfiles, error } = await supabase
        .from("client_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching client profiles:", error);
        throw error;
      }

      // Fetch related data for each client
      const clientsWithDetails = await Promise.all(
        (clientProfiles || []).map(async (client) => {
          // Get user profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", client.user_id)
            .single();

          // Get assigned team
          let team: TeamRow | null = null;
          if (client.assigned_team_id) {
            const { data: teamData } = await supabase
              .from("teams")
              .select("*")
              .eq("id", client.assigned_team_id)
              .single();
            team = teamData;
          }

          // Get active workflows for this client
          const { data: clientWorkflows } = await supabase
            .from("client_workflows")
            .select("workflow_id")
            .eq("client_id", client.id);

          const workflowIds = (clientWorkflows || []).map((cw) => cw.workflow_id);
          let activeWorkflows: WorkflowRow[] = [];
          if (workflowIds.length > 0) {
            const { data: workflowData } = await supabase
              .from("workflows")
              .select("*")
              .in("id", workflowIds);
            activeWorkflows = workflowData || [];
          }

          return {
            ...client,
            profile,
            team,
            activeWorkflows,
          };
        })
      );

      return clientsWithDetails;
    },
    enabled: !!user,
  });
}

export function useStaffMembers() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["staff-members"],
    queryFn: async (): Promise<StaffMemberWithDetails[]> => {
      // Get all users with staff roles
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("*")
        .in("role", ["admin", "press", "research", "paper"]);

      if (rolesError) {
        console.error("Error fetching user roles:", rolesError);
        throw rolesError;
      }

      // Get unique user IDs
      const userIds = [...new Set((userRoles || []).map((r) => r.user_id))];

      if (userIds.length === 0) return [];

      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        throw profilesError;
      }

      // Fetch teams and workflow access
      const staffWithDetails = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Get roles for this user
          const roles = (userRoles || []).filter((r) => r.user_id === profile.id);

          // Get team
          let team: TeamRow | null = null;
          if (profile.team_id) {
            const { data: teamData } = await supabase
              .from("teams")
              .select("*")
              .eq("id", profile.team_id)
              .single();
            team = teamData;
          }

          // Get workflow access via team
          let workflowAccess: WorkflowRow[] = [];
          if (profile.team_id) {
            const { data: accessData } = await supabase
              .from("team_workflow_access")
              .select("workflow_id")
              .eq("team_id", profile.team_id);

            const workflowIds = (accessData || []).map((a) => a.workflow_id);
            if (workflowIds.length > 0) {
              const { data: workflowData } = await supabase
                .from("workflows")
                .select("*")
                .in("id", workflowIds);
              workflowAccess = workflowData || [];
            }
          }

          return {
            ...profile,
            roles,
            team,
            workflowAccess,
          };
        })
      );

      return staffWithDetails;
    },
    enabled: !!user,
  });
}

export function useAdminStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // Get team count
      const { count: teamsCount } = await supabase
        .from("teams")
        .select("*", { count: "exact", head: true });

      // Get active workflows count
      const { count: workflowsCount } = await supabase
        .from("workflows")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      // Get published opportunities count
      const { count: opportunitiesCount } = await supabase
        .from("opportunities")
        .select("*", { count: "exact", head: true })
        .eq("status", "published");

      // Get permission rules count
      const { count: permissionsCount } = await supabase
        .from("workflow_permissions")
        .select("*", { count: "exact", head: true });

      return {
        teams: teamsCount || 0,
        workflows: workflowsCount || 0,
        opportunities: opportunitiesCount || 0,
        permissions: permissionsCount || 0,
      };
    },
    enabled: !!user,
  });
}

export function useRecentActivity() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching activity log:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
}
