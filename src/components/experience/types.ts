import type { Metric } from "@/content";

/** How the commit graph is drawn beside one entry. Lane 0 is the main line. */
export type GraphRow = {
  lane: 0 | 1;
  /** Main line in this row: from the node down, through the whole row, or from the top to the node. */
  main: "fromNode" | "through" | "toNode";
  /** A parallel branch that starts at this row's node and merges back into main below it. */
  branchMergesBelow: boolean;
};

export type CommitEntry = {
  id: string;
  sha: string;
  /** Branch and tag names shown next to the commit, e.g. `HEAD -> main`. */
  refs: { name: string; kind: "head" | "branch" | "tag" }[];
  /** What `git checkout` targets for this role. */
  checkout: string;
  sideProject: boolean;
  logo?: string;
  monogram: string;
  company: string;
  role: string;
  location: string;
  period: string;
  summary: string;
  highlights: string[];
  metrics: Metric[];
  scope?: string;
  stack: string[];
  graph: GraphRow;
};
