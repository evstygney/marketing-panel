import { AppRoute, routeItems } from "app/routes";

type Props = {
  route: AppRoute;
  onNavigate: (route: AppRoute) => void;
};

export const Sidebar = ({ route, onNavigate }: Props) => (
  <aside className="sidebar">
    <div>
      <div className="pill">Marketing OS</div>
      <h1 style={{ marginTop: 14 }}>Панель интернет-маркетолога</h1>
      <p className="muted" style={{ marginBottom: 0 }}>
        Ежедневная рабочая панель для каналов, выводов и гипотез.
      </p>
    </div>

    <nav className="sidebar-nav">
      {routeItems.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`nav-item ${route === item.key ? "active" : ""}`.trim()}
          onClick={() => onNavigate(item.key)}
        >
          {item.label}
        </button>
      ))}
    </nav>

    <div className="report-block">
      <strong>Как использовать</strong>
      <p className="muted" style={{ marginBottom: 0 }}>
        Введите текущий и прошлый период, проверьте диагностику, затем выгрузите готовый отчёт.
      </p>
    </div>
  </aside>
);
