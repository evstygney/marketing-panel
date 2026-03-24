export type Channel = {
  name: string;
  impressions: number;
  clicks: number;
  cost: number;
  leads: number;
  sales: number;
  revenue: number;
};

export type HypothesisStatus = "new" | "planned" | "in_progress" | "done" | "rejected";

export type Hypothesis = {
  id: string;
  title: string;
  channel: string;
  impact: number;
  effort: number;
  priority: number;
  status: HypothesisStatus;
  comment?: string;
  deadline?: string;
};

export type ProjectData = {
  periodCurrent: Channel[];
  periodPrevious: Channel[];
  hypotheses: Hypothesis[];
};

export type ProjectSettings = {
  onboardingCompleted: boolean;
  demoMode: boolean;
};

export type ProjectState = ProjectData & {
  settings: ProjectSettings;
};

export type ChannelMetricKey =
  | "impressions"
  | "clicks"
  | "cost"
  | "leads"
  | "sales"
  | "revenue";
