import { useRef } from "react";
import { ProjectState } from "entities/types";
import { DiagnosticItem } from "features/diagnostics/logic/rulesEngine";
import { DiagnosticsPage } from "features/diagnostics/DiagnosticsPage";
import { HypothesesPage } from "features/hypotheses/HypothesesPage";
import { ReportsPage } from "features/reports/ReportsPage";
import { SummaryPage } from "features/summary/SummaryPage";
import { UtmPage } from "features/utm/UtmPage";
import { Button } from "shared/components/Button";
import { useHashRoute } from "shared/hooks/useHashRoute";
import { projectToCsv } from "shared/utils/csv";
import { downloadTextFile } from "shared/utils/download";
import { normalizeImportedState, parseCsvState, parseJsonState } from "shared/utils/importState";
import { MainLayout } from "./layout/MainLayout";
import { AppRoute, routes } from "./routes";
import { MarketingStoreProvider, useMarketingStore } from "./store/MarketingStore";

const titles: Record<AppRoute, { title: string; subtitle: string }> = {
  summary: {
    title: "Сводка и ввод данных",
    subtitle: "Текущий и прошлый период, KPI и структура каналов.",
  },
  diagnostics: {
    title: "Диагностика проблем и точек роста",
    subtitle: "Rule-based сигналы по маркетинговым каналам.",
  },
  reports: {
    title: "Текстовые отчёты",
    subtitle: "Готовые summary, insights и рекомендации.",
  },
  utm: {
    title: "UTM builder",
    subtitle: "Генерация чистых ссылок без ручной рутины.",
  },
  hypotheses: {
    title: "Гипотезы и приоритезация",
    subtitle: "Backlog тестов с impact / effort и дедлайнами.",
  },
};

const createHypothesisDraft = () => ({
  id: crypto.randomUUID(),
  title: "Новая гипотеза",
  channel: "PPC",
  impact: 3,
  effort: 2,
  priority: 1.5,
  status: "new" as const,
  comment: "",
  deadline: "",
});

const createHypothesisFromDiagnostic = (item: DiagnosticItem) => ({
  id: crypto.randomUUID(),
  title: item.hypothesisTitle,
  channel: item.channel,
  impact: item.type === "critical" ? 5 : item.type === "growth" ? 4 : 3,
  effort: item.type === "growth" ? 2 : 3,
  priority: item.type === "growth" ? 2 : item.type === "critical" ? 1.67 : 1,
  status: "new" as const,
  comment: `${item.message} ${item.recommendation}`,
  deadline: "",
});

const Onboarding = ({
  onUseDemo,
  onStartBlank,
}: {
  onUseDemo: () => void;
  onStartBlank: () => void;
}) => (
  <div className="onboarding-overlay">
    <div className="onboarding-card">
      <div className="pill">Onboarding</div>
      <h2>Панель интернет-маркетолога</h2>
      <p className="muted">
        Три шага: загрузите демо или начните с пустой таблицы, заполните каналы, затем получите диагностику и отчёт.
      </p>

      <div className="steps">
        <div className="step">
          <div className="step-index">1</div>
          <div>
            <strong>Заполните каналы</strong>
            <div className="muted">Текущий и предыдущий период хранятся локально через localStorage.</div>
          </div>
        </div>
        <div className="step">
          <div className="step-index">2</div>
          <div>
            <strong>Проверьте диагностику</strong>
            <div className="muted">Rule-based правила подсветят слабые места и точки роста.</div>
          </div>
        </div>
        <div className="step">
          <div className="step-index">3</div>
          <div>
            <strong>Соберите выводы</strong>
            <div className="muted">Отчёт, гипотезы и UTM-ссылки доступны из бокового меню.</div>
          </div>
        </div>
      </div>

      <div className="button-row">
        <Button onClick={onUseDemo}>Загрузить демо-режим</Button>
        <Button variant="ghost" onClick={onStartBlank}>
          Начать с пустого проекта
        </Button>
      </div>
    </div>
  </div>
);

const AppContent = () => {
  const { route, navigate } = useHashRoute();
  const { state, actions } = useMarketingStore();
  const jsonInputRef = useRef<HTMLInputElement | null>(null);
  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const header = titles[route];

  const exportJson = () =>
    downloadTextFile("marketing-dashboard.json", JSON.stringify(state, null, 2), "application/json");
  const exportCsv = () => downloadTextFile("marketing-dashboard.csv", projectToCsv(state), "text/csv;charset=utf-8");
  const importJson = () => jsonInputRef.current?.click();
  const importCsv = () => csvInputRef.current?.click();

  const renderPage = () => {
    switch (route) {
      case routes.summary:
        return (
          <SummaryPage
            current={state.periodCurrent}
            previous={state.periodPrevious}
            onUpdateCurrent={(channelName, field, value) =>
              actions.updateChannel("periodCurrent", channelName, field, value)
            }
            onUpdatePrevious={(channelName, field, value) =>
              actions.updateChannel("periodPrevious", channelName, field, value)
            }
            onReplaceCurrent={(channels) => actions.replacePeriodChannels("periodCurrent", channels)}
            onReplacePrevious={(channels) => actions.replacePeriodChannels("periodPrevious", channels)}
          />
        );
      case routes.diagnostics:
        return (
          <DiagnosticsPage
            current={state.periodCurrent}
            previous={state.periodPrevious}
            thresholds={state.settings.diagnosticThresholds}
            onThresholdChange={actions.updateDiagnosticThreshold}
            onCreateHypothesis={(item) => actions.createHypothesis(createHypothesisFromDiagnostic(item))}
          />
        );
      case routes.reports:
        return (
          <ReportsPage
            current={state.periodCurrent}
            previous={state.periodPrevious}
            thresholds={state.settings.diagnosticThresholds}
          />
        );
      case routes.utm:
        return <UtmPage />;
      case routes.hypotheses:
        return (
          <HypothesesPage
            hypotheses={state.hypotheses}
            onCreate={() => actions.createHypothesis(createHypothesisDraft())}
            onUpdate={(hypothesis) =>
              actions.updateHypothesis({
                ...hypothesis,
                priority: hypothesis.effort > 0 ? hypothesis.impact / hypothesis.effort : 0,
              })
            }
            onDelete={actions.deleteHypothesis}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {!state.settings.onboardingCompleted ? (
        <Onboarding
          onUseDemo={() => {
            actions.loadDemoState();
            navigate(routes.summary);
          }}
          onStartBlank={() => {
            actions.completeOnboarding();
            navigate(routes.summary);
          }}
        />
      ) : null}

      <input
        ref={jsonInputRef}
        type="file"
        accept="application/json"
        hidden
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }

          const raw = await file.text();
          actions.importState(parseJsonState(raw));
          actions.completeOnboarding();
          event.target.value = "";
        }}
      />

      <input
        ref={csvInputRef}
        type="file"
        accept=".csv,text/csv"
        hidden
        onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) {
            return;
          }

          const raw = await file.text();
          actions.importState(parseCsvState(raw));
          actions.completeOnboarding();
          event.target.value = "";
        }}
      />

      <MainLayout
        route={route}
        onNavigate={navigate}
        headerTitle={header.title}
        headerSubtitle={header.subtitle}
        onExportJson={exportJson}
        onExportCsv={exportCsv}
        onImportJson={importJson}
        onImportCsv={importCsv}
        onLoadDemo={() => actions.loadDemoState()}
        onReset={() => actions.resetState()}
      >
        {renderPage()}
      </MainLayout>
    </>
  );
};

export const App = () => (
  <MarketingStoreProvider>
    <AppContent />
  </MarketingStoreProvider>
);
