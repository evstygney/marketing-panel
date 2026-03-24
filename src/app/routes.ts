export const routes = {
  summary: "summary",
  diagnostics: "diagnostics",
  reports: "reports",
  utm: "utm",
  hypotheses: "hypotheses",
} as const;

export type AppRoute = (typeof routes)[keyof typeof routes];

export const routeItems: Array<{ key: AppRoute; label: string }> = [
  { key: routes.summary, label: "Summary" },
  { key: routes.diagnostics, label: "Diagnostics" },
  { key: routes.reports, label: "Reports" },
  { key: routes.utm, label: "UTM" },
  { key: routes.hypotheses, label: "Hypotheses" },
];
