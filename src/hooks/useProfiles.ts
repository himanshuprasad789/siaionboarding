import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ClientProfileRow = Database["public"]["Tables"]["client_profiles"]["Row"];

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async (): Promise<ProfileRow | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
  });
}

export function useClientProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["client-profile", user?.id],
    queryFn: async (): Promise<ClientProfileRow | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("client_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching client profile:", error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
  });
}

export function useAllProfiles() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["all-profiles"],
    queryFn: async (): Promise<ProfileRow[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name");

      if (error) {
        console.error("Error fetching all profiles:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
}

export function useAllClientProfiles() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["all-client-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_profiles")
        .select(`
          *,
          profiles:user_id(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching all client profiles:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
}

export function useStaffProfiles() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["staff-profiles"],
    queryFn: async () => {
      // Get all user_roles for staff
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("role", ["admin", "press", "research", "paper"]);

      if (roleError) {
        console.error("Error fetching staff roles:", roleError);
        throw roleError;
      }

      if (!roleData || roleData.length === 0) return [];

      // Get profiles for those users
      const userIds = roleData.map(r => r.user_id);
      const { data: profiles, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .in("id", userIds);

      if (profileError) {
        console.error("Error fetching staff profiles:", profileError);
        throw profileError;
      }

      // Combine profiles with roles
      return (profiles || []).map(profile => {
        const userRole = roleData.find(r => r.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || "client",
        };
      });
    },
    enabled: !!user,
  });
}
