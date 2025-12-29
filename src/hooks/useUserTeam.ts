import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface UserTeam {
  id: string;
  name: string;
  description: string | null;
}

export function useUserTeam() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-team", user?.id],
    queryFn: async (): Promise<UserTeam | null> => {
      if (!user?.id) return null;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select(`
          team_id,
          teams (
            id,
            name,
            description
          )
        `)
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user team:", error);
        return null;
      }

      if (!profile?.teams) return null;

      // Handle the teams response
      const team = profile.teams as unknown as UserTeam;
      return team;
    },
    enabled: !!user?.id,
  });
}

export function useUserTeams() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-teams", user?.id],
    queryFn: async (): Promise<string[]> => {
      if (!user?.id) return [];

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("team_id")
        .eq("id", user.id)
        .single();

      if (error || !profile?.team_id) {
        console.error("Error fetching user teams:", error);
        return [];
      }

      // Return the team_id as a string array (for now, users belong to one team)
      return [profile.team_id];
    },
    enabled: !!user?.id,
  });
}
