export const toNumber = (value: string | number): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const normalized = value.replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const safeDivide = (numerator: number, denominator: number): number =>
  denominator > 0 ? numerator / denominator : 0;

export const formatNumber = (value: number, fractionDigits = 0): string =>
  new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);

export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(value);

export const formatPercent = (value: number, fractionDigits = 1): string =>
  `${formatNumber(value * 100, fractionDigits)}%`;

export const formatDelta = (value: number): string => {
  if (!Number.isFinite(value) || value === 0) {
    return "0%";
  }

  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value, 1)}%`;
};
