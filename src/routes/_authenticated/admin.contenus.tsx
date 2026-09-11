import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { CollectionEditor, type Field } from "@/components/admin/CollectionEditor";

export const Route = createFileRoute("/_authenticated/admin/contenus")({
  component: ContentPage,
});

type Collection = {
  id: string;
  tab: string;
  table: string;
  title: string;
  description: string;
  fields: Field[];
  defaults: Record<string, unknown>;
};

const COLLECTIONS: Collection[] = [
  {
    id: "services",
    tab: "Services",
    table: "services",
    title: "Services",
    description: "Les quatre domaines d'expertise affichés sur la page Services et l'accueil.",
    fields: [
      { name: "title", label: "Titre", type: "text" },
      { name: "icon", label: "Icône", type: "icon" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "points", label: "Points clés (un par ligne)", type: "list" },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
      { name: "is_published", label: "Publié", type: "boolean" },
    ],
    defaults: { title: "Nouveau service", icon: "Code2", description: "", points: [] },
  },
  {
    id: "values",
    tab: "Valeurs",
    table: "core_values",
    title: "Valeurs fondamentales",
    description: "Affichées sur la page À propos.",
    fields: [
      { name: "title", label: "Titre", type: "text" },
      { name: "icon", label: "Icône", type: "icon" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
    ],
    defaults: { title: "Nouvelle valeur", icon: "Sparkles", description: "" },
  },
  {
    id: "projects",
    tab: "Réalisations",
    table: "projects",
    title: "Réalisations et produits phares",
    description: "Projets présentés sur la page Réalisations.",
    fields: [
      { name: "tag", label: "Étiquette (période ou catégorie)", type: "text" },
      { name: "title", label: "Titre", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "points", label: "Points clés (un par ligne)", type: "list" },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
    ],
    defaults: { tag: "Projet", title: "Nouvelle réalisation", description: "", points: [] },
  },
  {
    id: "achievements",
    tab: "Résultats",
    table: "achievements",
    title: "Résultats obtenus",
    description: "Liste des résultats affichée en bas de la page Réalisations.",
    fields: [
      { name: "label", label: "Résultat", type: "textarea" },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
    ],
    defaults: { label: "Nouveau résultat" },
  },
  {
    id: "partners",
    tab: "Partenaires",
    table: "partners",
    title: "Partenaires",
    description: "Institutions de microfinance et partenaires internationaux.",
    fields: [
      { name: "name", label: "Nom", type: "text" },
      { name: "category", label: "Catégorie", type: "text" },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
    ],
    defaults: { name: "Nouveau partenaire", category: "IMF" },
  },
  {
    id: "team",
    tab: "Équipe",
    table: "team_members",
    title: "Équipe et pôles d'expertise",
    description: "Catégorie « direction » pour les personnes, « pole » pour les pôles d'expertise.",
    fields: [
      { name: "name", label: "Nom", type: "text" },
      { name: "role", label: "Fonction", type: "text" },
      { name: "email", label: "E-mail", type: "text" },
      { name: "category", label: "Catégorie (direction ou pole)", type: "text" },
      { name: "icon", label: "Icône", type: "icon" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sort_order", label: "Ordre d'affichage", type: "number" },
    ],
    defaults: { name: "Nouveau membre", role: "", category: "direction", icon: "Building2", description: "" },
  },
];

function ContentPage() {
  const [active, setActive] = useState(COLLECTIONS[0]!.id);
  const current = COLLECTIONS.find((c) => c.id === active)!;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Contenus du site</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {COLLECTIONS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              c.id === active ? "bg-primary text-primary-foreground" : "border border-border text-foreground/75"
            }`}
          >
            {c.tab}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <CollectionEditor
          key={current.id}
          table={current.table}
          title={current.title}
          description={current.description}
          fields={current.fields}
          defaults={current.defaults}
        />
      </div>
    </div>
  );
}
