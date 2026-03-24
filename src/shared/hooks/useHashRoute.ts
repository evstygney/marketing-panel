import { useEffect, useState } from "react";
import { AppRoute, routes } from "app/routes";

const normalizeRoute = (value: string): AppRoute => {
  const route = value.replace("#", "") as AppRoute;
  return Object.values(routes).includes(route) ? route : routes.summary;
};

export const useHashRoute = () => {
  const [route, setRoute] = useState<AppRoute>(() => normalizeRoute(window.location.hash));

  useEffect(() => {
    const handleHashChange = () => setRoute(normalizeRoute(window.location.hash));
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (nextRoute: AppRoute) => {
    window.location.hash = nextRoute;
  };

  return { route, navigate };
};
