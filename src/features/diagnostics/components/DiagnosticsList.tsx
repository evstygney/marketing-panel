import { DiagnosticItem } from "../logic/rulesEngine";

type Props = {
  items: DiagnosticItem[];
};

const labels = {
  critical: "Критично",
  warning: "Внимание",
  growth: "Рост",
} as const;

export const DiagnosticsList = ({ items }: Props) => (
  <div className="insight-list">
    {items.map((item, index) => (
      <div key={`${item.type}-${index}`} className={`insight-card insight-${item.type}`.trim()}>
        <div className="pill">{labels[item.type]}</div>
        <p style={{ marginBottom: 0 }}>{item.message}</p>
      </div>
    ))}
  </div>
);
