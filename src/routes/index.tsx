import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Code2,
  Workflow,
  Network,
  Compass,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Award,
  ArrowRight,
  CheckCircle2,
  Sprout,
  Building2,
} from "lucide-react";

import logo from "@/assets/logo.png.asset.json";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "POLY-SOLUTIONS SPRL — Transformation numérique au Burundi" },
      {
        name: "description",
        content:
          "POLY-SOLUTIONS SPRL, Bujumbura : logiciels sur mesure, digitalisation des processus, FinTech et outil A-CAT pour le financement agricole.",
      },
      { property: "og:title", content: "POLY-SOLUTIONS SPRL — Transformation numérique au Burundi" },
      {
        property: "og:description",
        content:
          "Développement de logiciels sur mesure, digitalisation des processus et solutions FinTech pour les entreprises et institutions au Burundi.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "POLY-SOLUTIONS SPRL",
          email: "info@poly-solutions.bi",
          telephone: "+25761004075",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Avenue de l'Innovation, N° 5",
            addressLocality: "Bujumbura",
            addressCountry: "BI",
          },
        }),
      },
    ],
  }),
});

const NAV = [
  { href: "#apropos", label: "À propos" },
  { href: "#services", label: "Services" },
  { href: "#realisations", label: "Réalisations" },
  { href: "#partenaires", label: "Partenaires" },
  { href: "#equipe", label: "Équipe" },
  { href: "#contact", label: "Contact" },
];

const SERVICES = [
  {
    icon: Code2,
    title: "Développement de logiciels sur mesure",
    desc: "Applications web et mobiles conçues autour de vos métiers : plateformes de gestion, portails clients, applications terrain fonctionnant en zones à faible connectivité.",
    points: ["Applications Web & Mobile", "Plateformes métier", "Maintenance et support utilisateurs"],
  },
  {
    icon: Workflow,
    title: "Digitalisation & solutions FinTech",
    desc: "Dématérialisation des processus d'affaires et outils financiers digitaux pour les institutions de microfinance, coopératives et entreprises.",
    points: ["Analyse et scoring de crédit", "Workflows d'approbation", "Tableaux de bord de pilotage"],
  },
  {
    icon: Network,
    title: "Intégration de systèmes & architecture",
    desc: "Interconnexion de vos systèmes existants, migration de données et conception d'architectures fiables, sécurisées et évolutives.",
    points: ["API et interopérabilité", "Migration de données", "Sécurité et sauvegardes"],
  },
  {
    icon: Compass,
    title: "Conseil stratégique et consulting IT",
    desc: "Accompagnement des directions dans la définition et la conduite de leur feuille de route numérique, du diagnostic à l'appropriation par les équipes.",
    points: ["Diagnostic et feuille de route", "Formation des utilisateurs", "Conduite du changement"],
  },
];

const VALEURS = [
  { icon: Sparkles, title: "Innovation", desc: "Des solutions adaptées aux réalités locales, pensées pour le terrain burundais." },
  { icon: Award, title: "Excellence", desc: "Une exigence de qualité et de rigueur à chaque étape de nos projets." },
  { icon: ShieldCheck, title: "Intégrité", desc: "Transparence, confidentialité et respect des engagements pris." },
  { icon: HeartHandshake, title: "Responsabilité sociale", desc: "Un impact concret pour les petits producteurs et les communautés rurales." },
];

const REALISATIONS = [
  {
    tag: "Produit phare",
    title: "Outil A-CAT digitalisé",
    desc: "L'Outil d'Analyse des Crédits Agricoles, digitalisé et déployé auprès des institutions de microfinance : analyse structurée des activités agricoles, des besoins de financement et de la capacité de remboursement.",
    points: [
      "Analyse des demandes plus rapide",
      "Structuration des données des exploitations",
      "Appui à la décision des agents de crédit",
    ],
  },
  {
    tag: "2017 – 2019",
    title: "Projet MAVC — ICCO Coopération",
    desc: "Nos agronomes, sous l'appellation « Agri-Champions », ont accompagné les producteurs, identifié les contraintes des exploitations et appuyé les acteurs des chaînes de valeur.",
    points: ["Accompagnement des producteurs", "Appui aux chaînes de valeur", "Approches adaptées au secteur agricole"],
  },
  {
    tag: "2022 – 2026",
    title: "Projet PADFIR — Cordaid Burundi-RDC",
    desc: "Sous l'appellation « Agro-Routeurs », l'équipe a professionnalisé le financement agricole et rapproché les institutions de microfinance des producteurs.",
    points: [
      "Prototypes de produits financiers par filière",
      "Renforcement des capacités des agents de crédit",
      "Sensibilisation de nouveaux bénéficiaires",
    ],
  },
  {
    tag: "Approche",
    title: "Financement « rayonnante » & assurance agricole",
    desc: "Un système organisant les petits producteurs autour d'un multiplicateur de semences, complété par l'intégration de l'assurance agricole en collaboration avec Inkinzo Assurance.",
    points: ["Organisation des petits producteurs", "Calendriers de financement adaptés", "Assurance agricole avec Inkinzo"],
  },
];

