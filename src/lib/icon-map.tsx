import {
  Code2,
  Workflow,
  Network,
  Compass,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Award,
  Sprout,
  Building2,
  Users,
  Globe2,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  Code2,
  Workflow,
  Network,
  Compass,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  Award,
  Sprout,
  Building2,
  Users,
  Globe2,
  LineChart,
};

export const ICON_NAMES = Object.keys(ICONS);

export function Icon({ name, className }: { name: string | null; className?: string }) {
  const Cmp = ICONS[name ?? "Sparkles"] ?? Sparkles;
  return <Cmp className={className} />;
}
