import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";

export function SiteFooter({ settings }: { settings: Record<string, string> }) {
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">{settings["company_legal"]}</p>
          <p className="mt-3 text-sm leading-relaxed text-primary-foreground/75">{settings["footer_note"]}</p>
          <p className="mt-4 text-xs text-primary-foreground/60">
            NIF : {settings["nif"]} · RC : {settings["rc"]}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Navigation</p>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            {[
              { to: "/a-propos", label: "À propos" },
              { to: "/services", label: "Services" },
              { to: "/realisations", label: "Réalisations" },
              { to: "/partenaires", label: "Partenaires" },
              { to: "/equipe", label: "Équipe" },
              { to: "/actualites", label: "Actualités" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" /> {settings["address"]}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <a href={`tel:${settings["phone_link"] ?? ""}`} className="hover:text-accent">
                {settings["phone"]}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              <a href={`mailto:${settings["email"] ?? ""}`} className="hover:text-accent">
                {settings["email"]}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-primary-foreground/60">
          <span>
            © {new Date().getFullYear()} {settings["company_legal"]}. Tous droits réservés.
          </span>
          <Link to="/admin" className="hover:text-accent">
            Espace administration
          </Link>
        </div>
      </div>
    </footer>
  );
}
