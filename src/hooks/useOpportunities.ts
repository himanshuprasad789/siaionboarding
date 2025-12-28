import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type OpportunityRow = Database["public"]["Tables"]["opportunities"]["Row"];
type OpportunityInsert = Database["public"]["Tables"]["opportunities"]["Insert"];
type OpportunityUpdate = Database["public"]["Tables"]["opportunities"]["Update"];

export function useOpportunities() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["opportunities"],
    queryFn: async (): Promise<OpportunityRow[]> => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching opportunities:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
}

export function usePublishedOpportunities() {
  return useQuery({
    queryKey: ["published-opportunities"],
    queryFn: async (): Promise<OpportunityRow[]> => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching published opportunities:", error);
        throw error;
      }

      return data || [];
    },
  });
}

export function useCreateOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (opportunity: OpportunityInsert) => {
      const { data, error } = await supabase
        .from("opportunities")
        .insert(opportunity)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["published-opportunities"] });
    },
  });
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: OpportunityUpdate;
    }) => {
      const { data, error } = await supabase
        .from("opportunities")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["published-opportunities"] });
    },
  });
}

export function useDeleteOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("opportunities")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
      queryClient.invalidateQueries({ queryKey: ["published-opportunities"] });
    },
  });
}

export function useClientOpportunities() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["client-opportunities", user?.id],
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
        .from("client_opportunities")
        .select(`
          *,
          opportunities(*)
        `)
        .eq("client_id", clientProfile.id);

      if (error) {
        console.error("Error fetching client opportunities:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
}
