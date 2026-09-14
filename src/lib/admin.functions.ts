import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/lib/roles";

export type TeamAccount = {
  id: string;
  userId: string;
  role: AppRole;
  email: string;
  createdAt: string;
};

async function callAdmin<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("admin-users", { body });
  if (error) {
    // Surface the function's own error message when available.
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === "function") {
      try {
        const payload = await ctx.json();
        if (payload?.error) throw new Error(payload.error);
      } catch (e) {
        if (e instanceof Error && e.message) throw e;
      }
    }
    throw new Error(error.message);
  }
  if (data && (data as { error?: string }).error) throw new Error((data as { error: string }).error);
  return data as T;
}

export function claimFirstAdmin() {
  return callAdmin<{ ok: true }>({ action: "claim_first_admin" });
}

export async function listTeamAccounts(): Promise<TeamAccount[]> {
  const res = await callAdmin<{ accounts: TeamAccount[] }>({ action: "list" });
  return res.accounts ?? [];
}

export function setUserRole(input: { email: string; password?: string; role: string }) {
  return callAdmin<{ ok: true; email: string; role: string }>({
    action: "set_role",
    email: input.email,
    password: input.password ?? "",
    role: input.role,
  });
}

export function revokeUserAccess(input: { userId: string }) {
  return callAdmin<{ ok: true }>({ action: "revoke", userId: input.userId });
}
