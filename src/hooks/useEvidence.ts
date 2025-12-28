import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type EvidenceRow = Database["public"]["Tables"]["evidence_items"]["Row"];
type EvidenceInsert = Database["public"]["Tables"]["evidence_items"]["Insert"];
type EvidenceUpdate = Database["public"]["Tables"]["evidence_items"]["Update"];

export function useEvidence() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["evidence", user?.id],
    queryFn: async (): Promise<EvidenceRow[]> => {
      if (!user?.id) return [];

      // Get client profile
      const { data: clientProfile } = await supabase
        .from("client_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!clientProfile) return [];

      const { data, error } = await supabase
        .from("evidence_items")
        .select("*")
        .eq("client_id", clientProfile.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching evidence:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useAllEvidence() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["all-evidence"],
    queryFn: async (): Promise<EvidenceRow[]> => {
      const { data, error } = await supabase
        .from("evidence_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching all evidence:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
}

export function useCreateEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (evidence: EvidenceInsert) => {
      const { data, error } = await supabase
        .from("evidence_items")
        .insert(evidence)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence"] });
      queryClient.invalidateQueries({ queryKey: ["all-evidence"] });
    },
  });
}

export function useUpdateEvidence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: EvidenceUpdate;
    }) => {
      const { data, error } = await supabase
        .from("evidence_items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["evidence"] });
      queryClient.invalidateQueries({ queryKey: ["all-evidence"] });
    },
  });
}
