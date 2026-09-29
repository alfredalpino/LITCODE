"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Flame,
  Globe,
  Link2,
  MapPin,
  Share2,
  Star,
} from "lucide-react";
import type { UserProfile } from "@/components/StudioProvider";

interface ProfileViewProps {
  profile: UserProfile;
  onChange: (p: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  solvedDsa: number;
  totalDsa: number;
  solvedLabs: number;
  totalLabs: number;
  streak: number;
  favorites: number;
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
}: ProfileViewProps) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return `https://sde-laboratory-studio.netlify.app/u/${profile.username}`;
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

  return (
    <div className="lc-feed lc-profile">
      <section className="lc-profile__hero">
        <div
          className="lc-profile__avatar"
          style={{
            background: `linear-gradient(145deg, hsl(${profile.avatarHue} 70% 42%), hsl(${(profile.avatarHue + 40) % 360} 65% 28%))`,
          }}
        >
          {profile.displayName.slice(0, 1).toUpperCase()}
        </div>
        <div className="lc-profile__meta">
          <h1>{profile.displayName}</h1>
          <p className="lc-profile__handle">@{profile.username}</p>
          <p className="lc-profile__headline">{profile.headline}</p>
          <div className="lc-profile__chips">
            {profile.location && (
              <span>
                <MapPin size={12} /> {profile.location}
              </span>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noreferrer">
                <Link2 size={12} /> GitHub
              </a>
            )}
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noreferrer">
                <Globe size={12} /> Website
              </a>
            )}
          </div>
        </div>
        <div className="lc-profile__actions">
          <button type="button" className="lc-profile__share" onClick={copyShare}>
            {copied ? <Check size={14} /> : <Share2 size={14} />}
            {copied ? "Copied" : "Share profile"}
          </button>
          <button type="button" className="lc-link" onClick={() => setEditing((v) => !v)}>
            {editing ? "Done" : "Edit profile"}
          </button>
        </div>
      </section>

      <section className="lc-profile__stats">
        <div>
          <strong>{solvedDsa}</strong>
          <span>DSA solved</span>
        </div>
        <div>
          <strong>{solvedLabs}</strong>
          <span>Lab modules</span>
        </div>
        <div>
          <strong>
            <Flame size={14} /> {streak}
          </strong>
          <span>Day streak</span>
        </div>
        <div>
          <strong>
            <Star size={14} /> {favorites}
          </strong>
          <span>Favorites</span>
        </div>
        <div>
          <strong>#{ranking.toLocaleString()}</strong>
          <span>Local rank</span>
        </div>
      </section>

      <section className="lc-card lc-card--wide">
        <h3>About</h3>
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
            <label>
              <span>Bio</span>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => onChange({ ...profile, bio: e.target.value })}
              />
            </label>
            <label>
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
          <p className="lc-muted">{profile.bio || "No bio yet."}</p>
        )}
      </section>

      <section className="lc-card lc-card--wide">
        <h3>Share link</h3>
        <div className="lc-profile__linkrow">
          <Link2 size={14} />
          <code>{shareUrl}</code>
          <button type="button" className="lc-icon-btn" onClick={copyShare} aria-label="Copy">
            <Copy size={14} />
          </button>
        </div>
        <p className="lc-card__hint">
          Progress is stored in this browser. Share the link so others can open the studio —
          your public card shows username and stats.
        </p>
        <p className="lc-card__hint">
          Bank: {totalDsa.toLocaleString()} interview problems · {totalLabs} lab modules
        </p>
      </section>
    </div>
  );
}
