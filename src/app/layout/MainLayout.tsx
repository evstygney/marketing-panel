import { ReactNode } from "react";
import { AppRoute } from "app/routes";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

type Props = {
  route: AppRoute;
  onNavigate: (route: AppRoute) => void;
  headerTitle: string;
  headerSubtitle: string;
  onExportJson: () => void;
  onExportCsv: () => void;
  onImportJson: () => void;
  onImportCsv: () => void;
  onLoadDemo: () => void;
  onReset: () => void;
  children: ReactNode;
};

export const MainLayout = ({
  route,
  onNavigate,
  headerTitle,
  headerSubtitle,
  onExportJson,
  onExportCsv,
  onImportJson,
  onImportCsv,
  onLoadDemo,
  onReset,
  children,
}: Props) => (
  <div className="app-shell">
    <Sidebar route={route} onNavigate={onNavigate} />
    <div className="layout-main">
      <Header
        title={headerTitle}
        subtitle={headerSubtitle}
        onExportJson={onExportJson}
        onExportCsv={onExportCsv}
        onImportJson={onImportJson}
        onImportCsv={onImportCsv}
        onLoadDemo={onLoadDemo}
        onReset={onReset}
      />
      <main className="page-grid">{children}</main>
    </div>
  </div>
);
