import { ProjectState, Channel, Hypothesis, HypothesisStatus } from "entities/types";
import { createEmptyChannels, defaultDiagnosticThresholds, emptyState } from "shared/constants/defaults";

const parseCsvLine = (line: string): string[] => {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values.map((value) => value.trim());
};

const toNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const mergeChannels = (rows: Channel[]): Channel[] => {
  const defaults = createEmptyChannels();
  const byName = new Map(rows.map((row) => [row.name, row]));

  return defaults.map((channel) => byName.get(channel.name) ?? channel);
};

const normalizeHypothesisStatus = (value: string): HypothesisStatus => {
  const allowed: HypothesisStatus[] = ["new", "planned", "in_progress", "done", "rejected"];
  return allowed.includes(value as HypothesisStatus) ? (value as HypothesisStatus) : "new";
};

export const normalizeImportedState = (value: Partial<ProjectState>): ProjectState => ({
  periodCurrent: mergeChannels(value.periodCurrent ?? []),
  periodPrevious: mergeChannels(value.periodPrevious ?? []),
  hypotheses: (value.hypotheses ?? []).map((item) => ({
    ...item,
    impact: item.impact || 1,
    effort: item.effort || 1,
    priority: item.effort > 0 ? item.impact / item.effort : 0,
    status: normalizeHypothesisStatus(item.status),
  })),
  settings: {
    ...emptyState.settings,
    ...value.settings,
    diagnosticThresholds: {
      ...defaultDiagnosticThresholds,
      ...value.settings?.diagnosticThresholds,
    },
    onboardingCompleted: true,
  },
});

export const parseJsonState = (raw: string): ProjectState =>
  normalizeImportedState(JSON.parse(raw) as Partial<ProjectState>);

export const parseCsvState = (raw: string): ProjectState => {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const currentRows: Channel[] = [];
  const previousRows: Channel[] = [];
  const hypotheses: Hypothesis[] = [];

  lines.forEach((line, index) => {
    if (index === 0 && line.startsWith("period,")) {
      return;
    }
    if (line.startsWith("period,")) {
      return;
    }
    if (line.startsWith("id,")) {
      return;
    }

    const cells = parseCsvLine(line);

    if (cells.length === 8) {
      const [period, name, impressions, clicks, cost, leads, sales, revenue] = cells;
      const row: Channel = {
        name,
        impressions: toNumber(impressions),
        clicks: toNumber(clicks),
        cost: toNumber(cost),
        leads: toNumber(leads),
        sales: toNumber(sales),
        revenue: toNumber(revenue),
      };

      if (period === "current") {
        currentRows.push(row);
      }

      if (period === "previous") {
        previousRows.push(row);
      }

      return;
    }

    if (cells.length === 9) {
      const [id, title, channel, impact, effort, , status, comment, deadline] = cells;
      hypotheses.push({
        id,
        title,
        channel,
        impact: toNumber(impact) || 1,
        effort: toNumber(effort) || 1,
        priority: 0,
        status: normalizeHypothesisStatus(status),
        comment: comment || undefined,
        deadline: deadline || undefined,
      });
    }
  });

  return normalizeImportedState({
    periodCurrent: currentRows,
    periodPrevious: previousRows,
    hypotheses,
  });
};
