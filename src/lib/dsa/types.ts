export type Difficulty = "Easy" | "Medium" | "Hard";

export interface DsaIndexItem {
  id: string;
  num: number;
  title: string;
  difficulty: Difficulty;
  topics: string[];
  companies: string[];
  kind: "seed" | "generated";
  pattern?: string;
  hasJudge: boolean;
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
  };
  index: DsaIndexItem[];
}
