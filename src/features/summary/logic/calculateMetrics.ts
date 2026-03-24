import { Channel } from "entities/types";
import { safeDivide } from "shared/utils/numbers";

export type ChannelMetrics = {
  ctr: number;
  cpc: number;
  cpl: number;
  cpa: number;
  crClickToLead: number;
  crLeadToSale: number;
  roas: number;
  costShare: number;
  leadShare: number;
  revenueShare: number;
};

export type SummaryTotals = {
  impressions: number;
  clicks: number;
  cost: number;
  leads: number;
  sales: number;
  revenue: number;
};

export type SummaryAggregate = SummaryTotals & {
  ctr: number;
  cpc: number;
  cpl: number;
  cpa: number;
  roas: number;
};

const sumField = (channels: Channel[], field: keyof SummaryTotals) =>
  channels.reduce((acc, item) => acc + item[field], 0);

export const getSummaryTotals = (channels: Channel[]): SummaryTotals => ({
  impressions: sumField(channels, "impressions"),
  clicks: sumField(channels, "clicks"),
  cost: sumField(channels, "cost"),
  leads: sumField(channels, "leads"),
  sales: sumField(channels, "sales"),
  revenue: sumField(channels, "revenue"),
});

export const getAggregateMetrics = (channels: Channel[]): SummaryAggregate => {
  const totals = getSummaryTotals(channels);

  return {
    ...totals,
    ctr: safeDivide(totals.clicks, totals.impressions),
    cpc: safeDivide(totals.cost, totals.clicks),
    cpl: safeDivide(totals.cost, totals.leads),
    cpa: safeDivide(totals.cost, totals.sales),
    roas: safeDivide(totals.revenue, totals.cost),
  };
};

export const getChannelMetrics = (channels: Channel[]): Array<Channel & ChannelMetrics> => {
  const totals = getSummaryTotals(channels);

  return channels.map((channel) => ({
    ...channel,
    ctr: safeDivide(channel.clicks, channel.impressions),
    cpc: safeDivide(channel.cost, channel.clicks),
    cpl: safeDivide(channel.cost, channel.leads),
    cpa: safeDivide(channel.cost, channel.sales),
    crClickToLead: safeDivide(channel.leads, channel.clicks),
    crLeadToSale: safeDivide(channel.sales, channel.leads),
    roas: safeDivide(channel.revenue, channel.cost),
    costShare: safeDivide(channel.cost, totals.cost),
    leadShare: safeDivide(channel.leads, totals.leads),
    revenueShare: safeDivide(channel.revenue, totals.revenue),
  }));
};

export const getDeltaPercent = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return ((current - previous) / previous) * 100;
};