const RESULTATS = [
  "Augmentation du portefeuille de clients et de crédits des IMF partenaires",
  "Amélioration de la qualité et de la rapidité de l'analyse des crédits agricoles",
  "Meilleure présence et visibilité des IMF dans les zones rurales",
  "Mise en place de manuels de gestion des crédits agricoles",
  "Appropriation progressive de l'outil digital par les agents et cadres",
  "Premières expériences d'assurance agricole liée au financement",
];

const PARTENAIRES = [
  "CECM",
  "UCODE",
  "ISHAKA",
  "Hauge Family Microfinance",
  "DIFO",
  "CORILAC",
  "CDEC",
  "RECECA INKINGI",
  "MECI",
  "TUJANE",
  "WISE",
  "TWITEZIMBERE MF",
  "Cordaid",
  "ICCO Coopération",
];

const DIRECTION = [
  { nom: "Prof. Dr Emmanuel MIKEREGO", role: "Directeur Général", mail: "emmanuel.mikerego@poly-solutions.bi" },
  { nom: "Prof. Jérémie NDIKUMAGENGE", role: "Chef de projet", mail: null },
  { nom: "Msc-Ir Didace NDAYISHIMIYE", role: "Développeur Full Stack", mail: null },
  { nom: "Msc-Ir Vercus NTIRANDEKURA", role: "Analyste Développeur", mail: null },
];

const POLES = [
  {
    icon: Building2,
    title: "Économistes",
    desc: "Analyse économique et financière des activités, analyse des besoins de financement, gestion des crédits agricoles et accompagnement des institutions de microfinance.",
  },
  {
    icon: Sprout,
    title: "Agronomes",
    desc: "Identification des filières, étude des cycles de production, accompagnement des producteurs sur le terrain et suivi de l'utilisation des crédits agricoles.",
  },
  {
    icon: Code2,
    title: "Informaticiens",
    desc: "Développement et digitalisation des outils d'analyse, déploiement de l'A-CAT, maintenance des solutions et appui aux utilisateurs.",
  },
];

