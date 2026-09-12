import type { AppRole } from "@/lib/roles";

export type Resource = "settings" | "content" | "news" | "messages" | "users";
export type Action = "view" | "create" | "update" | "delete" | "publish";

export const RESOURCE_LABELS: Record<Resource, string> = {
  settings: "Textes du site",
  content: "Services, équipe, partenaires",
  news: "Actualités",
  messages: "Messages reçus",
  users: "Comptes et rôles",
};

export const ACTION_LABELS: Record<Action, string> = {
  view: "Consulter",
  create: "Ajouter",
  update: "Modifier",
  delete: "Supprimer",
  publish: "Publier",
};

export const ACTIONS: Action[] = ["view", "create", "update", "delete", "publish"];

/** Actions that make sense for each page; drives the matrix shown in the admin area. */
export const RESOURCE_ACTIONS: Record<Resource, Action[]> = {
  settings: ["view", "update"],
  content: ["view", "create", "update", "delete"],
  news: ["view", "create", "update", "delete", "publish"],
  messages: ["view", "update", "delete"],
  users: ["view", "create", "update", "delete"],
};

type Matrix = Record<AppRole, Record<Resource, Action[]>>;

/** Single source of truth: what each role may do on each page. */
export const PERMISSIONS: Matrix = {
  admin: {
    settings: ["view", "update"],
    content: ["view", "create", "update", "delete"],
    news: ["view", "create", "update", "delete", "publish"],
    messages: ["view", "update", "delete"],
    users: ["view", "create", "update", "delete"],
  },
  editor: {
    settings: ["view", "update"],
    content: ["view", "create", "update", "delete"],
    news: ["view", "create", "update", "delete", "publish"],
    messages: ["view", "update"],
    users: [],
  },
  user: {
    settings: ["view"],
    content: ["view"],
    news: ["view"],
    messages: ["view"],
    users: [],
  },
};

export function can(role: AppRole | null, resource: Resource, action: Action): boolean {
  if (!role) return false;
  return PERMISSIONS[role][resource].includes(action);
}

export type AdminPage = {
  to: string;
  label: string;
  resource: Resource;
  description: string;
  exact?: boolean;
};

export const ADMIN_PAGES: AdminPage[] = [
  {
    to: "/admin/parametres",
    label: "Textes du site",
    resource: "settings",
    description: "Coordonnées, accroche d'accueil, textes de présentation, chiffres clés et mentions légales.",
  },
  {
    to: "/admin/contenus",
    label: "Services, équipe, partenaires",
    resource: "content",
    description: "Services, valeurs, réalisations, résultats, partenaires et membres de l'équipe.",
  },
  {
    to: "/admin/actualites",
    label: "Actualités",
    resource: "news",
    description: "Rédigez, publiez ou retirez des articles d'actualité.",
  },
  {
    to: "/admin/messages",
    label: "Messages reçus",
    resource: "messages",
    description: "Consultez les demandes envoyées via le formulaire de contact.",
  },
  {
    to: "/admin/administrateurs",
    label: "Comptes et rôles",
    resource: "users",
    description: "Créez des comptes et attribuez le rôle Administrateur, Gestionnaire ou Lecteur.",
  },
];
