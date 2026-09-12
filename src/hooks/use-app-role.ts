import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { highestRole, type AppRole } from "@/lib/roles";

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

  return {
    user,
    role: query.data ?? null,
    isLoading: !user || query.isLoading,
  };
}
