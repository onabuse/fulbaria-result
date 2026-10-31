import type { Student } from "./types";

export function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function osaDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix: number[][] = Array.from({ length: rows }, () =>
    new Array<number>(cols).fill(0),
  );

  for (let i = 0; i < rows; i += 1) matrix[i][0] = i;
  for (let j = 0; j < cols; j += 1) matrix[0][j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );

      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + 1);
      }
    }
  }

  return matrix[a.length][b.length];
}

export function nameSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (!a || !b) return 0;
  const distance = osaDistance(a, b);
  return 1 - distance / Math.max(a.length, b.length);
}

function tokenThreshold(length: number): number {
  if (length <= 3) return 0.66;
  if (length === 4) return 0.7;
  return 0.6;
}

export function fuzzyNameScore(query: string, name: string): number | null {
  const normalizedQuery = normalizeName(query);
  const normalizedName = normalizeName(name);
  if (!normalizedQuery || !normalizedName) return null;

  const queryTokens = normalizedQuery.split(" ").filter(Boolean);
  const nameTokens = normalizedName.split(" ").filter(Boolean);
  const considered = queryTokens.filter((token) => token.length >= 2);
  if (considered.length === 0) return null;

  const fullSimilarity = nameSimilarity(normalizedQuery, normalizedName);

  let total = 0;
  let matched = 0;
  let easiestThreshold = 1;

  for (const queryToken of considered) {
    let best = 0;

    for (const nameToken of nameTokens) {
      let similarity = nameSimilarity(queryToken, nameToken);
      const shorter = Math.min(queryToken.length, nameToken.length);
      const longer = Math.max(queryToken.length, nameToken.length);
      const isPrefix =
        nameToken.startsWith(queryToken) || queryToken.startsWith(nameToken);
      if (isPrefix && shorter >= 3 && shorter / longer >= 0.6) {
        similarity = Math.max(similarity, 0.9);
      }
      if (similarity > best) best = similarity;
    }

    const threshold = tokenThreshold(queryToken.length);
    easiestThreshold = Math.min(easiestThreshold, threshold);
    if (best >= threshold) matched += 1;
    total += best;
  }

  if (matched < considered.length) return null;

  const average = total / considered.length;
  const score = Math.max(fullSimilarity * 0.96, average);

  if (score < easiestThreshold) return null;
  return score;
}

const FUZZY_LIMIT = 12;

export type SearchOptions = {
  query: string;
  session: string;
  group: string;
};

export type SearchResult = {
  students: Student[];
  fuzzy: boolean;
};

export function searchStudents(
  students: Student[],
  { query, session, group }: SearchOptions,
): SearchResult {
  const base = students.filter((student) => {
    const matchesSession = session === "all" || student.session === session;
    const matchesGroup = group === "all" || student.group === group;
    return matchesSession && matchesGroup;
  });

  const needle = query.trim().toLowerCase();
  if (!needle) {
    return {
      students: [...base].sort((a, b) => a.roll.localeCompare(b.roll)),
      fuzzy: false,
    };
  }

  const normalizedNeedle = normalizeName(query);
  const compactNeedle = normalizedNeedle.replace(/ /g, "");

  const direct = base.filter((student) => {
    const name = student.name.toLowerCase();
    const normalizedStudentName = normalizeName(student.name);
    const compactStudentName = normalizedStudentName.replace(/ /g, "");
    return (
      student.roll.includes(needle) ||
      name.includes(needle) ||
      (normalizedNeedle.length > 0 &&
        normalizedStudentName.includes(normalizedNeedle)) ||
      (compactNeedle.length > 1 && compactStudentName.includes(compactNeedle))
    );
  });

  if (direct.length > 0) {
    return {
      students: direct.sort((a, b) => a.roll.localeCompare(b.roll)),
      fuzzy: false,
    };
  }

  const isRollQuery = /^\d+$/.test(needle);
  if (needle.length < 3 || isRollQuery) {
    return { students: [], fuzzy: false };
  }

  const scored = base
    .map((student) => ({
      student,
      score: fuzzyNameScore(query, student.name),
    }))
    .filter(
      (entry): entry is { student: Student; score: number } =>
        entry.score !== null,
    )
    .sort(
      (a, b) =>
        b.score - a.score || a.student.roll.localeCompare(b.student.roll),
    )
    .slice(0, FUZZY_LIMIT);

  return {
    students: scored.map((entry) => entry.student),
    fuzzy: scored.length > 0,
  };
}
