export type SubjectGrade = {
  subject: string;
  grade: string;
};

export type Student = {
  roll: string;
  name: string;
  group: string;
  gpa: number | null;
  result: string;
  status: "passed" | "failed" | "absent" | string;
  reg_no: string;
  father_name: string;
  mother_name: string;
  session: string;
  passing_year: string;
  type: string;
  institute: string;
  center: string;
  result_sheet: string;
  subjects: SubjectGrade[];
};

export type School = {
  board: string;
  exam: string;
  year: number;
  institute: {
    name: string;
    eiin: string;
    center: string;
    address: string;
  };
  published: string | null;
  total_students: number;
  details_fetched: number;
  summary: Record<string, number>;
  groups: Record<
    string,
    {
      total: number;
      passed: number;
      failed: number;
      absent: number;
      gpa_5: number;
    }
  >;
  students: Student[];
};
