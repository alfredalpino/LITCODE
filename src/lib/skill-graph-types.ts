/** Skill graph type contracts. */

export type SkillNodeKind =
  | "language"
  | "concept"
  | "pattern"
  | "challenge"
  | "project"
  | "assessment";

export type SkillStage = "unseen" | "exposed" | "practicing" | "passing" | "mastered";

export interface SkillNode {
  id: string;
  kind: SkillNodeKind;
  title: string;
  language?: "javascript" | "typescript" | "python" | "cross";
  summary?: string;
  prereqs: string[];
  /** Soft transfer links (not AND-gating). Used for lab↔DSA and JS↔TS bridges. */
  related?: string[];
  moduleRef?: { labId: string; moduleId: string };
  challengeRef?: { challengeId: string };
  tags?: string[];
}

export interface SkillGraphFile {
  version: 1;
  updatedAt: string;
  nodes: SkillNode[];
}

export interface SkillEvidence {
  nodeId: string;
  attempts: number;
  passes: number;
  fails: number;
  hintsUsed: number;
  lastTs: number;
  mastery: number;
  stage: SkillStage;
  predictHits?: number;
  predictSkips?: number;
}

export interface SkillStateFile {
  version: 1;
  evidence: Record<string, SkillEvidence>;
}

export type NextStepRecommendation = {
  node: SkillNode;
  reason: string;
};

export type MasteryBucket = "known" | "learning" | "weak" | "next" | "mastered";

export type MasterySummaryItem = {
  node: SkillNode;
  evidence: SkillEvidence;
  bucket: MasteryBucket;
};

export type MasterySummary = {
  known: MasterySummaryItem[];
  learning: MasterySummaryItem[];
  weak: MasterySummaryItem[];
  next: MasterySummaryItem[];
  mastered: MasterySummaryItem[];
};
