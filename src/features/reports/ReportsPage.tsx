import { useState } from "react";
import { Channel } from "entities/types";
import { Button } from "shared/components/Button";
import { PageIntro } from "shared/components/PageIntro";
import { downloadTextFile } from "shared/utils/download";
import { ReportView } from "./components/ReportView";
import { generateReport, reportToText } from "./logic/generateReport";

type Props = {
  current: Channel[];
  previous: Channel[];
};

export const ReportsPage = ({ current, previous }: Props) => {
  const [report, setReport] = useState(() => generateReport(current, previous));

  const rebuildReport = () => setReport(generateReport(current, previous));
  const text = reportToText(report);

  return (
    <div className="reports-grid">
      <section className="panel">
        <PageIntro
          eyebrow="Reports"
          title="Готовые текстовые выводы"
          description="Деловой отчёт на основе фактических данных проекта без генерации выдуманных выводов."
        />
        <div className="toolbar" style={{ marginTop: 18 }}>
          <Button variant="ghost" onClick={() => navigator.clipboard.writeText(text)}>
            Копировать
          </Button>
          <Button variant="ghost" onClick={() => downloadTextFile("marketing-report.txt", text)}>
            Скачать TXT
          </Button>
          <Button onClick={rebuildReport}>Пересоздать</Button>
        </div>
      </section>
      <section className="panel">
        <ReportView report={report} />
      </section>
    </div>
  );
};
