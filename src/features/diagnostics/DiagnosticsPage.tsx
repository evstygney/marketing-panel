import { Channel, DiagnosticThresholds } from "entities/types";
import { PageIntro } from "shared/components/PageIntro";
import { DiagnosticsList } from "./components/DiagnosticsList";
import { DiagnosticsSettings } from "./components/DiagnosticsSettings";
import { runDiagnostics } from "./logic/rulesEngine";

type Props = {
  current: Channel[];
  previous: Channel[];
  thresholds: DiagnosticThresholds;
  onThresholdChange: <K extends keyof DiagnosticThresholds>(key: K, value: DiagnosticThresholds[K]) => void;
  onCreateHypothesis: (item: ReturnType<typeof runDiagnostics>[number]) => void;
};

export const DiagnosticsPage = ({ current, previous, thresholds, onThresholdChange, onCreateHypothesis }: Props) => {
  const items = runDiagnostics(current, previous, thresholds);

  return (
    <div className="diagnostics-grid">
      <section className="panel">
        <PageIntro
          eyebrow="Diagnostics"
          title="Rule-based диагностика"
          description="Экран подсвечивает проблемы, узкие места и точки роста без BI-сложности и без внешних API."
        />
      </section>
      <DiagnosticsSettings thresholds={thresholds} onChange={onThresholdChange} />
      <section className="panel">
        <DiagnosticsList items={items} onCreateHypothesis={onCreateHypothesis} />
      </section>
    </div>
  );
};
