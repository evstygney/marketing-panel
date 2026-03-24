import { DiagnosticItem } from "../logic/rulesEngine";
import { Button } from "shared/components/Button";

type Props = {
  items: DiagnosticItem[];
  onCreateHypothesis: (item: DiagnosticItem) => void;
};

const labels = {
  critical: "Критично",
  warning: "Внимание",
  growth: "Рост",
} as const;

export const DiagnosticsList = ({ items, onCreateHypothesis }: Props) => (
  <div className="insight-list">
    {items.map((item, index) => (
      <div key={`${item.type}-${index}`} className={`insight-card insight-${item.type}`.trim()}>
        <div className="pill">{labels[item.type]}</div>
        <p>{item.message}</p>
        <div className="small-note">{item.reason}</div>
        <div className="small-note" style={{ marginTop: 8 }}>
          Действие: {item.recommendation}
        </div>
        {item.channel !== "All" ? (
          <div className="button-row" style={{ marginTop: 12 }}>
            <Button variant="ghost" onClick={() => onCreateHypothesis(item)}>
              Создать гипотезу
            </Button>
          </div>
        ) : null}
      </div>
    ))}
  </div>
);
