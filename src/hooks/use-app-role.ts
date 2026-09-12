import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { highestRole, type AppRole } from "@/lib/roles";
import { can, type Action, type Resource } from "@/lib/permissions";

/** Role of the signed-in account, or null when no role was granted. */
export function useAppRole() {
  const { data: user } = useQuery({
    queryKey: ["admin-session"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });

  const query = useQuery({
    queryKey: ["my-role", user?.id],
    enabled: !!user?.id,
    queryFn: async (): Promise<AppRole | null> => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user!.id);
      if (error) throw error;
      return highestRole((data ?? []).map((r) => r.role as AppRole));
    },
  });

  const role = query.data ?? null;

  return {
    user,
    role,
    isLoading: !user || query.isLoading,
    can: (resource: Resource, action: Action) => can(role, resource, action),
  };
}

/** Convenience hook for a single page: `const perm = usePermissions("news")`. */
export function usePermissions(resource: Resource) {
  const { role, isLoading, can: check } = useAppRole();
  return {
    role,
    isLoading,
    canView: check(resource, "view"),
    canCreate: check(resource, "create"),
    canUpdate: check(resource, "update"),
    canDelete: check(resource, "delete"),
    canPublish: check(resource, "publish"),
  };
}
