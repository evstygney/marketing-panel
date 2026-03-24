import { Channel } from "entities/types";
import { PageIntro } from "shared/components/PageIntro";
import { DiagnosticsList } from "./components/DiagnosticsList";
import { runDiagnostics } from "./logic/rulesEngine";

type Props = {
  current: Channel[];
  previous: Channel[];
};

export const DiagnosticsPage = ({ current, previous }: Props) => {
  const items = runDiagnostics(current, previous);

  return (
    <div className="diagnostics-grid">
      <section className="panel">
        <PageIntro
          eyebrow="Diagnostics"
          title="Rule-based диагностика"
          description="Экран подсвечивает проблемы, узкие места и точки роста без BI-сложности и без внешних API."
        />
      </section>
      <section className="panel">
        <DiagnosticsList items={items} />
      </section>
    </div>
  );
};
