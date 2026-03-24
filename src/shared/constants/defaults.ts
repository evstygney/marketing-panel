import { Channel, ProjectState } from "entities/types";
import { DEFAULT_CHANNELS } from "./channels";

const createEmptyChannel = (name: string): Channel => ({
  name,
  impressions: 0,
  clicks: 0,
  cost: 0,
  leads: 0,
  sales: 0,
  revenue: 0,
});

export const createEmptyChannels = (): Channel[] => DEFAULT_CHANNELS.map(createEmptyChannel);

export const demoState: ProjectState = {
  periodCurrent: [
    { name: "SEO", impressions: 82000, clicks: 5900, cost: 950, leads: 270, sales: 54, revenue: 9400 },
    { name: "PPC", impressions: 145000, clicks: 6900, cost: 5200, leads: 310, sales: 68, revenue: 13800 },
    { name: "Paid Social", impressions: 201000, clicks: 7300, cost: 4700, leads: 250, sales: 41, revenue: 7900 },
    { name: "Email", impressions: 42000, clicks: 3300, cost: 350, leads: 160, sales: 38, revenue: 6100 },
    { name: "Telegram", impressions: 38000, clicks: 1800, cost: 600, leads: 78, sales: 19, revenue: 2900 },
    { name: "Content", impressions: 51000, clicks: 2200, cost: 1100, leads: 90, sales: 17, revenue: 2400 },
    { name: "Referral", impressions: 19000, clicks: 980, cost: 420, leads: 66, sales: 16, revenue: 2500 },
    { name: "Other", impressions: 9000, clicks: 410, cost: 180, leads: 14, sales: 2, revenue: 250 },
  ],
  periodPrevious: [
    { name: "SEO", impressions: 76000, clicks: 5600, cost: 900, leads: 255, sales: 49, revenue: 8600 },
    { name: "PPC", impressions: 138000, clicks: 7100, cost: 4700, leads: 330, sales: 72, revenue: 14200 },
    { name: "Paid Social", impressions: 194000, clicks: 7600, cost: 4100, leads: 290, sales: 47, revenue: 8800 },
    { name: "Email", impressions: 39000, clicks: 2800, cost: 320, leads: 130, sales: 31, revenue: 4900 },
    { name: "Telegram", impressions: 26000, clicks: 1200, cost: 450, leads: 54, sales: 13, revenue: 2100 },
    { name: "Content", impressions: 48000, clicks: 2400, cost: 1050, leads: 101, sales: 19, revenue: 2700 },
    { name: "Referral", impressions: 17000, clicks: 850, cost: 390, leads: 52, sales: 13, revenue: 2100 },
    { name: "Other", impressions: 8000, clicks: 380, cost: 150, leads: 11, sales: 1, revenue: 120 },
  ],
  hypotheses: [
    {
      id: "h-1",
      title: "Обновить оффер в PPC-группах с высоким CPC",
      channel: "PPC",
      impact: 5,
      effort: 2,
      priority: 2.5,
      status: "planned",
      comment: "Фокус на группах с просадкой CTR.",
      deadline: "2026-03-31",
    },
    {
      id: "h-2",
      title: "Сократить форму на лендинге Paid Social",
      channel: "Paid Social",
      impact: 4,
      effort: 2,
      priority: 2,
      status: "in_progress",
      comment: "Проверить рост CR click->lead.",
      deadline: "2026-04-03",
    },
    {
      id: "h-3",
      title: "Масштабировать Email-сегмент с ROAS > 10",
      channel: "Email",
      impact: 3,
      effort: 1,
      priority: 3,
      status: "new",
    },
  ],
  settings: {
    onboardingCompleted: false,
    demoMode: true,
  },
};

export const emptyState: ProjectState = {
  periodCurrent: createEmptyChannels(),
  periodPrevious: createEmptyChannels(),
  hypotheses: [],
  settings: {
    onboardingCompleted: false,
    demoMode: false,
  },
};
