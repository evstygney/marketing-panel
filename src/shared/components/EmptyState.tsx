type Props = {
  title: string;
  description: string;
};

export const EmptyState = ({ title, description }: Props) => (
  <div className="report-block">
    <strong>{title}</strong>
    <div className="muted">{description}</div>
  </div>
);
