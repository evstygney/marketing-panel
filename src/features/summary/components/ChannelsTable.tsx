import { Channel, ChannelMetricKey } from "entities/types";
import { formatCurrency, formatNumber, formatPercent, toNumber } from "shared/utils/numbers";
import { ChannelMetrics } from "../logic/calculateMetrics";

type Props = {
  title: string;
  description: string;
  rows: Array<Channel & Partial<ChannelMetrics>>;
  editable?: boolean;
  onChange?: (channelName: string, field: ChannelMetricKey, value: number) => void;
};

const fields: Array<{ key: ChannelMetricKey; label: string }> = [
  { key: "impressions", label: "Impr." },
  { key: "clicks", label: "Clicks" },
  { key: "cost", label: "Cost" },
  { key: "leads", label: "Leads" },
  { key: "sales", label: "Sales" },
  { key: "revenue", label: "Revenue" },
];

export const ChannelsTable = ({ title, description, rows, editable = false, onChange }: Props) => (
  <section className="table-card">
    <div className="section-heading">
      <div>
        <h3>{title}</h3>
        <div className="muted">{description}</div>
      </div>
    </div>

    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Канал</th>
            {fields.map((field) => (
              <th key={field.key}>{field.label}</th>
            ))}
            <th>CTR</th>
            <th>CPL</th>
            <th>CPA</th>
            <th>ROAS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              {fields.map((field) => (
                <td key={field.key}>
                  {editable && onChange ? (
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={row[field.key]}
                      onChange={(event) => onChange(row.name, field.key, toNumber(event.target.value))}
                    />
                  ) : field.key === "cost" || field.key === "revenue" ? (
                    formatCurrency(row[field.key])
                  ) : (
                    formatNumber(row[field.key])
                  )}
                </td>
              ))}
              <td>{formatPercent(row.ctr ?? 0)}</td>
              <td>{formatCurrency(row.cpl ?? 0)}</td>
              <td>{formatCurrency(row.cpa ?? 0)}</td>
              <td>{formatNumber(row.roas ?? 0, 2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
