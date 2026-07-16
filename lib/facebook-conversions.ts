import "server-only";
import crypto from "node:crypto";

const GRAPH_API_VERSION = "v21.0";

function sha256(value: string) {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

function toE164Bangladesh(phone: string) {
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.startsWith("880")) return digits;
  return `880${digits.replace(/^0/, "")}`;
}

export type FacebookPurchaseEvent = {
  eventId: string;
  value: number;
  currency?: string;
  phone: string;
  eventSourceUrl: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
};

export type FacebookCredentials = {
  pixelId: string;
  accessToken: string;
};

export async function sendFacebookPurchaseEvent(
  event: FacebookPurchaseEvent,
  creds: FacebookCredentials
): Promise<void> {
  const user_data: Record<string, unknown> = {
    ph: [sha256(toE164Bangladesh(event.phone))],
  };
  if (event.clientIp) user_data.client_ip_address = event.clientIp;
  if (event.userAgent) user_data.client_user_agent = event.userAgent;
  if (event.fbp) user_data.fbp = event.fbp;
  if (event.fbc) user_data.fbc = event.fbc;

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        action_source: "website",
        event_source_url: event.eventSourceUrl,
        user_data,
        custom_data: {
          value: event.value,
          currency: event.currency ?? "BDT",
        },
      },
    ],
  };

  try {
    await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${creds.pixelId}/events?access_token=${encodeURIComponent(
        creds.accessToken
      )}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
  } catch {
    // Best-effort — a failed conversion ping must never block order creation.
  }
}
