import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export function useUserRole() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: async (): Promise<UserRole | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user role:", error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
  });
}

export function useUserRoles() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user-roles", user?.id],
    queryFn: async (): Promise<UserRole[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user roles:", error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useIsAdmin() {
  const { data: roles, isLoading } = useUserRoles();
  const isAdmin = roles?.some(r => r.role === "admin") ?? false;
  return { isAdmin, isLoading };
}

export function useIsStaff() {
  const { data: roles, isLoading } = useUserRoles();
  const isStaff = roles?.some(r => ["admin", "press", "research", "paper"].includes(r.role)) ?? false;
  return { isStaff, isLoading };
}

export function useHasRole(role: AppRole) {
  const { data: roles, isLoading } = useUserRoles();
  const hasRole = roles?.some(r => r.role === role) ?? false;
  return { hasRole, isLoading };
}
