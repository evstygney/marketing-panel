export type UtmForm = {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
};

const normalize = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-");

export const buildUtmLink = (form: UtmForm): string => {
  const base = form.baseUrl.trim();
  if (!base) {
    return "";
  }

  try {
    const url = new URL(base);
    const params = [
      ["utm_source", form.source],
      ["utm_medium", form.medium],
      ["utm_campaign", form.campaign],
      ["utm_content", form.content],
      ["utm_term", form.term],
    ] as const;

    params.forEach(([key, value]) => {
      if (value.trim()) {
        url.searchParams.set(key, normalize(value));
      }
    });

    return url.toString();
  } catch {
    return "";
  }
};

export const utmPresets = [
  { name: "Meta Ads", source: "meta", medium: "paid-social" },
  { name: "Google Ads", source: "google", medium: "cpc" },
  { name: "Telegram", source: "telegram", medium: "social" },
  { name: "Email", source: "email", medium: "newsletter" },
  { name: "Influencer", source: "influencer", medium: "partnership" },
];