function Index() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Barre de contact */}
      <div className="hidden bg-primary text-primary-foreground md:block">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-2 text-xs">
          <div className="flex flex-wrap items-center gap-6">
            <a href="tel:+25761004075" className="inline-flex items-center gap-2 hover:text-accent">
              <Phone className="size-3.5" /> +257 61 00 40 75
            </a>
            <a href="mailto:info@poly-solutions.bi" className="inline-flex items-center gap-2 hover:text-accent">
              <Mail className="size-3.5" /> info@poly-solutions.bi
            </a>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-3.5" /> Avenue de l'Innovation N° 5, Bujumbura
            </span>
          </div>
          <span className="opacity-70">NIF : 4002537647 · RC : 0053273/24</span>
        </div>
      </div>

      {/* En-tête */}
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <a href="#accueil" className="flex items-center gap-3">
            <img src={logo.url} alt="Sceau officiel POLY-SOLUTIONS SPRL" width={48} height={48} className="size-11" />
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold tracking-tight text-primary">POLY-SOLUTIONS</span>
              <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                SPRL · Bujumbura
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-sm font-medium text-foreground/75 transition-colors hover:text-accent"
              >
                {n.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 sm:inline-block"
            >
              Demander un devis
            </a>
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
              {NAV.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="block text-sm font-medium text-foreground/80"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="tel:+25761004075" className="block text-sm font-semibold text-accent">
                  +257 61 00 40 75
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      <main id="accueil">
        {/* Hero */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
          <img
            src={heroImg}
            alt="Ingénieurs de POLY-SOLUTIONS au travail à Bujumbura"
            width={1600}
            height={1008}
            className="absolute inset-0 size-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklab,var(--accent)_35%,transparent),transparent_60%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.15fr_0.85fr] lg:py-32">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]">
                Ingénierie logicielle · Burundi
              </span>
              <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                La transformation numérique des entreprises et institutions burundaises
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
                POLY-SOLUTIONS SPRL conçoit des logiciels sur mesure et digitalise les processus d'affaires. De la
                microfinance rurale aux institutions publiques, nous transformons les méthodes de travail en outils
                numériques fiables et appropriés par leurs utilisateurs.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
                >
                  Demander une démonstration <ArrowRight className="size-4" />
                </a>
                <a
                  href="#realisations"
                  className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
                >
                  Voir nos réalisations
                </a>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 self-end">
              {[
                { k: "12+", v: "IMF partenaires accompagnées" },
                { k: "2017", v: "Première mission de terrain" },
                { k: "A-CAT", v: "Outil digital déployé" },
                { k: "4", v: "Pôles d'expertise" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5">
                  <dt className="font-display text-3xl font-bold text-accent">{s.k}</dt>
                  <dd className="mt-1 text-sm text-primary-foreground/75">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* À propos */}
        <section id="apropos" className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Présentation</p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Une société burundaise à la croisée du numérique et du terrain
              </h2>
              <p className="mt-6 leading-relaxed text-muted-foreground">
                POLY-SOLUTIONS est une société privée à responsabilité limitée (SPRL) de droit burundais, dont le siège
                social est établi Avenue de l'Innovation N° 5 à Bujumbura. Née de la rencontre entre informaticiens,
                économistes et agronomes, elle met la technologie au service de secteurs longtemps restés à l'écart de
                la digitalisation.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Depuis 2017, nos équipes interviennent auprès des institutions de microfinance, des organisations
                internationales et des producteurs agricoles. Cette expérience de terrain nourrit chacun de nos
                développements logiciels : des outils réellement utilisés, parce que conçus avec ceux qui les utilisent.
              </p>
              <div className="mt-8 rounded-2xl border border-border bg-secondary p-6 text-sm">
                <p className="font-semibold text-primary">Identification légale</p>
                <ul className="mt-3 space-y-1.5 text-muted-foreground">
                  <li>Statut juridique : SPRL de droit burundais</li>
                  <li>NIF : 4002537647 — RC : 0053273/24</li>
                  <li>Siège : Avenue de l'Innovation N° 5, Bujumbura, Burundi</li>
                </ul>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {VALEURS.map((v) => (
                <div key={v.title} className="rounded-2xl border border-border bg-card p-7 transition-shadow hover:shadow-lg">
                  <v.icon className="size-7 text-accent" />
                  <h3 className="mt-5 font-display text-lg font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="bg-secondary py-24">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Pôle d'expertise</p>
            <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Quatre domaines pour couvrir tout le cycle de votre projet numérique
            </h2>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {SERVICES.map((s, i) => (
                <article key={s.title} className="rounded-3xl border border-border bg-card p-8">
                  <div className="flex items-start justify-between">
                    <s.icon className="size-8 text-accent" />
                    <span className="font-display text-4xl font-bold text-border">0{i + 1}</span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <ul className="mt-5 space-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-foreground/80">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {POLES.map((p) => (
                <div key={p.title} className="rounded-2xl border border-border bg-background p-7">
                  <p.icon className="size-6 text-accent" />
                  <h3 className="mt-4 font-display text-base font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Réalisations */}
        <section id="realisations" className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Réalisations & produits phares</p>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Des solutions testées, adoptées et utilisées sur le terrain
          </h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {REALISATIONS.map((r) => (
              <article key={r.title} className="rounded-3xl border border-border bg-card p-8">
                <span className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  {r.tag}
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold">{r.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
                <ul className="mt-5 space-y-2">
                  {r.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-3xl bg-primary p-10 text-primary-foreground">
            <h3 className="font-display text-2xl font-bold">Résultats atteints</h3>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {RESULTATS.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-sm text-primary-foreground/85">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Partenaires */}
        <section id="partenaires" className="bg-secondary py-24">
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Partenaires & réseau IMF</p>
            <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Un réseau de collaboration avec les institutions de microfinance
            </h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">
              Nos interventions s'appuient sur une collaboration continue avec les institutions de microfinance
              burundaises et les organisations internationales qui accompagnent le financement agricole.
            </p>
            <ul className="mt-10 flex flex-wrap gap-3">
              {PARTENAIRES.map((p) => (
                <li
                  key={p}
                  className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground/80"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Équipe */}
        <section id="equipe" className="mx-auto max-w-7xl px-6 py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Équipe</p>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Direction et experts techniques
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DIRECTION.map((m) => (
              <article key={m.nom} className="rounded-2xl border border-border bg-card p-7">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary font-display text-base font-bold text-primary-foreground">
                  {m.nom
                    .split(" ")
                    .slice(-2)
                    .map((w) => w[0])
                    .join("")}
                </div>
                <h3 className="mt-5 font-display text-base font-semibold leading-snug">{m.nom}</h3>
                <p className="mt-1 text-sm text-accent">{m.role}</p>
                {m.mail && (
                  <a href={`mailto:${m.mail}`} className="mt-3 block break-all text-xs text-muted-foreground hover:text-accent">
                    {m.mail}
                  </a>
                )}
              </article>
            ))}
          </div>

          <p className="mt-8 max-w-3xl leading-relaxed text-muted-foreground">
            Autour de la direction, une équipe pluridisciplinaire d'économistes spécialisés en microfinance, d'agronomes
            expérimentés dans l'accompagnement des producteurs et d'informaticiens dédiés au développement et à la
            maintenance des solutions digitales.
          </p>
        </section>

        {/* Contact */}
        <section id="contact" className="bg-primary py-24 text-primary-foreground">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Contact</p>
              <h2 className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Parlons de votre projet de digitalisation
              </h2>
              <p className="mt-5 leading-relaxed text-primary-foreground/80">
                Demandez une démonstration de l'outil A-CAT ou prenez rendez-vous avec notre équipe pour étudier vos
                besoins.
              </p>

              <ul className="mt-9 space-y-5 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-accent" />
                  <span>Avenue de l'Innovation, N° 5<br />Bujumbura, Burundi</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-accent" />
                  <span>
                    <a href="tel:+25761004075" className="block hover:text-accent">+257 61 00 40 75</a>
                    <a href="tel:+25769898947" className="block hover:text-accent">+257 69 89 89 47</a>
                    <a href="tel:+25761556467" className="block hover:text-accent">+257 61 55 64 67</a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 size-5 shrink-0 text-accent" />
                  <a href="mailto:info@poly-solutions.bi" className="hover:text-accent">info@poly-solutions.bi</a>
                </li>
              </ul>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="rounded-3xl bg-background p-8 text-foreground"
            >
              <h3 className="font-display text-xl font-semibold">Demande de démonstration / devis</h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Nom complet
                  <input
                    required
                    name="nom"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="text-sm font-medium">
                  Organisation
                  <input
                    name="organisation"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="text-sm font-medium">
                  Email
                  <input
                    required
                    type="email"
                    name="email"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="text-sm font-medium">
                  Téléphone
                  <input
                    name="telephone"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </label>
                <label className="text-sm font-medium sm:col-span-2">
                  Objet de la demande
                  <select
                    name="objet"
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  >
                    <option>Démonstration de l'outil A-CAT</option>
                    <option>Développement de logiciel sur mesure</option>
                    <option>Digitalisation des processus / FinTech</option>
                    <option>Intégration de systèmes</option>
                    <option>Conseil stratégique IT</option>
                  </select>
                </label>
                <label className="text-sm font-medium sm:col-span-2">
                  Message
                  <textarea
                    required
                    name="message"
                    rows={4}
                    className="mt-1.5 w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                Envoyer la demande <ArrowRight className="size-4" />
              </button>
              {sent && (
                <p className="mt-4 text-sm text-accent">
                  Merci, votre demande est enregistrée. Notre équipe vous recontacte sous 48 heures ouvrables.
                </p>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl border-t border-primary-foreground/15 px-6 py-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={logo.url} alt="Logo POLY-SOLUTIONS" width={40} height={40} loading="lazy" className="size-10" />
              <span className="font-display text-base font-bold">POLY-SOLUTIONS SPRL</span>
            </div>
            <p className="text-xs text-primary-foreground/65">
              NIF : 4002537647 · RC : 0053273/24 · Siège social : Avenue de l'Innovation N° 5, Bujumbura, Burundi
            </p>
          </div>
          <p className="mt-6 text-xs text-primary-foreground/55">
            © {new Date().getFullYear()} POLY-SOLUTIONS SPRL. Tous droits réservés. Société privée à responsabilité
            limitée de droit burundais. Les contenus, marques et documents présentés sur ce site sont la propriété de
            POLY-SOLUTIONS SPRL.
          </p>
        </div>
      </footer>
    </div>
  );
}
