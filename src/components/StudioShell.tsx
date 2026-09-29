"use client";

import dynamic from "next/dynamic";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStudio } from "@/components/StudioProvider";
import { AppNav, type NavSection } from "@/components/AppNav";
import { LeftRail } from "@/components/LeftRail";
import { RightPanel } from "@/components/RightPanel";
import { ShellBody } from "@/components/ShellBody";
import { LabLibrary } from "@/components/LabLibrary";
import { DsaProblemsList } from "@/components/DsaProblemsList";
import { ContestView, InterviewView } from "@/components/SectionViews";
import { ProfileView } from "@/components/ProfileView";
import { Reader } from "@/components/Reader";
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
    else if (pathname?.startsWith("/contest")) s.goSection("contest");
    else if (pathname?.startsWith("/interview")) s.goSection("interview");
    else if (pathname?.startsWith("/profile")) s.goSection("profile");
    else s.goSection("problems");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function navigateSection(sec: NavSection) {
    s.goSection(sec);
    router.push(SECTION_PATH[sec]);
  }

  if (s.error) {
    return (
      <div className="boot-error">
        <h1>Could not load laboratory content</h1>
        <p>{s.error}</p>
      </div>
    );
  }

  if (!s.catalog || !s.lab) {
    return (
      <div className="boot-loading">
        <div className="boot-spinner" />
        <p>Loading laboratories…</p>
      </div>
    );
  }

  const showRight = s.view === "list" && s.section !== "profile";
  const showRail = s.view === "list";

  const listKind: "labs" | "problems" | "contest" | "interview" | "favorites" | "profile" =
    s.section === "profile"
      ? "profile"
      : s.rail === "lists"
        ? "favorites"
        : s.section === "interview" || s.rail === "study"
          ? "interview"
          : s.section === "contest"
            ? "contest"
            : s.section === "labs" || s.rail === "library"
              ? "labs"
              : "problems";

  return (
    <div className="app-shell lc-shell">
      <AppNav
        section={s.section}
        streak={s.streak.count}
        searchQuery={s.searchQuery}
        onSearch={s.setSearchQuery}
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
      />

      <ShellBody
        showRail={showRail}
        showRight={showRight}
        rail={
          <LeftRail
            active={s.rail}
            favoritesCount={s.favorites.length}
            onChange={s.goRail}
          />
        }
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
              s.setCompanyFilter(name);
              s.setSection("problems");
              s.setRail("explore");
              s.setMode("dsa");
              s.setContestDiff("All");
              s.setView("list");
              router.push("/problems");
            }}
            onOpenProgress={() => navigateSection("interview")}
            sourceNote={
              s.companyPacks
                ? `Student-reported tags · ${s.dsaTotal.toLocaleString()} interview problems`
                : undefined
            }
          />
        }
        main={
          <>
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
                  s.setRail("library");
                }}
                onOpenModule={s.openModule}
                onToggleFavorite={s.toggleFav}
                onShuffle={() => {
                  const pool = s.lab?.modules ?? [];
                  if (!pool.length) return;
                  s.openModule(pool[Math.floor(Math.random() * pool.length)]);
                }}
              />
            )}

            {s.view === "list" && (listKind === "problems" || listKind === "favorites") && (
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
                      : `${s.dsaTotal.toLocaleString()} interview-crucial DSA problems`
                }
                onOpen={s.openDsa}
                onToggleFavorite={s.toggleFav}
                onCompanyFilter={s.setCompanyFilter}
                trendingCompany={s.companyWidgets[0]?.name ?? null}
              />
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
                solvedLabs={s.labSolvedCount}
                totalLabs={s.labTotalCount}
                solvedDsa={Object.keys(s.dsaSolved).length}
                totalDsa={s.dsaTotal}
                streak={s.streak.count}
                companies={s.dsaCompanies}
                onOpenLabs={() => navigateSection("labs")}
                onOpenCompanyPack={(c) => {
                  s.setCompanyFilter(c);
                  s.setSection("problems");
                  s.setRail("explore");
                  s.setMode("dsa");
                  s.setContestDiff("All");
                  s.pushNotif("Company pack", `Filtered Problems to ${c}.`);
                  router.push("/problems");
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
                        defaultLanguage={s.lab.language}
                        onMarkComplete={s.toggleComplete}
                        completed={s.completed}
                        editorTheme={s.settings.theme === "light" ? "light" : "vs-dark"}
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
                      defaultLanguage={s.lab.language}
                      onMarkComplete={s.toggleComplete}
                      completed={s.completed}
                      editorTheme={s.settings.theme === "light" ? "light" : "vs-dark"}
                    />
                  )}
                </div>
              </div>
            )}

            {s.view === "solve" && s.mode === "dsa" && s.dsaId && (
              <DsaArena
                problemId={s.dsaId}
                items={s.dsaItems}
                onBack={() => s.setView("list")}
                onChangeProblem={s.setDsaId}
                onAccepted={(id) => {
                  s.markSolved(id);
                  s.pushNotif("Accepted", `Problem ${id} marked solved.`);
                }}
                mobilePane={s.mobilePane}
                onMobilePane={s.setMobilePane}
                editorTheme={s.settings.theme === "light" ? "light" : "vs-dark"}
              />
            )}
          </>
        }
      />
    </div>
  );
}
