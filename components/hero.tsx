import { GraduationCap } from "lucide-react";

type HeroStats = {
  total: number;
  passed: number;
  failed: number;
  absent: number;
  gpa5: number;
};

type HeroProps = {
  stats: HeroStats;
  published: string | null;
};

function StatTile({
  label,
  value,
  note,
  percent,
  accent = false,
}: {
  label: string;
  value: number;
  note: string;
  percent: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <p className="section-label">{label}</p>
      <p className="mt-2 font-mono text-2xl leading-none text-ink">
        {value.toLocaleString("en-US")}
      </p>
      <p className="mt-1.5 text-[11px] text-muted">{note}</p>
      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-tile">
        <div
          className={accent ? "h-1 rounded-full bg-accent" : "h-1 rounded-full bg-[#4a4a4a]"}
          style={{ width: `${Math.max(Math.min(percent, 100), 1.5)}%` }}
        />
      </div>
    </div>
  );
}

export function Hero({ stats, published }: HeroProps) {
  const pct = (n: number) => (stats.total ? (n / stats.total) * 100 : 0);

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="dot-grid fade-mask pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 md:pb-20 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="hero-icon-glow mx-auto flex size-12 items-center justify-center rounded-xl border border-accent/30 bg-card">
            <GraduationCap className="size-5 text-accent" strokeWidth={1.5} />
          </div>
          <p className="section-label mt-6">
            // HSC RESULT 2026 · MYMENSINGH EDUCATION BOARD
          </p>
          <h1 className="text-gradient mt-4 text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Fulbaria College result,{" "}
            <span className="hollow-word">searchable</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-muted md:text-base">
            Search{" "}
            <span className="font-mono text-ink">
              {stats.total.toLocaleString("en-US")}
            </span>{" "}
            HSC 2026 candidates by name or roll. Filter by session and group,
            then open any student for full details and subject grades.
          </p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/80">
            Fulbaria College · EIIN 111516
            {published ? ` · Published ${published}` : ""}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatTile
            label="TOTAL"
            value={stats.total}
            note="All groups · all sessions"
            percent={100}
            accent
          />
          <StatTile
            label="PASSED"
            value={stats.passed}
            note={`${pct(stats.passed).toFixed(1)}% of candidates`}
            percent={pct(stats.passed)}
            accent
          />
          <StatTile
            label="FAILED"
            value={stats.failed}
            note={`${pct(stats.failed).toFixed(1)}% of candidates`}
            percent={pct(stats.failed)}
          />
          <StatTile
            label="ABSENT"
            value={stats.absent}
            note={`${pct(stats.absent).toFixed(1)}% of candidates`}
            percent={pct(stats.absent)}
          />
          <StatTile
            label="GPA 5.00"
            value={stats.gpa5}
            note="Perfect grade point"
            percent={pct(stats.gpa5)}
            accent
          />
        </div>
      </div>
    </section>
  );
}
