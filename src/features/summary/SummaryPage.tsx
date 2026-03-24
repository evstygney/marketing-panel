import { Channel, ChannelMetricKey } from "entities/types";
import { PageIntro } from "shared/components/PageIntro";
import { SectionHeading } from "shared/components/SectionHeading";
import { formatCurrency, formatPercent } from "shared/utils/numbers";
import { ChannelsTable } from "./components/ChannelsTable";
import { KpiCards } from "./components/KpiCards";
import { PasteChannelsCard } from "./components/PasteChannelsCard";
import { parsePastedChannels } from "./logic/parsePastedChannels";
import { getAggregateMetrics, getChannelMetrics } from "./logic/calculateMetrics";

type Props = {
  current: Channel[];
  previous: Channel[];
  onUpdateCurrent: (channelName: string, field: ChannelMetricKey, value: number) => void;
  onUpdatePrevious: (channelName: string, field: ChannelMetricKey, value: number) => void;
  onReplaceCurrent: (channels: Channel[]) => void;
  onReplacePrevious: (channels: Channel[]) => void;
};

export const SummaryPage = ({
  current,
  previous,
  onUpdateCurrent,
  onUpdatePrevious,
  onReplaceCurrent,
  onReplacePrevious,
}: Props) => {
  const currentMetrics = getChannelMetrics(current);
  const previousMetrics = getChannelMetrics(previous);
  const currentAggregate = getAggregateMetrics(current);
  const previousAggregate = getAggregateMetrics(previous);

  return (
    <div className="summary-grid">
      <div className="page-grid">
        <section className="panel">
          <PageIntro
            eyebrow="Summary"
            title="Сводка по каналам"
            description="Быстрый ввод данных, расчёт KPI и сравнение текущего периода с предыдущим."
          />
          <div className="badge-row" style={{ marginTop: 18 }}>
            <div className="badge">Общий расход: {formatCurrency(currentAggregate.cost)}</div>
            <div className="badge">CTR: {formatPercent(currentAggregate.ctr)}</div>
            <div className="badge">ROAS: {currentAggregate.roas.toFixed(2)}</div>
          </div>
        </section>

        <PasteChannelsCard
          onApplyCurrent={(raw) => onReplaceCurrent(parsePastedChannels(raw))}
          onApplyPrevious={(raw) => onReplacePrevious(parsePastedChannels(raw))}
        />

        <ChannelsTable
          title="Текущий период"
          description="Редактируемая таблица для ежедневного ввода."
          rows={currentMetrics}
          editable
          onChange={onUpdateCurrent}
        />
        <ChannelsTable
          title="Предыдущий период"
          description="Базовый период для сравнения динамики."
          rows={previousMetrics}
          editable
          onChange={onUpdatePrevious}
        />
      </div>

      <div className="page-grid">
        <section className="panel">
          <SectionHeading
            title="KPI карточки"
            description="Ключевые показатели по проекту с динамикой к прошлому периоду."
          />
          <KpiCards current={currentAggregate} previous={previousAggregate} />
        </section>

        <section className="panel">
          <SectionHeading
            title="Структура каналов"
            description="Доли в расходах, лидах и выручке для текущего периода."
          />
          <div className="insight-list">
            {currentMetrics.map((item) => (
              <div key={item.name} className="insight-card">
                <strong>{item.name}</strong>
                <div className="small-note">
                  Расход {formatPercent(item.costShare)} • Лиды {formatPercent(item.leadShare)} • Выручка{" "}
                  {formatPercent(item.revenueShare)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
