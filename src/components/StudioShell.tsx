"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useStudio } from "@/components/StudioProvider";
import { AppNav, type GlobalSearchHit, type NavSection } from "@/components/AppNav";
import { ProblemsWorkspaceTabs } from "@/components/ProblemsWorkspaceTabs";
import { RightPanel } from "@/components/RightPanel";
import { ShellBody } from "@/components/ShellBody";
import { LabLibrary } from "@/components/LabLibrary";
import { DsaProblemsList } from "@/components/DsaProblemsList";
import { ContestView, InterviewView } from "@/components/SectionViews";
import { ProfileView } from "@/components/ProfileView";
import { ProgressView } from "@/components/ProgressView";
import { CompaniesBrowse } from "@/components/CompaniesBrowse";
import { CompaniesPack } from "@/components/CompaniesPack";
import { Reader } from "@/components/Reader";
import { itemsForCompany, companyFromSlug, companySlug } from "@/lib/dsa/company-filter";
import { monacoThemeFor } from "@/lib/themes";
import { SplitPane } from "@/components/SplitPane";

const CodeWorkbench = dynamic(
  () => import("@/components/CodeWorkbench").then((m) => m.CodeWorkbench),
  { ssr: false }
);
const DsaArena = dynamic(
  () => import("@/components/DsaArena").then((m) => m.DsaArena),
  { ssr: false }
);

const SECTION_PATH: Record<NavSection, string> = {
  problems: "/problems",
  labs: "/labs",
  progress: "/progress",
  contest: "/contest",
  interview: "/interview",
  profile: "/profile",
};

