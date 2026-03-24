import { useMemo, useState } from "react";
import { Button } from "shared/components/Button";
import { PageIntro } from "shared/components/PageIntro";
import { UtmFormView } from "./components/UtmForm";
import { buildUtmLink, UtmForm } from "./logic/buildUtmLink";

const initialState: UtmForm = {
  baseUrl: "https://example.com",
  source: "",
  medium: "",
  campaign: "",
  content: "",
  term: "",
};

export const UtmPage = () => {
  const [form, setForm] = useState<UtmForm>(initialState);
  const generatedUrl = useMemo(() => buildUtmLink(form), [form]);

  return (
    <div className="utm-grid">
      <section className="panel">
        <PageIntro
          eyebrow="UTM"
          title="UTM builder"
          description="Быстрый конструктор чистых UTM-ссылок с пресетами под типовые маркетинговые каналы."
        />
        <div className="toolbar" style={{ marginTop: 18 }}>
          <Button variant="ghost" onClick={() => generatedUrl && navigator.clipboard.writeText(generatedUrl)}>
            Копировать ссылку
          </Button>
          <Button variant="ghost" onClick={() => setForm(initialState)}>
            Очистить
          </Button>
        </div>
      </section>
      <UtmFormView value={form} onChange={setForm} generatedUrl={generatedUrl} />
    </div>
  );
};
