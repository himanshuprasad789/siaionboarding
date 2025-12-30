import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface WorkflowUser {
  id: string;
  full_name: string;
}

export function useWorkflowUsers(workflowId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["workflow-users", workflowId],
    queryFn: async (): Promise<WorkflowUser[]> => {
      if (!workflowId) return [];

      // Get teams that have access to this workflow
      const { data: teamAccess, error: teamError } = await supabase
        .from("team_workflow_access")
        .select("team_id")
        .eq("workflow_id", workflowId);

      if (teamError) {
        console.error("Error fetching team access:", teamError);
        throw teamError;
      }

      if (!teamAccess || teamAccess.length === 0) return [];

      const teamIds = teamAccess.map((ta) => ta.team_id);

      // Get profiles of users in these teams
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, team_id")
        .in("team_id", teamIds)
        .order("full_name");

      if (profileError) {
        console.error("Error fetching profiles:", profileError);
        throw profileError;
      }

      return (profiles || []).map((p) => ({
        id: p.id,
        full_name: p.full_name || "Unknown User",
      }));
    },
    enabled: !!user && !!workflowId,
  });
}
