import { SummaryAggregate, getDeltaPercent } from "../logic/calculateMetrics";
import { formatCurrency, formatDelta, formatNumber, formatPercent } from "shared/utils/numbers";

type Props = {
  current: SummaryAggregate;
  previous: SummaryAggregate;
};

const items = [
  { key: "cost", label: "Расход", format: formatCurrency },
  { key: "leads", label: "Лиды", format: (value: number) => formatNumber(value) },
  { key: "sales", label: "Продажи", format: (value: number) => formatNumber(value) },
  { key: "revenue", label: "Выручка", format: formatCurrency },
  { key: "ctr", label: "CTR", format: (value: number) => formatPercent(value) },
  { key: "roas", label: "ROAS", format: (value: number) => formatNumber(value, 2) },
] as const;

export const KpiCards = ({ current, previous }: Props) => (
  <div className="kpi-grid">
    {items.map((item) => {
      const delta = getDeltaPercent(current[item.key], previous[item.key]);
      const tone = delta > 0 ? "positive" : delta < 0 ? "negative" : "neutral";
      return (
        <div key={item.key} className="kpi-card">
          <div className="kpi-label">{item.label}</div>
          <div className="kpi-value">{item.format(current[item.key])}</div>
          <div className={`kpi-delta ${tone}`.trim()}>к прошлому периоду {formatDelta(delta)}</div>
        </div>
      );
    })}
  </div>
);
