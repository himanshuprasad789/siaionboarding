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

      // First get client_workflows for this workflow
      const { data: clientWorkflows } = await supabase
        .from("client_workflows")
        .select("id")
        .eq("workflow_id", workflowId);

      if (!clientWorkflows || clientWorkflows.length === 0) return [];

      const clientWorkflowIds = clientWorkflows.map((cw) => cw.id);

      const { data, error } = await supabase
        .from("tickets")
        .select(`
          *,
          client_profiles!tickets_client_id_fkey(
            id,
            user_id
          )
        `)
        .in("related_workflow_id", clientWorkflowIds)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tickets by workflow:", error);
        throw error;
      }

      // Fetch profile names
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
    enabled: !!user && !!workflowId,
  });
}
