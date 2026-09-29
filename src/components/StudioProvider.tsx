"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { NavSection, NotifItem } from "@/components/AppNav";
import type { RailTab } from "@/components/LeftRail";
import { loadCatalog } from "@/lib/content";
import { loadCompanyPacks, loadDsaIndex } from "@/lib/dsa/loader";
import type { CompanyPacksFile, DsaIndexItem } from "@/lib/dsa/types";
import {
  loadProgress,
  moduleKey,
  saveProgress,
  type ProgressMap,
} from "@/lib/progress";
import {
  loadDsaSolved,
  loadFavorites,
  loadStreak,
  markDsaSolved,
  toggleFavorite,
  touchStreak,
  type StreakState,
} from "@/lib/stats";
import type { AppMode, Catalog, Lab, LabModule, MobilePane } from "@/types";

type WorkspaceView = "list" | "solve";

const SETTINGS_KEY = "sde-lab-settings-v1";
const NOTIF_KEY = "sde-lab-notifs-v1";
const PROFILE_KEY = "sde-lab-profile-v1";

export type UserProfile = {
  username: string;
  displayName: string;
  headline: string;
  location: string;
  github: string;
  website: string;
  bio: string;
  avatarHue: number;
};

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as {
        theme?: "vs-dark" | "light" | "dark";
        fontSize: number;
      };
      return {
        theme: (parsed.theme === "light" ? "light" : "dark") as "dark" | "light",
        fontSize: parsed.fontSize ?? 13,
      };
    }
  } catch {
    /* ignore */
  }
  return { theme: "dark" as const, fontSize: 13 };
}

function loadNotifs(): NotifItem[] {
  try {
    const raw = localStorage.getItem(NOTIF_KEY);
    if (raw) return JSON.parse(raw) as NotifItem[];
  } catch {
    /* ignore */
  }
  return [
    {
      id: "welcome",
      title: "Welcome to SDE Lab",
      body: "Problems for interview DSA · Labs to learn JS/Python/TS by doing.",
      ts: Date.now(),
      read: false,
    },
  ];
}

function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw) as UserProfile;
  } catch {
    /* ignore */
  }
  return {
    username: "sde-builder",
    displayName: "SDE Builder",
    headline: "Learning systems by doing",
    location: "",
    github: "",
    website: "",
    bio: "Practicing interview DSA and language labs in SDE Laboratory Studio.",
    avatarHue: 28,
  };
}

type StudioContextValue = {
  catalog: Catalog | null;
  error: string | null;
  mode: AppMode;
  setMode: (m: AppMode) => void;
  section: NavSection;
  setSection: (s: NavSection) => void;
  rail: RailTab;
  setRail: (r: RailTab) => void;
  view: WorkspaceView;
  setView: (v: WorkspaceView) => void;
  labId: string;
  setLabId: (id: string) => void;
  moduleId: string | null;
  setModuleId: (id: string | null) => void;
  dsaId: string | null;
  setDsaId: (id: string | null) => void;
  dsaItems: DsaIndexItem[];
  dsaTopics: string[];
  dsaCompanies: string[];
  dsaTotal: number;
  companyPacks: CompanyPacksFile | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  companyFilter: string | null;
  setCompanyFilter: (c: string | null) => void;
  contestDiff: "All" | "Easy" | "Medium" | "Hard";
  setContestDiff: (d: "All" | "Easy" | "Medium" | "Hard") => void;
  mobilePane: MobilePane;
  setMobilePane: (p: MobilePane) => void;
  progress: ProgressMap;
  dsaSolved: Record<string, boolean>;
  favorites: string[];
  streak: StreakState;
  settings: { theme: "dark" | "light"; fontSize: number };
  setSettings: React.Dispatch<
    React.SetStateAction<{ theme: "dark" | "light"; fontSize: number }>
  >;
  notifications: NotifItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotifItem[]>>;
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  lab: Lab | undefined;
  module: LabModule | null;
  prevModule: LabModule | null;
  nextModule: LabModule | null;
  labSolvedCount: number;
  labTotalCount: number;
  companyWidgets: CompanyPacksFile["companies"];
  filteredDsaItems: DsaIndexItem[];
  hardProblems: DsaIndexItem[];
  completed: boolean;
  goSection: (s: NavSection) => void;
  goRail: (tab: RailTab) => void;
  openModule: (mod: LabModule) => void;
  openDsa: (id: string) => void;
  toggleComplete: () => void;
  pushNotif: (title: string, body: string) => void;
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>;
  setDsaSolved: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  markSolved: (id: string) => void;
  toggleFav: (id: string) => void;
};

