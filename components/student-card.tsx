"use client";

import { ChevronDown } from "lucide-react";
import type { Student } from "@/lib/types";
import { StatusBadge } from "./status-badge";

type StudentCardProps = {
  student: Student;
  open: boolean;
  onToggle: () => void;
};

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-label">
        {label}
      </dt>
      <dd className="mt-1 break-words text-[13px] leading-snug text-ink">
        {value || "—"}
      </dd>
    </div>
  );
}

export function StudentCard({ student, open, onToggle }: StudentCardProps) {
  const flagged = student.subjects.filter(
    (item) => item.grade === "F" || item.grade === "X",
  );
  const showFlagged = student.status === "failed" && flagged.length > 0;

  return (
    <article className="flex flex-col rounded-xl border border-line bg-card p-5 transition-colors duration-150 hover:border-[#343434]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="section-label truncate">ROLL {student.roll}</p>
          <h3 className="mt-2 truncate text-[15px] font-semibold leading-snug text-ink">
            {student.name}
          </h3>
          <p className="mt-1 truncate font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            {student.group} · {student.session} · {student.type}
          </p>
        </div>
        <StatusBadge status={student.status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-line bg-tile px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-label">
            GPA
          </p>
          <p className="mt-1 font-mono text-lg leading-none text-ink">
            {student.gpa !== null ? student.gpa.toFixed(2) : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-tile px-3 py-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-label">
            RESULT
          </p>
          <p className="mt-1 font-mono text-lg leading-none text-ink">
            {student.result_sheet}
          </p>
        </div>
      </div>

      {showFlagged ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {flagged.map((item) => (
            <span
              key={item.subject}
              className="rounded-md border border-accent/25 bg-accent/10 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-accent"
            >
              {item.subject}
            </span>
          ))}
        </div>
      ) : null}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="mt-4 flex w-full items-center justify-between gap-3 rounded-lg border border-line bg-tile px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted transition-colors duration-150 hover:bg-[#383838] hover:text-ink"
      >
        <span>{open ? "Hide full details" : "View full details"}</span>
        <ChevronDown
          className={`size-4 shrink-0 transition-transform duration-150 ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={1.5}
        />
      </button>

      {open ? (
        <div className="mt-4 border-t border-line pt-4">
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            <DetailField label="Father's name" value={student.father_name} />
            <DetailField label="Mother's name" value={student.mother_name} />
            <DetailField label="Session" value={student.session} />
            <DetailField label="Passing year" value={student.passing_year} />
            <DetailField label="Candidate type" value={student.type} />
            <DetailField label="Registration no" value={student.reg_no} />
            <DetailField label="Institute" value={student.institute} />
            <DetailField label="Center" value={student.center} />
          </dl>

          <div className="mt-5">
            <p className="section-label">SUBJECT GRADES</p>
            <ul className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {student.subjects.map((item) => {
                const isFail = item.grade === "F" || item.grade === "X";
                return (
                  <li
                    key={item.subject}
                    className="flex items-center justify-between gap-3 rounded-md bg-tile px-2.5 py-1.5"
                  >
                    <span className="truncate text-[11px] text-muted">
                      {item.subject}
                    </span>
                    <span
                      className={`shrink-0 font-mono text-[11px] ${
                        isFail ? "text-accent" : "text-ink"
                      }`}
                    >
                      {item.grade}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      ) : null}
    </article>
  );
}
