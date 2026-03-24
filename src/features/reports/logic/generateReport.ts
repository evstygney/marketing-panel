import { Channel } from "entities/types";
import { runDiagnostics } from "features/diagnostics/logic/rulesEngine";
import { getAggregateMetrics, getDeltaPercent } from "features/summary/logic/calculateMetrics";
import { formatCurrency, formatNumber } from "shared/utils/numbers";

export type ReportResult = {
  summary: string;
  insights: string;
  recommendations: string;
};

const buildSummary = (current: Channel[], previous: Channel[]) => {
  const currentAggregate = getAggregateMetrics(current);
  const previousAggregate = getAggregateMetrics(previous);
  const revenueDelta = getDeltaPercent(currentAggregate.revenue, previousAggregate.revenue);
  const leadsDelta = getDeltaPercent(currentAggregate.leads, previousAggregate.leads);
  const roasDelta = getDeltaPercent(currentAggregate.roas, previousAggregate.roas);

  return `За период общий расход составил ${formatCurrency(currentAggregate.cost)}, получено ${formatNumber(currentAggregate.leads)} лидов и ${formatNumber(currentAggregate.sales)} продаж. Выручка достигла ${formatCurrency(currentAggregate.revenue)}, ROAS составил ${formatNumber(currentAggregate.roas, 2)}. К предыдущему периоду выручка изменилась на ${revenueDelta.toFixed(1)}%, лиды на ${leadsDelta.toFixed(1)}%, ROAS на ${roasDelta.toFixed(1)}%.`;
};

const buildInsights = (current: Channel[], previous: Channel[]) =>
  runDiagnostics(current, previous)
    .map((item) => `• ${item.message}`)
    .join("\n");

const buildRecommendations = (current: Channel[]) => {
  const aggregate = getAggregateMetrics(current);
  const recommendations: string[] = [];

  if (aggregate.ctr < 0.04) {
    recommendations.push("Проверить креативы и качество трафика в каналах с низким CTR.");
  }
  if (aggregate.roas < 3) {
    recommendations.push("Пересмотреть распределение бюджета и сократить слабые размещения.");
  }
  if (aggregate.cpl > 2000) {
    recommendations.push("Оптимизировать путь до лида: оффер, форма, скорость лендинга.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Сохранить текущую структуру каналов и точечно масштабировать сегменты с высокой окупаемостью.");
  }

  return recommendations.join("\n");
};

export const generateReport = (current: Channel[], previous: Channel[]): ReportResult => ({
  summary: buildSummary(current, previous),
  insights: buildInsights(current, previous),
  recommendations: buildRecommendations(current),
});

export const reportToText = (report: ReportResult): string =>
  `Weekly / Monthly summary\n\nSummary\n${report.summary}\n\nInsights\n${report.insights}\n\nRecommendations\n${report.recommendations}`;
