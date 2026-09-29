export type LabLanguage = "javascript" | "typescript" | "python";

export type DocCategory =
  | "docs"
  | "reference"
  | "review"
  | "predictions"
  | "solutions"
  | "experiments"
  | "exercises"
  | "challenges"
  | "debug";

export interface ContentDoc {
  id: string;
  name: string;
  title: string;
  path: string;
  category: DocCategory;
  isPrimary?: boolean;
}

export interface CodeFile {
  id: string;
  name: string;
  path: string;
  category: DocCategory;
  language: LabLanguage | "plaintext";
  relative: string;
}

export interface LabModule {
  id: string;
  slug: string;
  title: string;
  order: number;
  docs: ContentDoc[];
  codeFiles: CodeFile[];
  solutions: Array<ContentDoc | CodeFile>;
}

export interface LabReference {
  id: string;
  title: string;
  path: string;
  kind: "reference";
}

export interface Lab {
  id: string;
  title: string;
  short: string;
  language: LabLanguage;
  accent: string;
  modules: LabModule[];
  references: LabReference[];
  stats: {
    modules: number;
    docs: number;
    codeFiles: number;
  };
}

export interface Catalog {
  generatedAt: string;
  labs: Lab[];
}

export type MobilePane = "read" | "code";
export type ConsoleLineKind = "log" | "error" | "info" | "warn";

export interface ConsoleLine {
  id: string;
  kind: ConsoleLineKind;
  text: string;
  ts: number;
}
