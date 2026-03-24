import { ReportResult } from "../logic/generateReport";

type Props = {
  report: ReportResult;
};

export const ReportView = ({ report }: Props) => (
  <div className="page-grid">
    <div className="report-block">
      <strong>Weekly summary</strong>
      <p style={{ marginBottom: 0 }}>{report.summary}</p>
    </div>
    <div className="report-block">
      <strong>Monthly summary / insights</strong>
      <pre style={{ whiteSpace: "pre-wrap", margin: "12px 0 0" }}>{report.insights}</pre>
    </div>
    <div className="report-block">
      <strong>Рекомендации</strong>
      <pre style={{ whiteSpace: "pre-wrap", margin: "12px 0 0" }}>{report.recommendations}</pre>
    </div>
  </div>
);
