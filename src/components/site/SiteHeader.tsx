import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, Phone, Mail, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import logo from "@/assets/logo.png";

type NavLink = { to: string; label: string };
type NavItem = { label: string; to?: string; children?: NavLink[] };

const NAV: NavItem[] = [
  { to: "/", label: "Accueil" },
  {
    label: "L'entreprise",
    children: [
      { to: "/a-propos", label: "À propos" },
      { to: "/equipe", label: "Équipe" },
      { to: "/partenaires", label: "Partenaires" },
    ],
  },
  {
    label: "Expertise",
    children: [
      { to: "/services", label: "Services" },
      { to: "/realisations", label: "Réalisations" },
    ],
  },
  { to: "/actualites", label: "Actualités" },
];

const ALL_LINKS: NavLink[] = NAV.flatMap((n) =>
  n.children ? n.children : n.to ? [{ to: n.to, label: n.label }] : [],
);

export function SiteHeader({ settings }: { settings: Record<string, string> }) {
  const [open, setOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setOpen(false);
    setOpenMenu(null);
    setOpenMobileGroup(null);
  }, [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

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
            <img src={logo} alt="Sceau officiel POLY-SOLUTIONS SPRL" width={48} height={48} className="size-11" />
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold tracking-tight text-primary">
                {settings["company_name"] ?? "POLY-SOLUTIONS"}
              </span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {settings["company_tagline"]}
              </span>
            </span>
          </Link>

          <div ref={navRef} className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => {
              if (!item.children) {
                return (
                  <Link
                    key={item.to}
                    to={item.to!}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{
                      className: "text-accent after:scale-x-100",
                      "aria-current": "page",
                    }}
                    className="relative pb-1 text-sm font-medium text-foreground/75 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-accent after:transition-transform hover:text-accent"
                  >
                    {item.label}
                  </Link>
                );
              }
              const isOpen = openMenu === item.label;
              const isActive = item.children.some((c) => pathname.startsWith(c.to));
              return (
                <div key={item.label} className="relative">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenMenu(isOpen ? null : item.label)}
                    className={`relative inline-flex items-center gap-1.5 pb-1 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-accent after:transition-transform hover:text-accent ${
                      isActive || isOpen ? "text-accent" : "text-foreground/75"
                    } ${isActive ? "after:scale-x-100" : "after:scale-x-0"}`}
                  >
                    {item.label}
                    {isOpen ? (
                      <ChevronUp className="size-4 transition-transform" />
                    ) : (
                      <ChevronDown className="size-4 transition-transform" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="absolute left-0 top-full z-50 mt-3 min-w-52 rounded-xl border border-border bg-background p-2 shadow-lg">
                      {item.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          onClick={() => setOpenMenu(null)}
                          activeProps={{ className: "bg-secondary text-accent", "aria-current": "page" }}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-accent"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 sm:inline-block"
            >
              Demander un devis
            </Link>
            <button
              type="button"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="rounded-md border border-border p-2 lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-border bg-background px-6 py-4 lg:hidden">
            <ul className="space-y-2">
              {NAV.map((item) => {
                if (!item.children) {
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to!}
                        onClick={() => setOpen(false)}
                        activeOptions={{ exact: item.to === "/" }}
                        activeProps={{
                          className: "border-accent bg-secondary font-semibold text-accent",
                          "aria-current": "page",
                        }}
                        className="block border-l-2 border-transparent py-1.5 pl-3 text-sm font-medium text-foreground/80"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const isOpen = openMobileGroup === item.label;
                const isActive = item.children.some((c) => pathname.startsWith(c.to));
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenMobileGroup(isOpen ? null : item.label)}
                      className={`flex w-full items-center justify-between py-1.5 text-sm font-semibold ${
                        isActive ? "text-accent" : "text-foreground/80"
                      }`}
                    >
                      {item.label}
                      {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                    </button>
                    {isOpen && (
                      <ul className="mt-1 space-y-2 border-l border-border pl-4">
                        {item.children.map((c) => (
                          <li key={c.to}>
                            <Link
                              to={c.to}
                              onClick={() => setOpen(false)}
                              activeProps={{ className: "font-semibold text-accent", "aria-current": "page" }}
                              className="block text-sm text-foreground/75"
                            >
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
              <li>
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "border-accent bg-secondary font-semibold text-accent", "aria-current": "page" }}
                  className="block border-l-2 border-transparent py-1.5 pl-3 text-sm font-medium text-foreground/80"
                >
                  Contact
                </Link>
              </li>
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

export { ALL_LINKS };
