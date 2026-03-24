type Props = {
  eyebrow: string;
  title: string;
  description: string;
};

export const PageIntro = ({ eyebrow, title, description }: Props) => (
  <div>
    <div className="pill">{eyebrow}</div>
    <h1 style={{ marginTop: 12, marginBottom: 8 }}>{title}</h1>
    <div className="muted">{description}</div>
  </div>
);
