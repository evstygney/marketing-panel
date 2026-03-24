import { DiagnosticThresholds } from "entities/types";
import { toNumber } from "shared/utils/numbers";

type Props = {
  thresholds: DiagnosticThresholds;
  onChange: <K extends keyof DiagnosticThresholds>(key: K, value: DiagnosticThresholds[K]) => void;
};

const fields: Array<{ key: keyof DiagnosticThresholds; label: string; step?: string }> = [
  { key: "ctrDropPercent", label: "CTR drop %" },
  { key: "cpcGrowthPercent", label: "CPC growth %" },
  { key: "minClicksForLandingIssue", label: "Min clicks for landing issue" },
  { key: "clickToLeadThreshold", label: "CR click→lead threshold", step: "0.01" },
  { key: "minLeadsForSalesIssue", label: "Min leads for sales issue" },
  { key: "leadToSaleThreshold", label: "CR lead→sale threshold", step: "0.01" },
  { key: "paybackGapPercent", label: "Payback gap %" },
  { key: "highRevenueShareThreshold", label: "High revenue share", step: "0.01" },
  { key: "lowBudgetShareThreshold", label: "Low budget share", step: "0.01" },
  { key: "highCostShareThreshold", label: "High cost share", step: "0.01" },
];

export const DiagnosticsSettings = ({ thresholds, onChange }: Props) => (
  <section className="panel">
    <div className="section-heading">
      <div>
        <h3>Пороги правил</h3>
        <div className="muted">Меняйте thresholds под ваш проект без переписывания логики.</div>
      </div>
    </div>

    <div className="field-grid">
      {fields.map((field) => (
        <label key={field.key} className="field-group">
          <span>{field.label}</span>
          <input
            className="field"
            type="number"
            min="0"
            step={field.step ?? "1"}
            value={thresholds[field.key]}
            onChange={(event) => onChange(field.key, toNumber(event.target.value))}
          />
        </label>
      ))}
    </div>
  </section>
);
