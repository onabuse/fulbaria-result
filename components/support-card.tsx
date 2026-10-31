import { Star } from "lucide-react";

const REPO_URL = "https://github.com/onabuse/fulbaria-result";
const AVATAR_URL = "https://github.com/onabuse.png?size=80";

export function SupportCard() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-20">
      <a
        href={REPO_URL}
        target="_blank"
        rel="noreferrer"
        className="group flex flex-col gap-4 rounded-xl border border-line bg-card p-5 transition-colors duration-150 hover:border-[#343434] sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <p className="section-label">SUPPORT THE PROJECT</p>
          <h2 className="mt-2 text-base font-semibold text-ink">
            Leave a star on GitHub
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Free and open source by{" "}
            <span className="font-mono text-label">@onabuse</span>. A star
            helps more students find this tool.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={AVATAR_URL}
            alt="Saifur Rahman Siam on GitHub"
            width={32}
            height={32}
            className="size-8 rounded-full border border-line object-cover"
          />
          <span className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-line bg-tile px-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition-colors duration-150 group-hover:bg-[#383838]">
            <Star className="size-3.5 text-accent" strokeWidth={1.5} />
            Star
          </span>
        </div>
      </a>
    </section>
  );
}