const StudioContext = createContext<StudioContextValue | null>(null);

export function useStudio() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used within StudioProvider");
  return ctx;
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<AppMode>("dsa");
  const [section, setSection] = useState<NavSection>("problems");
  const [rail, setRail] = useState<RailTab>("explore");
  const [view, setView] = useState<WorkspaceView>("list");
  const [labId, setLabId] = useState("javascript");
  const [moduleId, setModuleId] = useState<string | null>(null);
  const [dsaId, setDsaId] = useState<string | null>(null);
  const [dsaItems, setDsaItems] = useState<DsaIndexItem[]>([]);
  const [dsaTopics, setDsaTopics] = useState<string[]>([]);
  const [dsaCompanies, setDsaCompanies] = useState<string[]>([]);
  const [dsaTotal, setDsaTotal] = useState(0);
  const [companyPacks, setCompanyPacks] = useState<CompanyPacksFile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [contestDiff, setContestDiff] = useState<"All" | "Easy" | "Medium" | "Hard">("All");
  const [mobilePane, setMobilePane] = useState<MobilePane>("read");
  const [progress, setProgress] = useState<ProgressMap>({});
  const [dsaSolved, setDsaSolved] = useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [streak, setStreak] = useState<StreakState>({ count: 0, history: [], lastActive: "" });
  const [settings, setSettings] = useState(loadSettings);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setDsaSolved(loadDsaSolved());
    setFavorites(loadFavorites());
    setStreak(touchStreak());
    setSettings(loadSettings());
    setNotifications(loadNotifs());
    setProfile(loadProfile());
    setHydrated(true);

    loadCatalog()
      .then((c) => {
        setCatalog(c);
        const first = c.labs[0];
        if (first) setLabId(first.id);
      })
      .catch((err: Error) => setError(err.message));

    loadDsaIndex()
      .then((file) => {
        setDsaItems(file.index);
        setDsaTopics(file.catalog.topics);
        setDsaCompanies(file.catalog.companies);
        setDsaTotal(file.catalog.total);
      })
      .catch(() => undefined);

    loadCompanyPacks()
      .then(setCompanyPacks)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    document.documentElement.setAttribute("data-theme", settings.theme);
    document.documentElement.style.setProperty("--editor-font-size", `${settings.fontSize}px`);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", settings.theme === "light" ? "#f4f5f7" : "#0e1218");
  }, [settings, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
  }, [notifications, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile, hydrated]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        document.querySelector<HTMLButtonElement>(".run-btn")?.click();
      }
      if (e.key === "Escape" && view === "solve") setView("list");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);

  const lab = useMemo(
    () => catalog?.labs.find((l) => l.id === labId),
    [catalog, labId]
  );

  const moduleIndex = useMemo(() => {
    if (!lab || !moduleId) return -1;
    return lab.modules.findIndex((m) => m.id === moduleId);
  }, [lab, moduleId]);

  const module: LabModule | null =
    lab && moduleIndex >= 0 ? lab.modules[moduleIndex] : null;
  const prevModule = lab && moduleIndex > 0 ? lab.modules[moduleIndex - 1] : null;
  const nextModule =
    lab && moduleIndex >= 0 && moduleIndex < lab.modules.length - 1
      ? lab.modules[moduleIndex + 1]
      : null;

  const labSolvedCount = useMemo(() => {
    if (!catalog) return 0;
    let n = 0;
    for (const l of catalog.labs) {
      for (const m of l.modules) {
        if (progress[moduleKey(l.id, m.id)]) n++;
      }
    }
    return n;
  }, [catalog, progress]);

  const labTotalCount = useMemo(
    () => catalog?.labs.reduce((acc, l) => acc + l.modules.length, 0) ?? 0,
    [catalog]
  );

  const companyWidgets = useMemo(() => {
    if (companyPacks?.companies?.length) return companyPacks.companies;
    return [];
  }, [companyPacks]);

  const filteredDsaItems = useMemo(() => {
    if (!companyFilter || !companyPacks) return dsaItems;
    return dsaItems.map((it) => {
      const slug = it.slug || (it.id.startsWith("lc-") ? it.id.slice(3) : undefined);
      if (!slug) return it;
      const pack = companyPacks.problems[slug];
      const freq =
        pack?.companies.find((c) => c.name === companyFilter)?.frequency ?? 0;
      return { ...it, frequency: freq };
    });
  }, [dsaItems, companyFilter, companyPacks]);

  const hardProblems = useMemo(
    () => dsaItems.filter((i) => i.difficulty === "Hard"),
    [dsaItems]
  );

  const pushNotif = useCallback((title: string, body: string) => {
    setNotifications((prev) =>
      [{ id: `${Date.now()}`, title, body, ts: Date.now(), read: false }, ...prev].slice(0, 30)
    );
  }, []);

  const goSection = useCallback((s: NavSection) => {
    setSection(s);
    setView("list");
    setSearchQuery("");
    if (s === "problems") {
      setMode("dsa");
      setRail("explore");
      setCompanyFilter(null);
      setContestDiff("All");
    } else if (s === "labs") {
      setMode("labs");
      setRail("library");
    } else if (s === "contest") {
      setMode("dsa");
      setRail("explore");
      setContestDiff("Hard");
    } else if (s === "interview") {
      setMode("dsa");
      setRail("study");
    } else if (s === "profile") {
      setRail("lists");
    }
  }, []);

  const goRail = useCallback((tab: RailTab) => {
    setRail(tab);
    setView("list");
    if (tab === "library") {
      setSection("labs");
      setMode("labs");
    } else if (tab === "explore") {
      setSection("problems");
      setMode("dsa");
      setCompanyFilter(null);
      setContestDiff("All");
    } else if (tab === "study") {
      setSection("interview");
      setMode("dsa");
    } else if (tab === "lists") {
      setSection("problems");
      setMode("dsa");
    }
  }, []);

  const openModule = useCallback((mod: LabModule) => {
    setModuleId(mod.id);
    setMode("labs");
    setSection("labs");
    setView("solve");
    setMobilePane("read");
    setStreak(touchStreak());
  }, []);

  const openDsa = useCallback((id: string) => {
    setDsaId(id);
    setMode("dsa");
    setView("solve");
    setMobilePane("read");
    setStreak(touchStreak());
  }, []);

  const toggleComplete = useCallback(() => {
    if (!lab || !module) return;
    const key = moduleKey(lab.id, module.id);
    setProgress((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveProgress(next);
      return next;
    });
    setStreak(touchStreak());
    pushNotif("Module updated", `${module.title} progress saved.`);
  }, [lab, module, pushNotif]);

  const markSolved = useCallback((id: string) => {
    setDsaSolved(markDsaSolved(id));
  }, []);

  const toggleFav = useCallback((id: string) => {
    setFavorites(toggleFavorite(id));
  }, []);

  const completed = module ? !!progress[moduleKey(lab?.id ?? "", module.id)] : false;

  const value: StudioContextValue = {
    catalog,
    error,
    mode,
    setMode,
    section,
    setSection,
    rail,
    setRail,
    view,
    setView,
    labId,
    setLabId,
    moduleId,
    setModuleId,
    dsaId,
    setDsaId,
    dsaItems,
    dsaTopics,
    dsaCompanies,
    dsaTotal,
    companyPacks,
    searchQuery,
    setSearchQuery,
    companyFilter,
    setCompanyFilter,
    contestDiff,
    setContestDiff,
    mobilePane,
    setMobilePane,
    progress,
    dsaSolved,
    favorites,
    streak,
    settings,
    setSettings,
    notifications,
    setNotifications,
    profile,
    setProfile,
    lab,
    module,
    prevModule,
    nextModule,
    labSolvedCount,
    labTotalCount,
    companyWidgets,
    filteredDsaItems,
    hardProblems,
    completed,
    goSection,
    goRail,
    openModule,
    openDsa,
    toggleComplete,
    pushNotif,
    setFavorites,
    setDsaSolved,
    markSolved,
    toggleFav,
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}
