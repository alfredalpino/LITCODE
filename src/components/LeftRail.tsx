import {
  BookMarked,
  Compass,
  Library,
  ListChecks,
  Star,
} from "lucide-react";
import clsx from "clsx";

export type RailTab = "library" | "explore" | "study" | "lists";

interface LeftRailProps {
  active: RailTab;
  onChange: (tab: RailTab) => void;
  collapsed?: boolean;
}

const ITEMS: Array<{ id: RailTab; label: string; icon: typeof Library }> = [
  { id: "library", label: "Library", icon: Library },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "study", label: "Study Plan", icon: BookMarked },
  { id: "lists", label: "My Lists", icon: Star },
];

export function LeftRail({ active, onChange, collapsed }: LeftRailProps) {
  return (
    <aside className={clsx("lc-rail", collapsed && "is-collapsed")} aria-label="Workspace">
      <div className="lc-rail__items">
        {ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={clsx("lc-rail__btn", active === id && "is-active")}
            onClick={() => onChange(id)}
            title={label}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <div className="lc-rail__lists">
        <p className="lc-rail__lists-label">
          <ListChecks size={14} /> Lists
        </p>
        <button type="button" className="lc-rail__list-item is-active">
          <Star size={13} />
          Favorites
        </button>
      </div>
    </aside>
  );
}
