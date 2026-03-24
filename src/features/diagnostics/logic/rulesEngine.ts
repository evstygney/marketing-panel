import { Channel } from "entities/types";
import { getChannelMetrics, getDeltaPercent } from "features/summary/logic/calculateMetrics";

export type DiagnosticItem = {
  type: "critical" | "warning" | "growth";
  message: string;
};

export const runDiagnostics = (current: Channel[], previous: Channel[]): DiagnosticItem[] => {
  const currentMetrics = getChannelMetrics(current);
  const previousMap = new Map(getChannelMetrics(previous).map((item) => [item.name, item]));
  const output: DiagnosticItem[] = [];

  currentMetrics.forEach((channel) => {
    const previousChannel = previousMap.get(channel.name);
    if (!previousChannel) {
      return;
    }

    const ctrDelta = getDeltaPercent(channel.ctr, previousChannel.ctr);
    const cpcDelta = getDeltaPercent(channel.cpc, previousChannel.cpc);
    const revenueDelta = getDeltaPercent(channel.revenue, previousChannel.revenue);
    const costDelta = getDeltaPercent(channel.cost, previousChannel.cost);

    if (ctrDelta < -10 && cpcDelta > 10) {
      output.push({
        type: "critical",
        message: `${channel.name}: CTR падает, а CPC растёт. Проверьте креативы и давление аукциона.`,
      });
    }

    if (channel.clicks >= 100 && channel.leads > 0 && channel.crClickToLead < 0.03) {
      output.push({
        type: "warning",
        message: `${channel.name}: клики есть, но лидов мало. Вероятна проблема на лендинге или в оффере.`,
      });
    }

    if (channel.leads >= 30 && channel.crLeadToSale < 0.12) {
      output.push({
        type: "warning",
        message: `${channel.name}: лиды не доходят до продаж. Есть риск просадки на стороне отдела продаж.`,
      });
    }

    if (costDelta > revenueDelta + 10) {
      output.push({
        type: "critical",
        message: `${channel.name}: расходы растут быстрее выручки. Окупаемость ухудшается.`,
      });
    }

    if (channel.revenueShare > 0.14 && channel.costShare < 0.08) {
      output.push({
        type: "growth",
        message: `${channel.name}: высокая выручка при низком бюджете. Канал можно масштабировать.`,
      });
    }

    if (channel.costShare > 0.15 && channel.sales === 0) {
      output.push({
        type: "critical",
        message: `${channel.name}: заметная доля бюджета без продаж. Стоит сократить или остановить активность.`,
      });
    }
  });

  if (output.length === 0) {
    output.push({
      type: "growth",
      message: "Явных критичных сигналов не найдено. Продолжайте мониторить динамику по ключевым каналам.",
    });
  }

  return output;
};
