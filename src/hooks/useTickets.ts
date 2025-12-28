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
    },
  });
}
