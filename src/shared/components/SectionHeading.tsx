import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export const SectionHeading = ({ title, description, actions }: Props) => (
  <div className="section-heading">
    <div>
      <h2>{title}</h2>
      {description ? <div className="muted">{description}</div> : null}
    </div>
    {actions}
  </div>
);
