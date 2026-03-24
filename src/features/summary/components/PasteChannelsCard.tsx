import { useState } from "react";
import { Button } from "shared/components/Button";
import { parsePastedChannels } from "../logic/parsePastedChannels";

type Props = {
  onApplyCurrent: (raw: string) => void;
  onApplyPrevious: (raw: string) => void;
};

export const PasteChannelsCard = ({ onApplyCurrent, onApplyPrevious }: Props) => {
  const [raw, setRaw] = useState("");

  const hasRows = parsePastedChannels(raw).length > 0;

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <h3>Быстрая вставка из Excel / Sheets</h3>
          <div className="muted">
            Вставьте строки табличного диапазона. Поддерживается формат с названием канала в первом столбце или только числовые столбцы по порядку каналов.
          </div>
        </div>
      </div>

      <div className="page-grid">
        <textarea
          className="textarea"
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
          placeholder={`SEO\t82000\t5900\t950\t270\t54\t9400\nPPC\t145000\t6900\t5200\t310\t68\t13800`}
        />
        <div className="button-row">
          <Button variant="ghost" onClick={() => setRaw("")}>
            Очистить
          </Button>
          <Button disabled={!hasRows} onClick={() => onApplyCurrent(raw)}>
            Применить к текущему периоду
          </Button>
          <Button disabled={!hasRows} variant="ghost" onClick={() => onApplyPrevious(raw)}>
            Применить к прошлому периоду
          </Button>
        </div>
      </div>
    </section>
  );
};
