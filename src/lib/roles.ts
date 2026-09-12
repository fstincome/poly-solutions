import type { Database } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export const ROLE_LABELS: Record<AppRole, string> = {
  admin: "Administrateur",
  editor: "Gestionnaire",
  user: "Lecteur",
};

export const ROLE_DESCRIPTIONS: Record<AppRole, string> = {
  admin: "Accès complet : contenu, messages, suppression et gestion des comptes.",
  editor: "Peut modifier le contenu du site et traiter les messages, sans gérer les comptes.",
  user: "Consultation seule : peut tout voir sans rien modifier.",
};

export const ROLE_ORDER: AppRole[] = ["admin", "editor", "user"];

/** Highest privilege wins when a person holds several roles. */
export function highestRole(roles: AppRole[]): AppRole | null {
  for (const r of ROLE_ORDER) if (roles.includes(r)) return r;
  return null;
}

export const canEditContent = (role: AppRole | null) => role === "admin" || role === "editor";
export const canDelete = (role: AppRole | null) => role === "admin";
export const canManageUsers = (role: AppRole | null) => role === "admin";
