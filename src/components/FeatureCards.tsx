import { Building2, FlaskConical, ListChecks, PlayCircle, Shuffle, BookOpen } from "lucide-react";
import clsx from "clsx";

export type FeatureCard = {
  id: string;
  title: string;
  subtitle: string;
  tone: "blue" | "amber" | "teal" | "violet";
  icon: "problems" | "judge" | "company" | "lab" | "run" | "refs";
  active?: boolean;
  onClick: () => void;
};

const ICONS = {
  problems: ListChecks,
  judge: PlayCircle,
  company: Building2,
  lab: BookOpen,
  run: FlaskConical,
  refs: Shuffle,
};

interface FeatureCardsProps {
  cards: FeatureCard[];
}

export function FeatureCards({ cards }: FeatureCardsProps) {
  return (
    <div className="lc-banners" role="list">
      {cards.map((card) => {
        const Icon = ICONS[card.icon];
        return (
          <button
            key={card.id}
            type="button"
            role="listitem"
            className={clsx(
              "lc-banner",
              `lc-banner--${card.tone}`,
              card.active && "is-active"
            )}
            onClick={card.onClick}
          >
            <span className="lc-banner__icon" aria-hidden>
              <Icon size={18} />
            </span>
            <strong>{card.title}</strong>
            <span>{card.subtitle}</span>
          </button>
        );
      })}
    </div>
  );
}
