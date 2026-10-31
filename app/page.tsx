import rawData from "@/public/data/fulbaria_college.json";
import type { School } from "@/lib/types";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { Explorer } from "@/components/explorer";
import { SupportCard } from "@/components/support-card";

const data = rawData as unknown as School;

export default function HomePage() {
  const students = data.students;
  const stats = {
    total: students.length,
    passed: students.filter((student) => student.status === "passed").length,
    failed: students.filter((student) => student.status === "failed").length,
    absent: students.filter((student) => student.status === "absent").length,
    gpa5: students.filter((student) => student.gpa === 5).length,
  };

  return (
    <>
      <SiteHeader />
      <main id="top">
        <Hero stats={stats} published={data.published} />
        <Explorer />
        <SupportCard />
      </main>
      <footer className="border-t border-line">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink">
                FULBARIA<span className="text-accent">//</span>RESULT
              </p>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-muted">
                An unofficial, read-only explorer for the HSC 2026 result sheet
                of Fulbaria College, Mymensingh Board.
              </p>
            </div>
            <div>
              <p className="section-label">DATASET</p>
              <ul className="mt-3 space-y-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                <li>{data.total_students.toLocaleString("en-US")} records</li>
                <li>EIIN {data.institute.eiin}</li>
                <li>
                  {data.published ? `Published ${data.published}` : "Published 2026"}
                </li>
              </ul>
            </div>
            <div>
              <p className="section-label">SOURCE</p>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                Mymensingh Education Board result sheet ·
                result_sheet.php?eiin={data.institute.eiin}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                Built with Next.js · Tailwind CSS
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
