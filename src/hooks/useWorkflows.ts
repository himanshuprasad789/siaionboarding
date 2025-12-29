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

/**
 * Fetch workflows accessible to the current user based on:
 * 1. team_workflow_access table (if user has a team_id)
 * 2. OR workflows matching user's roles
 */
export function useAccessibleWorkflows() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["accessible-workflows", user?.id],
    queryFn: async (): Promise<WorkflowWithStages[]> => {
      if (!user?.id) return [];

      // First, get the user's profile to find their team_id
      const { data: profile } = await supabase
        .from("profiles")
        .select("team_id")
        .eq("id", user.id)
        .single();

      // Get user's roles
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const roles = userRoles?.map((r) => r.role) || [];
      const isAdmin = roles.includes("admin");

      let workflowIds: string[] = [];

      // If admin, get all active workflows
      if (isAdmin) {
        const { data: allWorkflows } = await supabase
          .from("workflows")
          .select("id")
          .eq("is_active", true);
        workflowIds = allWorkflows?.map((w) => w.id) || [];
      } else {
        // Get workflows from team_workflow_access if user has a team
        if (profile?.team_id) {
          const { data: teamAccess } = await supabase
            .from("team_workflow_access")
            .select("workflow_id")
            .eq("team_id", profile.team_id);
          
          if (teamAccess && teamAccess.length > 0) {
            workflowIds = teamAccess.map((a) => a.workflow_id);
          }
        }

        // Also include workflows that match user's roles (team field matches role)
        const staffRoles = roles.filter((r) => r !== "client");
        if (staffRoles.length > 0) {
          const { data: roleWorkflows } = await supabase
            .from("workflows")
            .select("id")
            .in("team", staffRoles)
            .eq("is_active", true);
          
          if (roleWorkflows) {
            const roleWorkflowIds = roleWorkflows.map((w) => w.id);
            workflowIds = [...new Set([...workflowIds, ...roleWorkflowIds])];
          }
        }
      }

      if (workflowIds.length === 0) return [];

      // Fetch full workflow data with stages
      const { data: workflows, error } = await supabase
        .from("workflows")
        .select("*")
        .in("id", workflowIds)
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error("Error fetching accessible workflows:", error);
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
    enabled: !!user?.id,
  });
}

export function useWorkflowById(workflowId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: async (): Promise<WorkflowWithStages | null> => {
      if (!workflowId) return null;

      const { data: workflow, error } = await supabase
        .from("workflows")
        .select("*")
        .eq("id", workflowId)
        .single();

      if (error) {
        console.error("Error fetching workflow:", error);
        throw error;
      }

      if (!workflow) return null;

      const { data: stages } = await supabase
        .from("workflow_stages")
        .select("*")
        .eq("workflow_id", workflowId)
        .order("order_index");

      return {
        ...workflow,
        stages: stages || [],
      };
    },
    enabled: !!user && !!workflowId,
  });
}
