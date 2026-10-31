"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  LayoutGrid,
  RotateCcw,
  Search,
  Sparkles,
  Table2,
} from "lucide-react";
import type { School } from "@/lib/types";
import { searchStudents } from "@/lib/search";
import { StudentCard } from "./student-card";
import { StatusBadge } from "./status-badge";

const PAGE_SIZE = 36;

type ViewMode = "cards" | "table";

export function Explorer() {
  const [data, setData] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [session, setSession] = useState("all");
  const [group, setGroup] = useState("all");
  const [view, setView] = useState<ViewMode>("cards");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch("/data/fulbaria_college.json", {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }
        const json = (await response.json()) as School;
        setData(json);
      } catch (cause) {
        if ((cause as Error).name === "AbortError") return;
        setError(
          "Could not load the result dataset. Refresh the page to try again.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const students = data?.students ?? [];

  const sessions = useMemo(
    () => Array.from(new Set(students.map((student) => student.session))).sort(),
    [students],
  );

  const groups = useMemo(
    () => Array.from(new Set(students.map((student) => student.group))).sort(),
    [students],
  );

  const search = useMemo(
    () => searchStudents(students, { query, session, group }),
    [students, query, session, group],
  );
  const filtered = search.students;
  const isFuzzy = search.fuzzy;

  const autoOpenRoll = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle || filtered.length !== 1) return null;
    const only = filtered[0];
    if (isFuzzy) return only.roll;
    if (only.roll === needle || only.name.toLowerCase() === needle) {
      return only.roll;
    }
    return null;
  }, [filtered, query, isFuzzy]);

  useEffect(() => {
    if (autoOpenRoll) setExpanded(new Set([autoOpenRoll]));
  }, [autoOpenRoll]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query, session, group, view]);

  const hasFilters =
    query.trim().length > 0 || session !== "all" || group !== "all";

  function clearFilters() {
    setQuery("");
    setSession("all");
    setGroup("all");
  }

  function toggleStudent(roll: string) {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(roll)) next.delete(roll);
      else next.add(roll);
      return next;
    });
  }

  const shown = view === "cards" ? filtered.slice(0, visible) : filtered;
  const remaining = Math.max(filtered.length - visible, 0);

  return (
    <section id="explorer" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
      <div className="max-w-2xl">
        <p className="section-label">01 / SEARCH</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Find a candidate
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Type a name or roll number. Slight spelling mistakes are matched
          automatically, and session and group stay set to “all” until you pick
          one.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-card p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_170px_190px_auto]">
          <div>
            <label htmlFor="search" className="section-label">
              SEARCH
            </label>
            <div className="relative mt-2">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                strokeWidth={1.5}
              />
              <input
                id="search"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name or roll…"
                autoComplete="off"
                spellCheck={false}
                className="h-10 w-full rounded-lg border border-line bg-tile pl-9 pr-3 font-mono text-xs text-ink placeholder:text-muted/70 transition-colors duration-150 hover:border-[#3a3a3a]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="session" className="section-label">
              SESSION
            </label>
            <div className="relative mt-2">
              <select
                id="session"
                value={session}
                onChange={(event) => setSession(event.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-line bg-tile pl-3 pr-9 font-mono text-xs text-ink transition-colors duration-150 hover:border-[#3a3a3a]"
              >
                <option value="all">All sessions</option>
                {sessions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div>
            <label htmlFor="group" className="section-label">
              GROUP
            </label>
            <div className="relative mt-2">
              <select
                id="group"
                value={group}
                onChange={(event) => setGroup(event.target.value)}
                className="h-10 w-full appearance-none rounded-lg border border-line bg-tile pl-3 pr-9 font-mono text-xs text-ink transition-colors duration-150 hover:border-[#3a3a3a]"
              >
                <option value="all">All groups</option>
                {groups.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                strokeWidth={1.5}
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasFilters}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-line bg-tile px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors duration-150 hover:bg-[#383838] hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 md:w-auto"
            >
              <RotateCcw className="size-3.5" strokeWidth={1.5} />
              Clear
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="Result view"
            className="inline-flex w-fit items-center gap-1 rounded-lg border border-line bg-tile p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === "cards"}
              onClick={() => setView("cards")}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-150 ${
                view === "cards"
                  ? "bg-accent-active text-white"
                  : "text-muted hover:text-ink"
              }`}
            >
              <LayoutGrid className="size-3.5" strokeWidth={1.5} />
              Cards
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "table"}
              onClick={() => setView("table")}
              className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors duration-150 ${
                view === "table"
                  ? "bg-accent-active text-white"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Table2 className="size-3.5" strokeWidth={1.5} />
              Table
            </button>
          </div>

          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            {loading
              ? "Loading records…"
              : `${filtered.length.toLocaleString("en-US")} match${
                  filtered.length === 1 ? "" : "es"
                } · ${students.length.toLocaleString("en-US")} total`}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="section-label">02 / RESULTS</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
              {loading
                ? "Loading candidates"
                : isFuzzy
                  ? `${filtered.length.toLocaleString("en-US")} closest candidate${
                      filtered.length === 1 ? "" : "s"
                    }`
                  : `${filtered.length.toLocaleString("en-US")} candidate${
                      filtered.length === 1 ? "" : "s"
                    }`}
            </h2>
          </div>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:block">
            {isFuzzy ? "Closest match first" : "Sorted by roll · ascending"}
          </p>
        </div>

        <div className="mt-4">
          {isFuzzy && !loading && !error ? (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-line bg-card p-4">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-line bg-tile">
                <Sparkles className="size-4 text-accent" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="section-label">CLOSEST MATCHES</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">
                  No exact name or roll match for{" "}
                  <span className="font-mono text-ink">
                    “{query.trim()}”
                  </span>
                  . Showing the closest names instead.
                </p>
              </div>
            </div>
          ) : null}
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-52 animate-pulse rounded-xl border border-line bg-card"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-line bg-card p-10 text-center">
              <p className="section-label">LOAD ERROR</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">
                Dataset unavailable
              </h3>
              <p className="mt-1 text-sm text-muted">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-line bg-tile px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-colors duration-150 hover:bg-[#383838]"
              >
                Reload
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-line bg-card p-10 text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-lg border border-line bg-tile">
                <Search className="size-4 text-muted" strokeWidth={1.5} />
              </div>
              <p className="section-label mt-4">NO MATCHES</p>
              <h3 className="mt-2 text-lg font-semibold text-ink">
                No candidate found
              </h3>
              <p className="mt-1 text-sm text-muted">
                Try another name, roll, session or group.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg border border-line bg-tile px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-colors duration-150 hover:bg-[#383838]"
              >
                Reset filters
              </button>
            </div>
          ) : view === "cards" ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((student) => (
                  <StudentCard
                    key={student.roll}
                    student={student}
                    open={expanded.has(student.roll)}
                    onToggle={() => toggleStudent(student.roll)}
                  />
                ))}
              </div>

              {remaining > 0 ? (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisible((value) => value + PAGE_SIZE)}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-line bg-tile px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-colors duration-150 hover:bg-[#383838]"
                  >
                    Load more
                    <span className="text-muted">
                      ({remaining.toLocaleString("en-US")} remaining)
                    </span>
                  </button>
                </div>
              ) : (
                <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  End of results
                </p>
              )}
            </>
          ) : (
            <div className="overflow-hidden rounded-xl border border-line bg-card">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line">
                      {[
                        "Roll",
                        "Name",
                        "Father's name",
                        "Group",
                        "Session",
                        "GPA / Result",
                        "Status",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className="px-4 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-label"
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((student) => (
                      <tr
                        key={student.roll}
                        className="border-b border-line/70 transition-colors duration-150 last:border-b-0 hover:bg-tile/40"
                      >
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink">
                          {student.roll}
                        </td>
                        <td className="px-4 py-3 text-[13px] text-ink">
                          {student.name}
                        </td>
                        <td className="px-4 py-3 text-[12px] text-muted">
                          {student.father_name}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-muted">
                          {student.group}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-muted">
                          {student.session}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink">
                          {student.gpa !== null
                            ? student.gpa.toFixed(2)
                            : student.result_sheet}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={student.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
