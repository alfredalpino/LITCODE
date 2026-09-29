export type Difficulty = "Easy" | "Medium" | "Hard";

export interface DsaIndexItem {
  id: string;
  num: number;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  companies: string[];
  kind: "seed" | "generated" | "leetcode";
  pattern?: string;
  hasJudge: boolean;
  slug?: string;
  link?: string;
  frequency?: number;
}

export interface CompanyPackMeta {
  name: string;
  thirty: number;
  threeMonths: number;
  sixMonths: number;
  moreThanSix: number;
  all: number;
  count: number;
}

export interface CompanyPacksFile {
  source: string;
  generatedAt: string;
  companyCount: number;
  problemCount: number;
  companies: CompanyPackMeta[];
  problems: Record<
    string,
    {
      title: string;
      difficulty: Difficulty;
      topics: string[];
      link: string;
      companies: Array<{ name: string; frequency: number }>;
    }
  >;
  titleIndex: Record<string, string>;
}

export interface DsaTestCase {
  id: string;
  input: unknown[];
  expected?: unknown;
}

export interface DsaProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  companies: string[];
  functionName: string;
  description: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  starter: {
    javascript: string;
    typescript: string;
    python: string;
  };
  tests: DsaTestCase[];
  pattern?: string;
  kind: string;
  hasJudge: boolean;
}

export interface DsaIndexFile {
  catalog: {
    generatedAt: string;
    total: number;
    topics: string[];
    companies: string[];
    patterns: string[];
    sourceNote: string;
    companySource?: string;
    companyCount?: number;
    companyProblemCount?: number;
  };
  index: DsaIndexItem[];
}
