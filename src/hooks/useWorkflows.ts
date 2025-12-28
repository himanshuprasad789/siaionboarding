import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type WorkflowRow = Database["public"]["Tables"]["workflows"]["Row"];
type WorkflowStageRow = Database["public"]["Tables"]["workflow_stages"]["Row"];
type WorkflowPermissionRow = Database["public"]["Tables"]["workflow_permissions"]["Row"];

export interface WorkflowWithStages extends WorkflowRow {
  stages: WorkflowStageRow[];
}

export function useWorkflows() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["workflows"],
    queryFn: async (): Promise<WorkflowWithStages[]> => {
      const { data: workflows, error } = await supabase
        .from("workflows")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("Error fetching workflows:", error);
        throw error;
      }

      // Fetch stages for each workflow
      const workflowsWithStages = await Promise.all(
        (workflows || []).map(async (workflow) => {
          const { data: stages } = await supabase
            .from("workflow_stages")
            .select("*")
            .eq("workflow_id", workflow.id)
            .order("order_index");

          return {
            ...workflow,
            stages: stages || [],
          };
        })
      );

      return workflowsWithStages;
    },
    enabled: !!user,
  });
}

export function useWorkflowsByTeam(team: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["workflows-by-team", team],
    queryFn: async (): Promise<WorkflowWithStages[]> => {
      const { data: workflows, error } = await supabase
        .from("workflows")
        .select("*")
        .eq("team", team)
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("Error fetching workflows by team:", error);
        throw error;
      }

      // Fetch stages for each workflow
      const workflowsWithStages = await Promise.all(
        (workflows || []).map(async (workflow) => {
          const { data: stages } = await supabase
            .from("workflow_stages")
            .select("*")
            .eq("workflow_id", workflow.id)
            .order("order_index");

          return {
            ...workflow,
            stages: stages || [],
          };
        })
      );

      return workflowsWithStages;
    },
    enabled: !!user,
  });
}

export function useWorkflowPermissions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["workflow-permissions"],
    queryFn: async (): Promise<WorkflowPermissionRow[]> => {
      const { data, error } = await supabase
        .from("workflow_permissions")
        .select("*");

      if (error) {
        console.error("Error fetching workflow permissions:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
}

export function useClientWorkflows() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["client-workflows", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Get client profile
      const { data: clientProfile } = await supabase
        .from("client_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!clientProfile) return [];

      const { data, error } = await supabase
        .from("client_workflows")
        .select(`
          *,
          workflows(*),
          workflow_stages(*)
        `)
        .eq("client_id", clientProfile.id);

      if (error) {
        console.error("Error fetching client workflows:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
}
