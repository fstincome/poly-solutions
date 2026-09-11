import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

const CARDS = [
  {
    to: "/admin/parametres",
    title: "Textes du site",
    desc: "Coordonnées, accroche d'accueil, textes de présentation, chiffres clés et mentions légales.",
  },
  {
    to: "/admin/contenus",
    title: "Services, équipe, partenaires",
    desc: "Ajoutez, modifiez ou supprimez vos services, valeurs, réalisations, résultats, partenaires et membres de l'équipe.",
  },
  { to: "/admin/actualites", title: "Actualités", desc: "Rédigez et publiez des articles d'actualité." },
  { to: "/admin/messages", title: "Messages reçus", desc: "Consultez les demandes envoyées via le formulaire de contact." },
] as const;

function AdminHome() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Bienvenue dans l'espace d'administration</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tout le contenu affiché sur le site public se modifie depuis cet espace. Les changements sont visibles
        immédiatement.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
          >
            <h2 className="font-display text-lg font-semibold">{c.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
