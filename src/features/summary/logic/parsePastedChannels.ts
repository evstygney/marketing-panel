import { Channel } from "entities/types";
import { DEFAULT_CHANNELS } from "shared/constants/channels";

const metricKeys = ["impressions", "clicks", "cost", "leads", "sales", "revenue"] as const;

const toNumber = (value: string) => {
  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isChannelName = (value: string) =>
  DEFAULT_CHANNELS.some((channel) => channel.toLowerCase() === value.trim().toLowerCase());

export const parsePastedChannels = (raw: string): Channel[] => {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines
    .map((line, index) => {
      const cells = line.split(/\t|,/).map((cell) => cell.trim());
      const hasChannelCell = isChannelName(cells[0] ?? "");
      const name = hasChannelCell ? cells[0] : DEFAULT_CHANNELS[index];
      const values = hasChannelCell ? cells.slice(1) : cells;

      if (!name || values.length < metricKeys.length) {
        return null;
      }

      return {
        name,
        impressions: toNumber(values[0]),
        clicks: toNumber(values[1]),
        cost: toNumber(values[2]),
        leads: toNumber(values[3]),
        sales: toNumber(values[4]),
        revenue: toNumber(values[5]),
      } satisfies Channel;
    })
    .filter((row): row is Channel => Boolean(row));
};
