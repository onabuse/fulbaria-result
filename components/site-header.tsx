export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <a
          href="#top"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink"
        >
          FULBARIA<span className="text-accent">//</span>RESULT
        </a>
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:gap-5">
          <span className="hidden sm:inline">Mymensingh Board</span>
          <span className="hidden md:inline">EIIN 111516</span>
          <span className="inline-flex items-center gap-1.5 text-label">
            <span className="size-1.5 rounded-full bg-accent" />
            HSC 2026
          </span>
        </div>
      </div>
    </header>
  );
}
