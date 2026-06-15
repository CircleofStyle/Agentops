import { getMonetizationMetrics, type MonetizationMetrics } from "@/lib/monetization-metrics";
import { getAudienceId, getResendClient } from "@/lib/resend";
import { exportSubscribers } from "@/lib/subscribers";

export type SubscriberMetrics = {
  subscribers: {
    pending: number;
    confirmed: number;
    total: number;
  };
  attribution: {
    bySource: Record<string, number>;
  };
  monetization: MonetizationMetrics;
  resend: {
    configured: boolean;
    audienceTotal: number | null;
  };
  timestamp: string;
};

export async function getSubscriberMetrics(): Promise<SubscriberMetrics> {
  const subscribers = await exportSubscribers();
  const pending = subscribers.filter((s) => s.status === "pending").length;
  const confirmed = subscribers.filter((s) => s.status === "confirmed").length;

  const bySource: Record<string, number> = {};
  for (const subscriber of subscribers) {
    if (!subscriber.utm_source) continue;
    bySource[subscriber.utm_source] = (bySource[subscriber.utm_source] ?? 0) + 1;
  }

  const resend = getResendClient();
  const audienceId = getAudienceId();
  let audienceTotal: number | null = null;

  if (resend && audienceId) {
    const { data, error } = await resend.contacts.list({ audienceId });
    if (!error && data?.data) {
      audienceTotal = data.data.length;
    }
  }

  const monetization = await getMonetizationMetrics();

  return {
    subscribers: {
      pending,
      confirmed,
      total: pending + confirmed,
    },
    attribution: { bySource },
    monetization,
    resend: {
      configured: Boolean(resend && audienceId),
      audienceTotal,
    },
    timestamp: new Date().toISOString(),
  };
}
