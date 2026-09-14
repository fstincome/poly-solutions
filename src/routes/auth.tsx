import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Connexion — Espace administration POLY-SOLUTIONS" },
      { name: "description", content: "Accès réservé à l'équipe POLY-SOLUTIONS SPRL pour gérer le contenu du site." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Connexion — POLY-SOLUTIONS SPRL" },
      { property: "og:description", content: "Espace d'administration du site POLY-SOLUTIONS SPRL." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/admin", replace: true });
        else setMessage("Compte créé. Vérifiez votre boîte e-mail pour confirmer votre adresse.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (result.error) {
      setError("La connexion Google a échoué.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary px-6 py-16 font-sans">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="POLY-SOLUTIONS SPRL" width={40} height={40} className="size-10" />
          <span className="font-display text-base font-bold text-primary">POLY-SOLUTIONS</span>
        </Link>

        <h1 className="mt-8 font-display text-2xl font-bold">
          {mode === "signin" ? "Connexion à l'espace d'administration" : "Créer un compte administrateur"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cet espace permet de modifier tout le contenu du site.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-medium">
            E-mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block text-sm font-medium">
            Mot de passe
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
            />
          </label>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {message ? <p className="text-sm text-accent">{message}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {busy ? "Veuillez patienter…" : mode === "signin" ? "Se connecter" : "Créer le compte"}
          </button>
        </form>

        <button
          type="button"
          onClick={google}
          className="mt-3 w-full rounded-full border border-input px-6 py-3 text-sm font-semibold hover:bg-accent/10"
        >
          Continuer avec Google
        </button>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-sm text-muted-foreground hover:text-accent"
        >
          {mode === "signin" ? "Pas encore de compte ? Créer un compte" : "J'ai déjà un compte — me connecter"}
        </button>

        <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-accent">
          ← Retour au site
        </Link>
      </div>
    </div>
  );
}
