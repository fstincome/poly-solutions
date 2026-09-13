import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from "lucide-react";

import { siteContentQuery } from "@/lib/site-queries";
import { sendContactMessage } from "@/lib/site-data";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/_site/contact")({
  loader: ({ context }) => context.queryClient.ensureQueryData(siteContentQuery),
  head: () => ({
    meta: [
      { title: "Contact & demande de démonstration — POLY-SOLUTIONS SPRL" },
      {
        name: "description",
        content:
          "Contactez POLY-SOLUTIONS SPRL à Bujumbura : demande de devis, démonstration de l'outil A-CAT ou prise de rendez-vous.",
      },
      { property: "og:title", content: "Contact — POLY-SOLUTIONS SPRL" },
      { property: "og:description", content: "Demandez une démonstration ou un devis, réponse sous 48 heures." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const TYPES = ["Demande de démonstration", "Demande de devis", "Prise de rendez-vous", "Information générale"];

function ContactPage() {
  const { data } = useSuspenseQuery(siteContentQuery);
  const s = data.settings;

  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await sendContactMessage({
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        organization: String(fd.get("organization") ?? ""),
        request_type: String(fd.get("request_type") ?? TYPES[0]),
        message: String(fd.get("message") ?? ""),
      });
      setSent(true);
    } catch {
      setError("L'envoi a échoué. Merci de réessayer ou de nous écrire directement par e-mail.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHero eyebrow="Contact" title={s["contact_title"] ?? "Contact"} intro={s["contact_intro"]} />

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-5 text-sm">
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
            <MapPin className="mt-0.5 size-5 text-accent" />
            <div>
              <p className="font-semibold">Siège social</p>
              <p className="mt-1 text-muted-foreground">{s["address"]}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
            <Phone className="mt-0.5 size-5 text-accent" />
            <div>
              <p className="font-semibold">Téléphone</p>
              <a href={`tel:${s["phone_link"] ?? ""}`} className="mt-1 block text-muted-foreground hover:text-accent">
                {s["phone"]}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
            <Mail className="mt-0.5 size-5 text-accent" />
            <div>
              <p className="font-semibold">E-mail</p>
              <a href={`mailto:${s["email"] ?? ""}`} className="mt-1 block text-muted-foreground hover:text-accent">
                {s["email"]}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
            <Clock className="mt-0.5 size-5 text-accent" />
            <div>
              <p className="font-semibold">Horaires</p>
              <p className="mt-1 text-muted-foreground">{s["hours"]}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {s["company_legal"]} — NIF : {s["nif"]} · RC : {s["rc"]}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8">
          {sent ? (
            <div className="flex flex-col items-start gap-3">
              <CheckCircle2 className="size-10 text-accent" />
              <h2 className="font-display text-xl font-semibold">Merci, votre demande est bien enregistrée.</h2>
              <p className="text-sm text-muted-foreground">Notre équipe vous répond sous 48 heures ouvrables.</p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-2 text-sm font-semibold text-accent hover:underline"
              >
                Envoyer une autre demande
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Nom et prénom *
                <input name="name" required className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm" />
              </label>
              <label className="text-sm font-medium">
                E-mail *
                <input name="email" type="email" required className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm" />
              </label>
              <label className="text-sm font-medium">
                Téléphone
                <input name="phone" className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm" />
              </label>
              <label className="text-sm font-medium">
                Organisation
                <input name="organization" className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm" />
              </label>
              <label className="text-sm font-medium sm:col-span-2">
                Type de demande
                <select name="request_type" className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm">
                  {TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium sm:col-span-2">
                Votre message *
                <textarea name="message" required rows={5} className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm" />
              </label>
              {error ? <p className="text-sm text-destructive sm:col-span-2">{error}</p> : null}
              <button
                type="submit"
                disabled={busy}
                className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60 sm:col-span-2 sm:justify-self-start"
              >
                {busy ? "Envoi…" : "Envoyer la demande"}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
