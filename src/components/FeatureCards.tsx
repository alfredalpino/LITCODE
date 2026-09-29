"use client";

import {
  Building2,
  FlaskConical,
  ListChecks,
  PlayCircle,
  Shuffle,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import clsx from "clsx";

export type FeatureCard = {
  id: string;
  title: string;
  subtitle: string;
  tone: "blue" | "amber" | "teal" | "violet";
  icon: "problems" | "judge" | "company" | "lab" | "run" | "refs";
  active?: boolean;
  cta?: string;
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
            <span className="lc-banner__top">
              <span className="lc-banner__icon" aria-hidden>
                <Icon size={18} />
              </span>
              <ArrowUpRight size={14} className="lc-banner__go" aria-hidden />
            </span>
            <strong>{card.title}</strong>
            <span>{card.subtitle}</span>
            {card.cta && <em className="lc-banner__cta">{card.cta}</em>}
          </button>
        );
      })}
    </div>
  );
}
