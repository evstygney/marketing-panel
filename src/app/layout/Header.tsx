import { Button } from "shared/components/Button";

type Props = {
  title: string;
  subtitle: string;
  onExportJson: () => void;
  onExportCsv: () => void;
  onImportJson: () => void;
  onImportCsv: () => void;
  onLoadDemo: () => void;
  onReset: () => void;
};

export const Header = ({
  title,
  subtitle,
  onExportJson,
  onExportCsv,
  onImportJson,
  onImportCsv,
  onLoadDemo,
  onReset,
}: Props) => (
  <header className="header-card">
    <div>
      <h1>{title}</h1>
      <div className="muted">{subtitle}</div>
    </div>

    <div className="header-actions">
      <Button variant="ghost" onClick={onLoadDemo}>
        Демо-режим
      </Button>
      <Button variant="ghost" onClick={onImportJson}>
        Импорт JSON
      </Button>
      <Button variant="ghost" onClick={onImportCsv}>
        Импорт CSV
      </Button>
      <Button variant="ghost" onClick={onExportJson}>
        Экспорт JSON
      </Button>
      <Button variant="ghost" onClick={onExportCsv}>
        Экспорт CSV
      </Button>
      <Button variant="danger" onClick={onReset}>
        Сброс
      </Button>
    </div>
  </header>
);
