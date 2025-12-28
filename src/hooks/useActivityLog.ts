import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type ActivityLogRow = Database["public"]["Tables"]["activity_log"]["Row"];

export function useActivityLog(limit = 10) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["activity-log", user?.id, limit],
    queryFn: async (): Promise<ActivityLogRow[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching activity log:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useAllActivityLog(limit = 50) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["all-activity-log", limit],
    queryFn: async (): Promise<ActivityLogRow[]> => {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching all activity log:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
}