export function StudioShell() {
  const s = useStudio();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/labs")) s.goSection("labs");
    else if (pathname?.startsWith("/progress")) s.goSection("progress");
    else if (pathname?.startsWith("/contest")) s.goSection("contest");
    else if (pathname?.startsWith("/interview")) s.goSection("interview");
    else if (pathname?.startsWith("/profile")) s.goSection("profile");
    else if (pathname?.startsWith("/companies")) s.goSection("problems");
    else if (pathname?.startsWith("/problems")) s.goSection("problems");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Hooks must run unconditionally (before boot early-returns).
  const searchHits = useMemo((): GlobalSearchHit[] => {
    const q = s.searchQuery.trim().toLowerCase();
    if (q.length < 2 || !s.catalog) return [];
    const hits: GlobalSearchHit[] = [];
    for (const it of s.dsaItems) {
      if (hits.length >= 6) break;
      const match =
        it.title.toLowerCase().includes(q) ||
        it.topics.some((t) => t.toLowerCase().includes(q)) ||
        it.companies.some((c) => c.toLowerCase().includes(q));
      if (!match) continue;
      hits.push({
        id: `dsa-${it.id}`,
        title: it.title,
        meta: `${it.hasJudge ? "Judged" : "External"} · ${it.difficulty}`,
        onSelect: () => {
          s.openDsa(it.id);
          router.push("/problems");
        },
      });
    }
    for (const lab of s.catalog.labs) {
      for (const mod of lab.modules) {
        if (hits.length >= 10) break;
        if (
          !mod.title.toLowerCase().includes(q) &&
          !lab.title.toLowerCase().includes(q)
        ) {
          continue;
        }
        hits.push({
          id: `mod-${lab.id}-${mod.id}`,
          title: mod.title,
          meta: `Lab · ${lab.title}`,
          onSelect: () => {
            s.openModule(mod);
            router.push("/labs");
          },
        });
      }
    }
    return hits;
  }, [s.searchQuery, s.catalog, s.dsaItems, s.openDsa, s.openModule, router]);

  const companiesPath = pathname?.startsWith("/companies") ?? false;
  const companySlugParam =
    companiesPath && pathname
      ? pathname.replace(/^\/companies\/?/, "").split("/")[0] || ""
      : "";
  const activeCompanyName = companySlugParam
    ? companyFromSlug(companySlugParam)
    : null;
  const onCompaniesIndex = companiesPath && !companySlugParam;
  const onCompanyPack = companiesPath && !!activeCompanyName;

  const companyPackItems = useMemo(() => {
    if (!activeCompanyName) return [];
    return itemsForCompany(activeCompanyName, s.dsaItems, s.companyPacks);
  }, [activeCompanyName, s.dsaItems, s.companyPacks]);

  function navigateSection(sec: NavSection) {
    s.goSection(sec);
    router.push(SECTION_PATH[sec]);
  }

  if (s.error) {
    return (
      <div className="boot-error">
        <div className="boot-error__brand">
          <span className="boot-mark" aria-hidden />
          LITCODE
        </div>
        <h1>Could not load laboratory content</h1>
        <p>{s.error}</p>
        <p className="boot-error__hint">
          Catalog is served from <code>/data/catalog.json</code>. If the
          server was restarting, reload once it is ready.
        </p>
        <button
          type="button"
          className="lf-btn lf-btn--primary"
          onClick={() => window.location.reload()}
        >
          Reload
        </button>
      </div>
    );
  }

  if (!s.catalog || !s.lab) {
    return (
      <div className="boot-loading">
        <div className="boot-loading__brand">
          <span className="boot-mark" aria-hidden />
          LITCODE
        </div>
        <div className="boot-spinner" aria-hidden />
        <p>Loading laboratories…</p>
      </div>
    );
  }

  const showRight =
    s.view === "list" &&
    !companiesPath &&
    s.section !== "profile" &&
    s.section !== "progress";

  const listKind:
    | "labs"
    | "problems"
    | "contest"
    | "interview"
    | "favorites"
    | "profile"
    | "progress"
    | "companies"
    | "company-pack" =
    onCompanyPack
      ? "company-pack"
      : onCompaniesIndex
        ? "companies"
        : s.section === "profile"
          ? "profile"
          : s.section === "progress"
            ? "progress"
            : s.section === "labs"
              ? "labs"
              : s.section === "interview"
                ? "interview"
                : s.section === "contest"
                  ? "contest"
                  : s.rail === "lists"
                    ? "favorites"
                    : "problems";

  return (
    <div className="app-shell lc-shell">
      <AppNav
        section={s.section}
        streak={s.streak.count}
        searchQuery={s.searchQuery}
        onSearch={s.setSearchQuery}
        searchHits={searchHits}
        onSection={navigateSection}
        notifications={s.notifications}
        onMarkNotificationsRead={() =>
          s.setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
        onClearNotifications={() => s.setNotifications([])}
        appTheme={s.settings.theme}
        onAppTheme={(theme) => s.setSettings((x) => ({ ...x, theme }))}
        fontSize={s.settings.fontSize}
        onFontSize={(fontSize) => s.setSettings((x) => ({ ...x, fontSize }))}
        showStopwatch={s.view === "solve" && s.mode === "dsa" && Boolean(s.dsaId)}
      />

      <ShellBody
        showRight={showRight}
        right={
          <RightPanel
            streak={s.streak}
            solvedLabs={s.labSolvedCount}
            totalLabs={s.labTotalCount}
            solvedDsa={Object.keys(s.dsaSolved).length}
            totalDsa={s.dsaTotal}
            companies={s.companyWidgets}
            activeCompany={s.companyFilter}
            onCompany={(name) => {
              if (!name) {
                s.setCompanyFilter(null);
                return;
              }
              s.setCompanyFilter(name);
              s.setMode("dsa");
              s.setView("list");
              router.push(`/companies/${companySlug(name)}`);
            }}
            onOpenProgress={() => navigateSection("progress")}
            onBrowseCompanies={() => {
              s.setView("list");
              router.push("/companies");
            }}
            sourceNote={
              s.companyPacks
                ? `Student-reported tags · ${s.dsaTotal.toLocaleString()} interview problems`
                : undefined
            }
          />
        }
        main={
          <>
            {s.view === "list" && listKind === "companies" && (
              <CompaniesBrowse
                companies={s.companyWidgets}
                activeCompany={s.companyFilter}
                totalProblems={s.dsaTotal}
                onBack={() => router.push("/problems")}
                onCompany={(name) => {
                  if (!name) {
                    s.setCompanyFilter(null);
                    return;
                  }
                  s.setCompanyFilter(name);
                  s.setMode("dsa");
                  s.setView("list");
                  router.push(`/companies/${companySlug(name)}`);
                }}
              />
            )}

            {s.view === "list" && listKind === "company-pack" && activeCompanyName && (
              <CompaniesPack
                company={activeCompanyName}
                items={companyPackItems}
                solved={s.dsaSolved}
                onBack={() => {
                  s.setCompanyFilter(null);
                  router.push("/companies");
                }}
                onOpen={(id) => {
                  s.setCompanyFilter(activeCompanyName);
                  s.openDsa(id);
                }}
              />
            )}

            {s.view === "list" && listKind === "progress" && (
              <ProgressView
                catalog={s.catalog}
                progress={s.progress}
                dsaSolved={s.dsaSolved}
                dsaItems={s.dsaItems}
                streak={s.streak}
                labSolvedCount={s.labSolvedCount}
                labTotalCount={s.labTotalCount}
                onOpenModule={(labId, moduleId) => {
                  s.setLabId(labId);
                  const lab = s.catalog?.labs.find((l) => l.id === labId);
                  const mod = lab?.modules.find((m) => m.id === moduleId);
                  if (mod) s.openModule(mod);
                  else navigateSection("labs");
                }}
                onOpenChallenge={s.openDsa}
              />
            )}

            {s.view === "list" && listKind === "profile" && (
              <ProfileView
                profile={s.profile}
                onChange={s.setProfile}
                solvedDsa={Object.keys(s.dsaSolved).length}
                totalDsa={s.dsaTotal}
                solvedLabs={s.labSolvedCount}
                totalLabs={s.labTotalCount}
                streak={s.streak.count}
                favorites={s.favorites.length}
                progress={s.progress}
                dsaSolvedMap={s.dsaSolved}
                onOpenModule={(labId, moduleId) => {
                  s.setLabId(labId);
                  const lab = s.catalog?.labs.find((l) => l.id === labId);
                  const mod = lab?.modules.find((m) => m.id === moduleId);
                  if (mod) s.openModule(mod);
                  else navigateSection("labs");
                }}
                onOpenChallenge={s.openDsa}
                onOpenProgress={() => navigateSection("progress")}
              />
            )}

            {s.view === "list" && listKind === "labs" && (
              <LabLibrary
                labs={s.catalog.labs}
                lab={s.lab}
                progress={s.progress}
                favorites={s.favorites}
                searchQuery={s.searchQuery}
                onLabChange={(id) => {
                  s.setLabId(id);
                  s.setMode("labs");
                  s.setSection("labs");
                }}
                onOpenModule={s.openModule}
                onToggleFavorite={s.toggleFav}
                onShuffle={() => {
                  const pool = (s.lab?.modules ?? []).filter(
                    (m) => (m.status ?? "scaffold") === "ready"
                  );
                  const use = pool.length ? pool : s.lab?.modules ?? [];
                  if (!use.length) return;
                  s.openModule(use[Math.floor(Math.random() * use.length)]);
                }}
              />
            )}

            {s.view === "list" && (listKind === "problems" || listKind === "favorites") && (
              <div className="lc-problems-page">
                <ProblemsWorkspaceTabs
                  rail={s.rail}
                  favoritesCount={s.favorites.length}
                  onRail={(tab) => {
                    s.goRail(tab);
                    if (tab === "lists" || tab === "explore") router.push("/problems");
                  }}
                />
              <DsaProblemsList
                items={s.filteredDsaItems}
                topics={s.dsaTopics}
                companies={s.dsaCompanies}
                total={s.dsaTotal}
                solved={s.dsaSolved}
                favorites={s.favorites}
                searchQuery={s.searchQuery}
                companyFilter={s.companyFilter}
                favoritesOnly={listKind === "favorites"}
                difficultyPreset={s.contestDiff}
                defaultJudgeOnly={listKind !== "favorites"}
                title={
                  listKind === "favorites"
                    ? "My Lists · Favorites"
                    : s.companyFilter
                      ? `${s.companyFilter} interview pack`
                      : "Problems"
                }
                subtitle={
                  listKind === "favorites"
                    ? `${s.favorites.filter((f) => !f.includes(":")).length || s.favorites.length} saved`
                    : s.companyFilter
                      ? `Student-reported ${s.companyFilter} set`
                      : `${s.dsaTotal.toLocaleString()} indexed · prefer judged set`
                }
                onOpen={s.openDsa}
                onToggleFavorite={s.toggleFav}
                onCompanyFilter={(name) => {
                  if (!name) {
                    s.setCompanyFilter(null);
                    return;
                  }
                  s.setCompanyFilter(name);
                  s.setMode("dsa");
                  s.setView("list");
                  router.push(`/companies/${companySlug(name)}`);
                }}
                trendingCompany={s.companyWidgets[0]?.name ?? null}
              />
              </div>
            )}

            {s.view === "list" && listKind === "contest" && (
              <ContestView
                hardProblems={s.hardProblems}
                onOpen={s.openDsa}
                onStartWeekly={() => {
                  s.setContestDiff("Hard");
                  s.setCompanyFilter(null);
                  s.pushNotif("Contest started", "Hard difficulty filter applied.");
                  const pick =
                    s.hardProblems[
                      Math.floor(Math.random() * Math.min(s.hardProblems.length, 40))
                    ];
                  if (pick) s.openDsa(pick.id);
                }}
              />
            )}

            {s.view === "list" && listKind === "interview" && (
              <InterviewView
                labs={s.catalog.labs}
                judgedProblems={s.dsaItems.filter((i) => i.hasJudge)}
                solved={s.dsaSolved}
                progress={s.progress}
                streak={s.streak.count}
                onOpenLabs={() => navigateSection("labs")}
                onOpenChallenge={s.openDsa}
                onOpenModule={(labId, moduleId) => {
                  s.setLabId(labId);
                  const lab = s.catalog?.labs.find((l) => l.id === labId);
                  const mod = lab?.modules.find((m) => m.id === moduleId);
                  if (mod) s.openModule(mod);
                  else navigateSection("labs");
                }}
              />
            )}

            {s.view === "solve" && s.mode === "labs" && s.module && s.lab && (
              <div className="lc-solve">
                <div className="lc-solve__bar">
                  <button type="button" className="dsa-back" onClick={() => s.setView("list")}>
                    ← Lab library
                  </button>
                  <span className="lc-solve__title">
                    {String(s.module.order).padStart(2, "0")}. {s.module.title}
                  </span>
                  <div className="topbar__mobile-toggle">
                    <button
                      type="button"
                      className={`pane-tab ${s.mobilePane === "read" ? "is-active" : ""}`}
                      onClick={() => s.setMobilePane("read")}
                    >
                      Lesson
                    </button>
                    <button
                      type="button"
                      className={`pane-tab ${s.mobilePane === "code" ? "is-active" : ""}`}
                      onClick={() => s.setMobilePane("code")}
                    >
                      Lab
                    </button>
                  </div>
                </div>
                <div className="workspace__desktop lc-solve__panes">
                  <SplitPane
                    storageKey="sde-main-split"
                    initialRatio={0.46}
                    minFirst={260}
                    minSecond={300}
                    first={
                      <Reader
                        module={s.module}
                        referencePath={null}
                        prevModule={s.prevModule}
                        nextModule={s.nextModule}
                        onPrev={
                          s.prevModule ? () => s.setModuleId(s.prevModule!.id) : undefined
                        }
                        onNext={
                          s.nextModule ? () => s.setModuleId(s.nextModule!.id) : undefined
                        }
                      />
                    }
                    second={
                      <CodeWorkbench
                        module={s.module}
                        labId={s.lab.id}
                        defaultLanguage={s.lab.language}
                        onMarkComplete={s.toggleComplete}
                        completed={s.completed}
                        editorTheme={monacoThemeFor(s.settings.theme)}
                      />
                    }
                  />
                </div>
                <div className="workspace__mobile lc-solve__panes">
                  {s.mobilePane === "read" ? (
                    <Reader
                      module={s.module}
                      referencePath={null}
                      prevModule={s.prevModule}
                      nextModule={s.nextModule}
                      onPrev={
                        s.prevModule ? () => s.setModuleId(s.prevModule!.id) : undefined
                      }
                      onNext={
                        s.nextModule ? () => s.setModuleId(s.nextModule!.id) : undefined
                      }
                    />
                  ) : (
                    <CodeWorkbench
                      module={s.module}
                      labId={s.lab.id}
                      defaultLanguage={s.lab.language}
                      onMarkComplete={s.toggleComplete}
                      completed={s.completed}
                      editorTheme={monacoThemeFor(s.settings.theme)}
                    />
                  )}
                </div>
              </div>
            )}

            {s.view === "solve" && s.mode === "dsa" && s.dsaId && (
              <DsaArena
                problemId={s.dsaId}
                items={
                  onCompanyPack && activeCompanyName
                    ? companyPackItems
                    : s.section === "interview"
                      ? s.dsaItems.filter((i) => i.hasJudge)
                      : s.dsaItems
                }
                interviewMode={s.section === "interview"}
                onBack={() => {
                  s.setView("list");
                  if (onCompanyPack && activeCompanyName) {
                    router.push(`/companies/${companySlug(activeCompanyName)}`);
                  }
                }}
                onChangeProblem={s.setDsaId}
                onAccepted={(id) => {
                  s.markSolved(id);
                  s.pushNotif("Accepted", `Problem ${id} marked solved.`);
                }}
                mobilePane={s.mobilePane}
                onMobilePane={s.setMobilePane}
                editorTheme={monacoThemeFor(s.settings.theme)}
                onOpenCompany={(name) => {
                  s.setCompanyFilter(name);
                  s.setView("list");
                  router.push(`/companies/${companySlug(name)}`);
                }}
                companyPacks={s.companyPacks}
                onOpenModule={(labId, moduleId) => {
                  s.setLabId(labId);
                  const lab = s.catalog?.labs.find((l) => l.id === labId);
                  const mod = lab?.modules.find((m) => m.id === moduleId);
                  if (mod) s.openModule(mod);
                  else {
                    s.goSection("labs");
                    router.push("/labs");
                  }
                }}
              />
            )}
          </>
        }
      />
    </div>
  );
}
