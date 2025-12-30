import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type TicketRow = Database["public"]["Tables"]["tickets"]["Row"];
type TicketPriority = Database["public"]["Enums"]["ticket_priority"];
type TicketStatus = Database["public"]["Enums"]["ticket_status"];

export interface Ticket extends TicketRow {
  client_name?: string;
  assigned_to_name?: string;
  workflow_name?: string;
  current_stage_name?: string;
}

export function useTickets() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tickets"],
    queryFn: async (): Promise<Ticket[]> => {
      const { data, error } = await supabase
        .from("tickets")
        .select(`
          *,
          client_profiles!tickets_client_id_fkey(
            id,
            user_id
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tickets:", error);
        throw error;
      }

      // Fetch profile names for clients
      const ticketsWithNames = await Promise.all(
        (data || []).map(async (ticket) => {
          let clientName = "Unknown Client";
          
          if (ticket.client_profiles?.user_id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", ticket.client_profiles.user_id)
              .single();
            clientName = profile?.full_name || clientName;
          }

          let assignedToName = "Unassigned";
          if (ticket.assigned_to) {
            const { data: assigneeProfile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", ticket.assigned_to)
              .single();
            assignedToName = assigneeProfile?.full_name || assignedToName;
          }

          return {
            ...ticket,
            client_name: clientName,
            assigned_to_name: assignedToName,
          };
        })
      );

      return ticketsWithNames;
    },
    enabled: !!user,
  });
}

export function useClientTickets() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["client-tickets", user?.id],
    queryFn: async (): Promise<Ticket[]> => {
      if (!user?.id) return [];

      // First get the client_profile id
      const { data: clientProfile } = await supabase
        .from("client_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!clientProfile) return [];

      const { data, error } = await supabase
        .from("tickets")
        .select("*")
        .eq("client_id", clientProfile.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching client tickets:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useTicketsByTeam(team: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tickets-by-team", team],
    queryFn: async (): Promise<Ticket[]> => {
      const { data, error } = await supabase
        .from("tickets")
        .select(`
          *,
          client_profiles!tickets_client_id_fkey(
            id,
            user_id
          )
        `)
        .eq("assigned_team", team)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tickets by team:", error);
        throw error;
      }

      // Fetch profile names for clients
      const ticketsWithNames = await Promise.all(
        (data || []).map(async (ticket) => {
          let clientName = "Unknown Client";
          
          if (ticket.client_profiles?.user_id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", ticket.client_profiles.user_id)
              .single();
            clientName = profile?.full_name || clientName;
          }

          let assignedToName = "Unassigned";
          if (ticket.assigned_to) {
            const { data: assigneeProfile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", ticket.assigned_to)
              .single();
            assignedToName = assigneeProfile?.full_name || assignedToName;
          }

          return {
            ...ticket,
            client_name: clientName,
            assigned_to_name: assignedToName,
          };
        })
      );

      return ticketsWithNames;
    },
    enabled: !!user,
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<TicketRow>;
    }) => {
      const { data, error } = await supabase
        .from("tickets")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["client-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-by-team"] });
    },
  });
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ticket: {
      client_id: string;
      title: string;
      description?: string;
      assigned_team?: string;
      assigned_to?: string;
      due_date?: string;
      priority?: 'low' | 'medium' | 'high' | 'urgent';
      related_workflow_id?: string;
      current_stage_id?: string;
    }) => {
      const { data, error } = await supabase
        .from("tickets")
        .insert(ticket)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["client-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-by-team"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-by-user-teams"] });
      queryClient.invalidateQueries({ queryKey: ["tickets-by-workflow"] });
    },
  });
}

/**
 * Fetch tickets for all teams the current user has access to
 */
export function useTicketsByUserTeams() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tickets-by-user-teams", user?.id],
    queryFn: async (): Promise<Ticket[]> => {
      if (!user?.id) return [];

      // Get user's roles
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      const roles = userRoles?.map((r) => r.role) || [];
      const isAdmin = roles.includes("admin");
      const staffRoles = roles.filter((r) => r !== "client");

      let query = supabase
        .from("tickets")
        .select(`
          *,
          client_profiles!tickets_client_id_fkey(
            id,
            user_id
          )
        `)
        .order("created_at", { ascending: false });

      // If not admin, filter by teams the user belongs to
      if (!isAdmin && staffRoles.length > 0) {
        query = query.in("assigned_team", staffRoles);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching tickets by user teams:", error);
        throw error;
      }

      // Fetch profile names for clients
      const ticketsWithNames = await Promise.all(
        (data || []).map(async (ticket) => {
          let clientName = "Unknown Client";

          if (ticket.client_profiles?.user_id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", ticket.client_profiles.user_id)
              .single();
            clientName = profile?.full_name || clientName;
          }

          let assignedToName = "Unassigned";
          if (ticket.assigned_to) {
            const { data: assigneeProfile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", ticket.assigned_to)
              .single();
            assignedToName = assigneeProfile?.full_name || assignedToName;
          }

          return {
            ...ticket,
            client_name: clientName,
            assigned_to_name: assignedToName,
          };
        })
      );

      return ticketsWithNames;
    },
    enabled: !!user?.id,
  });
}

export function useTicketById(ticketId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: async (): Promise<Ticket | null> => {
      if (!ticketId) return null;

      const { data, error } = await supabase
        .from("tickets")
        .select(`
          *,
          client_profiles!tickets_client_id_fkey(
            id,
            user_id
          )
        `)
        .eq("id", ticketId)
        .single();

      if (error) {
        console.error("Error fetching ticket:", error);
        throw error;
      }

      if (!data) return null;

      // Fetch client name
      let clientName = "Unknown Client";
      if (data.client_profiles?.user_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", data.client_profiles.user_id)
          .single();
        clientName = profile?.full_name || clientName;
      }

      // Fetch assignee name
      let assignedToName = "Unassigned";
      if (data.assigned_to) {
        const { data: assigneeProfile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", data.assigned_to)
          .single();
        assignedToName = assigneeProfile?.full_name || assignedToName;
      }

      return {
        ...data,
        client_name: clientName,
        assigned_to_name: assignedToName,
      };
    },
    enabled: !!user && !!ticketId,
  });
}

export function useTicketsByWorkflow(workflowId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tickets-by-workflow", workflowId],
    queryFn: async (): Promise<Ticket[]> => {
      if (!workflowId) return [];

      // Directly query tickets by related_workflow_id (now references workflows table)
      const { data, error } = await supabase
        .from("tickets")
        .select(`
          *,
          client_profiles!tickets_client_id_fkey(
            id,
            user_id
          ),
          workflow_stages!tickets_current_stage_id_fkey(
            id,
            name,
            order_index
          )
        `)
        .eq("related_workflow_id", workflowId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tickets by workflow:", error);
        throw error;
      }

      // Fetch profile names and enrich with stage info
      const ticketsWithNames = await Promise.all(
        (data || []).map(async (ticket) => {
          let clientName = "Unknown Client";

          if (ticket.client_profiles?.user_id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", ticket.client_profiles.user_id)
              .single();
            clientName = profile?.full_name || clientName;
          }

          let assignedToName = "Unassigned";
          if (ticket.assigned_to) {
            const { data: assigneeProfile } = await supabase
              .from("profiles")
              .select("full_name")
              .eq("id", ticket.assigned_to)
              .single();
            assignedToName = assigneeProfile?.full_name || assignedToName;
          }

          return {
            ...ticket,
            client_name: clientName,
            assigned_to_name: assignedToName,
            current_stage_name: (ticket.workflow_stages as any)?.name || "Not Started",
          };
        })
      );

      return ticketsWithNames;
    },
    enabled: !!user && !!workflowId,
  });
}

export function useWorkflowStages(workflowId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["workflow-stages", workflowId],
    queryFn: async () => {
      if (!workflowId) return [];

      const { data, error } = await supabase
        .from("workflow_stages")
        .select("*")
        .eq("workflow_id", workflowId)
        .order("order_index");

      if (error) {
        console.error("Error fetching workflow stages:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user && !!workflowId,
  });
}
