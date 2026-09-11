import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/a-propos", label: "À propos" },
  { to: "/services", label: "Services" },
  { to: "/realisations", label: "Réalisations" },
  { to: "/partenaires", label: "Partenaires" },
  { to: "/equipe", label: "Équipe" },
  { to: "/actualites", label: "Actualités" },
] as const;

export function SiteHeader({ settings }: { settings: Record<string, string> }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-2 text-xs">
          <div className="flex flex-wrap items-center gap-6">
            <a href={`tel:${settings["phone_link"] ?? ""}`} className="inline-flex items-center gap-2 hover:text-accent">
              <Phone className="size-3.5" /> {settings["phone"]}
            </a>
            <a href={`mailto:${settings["email"] ?? ""}`} className="inline-flex items-center gap-2 hover:text-accent">
              <Mail className="size-3.5" /> {settings["email"]}
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-3.5" /> {settings["address"]}
            </span>
          </div>
          <span className="opacity-70">
            NIF : {settings["nif"]} · RC : {settings["rc"]}
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo.url} alt="Sceau officiel POLY-SOLUTIONS SPRL" width={48} height={48} className="size-11" />
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold tracking-tight text-primary">
                {settings["company_name"] ?? "POLY-SOLUTIONS"}
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {settings["company_tagline"]}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "text-accent" }}
                className="text-sm font-medium text-foreground/75 transition-colors hover:text-accent"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 sm:inline-block"
            >
              Demander un devis
            </Link>
            <button
              type="button"
              aria-label="Ouvrir le menu"
              onClick={() => setOpen((v) => !v)}
              className="rounded-md border border-border p-2 lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-border bg-background px-6 py-4 lg:hidden">
            <ul className="space-y-3">
              {[...NAV, { to: "/contact", label: "Contact" } as const].map((n) => (
                <li key={n.to}>
                  <Link to={n.to} onClick={() => setOpen(false)} className="block text-sm font-medium text-foreground/80">
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={`tel:${settings["phone_link"] ?? ""}`} className="block text-sm font-semibold text-accent">
                  {settings["phone"]}
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </>
  );
}
