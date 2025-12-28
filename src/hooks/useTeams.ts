import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type TeamRow = Database["public"]["Tables"]["teams"]["Row"];
type WorkflowRow = Database["public"]["Tables"]["workflows"]["Row"];

export interface TeamWithWorkflows extends TeamRow {
  workflowAccess: WorkflowRow[];
}

export function useTeams() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["teams"],
    queryFn: async (): Promise<TeamWithWorkflows[]> => {
      const { data: teams, error } = await supabase
        .from("teams")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching teams:", error);
        throw error;
      }

      // Fetch workflow access for each team
      const teamsWithWorkflows = await Promise.all(
        (teams || []).map(async (team) => {
          const { data: accessData } = await supabase
            .from("team_workflow_access")
            .select("workflow_id")
            .eq("team_id", team.id);

          const workflowIds = (accessData || []).map((a) => a.workflow_id);

          let workflows: WorkflowRow[] = [];
          if (workflowIds.length > 0) {
            const { data: workflowData } = await supabase
              .from("workflows")
              .select("*")
              .in("id", workflowIds);
            workflows = workflowData || [];
          }

          return {
            ...team,
            workflowAccess: workflows,
          };
        })
      );

      return teamsWithWorkflows;
    },
    enabled: !!user,
  });
}
