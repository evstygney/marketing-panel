export const DEFAULT_CHANNELS = [
  "SEO",
  "PPC",
  "Paid Social",
  "Email",
  "Telegram",
  "Content",
  "Referral",
  "Other",
] as const;

export const HYPOTHESIS_STATUSES = [
  { value: "new", label: "Новая" },
  { value: "planned", label: "Запланирована" },
  { value: "in_progress", label: "В работе" },
  { value: "done", label: "Сделано" },
  { value: "rejected", label: "Отклонена" },
] as const;
