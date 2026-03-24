import { Hypothesis, HypothesisStatus } from "entities/types";
import { HYPOTHESIS_STATUSES } from "shared/constants/channels";

type Props = {
  hypotheses: Hypothesis[];
  filter: string;
  onFilterChange: (value: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onUpdate: (hypothesis: Hypothesis) => void;
};

export const HypothesesTable = ({
  hypotheses,
  filter,
  onFilterChange,
  onCreate,
  onDelete,
  onUpdate,
}: Props) => (
  <section className="table-card">
    <div className="section-heading">
      <div>
        <h3>Backlog гипотез</h3>
        <div className="muted">Приоритет считается автоматически как impact / effort.</div>
      </div>
      <div className="button-row">
        <select className="field" value={filter} onChange={(event) => onFilterChange(event.target.value)}>
          <option value="all">Все статусы</option>
          {HYPOTHESIS_STATUSES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <button className="button" type="button" onClick={onCreate}>
          Добавить гипотезу
        </button>
      </div>
    </div>

    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Channel</th>
            <th>Impact</th>
            <th>Effort</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Comment</th>
            <th>Deadline</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {hypotheses.map((item) => (
            <tr key={item.id}>
              <td>
                <input value={item.title} onChange={(event) => onUpdate({ ...item, title: event.target.value })} />
              </td>
              <td>
                <input value={item.channel} onChange={(event) => onUpdate({ ...item, channel: event.target.value })} />
              </td>
              <td>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={item.impact}
                  onChange={(event) => onUpdate({ ...item, impact: Number(event.target.value) || 1 })}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={item.effort}
                  onChange={(event) => onUpdate({ ...item, effort: Number(event.target.value) || 1 })}
                />
              </td>
              <td>{item.priority.toFixed(2)}</td>
              <td>
                <select
                  value={item.status}
                  onChange={(event) => onUpdate({ ...item, status: event.target.value as HypothesisStatus })}
                >
                  {HYPOTHESIS_STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <input
                  value={item.comment ?? ""}
                  onChange={(event) => onUpdate({ ...item, comment: event.target.value })}
                />
              </td>
              <td>
                <input
                  type="date"
                  value={item.deadline ?? ""}
                  onChange={(event) => onUpdate({ ...item, deadline: event.target.value })}
                />
              </td>
              <td>
                <button className="danger-button" type="button" onClick={() => onDelete(item.id)}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);
