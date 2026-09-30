"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Flame,
  Globe,
  Link2,
  MapPin,
  Pencil,
  Share2,
  Star,
} from "lucide-react";
import type { UserProfile } from "@/components/StudioProvider";
import { ProgressNextSteps } from "@/components/ProgressNextSteps";
import { SITE_URL } from "@/lib/site";

interface ProfileViewProps {
  profile: UserProfile;
  onChange: (p: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  solvedDsa: number;
  totalDsa: number;
  solvedLabs: number;
  totalLabs: number;
  streak: number;
  favorites: number;
  progress?: Record<string, boolean>;
  dsaSolvedMap?: Record<string, boolean>;
  onOpenModule?: (labId: string, moduleId: string) => void;
  onOpenChallenge?: (challengeId: string) => void;
  onOpenProgress?: () => void;
}

export function ProfileView({
  profile,
  onChange,
  solvedDsa,
  totalDsa,
  solvedLabs,
  totalLabs,
  streak,
  favorites,
  progress = {},
  dsaSolvedMap = {},
  onOpenModule,
  onOpenChallenge,
  onOpenProgress,
}: ProfileViewProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return `${SITE_URL}/profile?u=${encodeURIComponent(profile.username)}`;
    }
    return `${window.location.origin}/profile?u=${encodeURIComponent(profile.username)}`;
  }, [profile.username]);

  const ranking = useMemo(() => {
    const score = solvedDsa * 10 + solvedLabs * 25 + streak * 5;
    return Math.max(1, 50000 - score);
  }, [solvedDsa, solvedLabs, streak]);

  async function copyShare() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  const stats = [
    { label: "DSA solved", value: String(solvedDsa) },
    { label: "Lab modules", value: String(solvedLabs) },
    {
      label: "Day streak",
      value: String(streak),
      icon: <Flame size={14} aria-hidden />,
    },
    {
      label: "Favorites",
      value: String(favorites),
      icon: <Star size={14} aria-hidden />,
    },
    { label: "Local rank", value: `#${ranking.toLocaleString()}` },
  ];

  return (
    <div className="lc-feed lc-profile">
      <header className="lc-profile__hero">
        <div
          className="lc-profile__avatar"
          style={{
            background: `linear-gradient(145deg, hsl(${profile.avatarHue} 65% 40%), hsl(${(profile.avatarHue + 36) % 360} 55% 26%))`,
          }}
          aria-hidden
        >
          {profile.displayName.slice(0, 1).toUpperCase()}
        </div>

        <div className="lc-profile__identity">
          <p className="lc-profile__eyebrow">Profile</p>
          <h1>{profile.displayName}</h1>
          <p className="lc-profile__handle">@{profile.username}</p>
          {profile.headline ? (
            <p className="lc-profile__headline">{profile.headline}</p>
          ) : null}
          <div className="lc-profile__chips">
            {profile.location ? (
              <span>
                <MapPin size={12} /> {profile.location}
              </span>
            ) : null}
            {profile.github ? (
              <a href={profile.github} target="_blank" rel="noreferrer">
                <Link2 size={12} /> GitHub
              </a>
            ) : null}
            {profile.website ? (
              <a href={profile.website} target="_blank" rel="noreferrer">
                <Globe size={12} /> Website
              </a>
            ) : null}
          </div>
        </div>

        <div className="lc-profile__actions">
          <button type="button" className="lc-profile__share" onClick={copyShare}>
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            {copied ? "Copied" : "Share"}
          </button>
          <button
            type="button"
            className="lc-profile__edit"
            onClick={() => setEditing((v) => !v)}
          >
            <Pencil size={14} />
            {editing ? "Done" : "Edit"}
          </button>
        </div>
      </header>

      <ul className="lc-profile__stats" aria-label="Local progress stats">
        {stats.map((s) => (
          <li key={s.label}>
            <strong>
              {s.icon}
              {s.value}
            </strong>
            <span>{s.label}</span>
          </li>
        ))}
      </ul>

      <section className="lc-profile__panel">
        <h2>About</h2>
        {editing ? (
          <div className="lc-profile__form">
            {(
              [
                ["displayName", "Display name"],
                ["username", "Username"],
                ["headline", "Headline"],
                ["location", "Location"],
                ["github", "GitHub URL"],
                ["website", "Website"],
              ] as const
            ).map(([key, label]) => (
              <label key={key}>
                <span>{label}</span>
                <input
                  value={profile[key]}
                  onChange={(e) => onChange({ ...profile, [key]: e.target.value })}
                />
              </label>
            ))}
            <label className="lc-profile__form-full">
              <span>Bio</span>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => onChange({ ...profile, bio: e.target.value })}
              />
            </label>
            <label className="lc-profile__form-full">
              <span>Avatar hue</span>
              <input
                type="range"
                min={0}
                max={360}
                value={profile.avatarHue}
                onChange={(e) =>
                  onChange({ ...profile, avatarHue: Number(e.target.value) })
                }
              />
            </label>
          </div>
        ) : (
          <p className="lc-profile__bio">
            {profile.bio || "No bio yet — hit Edit to introduce yourself."}
          </p>
        )}
      </section>

      <ProgressNextSteps
        progress={progress}
        dsaSolved={dsaSolvedMap}
        onOpenModule={onOpenModule}
        onOpenChallenge={onOpenChallenge}
      />

      {onOpenProgress ? (
        <section className="lc-profile__panel">
          <h2>Skill evidence</h2>
          <p className="lc-muted">
            Known / learning / weak / mastered buckets live on Progress — local events
            plus the skill graph across labs and judged challenges.
          </p>
          <button type="button" className="lc-profile__cta" onClick={onOpenProgress}>
            Open Progress
          </button>
        </section>
      ) : null}

      <section className="lc-profile__panel">
        <h2>Share link</h2>
        <div className="lc-profile__linkrow">
          <Link2 size={14} />
          <code>{shareUrl}</code>
          <button type="button" className="lc-icon-btn" onClick={copyShare} aria-label="Copy">
            <Copy size={14} />
          </button>
        </div>
        <p className="lc-card__hint">
          Progress stays in this browser. Sharing opens the studio; your card shows
          username and local stats.
        </p>
        <p className="lc-card__hint">
          Bank: {totalDsa.toLocaleString()} indexed titles · {totalLabs} lab modules
          (Ready vs scaffold badges are honest).
        </p>
      </section>
    </div>
  );
}
