import { Channel, DiagnosticThresholds } from "entities/types";
import { getChannelMetrics, getDeltaPercent } from "features/summary/logic/calculateMetrics";
import { defaultDiagnosticThresholds } from "shared/constants/defaults";

export type DiagnosticItem = {
  id: string;
  type: "critical" | "warning" | "growth";
  channel: string;
  message: string;
  reason: string;
  recommendation: string;
  hypothesisTitle: string;
};

export const runDiagnostics = (
  current: Channel[],
  previous: Channel[],
  thresholds: DiagnosticThresholds = defaultDiagnosticThresholds,
): DiagnosticItem[] => {
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

    if (ctrDelta < -thresholds.ctrDropPercent && cpcDelta > thresholds.cpcGrowthPercent) {
      output.push({
        id: `${channel.name}-creative-auction`,
        type: "critical",
        channel: channel.name,
        message: `${channel.name}: CTR падает, а CPC растёт. Проверьте креативы и давление аукциона.`,
        reason: `CTR ${ctrDelta.toFixed(1)}%, CPC ${cpcDelta.toFixed(1)}% к прошлому периоду.`,
        recommendation: "Обновить креативы, сузить аудитории или пересобрать аукционную стратегию.",
        hypothesisTitle: `Обновить креативы и ставки в ${channel.name}`,
      });
    }

    if (
      channel.clicks >= thresholds.minClicksForLandingIssue &&
      channel.leads > 0 &&
      channel.crClickToLead < thresholds.clickToLeadThreshold
    ) {
      output.push({
        id: `${channel.name}-landing`,
        type: "warning",
        channel: channel.name,
        message: `${channel.name}: клики есть, но лидов мало. Вероятна проблема на лендинге или в оффере.`,
        reason: `CR click→lead ${channel.crClickToLead.toFixed(3)} при ${channel.clicks} кликах.`,
        recommendation: "Перепроверить оффер, форму и соответствие объявления лендингу.",
        hypothesisTitle: `Упростить лендинг для канала ${channel.name}`,
      });
    }

    if (channel.leads >= thresholds.minLeadsForSalesIssue && channel.crLeadToSale < thresholds.leadToSaleThreshold) {
      output.push({
        id: `${channel.name}-sales`,
        type: "warning",
        channel: channel.name,
        message: `${channel.name}: лиды не доходят до продаж. Есть риск просадки на стороне отдела продаж.`,
        reason: `CR lead→sale ${channel.crLeadToSale.toFixed(3)} при ${channel.leads} лидах.`,
        recommendation: "Проверить обработку лидов, SLA и качество квалификации на стороне продаж.",
        hypothesisTitle: `Улучшить обработку лидов из ${channel.name}`,
      });
    }

    if (costDelta > revenueDelta + thresholds.paybackGapPercent) {
      output.push({
        id: `${channel.name}-payback`,
        type: "critical",
        channel: channel.name,
        message: `${channel.name}: расходы растут быстрее выручки. Окупаемость ухудшается.`,
        reason: `Расходы ${costDelta.toFixed(1)}%, выручка ${revenueDelta.toFixed(1)}%.`,
        recommendation: "Снизить неэффективный объём и вернуть бюджет в каналы с лучшим ROAS.",
        hypothesisTitle: `Перераспределить бюджет канала ${channel.name}`,
      });
    }

    if (
      channel.revenueShare > thresholds.highRevenueShareThreshold &&
      channel.costShare < thresholds.lowBudgetShareThreshold
    ) {
      output.push({
        id: `${channel.name}-scale`,
        type: "growth",
        channel: channel.name,
        message: `${channel.name}: высокая выручка при низком бюджете. Канал можно масштабировать.`,
        reason: `Доля выручки ${channel.revenueShare.toFixed(2)}, доля расходов ${channel.costShare.toFixed(2)}.`,
        recommendation: "Постепенно расширить объём и контролировать CPL/ROAS после масштабирования.",
        hypothesisTitle: `Масштабировать ${channel.name} с контролем CPL`,
      });
    }

    if (channel.costShare > thresholds.highCostShareThreshold && channel.sales === 0) {
      output.push({
        id: `${channel.name}-cut`,
        type: "critical",
        channel: channel.name,
        message: `${channel.name}: заметная доля бюджета без продаж. Стоит сократить или остановить активность.`,
        reason: `Доля расходов ${channel.costShare.toFixed(2)} при нулевых продажах.`,
        recommendation: "Сократить бюджет и оставить только тестовые сегменты до подтверждения спроса.",
        hypothesisTitle: `Сократить бюджет ${channel.name} и проверить сегменты`,
      });
    }
  });

  if (output.length === 0) {
    output.push({
      id: "no-critical-signals",
      type: "growth",
      channel: "All",
      message: "Явных критичных сигналов не найдено. Продолжайте мониторить динамику по ключевым каналам.",
      reason: "Пороговые правила не выявили существенных отклонений.",
      recommendation: "Сохранить текущий ритм анализа и точечно усиливать каналы с лучшей окупаемостью.",
      hypothesisTitle: "Проверить возможности масштабирования сильных каналов",
    });
  }

  return output;
};
