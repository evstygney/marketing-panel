import { Channel, Hypothesis, ProjectState } from "entities/types";

const escapeCsv = (value: string | number) => `"${String(value).replace(/"/g, "\"\"")}"`;

const channelsToCsv = (rows: Channel[], label: string) => {
  const header = ["period", "channel", "impressions", "clicks", "cost", "leads", "sales", "revenue"];
  const body = rows.map((row) =>
    [
      escapeCsv(label),
      escapeCsv(row.name),
      row.impressions,
      row.clicks,
      row.cost,
      row.leads,
      row.sales,
      row.revenue,
    ].join(","),
  );

  return [header.join(","), ...body].join("\n");
};

const hypothesesToCsv = (rows: Hypothesis[]) => {
  const header = ["id", "title", "channel", "impact", "effort", "priority", "status", "comment", "deadline"];
  const body = rows.map((row) =>
    [
      escapeCsv(row.id),
      escapeCsv(row.title),
      escapeCsv(row.channel),
      row.impact,
      row.effort,
      row.priority,
      escapeCsv(row.status),
      escapeCsv(row.comment ?? ""),
      escapeCsv(row.deadline ?? ""),
    ].join(","),
  );

  return [header.join(","), ...body].join("\n");
};

export const projectToCsv = (state: ProjectState): string =>
  [
    channelsToCsv(state.periodCurrent, "current"),
    "",
    channelsToCsv(state.periodPrevious, "previous"),
    "",
    hypothesesToCsv(state.hypotheses),
  ].join("\n");
