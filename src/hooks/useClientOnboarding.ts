import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type ClientProfileRow = Database["public"]["Tables"]["client_profiles"]["Row"];
type WorkflowRow = Database["public"]["Tables"]["workflows"]["Row"];
type WorkflowStageRow = Database["public"]["Tables"]["workflow_stages"]["Row"];

interface WorkflowWithStages extends WorkflowRow {
  stages: WorkflowStageRow[];
}

export function useClientOnboardingStatus() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["client-onboarding-status", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("client_profiles")
        .select("id, onboarding_completed, onboarding_step")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching onboarding status:", error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
  });
}

export function useCreateClientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      essentials,
    }: {
      userId: string;
      essentials?: {
        current_title?: string;
        current_employer?: string;
        years_experience?: number;
        field_of_expertise?: string;
        niche?: string;
      };
    }) => {
      const { data, error } = await supabase
        .from("client_profiles")
        .insert({
          user_id: userId,
          onboarding_step: 1,
          onboarding_completed: false,
          ...essentials,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-profile"] });
      queryClient.invalidateQueries({ queryKey: ["client-onboarding-status"] });
    },
  });
}

export function useUpdateClientOnboarding() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (updates: Partial<ClientProfileRow>) => {
      if (!user?.id) throw new Error("No user");

      const { data, error } = await supabase
        .from("client_profiles")
        .update(updates)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-profile"] });
      queryClient.invalidateQueries({ queryKey: ["client-onboarding-status"] });
    },
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      essentials,
      selectedFields,
    }: {
      essentials: {
        fullName: string;
        jobTitle: string;
        yearsExperience: number;
        niche?: string;
      };
      selectedFields: string[];
    }) => {
      if (!user?.id) throw new Error("No user");

      // Update profile with name
      await supabase
        .from("profiles")
        .update({ full_name: essentials.fullName })
        .eq("id", user.id);

      // Get or create client profile
      let { data: clientProfile } = await supabase
        .from("client_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!clientProfile) {
        const { data: newProfile, error: createError } = await supabase
          .from("client_profiles")
          .insert({
            user_id: user.id,
            current_title: essentials.jobTitle,
            years_experience: essentials.yearsExperience,
            field_of_expertise: selectedFields.join(", "),
            niche: essentials.niche || null,
            onboarding_completed: true,
            onboarding_step: 5,
            status: "active",
          })
          .select()
          .single();

        if (createError) throw createError;
        clientProfile = newProfile;
      } else {
        // Update existing client profile
        const { error: updateError } = await supabase
          .from("client_profiles")
          .update({
            current_title: essentials.jobTitle,
            years_experience: essentials.yearsExperience,
            field_of_expertise: selectedFields.join(", "),
            niche: essentials.niche || null,
            onboarding_completed: true,
            onboarding_step: 5,
            status: "active",
          })
          .eq("id", clientProfile.id);

        if (updateError) throw updateError;
      }

      // Get all active workflows
      const { data: workflows, error: workflowError } = await supabase
        .from("workflows")
        .select(`
          *,
          workflow_stages(*)
        `)
        .eq("is_active", true);

      if (workflowError) throw workflowError;

      // Create client_workflows for each workflow
      if (workflows && workflows.length > 0) {
        for (const workflow of workflows) {
          const stages = workflow.workflow_stages || [];
          const firstStage = stages.sort((a: WorkflowStageRow, b: WorkflowStageRow) => 
            a.order_index - b.order_index
          )[0];

          const { data: clientWorkflow, error: cwError } = await supabase
            .from("client_workflows")
            .insert({
              client_id: clientProfile.id,
              workflow_id: workflow.id,
              current_stage_id: firstStage?.id || null,
              status: "pending",
              started_at: new Date().toISOString(),
            })
            .select()
            .single();

          if (cwError) {
            console.error("Error creating client workflow:", cwError);
            continue;
          }

          // Create a ticket for this workflow
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 14); // 2 weeks from now

          const { error: ticketError } = await supabase
            .from("tickets")
            .insert({
              client_id: clientProfile.id,
              title: `${workflow.name} - Initial Setup`,
              description: `Complete the ${workflow.name} workflow to strengthen your EB1 case.`,
              assigned_team: workflow.team,
              related_workflow_id: clientWorkflow.id,
              priority: "medium",
              status: "open",
              due_date: dueDate.toISOString(),
            });

          if (ticketError) {
            console.error("Error creating ticket:", ticketError);
          }
        }
      }

      // Assign client role if not already assigned
      const { data: existingRole } = await supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", user.id)
        .eq("role", "client")
        .maybeSingle();

      if (!existingRole) {
        await supabase
          .from("user_roles")
          .insert({ user_id: user.id, role: "client" });
      }

      return clientProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-profile"] });
      queryClient.invalidateQueries({ queryKey: ["client-onboarding-status"] });
      queryClient.invalidateQueries({ queryKey: ["client-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}
