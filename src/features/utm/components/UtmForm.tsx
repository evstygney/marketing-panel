import { ChangeEvent } from "react";
import { Button } from "shared/components/Button";
import { UtmForm, utmPresets } from "../logic/buildUtmLink";

type Props = {
  value: UtmForm;
  onChange: (next: UtmForm) => void;
  generatedUrl: string;
};

const fields: Array<{ key: keyof UtmForm; label: string }> = [
  { key: "baseUrl", label: "Base URL" },
  { key: "source", label: "Source" },
  { key: "medium", label: "Medium" },
  { key: "campaign", label: "Campaign" },
  { key: "content", label: "Content" },
  { key: "term", label: "Term" },
];

export const UtmFormView = ({ value, onChange, generatedUrl }: Props) => {
  const updateField =
    (key: keyof UtmForm) =>
    (event: ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [key]: event.target.value });

  return (
    <div className="page-grid">
      <div className="builder-card">
        <div className="section-heading">
          <div>
            <h3>UTM builder</h3>
            <div className="muted">Нормализует параметры, приводит их к lower-case и заменяет пробелы на "-".</div>
          </div>
        </div>

        <div className="badge-row" style={{ marginBottom: 18 }}>
          {utmPresets.map((preset) => (
            <Button
              key={preset.name}
              variant="ghost"
              onClick={() =>
                onChange({
                  ...value,
                  source: preset.source,
                  medium: preset.medium,
                })
              }
            >
              {preset.name}
            </Button>
          ))}
        </div>

        <div className="field-grid">
          {fields.map((field) => (
            <label key={field.key} className="field-group">
              <span>{field.label}</span>
              <input className="field" value={value[field.key]} onChange={updateField(field.key)} />
            </label>
          ))}
        </div>
      </div>

      <div className="builder-card">
        <div className="section-heading">
          <div>
            <h3>Готовая ссылка</h3>
            <div className="muted">Можно копировать и вставлять в рекламные кабинеты или отчёты.</div>
          </div>
        </div>
        <div className="report-block">{generatedUrl || "Добавьте базовый URL и параметры кампании."}</div>
      </div>
    </div>
  );
};
