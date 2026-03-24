import { useMemo, useState } from "react";
import { Hypothesis } from "entities/types";
import { EmptyState } from "shared/components/EmptyState";
import { PageIntro } from "shared/components/PageIntro";
import { HypothesesTable } from "./components/HypothesesTable";

type Props = {
  hypotheses: Hypothesis[];
  onCreate: () => void;
  onUpdate: (hypothesis: Hypothesis) => void;
  onDelete: (id: string) => void;
};

export const HypothesesPage = ({ hypotheses, onCreate, onUpdate, onDelete }: Props) => {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(
    () => hypotheses.filter((item) => filter === "all" || item.status === filter),
    [filter, hypotheses],
  );

  return (
    <div className="hypotheses-grid">
      <section className="panel">
        <PageIntro
          eyebrow="Hypotheses"
          title="Планирование тестов и улучшений"
          description="Храните backlog гипотез, фильтруйте по статусу и быстро сортируйте идеи по ожидаемой отдаче."
        />
      </section>

      {hypotheses.length === 0 ? (
        <section className="panel">
          <EmptyState
            title="Гипотез пока нет"
            description="Добавьте первую гипотезу и оцените её по impact и effort."
          />
        </section>
      ) : null}

      <HypothesesTable
        hypotheses={filtered}
        filter={filter}
        onFilterChange={setFilter}
        onCreate={onCreate}
        onDelete={onDelete}
        onUpdate={onUpdate}
      />
    </div>
  );
};
